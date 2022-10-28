'use strict'



function onInit() {
    renderGallery();
    gSavedMemes = loadFromStorage(STORAGE_KEY);
    if (!gSavedMemes || gSavedMemes.length === 0) gSavedMemes = [];
}


function renderMeme() {
    const meme = getMeme();
    const elImg = getElImgById(meme.selectedImgId);
    document.querySelector('.main-gallery-container').style.display = 'none';
    document.querySelector('.saved-meme-container').style.display = 'none';
    document.querySelector('.canvas-page-container').style.display = 'grid';
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
    if (meme.lines.length) {
        meme.lines.forEach(line => drawTextLine(line));
        if (gForDownload) {
            gForDownload = false;
            return;
        }

        markSelectedTextLine(meme.lines[meme.selectedLineIdx]);
    }
}
function renderSavedMeme(imgId) {
    
    const meme = getMeme();
    const elImg = new Image();
    elImg.src=gSavedMemes[imgId];
    // const elImg = getElImgById(meme.selectedImgId);
    document.querySelector('.main-gallery-container').style.display = 'none';
    document.querySelector('.saved-meme-container').style.display = 'none';
    document.querySelector('.canvas-page-container').style.display = 'grid';
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
    if (meme.lines.length) {
        meme.lines.forEach(line => drawTextLine(line));
        if (gForDownload) {
            gForDownload = false;
            return;
        }

        markSelectedTextLine(meme.lines[meme.selectedLineIdx]);
    }
}

function onSavedImgSelect(imgId) {
    gMeme.selectedImgId=imgId;
    gMeme.isSavedMeme=true;
    initSavedMeme(imgId);
}
function onImgSelect(imgId) {
    initMeme(imgId);
}
function onShowSavedMemesPage(){
    showSavedMemesPage();
}
function onShowGalleryPage(){
    showGalleryPage();
}
function onShowAboutPage(){
    showAboutPage();
}
function renderMemesPage(){
    const imgs= gSavedMemes;
    const strHTML= imgs.map((img,idx)=>{
        return `<div class="img-container" ><img id=${idx} onclick="onSavedImgSelect(${idx})" src="${img}"> <br>
         <button class="memes-page-delete-btn" onclick="onDeleteMeme(${idx})">Delete Meme</button>
        </div>`
    });
    document.querySelector('.saved-meme-container').innerHTML = strHTML.join('');
}


function onDeleteMeme(idx){
    gSavedMemes.splice(idx,1);
    saveToStorage(STORAGE_KEY,gSavedMemes);
    renderMemesPage();
}