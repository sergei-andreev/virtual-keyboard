import {
  createEl, createRow, changeCase, switchLang,
} from './render-functions';
import { KEYBOARD_KEYS, SPECIAL_KEYS } from './constants';
import state from './state';

import Textarea from './Textarea';

import './styles.scss';

const $root = document.body;

const $container = createEl('div', ['container']);
$root.appendChild($container);

const $textarea = createEl('textarea', ['textarea']);
$container.appendChild($textarea);

const $keyboard = createEl('div', ['keyboard']);
$container.appendChild($keyboard);

const {
  firstRow, secondRow, thirdRow, fifthRow, fourthRow,
} = KEYBOARD_KEYS;

const $firstRow = createRow(firstRow, 'keyboard__row_first');
const $secondRow = createRow(secondRow, 'keyboard__row_second');
const $thirdRow = createRow(thirdRow, 'keyboard__row_third');
const $fourthRow = createRow(fourthRow, 'keyboard__row_fourth');
const $fifthRow = createRow(fifthRow, 'keyboard__row_fifth');

$keyboard.append($firstRow, $secondRow, $thirdRow, $fourthRow, $fifthRow);

const TextareaInput = new Textarea($textarea);

window.addEventListener('keydown', (e) => {
  e.preventDefault();

  const $key = document.querySelector(`[data-code="${e.code}"]`);

  if (!$key) return;

  if ($key) $key.classList.add('keyboard__key_active');

  setTimeout(() => {
    if ($key && !SPECIAL_KEYS.includes(e.code)) $key.classList.remove('keyboard__key_active');
  }, 200);

  if (SPECIAL_KEYS.includes(e.code)) {
    TextareaInput.doSpecialKey(e);
    return;
  }

  if (state.isUpper) {
    TextareaInput.addCharacter($key.dataset[`${state.currentLang}Shift`]);
    return;
  }

  TextareaInput.addCharacter($key.dataset[state.currentLang]);
});

window.addEventListener('keyup', (e) => {
  e.preventDefault();
  const $key = document.querySelector(`[data-code="${e.code}"]`);
  if ($key) $key.classList.remove('keyboard__key_active');
  if (e.code === 'MetaLeft') {
    state.isLeftMeta = false;
  }
});

const handleChangeCase = (e) => {
  if (e.code === 'CapsLock' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    state.isUpper = !state.isUpper;
    changeCase();
  }
};

window.addEventListener('keydown', (e) => {
  handleChangeCase(e);

  if (e.code === 'MetaLeft') {
    state.isLeftMeta = true;
  }

  if (e.code === 'ShiftLeft' && state.isLeftMeta) {
    switchLang();
  }
});

window.addEventListener('keyup', (e) => {
  handleChangeCase(e);
});

$keyboard.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('keyboard__key')) {
    const $key = e.target;
    $key.classList.add('keyboard__key_active');

    if (SPECIAL_KEYS.includes($key.dataset.code)) {
      TextareaInput.doSpecialKey($key.dataset);
      return;
    }

    if (state.isUpper) {
      TextareaInput.addCharacter($key.dataset[`${state.currentLang}Shift`]);
      return;
    }

    TextareaInput.addCharacter($key.dataset[state.currentLang]);
  }
});

$keyboard.addEventListener('mouseup', (e) => {
  if (e.target.classList.contains('keyboard__key')) {
    const $key = e.target;
    $key.classList.remove('keyboard__key_active');
  }
});

$keyboard.addEventListener('click', (e) => {
  if (e.target.classList.contains('keyboard__key')) {
    const $key = e.target;
    if ($key.dataset.code === 'CapsLock' || $key.dataset.code === 'ShiftLeft' || $key.dataset.code === 'ShiftRight') {
      if (!state.isUpper) $key.classList.add('keyboard__key_active');
      state.isUpper = !state.isUpper;
      changeCase();
    }
  }
});

const $note = createEl('div', ['note'], 'You can change the language by pressing the left Meta + left Shift');
$container.append($note);
