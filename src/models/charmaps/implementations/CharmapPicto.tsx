import { CharmapBaseSingle } from '../base/CharmapBaseSingle';
import { Vector2 } from '../../../Vector2';

import alpha1 from '@assets/CharacterMaps/Latin/img_alpha_1.png';
import alpha2 from '@assets/CharacterMaps/Latin/img_alpha_2.png';
import alpha3 from '@assets/CharacterMaps/Latin/img_alpha_3.png';
import alpha4 from '@assets/CharacterMaps/Latin/img_alpha_4.png';
import alpha5 from '@assets/CharacterMaps/Latin/img_alpha_5.png';
import alpha6 from '@assets/CharacterMaps/Latin/img_alpha_6.png';
import alpha7 from '@assets/CharacterMaps/Latin/img_alpha_7.png';
import alpha8 from '@assets/CharacterMaps/Latin/img_alpha_8.png';
import alpha9 from '@assets/CharacterMaps/Latin/img_alpha_9.png';
import alpha0 from '@assets/CharacterMaps/Latin/img_alpha_0.png';
import equal from '@assets/CharacterMaps/Special/img_special_equal.png';

import emoteHappy from '@assets/CharacterMaps/Picto/img_picto_emote_happy.png';
import emoteAngry from '@assets/CharacterMaps/Picto/img_picto_emote_angry.png';
import emoteSad from '@assets/CharacterMaps/Picto/img_picto_emote_sad.png';
import emoteAnnoyed from '@assets/CharacterMaps/Picto/img_picto_emote_annoyed.png';
import sun from '@assets/CharacterMaps/Picto/img_picto_sun.png';
import cloud from '@assets/CharacterMaps/Picto/img_picto_cloud.png';
import umbrella from '@assets/CharacterMaps/Picto/img_picto_umbrella.png';
import snowman from '@assets/CharacterMaps/Picto/img_picto_snowman.png';
import mail from '@assets/CharacterMaps/Picto/img_picto_mail.png';
import phone from '@assets/CharacterMaps/Picto/img_picto_phone.png';
import alarm from '@assets/CharacterMaps/Picto/img_picto_alarm.png';

import buttonA from '@assets/CharacterMaps/Picto/img_picto_button_a.png';
import buttonB from '@assets/CharacterMaps/Picto/img_picto_button_b.png';
import buttonX from '@assets/CharacterMaps/Picto/img_picto_button_x.png';
import buttonY from '@assets/CharacterMaps/Picto/img_picto_button_y.png';
import buttonL from '@assets/CharacterMaps/Picto/img_picto_button_l.png';
import buttonR from '@assets/CharacterMaps/Picto/img_picto_button_r.png';
import buttonDpad from '@assets/CharacterMaps/Picto/img_picto_button_dpad.png';
import spade from '@assets/CharacterMaps/Picto/img_picto_card_spade.png';
import diamond from '@assets/CharacterMaps/Picto/img_picto_card_diamond.png';
import heart from '@assets/CharacterMaps/Picto/img_picto_card_heart.png';
import club from '@assets/CharacterMaps/Picto/img_picto_card_club.png';

import exclamation from '@assets/CharacterMaps/Picto/img_picto_exclamation.png';
import question from '@assets/CharacterMaps/Picto/img_picto_question.png';
import plus from '@assets/CharacterMaps/Special/img_special_plus.png';
import minus from '@assets/CharacterMaps/Special/img_special_minus.png';
import starHollow from '@assets/CharacterMaps/Picto/img_picto_star_hollow.png';
import circleHollow from '@assets/CharacterMaps/Picto/img_picto_circle_hollow.png';
import diamondHollow from '@assets/CharacterMaps/Picto/img_picto_diamond_hollow.png';
import squareHollow from '@assets/CharacterMaps/Picto/img_picto_square_hollow.png';
import triangleHollow from '@assets/CharacterMaps/Picto/img_picto_triangle_hollow.png';
import triangleInvHollow from '@assets/CharacterMaps/Picto/img_picto_triangle_inverted_hollow.png';
import circleDouble from '@assets/CharacterMaps/Picto/img_picto_circle_double.png';

