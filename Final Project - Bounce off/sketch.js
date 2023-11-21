// Project 2 -- Circle of Harmony
// by Chirag Falor

// make the figures cuter
// maybe something should happen if two hit at the same time

let mouseEnergy = 0.1;
let volumeFactor = 1;
let resonanceFactor = 1;
let lifetime = 100;

let metronome = 60;

// sound of sides
const petatonic_pitch = [0, 7, 4, 12, 9, 2];

// rhythms

const lvl1 = [1, 2, 3, 4];
const lvl2 = [1, 4/3, 3/2, 2, 3, 4, 6];
const lvl3 = [1, 4/3, 3/2, 2, 3, 4, 6, 8, 9, 12, 16];
const rhythms = lvl1;

let width = 500;
let height = 400;
let x0 = width / 2;
let y0 = height / 2;
let osc, envelope;
let balls = [];

let instrument = 's';

class Level {
  constructor(circleRadius, soundObjects) {
    this.circleRadius = circleRadius;
    this.soundObjects = soundObjects;
  }

  setup() {
    createCanvas(width, height);
    noStroke();
    frameRate(30);
    ellipseMode(RADIUS);
  }

  update() {
    for (const ball of balls) {
      ball.update();
    }
  }

  draw() {
    background(100, 100, 100, 100);

    // Draw the triangle
    fill(76, 255, 0);
    ellipse(x0, y0, this.circleRadius, this.circleRadius);

    for (const ball of balls) {
      ball.draw();
    }

    // if mouse is pressed, the last ball radius is growing
    if (mouseIsPressed) {
      const ball = balls[balls.length - 1];
      ball.r = this.getBallRadius();
      // draw the velocity vector
      const v = this.getBallVelocity(ball, mouseX, mouseY);

      // draw the velocity vector
      this.drawArrow(ball.pos.x, ball.pos.y, ball.pos.x+v.x*5, ball.pos.y+v.y*5, 3, color(255, 0, 0));
    }
  }

  keyPressed() {
    if (key == ' ') {
      balls = [];
    }
    if (key in soundObjects) {
      instrument = key;
    }
  }

  mousePressed() {
    mousePressedTime = millis();
    // make object based on the key pressed
    const soundObject = soundObjects[instrument];
    balls.push(new soundObject(mouseX, mouseY, 0, 0, 0.1));
  }

  mouseReleased() {
    const ball = balls[balls.length - 1];
    ball.r = this.getBallRadius();
    // the release coordinate compared to ball position is the velocity
    ball.vel = this.getBallVelocity(ball, mouseX, mouseY);
  }

  // utils

  // Check if a point is inside a circle
  pointInCircle(p, cx, cy, r) {
    const d = dist(p.x, p.y, cx, cy);
    return d <= r;
  }

  // Function to get the frequency index based on position and circle parameters
  getFrequencyIndex(p, cx, cy, r) {
    // Calculate the angle between the center of the circle and the point p
    const angle = atan2(p.y - cy, p.x - cx);
    // Map the angle to a frequency index based on the number of petatonic_pitch values
    const index = Math.floor(map(angle, -PI, PI, 0, petatonic_pitch.length));
    return index;
  }

  getBallVelocity(ball, mouseX, mouseY) {
    const v = this.propVelocity(ball.pos.x, ball.pos.y, mouseX, mouseY);
    return this.snapToRhythmVelocity(v, ball.pos.x, ball.pos.y);
  }

  getBallRadius() {
    const duration = millis() - mousePressedTime;
    r = map(duration, 0, 1000, 0, 50);
    return min(r, 20);
  }

  propVelocity(ballx, bally, mouseX, mouseY) {
    const dx = -(mouseX - ballx);
    const dy = -(mouseY - bally);
    const v = createVector(dx*mouseEnergy, dy*mouseEnergy);
    return v;
  }

  snapToRhythmVelocity(v, ballx, bally){
    const r = createVector(x0-ballx, y0-bally);
    const cosTheta = v.dot(r)/(v.mag()*r.mag());
    // chord length = sqrt(R^2 - r^2*sin^2(theta))
    const chordLength = sqrt(this.circleRadius*this.circleRadius - r.mag()*r.mag()*(1-cosTheta*cosTheta));
    // we want velocity over chord length to be a multiple of the rhythm*metronome; snap to the closest rhythm
    const snap_v = chordLength*this.snapToNearestRhythm(v.mag()/chordLength);
    const snap_v_vector = p5.Vector.mult(v.normalize(), snap_v);
    return snap_v_vector;
  }

  snapToNearestRhythm(freq){
    const ratio = freq*20;
    // const rhythmIndex = rhythms.reduce((iMax, x, i, arr) => x < ratio ? i : iMax, 0);
    const rhythmIndex = rhythms.reduce((iMax, x, i, arr) => x < ratio ? i : iMax, 0);
    console.log(ratio);
    return rhythms[rhythmIndex]*metronome/1000;
  }

