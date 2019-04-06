import axios from 'axios';
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

let clickX = [];
let clickY = [];
let clickDrag = [];
let clickColor = [];
let clickSize = [];
let clickTime = [];

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

const resetAnnotation = () => {
  clickX = [];
  clickY = [];
  clickDrag = [];
  clickColor = [];
  clickSize = [];
  clickTime = [];
};

function resetApp() {
  currColor = colorGreen;
  currSize = sizeSmall;
  paint = false;
  startTime;
  timer = false;
  elapsed = 0;
  duration = 0;
  reset = true;
  recording = false;

  updateMediaProgress();
}

function updateMediaProgress() {
  let progress;
  if (reset) {
    progress = 0;
    $('#media-elapsed').text(utils.get_mm_ss(0));
    $('#media-duration').text(utils.get_mm_ss(aud.duration));
  } else {
    progress = Math.ceil((aud.currentTime / aud.duration) * 100);
  }
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

const aud = document.getElementById("playback");
resetApp();

// WARN: This is also triggered during forward seek!
aud.onplay = function() {
  runTimer();
  $('#play-button-overlay').fadeOut();
};

aud.onpause = function() {
  pauseTimer();
  $('#play-button-overlay').fadeIn();
};

aud.onended = function() {
  stopTimer();
  $('#play-button-overlay').fadeIn();
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

function addClickData(data) {
  clickX.push(data.x);
  clickY.push(data.y);
  clickDrag.push(data.drag);
  clickColor.push(data.color);
  clickSize.push(data.size);
  clickTime.push(data.time);
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

const KEY_ANNOT_STORE = 'annotStore';

const getStoreAnn = () => {
  return window.localStorage.getItem(KEY_ANNOT_STORE);
};

const setStoreAnn = (val) => {
  window.localStorage.setItem(KEY_ANNOT_STORE, val);
};

const resetStoreAnn = () => {
  window.localStorage.removeItem(KEY_ANNOT_STORE);
};

async function fetchAnnotationData() {
  const result = await axios.get('/data/annotation.txt');
  if (result.status === 200) {
    return JSON.stringify(result.data);
  } else {
    console.error('Unable to fetch: /data/annotation.txt');
    return '[]';
  }
}

async function loadAnnotation() {
  let data = getStoreAnn();
  if (!data) data = await fetchAnnotationData();
  if (!data) data = '[]';

  const data_obj = JSON.parse(data);

  resetAnnotation();
  for (let i = 0; i < data_obj.length; i++) {
    const [x, y, drag, color, size, time] = data_obj[i];
    addClickData({x, y, drag, color, size, time});
  }

  setStoreAnn(data);
}

async function reloadAnnotation() {
  resetStoreAnn();
  await loadAnnotation();
}

function dumpAnnotationData() {
  const annotationData = [];

  for (let i = 0; i < clickX.length; i++) {
    const x = clickX[i];
    const y = clickY[i];
    const drag = clickDrag[i];
    const color = clickColor[i];
    const size = clickSize[i];
    let time = clickTime[i];

    time = Math.round(time*100)/100;
    const data = [x, y, drag, color, size, time];
    annotationData.push(data);
  }

  return JSON.stringify(annotationData);
}

const saveAnnotation = () => {
  const data = dumpAnnotationData();

  const encodedData = encodeURIComponent(data);
  const dataUri = "data:text/plain;charset=utf-8," + encodedData;

  setStoreAnn(data);
  $('#download-annot-data').attr('href', dataUri);
};

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
  draw, record, play, pause, stop, resetMedia,
  loadAnnotation, reloadAnnotation, resetAnnotation, saveAnnotation,
};
