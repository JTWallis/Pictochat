import './ButtonColumnRight.css';
import ImageSend from './assets/img_button_large_send.png';
import ImageCopy from './assets/img_button_large_copy.png';
import ImageDiscard from './assets/img_button_large_discard.png';

function ButtonColumnRight( {canvasRef}: any ) {

    return(
        <div className="buttonColumnRight backgroundDark">
            <input type="image" className="buttonLarge buttonSend" src={ImageSend} onClick={() => canvasRef.current.sendMessage()} />
            <input type="image" className="buttonLarge buttonCopy" src={ImageCopy} onClick={() => canvasRef.current.copyMessage()} />
            <input type="image" className="buttonLarge buttonDiscard" src={ImageDiscard} onClick={() => canvasRef.current.discardMessage()} />
        </div>
    );
}

export default ButtonColumnRight