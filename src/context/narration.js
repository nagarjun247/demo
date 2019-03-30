import * as utils from '../utils/utils';

const getStore = () => {
  return window.localStorage.getItem('narrationStore');
};

const setStore = (val) => {
  window.localStorage.setItem('narrationStore', val);
};

const resetStore = () => {
  window.localStorage.removeItem('narrationStore');
};

const fillText = (text_) => {
  const text = utils.filterText(text_);
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
  resetStore();
  initText();
};

const defaultText = `Now, we are going to get introduced to Pythagorean theorem.
  Well, Pythagorean theorem is fun on its own, but you will see as you learn more
  and more mathematics, that it's one of the cornerstone theorems  of all of Math.
  It's useful in geometry. It's kind of the backbone of trigonometry.

  So, enough of my talk. Let me tell you what the Pythagorean theorem is. Let's get started.`;

export {
  initText, saveText, resetText
};
