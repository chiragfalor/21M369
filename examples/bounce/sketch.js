let rad = 10; // Width of the shape
let xpos, ypos; // Starting position of shape
let v1, v2, v3;
let xspeed = 2.8; // Speed of the shape
let yspeed = 2.2; // Speed of the shape

let xdirection = 1; // Left or Right
let ydirection = 1; // Top to Bottom

// function createVector(x, y) {
//   return { x, y };
// }



// Define the vertices of the triangle

function setup() {
  createCanvas(720, 400);
  noStroke();
  frameRate(30);
  ellipseMode(RADIUS);
  // Set the starting position of the shape
  xpos = width / 2;
  ypos = height / 2;
  
  v1 = createVector(100, 100);
  v2 = createVector(600, 100);
  v3 = createVector(350, 350);

}


function draw() {
  background(102);
  // draw the green triangle and pink ball
  fill(0, 255, 0);
  triangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);

  // Update the position of the shape
  xpos = xpos + xspeed * xdirection;
  ypos = ypos + yspeed * ydirection;

  // Test to see if the shape exceeds the boundaries of the screen
  // If it does, reverse its direction by multiplying by -1
  if (xpos > width - rad || xpos < rad) {
    xdirection *= -1;
  }
  if (ypos > height - rad || ypos < rad) {
    ydirection *= -1;
  }

  // Check if the shape is outside of the triangle

  const p = createVector(xpos, ypos);
  if (!pointInTriangle(p, v1, v2, v3)) {
    const nearestEdge = getNearestEdge(p, v1, v2, v3);
    const normal = createVector(-nearestEdge.y, nearestEdge.x).normalize(); // normalize the nearestEdge vector
    const dot = p5.Vector.dot(normal, createVector(xspeed, yspeed));
    const reflected = p5.Vector.sub(createVector(xspeed, yspeed), p5.Vector.mult(normal, 2 * dot));
    // print(nearestEdge);
    xspeed = reflected.x;
    yspeed = reflected.y;
  }
  
  fill(255, 0, 255);
  ellipse(xpos, ypos, rad, rad);

  // ellipse(xpos, ypos, rad, rad);
}

function pointInTriangle(p, v1, v2, v3) {
  const b1 = sign(p, v1, v2) < 0;
  const b2 = sign(p, v2, v3) < 0;
  const b3 = sign(p, v3, v1) < 0;
  return ((b1 == b2) && (b2 == b3));
}

function sign(p1, p2, p3) {
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

function getNearestEdge(p, v1, v2, v3) {
  const edges = [
    [v1, v2],
    [v2, v3],
    [v3, v1]
  ];
  let nearestEdge = null;
  let minDist = Infinity;
  for (const [v1, v2] of edges) {
    const dist = distToSegment(p, v1, v2);
    if (dist < minDist) {
      nearestEdge = p5.Vector.sub(v2, v1);
      minDist = dist;
    }
  }
  return nearestEdge;
}

function distToSegment(p, v1, v2) {
  const v = p5.Vector.sub(v2, v1);
  const w = p5.Vector.sub(p, v1);
  const c1 = p5.Vector.dot(w, v);
  if (c1 <= 0) {
    return p5.Vector.dist(p, v1);
  }
  const c2 = p5.Vector.dot(v, v);
  if (c2 <= c1) {
    return p5.Vector.dist(p, v2);
  }
  const b = c1 / c2;
  const pb = p5.Vector.add(v1, p5.Vector.mult(v, b));
  return p5.Vector.dist(p, pb);
}