  drawArrow(x1, y1, x2, y2, thickness, color) {
    push();
    stroke(color);
    strokeWeight(thickness);
    line(x1, y1, x2, y2);
    const angle = atan2(y2 - y1, x2 - x1);
    const headlen = 10;
    line(x2, y2, x2 - headlen * cos(angle - PI / 7), y2 - headlen * sin(angle - PI / 7));
    line(x2, y2, x2 - headlen * cos(angle + PI / 7), y2 - headlen * sin(angle + PI / 7));
    pop();
  }
}

class SoundObject {
  constructor(x, y, vx, vy, r) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.r = r;
    this.color = color(random(255), random(200), 50+random(205));
    this.setup_sound();
  }

  setup_sound() {
    return;
    // osc = new p5.Oscillator('sine');
    // envelope = new p5.Envelope();
    // osc.amp(envelope);
    // osc.start();
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

    // Check if the ball is outside of the circle
    if (!pointInCircle(this.pos, x0, y0, circleRadius)) {
      this.play_collision_sound();
      this.r -= 0.1;
      // Reflect the ball's velocity off the circle's edge
      const normal = p5.Vector.sub(this.pos, createVector(x0, y0)).normalize();
      const dot = p5.Vector.dot(normal, this.vel);
      const reflected = p5.Vector.sub(this.vel, p5.Vector.mult(normal, 2 * dot));
      this.vel = reflected;
    }
  }

  update_age() {
    this.r -= 1/lifetime;
    // Remove the ball from the balls array when the radius becomes 0
    if (this.r < 0) {
      const index = balls.indexOf(this);
      balls.splice(index, 1);
    }
  }
}

class Piano extends SoundObject {
  constructor(x, y, vx, vy, r, duration) {
    super(x, y, vx, vy, r);
    this.duration = duration;
  }

  setup_sound() {
    this.selectedPreset=_tone_0000_JCLive_sf2_file;
    var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextFunc();
    this.player=new WebAudioFontPlayer();
    this.player.loader.decodeAfterLoading(this.audioContext, '_tone_0000_JCLive_sf2_file');
  }

  play_collision_sound() {
    const freqIndex = getFrequencyIndex(this.pos, x0, y0, circleRadius);
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, this.selectedPreset,0, 12*5+ petatonic_pitch[freqIndex], this.duration);
  }

  draw() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }
}

class shortPiano extends Piano {
  constructor(x, y, vx, vy, r) {
    super(x, y, vx, vy, r, 0.2);
  }
}

class longPiano extends Piano {
  constructor(x, y, vx, vy, r) {
    super(x, y, vx, vy, r, 1);
  }
}

class Drum extends SoundObject {
  constructor(x, y, vx, vy, r) {
    super(x, y, vx, vy, r);
  }

  draw() {
    const bar_ratio = 0.2;
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
    const numCircles = 8;
    const angleStep = TWO_PI / numCircles;
    const circleRadius = this.r;
    for (let i = 0; i < numCircles; i++) {
      const angle = i * angleStep;
      const x = this.pos.x + cos(angle) * circleRadius * (1 + bar_ratio);
      const y = this.pos.y + sin(angle) * circleRadius * (1 + bar_ratio);
      fill(0, 0, 0);
      ellipse(x, y, circleRadius * bar_ratio, circleRadius * bar_ratio);
    }
  }
}

class tom3Drum extends Drum {
  constructor(x, y, vx, vy, r) {
    super(x, y, vx, vy, r);
  }
  
  setup_sound() {
    var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextFunc();
    this.player=new WebAudioFontPlayer();
    this.player.loader.decodeAfterLoading(this.audioContext, '_drum_41_1_JCLive_sf2_file');
  }

  play_collision_sound() {
    const freqIndex = getFrequencyIndex(this.pos, x0, y0, circleRadius);
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_41_1_JCLive_sf2_file, 0, 41, 3);
  }
}

class Snare extends Drum {
  constructor(x, y, vx, vy, r) {
    super(x, y, vx, vy, r);
  }

  setup_sound() {
    var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextFunc();
    this.player=new WebAudioFontPlayer();
    this.player.loader.decodeAfterLoading(this.audioContext, '_drum_40_1_JCLive_sf2_file');
  }

  play_collision_sound() {
    const freqIndex = getFrequencyIndex(this.pos, x0, y0, circleRadius);
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_40_1_JCLive_sf2_file, 0, 40, 3);
  }
}

// make a dictionary of sound objects
const soundObjects = {
  's': shortPiano,
  'l': longPiano,
  't': tom3Drum,
  'd': Snare,
}

let currentLevel;

function setup() {
  currentLevel = new Level(150, soundObjects);
  currentLevel.setup();
}

function draw() {
  currentLevel.update();
  currentLevel.draw();
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
