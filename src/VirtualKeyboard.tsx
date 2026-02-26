import './VirtualKeyboard.css'
import { useContext, useEffect } from 'react';
import VirtualKeyboardOrtholinear from './VirtualKeyboardOrtholinear';
import VirtualKeyboardStaggered from './VirtualKeyboardStaggered';
import imgBorder from './assets/img_keyboard_border.png';
import { ThemeContext } from './ThemeContext';


function VirtualKeyboard( {vkeyboardStaggeredRef, floatingKeyRef, onKeyboardButtonClick, charmap, charmapState}: any) {
    let mouseDown = false;
    let mouseDragged = false;

    const theme = useContext(ThemeContext);

    useEffect(() => {
        return () => {
            unbindWindowMouse();
        }
    }, []);

    function bindWindowMouse() {
        window.addEventListener("mousemove", window_mousemove);
        window.addEventListener("mouseup", window_mouseup);
    }

    function unbindWindowMouse() {
        window.removeEventListener("mousemove", window_mousemove);
        window.removeEventListener("mouseup", window_mouseup);
    }

    
    function setMouseDown(isMouseDown: boolean) {
        mouseDown = isMouseDown;
        isMouseDown ? bindWindowMouse() : unbindWindowMouse();
    }

    function handleButtonMouseDown(event: any) {
        if (mouseDown) return;
        // TODO: Find better check for special button. Classname too brittle. Maybe there is a good metadata HTML property?
        if((event.target.className as string).toLowerCase().includes("special")) return;
        setMouseDown(true);

        const targetType = event.target.nodeName;

        if (targetType === "INPUT") {
            floatingKeyRef.current.setImg(event.target.src, event.target.value);
        } else if (targetType === "BUTTON") {
            floatingKeyRef.current.setChar(event.target.value);
        }
    }

    function window_mouseup() {
        if (!mouseDown) return;
        setMouseDown(false);
        if(!mouseDragged) return;
        mouseDragged = false;
        floatingKeyRef.current.apply();
    }

    function window_mousemove(event: MouseEvent) {
        if (!mouseDown) return;
        mouseDragged = true;
        floatingKeyRef.current.setPos(event.pageX, event.pageY);
    }

    function handleOnClick(e: any) {
        onKeyboardButtonClick(e);
        e.currentTarget.blur();
    }

    return (
        <>
            <div className="keyboardContainer" style={{backgroundColor: theme.background_secondary}}>
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
                            vkeyboardStaggeredRef={vkeyboardStaggeredRef}
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