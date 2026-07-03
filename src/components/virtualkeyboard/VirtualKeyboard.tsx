import './VirtualKeyboard.css'
import { useContext, useEffect, type Ref } from 'react';
import VirtualKeyboardOrtholinear from './ortholinear/VirtualKeyboardOrtholinear';
import VirtualKeyboardStaggered from './staggered/VirtualKeyboardStaggered';
import imgBorder from '@assets/img_keyboard_border.png';
import { ThemeContext } from '@contexts/ThemeContext';
import type { FloatingKeyHandle } from '@components/floatingkey/FloatingKey';
import type { CharmapBase } from '@models/charmaps/base/CharmapBase';
import type { CharmapBaseDouble } from '@models/charmaps/base/CharmapBaseDouble';
import type { CharmapBaseSingle } from '@models/charmaps/base/CharmapBaseSingle';

export type VirtualKeyboardProps = {
    vkeyboardStaggeredRef: any,
    floatingKeyRef: React.RefObject<FloatingKeyHandle | null>,
    onKeyboardButtonClick: (e: React.MouseEvent<HTMLInputElement>) => void,
    charmap: CharmapBase,
    charmapState: number
}

/**
 * The VirtualKeyboard is an onscreen keyboard, that is either of subtype
 * {@link VirtualKeyboardStaggered} or {@link VirtualKeyboardOrtholinear}.
 * Based on subtype, it displays a set of {@link VirtualKeyboardButton} in a grid or QWERTY-layout.
 * It is responsible for creating a {@link FloatingKey} through drag&drop of a char,
 * or emulating a keydown-event (and in turn draw a new char onto the {@link CanvasSketch}).
 */
function VirtualKeyboard(props: VirtualKeyboardProps) {
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

    function handleButtonMouseDown(event: React.MouseEvent<HTMLInputElement>) {
        if (mouseDown) return;
        // TODO: Find better check for special button. Classname too brittle. Maybe there is a good metadata HTML property?
        if(event.currentTarget.className.toLowerCase().includes("special")) return;
        setMouseDown(true);

        const targetType = event.currentTarget.nodeName;

        if (targetType === "INPUT") {
            props.floatingKeyRef.current!.setImg(event.currentTarget.src, event.currentTarget.value);
        } else if (targetType === "BUTTON") {
            props.floatingKeyRef.current!.setChar(event.currentTarget.value);
        }
    }

    function window_mouseup() {
        if (!mouseDown) return;
        setMouseDown(false);
        if(!mouseDragged) return;
        mouseDragged = false;
        props.floatingKeyRef.current!.apply();
    }

    function window_mousemove(event: MouseEvent) {
        if (!mouseDown) return;
        mouseDragged = true;
        props.floatingKeyRef.current!.setPos(event.pageX, event.pageY);
    }

    function handleOnClick(e: React.MouseEvent<HTMLInputElement>) {
        props.onKeyboardButtonClick(e);
        e.currentTarget.blur();
    }

    return (
        <>
            <div className="keyboardContainer" style={{backgroundColor: theme.background_secondary}}>
                <input type="image" src={imgBorder} className="keyboardBorder" />
                <div className="keyboardMaskedContainer">
                    {
                    props.charmapState > 0 ?
                        <VirtualKeyboardOrtholinear
                            charmap={props.charmap as CharmapBaseSingle}
                            onButtonMouseDown={handleButtonMouseDown}
                            onButtonClick={handleOnClick}
                        />
                        :
                        <VirtualKeyboardStaggered
                            ref={props.vkeyboardStaggeredRef}
                            charmap={props.charmap as CharmapBaseDouble}
                            onButtonMouseDown={handleButtonMouseDown}
                            onButtonClick={handleOnClick}
                        />
                    }
                </div>
            </div>
        </>
    );
}

export default VirtualKeyboard;