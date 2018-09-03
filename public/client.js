var gameArea = document.getElementById('game-area');
var img = new Image();
img.src = 'https://cdn.glitch.com/24dc13be-ff08-4007-bf38-7c45e0b5d9e1%2FIMG_20180826_104348.jpg?1535662149619'
var tileState = {
  tileLoc: {},
  nullLoc: ''
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
      if (e.target !== this)
        e.target.parentElement.click()
      else
        moveTile(e.target.id)
    })
  })
  //TODO: make this user-customisable
  deleteTile('container-15')
}

function deleteTile(tileId) {
  document.getElementById(tileId).remove()
  tileState['nullLoc'] = tileState['tileLoc'][tileId]
  tileState['tileLoc'][tileId] = ''
}

window.onload = function() {
  boardSetup()
  createTiles()
  tileSetup()
  //testValidMoves()
}

// Game play
function moveTile(tileId) {
  var tileLoc = getTileLoc(tileId);
  var nullLoc = getNullLoc();
  if (checkValidMove(tileLoc, nullLoc)) {
    tileState['tileLoc'][tileId] = nullLoc
    tileState['nullLoc'] = tileLoc
    console.log(tileState)
    drawGame();
  }
}

function checkValidMove(tileLoc, nullLoc) {
  // Check if they're directly vertically above or below each other
  if (Math.abs((tileLoc - nullLoc)) === 4) {
    return true;
  } 
  // Check if they're next to each other on the same row
  else if (Math.abs(tileLoc - nullLoc) === 1 && 
           [tileLoc % 4, nullLoc % 4].some(val => ![0,1].includes(val) )) {
    return true;
  } else {
    return false;
  }
}

function drawGame() {
  var tiles = tileState['tileLoc']
  for (var key in tiles) {
    var tileLoc = tiles[key]
    
    if (tileLoc) { // only attempt to draw tile if it has a location
      var gridColumnStart = (tileLoc % 4) + 1
      var gridRowStart = Math.floor(tileLoc/4) + 1

      var container = document.getElementById(key)
      container.style.gridColumn = `${gridColumnStart} / ${gridColumnStart + 1}`
      container.style.gridRow = `${gridRowStart} / ${gridRowStart + 1}`
    }
  };
}

function getTileLoc(tileId) {
  return tileState['tileLoc'][tileId]
}
  
function getNullLoc() {
  return tileState['nullLoc']
}

function testValidMoves() {
  console.log(`checkValidMove(1, 5) is true: ${checkValidMove(1, 5) === true}`)
  console.log(`checkValidMove(13, 5) is false: ${checkValidMove(13, 5) === false}`)
  console.log(`checkValidMove(5, 1) is true: ${checkValidMove(5, 1) === true}`)
  console.log(`checkValidMove(4, 5) is false: ${checkValidMove(4, 5) === false}`)
  console.log(`checkValidMove(9, 8) is false: ${checkValidMove(9, 8) === false}`)
  console.log(`checkValidMove(1, 2) is true: ${checkValidMove(1, 2) === true}`)
  console.log(`checkValidMove(6, 2) is true: ${checkValidMove(6, 2) === true}`)
  return true
}