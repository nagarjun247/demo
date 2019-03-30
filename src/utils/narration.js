
const setStore = (val) => {
  window.localStorage.setItem('narrationStore', val);
};

const getStore = () => {
  return window.localStorage.getItem('narrationStore');
};

const fillText = (text) => {
  $('#textarea-narration').val(text);
  M.textareaAutoResize($('#textarea-narration'));
};

const initText = () => {
  const data = getStore();
  if (data) fillText(data);
  else fillText(defaultText);
};

const saveText = () => {
  const data = $('#textarea-narration').val();
  setStore(data);
};

const resetText = () => {
  setStore(defaultText);
  initText();
};

const defaultText = 'Sample Narration';

export {
  initText, saveText, resetText
};
