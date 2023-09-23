// Set up canvas
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
document.body.appendChild(canvas);
const synth = new Tone.MonoSynth({
    oscillator: { type: 'sawtooth' },
    envelope: { decay: 0.3, release: 1 },
    filter: {frequency: 200, Q: 5},
    filterEnvelope: {
        attack: 0.01, decay: 0.4,  release: 2,
        baseFrequency: 100, octaves: 3
    }
}).toDestination();

// Create a feedback delay effect
const feedbackDelay = new Tone.FeedbackDelay('16nd', 0.5).toDestination();
// Connect the synth to the delay effect
synth.connect(feedbackDelay);
feedbackDelay.wet.value = .3
feedbackDelay.delayTime.value = '4n'

// Define a sequence of notes
const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

sequence.interval = '16n'
// Set up audio context
const audioCtx = new AudioContext();

// Set up oscillator
const oscillator = audioCtx.createOscillator();
oscillator.type = 'sine';
oscillator.frequency.value = 440;
oscillator.start();

// Set up gain node
const gainNode = audioCtx.createGain();
gainNode.gain.value = 0;

// Connect oscillator to gain node, and gain node to audio context destination
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);

// Set up ball
const ball = {
    x: 150, // Start inside the square
    y: 150, // Start inside the square
    radius: 10,
    dx: 5,
    dy: 5
};

// Set up square
const square = {
    x: 100,
    y: 100,
    width: 200,
    height: 200
};

// Set up animation loop
function animate() {
    // Clear canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Check if ball is inside square, move it inside if not
    if (ball.x - ball.radius < square.x || ball.x + ball.radius > square.x + square.width ||
        ball.y - ball.radius < square.y || ball.y + ball.radius > square.y + square.height) {
        ball.x = Math.max(square.x + ball.radius, Math.min(square.x + square.width - ball.radius, ball.x));
        ball.y = Math.max(square.y + ball.radius, Math.min(square.y + square.height - ball.radius, ball.y));
    }

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw square
    ctx.fillRect(square.x, square.y, square.width, square.height);

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Check for collision with walls
    if (ball.x - ball.radius < square.x || ball.x + ball.radius > square.x + square.width) {
        ball.dx = -ball.dx;
        gainNode.gain.value = 0.1; // Play sound
    }
    if (ball.y - ball.radius < square.y || ball.y + ball.radius > square.y + square.height) {
        ball.dy = -ball.dy;
        gainNode.gain.value = 0.1; // Play sound
    }

    // Reset gain node after sound has finished playing
    setTimeout(() => {
        gainNode.gain.value = 0;
    }, 100);

    // Request next animation frame
    requestAnimationFrame(animate);
}

// Start animation loop
animate();