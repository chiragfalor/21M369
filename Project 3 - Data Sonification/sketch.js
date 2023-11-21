// Project 3 -- Data Sonification
// by Chirag Falor

var img;
var osc;
var MIN_THRESHOLD = 0.005;
var filepaths = ['juno_jupiter.jpg', 'sample.png'];

function preload() {
    img = loadImage(filepaths[0], img => img.resize(256, 256)); // Replace this with your image path
    // img = loadImage('sample.png', img => img.resize(256, 256)); // Replace this with your image path
    synth = new p5.PolySynth();
}

function setup() {
  createCanvas(256, 256);
  image(img,0,0);
  img.loadPixels();

  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(440);
  osc.amp(MIN_THRESHOLD);
  osc.start();

  frameRate(20);
}

function draw() {
  background(220);
  var x = frameCount % 256;

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
      var freq = map(y, 0, img.height, 200, 800); // Mapping y coordinate to frequency
      var amp = map(bright, 0, 255, 0.01, 0); // Mapping brightness to amplitude/volume
      // if amp is > 0.5, play the note
      if (amp > MIN_THRESHOLD) {
        
        console.log(freq, amp);
        osc.freq(freq);
        osc.amp(amp);
      }
    }
}


