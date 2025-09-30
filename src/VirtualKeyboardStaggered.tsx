import './VirtualKeyboardStaggered.css'
import { useState } from 'react';
import VirtualKeyboardButton from './VirtualKeyboardButton';
import type { CharmapBaseDouble } from './CharmapBaseDouble';

function VirtualKeyboardStaggered({ charmap, onButtonMouseDown, onClick }: any) {

    const [isShift, setIsShift] = useState(false);
    const [isUpper, setIsUpper] = useState(false);

    function getButtonContainers() {
        const rowRangeIndices = (charmap as CharmapBaseDouble).getRowRangeIndices();
        const representations = (charmap as CharmapBaseDouble).getCharRepresentations();
        const rows: any[] = [];

        for (let k = 0; k < rowRangeIndices.length; k++) {
            rows.push([]);

            for (let i = rowRangeIndices[k].x; i <= rowRangeIndices[k].y; i++) {
                let buttonClass: string;
                let imageClass = "keyboardImageButtonSpecial";

                switch (representations[i].lower.value) {
                    case "CAPS":
                        buttonClass = "keyboardImageButtonStaggeredCaps";
                        break;
                    case "BACK":
                        buttonClass = "keyboardImageButtonStaggeredBack";
                        break;
                    case "SHIFT":
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
                            value={isUpper ? representations[i].upper.value : representations[i].lower.value}
                            src={isUpper ? representations[i].upper.src : representations[i].lower.src}
                            handleButtonMouseDown={onButtonMouseDown}
                            handleOnClick={onClick}
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