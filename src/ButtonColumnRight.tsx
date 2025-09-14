import './ButtonColumnRight.css';
import ImageSend from './assets/img_button_large_send.png';
import ImageCopy from './assets/img_button_large_copy.png';
import ImageDiscard from './assets/img_button_large_discard.png';

function ButtonColumnRight() {
    return(
        <div className="buttonColumnRight backgroundDark">
            <input type="image" className="buttonLarge buttonSend" src={ImageSend} />
            <input type="image" className="buttonLarge buttonCopy" src={ImageCopy} />
            <input type="image" className="buttonLarge buttonDiscard" src={ImageDiscard} />
        </div>
    );
}

export default ButtonColumnRight