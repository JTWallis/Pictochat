import './VirtualKeyboardStaggered.css'
import { useContext, useImperativeHandle, useState } from 'react';
import VirtualKeyboardButton from '../keyboardbutton/VirtualKeyboardButton';
import type { CharmapBaseDouble } from '@models/charmaps/base/CharmapBaseDouble';
import type { CharRepresentation } from '@models/charrepresentations/CharRepresentation';
import { ThemeContext } from '@contexts/ThemeContext';

const SPECIAL_CAPS = "CAPS";
const SPECIAL_SHIFT = "SHIFT";

type VirtualKeyboardStaggeredProps = {
    ref: React.Ref<VirtualKeyboardStaggeredHandle>;
    charmap: CharmapBaseDouble;
    onButtonMouseDown: (e: React.MouseEvent<HTMLInputElement>) => void;
    onButtonClick: (e: React.MouseEvent<HTMLInputElement>) => void;
}

export type VirtualKeyboardStaggeredHandle = {
    onShiftDown: () => void;
    onShiftUp: () => void;
    onCapsDown: () => void;
}

function VirtualKeyboardStaggered(props: VirtualKeyboardStaggeredProps) {

    useImperativeHandle(props.ref, () => ({
        onShiftDown(): void {
            setIsShift(true);
        },

        onShiftUp(): void {
            setIsShift(false);
        },

        onCapsDown(): void {
            setIsUpper(!isUpper);
        }
    }));

    const theme = useContext(ThemeContext);

    const [isShift, setIsShift] = useState(false);
    const [isUpper, setIsUpper] = useState(false);

    function handleOnVirtualKeyboardButtonClick(e: React.MouseEvent<HTMLInputElement>) {
        const value = (e.target as HTMLInputElement).value;
        switch (value) {
            case SPECIAL_CAPS:
                setIsShift(false);
                setIsUpper(!isUpper);
                break;
            case SPECIAL_SHIFT:
                setIsShift(!isShift);
                break;
            default:
                setIsShift(false);
                props.onButtonClick(e);
                break;
        }
    }

    function getButtonContainers() {
        const rowRangeIndices = props.charmap.getRowRangeIndices();
        const representations = props.charmap.getCharRepresentations();
        const rows: any[] = [];

        function getRep(index: number): CharRepresentation {
            const lower = representations[index].lower;
            const upper = representations[index].upper;

            if(upper.value.length === 0) return lower;
            if(isUpper) return upper;

            if(isShift && props.charmap.isCharShiftIncluded(lower.value)) {
                return upper;
            }

            return lower;
        }

        function getValue(index: number): string {
            return getRep(index).value;
        }

        function getSrc(index: number): string {
            return getRep(index).src;
        }

        for (let k = 0; k < rowRangeIndices.length; k++) {
            rows.push([]);

            for (let i = rowRangeIndices[k].x; i <= rowRangeIndices[k].y; i++) {
                let buttonClass: string;
                let bgColor = theme.button_special;
                let imageClass = "keyboardImageButtonSpecial";

                switch (representations[i].lower.value) {
                    case SPECIAL_CAPS:
                        buttonClass = "keyboardImageButtonStaggeredCaps";
                        break;
                    case "BACK":
                        buttonClass = "keyboardImageButtonStaggeredBack";
                        break;
                    case SPECIAL_SHIFT:
                        buttonClass = "keyboardImageButtonStaggeredShift";
                        break;
                    case "ENTER":
                        buttonClass = "keyboardImageButtonStaggeredEnter";
                        break;
                    case "SPACE":
                        buttonClass = "keyboardImageButtonStaggeredSpace";
                        break;
                    default:
                        buttonClass = "";
                        bgColor = theme.button;
                        imageClass = "keyboardImageButtonRegular";
                        break;
                }

                rows[k].push(
                    <div
                        key={"Keyboard-Button-Container-" + i}
                        className={"keyboardImageButtonContainer keyboardImageButtonStaggeredContainer " + buttonClass}
                        style={{ backgroundColor: bgColor }}
                    >
                        <VirtualKeyboardButton
                            key={"Keyboard-Button-" + i}
                            className={imageClass}
                            value={getValue(i)}
                            src={getSrc(i)}
                            onMouseDown={props.onButtonMouseDown}
                            onClick={handleOnVirtualKeyboardButtonClick}
                        />
                    </div>

                );
            }
        }

        return rows.map((row: any, index: number) =>
            <div className={"keyboardStaggeredRow" + (index + 1)} key={"Keyboard-Row-" + index}>
                {row}
            </div>
        );
    }

    return (
        <>
            <div className="keyboardStaggeredContainer">
                {getButtonContainers()}
            </div>
        </>
    );
}

export default VirtualKeyboardStaggered;