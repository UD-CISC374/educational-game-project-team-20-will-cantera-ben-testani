export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.audio("magic_cave", "assets/audio/magicCave.mp3");
    this.load.image("start_screen", "assets/images/neonClock.png");

    this.load.image("openChest", "assets/images/openedChest.png");
    this.load.image("closeChest", "assets/images/closedChest.v1.png");
    this.load.image("clock", "assets/images/clock.png");
    this.load.image("hoursDot", "assets/images/hoursDot.png");
    this.load.image("minutesDot", "assets/images/minutesDot.png");

  }

  create() {
    this.scene.start('StartScene');
  }
}
