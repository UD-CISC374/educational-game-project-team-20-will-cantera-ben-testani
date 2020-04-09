export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // For Start Screen

    // Audio
    this.load.audio("magic_cave", "assets/audio/magicCave.mp3");


    // Images
    this.load.image("start_screen", "assets/images/neonClock.png");

//-----------------------------------------------------------------------------------------------------
    // For Main Scene

    // Images 

    // Enemies
    this.load.image("main_clock", "assets/images/BaseClock.png");
    this.load.image("time_goblin", "assets/images/TimeGoblin.png");
    this.load.image("armor_goblin", "assets/images/ArmoredGoblin.png");
    this.load.image("speed_goblin", "assets/images/SpeedGoblin.png");
    this.load.image("the_punisher", "assets/images/ThePunisher.png");


    // Spritesheets
    this.load.spritesheet("time_crystal", "assets/spritesheets/crystal.png", {
      frameWidth: 26.2,
      frameHeight: 48
    });
    this.load.image("start_screen", "assets/images/neonClock.png");
//----------------------------------------------------------------------------------------------------------
    // For chest scene
    this.load.image("openChest", "assets/images/openedChest.png");
    this.load.image("closeChest", "assets/images/closedChest.v1.png");
    this.load.image("clock", "assets/images/clock.png");
    this.load.image("hoursDot", "assets/images/hoursDot.png");
    this.load.image("minutesDot", "assets/images/minutesDot.png");

  }

  create() {
    this.scene.start('StartScene');

    this.anims.create({
      key: "time_crystal_anim",
      frames: this.anims.generateFrameNumbers("time_crystal", { start: 0, end: 4 }),
      frameRate: 5,
      repeat: -1
    });
  }
}
