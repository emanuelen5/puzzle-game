// Variables holding global game state
// tileState holds the game state at any point in time
const tileState = {
    // tileLoc will be set up as a hash of objects of the form {CSS id: tile position} where the locations are numbered 0 to 15.
    // nullLoc is the position of the gap, again numbers 0 through 15.
    tileLoc: {},
    nullLoc: ""
};
// gameWonState holds the state of the game that the player is aiming for
const gameWonState = {
    tileLoc: {},
    started: false
};
let move_count = 0;
const total_tile_count = 9;

// Set up the board image, dimensions and initialise the tiles
function gameSetup() {
    const gameArea = document.getElementById("game-area");
    const img = new Image();
    // 🔨 Change the following URL to customise with your own picture
    img.src = "image.jpg";

    img.onload = function () {
        const gameAspectRatio = img.naturalWidth / img.naturalHeight;
        gameArea.style.setProperty("--img-url", `url(${img.src}`);
        gameArea.style.setProperty("--game-aspect-ratio", gameAspectRatio);

        const tileHTML =
            `<div class="tile" tabindex="0">
        <div class="number"></div>
        <div class="announcement"></div>
      </div>`;
        const tiles = [...Array(9)].map(_ => tileHTML);

        gameArea.innerHTML = tiles.join("");

        tileSetup();
        randomizeBoard();
    };
}

// Position the image in the right place on each tile to reassemble it on the grid, and enable click events on the tiles
function tileSetup() {
    const texts = ["Vi", "har", "för-", "lov-", "at", "oss", "!!!", "<3"];
    const tileArray = document.querySelectorAll(".tile");
    tileArray.forEach((tile, index) => {
        tile.id = `tile-${index}`;

        // inexplicably, Chrome Android browser does not like it when some background image positions are set to 100%.	
        // therefore capping this to 99.6%, which seems to display ok
        const backgroundPositionX = ((index % 3) * 99.6) / 2;
        const backgroundPositionY = (Math.floor(index / 3) * 99.6) / 2;
        tile.style.backgroundPosition = `${backgroundPositionX}% ${backgroundPositionY}%`;

        tileState["tileLoc"][tile.id] = index;
        gameWonState["tileLoc"][tile.id] = index;

        tile.querySelector(".number").innerText = index + 1;
        tile.querySelector(".announcement ").innerText = texts[index];

        tile.addEventListener("mousedown", on_click_tile);
        tile.addEventListener("touchstart", on_click_tile);
    });

    //TODO: make choice of tile to remove user-customisable
    deleteTile("tile-8");
}

function on_click_tile(e) {
    e.preventDefault();
    makePlay(e.target.id);
}

function deleteTile(tileId) {
    document.getElementById(tileId).remove();
    tileState["nullLoc"] = tileState["tileLoc"][tileId];
    delete tileState["tileLoc"][tileId];
    delete gameWonState["tileLoc"][tileId];
}

// Put the board into a random state by making N moves back from the solved state.
// We can't use a randomised configuration, as it only results in a solvable board 50% of the time.
function randomizeBoard() {
    gameWonState.started = true;
    document.body.classList.remove("winning-animation");

    let count = 100;
    while (count > 0) {
        automaticMove();
        --count;
    }
    drawGame();
    set_randomize_button_visibility(show = false);
    move_count = 0;
}

function automaticMove() {
    if (document.querySelectorAll(".moving").length === 0) {
        const nullLoc = getNullLoc();
        const tileLocs = getTileLocs();

        const validMoves = {};

        for (let key in tileLocs) {
            if (findAdjacencyDirection(tileLocs[key], nullLoc))
                validMoves[key] = tileLocs[key];
        }
        const candidateTileId = Object.keys(validMoves)[
            Math.floor(Math.random() * Object.keys(validMoves).length)
        ];

        tileState["tileLoc"][candidateTileId] = nullLoc;
        tileState["nullLoc"] = validMoves[candidateTileId];
    }
    return null;
}

function checkGameWon() {
    return (
        gameWonState.started &&
        Object.keys(tileState["tileLoc"]).every(
            key => tileState["tileLoc"][key] === gameWonState["tileLoc"][key]
        )
    );
}

// Game play
function makePlay(tileId) {
    const tileLoc = getTileLoc(tileId);
    const nullLoc = getNullLoc();
    const tileRelativePos = findAdjacencyDirection(tileLoc, nullLoc);
    if (tileRelativePos) {
        moveTile(tileId, tileLoc, nullLoc);
        move_count++;
        if (move_count == 100) {
            set_give_up_button_visibility(show = true);
            set_randomize_button_visibility(show = false);
        }
    }
    if (checkGameWon()) {
        win_game();
    }
}

function set_give_up_button_visibility(show) {
    const btn = document.getElementById("give-up-button");
    btn.style.display = show ? "block" : "none";
}

function set_randomize_button_visibility(show) {
    const btn = document.getElementById("randomize-button");
    btn.style.display = show ? "block" : "none";
}

function win_game() {
    console.log(`You won after ${move_count} moves`);
    const texts = document.querySelectorAll(".announcement");
    texts.forEach((text, index) => { text.style.display = "block"; })

    set_randomize_button_visibility(show = true);
    set_give_up_button_visibility(show = false);
    document.body.classList.add("winning-animation");
    setTimeout(function () {
        document.body.classList.remove("winning-animation");
    }, 10000);
}

function reset_board() {
    for (let i = 0; i < total_tile_count - 1; i++) {
        const tile_id = `tile-${i}`;
        tileState["tileLoc"][tile_id] = i;
    }
    tileState["nullLoc"] = total_tile_count - 1;
}

function give_up() {
    reset_board();
    drawGame();
    win_game();
}

