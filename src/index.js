import './styles.scss';

import { KEYBOARD_KEYS, SPECIAL_KEYS } from './constants';

const state = {
  isUpper: false,
  currentLang: localStorage.getItem('lang') || 'en',
  isMetaLeft: false,
};

const createEl = (tag, classNames = [], text = '') => {
  const $el = document.createElement(tag);
  $el.classList.add(...classNames);
  if (text) $el.textContent = text;
  return $el;
};

const createKey = (key) => {
  const $key = createEl('div', ['keyboard__key'], key[state.currentLang]);
  $key.dataset.code = key.code;
  $key.dataset.enShift = key.enShift;
  $key.dataset.ruShift = key.ruShift;
  $key.dataset.en = key.en;
  $key.dataset.ru = key.ru;
  return $key;
};

const createRow = (row, className) => {
  const $row = createEl('div', ['keyboard__row', className]);
  $row.append(...row.map((key) => createKey(key)));
  return $row;
};

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

const switchLang = () => {
  state.currentLang = state.currentLang === 'en' ? 'ru' : 'en';

  const $keys = document.querySelectorAll('.keyboard__key');
  $keys.forEach((key) => {
    const $key = key;
    $key.textContent = $key.dataset[state.currentLang];
  });
};

const changeCase = () => {
  const $keys = document.querySelectorAll('.keyboard__key');
  $keys.forEach((key) => {
    const $key = key;
    $key.textContent = state.isUpper ? $key.dataset[`${state.currentLang}Shift`] : $key.dataset[state.currentLang];
  });
};

const addCharacter = (key) => {
  const start = $textarea.selectionStart;
  const end = $textarea.selectionEnd;
  $textarea.value = $textarea.value.slice(0, start) + key + $textarea.value.slice(end);
  $textarea.selectionEnd = start + 1;
};

const removeCharacters = () => {
  const start = $textarea.selectionStart;
  const end = $textarea.selectionEnd;

  if (start === 0 && end === $textarea.value.length) {
    $textarea.value = '';
    return;
  }

  if (start === end) {
    $textarea.value = $textarea.value.slice(0, start - 1) + $textarea.value.slice(end);
    $textarea.selectionEnd = start - 1;
    return;
  }

  $textarea.value = $textarea.value.slice(0, start) + $textarea.value.slice(end);
  $textarea.selectionEnd = start;
};

const removeNextCharacters = () => {
  const start = $textarea.selectionStart;
  const end = $textarea.selectionEnd;

  if (start === 0 && end === $textarea.value.length) {
    $textarea.value = '';
    return;
  }

  if (start === end) {
    $textarea.value = $textarea.value.slice(0, start) + $textarea.value.slice(end + 1);
    $textarea.selectionEnd = start;
    return;
  }

  $textarea.value = $textarea.value.slice(0, start) + $textarea.value.slice(end);
  $textarea.selectionEnd = start;
};

const doSpecialKey = (key) => {
  switch (key.code) {
    case 'Backspace':
      removeCharacters();
      break;
    case 'Tab':
      addCharacter('    ');
      break;
    case 'Enter':
      addCharacter('\n');
      break;
    case 'Space':
      addCharacter(' ');
      break;
    case 'Delete':
      removeNextCharacters();
      break;
    case 'ArrowUp':
      addCharacter('↑');
      break;
    case 'ArrowDown':
      addCharacter('↓');
      break;
    case 'ArrowLeft':
      addCharacter('←');
      break;
    case 'ArrowRight':
      addCharacter('→');
      break;
    default:
      break;
  }
};

window.addEventListener('keydown', (e) => {
  e.preventDefault();

  const $key = document.querySelector(`[data-code="${e.code}"]`);

  if (!$key) return;

  if ($key) $key.classList.add('keyboard__key_active');

  if (SPECIAL_KEYS.includes(e.code)) {
    doSpecialKey(e);
    return;
  }

  if (state.isUpper) {
    addCharacter($key.dataset[`${state.currentLang}Shift`]);
    return;
  }

  addCharacter($key.dataset[state.currentLang]);
});

window.addEventListener('keyup', (e) => {
  e.preventDefault();
  const $key = document.querySelector(`[data-code="${e.code}"]`);
  if ($key) $key.classList.remove('keyboard__key_active');
  if (e.code === 'MetaLeft') {
    state.isLeftMeta = false;
  }
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'CapsLock' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    state.isUpper = true;
    changeCase();
  }

  if (e.code === 'MetaLeft') {
    state.isLeftMeta = true;
  }

  if (e.code === 'ShiftLeft' && state.isLeftMeta) {
    switchLang();
  }
});

$keyboard.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('keyboard__key')) {
    const $key = e.target;
    $key.classList.add('keyboard__key_active');

    if (SPECIAL_KEYS.includes($key.dataset.code)) {
      doSpecialKey($key.dataset);
      return;
    }

    if (state.isUpper) {
      addCharacter($key.dataset[`${state.currentLang}Shift`]);
      return;
    }

    addCharacter($key.dataset[state.currentLang]);
  }
});

$keyboard.addEventListener('mouseup', (e) => {
  if (e.target.classList.contains('keyboard__key')) {
    const $key = e.target;
    $key.classList.remove('keyboard__key_active');
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'CapsLock' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    state.isUpper = false;
    changeCase();
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
