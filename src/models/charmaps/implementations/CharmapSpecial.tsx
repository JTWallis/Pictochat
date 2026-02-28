import { CharmapBaseSingle } from '../base/CharmapBaseSingle';
import { Vector2 } from '@models/Vector2';

import exclamation from '@assets/CharacterMaps/Special/img_special_exclamation.png';
import question from '@assets/CharacterMaps/Special/img_special_question.png';
import ampersand from '@assets/CharacterMaps/Special/img_special_ampersand.png';
import quoteLong from '@assets/CharacterMaps/Special/img_special_quote.png';
import quoteSingle from '@assets/CharacterMaps/Special/img_special_quote_single.png';
import tilde from '@assets/CharacterMaps/Special/img_special_tilde.png';
import colon from '@assets/CharacterMaps/Special/img_special_colon.png';
import semicolon from '@assets/CharacterMaps/Special/img_special_semicolon.png';
import at from '@assets/CharacterMaps/Special/img_special_at.png';
import tildeSmall from '@assets/CharacterMaps/Special/img_special_tilde_small.png';
import underscore from '@assets/CharacterMaps/Special/img_special_underscore.png';

import plus from '@assets/CharacterMaps/Special/img_special_plus.png';
import minus from '@assets/CharacterMaps/Special/img_special_minus.png';
import asterisk from '@assets/CharacterMaps/Special/img_special_asterisk.png';
import slashForward from '@assets/CharacterMaps/Special/img_special_slash_forward.png';
import multiply from '@assets/CharacterMaps/Special/img_special_multiplication.png';
import divide from '@assets/CharacterMaps/Special/img_special_division.png';
import equal from '@assets/CharacterMaps/Special/img_special_equal.png';
import arrowRight from '@assets/CharacterMaps/Special/img_special_arrow_right.png';
import arrowLeft from '@assets/CharacterMaps/Special/img_special_arrow_left.png';
import arrowUp from '@assets/CharacterMaps/Special/img_special_arrow_up.png';
import arrowDown from '@assets/CharacterMaps/Special/img_special_arrow_down.png';

import drawingDownRight from '@assets/CharacterMaps/Special/img_special_box_drawing_light_down_right.png';
import drawingUpLeft from '@assets/CharacterMaps/Special/img_special_box_drawing_light_up_left.png';
import quoteSmall from '@assets/CharacterMaps/Special/img_special_quote_small.png';
import quoteStraight from '@assets/CharacterMaps/Special/img_special_quote_straight.png';
import paranthesisOpen from '@assets/CharacterMaps/Special/img_special_paranthesis_left.png';
import paranthesisClosed from '@assets/CharacterMaps/Special/img_special_paranthesis_right.png';
import angleOpen from '@assets/CharacterMaps/Special/img_special_angle_left.png';
import angleClosed from '@assets/CharacterMaps/Special/img_special_angle_right.png';
import braceOpen from '@assets/CharacterMaps/Special/img_special_bracket_left.png';
import braceClosed from '@assets/CharacterMaps/Special/img_special_bracket_right.png';
import bulletPoint from '@assets/CharacterMaps/Special/img_special_bullet_point.png';

import percent from '@assets/CharacterMaps/Special/img_special_percent.png';
import sparkle from '@assets/CharacterMaps/Special/img_special_sparkle.png';
import drawingDoubleHoriz from '@assets/CharacterMaps/Special/img_special_box_drawing_down_single_horizontal_double.png';
import hash from '@assets/CharacterMaps/Special/img_special_hash.png';
import noteFlat from '@assets/CharacterMaps/Special/img_special_note_flat.png';
import noteQuaver from '@assets/CharacterMaps/Special/img_special_note_quaver.png';
import plusMinus from '@assets/CharacterMaps/Special/img_special_plusminus.png';
import dollar from '@assets/CharacterMaps/Special/img_special_dollar.png';
import cedi from '@assets/CharacterMaps/Special/img_special_cedi.png';
import pound from '@assets/CharacterMaps/Special/img_special_pound.png';
import slashBackward from '@assets/CharacterMaps/Special/img_special_slash_backward.png';

