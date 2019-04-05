import * as utils from '../utils/utils';

const context = document.getElementById('webCanvas').getContext('2d');
const font = "36px 'Reenie Beanie'";

const colorPurple = "#cb3594";
const colorGreen = "#00c853";
const colorYellow = "#ffcf33";
const colorBrown = "#986928";

const sizeSmall = 2;
const sizeNormal = 5;
const sizeLarge = 10;
const sizeHuge = 15;

let clickX;
let clickY;
let clickDrag;
let clickColor;
let clickSize;
let clickTime;

let currColor;
let currSize;
let paint;
let startTime;
let timer;
let elapsed;
let duration;
let reset;
let recording;

// ---------------------------

function resetMarkers() {
  clickX = [];
  clickY = [];
  clickDrag = [];
  clickColor = [];
  clickSize = [];
  clickTime = [];
}

function resetApp() {
  resetMarkers();

  currColor = colorGreen;
  currSize = sizeSmall;
  paint = false;
  startTime;
  timer = false;
  elapsed = 0;
  duration = 0;
  reset = true;
  recording = false;

  updateMediaTimer();
  updateMediaProgress();
}

function updateMediaTimer() {
  const zero = utils.get_mm_ss(0);
  $('#media-elapsed').text(zero);
  $('#media-duration').text(zero);
}

function updateMediaProgress() {
  let progress = 0;
  if (!reset) progress = Math.ceil((aud.currentTime / aud.duration) * 100);
  $('#progress-bar').css('width', `${progress}%`);
}

function _runTimer() {
  setTimeout(function() {
    if (timer) {
      _runTimer();

      // duration = new Date().getTime() - startTime;
      duration = aud.currentTime * 1000;
      redraw(duration);
      updateMediaProgress();

      const elap1 = utils.get_mm_ss(duration/1000);
      const elap0 = $('#media-elapsed').text();
      if (elap0 !== elap1) $('#media-elapsed').text(elap1);
    }
  }, 30);
}

function runTimer() {
  if (reset) reset = false;
  timer = true;
  startTime = new Date().getTime() - elapsed;

  _runTimer();
  if (recording) $('#webCanvas').css('cursor', 'pointer');
}

function _stall() {
  timer = false;
  elapsed = duration;

  if (recording) $('#webCanvas').css('cursor', 'auto');
}

function final_stall() {
  aud.currentTime = 0;
  if (recording) recording = false;
  reset = true;
  elapsed = 0;
  duration = 0;
  updateMediaProgress();
}

function pauseTimer() {
  _stall();
}

function stopTimer() {
  _stall();
  final_stall();
}

// ---------------------------

resetApp();

const aud = document.getElementById("playback");

// WARN: This is also triggered during forward seek!
aud.onplay = function() {
  runTimer();
};

aud.onpause = function() {
  pauseTimer();
};

aud.onended = function() {
  stopTimer();
};

aud.onloadeddata = function() {
  const duration = utils.get_mm_ss(this.duration);
  $('#media-duration').text(duration);
};

// ---------------------------

function addClick(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  clickColor.push(currColor);
  clickSize.push(currSize);
  clickTime.push(duration);
}

// TODO: Validate if strictly (timer-bound && recording-bound) mouse operations are okay
$('#webCanvas').mousedown(function(e) {
  if (recording && timer) {
    paint = true;
    const mouseX = e.pageX - this.offsetLeft;
    const mouseY = e.pageY - this.offsetTop;
    addClick(mouseX, mouseY);
  }
});

$('#webCanvas').mousemove(function(e) {
  if (recording && timer && paint) {
    const mouseX = e.pageX - this.offsetLeft;
    const mouseY = e.pageY - this.offsetTop;
    addClick(mouseX, mouseY, true);
  }
});

$('#webCanvas').mouseup(function(e) {
  if (recording && timer) paint = false;
});

$('#webCanvas').mouseleave(function(e) {
  if (recording && timer) paint = false;
});

// ---------------------------

function getTextWidth(text, font, context) {
  context.font = font;
  const metrics = context.measureText(text);
  // console.log(metrics);
  return Math.ceil(metrics.width);
}

function getTextHeight(text, font) {
  const test = document.createElement("div");
  test.textContent = text;

  test.style.font = font;
  test.style.position = 'absolute';
  test.style.width = 'auto';
  test.style.height = 'auto';
  test.style.whiteSpace = 'nowrap';
  test.style.visibility = 'hidden';

  document.body.appendChild(test);
  const height = test.clientHeight;
  const width = test.clientWidth;
  document.body.removeChild(test);

  const metrics = {width, height};
  // console.log(metrics);

  return metrics.height;
}

// ---------------------------

function drawText() {
  context.font = font;
  context.fillStyle = '#fb8c00';
  context.textBaseline = 'bottom';

  const text = $('#textarea-slide').val();
  const width = getTextWidth(text, font, context);
  const height = getTextHeight(text, font);
  const x = 100;
  const y = 40 + height;

  context.fillText(text, x, y);
  // drawLimits(context, x, y, width, height);
}

function drawMarkers(duration) {
  if (typeof duration !== 'number' || duration <= 0) return;

  context.lineJoin = "round";
  for (let i = 0; i < clickX.length && (clickTime[i] < duration); i++) {
    context.beginPath();
    if (clickDrag[i] && i > 0) {
      context.moveTo(clickX[i-1], clickY[i-1]);
    } else {
      context.moveTo(clickX[i]-1, clickY[i]);  // draw dot for non-dragging click
    }
    context.lineTo(clickX[i], clickY[i]);
    context.closePath();

    context.lineWidth = clickSize[i];
    context.strokeStyle = clickColor[i];
    context.stroke();
  }
}

function drawLimits(context, x, y, width, height) {
  const testLine = function(ctx, x, y, len, style) {
    ctx.strokeStyle = style;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y);
    ctx.closePath();
    ctx.stroke();
  };

  testLine(context, x, y - height, width, 'red');
  testLine(context, x, y, width, 'blue');
}

function redraw(duration) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);  // clear canvas

  context.fillStyle = '#000000';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);  // fill canvas background

  drawText();
  drawMarkers(duration);
}

const draw = () => redraw();

// ---------------------------

const record = () => {
  recording = true;
  aud.play();
};

const play = () => {
  aud.play();
};

const pause = () => {
  aud.pause();
};

const stop = () => {
  return new Promise((resolve, reject) => {
    aud.pause();
    setTimeout(() => {
      final_stall();
      resolve();
    }, 50);
  });
};

const isMediaPlaying = () => {
  // Ref: https://stackoverflow.com/a/31133401
  return !!(aud.currentTime > 0 && !aud.paused && !aud.ended && aud.readyState > 2);
};

const resetMedia = async () => {
  if (isMediaPlaying()) await stop();
  resetApp();
};

// ---------------------------

export {
  draw, record, play, pause, stop, resetMedia
};
