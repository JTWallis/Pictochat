import './ButtonColumnRight.css';
import ImageSend from '@assets/img_button_large_send.png';
import ImageCopy from '@assets/img_button_large_copy.png';
import ImageDiscard from '@assets/img_button_large_discard.png';
import type { CanvasSketchHandle } from '@components/message/canvas/sketch/CanvasSketch';

type ButtonColumnRightProps = {
    canvasSketchRef: React.RefObject<CanvasSketchHandle | null>;
}

function ButtonColumnRight(props: ButtonColumnRightProps ) {

    return(
        <div className="buttonColumnRight backgroundDark">
            <input type="image" className="buttonLarge buttonSend" src={ImageSend} onClick={() => props.canvasSketchRef.current!.sendMessage()} />
            <input type="image" className="buttonLarge buttonCopy" src={ImageCopy} onClick={() => props.canvasSketchRef.current!.copyMessage()} />
            <input type="image" className="buttonLarge buttonDiscard" src={ImageDiscard} onClick={() => props.canvasSketchRef.current!.discardMessage()} />
        </div>
    );
}

export default ButtonColumnRight