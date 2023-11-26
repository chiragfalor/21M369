let currentLevel;
let cur_level_num = 0;
// let levels = [];
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

    levels = [new Level([], ctx)]
    currentLevel = levels[cur_level_num];
    currentLevel.setup();

    const get_levels = async () => {
        let response = await fetch('levels.json');
        let data = await response.json();
        return data.map(levelData => {
            const rectangles = levelData.rectangles.map(rectangleData => new Rectangle(ctx, rectangleData.x, rectangleData.y, rectangleData.width, rectangleData.height, rectangleData.is_hard, rectangleData.freq));
            const squares = levelData.squares.map(squareData => new Square(ctx, squareData.x, squareData.y, squareData.size, squareData.is_hard, squareData.freq));
            const discs = levelData.discs.map(discData => new Disc(ctx, discData.x, discData.y, discData.radius, discData.is_hard, discData.freq ));
            return new Level([...squares, ...discs, ...rectangles], ctx);
        });
    }

    get_levels().then(result => {
        levels = result;
        currentLevel = levels[cur_level_num];
        currentLevel.setup()
    });
}


function draw() {
    completed = currentLevel.update();
    if (completed) {
        cur_level_num++;
        if (cur_level_num >= levels.length) {
            cur_level_num = 0;
        }
        currentLevel = levels[cur_level_num];
        currentLevel.setup();
        console.log("level completed");
        console.log(cur_level_num);
        console.log(levels.length);
    }

    // write level number at top left
    fill(0);
    textSize(32);
    text(cur_level_num, 10, 30);



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
  
    