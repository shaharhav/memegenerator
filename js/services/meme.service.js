'use strict'
const STORAGE_KEY = 'memesDB'

var gSavedMemes;
var nextLine = true;
var gForDownload = false;


var gImgs = [
    { id: 1, url: 'img/1.jpg' },
    { id: 2, url: 'img/2.jpg' },
    { id: 3, url: 'img/3.jpg' },
    { id: 4, url: 'img/4.jpg' },
    { id: 5, url: 'img/5.jpg' },
    { id: 6, url: 'img/6.jpg' },
    { id: 7, url: 'img/7.jpg' },
    { id: 8, url: 'img/8.jpg' },
    { id: 9, url: 'img/9.jpg' },
    { id: 10, url: 'img/10.jpg' },
    { id: 11, url: 'img/11.jpg' },
    { id: 12, url: 'img/12.jpg' },
    { id: 13, url: 'img/13.jpg' },
    { id: 14, url: 'img/14.jpg' },
    { id: 15, url: 'img/15.jpg' },
    { id: 16, url: 'img/16.jpg' },
    { id: 17, url: 'img/17.jpg' },
    { id: 18, url: 'img/18.jpg' },

];



var gMeme = {
    selectedImgId: 2,
    selectedLineIdx: 0,
    lines: [{
        txt: 'Your Text Here',
        font: 'impact',
        stroke: 'black',
        fill: 'white',
        size: 30,
        align: 'center',
        isDrag: false,
        isSelected: false,

        pos: {
            x: 250,
            y: 50
        },
    }]
};

function createMeme() {
    gMeme = {
        selectedImgId: 2,
        selectedLineIdx: 0,
        lines: [{
            txt: 'Your Text Here',
            font: 'impact',
            stroke: 'black',
            fill: 'white',
            size: 30,
            align: 'center',
            isDrag: false,
            isSelected: false,

            pos: {
                x: 250,
                y: 50
            },
        }]
    };
}
function renderGallery() {
    const images = getImgs();
    var strHTMLs = images.map((img) => {
        return `<div class="img" onclick="onImgSelect(${img.id})"><img src="img/${img.id}.jpg" alt=""></div>`
    });
    const elGallery = document.querySelector('.main-gallery-container');
    elGallery.innerHTML = strHTMLs.join('');
}

function renderMeme() {
    const meme = getMeme();
    const elImg = getElImgById(meme.selectedImgId);
    document.querySelector('.main-gallery-container').style.display = 'none';
    document.querySelector('.canvas-page-container').style.display = 'grid';
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
    if (meme.lines.length) {
        meme.lines.forEach(line => drawTextLine(line));
        if (gForDownload) return;
        markSelectedTextLine(meme.lines[meme.selectedLineIdx]);
    }
}

function getImgs() {
    return gImgs;
}

function getMeme() {
    return gMeme;
}
function getElImgById(imgId) {
    return document.querySelector(`[src="img/${imgId}.jpg"]`);
}
function setImg(imgId) {
    return gMeme.selectedImgId = imgId;
}
function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}
function setColor(color, part) {
    gMeme.lines[gMeme.selectedLineIdx][part] = color;
}
function setFontSize(diff) {
    if ((gMeme.lines[gMeme.selectedLineIdx].size + diff) < 12 ||
        (gMeme.lines[gMeme.selectedLineIdx].size + diff) > 90) return;
    gMeme.lines[gMeme.selectedLineIdx].size += diff;
}

function switchTextLine(lineIdx) {
    if (lineIdx || lineIdx === 0) gMeme.selectedLineIdx = lineIdx;
    else gMeme.selectedLineIdx = (gMeme.selectedLineIdx === (gMeme.lines.length - 1)) ? 0 : gMeme.selectedLineIdx + 1;
    document.querySelector('.txt-input').placeholder = gMeme.lines[gMeme.selectedLineIdx].txt;
    document.querySelector('.txt-input').value = '';
}
function deleteTextLine() {
    if (!gMeme.lines[gMeme.selectedLineIdx]) return;
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = 0;
}

function setAlign(dire) {
    gMeme.lines[gMeme.selectedLineIdx].align = dire;
    let x;
    if (dire === 'start') x = 10;
    else if (dire === 'center') x = gCanvas.width / 2;
    else if (dire === 'end') x = gCanvas.width - 10;
    gMeme.lines[gMeme.selectedLineIdx].pos.x = x;
}

function addTextLine() {
    const line = {
        txt: 'Add New Text here!',
        font: 'impact',
        stroke: 'black',
        fill: 'white',
        size: 30,
        align: 'center',
        isDrag: false,
        isSelected: false,


        pos: {
            x: gCanvas.width / 2,
            y: gCanvas.height / 2
        }
    };
    if (nextLine) line.pos.y = 400;
    nextLine = false;
    gMeme.lines.push(line);

    document.querySelector('.txt-input').placeholder = (gMeme.lines[gMeme.selectedLineIdx].txt) ? gMeme.lines[gMeme.selectedLineIdx].txt : 'Add New Text Here!';

}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

function isLineClicked(clickedPos) {
    const currLine = gMeme.lines[gMeme.selectedLineIdx];
    const posX = currLine.pos.x;
    const posY = currLine.pos.y;
    var textWidth = gCtx.measureText(currLine.txt).width + 20;
    var textHight = currLine.size + 20;
    return Math.abs(clickedPos.x - posX) <= textWidth / 2 && Math.abs(clickedPos.y - posY) <= textHight / 2
}

function setLineDrag(isDrag) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag;
}
function getLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}
function moveLine(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy

}

function setFontFamily(fontFam) {
    gMeme.lines[gMeme.selectedLineIdx].font = fontFam;
}
function saveMeme() {
    gForDownload = true;
    renderMeme();
    const meme = new Image();
    meme.src = gCanvas.toDataURL();
    gSavedMemes.push(meme.src);
    saveToStorage(STORAGE_KEY, gSavedMemes);
}
function showSavedMemesPage() {
    document.body.classList.remove('menu-open');
    document.querySelector('.saved-meme-container').style.display = 'grid';
    // document.querySelector('.about').style.display='none';
    document.querySelector('.main-gallery-container').style.display = 'none';
    document.querySelector('.canvas-page-container').style.display = 'none';
    renderMemesPage();
}
function showGalleryPage() {
    document.body.classList.remove('menu-open');
    defaultMeme();
    document.querySelector('.main-gallery-container').style.display = 'grid';
    // document.querySelector('.about').style.display='block';
    document.querySelector('.saved-meme-container').style.display = 'none';
    document.querySelector('.canvas-page-container').style.display = 'none';
}
function onNavToggle() {
    document.body.classList.toggle('menu-open');
}

function defaultMeme() {

    document.querySelector('.txt-input').placeholder = 'Add Text Here!';
    document.querySelector('.txt-input').value = '';

    createMeme();

}



