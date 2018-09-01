var gameArea = document.getElementById('game-area');
var img = new Image();
img.src = 'https://cdn.glitch.com/24dc13be-ff08-4007-bf38-7c45e0b5d9e1%2FIMG_20180826_104348.jpg?1535662149619'
var tileState = {
  tileLoc: {},
  isNull: ''
};

function boardSetup() {
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
}

function createTiles() {
  var tileHTML=`<div class="tile-container">
          <div class="tile"></div>
        </div>`
  var tiles = [...Array(16)].map(_ => tileHTML)
  
  gameArea.innerHTML = tiles.join("")
}

function tileSetup() {
  var tileContainerArray = document.querySelectorAll('.tile-container')
  tileContainerArray.forEach(function(container,index) {
    var backgroundPositionX = (index % 4) * 100/3
    var backgroundPositionY = Math.floor(index/4) * 100/3
    var gridColumnStart = (index % 4) + 1
    var gridRowStart = Math.floor(index/4) + 1
    
    container.id = `container-${index}`
    container.style.backgroundPosition = `${backgroundPositionX}% ${backgroundPositionY}%`
    container.style.gridColumn = `${gridColumnStart} / ${gridColumnStart + 1}`
    container.style.gridRow = `${gridRowStart} / ${gridRowStart + 1}`
    
    tileState['tileLoc'][container.id] = index
    
    container.addEventListener('click', function(e) {
      console.log(e);
      console.log(tileState)
    })
  })
  //TODO: make this user-customisable
  deleteTile('container-15')
}

function deleteTile(tileId) {
  document.getElementById(tileId).remove()
  tileState['isNull'] = tileState['tileLoc'][tileId]
  tileState['tileLoc'][tileId] = ''
}

window.onload = function() {
  boardSetup()
  createTiles()
  tileSetup()
}

// Game play
function moveTile(tile) {
  checkValidMove()
}

function checkValidMove(start, end) {
  tileState.indexOf[null]
}

function drawGame() {

}