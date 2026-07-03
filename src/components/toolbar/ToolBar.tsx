import './ToolBar.css'

import ImgScrollUp from '@assets/img_button_toolbox_scroll_up.png';
import ImgScrollDown from '@assets/img_button_toolbox_scroll_down.png';
import ImagePenDraw from '@assets/img_button_toolbox_pen_draw.png';
import ImagePenErase from '@assets/img_button_toolbox_pen_erase.png';
import ImagePenBig from '@assets/img_button_toolbox_pen_big.png';
import ImagePenSmall from '@assets/img_button_toolbox_pen_small.png';
import ImageMapLatin from '@assets/img_button_toolbox_charmap_latin.png';
import ImageMapAccent from '@assets/img_button_toolbox_charmap_accent.png';
import ImageMapJapan from '@assets/img_button_toolbox_charmap_japanese.png';
import ImageMapSpecial from '@assets/img_button_toolbox_charmap_special.png';
import ImageMapPicto from '@assets/img_button_toolbox_charmap_pictochat.png';
import { CharmapStates } from '@enums/CharmapStates';
import { useContext, useEffect, useState, type CSSProperties } from 'react';
import { getTickRainbowHex, incrementTickRainbow } from '@utils/RainbowHelper';
import { ThemeContext } from '@contexts/ThemeContext';
import type { ScrollListHandle } from '@components/scrolllist/ScrollList';
import type { CanvasSketchHandle } from '@components/message/canvas/sketch/CanvasSketch';

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

type ToolBarProps = {
    userColor: string;
    scrollListRef: React.RefObject<ScrollListHandle | null>;
    canvasSketchRef: React.RefObject<CanvasSketchHandle | null>;
    onCharmapButtonClick: (charmapState: number) => void;
}

function ToolBar(props: ToolBarProps) {

    const theme = useContext(ThemeContext);
    const [selectionPenMode, setSelectionPenMode] = useState(PenModes.PEN_MODE_WRITE);
    const [selectionPenSize, setSelectionPenSize] = useState(PenSizes.PEN_SIZE_BIG);
    const [selectionCharmap, setSelectionCharmap] = useState(Charmaps.CHARMAP_LATIN);
    const [selectionPenModeRainbow, setSelectionPenModeRainbow] = useState(false);
    const [rainbowInterval, setRainbowInterval] = useState<number>(-1);
    const [rainbowHex, setRainbowHex] = useState("#FFF");

    let rainbowTick = 0;

    useEffect(() => {
        if(selectionPenModeRainbow) {
            setRainbowInterval(() => window.setInterval(tickRainbow, 200));
        } else {
            if(rainbowInterval >= 0) clearInterval(rainbowInterval);
            setRainbowInterval(-1);
        }

        return () => {
            if(rainbowInterval >= 0) clearInterval(rainbowInterval);
        }
    }, [selectionPenModeRainbow]);

    const styleBackgroundSelect = {
        backgroundColor: props.userColor
    } as CSSProperties;

    const styleBackgroundDefault = {
        backgroundColor: defaultBackgroundColor
    } as CSSProperties;

    const styleBackgroundRainbow = {
        backgroundColor: rainbowHex
    } as CSSProperties;

    function getBackgroundPenMode(state: number): CSSProperties {
        if(state !== selectionPenMode) return styleBackgroundDefault;
        return selectionPenModeRainbow ? styleBackgroundRainbow : styleBackgroundSelect;
    }

    function getBackgroundPenSize(state: number): CSSProperties {
        return state === selectionPenSize ? styleBackgroundSelect : styleBackgroundDefault;
    }

    function getBackgroundCharmap(state: number): CSSProperties {
        return state === selectionCharmap ? styleBackgroundSelect : styleBackgroundDefault;
    }

    function tickRainbow(): void {
        rainbowTick = incrementTickRainbow(rainbowTick);
        setRainbowHex(getTickRainbowHex(rainbowTick));
    }

    return (
        <div className="buttonColumn" style={{backgroundColor: theme.background_ternary}}>

            {/* ScrollButtons */}

            <div
                className="buttonContainer pixelated maskFull"
                style={styleBackgroundDefault}
            >
                <input type="image" className="button" src={ImgScrollUp} onClick={() => props.scrollListRef.current!.scrollUp()} />
            </div>

            <div
                className="buttonContainer pixelated marginTop maskFull"
                style={styleBackgroundDefault}
            >
                <input type="image" className="button" src={ImgScrollDown} onClick={() => props.scrollListRef.current!.scrollDown()} />
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
                        if(selectionPenMode === PenModes.PEN_MODE_WRITE) {
                            setSelectionPenModeRainbow(!selectionPenModeRainbow);
                        }
                        setSelectionPenMode(PenModes.PEN_MODE_WRITE);
                        props.canvasSketchRef.current!.usePenDraw();
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
                        setSelectionPenMode(PenModes.PEN_MODE_ERASE);
                        props.canvasSketchRef.current!.usePenErase();
                    }}
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
                        setSelectionPenSize(PenSizes.PEN_SIZE_BIG);
                        props.canvasSketchRef.current!.usePenBig();
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
                        setSelectionPenSize(PenSizes.PEN_SIZE_SMALL);
                        props.canvasSketchRef.current!.usePenSmall();
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
                        setSelectionCharmap(Charmaps.CHARMAP_LATIN);
                        props.onCharmapButtonClick(CharmapStates.LATIN);
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
                        setSelectionCharmap(Charmaps.CHARMAP_ACCENT);
                        props.onCharmapButtonClick(CharmapStates.ACCENT);
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
                        setSelectionCharmap(Charmaps.CHARMAP_JAPANESE);
                        props.onCharmapButtonClick(CharmapStates.JAPANESE_HIRAGANA);
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
                        setSelectionCharmap(Charmaps.CHARMAP_SPECIAL);
                        props.onCharmapButtonClick(CharmapStates.SPECIAL);
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
                        setSelectionCharmap(Charmaps.CHARMAP_PICTO);
                        props.onCharmapButtonClick(CharmapStates.PICTO);
                    }}
                />
            </div>
        
        </div>
    );
}

export default ToolBar;