import './ButtonColumnLeft.css'

import ImagePen from './assets/img_button_pen.png';

function ButtonColumnLeft( {scrollListRef}: any ) {
    return (
        <div className="buttonColumn">
            <button className="button marginTop borderBot" onClick={() => scrollListRef.current.scrollPrev()}></button>
            <button className="button marginTop borderTop" onClick={() => scrollListRef.current.scrollNext()}></button>

            <hr className="borderDotted marginTop marginBot"></hr>

            <input type="image" className="button marginTop" src={ImagePen} />
            <button className="button marginTop"></button>
            <hr className="borderInvisible marginTop marginBot"></hr>
            <button className="button marginTop"></button>
            <button className="button marginTop"></button>

            <hr className="borderDotted marginTop marginBot"></hr>

            <button className="button marginTop borderBot roundTopLeft"></button>
            <button className="button marginTop borderBot roundTopLeft"></button>
            <button className="button marginTop borderBot roundTopLeft"></button>
            <button className="button marginTop borderBot roundTopLeft"></button>
            <button className="button marginTop borderBot roundTopLeft"></button>
        </div>
    );
}

export default ButtonColumnLeft;