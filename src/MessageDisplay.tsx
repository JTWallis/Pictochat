import './MessageDisplay.css';
import Canvas from "./Canvas";
import { CanvasTypes } from './CanvasAPI';

const INIT_HEIGHT_PERCENT = 50;

function MessageDisplay({message, findCharRepFromValue}: any) {

    return (
        <Canvas 
            defaultHeightPercent={INIT_HEIGHT_PERCENT}
            canvasType={CanvasTypes.CANVAS_DISPLAY}
            message={message}
            findCharRepFromValue={findCharRepFromValue}
        />
    )
}

export default MessageDisplay;