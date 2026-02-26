import { createContext } from 'react';
import { colors } from './Colors';

export type Theme = {
    background: string,
    background_keyboard: string,
    canvas: string,
    button: string,
    button_special: string
}

export const themes = {
    light: {
        background: colors.gray_light,
        background_keyboard: colors.gray_darker,
        canvas: colors.white,
        button: colors.gray,
        button_special: colors.gray_dark
    }
} satisfies Record<string, Theme>;

export const ThemeContext = createContext(themes.light);