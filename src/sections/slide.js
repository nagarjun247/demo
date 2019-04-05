import axios from 'axios';
import * as utils from '../utils/utils';

const KEY_SLIDE_STORE = 'slideStore';

const getStore = () => {
  return window.localStorage.getItem(KEY_SLIDE_STORE);
};

const setStore = (val) => {
  window.localStorage.setItem(KEY_SLIDE_STORE, val);
};

const resetStore = () => {
  window.localStorage.removeItem(KEY_SLIDE_STORE);
};

const fillText = (text_) => {
  const text = utils.filterText(text_);
  $('#textarea-slide').val(text);
  setStore(text);
  M.textareaAutoResize($('#textarea-slide'));
};

const fetchSlideData = async () => {
  const result = await axios.get('/data/slide.txt');
  if (result.status === 200) {
    return result.data;
  } else {
    console.error('Unable to fetch: /data/slide.txt');
    return '';
  }
};

const initText = async () => {
  let data = getStore();
  if (!data) data = await fetchSlideData();
  if (!data) data = '';
  fillText(data);
};

const saveText = () => {
  const data = $('#textarea-slide').val();
  setStore(data);
};

const resetText = async () => {
  resetStore();
  await initText();
};

export {
  initText, saveText, resetText, getStore
};
