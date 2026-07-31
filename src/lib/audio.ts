// Simple Web Audio API Synthesizer for lightweight SFX without external files
// We use this to guarantee sounds work immediately without downloading MP3s.

class AudioEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playShoot() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {
      // Ignore audio context errors if browser blocks autoplay
    }
  }

  playBounce(velocity: number) {
    try {
      this.init();
      if (!this.ctx) return;
      
      // Filter out micro-bounces
      if (Math.abs(velocity) < 1) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200 + Math.abs(velocity) * 5, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);

      const volume = Math.min(Math.abs(velocity) * 0.02, 0.2);
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  }

  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'square';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime); // A4
      osc.frequency.setValueAtTime(554.37, this.ctx.currentTime + 0.1); // C#5
      osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.2); // E5

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {}
  }
}

export const sfx = new AudioEngine();
