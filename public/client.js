var gameArea = document.getElementById('game-area');
var img = new Image();
img.src = 'https://cdn.glitch.com/24dc13be-ff08-4007-bf38-7c45e0b5d9e1%2FIMG_20180826_104348.jpg?1535662149619'

var gameAspectRatio = img.naturalWidth / img.naturalHeight
gameArea.style.setProperty('--img-url', `url(${img.src}`)

if (gameAspectRatio > 1) {
  var maxViewportWidth = 90;
  gameArea.style.setProperty('--game-width', `${maxViewportWidth}vw`)
  var height = maxViewportWidth / gameAspectRatio
  gameArea.style.setProperty('--game-height', `${height}vw`)
} else {
  var maxViewportHeight = 80;
  var width = maxViewportHeight * gameAspectRatio
  gameArea.style.setProperty('--game-width', `${width}vh`)
  gameArea.style.setProperty('--game-height', `${maxViewportHeight}vh`)
}

function createTiles() {
  var tileHTML=`<div class="tile-container">
          <div class="tile"></div>
        </div>`
  var tiles = [...Array(16)].map(_ => tileHTML)
  
  gameArea.innerHTML = tiles.join("")
}

createTiles()