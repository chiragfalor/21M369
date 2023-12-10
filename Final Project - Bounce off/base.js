let currentLevel;
let cur_level_num = 0;
// let levels = [];
let demo;

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
            const bouncer_size = levelData.bouncer_size;
            return new Level([...squares, ...discs, ...rectangles], bouncer_size, ctx);
        });
    }

    get_levels().then(result => {
        levels = result;
        currentLevel = levels[cur_level_num];
        currentLevel.setup()
    });
    // play the demo.gif over the canvas at the start
    demo = createImg('demo.gif', 'demo');
    demo.position(0, 0);
    demo.size(width, height);
    // remove after the first click
    // demo.style('z-index', '-1');


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
        console.log("level completed: " + cur_level_num);
    }

    // write level number at top left
    fill(0);
    textSize(32);
    text(cur_level_num, 10, 30);



    if (mouseIsPressed) {
        if (!demo) {
        currentLevel.mouseIsPressed();
        }
    }
}



function keyPressed() {
    currentLevel.keyPressed();
}
  
function mousePressed() {
    // if demo is still playing don't do anything
    if (!demo) {
        currentLevel.mousePressed();
    }
    console.log("mouse pressed");
// currentLevel.mousePressed();
}

function mouseReleased() {
    if (demo) {
        demo.remove();
        demo = null;
        return;
    } else {
        currentLevel.mouseReleased();
    }
// currentLevel.mouseReleased();
}
  
    