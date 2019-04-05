import * as slide from './sections/slide';
import * as narration from './sections/narration';
import * as video from './sections/video';
import * as audio from './sections/audio';
import * as utils from './utils/utils';

const initListeners = () => {
  $('#textarea-slide').on('change textInput input', utils.throttleInput((e) => {
    const val0 = slide.getStore();
    const val1 = e.target.value;
    if (val0 !== val1) utils.showStatus('edited');
  }));

  $('#textarea-narration').on('change textInput input', utils.throttleInput((e) => {
    const val0 = narration.getStore();
    const val1 = e.target.value;
    if (val0 !== val1) utils.showStatus('edited');
  }));
};

window.initApp = async function() {
  utils.showStatus('loading');

  initListeners();

  await slide.initText();
  await narration.initText();
  video.draw();
  const p1 = audio._load();

  utils.showAppVersion();

  const status = await p1;
  utils.showStatus(status);
};

window.buildApp = async function() {
  utils.showStatus('loading');

  video.resetMedia();

  slide.saveText();
  narration.saveText();
  video.draw();
  const p1 = audio._load();

  const status = await p1;
  utils.showStatus(status);
};

window.resetApp = async function() {
  utils.showStatus('loading');

  video.resetMedia();

  await slide.resetText();
  await narration.resetText();
  video.draw();
  const p1 = audio._load();

  const status = await p1;
  utils.showStatus(status);
};

window.recordMedia = function() {
  video.record();
};
window.playMedia = function() {
  video.play();
};
window.pauseMedia = function() {
  video.pause();
};
window.stopMedia = function() {
  video.stop();
};
window.resetMedia = function() {
  video.resetMedia();
};
