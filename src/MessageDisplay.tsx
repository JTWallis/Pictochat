import './MessageDisplay.css';
import Canvas from "./Canvas";
import { CanvasTypes } from './CanvasAPI';


function MessageDisplay({message, findCharRepFromValue}: any) {

    return (
        <Canvas 
            className={"messageDisplayContainer"}
            canvasType={CanvasTypes.CANVAS_DISPLAY}
            message={message}
            findCharRepFromValue={findCharRepFromValue}
        />
    )
}

export default MessageDisplay;