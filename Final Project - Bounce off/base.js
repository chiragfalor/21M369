let currentLevel;
let cur_level_num = 0;
let levels = [];
// think about sonic design
// what are collision sounds, what background music, how sounds change as we progress through levels
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setup() {
    createCanvas(800, 800);
    noStroke();
    frameRate(30);
    ellipseMode(RADIUS);
    ctx = document.getElementById('defaultCanvas0').getContext('2d');

        // Fetch level descriptions from JSON file
    // fetch('levels.json')
    // .then(response => response.json())
    // .then(data => {
    //     // Create Level objects from the JSON data
    //     levels = data.map(levelData => {
    //         const squares = levelData.squares.map(squareData => new Square(squareData.x, squareData.y, squareData.size, squareData.isCollidable, ctx));
    //         const discs = levelData.discs.map(discData => new Disc(discData.x, discData.y, discData.radius, discData.isCollidable, ctx));
    //         return new Level([...squares, ...discs]);
    //     });

    // })
    // .catch(error => {
    //     console.error('Error loading level descriptions:', error);
    // });

    // we will be reading the levels from a file instead of hardcoding them
    levels.push(new Level([new Square(100, 100, 10,true, ctx), new Square(500, 100, 100, true, ctx), new Square(100, 500, 100, false, ctx), new Disc(250, 250, 50, false, ctx)]) );

    // read from json in levels/
    

    currentLevel = levels[cur_level_num];

    currentLevel.setup();
}

function draw() {
    currentLevel.update();

    if (mouseIsPressed) {
        currentLevel.mouseIsPressed();
    }
}



function keyPressed() {
    currentLevel.keyPressed();
}
  
function mousePressed() {
currentLevel.mousePressed();
}

function mouseReleased() {
currentLevel.mouseReleased();
}
  
    