'use strict'


function resizeCanvas() {
    const elContainer = document.querySelector('.canvas')
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
}