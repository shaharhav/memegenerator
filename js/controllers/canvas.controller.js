'use strict'
let gCanvas;
let gCtx;
let gStartPos;



const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function initMeme(imgId) {
    gCanvas = document.querySelector('.canvas');
    gCtx = gCanvas.getContext('2d');
    addEventListeners();
    setImg(imgId);
    renderMeme();
}
function initSavedMeme(imgId) {
    gCanvas = document.querySelector('.canvas');
    gCtx = gCanvas.getContext('2d');
    addEventListeners();
    renderSavedMeme(imgId);
}
function onSetColor(color, part) {
    setColor(color, part);
    if(gMeme.isSavedMeme)renderSavedMeme(gMeme.selectedImgId);
    else renderMeme();
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
    // window.addEventListener('resize', () => {
    //     resizeCanvas();
    //     renderCanvas();
    // });

}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove);
    gCanvas.addEventListener('mousedown', onDown);
    gCanvas.addEventListener('mouseup', onUp);
    
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove);
    gCanvas.addEventListener('touchstart', onDown);
    gCanvas.addEventListener('touchend', onUp);
   
}

function onSetText(txt) {
    setLineTxt(txt);
    if(gMeme.isSavedMeme)renderSavedMeme(gMeme.selectedImgId);
    else renderMeme();
}


function onSetFontSize(diff) {
    setFontSize(+diff);
    if(gMeme.isSavedMeme)renderSavedMeme(gMeme.selectedImgId);
    else renderMeme();
}


function onSwitchTextLine() {
    switchTextLine();
    if(gMeme.isSavedMeme)renderSavedMeme(gMeme.selectedImgId);
    else renderMeme();
    document.focus = document.querySelector('input[name="txt"]')
}


function onAddTextLine() {
    addTextLine();
    if(gMeme.isSavedMeme)renderSavedMeme(gMeme.selectedImgId);
    else renderMeme();
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
    if(gMeme.isSavedMeme)renderSavedMeme(gMeme.selectedImgId);
    else renderMeme();
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
    if(gMeme.isSavedMeme)renderSavedMeme(gMeme.selectedImgId);
    else renderMeme();
}

function onSetAlign(dire) {
    setAlign(dire);
    if(gMeme.isSavedMeme)renderSavedMeme(gMeme.selectedImgId);
    else renderMeme();
}
function onSetFontFamily(fontFam) {
    setFontFamily(fontFam);
    if(gMeme.isSavedMeme)renderSavedMeme(gMeme.selectedImgId);
    else renderMeme();
}

function onDownloadMeme(elLink) {
    gForDownload = true;
    if(gMeme.isSavedMeme)renderSavedMeme(gMeme.selectedImgId);
    else renderMeme();
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
