import './ButtonColumnLeft.css'

import ImgScrollUp from './assets/img_button_toolbox_scroll_up.png';
import ImgScrollDown from './assets/img_button_toolbox_scroll_down.png';
import ImagePenDraw from './assets/img_button_toolbox_pen_draw.png';
import ImagePenErase from './assets/img_button_toolbox_pen_erase.png';
import ImagePenBig from './assets/img_button_toolbox_pen_big.png';
import ImagePenSmall from './assets/img_button_toolbox_pen_small.png';
import ImageMapLatin from './assets/img_button_toolbox_charmap_latin.png';
import ImageMapAccent from './assets/img_button_toolbox_charmap_accent.png';
import ImageMapJapan from './assets/img_button_toolbox_charmap_japanese.png';
import ImageMapSpecial from './assets/img_button_toolbox_charmap_special.png';
import ImageMapPicto from './assets/img_button_toolbox_charmap_pictochat.png';

function ButtonColumnLeft( {scrollListRef}: any ) {
    return (
        <div className="buttonColumn">
            <input type="image" className="button" src={ImgScrollUp} onClick={() => scrollListRef.current.scrollUp()}></input>
            <input type="image" className="button marginTop" src={ImgScrollDown} onClick={() => scrollListRef.current.scrollDown()}></input>

            <hr className="borderDotted marginTop marginBot"></hr>

            <input type="image" className="button marginTop" src={ImagePenDraw} />
            <input type="image" className="button marginTop" src={ImagePenErase} ></input>
            <hr className="borderInvisible marginTop marginBot"></hr>
            <input type="image" className="button marginTop" src={ImagePenBig} ></input>
            <input type="image" className="button marginTop marginBot" src={ImagePenSmall} ></input>

            <hr className="borderDotted marginTop marginBot"></hr>

            <input type="image" className="button marginTop" src={ImageMapLatin} ></input>
            <input type="image" className="button marginTop" src={ImageMapAccent}></input>
            <input type="image" className="button marginTop" src={ImageMapJapan}></input>
            <input type="image" className="button marginTop" src={ImageMapSpecial}></input>
            <input type="image" className="button marginTop marginBot" src={ImageMapPicto}></input>
        </div>
    );
}

export default ButtonColumnLeft;