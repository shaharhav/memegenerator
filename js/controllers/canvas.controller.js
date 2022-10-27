'use strict'
var gCanvas;
var gCtx;
var gStartPos;


const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function initMeme(imgId) {
    gCanvas = document.querySelector('.canvas');
    gCtx = gCanvas.getContext('2d');
    addEventListeners();
    setImg(imgId);
    renderMeme();
}
function onSetColor(color, part) {
    setColor(color, part);
    renderMeme();
}


function drawTextLine(line) {
    const x = line.pos.x;
    const y = line.pos.y;
    gCtx.textBaseline = 'middle';
    gCtx.textAlign = line.align;
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = line.stroke;
    gCtx.font = `${line.size}px ${line.font}`;
    gCtx.fillStyle = line.fill;
    gCtx.fillText(line.txt, x, y);
    gCtx.strokeText(line.txt, x, y);
}

function addEventListeners() {
    addMouseListeners();
    addTouchListeners();
}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
    window.addEventListener('resize', () => {
        resizeCanvas()
        // renderCanvas()
    });
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    });
}

function onSetText(txt) {
    setLineTxt(txt);
    renderMeme();
}


function onSetFontSize(diff) {
    setFontSize(+diff);
    renderMeme();
}


function onSwitchTextLine() {
    switchTextLine();
    renderMeme();
    document.focus = document.querySelector('input[name="txt"]')
}


function onAddTextLine() {
    addTextLine();
    renderMeme();
}

function onDown(ev) {
    const pos = getEvPos(ev);
    if (!isLineClicked(pos)) return
    setLineDrag(true);
    gStartPos = pos;
    document.body.style.cursor = 'grabbing';
}

function onMove(ev) {
    const meme = getMeme();
    if (!meme.lines[gMeme.selectedLineIdx].isDrag) return;
    const line = getLine();
    if (!line.isDrag) return
    const pos = getEvPos(ev);
    const dx = pos.x - gStartPos.x;
    const dy = pos.y - gStartPos.y
    moveLine(dx, dy)
    gStartPos = pos
    renderMeme()
}

function onUp() {
    setLineDrag(false)
    document.body.style.cursor = 'default'
}
function markSelectedTextLine(line) {
    const x = line.pos.x;
    const y = line.pos.y;
    const lineHeight = line.size + 20;
    const lineWidth = gCtx.measureText(line.txt).width + 20;
    gCtx.beginPath();
    if (line.align === 'start') {
        gCtx.rect(x, y - (lineHeight / 2), lineWidth, lineHeight);
    } else if (line.align === 'center') {
        gCtx.rect(x - (lineWidth / 2), y - (lineHeight / 2), lineWidth, lineHeight);
    } else if (line.align === 'end') {
        gCtx.rect(x - lineWidth, y - (lineHeight / 2), lineWidth, lineHeight);
    }
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.closePath();
}
function onDeleteTextLine() {
    deleteTextLine();
    renderMeme();
}

function onSetAlign(dire) {
    setAlign(dire);
    renderMeme();
}
function onSetFontFamily(fontFam) {
    setFontFamily(fontFam);
    renderMeme();
}

function onDownloadMeme(elLink) {
    gForDownload = true;
    renderMeme();
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-meme.jpg'
}
function onUploadMeme() {
    uploadMeme();
}

function onSaveMeme() {
    saveMeme();
}
