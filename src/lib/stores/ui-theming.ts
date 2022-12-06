import { readLocalStorage } from "$lib/core/utils/localStorage";
import { _themes } from "$lib/globals";
import { writable } from "svelte/store";

export const theme = writable(readLocalStorage("theme") || _themes.dark);
export const toggleTheme = () => {
    theme.update((currentTheme) => {
        return currentTheme === _themes.dark ? _themes.light : _themes.dark;
    });
};

export const showLoading = writable(false);