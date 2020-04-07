export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.audio("magic_cave", "assets/audio/magicCave.mp3");

    this.load.image("start_screen", "assets/images/neonClock.png");
  }

  create() {
    this.scene.start('StartScene');
  }
}
