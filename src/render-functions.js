import state from './state';

export const createEl = (tag, classNames = [], text = '') => {
  const $el = document.createElement(tag);
  $el.classList.add(...classNames);
  if (text) $el.textContent = text;
  return $el;
};

export const createKey = (key) => {
  const $key = createEl('div', ['keyboard__key'], key[state.currentLang]);
  $key.dataset.code = key.code;
  $key.dataset.enShift = key.enShift;
  $key.dataset.ruShift = key.ruShift;
  $key.dataset.en = key.en;
  $key.dataset.ru = key.ru;
  return $key;
};

export const createRow = (row, className) => {
  const $row = createEl('div', ['keyboard__row', className]);
  $row.append(...row.map((key) => createKey(key)));
  return $row;
};

export const changeCase = () => {
  const $keys = document.querySelectorAll('.keyboard__key');
  $keys.forEach((key) => {
    const $key = key;
    $key.textContent = state.isUpper ? $key.dataset[`${state.currentLang}Shift`] : $key.dataset[state.currentLang];
  });
};

export const switchLang = () => {
  state.currentLang = state.currentLang === 'en' ? 'ru' : 'en';
  localStorage.setItem('lang', state.currentLang);

  const $keys = document.querySelectorAll('.keyboard__key');
  $keys.forEach((key) => {
    const $key = key;
    $key.textContent = $key.dataset[state.currentLang];
  });
};