import circumflex from '@assets/CharacterMaps/Special/img_special_circumflex.png';
import degree from '@assets/CharacterMaps/Special/img_special_degree.png';
import verticalBar from '@assets/CharacterMaps/Special/img_special_vertical_bar.png';
import drawingDiagonalForward from '@assets/CharacterMaps/Special/img_special_box_drawing_diagonal_forward.png';
import drawingDiagonalBackward from '@assets/CharacterMaps/Special/img_special_box_drawing_diagonal_backward.png';
import infinity from '@assets/CharacterMaps/Special/img_special_infinity.png';
import therefore from '@assets/CharacterMaps/Special/img_special_therefore.png';
import ellipsis from '@assets/CharacterMaps/Special/img_special_ellipsis.png';
import tm from '@assets/CharacterMaps/Special/img_special_trademark.png';
import copyright from '@assets/CharacterMaps/Special/img_special_copyright.png';
import registered from '@assets/CharacterMaps/Special/img_special_registered.png';

import backspace from '@assets/CharacterMaps/Misc/img_misc_backspace_small.png';
import enter from '@assets/CharacterMaps/Misc/img_misc_enter_vertical.png';
import space from '@assets/CharacterMaps/Misc/img_misc_space_small.png';

export class CharmapSpecial extends CharmapBaseSingle {

    constructor() {
        super();
    }

    protected initRepresentations(): void {
        this.representations = [
            { value: "!", src: exclamation },
            { value: "?", src: question },
            { value: "&", src: ampersand },
            { value: "\"", src: quoteLong },
            { value: "'", src: quoteSingle },
            { value: "~", src: tilde },
            { value: ":", src: colon },
            { value: ";", src: semicolon },
            { value: "@", src: at },
            { value: "˜", src: tildeSmall },
            { value: "_", src: underscore },

            { value: "+", src: plus },
            { value: "-", src: minus },
            { value: "*", src: asterisk },
            { value: "/", src: slashForward },
            { value: "×", src: multiply },
            { value: "÷", src: divide },
            { value: "=", src: equal },
            { value: "→", src: arrowRight },
            { value: "←", src: arrowLeft },
            { value: "↑", src: arrowUp },
            { value: "↓", src: arrowDown },
            { value: "BACK", src: backspace },

            { value: "┌", src: drawingDownRight },
            { value: "┘", src: drawingUpLeft },
            { value: "”", src: quoteSmall },
            { value: "＂", src: quoteStraight },
            { value: "(", src: paranthesisOpen },
            { value: ")", src: paranthesisClosed },
            { value: "<", src: angleOpen },
            { value: ">", src: angleClosed },
            { value: "{", src: braceOpen },
            { value: "}", src: braceClosed },
            { value: "•", src: bulletPoint },
            { value: "ENTER", src: enter },

            { value: "%", src: percent },
            { value: "❇", src: sparkle },
            { value: "╤", src: drawingDoubleHoriz },
            { value: "#", src: hash },
            { value: "♭", src: noteFlat },
            { value: "♪", src: noteQuaver },
            { value: "±", src: plusMinus },
            { value: "$", src: dollar },
            { value: "₵", src: cedi },
            { value: "£", src: pound },
            { value: "\\", src: slashBackward },

            { value: "^", src: circumflex },
            { value: "°", src: degree },
            { value: "|", src: verticalBar },
            { value: "╱", src: drawingDiagonalForward },
            { value: "╲", src: drawingDiagonalBackward },
            { value: "∞", src: infinity },
            { value: "∴", src: therefore },
            { value: "…", src: ellipsis },
            { value: "™", src: tm },
            { value: "©", src: copyright },
            { value: "®", src: registered },
            { value: "SPACE", src: space },
        ];
    }
    protected initRowRanges(): void {
        this.rowRangeIndices = [
            this.createRowRangeFromValues("!", "_"),
            this.createRowRangeFromValues("+", "BACK"),
            this.createRowRangeFromValues("┌", "ENTER"),
            this.createRowRangeFromValues("%", "\\"),
            this.createRowRangeFromValues("^", "SPACE"),
        ];
    }

    protected initIgnoreGridCellIndices(): void {
        this.ignoreGridCellIndices = [
            new Vector2(1, 12)
        ]
    }

    protected initSpecialGridCellIndices(): void {}



}