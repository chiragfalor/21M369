// explore how to constrain the user to quantized rhythms
// what progression do we want the users to experience?
// keeping it exploratory but allowing users to create musical pieces
// Also play with sound modulation
// circle would be great for rhythm and we can fake constrain the user to quantized rhythms

let mouseEnergy = 0.1;
let volumeFactor = 1;
let resonanceFactor = 1;

// equilateral straight triangle
let [x1, y1] = [50, 350];
let [x2, y2] = [250, 50];
let [x3, y3] = [450, 350];

// sound of sides
const petatonic_pitch = [0, 7, 4, 12, 9, 2];

let width = 500;
let height = 400;

let v1, v2, v3;
let osc, envelope;
let balls = [];


var selectedPreset=_tone_0000_JCLive_sf2_file;
var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContextFunc();
var player=new WebAudioFontPlayer();
player.loader.decodeAfterLoading(audioContext, '_tone_0000_JCLive_sf2_file');

class Ball {
  constructor(x, y, vx, vy, r) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.r = r;
    this.color = color(random(255), random(200), 50+random(205));
  }

  update() {
    // Update the position of the ball
    this.pos.add(this.vel);

    // Update the velocity of the ball
    this.update_velocity();

    // Update the age of the ball
    this.update_age();
  }

  update_velocity() {
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
      this.play_collision_sound();

      const nearestEdge = getNearestEdge(this.pos, v1, v2, v3);
      const normal = createVector(-nearestEdge.y, nearestEdge.x).normalize(); // normalize the nearestEdge vector
      const dot = p5.Vector.dot(normal, this.vel);
      const reflected = p5.Vector.sub(this.vel, p5.Vector.mult(normal, 2 * dot));
      this.vel = reflected;
    }
  }

  update_age() {
    this.r -= 0.1;
    // Remove the ball from the balls array when the radius becomes 0
    if (this.r < 0) {
      const index = balls.indexOf(this);
      balls.splice(index, 1);
    }
  }

  play_collision_sound() {
    const freqIndex = getNearestEdgeIndex(this.pos, v1, v2, v3);
    player.queueWaveTable(audioContext, audioContext.destination, selectedPreset,0, 12*5+ petatonic_pitch[freqIndex], 0.5);
  }

  draw() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }
}



function setup() {
  createCanvas(width, height);
  noStroke();
  frameRate(30);
  ellipseMode(RADIUS);

  v1 = createVector(x1, y1);
  v2 = createVector(x2, y2);
  v3 = createVector(x3, y3);


}


function draw() {
  background(100, 100, 100, 100);

  // Draw the triangle
  fill(76, 255, 0);
  triangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);

  for (const ball of balls) {
    ball.update();
    ball.draw();
  }

  // if mouse is pressed, the last ball radius is growing
  if (mouseIsPressed) {
    const ball = balls[balls.length - 1];
    const duration = millis() - mousePressedTime;
    ball.r = map(duration, 0, 1000, 0, 50);
    ball.r = min(ball.r, 50);
  }
}

function mousePressed() {
  mousePressedTime = millis();
  balls.push(new Ball(mouseX, mouseY, 0, 0, 0.1));
}

function mouseReleased() {
  const ball = balls[balls.length - 1];
  const duration = millis() - mousePressedTime;
  ball.r = map(duration, 0, 1000, 0, 50);
  ball.r = min(ball.r, 50);
  // the release coordinate compared to ball position is the velocity
  ball.vel.x = (mouseX - ball.pos.x) * mouseEnergy;
  ball.vel.y = (mouseY - ball.pos.y) * mouseEnergy;

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
  const nearestEdgeIndex = getNearestEdgeIndex(p, v1, v2, v3) % 3;
  const [v1_, v2_] = edges[nearestEdgeIndex];
  const nearestEdge = p5.Vector.sub(v2_, v1_);
  return nearestEdge;

}

function getNearestEdgeIndex(p, v1, v2, v3) {
  const edges = [
    [v1, v2],
    [v2, v3],
    [v3, v1]
  ];

  let nearestEdgeIndex = -1;
  let nearestHalfSideIndex = -1;
  let minDist = Infinity;
  for (let i = 0; i < edges.length; i++) {
    const [v1, v2] = edges[i];
    // Calculate the midpoint of the edge
    const midpoint = p5.Vector.add(v1, v2).div(2);
    const dist = distToSegment(p, v1, v2);
    if (dist < minDist) {
      nearestEdgeIndex = i;
      minDist = dist;
    }
  nearestHalfSideIndex = distToSegment(p, v1, midpoint) < distToSegment(p, midpoint, v2) ? 0 : 1;
  }
  return nearestEdgeIndex+ 3*nearestHalfSideIndex;
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
