
const setStore = (val) => {
  window.localStorage.setItem('slideStore', val);
};

const getStore = () => {
  return window.localStorage.getItem('slideStore');
};

const fillText = (text) => {
  $('#textarea-slides').val(text);
  M.textareaAutoResize($('#textarea-slides'));
};

const initText = () => {
  const data = getStore();
  if (data) fillText(data);
  else fillText(defaultText);
};

const saveText = () => {
  const data = $('#textarea-slides').val();
  setStore(data);
};

const resetText = () => {
  setStore(defaultText);
  initText();
};

const defaultText = 'Sample Slide';

export {
  initText, saveText, resetText
};
