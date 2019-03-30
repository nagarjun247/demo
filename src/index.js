import * as slide from './context/slide';
import * as narration from './context/narration';

window.initApp = function() {
  slide.initText();
  narration.initText();
}

window.buildApp = function() {
  slide.saveText();
  narration.saveText();
}

window.resetApp = function() {
  slide.resetText();
  narration.resetText();
}
