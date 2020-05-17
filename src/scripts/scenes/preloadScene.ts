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
    this.load.audio("peace_reigns", "assets/audio/PeaceReigns.mp3");
    this.load.audio("shadow", "assets/audio/shadow.mp3");
    this.load.audio("level_one_victory", "assets/audio/level1victory.mp3");
    this.load.audio("level_two_victory", "assets/audio/level2victory.mp3");
    this.load.audio("death_sound", "assets/audio/death.mp3");
    this.load.audio("chest_pickup", "assets/audio/chestPickup.mp3");
    this.load.audio("za_warudo", "assets/audio/zaWarudo.mp3");
    this.load.audio("explosion_sound", "assets/audio/explosionSound.mp3");


    // Images 

    // Backgrounds
    this.load.image("level_one_backdrop", "assets/images/grassBackground.png");
    this.load.image("level_two_backdrop", "assets/images/fountain.png");
    this.load.image("level_three_backdrop", "assets/images/void.png");


    // Enemies
    this.load.image("main_clock", "assets/images/BaseClock.png");
    this.load.image("time_goblin", "assets/images/TimeGoblin.png");
    this.load.image("armor_goblin", "assets/images/ArmoredGoblin.png");
    this.load.image("speed_goblin", "assets/images/SpeedGoblin.png");
    this.load.image("the_punisher", "assets/images/ThePunisher.png");
    

    // Defensive Structures
    this.load.image("chrome_turret", "assets/images/chromeTurret.png");
    this.load.image("wizard_dude", "assets/images/wizardGuy.png");
    this.load.image("purple_ship", "assets/images/purpleShip.png");
    this.load.image("barrel_turret", "assets/images/barrelTurret.png");

    // Projectile Noises
    this.load.audio("laser_sound", "assets/audio/beam.mp3");
    this.load.audio("kamehameha_sound", "assets/audio/kamehameha.mp3");
    this.load.audio("pew_pew", "assets/audio/pewpew.mp3");
    this.load.audio("fireball_sound", "assets/audio/fireballSound.mp3");

    // Projectiles
    this.load.image("laser_beam", "assets/images/laser.png");
    this.load.image("kamehameha_beam", "assets/images/kamehameha.png");
    this.load.image("pixel_bullet", "assets/images/pixelBullet.png")
    this.load.image("fire_ball", "assets/images/fireball.png")

    // Health bar
    this.load.image("health_bar", "assets/images/healthbar.png");

    // Powerup wheel
    this.load.image("powerup_wheel", "assets/images/pieChart.png");
    this.load.image("bombPowerup", "assets/images/bombPowerup.png")
    this.load.image("spike_powerup", "assets/images/spikeBall.png")
    this.load.image("energy_ball", "assets/images/glowBall.png")
    this.load.image("pickle_rick", "assets/images/pickleRick.png")
    this.load.image("pearl", "assets/images/pearl.png")

    // Treasure chest
    this.load.image("treasure_chest", "assets/images/treasureChest.png");

    // Iron Bars 
    this.load.image("iron_bar", "assets/images/ironBar.png");

    // Death Clock
    this.load.image("death_clock", "assets/images/finalClock.png");



    // Spritesheets
    this.load.spritesheet("time_crystal", "assets/spritesheets/crystalSheet.png", {
      frameWidth: 57.2, // Don't touch it works 57.4
      frameHeight: 112
    });

    this.load.spritesheet("explosion", "assets/spritesheets/explosion.png", {
      frameWidth: 16,
      frameHeight: 16
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
    // For Level Switch Scene
    this.load.image("level_one_complete_image", "assets/images/rainbowFlame.png");
    this.load.image("level_two_complete_image", "assets/images/yellowBall.png");

//-----------------------------------------------------------------------------------------------------------
    // For lose scene
    this.load.audio("lose_song", "assets/audio/endSong.mp3");
    
//-----------------------------------------------------------------------------------------------------------
    // For Victory Scene
    this.load.audio("win_song", "assets/audio/sunlight.mp3");
    this.load.image("confetti_background", "assets/images/confetti.png")

  }

  create() {
    this.scene.start('StartScene');

    this.anims.create({
      key: "time_crystal_anim",
      frames: this.anims.generateFrameNumbers("time_crystal", { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion" , { start: 0, end: 4 }),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });
  }
}
