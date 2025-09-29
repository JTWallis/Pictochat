import './VirtualKeyboard.css'
import { useEffect, useState } from 'react';
import VirtualKeyboardOrtholinear from './VirtualKeyboardOrtholinear';
import VirtualKeyboardStaggered from './VirtualKeyboardStaggered';
import imgBorder from './assets/img_keyboard_border.png';


function VirtualKeyboard( {floatingKeyRef, onKeyboardButtonClick, charmap, charmapState}: any) {
    const [mouseDown, setMouseDown] = useState(false);

    useEffect(() => {

        if (mouseDown === true) {
            window.addEventListener("mousemove", window_mousemove);
            window.addEventListener("mouseup", window_mouseup);
        } else {
            window.removeEventListener("mousemove", window_mousemove);
            window.removeEventListener("mouseup", window_mouseup);
        }


        return () => {
            window.removeEventListener("mousemove", window_mousemove);
            window.removeEventListener("mouseup", window_mouseup);
        }
    }, [mouseDown]);


    function handleButtonMouseDown(event: any) {
        if (mouseDown) return;
        setMouseDown(true);

        const targetType = event.target.nodeName;

        if (targetType === "INPUT") {
            floatingKeyRef.current.setImg(event.target.src, event.target.height, event.target.value);
        } else if (targetType === "BUTTON") {
            floatingKeyRef.current.setChar(event.target.value);
        }
    }

    function window_mouseup() {
        if (!mouseDown) return;
        setMouseDown(false);

        floatingKeyRef.current.apply();
    }

    function window_mousemove(event: MouseEvent) {
        if (!mouseDown) return;
        floatingKeyRef.current.setPos(event.pageX, event.pageY);
    }

    function handleOnClick(e: any) {
        onKeyboardButtonClick(e);
        e.currentTarget.blur();
    }

    return (
        <>
            <div className="keyboardContainer">
                <input type="image" src={imgBorder} className="keyboardBorder" />
                <div className="keyboardMaskedContainer">
                    {
                    charmapState > 0 ?
                        <VirtualKeyboardOrtholinear
                            charmap={charmap}
                            onButtonMouseDown={handleButtonMouseDown}
                            onClick={handleOnClick}
                        />
                        :
                        <VirtualKeyboardStaggered
                            charmap={charmap}
                            onButtonMouseDown={handleButtonMouseDown}
                            onClick={handleOnClick}
                        />
                    }
                </div>
            </div>
        </>
    );
}

export default VirtualKeyboard;