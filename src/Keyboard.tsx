import { useEffect, useState } from 'react';
import ImgPen from './assets/img_button_pen.png'
import './Keyboard.css'

const keys = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=",
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "BACKSPACE",
    "CAPS", "a", "s", "d", "f", "g", "h", "j", "k", "l", "ENTER",
    "SHIFT", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
    ";", "´", "SPACE", "[", "]"
];

function createRowRange(_start: string, _end: string) {
    return {
        start: keys.indexOf(_start),
        end: keys.indexOf(_end)
    };
}

const rowOneIndexRange = createRowRange("1", "=");
const rowTwoIndexRange = createRowRange("q", "BACKSPACE");
const rowThreeIndexRange = createRowRange("CAPS", "ENTER");
const rowFourIndexRange = createRowRange("SHIFT", "/");
const rowFiveIndexRange = createRowRange(";", "]");

const rowIndices = [rowOneIndexRange, rowTwoIndexRange, rowThreeIndexRange, rowFourIndexRange, rowFiveIndexRange];

function Keyboard(props: any) {
    const rows: any = [];

    const [buttonTarget, setButtonTarget] = useState<HTMLButtonElement | null>(null);
    const [elem, setElem] = useState<HTMLElement | null>(null);
    const [mouseDown, setMouseDown] = useState(false);


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
        setButtonTarget(event.target);

        if(event.target.value === "BACKSPACE")
            props.floatingKeyRef.current.setImg(ImgPen, 20);
        else
            props.floatingKeyRef.current.setChar(event.target.value);
    }

    function window_mouseup() {
        if(!mouseDown) return;
        setMouseDown(false);

        props.floatingKeyRef.current.apply();
        console.log("MOUSEUP");

        // Call function of Canvas with position and value.
    }

    function window_mousemove(event: MouseEvent) {
        if(!mouseDown) return;
        props.floatingKeyRef.current.setPos(event.pageX, event.pageY);
    }

    for (let k = 0; k < rowIndices.length; k++) {
        for (let i = rowIndices[k].start; i <= rowIndices[k].end; i++) {
            let span = 1;

            if (keys[i] === "BACKSPACE" || keys[i] === "CAPS") span = 2;
            else if (keys[i] === "SHIFT" || keys[i] === "ENTER") span = 3;
            else if (keys[i] === "SPACE") span = 5;

            rows.push(
                <button
                    key={"Keyboard-Button-" + i}
                    style={{ gridRow: k + 1, gridColumnEnd: "span " + span }}
                    value={keys[i]}
                    onMouseDown={button_mousedown}
                    onClick={e => {
                        props.onKeyboardButtonClick(keys[i]);
                        e.currentTarget.blur();
                    }}
                >
                    {keys[i]}
                </button>
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