var img = new Image();
img.src = 'https://cdn.glitch.com/24dc13be-ff08-4007-bf38-7c45e0b5d9e1%2FIMG_20180826_114200.jpg?1535486103628'

var gameAspectRatio = img.naturalWidth) / img.naturalHeight
game-area.style.setProperty('--game-width', gameAspectRatio)
