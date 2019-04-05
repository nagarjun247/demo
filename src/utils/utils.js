import _ from 'lodash';
import * as val from './const';

export const filterText = (text) => {
  const blocks = text.split('\n\n');
  let parts = blocks.map(block => {
    let xparts = block.split('\n').map(part => part.trim());
    xparts = xparts.filter(xp => !!xp);
    return xparts.join(' ');
  });
  parts = parts.filter(p => !!p);
  return parts.join('\n\n');
};

export const alertMsg = (msg) => {
  $('#msg-modal-text').text(msg);
  M.Modal.getInstance($('#msg-modal-alert')).open();
};

export const isUrl = string => {
    try { return Boolean(new URL(string)); }
    catch(e) { return false; }
};

export const showAppVersion = () => {
  const appVersion = require('../../package.json').version;
  $('#app-version').text('v'+appVersion);
};

export const showStatus = (tag) => {
  $('#status-loading').css('display', 'none');
  $('#status-error').css('display', 'none');
  $('#status-edited').css('display', 'none');
  $('#status-ok').css('display', 'none');

  if (typeof tag === 'string') {
    $(`#status-${tag}`).css('display', '');
  } else if (typeof tag === 'number') {
    const _tag = tag >= 0 ? 'ok' : 'error';
    $(`#status-${_tag}`).css('display', '');
  }
};

export const throttleInput = (func) => {
  if (!func) return func;

  // Keep debouncing calls during input, invoke func once done
  const debouncedFunc = _.debounce(func, val.DEBOUNCE_INPUT_INTERVAL, {
    'leading': false,
    'trailing': true,
  });

  // ES6 version of the function (NOTE: preserves `this`)
  const debouncedFuncES6 = (...args) => debouncedFunc(...args);

  return debouncedFuncES6;
}

export const get_mm_ss = (_sec) => {
  const sec = Math.round(_sec);

  let mm = '' + Math.floor(sec / 60);
  let ss = '' + (sec % 60);
  if (ss.length < 2) ss = '0'+ss;

  return `${mm}:${ss}`;
};
