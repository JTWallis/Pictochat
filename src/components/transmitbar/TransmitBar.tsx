import './TransmitBar.css';
import ImageSend from '@assets/img_button_large_send.png';
import ImageCopy from '@assets/img_button_large_copy.png';
import ImageDiscard from '@assets/img_button_large_discard.png';
import type { CanvasSketchHandle } from '@components/message/canvas/CanvasSketch';

type TransmitBarProps = {
    canvasSketchRef: React.RefObject<CanvasSketchHandle | null>;
}

/**
 * The TransmitBar provides buttons to the user, that interact with the {@link CanvasSketch},
 * by delegating functions to copy, discard and send the currently constructed {@link Message}.
 */
function TransmitBar(props: TransmitBarProps ) {

    return(
        <div className="transmitBar backgroundDark">
            <input type="image" className="buttonLarge buttonSend" src={ImageSend} onClick={() => props.canvasSketchRef.current!.sendMessage()} />
            <input type="image" className="buttonLarge buttonCopy" src={ImageCopy} onClick={() => props.canvasSketchRef.current!.copyMessage()} />
            <input type="image" className="buttonLarge buttonDiscard" src={ImageDiscard} onClick={() => props.canvasSketchRef.current!.discardMessage()} />
        </div>
    );
}

export default TransmitBar