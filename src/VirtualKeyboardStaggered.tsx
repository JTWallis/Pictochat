import './VirtualKeyboardStaggered.css'
import { useImperativeHandle, useState } from 'react';
import VirtualKeyboardButton from './VirtualKeyboardButton';
import type { CharmapBaseDouble } from './CharmapBaseDouble';
import type { CharRepresentation } from './CharRepresentation';

const SPECIAL_CAPS = "CAPS";
const SPECIAL_SHIFT = "SHIFT";

function VirtualKeyboardStaggered({ vkeyboardStaggeredRef, charmap, onButtonMouseDown, onClick }: any) {

    useImperativeHandle(vkeyboardStaggeredRef, () => ({
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

    const [isShift, setIsShift] = useState(false);
    const [isUpper, setIsUpper] = useState(false);

    function handleOnVirtualKeyboardButtonClick(e: MouseEvent) {
        const value = (e.target as HTMLInputElement).value;
        console.log(value);
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
                onClick(e);
                break;
        }
    }

    function getButtonContainers() {
        const rowRangeIndices = (charmap as CharmapBaseDouble).getRowRangeIndices();
        const representations = (charmap as CharmapBaseDouble).getCharRepresentations();
        const rows: any[] = [];

        function getRep(index: number): CharRepresentation {
            const lower = representations[index].lower;
            const upper = representations[index].upper;

            if(upper.value.length === 0) return lower;
            if(isUpper) return upper;

            if(isShift && (charmap as CharmapBaseDouble).isCharShiftIncluded(lower.value)) {
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
                        imageClass = "keyboardImageButtonRegular";
                        break;
                }

                rows[k].push(
                    <div key={"Keyboard-Button-Container-" + i} className={"keyboardImageButtonContainer keyboardImageButtonStaggeredContainer " + buttonClass}>
                        <VirtualKeyboardButton
                            key={"Keyboard-Button-" + i}
                            className={imageClass}
                            value={getValue(i)}
                            src={getSrc(i)}
                            handleButtonMouseDown={onButtonMouseDown}
                            handleOnClick={handleOnVirtualKeyboardButtonClick}
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