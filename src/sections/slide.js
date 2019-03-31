import * as utils from '../utils/utils';

const getStore = () => {
  return window.localStorage.getItem('slideStore');
};

const setStore = (val) => {
  window.localStorage.setItem('slideStore', val);
};

const resetStore = () => {
  window.localStorage.removeItem('slideStore');
};

const fillText = (text_) => {
  const text = utils.filterText(text_);
  $('#textarea-slide').val(text);
  M.textareaAutoResize($('#textarea-slide'));
};

const initText = () => {
  const data = getStore();
  if (data) fillText(data);
  else fillText(defaultText);
};

const saveText = () => {
  const data = $('#textarea-slide').val();
  setStore(data);
};

const resetText = () => {
  resetStore();
  initText();
};

const defaultText = `
Intersection point of two given linked lists
`;

export {
  initText, saveText, resetText
};
