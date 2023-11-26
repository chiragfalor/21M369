class SoundObject {
    constructor() {
        this.setup_sound();
        return;
    }

    setup_sound() {
        return;
    }

    play_sound() {
        return;
    }
}

class Piano extends SoundObject {
    constructor(pitch = 60, duration=0.5 ) {
        super();
        this.duration = duration;
        this.pitch = pitch;
    }

    setup_sound() {
        this.selectedPreset=_tone_0000_JCLive_sf2_file;
        var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContextFunc();
        this.player=new WebAudioFontPlayer();
        this.player.loader.decodeAfterLoading(this.audioContext, '_tone_0000_JCLive_sf2_file');
      }
    
      play_sound() {
        this.player.queueWaveTable(this.audioContext, this.audioContext.destination, this.selectedPreset,0 ,this.pitch, this.duration);
    }

}

class Snare extends SoundObject {
    constructor() {
        super();
    }

    setup_sound() {
        var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContextFunc();
        this.player=new WebAudioFontPlayer();
        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_40_1_JCLive_sf2_file');
    }
    
      play_sound() {
        // const freqIndex = getFrequencyIndex(this.pos, x0, y0, circleRadius);
        this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_40_1_JCLive_sf2_file, 0, 40, 3);
    }

}

class tom3Drum extends SoundObject {
    constructor() {
        super();
    }
    
    setup_sound() {
        var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContextFunc();
        this.player=new WebAudioFontPlayer();
        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_41_1_JCLive_sf2_file');
    }
    
      play_sound() {
        // const freqIndex = getFrequencyIndex(this.pos, x0, y0, circleRadius);
        this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_41_1_JCLive_sf2_file, 0, 41, 3);
    }

}