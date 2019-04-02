
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
