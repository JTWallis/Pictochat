import { Vector2 } from '../../../Vector2';

import aGraveLower from '@assets/CharacterMaps/Accents/img_char_a_lower_grave.png';
import aAcuteLower from '@assets/CharacterMaps/Accents/img_char_a_lower_acute.png';
import aCircumflexLower from '@assets/CharacterMaps/Accents/img_char_a_lower_circumflex.png';
import aUmlautLower from '@assets/CharacterMaps/Accents/img_char_a_lower_umlaut.png';
import aGraveUpper from '@assets/CharacterMaps/Accents/img_char_a_upper_grave.png';
import aAcuteUpper from '@assets/CharacterMaps/Accents/img_char_a_upper_acute.png';
import aCircumflexUpper from '@assets/CharacterMaps/Accents/img_char_a_upper_circumflex.png';
import aUmlautUpper from '@assets/CharacterMaps/Accents/img_char_a_upper_umlaut.png';

import eGraveLower from '@assets/CharacterMaps/Accents/img_char_e_lower_grave.png';
import eAcuteLower from '@assets/CharacterMaps/Accents/img_char_e_lower_acute.png';
import eCircumflexLower from '@assets/CharacterMaps/Accents/img_char_e_lower_circumflex.png';
import eUmlautLower from '@assets/CharacterMaps/Accents/img_char_e_lower_umlaut.png';
import eGraveUpper from '@assets/CharacterMaps/Accents/img_char_e_upper_grave.png';
import eAcuteUpper from '@assets/CharacterMaps/Accents/img_char_e_upper_acute.png';
import eCircumflexUpper from '@assets/CharacterMaps/Accents/img_char_e_upper_circumflex.png';
import eUmlautUpper from '@assets/CharacterMaps/Accents/img_char_e_upper_umlaut.png';

import iGraveLower from '@assets/CharacterMaps/Accents/img_char_i_lower_grave.png';
import iAcuteLower from '@assets/CharacterMaps/Accents/img_char_i_lower_acute.png';
import iCircumflexLower from '@assets/CharacterMaps/Accents/img_char_i_lower_circumflex.png';
import iUmlautLower from '@assets/CharacterMaps/Accents/img_char_i_lower_umlaut.png';
import iGraveUpper from '@assets/CharacterMaps/Accents/img_char_i_upper_grave.png';
import iAcuteUpper from '@assets/CharacterMaps/Accents/img_char_i_upper_acute.png';
import iCircumflexUpper from '@assets/CharacterMaps/Accents/img_char_i_upper_circumflex.png';
import iUmlautUpper from '@assets/CharacterMaps/Accents/img_char_i_upper_umlaut.png';

import oGraveLower from '@assets/CharacterMaps/Accents/img_char_o_lower_grave.png';
import oAcuteLower from '@assets/CharacterMaps/Accents/img_char_o_lower_acute.png';
import oCircumflexLower from '@assets/CharacterMaps/Accents/img_char_o_lower_circumflex.png';
import oUmlautLower from '@assets/CharacterMaps/Accents/img_char_o_lower_umlaut.png';
import oGraveUpper from '@assets/CharacterMaps/Accents/img_char_o_upper_grave.png';
import oAcuteUpper from '@assets/CharacterMaps/Accents/img_char_o_upper_acute.png';
import oCircumflexUpper from '@assets/CharacterMaps/Accents/img_char_o_upper_circumflex.png';
import oUmlautUpper from '@assets/CharacterMaps/Accents/img_char_o_upper_umlaut.png';

import uGraveLower from '@assets/CharacterMaps/Accents/img_char_u_lower_grave.png';
import uAcuteLower from '@assets/CharacterMaps/Accents/img_char_u_lower_acute.png';
import uCircumflexLower from '@assets/CharacterMaps/Accents/img_char_u_lower_circumflex.png';
import uUmlautLower from '@assets/CharacterMaps/Accents/img_char_u_lower_umlaut.png';
import uGraveUpper from '@assets/CharacterMaps/Accents/img_char_u_upper_grave.png';
import uAcuteUpper from '@assets/CharacterMaps/Accents/img_char_u_upper_acute.png';
import uCircumflexUpper from '@assets/CharacterMaps/Accents/img_char_u_upper_circumflex.png';
import uUmlautUpper from '@assets/CharacterMaps/Accents/img_char_u_upper_umlaut.png';

