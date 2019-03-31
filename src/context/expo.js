
const context = document.getElementById('webCanvas').getContext('2d');

const font = "36px 'Reenie Beanie'";
let text = 'Loading...';

// let width = getTextWidth(text, font, context);
let height = getTextHeight(text, font);

let x = 0;
let y = 0 + height;

// ---------------------------

const colorPurple = "#cb3594";
const colorGreen = "#659b41";
const colorYellow = "#ffcf33";
const colorBrown = "#986928";

const sizeSmall = 2;
const sizeNormal = 5;
const sizeLarge = 10;
const sizeHuge = 15;

const clickX = [];
const clickY = [];
const clickDrag = [];
const clickColor = [];
const clickSize = [];
const clickTime = [];

let currColor = colorPurple;
let currSize = sizeSmall;
let paint;
let startTime;
let duration = 0;
let elapsed = 0;
let timer = true;
let recorded = false;

// ---------------------------

const aud = document.getElementById("playback");
aud.onplay = function() {
  // WARN: This is also triggered during forward seek!
  startTime = new Date().getTime();
  runTimer();
};
aud.onended = function() {
  recorded = true;
  stopTimer();
};

function addClick(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  clickColor.push(currColor);
  clickSize.push(currSize);
  clickTime.push(elapsed);
}

$('#webCanvas').mousedown(function(e) {
  paint = true;
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
  addClick(mouseX, mouseY);
  redraw();
});

$('#webCanvas').mousemove(function(e) {
  if (paint) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    addClick(mouseX, mouseY, true);
    redraw();
  }
});

$('#webCanvas').mouseup(function(e) {
  paint = false;
});

$('#webCanvas').mouseleave(function(e) {
  paint = false;
});

// ---------------------------

function getTextHeight(text, font) {
  var test = document.createElement("div");
  test.textContent = text;

  test.style.font = font;
  test.style.position = 'absolute';
  test.style.width = 'auto';
  test.style.height = 'auto';
  test.style.whiteSpace = 'nowrap';
  test.style.visibility = 'hidden';

  document.body.appendChild(test);
  var height = test.clientHeight;
  var width = test.clientWidth;
  document.body.removeChild(test);

  var metrics = {width, height};
  // console.log(metrics);

  return metrics.height;
}

// ---------------------------

function runTimer() {
  setTimeout(function() {
    if (timer) runTimer();
    if (recorded) redraw(elapsed);
    elapsed = new Date().getTime() - startTime;
    if (recorded && duration > 0 && elapsed > duration) stopTimer();
  }, 30);
}

function stopTimer() {
  timer = false;
}

function drawText() {
  context.font = font;
  context.fillStyle = '#392613';
  context.textBaseline = 'bottom';
  context.fillText(text, x, y);
}

function drawMarkers(elapsed) {
  context.lineJoin = "round";
  for (var i = 0; i < clickX.length && (!recorded || (clickTime[i] < elapsed)); i++) {
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

function redraw(elapsed) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);  // clears the canvas
  drawText();
  drawMarkers(elapsed);
}

const fillText = () => {
  text = $('#textarea-slide').val();
  redraw();
};

// ---------------------------

const recordCanvas = () => {
  aud.play();
};

const replayCanvas = () => {
  duration = elapsed;
  elapsed = 0;
  timer = true;
  startTime = new Date().getTime();
  aud.play();
  runTimer();
};

const record = () => {
  if (!recorded) recordCanvas();
  else alert('Recording already done!');
};

const replay = () => {
  if (recorded) replayCanvas();
  else alert('First record before replay!');
};

// ---------------------------

export {
  fillText, record, replay
};
