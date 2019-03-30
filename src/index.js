import * as slide from './utils/slide';
import * as narration from './utils/narration';

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
