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

    // Audio
    this.load.audio("warsaw_song", "assets/audio/warsaw.mp3");
    this.load.audio("laser_sound", "assets/audio/beam.mp3");

    // Images 

    // Enemies
    this.load.image("main_clock", "assets/images/BaseClock.png");
    this.load.image("time_goblin", "assets/images/TimeGoblin.png");
    this.load.image("armor_goblin", "assets/images/ArmoredGoblin.png");
    this.load.image("speed_goblin", "assets/images/SpeedGoblin.png");
    this.load.image("the_punisher", "assets/images/ThePunisher.png");

    // Defensive Structures
    this.load.image("chrome_turret", "assets/images/chromeTurret.png");

    // Projectiles
    this.load.image("laser_beam", "assets/images/laser.png");

    // Health bar
    this.load.image("health_bar", "assets/images/healthbar.png");


    // Spritesheets
    this.load.spritesheet("time_crystal", "assets/spritesheets/crystalSheet.png", {
      frameWidth: 57.2, // Don't touch it works 57.4
      frameHeight: 112
    });
    
//----------------------------------------------------------------------------------------------------------
    // For chest scene

    // Images
    this.load.image("openChest", "assets/images/openedChest.png");
    this.load.image("closeChest", "assets/images/closedChest.v1.png");
    this.load.image("clock", "assets/images/clock.png");
    this.load.image("hoursDot", "assets/images/hoursDot.png");
    this.load.image("minutesDot", "assets/images/minutesDot.png");

    // Fonts
    this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");


//-----------------------------------------------------------------------------------------------------------
    // For lose scene
    this.load.audio("lose_song", "assets/audio/endSong.mp3");
    
//-----------------------------------------------------------------------------------------------------------

  }

  create() {
    this.scene.start('StartScene');

    this.anims.create({
      key: "time_crystal_anim",
      frames: this.anims.generateFrameNumbers("time_crystal", { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1
    });
  }
}
