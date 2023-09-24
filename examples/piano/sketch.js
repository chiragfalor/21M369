let osc, envelope, fft;

let scaleArray = [60, 62, 64, 65, 67, 69, 71, 72];
let note = 0;

function setup() {
  createCanvas(710, 200);
  osc = new p5.SinOsc();

  // Instantiate the envelope
  envelope = new p5.Env();

  // set attackTime, decayTime, sustainRatio, releaseTime
  envelope.setADSR(0.001, 0.5, 0.1, 0.5);

  // set attackLevel, releaseLevel
  envelope.setRange(1, 0);

  osc.start();

  noStroke();
}

const keyToNote = {
  'a': 60, // Middle C
  's': 62, // D
  'd': 64, // E
  'f': 65, // F
  'g': 67, // G
  'h': 69, // A
  'j': 71, // B
  'k': 72  // High C
};


function draw() {

  document.addEventListener('keydown', event => {
    if (event.key in keyToNote) {
      osc.freq(midiToFreq(keyToNote[event.key]));
      envelope.play(osc, 0, 0.1);
    }
  })
}
