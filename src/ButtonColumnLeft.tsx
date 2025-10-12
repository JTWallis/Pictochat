import './ButtonColumnLeft.css'

import ImgScrollUp from './assets/img_button_toolbox_scroll_up.png';
import ImgScrollDown from './assets/img_button_toolbox_scroll_down.png';
import ImagePenDraw from './assets/img_button_toolbox_pen_draw.png';
import ImagePenErase from './assets/img_button_toolbox_pen_erase.png';
import ImagePenBig from './assets/img_button_toolbox_pen_big.png';
import ImagePenSmall from './assets/img_button_toolbox_pen_small.png';
import ImageMapLatin from './assets/img_button_toolbox_charmap_latin.png';
import ImageMapAccent from './assets/img_button_toolbox_charmap_accent.png';
import ImageMapJapan from './assets/img_button_toolbox_charmap_japanese.png';
import ImageMapSpecial from './assets/img_button_toolbox_charmap_special.png';
import ImageMapPicto from './assets/img_button_toolbox_charmap_pictochat.png';
import { CharmapStates } from './CharmapStates';
import { useState, type CSSProperties } from 'react';

const PenModes = {
    PEN_MODE_WRITE: 0,
    PEN_MODE_ERASE: 1
};

const PenSizes = {
    PEN_SIZE_SMALL: 0,
    PEN_SIZE_BIG: 1
};

const Charmaps = {
    CHARMAP_LATIN: 0,
    CHARMAP_ACCENT: 1,
    CHARMAP_JAPANESE: 2,
    CHARMAP_SPECIAL: 3,
    CHARMAP_PICTO: 4
};

const defaultBackgroundColor = "#a2a2a2";

function ButtonColumnLeft( {userColor, scrollListRef, canvasSketchRef, onCharmapButtonClick}: any ) {

    const [selectionPenMode, setSelectionPenMode] = useState(PenModes.PEN_MODE_WRITE);
    const [selectionPenSize, setSelectionPenSize] = useState(PenSizes.PEN_SIZE_BIG);
    const [selectionCharmap, setSelectionCharmap] = useState(Charmaps.CHARMAP_LATIN);

    const styleBackgroundSelect = {
        backgroundColor: userColor
    } as CSSProperties;

    const styleBackgroundDefault = {
        backgroundColor: defaultBackgroundColor
    } as CSSProperties;

    function getBackgroundPenMode(state: number): CSSProperties {
        return state === selectionPenMode ? styleBackgroundSelect : styleBackgroundDefault;
    }

    function getBackgroundPenSize(state: number): CSSProperties {
        return state === selectionPenSize ? styleBackgroundSelect : styleBackgroundDefault;
    }

    function getBackgroundCharmap(state: number): CSSProperties {
        return state === selectionCharmap ? styleBackgroundSelect : styleBackgroundDefault;
    }

    return (
        <div className="buttonColumn">

            {/* ScrollButtons */}

            <div
                className="buttonContainer pixelated maskFull"
                style={styleBackgroundDefault}
            >
                <input type="image" className="button" src={ImgScrollUp} onClick={() => scrollListRef.current.scrollUp()} />
            </div>

            <div
                className="buttonContainer pixelated marginTop maskFull"
                style={styleBackgroundDefault}
            >
                <input type="image" className="button" src={ImgScrollDown} onClick={() => scrollListRef.current.scrollDown()} />
            </div>


            {/* PenModes */}

            <hr className="borderDotted marginTop marginBot"></hr>

            <div 
                className={"buttonContainer pixelated marginTop maskFull "}
                style={getBackgroundPenMode(PenModes.PEN_MODE_WRITE)}
            >
                <input 
                    type="image"
                    className="button"
                    src={ImagePenDraw}
                    onClick={() => {
                        canvasSketchRef.current.usePenDraw()
                    }}
                />
            </div>

            <div 
                className="buttonContainer pixelated marginTop maskFull"
                style={getBackgroundPenMode(PenModes.PEN_MODE_ERASE)}
            >
                <input
                    type="image"
                    className="button"
                    src={ImagePenErase}
                    onClick={() => {
                        canvasSketchRef.current.usePenErase()}
                    }
                />
            </div>


            {/* PenSizes */}
            
            <hr className="borderInvisible marginTop marginBot"></hr>
            
            <div
                className="buttonContainer pixelated marginTop maskFull"
                style={getBackgroundPenSize(PenSizes.PEN_SIZE_BIG)}
            >
                <input
                    type="image"
                    className="button"
                    src={ImagePenBig}
                    onClick={() => {
                        canvasSketchRef.current.usePenBig()
                    }}
                />
            </div>

            <div
                className="buttonContainer pixelated marginTop marginBot maskFull"
                style={getBackgroundPenSize(PenSizes.PEN_SIZE_SMALL)}
            >
                <input
                    type="image"
                    className="button"
                    src={ImagePenSmall}
                    onClick={() => {
                        canvasSketchRef.current.usePenSmall()
                    }}
                />
            </div>


            {/* Charmaps */}

            <hr className="borderDotted marginTop marginBot"></hr>

            <div
                className="buttonContainer pixelated marginTop maskRounded"
                style={getBackgroundCharmap(Charmaps.CHARMAP_LATIN)}
            >
                <input
                    type="image"
                    className="button"
                    src={ImageMapLatin} onClick={() => {
                        onCharmapButtonClick(CharmapStates.LATIN)
                    }}
                />
            </div>
            
            <div
                className="buttonContainer pixelated marginTop maskRounded"
                style={getBackgroundCharmap(Charmaps.CHARMAP_ACCENT)}
            >
                <input
                    type="image"
                    className="button"
                    src={ImageMapAccent} onClick={() => {
                        onCharmapButtonClick(CharmapStates.ACCENT)
                    }}
                />
            </div>
            
            <div
                className="buttonContainer pixelated marginTop maskRounded"
                style={getBackgroundCharmap(Charmaps.CHARMAP_JAPANESE)}
            >
                <input
                    type="image"
                    className="button"
                    src={ImageMapJapan}
                    onClick={() => {
                        onCharmapButtonClick(CharmapStates.JAPANESE_HIRAGANA)
                    }}
                />
            </div>

            <div
                className="buttonContainer pixelated marginTop maskRounded"
                style={getBackgroundCharmap(Charmaps.CHARMAP_SPECIAL)}
            >
                <input
                    type="image"
                    className="button"
                    src={ImageMapSpecial}
                    onClick={() => {
                        onCharmapButtonClick(CharmapStates.SPECIAL)
                    }}
                />
            </div>

            <div
                className="buttonContainer pixelated marginTop marginBot maskRounded"
                style={getBackgroundCharmap(Charmaps.CHARMAP_PICTO)}
            >
                <input
                    type="image"
                    className="button"
                    src={ImageMapPicto}
                    onClick={() => {
                        onCharmapButtonClick(CharmapStates.PICTO)
                    }}
                />
            </div>
        
        </div>
    );
}

export default ButtonColumnLeft;