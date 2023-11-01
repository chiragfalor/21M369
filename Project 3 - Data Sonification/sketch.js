// Project 3 -- Data Sonification
// by Chirag Falor

var img;
var osc;

function preload() {
    img = loadImage('juno_jupiter.jpg'); // Replace this with your image path
    synth = new p5.PolySynth();
}

function setup() {
  createCanvas(256, 256);
  image(img,0,0);
  img.loadPixels();

  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(440);
  osc.amp(0.5);
  osc.start();

  frameRate(1);
}

function draw() {
  background(220);
  var x = frameCount % img.width;

  // image highlighting
  image(img, 0, 0);
  fill(255, 0, 0, 50); // semi-transparent red
  rect(x, 0, 1, height);

  for (var y = 0; y < img.height; y++) {
      var index = 4 * (x + y * img.width);
      var r = img.pixels[index];
      var g = img.pixels[index + 1];
      var b = img.pixels[index + 2];
      var bright = (r+g+b)/3; // brightness
      var freq = map(bright, 0, 255, 200, 800); // Mapping brightness to frequency
      osc.freq(freq);
  }
}


