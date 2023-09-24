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

let balls = [];

class Ball {
  constructor(x, y, vx, vy, r) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.r = r;
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    // Update the position of the ball
    this.pos.add(this.vel);

    // Test to see if the ball exceeds the boundaries of the screen
    // If it does, reverse its direction by multiplying by -1
    if (this.pos.x > width - this.r || this.pos.x < this.r) {
      this.vel.x *= -1;
    }
    if (this.pos.y > height - this.r || this.pos.y < this.r) {
      this.vel.y *= -1;
    }

    // Check if the ball is outside of the triangle
    if (!pointInTriangle(this.pos, v1, v2, v3)) {
      const nearestEdge = getNearestEdge(this.pos, v1, v2, v3);
      const normal = createVector(-nearestEdge.y, nearestEdge.x).normalize(); // normalize the nearestEdge vector
      const dot = p5.Vector.dot(normal, this.vel);
      const reflected = p5.Vector.sub(this.vel, p5.Vector.mult(normal, 2 * dot));
      this.vel = reflected;
    }
  }

  draw() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }
}

// Define the vertices of the triangle

function setup() {
  createCanvas(720, 400);
  noStroke();
  frameRate(30);
  ellipseMode(RADIUS);
  // Set the starting position of the shape
  // for (let i = 0; i < 10; i++) {
  //   const x = random(width);
  //   const y = random(height);
  //   const vx = random(-5, 5);
  //   const vy = random(-5, 5);
  //   const r = 20;
  //   balls.push(new Ball(x, y, vx, vy, r));
  // }
  
  v1 = createVector(100, 100);
  v2 = createVector(600, 100);
  v3 = createVector(350, 350);

}


function draw() {
  background(102);
  // draw the green triangle and pink ball
  fill(0, 255, 0);
  triangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);

  for (const ball of balls) {
    ball.update();
    ball.draw();
  }
}

function mousePressed() {
  // Set the starting position of the ball
  const x = mouseX;
  const y = mouseY;
  // Set the starting radius of the ball to 0
  const r = 0;
  // Record the start time of the mouse press
  mousePressedTime = millis();
  // Create a new Ball object and add it to the balls array
  balls.push(new Ball(x, y, 0, 0, r));
}

function mouseReleased() {
  const ball = balls[balls.length - 1];
  const duration = millis() - mousePressedTime;
  ball.r = map(duration, 0, 1000, 0, 50);
  ball.r = min(ball.r, 50);
  // the release coordinate compared to ball position
  const dx = mouseX - ball.pos.x;
  const dy = mouseY - ball.pos.y;
  ball.vel.x = dx / 10;
  ball.vel.y = dy / 10;

}



// utils


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
