
const filterText = (text) => {
  const blocks = text.split('\n\n');
  const parts = blocks.map(block => {
    let xparts = block.split('\n').map(part => part.trim());
    xparts = xparts.filter(xp => !!xp);
    return xparts.join(' ');
  });
  return parts.join('\n\n');
};

const alertMsg = (msg) => {
  $('#msg-modal-text').text(msg);
  M.Modal.getInstance($('#msg-modal-alert')).open();
};

export {
  filterText, alertMsg
};
