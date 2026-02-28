import { createContext } from 'react';
import { colors } from '@enums/Colors';

export type Theme = {
    background_primary: string,
    background_secondary: string,
    background_ternary: string
    canvas: string,
    canvas_special: string,
    button: string,
    button_special: string
}

export const themes = {
    light: {
        background_primary: colors.gray_dark,
        background_secondary: colors.gray_darker,
        background_ternary: colors.gray,
        canvas: colors.white,
        canvas_special: colors.black,
        button: colors.gray,
        button_special: colors.gray_dark
    }
} satisfies Record<string, Theme>;

export const ThemeContext = createContext(themes.light);