import './MessageDisplay.css';
import Canvas from "./Canvas";
import { CanvasTypes } from './CanvasAPI';
import { useContext } from 'react';
import { ThemeContext } from '@contexts/ThemeContext';

const INIT_HEIGHT_PERCENT = 50;

function MessageDisplay({message, findCharRepFromValue}: any) {

    const theme = useContext(ThemeContext);

    return (
        <Canvas 
            backgroundColor={theme.canvas}
            defaultHeightPercent={INIT_HEIGHT_PERCENT}
            canvasType={CanvasTypes.CANVAS_DISPLAY}
            message={message}
            findCharRepFromValue={findCharRepFromValue}
        />
    )
}

export default MessageDisplay;