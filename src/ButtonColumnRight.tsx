import './ButtonColumnRight.css';
import ImagePen from './assets/img_button_pen.png';

function ButtonColumnRight() {
    return(
        <div className="buttonColumnRight backgroundDark">
            <input type="image" className="buttonLarge roundStrongTopLeft borderTop borderHorizontal" src={ImagePen} />
            <input type="image" className="buttonLarge borderTop borderHorizontal borderBot" src={ImagePen} />
            <input type="image" className="buttonLarge roundStrongBotLeft borderBot borderHorizontal" src={ImagePen} />
        </div>
    );
}

export default ButtonColumnRight