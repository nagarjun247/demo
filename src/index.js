import * as slide from './sections/slide';
import * as narration from './sections/narration';
import * as video from './sections/video';
import * as audio from './sections/audio';
import * as utils from './utils/utils';

window.initApp = function() {
  utils.showAppVersion();
  slide.initText();
  narration.initText();
  video.draw();
  audio._load();
};

window.buildApp = function() {
  slide.saveText();
  narration.saveText();
  video.draw();
  audio._load();
};

window.resetApp = function() {
  slide.resetText();
  narration.resetText();
  video.draw();
  audio._load();
};

window.recordApp = function() {
  video.record();
};

window.replayApp = function() {
  video.replay();
};
