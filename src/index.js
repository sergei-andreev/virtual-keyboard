import { KEYBOARD_KEYS } from "./constants";

const bodyEl = document.body;

const keyboard = document.createElement('div');
keyboard.classList.add('keyboard');
bodyEl.appendChild(keyboard);

const textarea = document.createElement('textarea');
textarea.classList.add('textarea');
bodyEl.appendChild(textarea);

console.log(KEYBOARD_KEYS);