// TODO: Refactor Tile into a class that contains all of this information
// It's not possible to apply transitions to elements moving between different positions on a grid.
// So here we fake it by applying a translate function in the direction in which the tile needs to move.
// We then redraw the board with all tiles on the grid once the transition's done.
function moveTile(tileId, tileLoc, nullLoc) {
    tileState["tileLoc"][tileId] = nullLoc;
    tileState["nullLoc"] = tileLoc;

    const tileEl = document.getElementById(tileId);

    const direction = findAdjacencyDirection(tileLoc, nullLoc);
    // need to move the tile 100% of the x or y direction, plus 3px to allow for grid-gap
    const moveX = `calc(${direction[0] * -100}% + ${direction[0] * -3}px)`;
    const moveY = `calc(${direction[1] * -100}% + ${direction[1] * -3}px)`;

    // The .moving class can't exist until we know what direction it needs to move in.
    // So to add the rule, we add it to the stylesheet, not to the element itself.
    const styleSheetIndex = Object.keys(document.styleSheets).find(key =>
        document.styleSheets[key].href.includes("/style.css")
    );
    document.styleSheets[styleSheetIndex].insertRule(`#${tileId}.moving { 
      transform: translate(${moveX}, ${moveY}); 
  }`);

    tileEl.addEventListener("transitionend", function () {
        // Note: new rules are added at 0, so we know we can remove the rule we added earlier from position 0.
        // We'll still check in case we had a race condition and it's already gone :)
        const cssRules = document.styleSheets[styleSheetIndex].cssRules;
        const styleRuleIndex = Object.keys(cssRules).find(
            key => cssRules[key].selectorText === `#${tileId}.moving`
        );
        if (styleRuleIndex) {
            document.styleSheets[styleSheetIndex].deleteRule(styleRuleIndex);
        }

        tileEl.classList.remove("moving");
        redraw_tile(tileEl);
        tileEl.style.pointerEvents = null;
    });

    tileEl.classList.add("moving");
    tileEl.style.pointerEvents = "none";
}

// Given a tile location and the location of the empty spot, tell us whether a move's valid, and if so, in what direction
function findAdjacencyDirection(tileLoc, nullLoc) {
    /* Return an x or y direction relative to the null space if the tile is adjacent, or if it isn't then return null
               [0, -1]
       [-1, 0]  null  [1, 0]
               [0, 1]
    */
    if (tileLoc - nullLoc === 3) {
        return [0, 1];
    } else if (tileLoc - nullLoc === -3) {
        return [0, -1];
    } else if (tileLoc - nullLoc === 1 && tileLoc % 3 !== 0) {
        return [1, 0];
    } else if (tileLoc - nullLoc === -1 && tileLoc % 3 !== 2) {
        return [-1, 0];
    } else return null;
}

// Given the current board state, draw all the tiles on the grid at the right spots
function drawGame() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile) => {
        redraw_tile(tile);
    });
}

function redraw_tile(tile) {
    const tileLoc = getTileLoc(tile.id);

    const gridColumnStart = (tileLoc % 3) + 1;
    const gridRowStart = Math.floor(tileLoc / 3) + 1;

    tile.style.gridColumn = `${gridColumnStart} / ${gridColumnStart + 1}`;
    tile.style.gridRow = `${gridRowStart} / ${gridRowStart + 1}`;
}

function getTileLoc(tileId) {
    return getTileLocs()[tileId];
}

function getTileLocs() {
    return tileState["tileLoc"];
}

function getNullLoc() {
    return tileState["nullLoc"];
}

function testValidMoves() {
    console.log(
        `findAdjacencyDirection(1, 0) is [1, 0]: ${findAdjacencyDirection(
            1,
            0
        )[0] === 1 && findAdjacencyDirection(1, 0)[1] === 0}`
    );
    console.log(
        `findAdjacencyDirection(1, 5) is [0, -1]: ${findAdjacencyDirection(
            1,
            5
        )[0] === 0 && findAdjacencyDirection(1, 5)[1] === -1}`
    );
    console.log(
        `findAdjacencyDirection(13, 5) is null: ${findAdjacencyDirection(13, 5) ===
        null}`
    );
    console.log(
        `findAdjacencyDirection(5, 1) is [0, 1]: ${findAdjacencyDirection(
            5,
            1
        )[0] === 0 && findAdjacencyDirection(5, 1)[1] === 1}`
    );
    console.log(
        `findAdjacencyDirection(3, 4) is null: ${findAdjacencyDirection(3, 4) ===
        null}`
    );
    console.log(
        `findAdjacencyDirection(4, 5) is [-1, 0]: ${findAdjacencyDirection(
            4,
            5
        )[0] === -1 && findAdjacencyDirection(4, 5)[1] === 0}`
    );
    console.log(
        `findAdjacencyDirection(8, 7) is null: ${findAdjacencyDirection(8, 7) ===
        null}`
    );
    console.log(
        `findAdjacencyDirection(9, 8) is [1, 0]: ${findAdjacencyDirection(
            9,
            8
        )[0] === 1 && findAdjacencyDirection(9, 8)[1] === 0}`
    );
    console.log(
        `findAdjacencyDirection(1, 2) is [-1, 0]: ${findAdjacencyDirection(
            1,
            2
        )[0] === -1 && findAdjacencyDirection(1, 2)[1] === 0}`
    );
    console.log(
        `findAdjacencyDirection(6, 2) is [0, 1]: ${findAdjacencyDirection(
            6,
            2
        )[0] === 0 && findAdjacencyDirection(6, 2)[1] === 1}`
    );
    return true;
}

// Start the game once everything's loaded.
window.onload = function () {
    // account for browser chrome on mobile by setting the height of the document to the window 
    //document.body.style.height = `${window.innerHeight}px`;
    gameSetup();
    //testValidMoves()
};
