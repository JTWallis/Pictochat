import './VirtualKeyboardOrtholinear.css'
import VirtualKeyboardButton from '../keyboardbutton/VirtualKeyboardButton';
import type { CharmapBaseSingle } from '@models/charmaps/base/CharmapBaseSingle';
import { ThemeContext } from '@contexts/ThemeContext';
import { useContext } from 'react';

type VirtualKeyboardOrtholinearProps = {
    charmap: CharmapBaseSingle;
    onButtonMouseDown: (e: React.MouseEvent<HTMLInputElement>) => void;
    onButtonClick: (e: React.MouseEvent<HTMLInputElement>) => void;
}

function VirtualKeyboardOrtholinear(props: VirtualKeyboardOrtholinearProps) {

    const theme = useContext(ThemeContext);

    function getButtonContainers() {
        const rows: any = [];
        const rowRangeIndices = props.charmap.getRowRangeIndices();
        const representations = props.charmap.getCharRepresentations();

        for (let k = 0; k < rowRangeIndices.length; k++) {
            for (let i = rowRangeIndices[k].x; i <= rowRangeIndices[k].y; i++) {

                const value = representations[i].value;
                let buttonClass;
                let bgColor;
                let containerClass = "";
                let isRightEdge = false;
                if(value === "SPACE" || value === "BACK" || value === "ENTER") {
                    buttonClass = "keyboardImageButtonSpecial";
                    bgColor = theme.button_special;
                    isRightEdge = true;

                    if(value === "ENTER") containerClass += " keyboardColSpanTwo"
                } else if(props.charmap.isGridCellSpecial(i)) {
                    buttonClass = "keyboardImageButtonSpecial";
                    bgColor = theme.button_special;
                } else {
                    buttonClass = "keyboardImageButtonRegular";
                    bgColor = theme.button;
                }

                if(i === rowRangeIndices[k].x) containerClass += " keyboardMarginLeft";
                else if(isRightEdge || (i === rowRangeIndices[k].y && rowRangeIndices[k].y - rowRangeIndices[k].x === 11)) containerClass += " keyboardMarginRight";

                rows.push(
                    <div
                        key={"Keyboard-Button-Container-" + i}
                        className={"keyboardImageButtonContainer keyboardImageButtonOrtholinearContainer" + containerClass}
                        style={{ backgroundColor: bgColor }}
                    >
                        <VirtualKeyboardButton
                            key={"Keyboard-Button-" + i}
                            className={buttonClass}
                            value={representations[i].value}
                            src={representations[i].src}
                            onMouseDown={props.onButtonMouseDown}
                            onClick={props.onButtonClick}
                        />
                    </div>
                );
            }
        }

        return rows;
    }

    function getIgnoreGridCellContainers() {
        const ignoreGridCellContainers: any[] = [];

        props.charmap.getIgnoreGridCellIndices().forEach((e, index) => {
            ignoreGridCellContainers.push(
                <div
                    key={"Keyboard-Button-Container-Ignore-" + index}
                    style={{ gridRow: e.x, gridColumn: e.y }}
                />
            )
        });

        return ignoreGridCellContainers;
    }

    return (
        <>
            <div className="keyboardOrtholinearContainer">
                {getIgnoreGridCellContainers()}
                {getButtonContainers()}
            </div>
        </>
    );
}

export default VirtualKeyboardOrtholinear;