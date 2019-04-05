import axios from 'axios';
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

const getNarrationData = async () => {
  const result = await axios.get('/data/narration.txt');
  if (result.status === 200) {
    return result.data;
  } else {
    console.error('Unable to fetch: /data/narration.txt');
    return '';
  }
};

const initText = async () => {
  const data = getStore();
  if (data) {
    fillText(data);
  } else {
    const defaultText = await getNarrationData();
    fillText(defaultText);
  }
};

const saveText = () => {
  const data = $('#textarea-narration').val();
  setStore(data);
};

const resetText = async () => {
  resetStore();
  await initText();
};

export {
  initText, saveText, resetText, getStore
};
