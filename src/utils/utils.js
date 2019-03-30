
const filterText = (text) => {
  const blocks = text.split('\n\n');
  const parts = blocks.map(block => block.split('\n').map(part => part.trim()).join(' '));
  return parts.join('\n\n');
}

export {
  filterText
}
