import Canvas from './Canvas';
import './MessageSpecial.css';

function MessageSpecial( {message, findCharRepFromValue}: any ) {

    return (
        <Canvas
            className="messageDisplayContainer messageSpecialContainer"
            message={message} 
            findCharRepFromValue={findCharRepFromValue}
            hideName={true}
        />
    )

}

export default MessageSpecial;