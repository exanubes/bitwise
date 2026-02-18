'use strict';

class ThemeSaveException extends Error {
    constructor() {
        super('Failed to save theme to localstorage');
    }
}

const STORAGE_KEY = 'bitwise-theme-preference';

const THEMES = Object.freeze({
    LIGHT: 'light',
    DARK: 'dark',
});

function is_valid_theme(value) {
    return value === THEMES.LIGHT || value === THEMES.DARK;
}

function change_theme(theme) {
    return theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
}

const load = () => {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        return is_valid_theme(value) ? value : null;
    } catch {
        return null;
    }
};

const save = (theme) => {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        new ThemeSaveException();
    }
};

const media = window.matchMedia('(prefers-color-scheme: dark)');

const current = () => {
    return media.matches ? THEMES.DARK : THEMES.LIGHT;
};

const on_change = (handler) => {
    media.addEventListener('change', (event) => {
        handler(event.matches ? THEMES.DARK : THEMES.LIGHT);
    });
};

const root = document.documentElement;

const apply = (theme, with_transition) => {
    if (with_transition) {
        root.classList.add('theme-transition');
    }

    root.setAttribute('data-theme', theme);

    if (with_transition) {
        setTimeout(() => root.classList.remove('theme-transition'), 300);
    }
};

const theme_icons = {
    [THEMES.DARK]: '&#9789;',
    [THEMES.LIGHT]: '&#9728;',
};
const update_toggle = (theme) => {
    const button = document.getElementById('theme-toggle');
    if (!button) return;

    const next = change_theme(theme);

    button.setAttribute('aria-label', `Switch to ${next} theme`);
    button.setAttribute('aria-pressed', String(theme === THEMES.DARK));
    button.innerHTML = theme_icons[theme];
};

let current_theme;

const start = () => {
    current_theme = load() || current();

    apply(current_theme, false);
    update_toggle(current_theme);

    on_change((theme) => {
        if (!load()) {
            current_theme = theme;
            apply(theme, true);
            update_toggle(theme);
        }
    });
};

const toggle = () => {
    current_theme = change_theme(current_theme);
    save(current_theme);
    apply(current_theme, true);
    update_toggle(current_theme);
};

start();

const button = document.getElementById('theme-toggle');

button.addEventListener('click', () => {
    toggle();
});
