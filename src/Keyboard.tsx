import { useEffect, useState } from 'react';
import ImgPen from './assets/img_button_pen.png'
import './Keyboard.css'
import { CharmapLatin } from './CharmapLatin';

const charmapLatin = new CharmapLatin();

let representations = charmapLatin.getCharRepresentations();
let rowRangeIndices = charmapLatin.getRowRangeIndices();

function Keyboard(props: any) {
    const rows: any = [];

    const [buttonTarget, setButtonTarget] = useState<HTMLButtonElement | null>(null);
    const [elem, setElem] = useState<HTMLElement | null>(null);
    const [mouseDown, setMouseDown] = useState(false);
    const [isUpper, setIsUpper] = useState(false);
    const [isShift, setIsShift] = useState(false);


    useEffect(() => {

        if(mouseDown === true) {
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

    function button_mousedown(event: any) {
        if(mouseDown) return;
        setMouseDown(true);
        
        const targetType = event.target.nodeName;

        if(targetType === "INPUT") {
            props.floatingKeyRef.current.setImg(event.target.src, event.target.height);
        } else if(targetType === "BUTTON") {
            props.floatingKeyRef.current.setChar(event.target.value);
        }
    }

    function window_mouseup() {
        if(!mouseDown) return;
        setMouseDown(false);

        props.floatingKeyRef.current.apply();
    }

    function window_mousemove(event: MouseEvent) {
        if(!mouseDown) return;
        props.floatingKeyRef.current.setPos(event.pageX, event.pageY);
    }

    for (let k = 0; k < rowRangeIndices.length; k++) {
        for (let i = rowRangeIndices[k].x; i <= rowRangeIndices[k].y; i++) {
            let span = 1;

            let isSpecial = false;

            if (representations[i].valueLower === "BACK" || representations[i].valueLower === "CAPS") {
                span = 2;
                isSpecial = true;
            } else if (representations[i].valueLower === "SHIFT" || representations[i].valueLower === "ENTER") {
                span = 3;
                isSpecial = true;
            } else if (representations[i].valueLower === "SPACE") {
                span = 5;
                isSpecial = true;
            }

            rows.push(
                <input
                    type="image"
                    src={isUpper ? representations[i].srcUpper : representations[i].srcLower}
                    key={"Keyboard-Button-" + i}
                    style={{ gridRow: k + 1, gridColumnEnd: "span " + span }}
                    className={"imageButton " + (isSpecial ? "keySpecial" : "imageInvert") }
                    onMouseDown={button_mousedown}
                    onClick={e => {
                        props.onKeyboardButtonClick(representations[i]);
                        e.currentTarget.blur();
                    }}
                />
            );
        }
    }


    return (
        <>
            <div className="keyboard">

                {rows}
            </div>
        </>
    );
}

export default Keyboard;