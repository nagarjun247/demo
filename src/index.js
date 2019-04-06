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

const positionPlayButton = () => {
  // const top_px = $('#play-button-overlay').css('top');  // 30.9062px
  // const left_px = $('#play-button-overlay').css('left');  // 10.875px

  const top = 21;  // Hardcoded as of now
  const left = 11;  // Hardcoded as of now
  const _top = top + 150;
  const _left = left + 300;

  $('#play-button-overlay').css('top', `${_top}px`)
  $('#play-button-overlay').css('left', `${_left}px`)
};

window.initApp = async function() {
  utils.showStatus('loading');

  initListeners();
  positionPlayButton();

  await slide.initText();
  await narration.initText();
  await video.loadAnnotation();

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
  video.saveAnnotation();

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
  await video.reloadAnnotation();

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
window.resetAnnotation = function() {
  video.resetAnnotation();
};
