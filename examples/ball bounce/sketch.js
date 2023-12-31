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

  fft = new p5.FFT();
  noStroke();
}

function draw() {
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
  
  // Add an event listener for keydown events
  document.addEventListener('keydown', event => {
    // Check if the pressed key is mapped to a note
    if (event.key in keyToNote) {
      // Get the MIDI value of the note
      const midiValue = keyToNote[event.key];
      // Convert the MIDI value to a frequency
      const freqValue = midiToFreq(midiValue);
      // Set the oscillator frequency and play the envelope
      osc.freq(freqValue);
      envelope.play(osc, 0, 0.1);
    }
  })
  // background(20);

  // if (frameCount % 60 === 0 || frameCount === 1) {
  //   let midiValue = scaleArray[note];
  //   let freqValue = midiToFreq(midiValue);
  //   osc.freq(freqValue);

  //   envelope.play(osc, 0, 0.1);
  //   note = (note + 1) % scaleArray.length;
  // }

  // // plot FFT.analyze() frequency analysis on the canvas
  // let spectrum = fft.analyze();
  // for (let i = 0; i < spectrum.length / 20; i++) {
  //   fill(spectrum[i], spectrum[i] / 10, 0);
  //   let x = map(i, 0, spectrum.length / 20, 0, width);
  //   let h = map(spectrum[i], 0, 255, 0, height);
  //   rect(x, height, spectrum.length / 20, -h);
  // }
}
