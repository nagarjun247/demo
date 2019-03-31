
const context = document.getElementById('webCanvas').getContext('2d');
const font = "36px 'Reenie Beanie'";

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
  const mouseX = e.pageX - this.offsetLeft;
  const mouseY = e.pageY - this.offsetTop;
  addClick(mouseX, mouseY);
  redraw();
});

$('#webCanvas').mousemove(function(e) {
  if (paint) {
    const mouseX = e.pageX - this.offsetLeft;
    const mouseY = e.pageY - this.offsetTop;
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

  const text = $('#textarea-slide').val();
  const width = getTextWidth(text, font, context);
  const height = getTextHeight(text, font);
  const x = 0;
  const y = 0 + height;

  context.fillText(text, x, y);
  // drawLimits(context, x, y, width, height);
}

function drawMarkers(elapsed) {
  context.lineJoin = "round";
  for (let i = 0; i < clickX.length && (!recorded || (clickTime[i] < elapsed)); i++) {
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

function redraw(elapsed) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);  // clears the canvas
  drawText();
  drawMarkers(elapsed);
}

const draw = () => redraw();

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
  draw, record, replay
};
