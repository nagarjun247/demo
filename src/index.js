import * as slide from './context/slide';
import * as narration from './context/narration';
import * as expo from './context/expo';

window.initApp = function() {
  slide.initText();
  narration.initText();
  expo.fillText();
}

window.buildApp = function() {
  slide.saveText();
  narration.saveText();
  expo.fillText();
}

window.resetApp = function() {
  slide.resetText();
  narration.resetText();
  expo.fillText();
}

window.recordApp = function() {
  expo.record();
}

window.replayApp = function() {
  expo.replay();
}
