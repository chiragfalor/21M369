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

        // // Fetch level descriptions from JSON file
        // [
        //     {   "name": "level1",
        //         "squares": [
        //             {
        //                 "x": 100,
        //                 "y": 100,
        //                 "size": 10,
        //                 "isCollidable": true
        //             },
        //             {
        //                 "x": 500,
        //                 "y": 100,
        //                 "size": 100,
        //                 "isCollidable": true
        //             },
        //             {
        //                 "x": 100,
        //                 "y": 500,
        //                 "size": 100,
        //                 "isCollidable": false
        //             }
        //         ],
        //         "discs": [
        //             {
        //                 "x": 250,
        //                 "y": 250,
        //                 "radius": 50,
        //                 "isCollidable": false
        //             }
        //         ]
        //     }
        // ]

    levels = [new Level([], ctx)]
    currentLevel = levels[cur_level_num];
    currentLevel.setup();

    const get_levels = async () => {
        let response = await fetch('levels.json');
        let data = await response.json();
        return data.map(levelData => {
            const rectangles = levelData.rectangles.map(rectangleData => new Rectangle(ctx, rectangleData.x, rectangleData.y, rectangleData.width, rectangleData.height, rectangleData.isCollidable, rectangleData.freq));
            const squares = levelData.squares.map(squareData => new Square(ctx, squareData.x, squareData.y, squareData.size, squareData.isCollidable, squareData.freq));
            const discs = levelData.discs.map(discData => new Disc(ctx, discData.x, discData.y, discData.radius, discData.isCollidable, discData.freq ));
            return new Level([...squares, ...discs, ...rectangles], ctx);
        });
        // return levels;
    }

    // levels = 
    
    // get promiseresult
    get_levels().then(result => {
        levels = result;
        currentLevel = levels[cur_level_num];
        currentLevel.setup()
        // levels = result;
    });
    
    // console.log(levels);

    // console.log(levels)



    // // it is a promise
    // // levels = get_levels();


    // currentLevel = levels[cur_level_num];
    // // console.log(levels);

    // currentLevel.setup();
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
  
    