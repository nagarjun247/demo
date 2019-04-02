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
  setStore(text);
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

const defaultText = `
Hello everyone.

Now let's see this new problem which involves linked list data structure.
The problem is to find the intersection point of two given linked lists.

So we are given two linked lists and their head pointers. Let's say H1 and H2.
And we have to find whether these two linked lists, meet at some point or not.
And if they meet we have to return that particular intersection node.

So, let's discuss this by an example.
Let's get started.
`;

export {
  initText, saveText, resetText, getStore
};
