// Project 3 -- Data Sonification
// by Chirag Falor

var img;
var synth;
var notes = ["C", "D", "E", "F", "G", "A", "B"];
var octave = [0, 1, 2, 3, 4, 5, 6, 7];

function preload() {
    img = loadImage('yourImagePathHere.jpeg'); // Replace this with your image path
    synth = new p5.PolySynth();
}

function setup() {
    createCanvas(256, 256);
    image(img,0,0);

    img.loadPixels();
    frameRate(1);
}

function draw() {
  var y = frameCount % img.height;

  // image highlighting
  image(img, 0, 0);
  fill(255, 0, 0, 50); // semi-transparent red
  rect(y, 0, 1, img.height);

  for (var x = 0; x < img.width; x++) {
      var index = 4 * (x + y * img.width);
      var r = img.pixels[index];
      var g = img.pixels[index + 1];
      var b = img.pixels[index + 2];
      var bright = (r+g+b)/3; // brightness
      var n = map(bright, 0, 255, 0, notes.length - 1);
      var note = notes[Math.floor(n)];
      var oct = octave[Math.floor(map(bright, 0, 255, 0, octave.length - 1))];
      synth.play(note + oct, 0.1, 0, 1.0);
  }
}

