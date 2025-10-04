import './MessageDisplay.css';
import Canvas from "./Canvas";


function MessageDisplay({message, findCharRepFromValue}: any) {

    return (
        <Canvas 
            className={"messageDisplayContainer"}
            message={message}
            findCharRepFromValue={findCharRepFromValue}
        />
    )
}

export default MessageDisplay;