import axios from 'axios';
import * as utils from '../utils/utils';

const KEY_NARRATION_STORE = 'narrationStore';

const getStore = () => {
  return window.localStorage.getItem(KEY_NARRATION_STORE);
};

const setStore = (val) => {
  window.localStorage.setItem(KEY_NARRATION_STORE, val);
};

const resetStore = () => {
  window.localStorage.removeItem(KEY_NARRATION_STORE);
};

const fillText = (text_) => {
  const text = utils.filterText(text_);
  $('#textarea-narration').val(text);
  setStore(text);
  M.textareaAutoResize($('#textarea-narration'));
};

const fetchNarrationData = async () => {
  const result = await axios.get('/data/narration.txt');
  if (result.status === 200) {
    return result.data;
  } else {
    console.error('Unable to fetch: /data/narration.txt');
    return '';
  }
};

const initText = async () => {
  let data = getStore();
  if (!data) data = await fetchNarrationData();
  if (!data) data = '';
  fillText(data);
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
