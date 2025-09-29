import './VirtualKeyboardOrtholinear.css'
import VirtualKeyboardButton from './VirtualKeyboardButton';
import type { CharmapBaseSingle } from './CharmapBaseSingle';

function VirtualKeyboardOrtholinear( {charmap, onButtonMouseDown, onClick}: any) {

    function getButtonContainers() {
        const rows: any = [];
        const rowRangeIndices = (charmap as CharmapBaseSingle).getRowRangeIndices();
        const representations = (charmap as CharmapBaseSingle).getCharRepresentations();

        for (let k = 0; k < rowRangeIndices.length; k++) {
            for (let i = rowRangeIndices[k].x; i <= rowRangeIndices[k].y; i++) {

                const value = representations[i].value;
                let buttonClass;
                let containerClass = "";
                let isRightEdge = false;
                if(value === "SPACE" || value === "BACK" || value === "ENTER") {
                    buttonClass = "keyboardImageButtonSpecial";
                    isRightEdge = true;

                    if(value === "ENTER") containerClass += " keyboardColSpanTwo"
                } else if((charmap as CharmapBaseSingle).isGridCellSpecial(i)) {
                    buttonClass = "keyboardImageButtonSpecial";
                } else {
                    buttonClass = "keyboardImageButtonRegular";
                }

                if(i === rowRangeIndices[k].x) containerClass += " keyboardMarginLeft";
                else if(isRightEdge || (i === rowRangeIndices[k].y && rowRangeIndices[k].y - rowRangeIndices[k].x === 11)) containerClass += " keyboardMarginRight";

                rows.push(
                    <div key={"Keyboard-Button-Container-" + i} className={"keyboardImageButtonContainer keyboardImageButtonOrtholinearContainer" + containerClass}>
                        <VirtualKeyboardButton
                            key={"Keyboard-Button-" + i}
                            className={buttonClass}
                            value={representations[i].value}
                            src={representations[i].src}
                            handleButtonMouseDown={onButtonMouseDown}
                            handleOnClick={onClick}
                        />
                    </div>
                );
            }
        }

        return rows;
    }

    function getIgnoreGridCellContainers() {
        const ignoreGridCellContainers: any[] = [];

        (charmap as CharmapBaseSingle).getIgnoreGridCellIndices().forEach((e, index) => {
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