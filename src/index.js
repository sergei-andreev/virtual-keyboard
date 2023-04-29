import './styles.scss';

import keys from './constants';

const currentLang = localStorage.getItem('lang') || 'en';

const createEl = (tag, classNames = [], text = '') => {
  const $el = document.createElement(tag);
  $el.classList.add(...classNames);
  if (text) $el.textContent = text;
  return $el;
};

const createKey = (key) => {
  const $key = createEl('div', ['keyboard__key'], key[currentLang]);
  $key.dataset.code = key.code;
  $key.dataset.shiftEn = key.shiftEn;
  $key.dataset.shiftRu = key.shiftRu;
  $key.dataset.en = key.en;
  $key.dataset.ru = key.ru;
  return $key;
};

const createRow = (row, className) => {
  const $row = createEl('div', ['keyboard__row', className]);
  $row.append(...row.map((key) => createKey(key)));
  return $row;
};

const $root = document.querySelector('#root');

const $container = createEl('div', ['container']);
$root.appendChild($container);

const $textarea = createEl('textarea', ['textarea']);
$container.appendChild($textarea);

const $keyboard = createEl('div', ['keyboard']);
$container.appendChild($keyboard);

const {
  firstRow, secondRow, thirdRow, fifthRow, fourthRow,
} = keys;

const $firstRow = createRow(firstRow, 'keyboard__row_first');
const $secondRow = createRow(secondRow, 'keyboard__row_second');
const $thirdRow = createRow(thirdRow, 'keyboard__row_third');
const $fourthRow = createRow(fourthRow, 'keyboard__row_fourth');
const $fifthRow = createRow(fifthRow, 'keyboard__row_fifth');

$keyboard.append($firstRow, $secondRow, $thirdRow, $fourthRow, $fifthRow);