import cCedillaLower from '@assets/CharacterMaps/Accents/img_char_c_lower_cedilla.png';
import cCedillaUpper from '@assets/CharacterMaps/Accents/img_char_c_upper_cedilla.png';
import ethelLower from '@assets/CharacterMaps/Accents/img_char_ethel_lower.png';
import ethelUpper from '@assets/CharacterMaps/Accents/img_char_ethel_upper.png';
import nTildeLower from '@assets/CharacterMaps/Accents/img_char_n_lower_tilde.png';
import nTildeUpper from '@assets/CharacterMaps/Accents/img_char_n_upper_tilde.png';
import eszett from '@assets/CharacterMaps/Accents/img_char_eszett.png';

import exclamationInv from '@assets/CharacterMaps/Special/img_special_exclamation_inverted.png';
import questionInv from '@assets/CharacterMaps/Special/img_special_question_inverted.png';
import euro from '@assets/CharacterMaps/Special/img_special_euro.png';
import cedi from '@assets/CharacterMaps/Special/img_special_cedi.png';
import pound from '@assets/CharacterMaps/Special/img_special_pound.png';

import backspace from '@assets/CharacterMaps/Misc/img_misc_backspace_small.png';
import enter from '@assets/CharacterMaps/Misc/img_misc_enter_vertical.png';
import space from '@assets/CharacterMaps/Misc/img_misc_space_small.png';
import { CharmapBaseSingle } from '../base/CharmapBaseSingle';

export class CharmapAccent extends CharmapBaseSingle {

    constructor() {
        super();
    }

    protected initRepresentations(): void {
        this.representations = [
            { value: "à", src: aGraveLower },
            { value: "á", src: aAcuteLower },
            { value: "â", src: aCircumflexLower },
            { value: "ä", src: aUmlautLower },
            { value: "è", src: eGraveLower },
            { value: "é", src: eAcuteLower },
            { value: "ê", src: eCircumflexLower },
            { value: "ë", src: eUmlautLower },
            { value: "ì", src: iGraveLower },
            { value: "í", src: iAcuteLower },
            { value: "î", src: iCircumflexLower },

            { value: "ï", src: iUmlautLower },
            { value: "ò", src: oGraveLower },
            { value: "ó", src: oAcuteLower },
            { value: "ô", src: oCircumflexLower },
            { value: "ö", src: oUmlautLower },
            { value: "œ", src: ethelLower },
            { value: "ù", src: uGraveLower },
            { value: "ú", src: uAcuteLower },
            { value: "û", src: uCircumflexLower },
            { value: "ü", src: uUmlautLower },
            { value: "ç", src: cCedillaLower },
            { value: "BACK", src: backspace },

            { value: "ñ", src: nTildeLower },
            { value: "ß", src: eszett },
            { value: "À", src: aGraveUpper },
            { value: "Á", src: aAcuteUpper },
            { value: "Â", src: aCircumflexUpper },
            { value: "Ä", src: aUmlautUpper },
            { value: "È", src: eGraveUpper },
            { value: "É", src: eAcuteUpper },
            { value: "Ê", src: eCircumflexUpper },
            { value: "Ë", src: eUmlautUpper },
            { value: "Ì", src: iGraveUpper },
            { value: "ENTER", src: enter },

            { value: "Í", src: iAcuteUpper },
            { value: "Î", src: iCircumflexUpper },
            { value: "Ï", src: iUmlautUpper },
            { value: "Ò", src: oGraveUpper },
            { value: "Ó", src: oAcuteUpper },
            { value: "Ô", src: oCircumflexUpper },
            { value: "Ö", src: oUmlautUpper },
            { value: "Œ", src: ethelUpper },
            { value: "Ù", src: uGraveUpper },
            { value: "Ú", src: uAcuteUpper },
            { value: "Û", src: uCircumflexUpper },

            { value: "Ü", src: uUmlautUpper },
            { value: "Ç", src: cCedillaUpper },
            { value: "Ñ", src: nTildeUpper },
            { value: "¡", src: exclamationInv },
            { value: "¿", src: questionInv },
            { value: "€", src: euro },
            { value: "₵", src: cedi },
            { value: "£", src: pound },
            { value: "SPACE", src: space },

        ];
    }
    protected initRowRanges(): void {
        this.rowRangeIndices = [
            this.createRowRangeFromValues("à", "î"),
            this.createRowRangeFromValues("ï", "BACK"),
            this.createRowRangeFromValues("ñ", "ENTER"),
            this.createRowRangeFromValues("Í", "Û"),
            this.createRowRangeFromValues("Ü", "SPACE"),
        ];
    }

    protected initIgnoreGridCellIndices(): void {
        this.ignoreGridCellIndices = [
            new Vector2(1, 12),
            new Vector2(5, 9),
            new Vector2(5, 10),
            new Vector2(5, 11)
        ]
    }

    protected initSpecialGridCellIndices(): void {}



}