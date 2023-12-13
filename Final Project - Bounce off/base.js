let currentLevel;
let cur_level_num = 0;
// let levels = [];
let demo;
const show_demo = false;

let totalStart = 0;

let lvlTimeStart = 0;
let nonLvl = false;
let lastLvlendTime = 0;

let last_mouse_press = 0;

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
            const triangles = levelData.triangles.map(triangleData => new Triangle(ctx, triangleData.x, triangleData.y, triangleData.x2, triangleData.y2, triangleData.x3, triangleData.y3, triangleData.is_hard, triangleData.freq));
            const bouncer_size = levelData.bouncer_size;
            const objects = [...squares, ...discs, ...rectangles, ...triangles];
            return new Level(objects, bouncer_size, ctx);
        });
    }

    get_levels().then(result => {
        levels = result;
        currentLevel = levels[cur_level_num];
        currentLevel.setup()
    });

    if (show_demo) {
    demo = createImg('demo.gif', 'demo');
    demo.position(0, 0);
    demo.size(width, height);
    }


}


function draw() {
    if (nonLvl) {
    // display a screen saying level completed
    let timeStart = millis();
    background(200, 100, 100);
    fill(0, 255, 255);
    textSize(64);
    text("Level " + cur_level_num + " completed!", width/2 - 250, height/2-50);
    // display time of level completion
    let seconds = Math.floor((lastLvlendTime - lvlTimeStart)/100)/10;
    text("Time: " + seconds +"s", width/2 - 150, height/2 + 50);
    let totalSeconds = Math.floor((lastLvlendTime - totalStart)/100)/10;
    text("Total Time: " + totalSeconds +"s", width/2 - 220, height/2 + 150);
    if (millis() - lastLvlendTime > 2000) {
        nonLvl = false;
        currentLevel = levels[cur_level_num];
        currentLevel.setup();
        lvlTimeStart = millis();
    }
} else {
    
    completed = currentLevel.update();

    if (completed) {
        console.log("level completed: " + cur_level_num);
        cur_level_num++;
        if (cur_level_num >= levels.length) {
            cur_level_num = 0;
        }
        lastLvlendTime = millis();
        nonLvl = true;
    }

    // write level number at top left
    fill(0);
    textSize(32);
    text(cur_level_num+1, 10, 30);

    
    // have timer running on the top right
    fill(0);
    textSize(32);
    let seconds = Math.floor((millis() - lvlTimeStart)/100)/10;
    text(seconds, width - 100, 30);



    if (mouseIsPressed) {
        if (!demo) {
        currentLevel.mouseIsPressed();
        }
    }
}
}



function keyPressed() {
    currentLevel.keyPressed();
}
  
function mousePressed() {
    // if demo is still playing don't do anything
    if (!demo) {
        // if time from last mouse press is too short, don't do anything
        if (millis() - last_mouse_press < 500) {
            return;
        }
        last_mouse_press = millis();
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
  
    