import arrowRight from '@assets/CharacterMaps/Picto/img_picto_arrow_right.png';
import arrowLeft from '@assets/CharacterMaps/Picto/img_picto_arrow_left.png';
import arrowUp from '@assets/CharacterMaps/Picto/img_picto_arrow_up.png';
import arrowDown from '@assets/CharacterMaps/Picto/img_picto_arrow_down.png';
import star from '@assets/CharacterMaps/Picto/img_picto_star.png';
import circle from '@assets/CharacterMaps/Picto/img_picto_circle.png';
import square from '@assets/CharacterMaps/Picto/img_picto_square.png';
import triangle from '@assets/CharacterMaps/Picto/img_picto_triangle.png';
import triangleInv from '@assets/CharacterMaps/Picto/img_picto_triangle_inverted.png';
import cross from '@assets/CharacterMaps/Picto/img_picto_cross.png';

import backspace from '@assets/CharacterMaps/Misc/img_misc_backspace_small.png';
import enter from '@assets/CharacterMaps/Misc/img_misc_enter_vertical.png';
import space from '@assets/CharacterMaps/Misc/img_misc_space_small.png';

export class CharmapPicto extends CharmapBaseSingle {

    constructor() {
        super();
    }

    protected initRepresentations(): void {
        this.representations = [
            { value: "1", src: alpha1 },
            { value: "2", src: alpha2 },
            { value: "3", src: alpha3 },
            { value: "4", src: alpha4 },
            { value: "5", src: alpha5 },
            { value: "6", src: alpha6 },
            { value: "7", src: alpha7 },
            { value: "8", src: alpha8 },
            { value: "9", src: alpha9 },
            { value: "0", src: alpha0 },
            { value: "=", src: equal },

            { value: "☺", src: emoteHappy },
            { value: "😠", src: emoteAngry },
            { value: "☹", src: emoteSad },
            { value: "😑", src: emoteAnnoyed },
            { value: "☼", src: sun },
            { value: "☁", src: cloud },
            { value: "☂", src: umbrella },
            { value: "☃", src: snowman },
            { value: "✉", src: mail },
            { value: "☎", src: phone },
            { value: "⏰", src: alarm },
            { value: "BACK", src: backspace },

            { value: "🅰", src: buttonA },
            { value: "🅱", src: buttonB },
            { value: "PICTO_X", src: buttonX },
            { value: "PICTO_Y", src: buttonY },
            { value: "PICTO_L", src: buttonL },
            { value: "PICTO_R", src: buttonR },
            { value: "PICTO_DPAD", src: buttonDpad },
            { value: "♠", src: spade },
            { value: "♦", src: diamond },
            { value: "♥", src: heart },
            { value: "♣", src: club },
            { value: "ENTER", src: enter },

            { value: "❕", src: exclamation },
            { value: "❔", src: question },
            { value: "+", src: plus },
            { value: "-", src: minus },
            { value: "☆", src: starHollow },
            { value: "○", src: circleHollow },
            { value: "◇", src: diamondHollow },
            { value: "□", src: squareHollow },
            { value: "△", src: triangleHollow },
            { value: "▽", src: triangleInvHollow },
            { value: "◎", src: circleDouble },

            { value: "➡", src: arrowRight },
            { value: "⬅", src: arrowLeft },
            { value: "⬆", src: arrowUp },
            { value: "⬇", src: arrowDown },
            { value: "★", src: star },
            { value: "●", src: circle },
            { value: "♦", src: diamond },
            { value: "■", src: square },
            { value: "▲", src: triangle },
            { value: "▼", src: triangleInv },
            { value: "❌", src: cross },
            { value: "SPACE", src: space }
        ];
    }
    protected initRowRanges(): void {
        this.rowRangeIndices = [
            this.createRowRangeFromValues("1", "="),
            this.createRowRangeFromValues("☺", "BACK"),
            this.createRowRangeFromValues("🅰", "ENTER"),
            this.createRowRangeFromValues("❕", "◎"),
            this.createRowRangeFromValues("➡", "SPACE"),
        ];
    }

    protected initIgnoreGridCellIndices(): void {
        this.ignoreGridCellIndices = [
            new Vector2(1, 12)
        ]
    }

    protected initSpecialGridCellIndices(): void {}
}