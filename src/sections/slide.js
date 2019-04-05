import axios from 'axios';
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
  setStore(text);
  M.textareaAutoResize($('#textarea-slide'));
};

const getSlideData = async () => {
  const result = await axios.get('/data/slide.txt');
  if (result.status === 200) {
    return result.data;
  } else {
    console.error('Unable to fetch: /data/slide.txt');
    return '';
  }
};

const initText = async () => {
  const data = getStore();
  if (data) {
    fillText(data);
  } else {
    const defaultText = await getSlideData();
    fillText(defaultText);
  }
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
