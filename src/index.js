import * as slide from './sections/slide';
import * as narration from './sections/narration';
import * as video from './sections/video';

window.initApp = function() {
  slide.initText();
  narration.initText();
  video.draw();
}

window.buildApp = function() {
  slide.saveText();
  narration.saveText();
  video.draw();
}

window.resetApp = function() {
  slide.resetText();
  narration.resetText();
  video.draw();
}

window.recordApp = function() {
  video.record();
}

window.replayApp = function() {
  video.replay();
}
