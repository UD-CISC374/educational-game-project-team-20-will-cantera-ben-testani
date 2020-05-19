import { GameObjects } from 'phaser';
import LevelComplete from './levelComplete';
import Projectile from '../objects/projectile';
import LoseScene from './loseScene';
import VictoryScene from './victoryScene';
import ChestScene from './chestScene';
import Explosion from '../objects/explosion';
import Clone from '../objects/clone';
import Turret from '../objects/turret';
import Enemy from '../objects/enemy';

function sleep (milliseconds) { // Making the program wait for the given time
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export default class MainScene extends Phaser.Scene {
  // Constants
  private readonly numEnemies: number = 4;
  private readonly MAXHEALTH: number = 225;
  private readonly POWERUP_COUNT: number = 5; 
  private readonly CLONE_DEPTH = 102;
  private readonly FRONT_FIRST: number = 101;
  private readonly FRONT_SECOND: number = 100;
  private readonly ROTATION_MAGIC_NUMBER = 80.1;
  private readonly MAX_CHESTS = 4;
  
  // Turrets and enemies, must be any to accept custom attributes
  public chromeTurret: Turret;
  private purpleShip: Turret;
  private wizardGuy: Turret;
  private barrelTurret: Turret;

  // Phaser groups
  private enemies: any;
  private turrets: any;
  private cloneList: any;

  // Phaser objects
  public turretProjectiles: GameObjects.Group;
  private timeCrystal: Phaser.GameObjects.Sprite;
  private chestButton: Phaser.GameObjects.Text;
  private levelOneTrack: Phaser.Sound.BaseSound;
  private waveStartButton: GameObjects.Text;
  private healthBar: GameObjects.Image;
  private enemySpawnText: GameObjects.Text;
  private beamSound: Phaser.Sound.BaseSound;
  private kamehamehaSound: Phaser.Sound.BaseSound;
  private pewPewSound: Phaser.Sound.BaseSound;
  private fireBallSound: Phaser.Sound.BaseSound;
  private levelTwoTrack: Phaser.Sound.BaseSound;
  private levelThreeTrack: Phaser.Sound.BaseSound;
  private levelOneBackground: GameObjects.Image;
  private levelTwoBackground: GameObjects.Image;
  private levelThreeBackground: GameObjects.Image;
  private deathSound: Phaser.Sound.BaseSound;
  private deathClock: Phaser.Physics.Arcade.Sprite;
  private powerupWheel: GameObjects.Image;
  private spacebar: Phaser.Input.Keyboard.Key;
  private chestPickupSound: Phaser.Sound.BaseSound;
  private zaWarudo: Phaser.Sound.BaseSound;
  private explosionSound: Phaser.Sound.BaseSound;

  // Powerup Stuff                
  // Should enumerate this, it goes index: 0 = bomb, 1 = spike, 2 = purple orb, 3 = pickle, 4 = pearl
  public static powerUps: Array<number> = [1, 1, 1, 1, 1];
  public static numClones: Array<number> = [1,1,1,1,1]; // Just for displaying the number of powerups as text on screen
  private powerupCoords: Array<Array<number>> = [[550, 300], [350, 430], [430, 660], [670, 660], [750, 430]];
  private powerupTextList: Array<Phaser.GameObjects.Text> = [];
  private activePowerUps: any; // Clones get put into here, removed on collision
  public static chestNum: number = 0;
  public static beginning: boolean;

  // Powerup Images
  public powerUpGroup: any;
  private flowerPowerup: Phaser.GameObjects.Image;
  private spikePowerup: Phaser.GameObjects.Image;
  private energyPowerup: Phaser.GameObjects.Image;
  private picklePowerup: Phaser.GameObjects.Image;
  private pearlPowerup: Phaser.GameObjects.Image;

  // Variables with set values
  private health: number = this.MAXHEALTH; // Width in pixels of the health bar
  private levelInfo: Object = { // Three waves per level, key is the number of enemies per wave
    "level1": {
      "wave1": 1,
      "wave2": 6,
      "wave3": 9
      //"wave4": 12
    }, 
    "level2": {
      "wave1": 10,
      "wave2": 18,
      "wave3": 30
      //"wave4": 45
    },
    "level3": {
      "wave1": 20,
      "wave2": 28,
      "wave3": 45
      //"wave4": 10
    }
  };
  private waveNumber: string = "wave1"; // Keep track of what wave the player is on 
  private spawnTimes: Array<number> = []; // Will be filled in with random numbers between 1 and 12
  private isWaveStarted: boolean = false; // True if the wave is ongoing, false otherwise
  private boxList: Array<Phaser.GameObjects.Rectangle> = [];
  private lockImageList: Array<any> = [];
  private defensiveInventoryCoords: Array<Array<number>> = [];
  private isWaveDone: boolean = false;
  private tutorialTextArray: Array<GameObjects.Text> = [];
  private tutorialMessageNumber: number = 0;
  private resetGame: boolean = false;
  private isLevelSwitching: boolean = false;
  private isSpacebarDown: boolean = false;
  private isScrollWheelUp: boolean = false;
  private chestArray: Array<Phaser.GameObjects.Image> = [];
  private chestsOnScene: number = 0;


  /**
   * constructor, provides a reference to this scene
   * 
   * @param None
   * @return None
   */
  constructor() {
    super({ key: 'MainScene' });
  }


  /**
   * Runs once, this scene never ends. Sets up everything on screen. Starts playing the level one song. Sets up groups. Adds images 
   *            and sound to the scene.
   * 
   * @param None
   * @return None
   */
  create() {
    // Background Stuff
    this.levelOneBackground = this.add.image(this.scale.width/2, this.scale.height/2, "level_one_backdrop");
    this.levelTwoBackground = this.add.image(this.scale.width/2, this.scale.height/2, "level_two_backdrop");
    this.levelThreeBackground = this.add.image(this.scale.width/2, this.scale.height/2, "level_three_backdrop");
    this.levelOneBackground.depth = -1;
    this.levelTwoBackground.depth = -1;
    this.levelThreeBackground.depth = -1;
    this.levelTwoBackground.setVisible(false);
    this.levelThreeBackground.setVisible(false);
    this.add.image(this.scale.width/2, this.scale.height/2, "main_clock");
    this.powerupWheel = this.add.image(this.scale.width/2, this.scale.height/2, "powerup_wheel");
    this.powerupWheel.setVisible(false); // Initially invisible, must hold down space
    this.powerupWheel.depth = this.FRONT_SECOND; // Make sure its on top
  
    // Death Sound
    this.deathSound = this.sound.add("death_sound", {volume: 2});

    // Powerup Sound
    this.explosionSound = this.sound.add("explosion_sound");

    // Time Slow Sound
    this.zaWarudo = this.sound.add("za_warudo");

    // Chest Pickup Sound
    this.chestPickupSound = this.sound.add("chest_pickup");

    // Projectile Sounds
    this.beamSound = this.sound.add("laser_sound");
    this.kamehamehaSound = this.sound.add("kamehameha_sound");
    this.pewPewSound = this.sound.add("pew_pew");
    this.fireBallSound = this.sound.add("fireball_sound");

    // Draw the players defensive strucutre inventory on screen
    this.handleBoxes();
    
    // Health bar for the time crystal
    this.healthBar = this.add.image(this.scale.width/2, (this.scale.height/2)-80, "health_bar");

    // Make a physics enabled group for the enemies
    this.enemies = this.physics.add.group();

    this.cloneList = this.physics.add.group();

    // Add starting defensive structure to inventory 
    this.addDefenses();

    // Add the powerups
    this.addPowerups();

    // Make an inital tutorial chest
    this.spawnChest(this.scale.width/2-250, this.scale.height/2, true); // true to ignore random

    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Draws the button onscreen for starting the wave
    this.makeWaveStartButton();

    // Gets the times enemies will spawn, stores them in array
    this.prepWave(); // Takes a varying amount of time
    
    // Load all the main songs for each level
    this.levelOneTrack = this.sound.add("warsaw_song");
    this.levelTwoTrack = this.sound.add("peace_reigns"); 
    this.levelThreeTrack = this.sound.add("shadow");

    // Plays the background song for this scene
    this.levelOneTrack.play({volume: .1}); // 2 for playing the song

    // Making some things to be drawn on screen
    this.makeTimeCrystal();
    this.makeChestButton();

    // Group for projectiles
    this.turretProjectiles = this.add.group();
    // Group for powerups 
    this.activePowerUps = this.physics.add.group();

    // Adds collision between players shots and powerups, causing them to bounce
    this.physics.add.overlap(this.turretProjectiles, this.enemies, this.handleBulletCollision, this.giveTrue, this);

    this.physics.add.overlap(this.activePowerUps, this.enemies, this.powerupCollisionHandler, this.giveTrue, this);

    // Adding collision for the time crystal and enemies
    this.physics.add.overlap(this.timeCrystal, this.enemies, this.hurtCrystal, this.giveTrue, this);

    // Draw the starting powerup counts
    for (let i = 0; i < 5; i++) {
      let powerupCount: Phaser.GameObjects.Text = this.add.text(this.powerupCoords[i][0], this.powerupCoords[i][1], "X" + MainScene.powerUps[i].toString());
      powerupCount.depth = this.CLONE_DEPTH;
      powerupCount.setVisible(false);
      this.powerupTextList.push(powerupCount);
      this.powerupTextList[i].setFontSize(24);
      this.powerupTextList[i].setColor("black");
      this.powerupTextList[i].setFontStyle("bold");
    }

    // Set Spacebar Actions
    this.input.keyboard.on("keydown-" + "SPACE", () => {this.displayPowerupBar();}); 
    this.input.keyboard.on("keyup-" + "SPACE", () => {this.hidePowerBar();}); 
  }


  /**
   * addPowerups, adds the images of the powerups to the scene. Puts them in a group for easier manipulation. Sets their alpha to 
   *              half because they are not available until they player has earned some. Sets them as interactive. 
   * 
   * @param None
   * @return None
   */
  addPowerups(): void {
    this.flowerPowerup = this.add.image(500, 300, "bombPowerup");
    this.spikePowerup = this.add.image(300, 430, "spike_powerup");
    this.energyPowerup = this.add.image(380, 660, "energy_ball");
    this.picklePowerup = this.add.image(625, 660, "pickle_rick");
    this.pearlPowerup = this.add.image(700, 430, "pearl");

    this.powerUpGroup = this.physics.add.group(); // Make it a physics group
    this.powerUpGroup.add(this.flowerPowerup); 
    this.powerUpGroup.add(this.spikePowerup);
    this.powerUpGroup.add(this.energyPowerup);
    this.powerUpGroup.add(this.picklePowerup);
    this.powerUpGroup.add(this.pearlPowerup);

    for (let i = 0; i < this.POWERUP_COUNT; i++) {
      this.powerUpGroup.getChildren()[i].setAlpha(.5); // No powerups at first, all half visibility
      this.powerUpGroup.getChildren()[i].setInteractive();
      this.powerUpGroup.getChildren()[i].depth = this.FRONT_FIRST;
      this.powerUpGroup.getChildren()[i].setVisible(false);
    }
  }


  /**
   * giveTrue, for some reason, the Phaser overlap function needs a callback that returns true. Here it is.
   * 
   * @param None
   * @return None
   */
  giveTrue(): boolean {
    return true;
  }

  
  /**
   * spawnChest, gets a random number between 0 and 9 when an enemy dies. If the number is 5, a chest is spawned on the enemies death
   *             location. The player can click on the chest to pick it up and later open in the chest scene. 
   * 
   * @param enemyX -> number, the x position of the enemy on death
   * @param enemyY -> number, the y position of the enemy on death
   * @param ignoreChance -> boolean, if true, this function is guarenteed to spawn a chest, if false, it's random
   * @return None
   */
  spawnChest(enemyX: number, enemyY: number, ignoreChance: boolean): void {
    let randomNumber: number = ignoreChance ? 5 : Math.floor(Math.random() * 9);
    if (this.chestsOnScene < this.MAX_CHESTS) { // Don't spawn too many chests
      if (randomNumber === 5) { // 1 in 10 chance
        let chest: GameObjects.Image = this.add.image(enemyX, enemyY, "treasure_chest");
        chest.setInteractive();
        this.chestArray.push(chest);
        this.chestsOnScene++;
        chest.on("pointerdown", () => {
          MainScene.chestNum++; // Increment global static chest count
          this.chestPickupSound.play();
          this.chestsOnScene--;
          chest.destroy();
        });
      }
    }
  }


  /**
   * handleBulletCollision, when a bullet from the projectile group collides with an enemy from the enemy group, the projectile and enemy
   *                        are destroyed. If the turret is the PurpleShip or the BarrelGun, the collideMultiple method is called to 
   *                        destroy multiple enemies around the shot to compenstate for the slower firerate on those turrets.
   * 
   * @param projectile -> any, the projectile in collision
   * @param enemy -> any, the enemy hit by the projectile
   * @return None
   */
  handleBulletCollision(projectile: any, enemy: any): void {
    projectile.destroy();
    let enemyX: number = enemy.x;
    let enemyY: number = enemy.y;
    this.spawnChest(enemyX, enemyY, false); // false for indicating randomness
    enemy.destroy();
    if (projectile.name === "kamehameha_beam" || projectile.name === "pixel_bullet")
      this.collideMultiple(enemy);
  }


  /**
   * collideMultiple, destroys multiple enemies based on how close they are to the enemy that collided with a projectile.
   * 
   * @param enemy -> any, the intial enemy hit
   */
  collideMultiple(enemy: any) {
    for (let i = 0; i < this.enemies.getChildren().length; i++) {
      let child = this.enemies.getChildren()[i];
      if (child.x < enemy.x+50 && child.x > enemy.x - 50)
        if (child.y < enemy.y+50 && child.y > enemy.y - 50)
          child.destroy();
    }
  }


  /**
   * onDrag, on drag, updates the objects x and y position, also updates the objects angle to match the clock. So this method ensures
   *         that the turrets and powerups are facing the correct direction when they are dragged around the clock.
   * 
   * @param object -> any, the object being dragged
   */
  onDrag(object: any): void {
    // Defining drag behaviour
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) { // Update turrets position on drag
      let spriteRotation: number = Phaser.Math.Angle.Between(500, 500, gameObject.x, gameObject.y); 
      gameObject.setRotation(spriteRotation-80.1); // Don't touch this number
      gameObject.x = dragX;
      gameObject.y = dragY;      
    });
  }


  /**
   * powerupCollisionHandler, destroys enemies that come into contact with the active powerup group.
   * 
   * @param powerup -> any, the powerup to destroy
   * @param enemy -> any, the enemy to destroy
   */
  powerupCollisionHandler(powerup: any, enemy: any): void {
    if (!this.isScrollWheelUp) {
      new Explosion(this, powerup.x, powerup.y);
      this.explosionSound.play();
      this.activePowerUps.remove(powerup);
      powerup.destroy();
      this.collideMultiple(enemy); // Destroys many enemies in the vicinity.
      enemy.destroy(); 
    }
  }


  /**
   * makeDefenses, adds turrets to the game for the defensive structures when they are recieved.
   * 
   * @param None
   * @return None
   */
  addDefenses(): void {
    // Initial turret positions
    this.chromeTurret = new Turret(this, this.defensiveInventoryCoords[0][0], this.defensiveInventoryCoords[0][1], true, "chrome_turret");
    this.purpleShip = new Turret(this, this.defensiveInventoryCoords[1][0], this.defensiveInventoryCoords[1][1], false, "purple_ship");
    this.barrelTurret = new Turret(this, this.defensiveInventoryCoords[2][0], this.defensiveInventoryCoords[2][1], false, "barrel_turret");
    this.wizardGuy = new Turret(this, this.defensiveInventoryCoords[3][0], this.defensiveInventoryCoords[3][1], false, "wizard_dude");

    this.chromeTurret.setInteractive({draggable: true}); // Chrome Turret is the only available turret at first
    this.onDrag(this.chromeTurret);
    this.turrets = this.physics.add.group(); // Make a physics enabled group for the turrets
    this.turrets.add(this.chromeTurret); // Add the four turrets to the group
    this.turrets.add(this.purpleShip);
    this.turrets.add(this.barrelTurret);
    this.turrets.add(this.wizardGuy);
    
    for (let i = 1; i < 4; i++) { // Add locks on the other three turrets
      let ironBarLock = this.add.image(this.defensiveInventoryCoords[i][0], this.defensiveInventoryCoords[i][1], "iron_bar");
      this.lockImageList.push(ironBarLock);
    }
  }


  /**
   * handleBoxes, handles setting up the coordinates for the boxes thatr will be drawn on screen to represent
   *              the players inventory space for defensive structures. Calls the makeBoxes method to draw them.
   * 
   * @param None
   * @return None
   */
  handleBoxes(): void {
    this.defensiveInventoryCoords = [[75, this.scale.height-150], [75, this.scale.height-50], 
                                    [175, this.scale.height-150], [175, this.scale.height-50]];
    for (let i = 0; i < this.defensiveInventoryCoords.length; i++) {
      let coord: Array<number> = this.defensiveInventoryCoords[i];
      this.makeBoxes(coord[0], coord[1]); // indices 0, 1 for x, y
    }
  }


  /**
   * makeBoxes, draws a rectanglke on the screen with the given x and y coordinates.
   * 
   * @param x -> number, the x position of the box
   * @param y -> number, the y position of the box
   */
  makeBoxes(x: number, y: number): void {
    let width: number = 100
    let height: number = 100;
    let rect = this.add.rectangle(x, y, width, height, 0x9966ff);
    rect.setStrokeStyle(4, 0xefc53f); // Makes an outline of the box
    this.boxList.push(rect);
  }


  /**
   * hurtCrystal, if an enemy collides with the crystal, it is hurt and loses some health. This method crops 
   *              a percentage of the healthbar to indicate the crystal is losing life. If health reaches 0, plays the death sequence.
   * 
   * @param crystal -> any, the time crystal, not used here, but required for the callback to compile
   * @param enemy -> any, the enemy that hit the crystal
   */
  hurtCrystal(crystal: any, enemy: any): void {
    this.health -= 45;
    this.healthBar.setCrop(0, 0, this.health, 97); // Height in pixels of the health bar is 97
    enemy.destroy();
    if (this.health - 45 < 0) 
      this.deathSequence();
  }


  /**
   * deathSequence, plays an animation and sound upon death. No return type because this method is asynchronous.
   * 
   * @param None
   * @return None
   */
  async deathSequence() {
    // Death Clock
    let length: number = this.enemies.getChildren().length;
    for (let i = 0; i < length; i++) // Clear remaining enemies
      this.enemies.getChildren()[0].destroy(); // Must kill children at zero as they get popped off the list
    if (!this.deathSound.isPlaying) {
      this.handleMusic(3);
      this.deathSound.play();
      this.deathClock = this.physics.add.sprite(0, this.scale.height/2, "death_clock");
      this.tweens.add({ // Animation for respawning player
        targets: this.deathClock,
        x: this.scale.width-260,
        duration: 4000, 
        repeat: 0,
        onComplete: () => {
          this.deathClock.destroy();
          this.resetGameProtocol(true); // Reset the game to level 1 so it is ready if the player hitrs play again in the lose scene
          this.scene.switch("LoseScene"); // Use start to reset main scene
        },
        callbackscope: this,
      });
      await sleep(2700);
      this.cameras.main.flash(700, 255, 0, 0); // Number is the duration of the flash
    }
  }


  /**
   * resetGameProtocol, resets the game if the crystal health goes below 0, or the player dies, or the player reaches the end of the
   *                    game and wants to restart.
   * 
   * @param hasLost -> boolean, true if the player lost the game, false otherwise
   * @return None
   */
  resetGameProtocol(hasLost: boolean): void {
    this.resetGame = true;
    MainScene.chestNum = 0;
    this.chestsOnScene = 0;
    this.levelTwoBackground.setVisible(false);
    this.levelThreeBackground.setVisible(false);
    this.levelOneBackground.setVisible(true);
    if (!hasLost) {
      this.setVisibleHandler();
      this.isWaveDone = false;
      this.isWaveStarted = false;
    }
    MainScene.numClones = [1,1,1,1,1];
    MainScene.powerUps = [1,1,1,1,1];
    for (let i = 0; i < this.chestArray.length; i++) 
      this.chestArray[i].destroy();
    let clones: any = this.cloneList.getChildren();
    let cloneLen: number = clones.length;
    for (let i = 0; i < cloneLen; i++)
      clones[0].destroy();
    let powerupLen: number = this.activePowerUps.getChildren();
    let actives: any = this.activePowerUps.getChildren();
    for(let i = 0; i < powerupLen; i++)
      actives[0].destroy();
    let turretGroup = this.turrets.getChildren();
    let turretLen: number = turretGroup.length
    for (let i = 0; i < turretLen; i++) {
      let turret = turretGroup[i];
      turret.x = this.defensiveInventoryCoords[i][0];
      turret.y = this.defensiveInventoryCoords[i][1];
      turret.setRotation(0);
      if (!(turret === this.chromeTurret)) {
        turret.disableInteractive();
        turret.isUnlocked = false;
      }
    }
    this.lockImageList.splice(0, this.lockImageList.length); // Reset and clean array
    for (let i = 1; i < 4; i++) { // Reset the iron bars locking turrets
      let ironBarLock = this.add.image(this.defensiveInventoryCoords[i][0], this.defensiveInventoryCoords[i][1], "iron_bar");
      this.lockImageList.push(ironBarLock);
    }
    let children = this.enemies.getChildren();
    let length: number = children.length
    for (let i = 0; i < length; i++) {
      children[0].destroy(); // As children are killed, they are popped off the group, must keep killing children at index 0
    }
    this.waveNumber = "wave1";
    this.enemySpawnText.destroy(); // Reset the text for new game
    this.health = this.MAXHEALTH;
    this.healthBar.setCrop(0, 0, this.health, 97);
    this.handleMusic(3); // Stop song from playing in lose scene
    LevelComplete.levelNumber = 1; // Back to level 1
  }


  /**
   * getPossibleHours, generates an array of four numbers, each is randomly chosen between 1 and 12.
   * 
   * @param None
   * @return randomHours -> Array<number>, the array of ranom numbers
   */
  getPossibleHours(): Array<number> {
    let randomHours: Array<number> = [];
    for (let i = 0; i < 4; i++) {
      randomHours.push(Math.floor(Math.random() * 12) + 1); // Gets random number between 1 and 12
    }
    return randomHours;
  }


  /**
   * announceTime, displays a warning onscreen telling the player which time the enemies will come from. Does this before each wave.
   *               This code looks complicated, but it is just for formatting text on screen because I don't understand regular expressions. 
   * 
   * @param None
   * @return None
   */
  announceTime(): void {
    let times: String = "";
    let numWords: number = 0;
    let wasAdded: boolean = false;
    for (let i = 0; i < this.spawnTimes.length; i++) {
      if (!times.includes(this.spawnTimes[i].toString(10) + ":00"))
        wasAdded = true
      if (numWords % 3 == 0 && numWords != 0 && wasAdded) // Seperate by newline and spaces every three times
        times += "\n                                     ";
      // Seperate by newline every three times, else sepeate on same line by comma
      if (wasAdded) { // Don't re-add times already displayed
        if (i == this.spawnTimes.length-1) // If it is at the last word, con't include space and comma
          times += this.spawnTimes[i].toString(10) + ":00"; // Base 10
        else
          times += this.spawnTimes[i].toString(10) + ":00, ";
        numWords++;
      }
      wasAdded = false;
    }
    this.enemySpawnText = this.add.text(0, 10, "Enemies coming from: " + times, {
      font: "30px Arial",
      bold: true,
      fill:"black"});
      this.enemySpawnText.setX((this.scale.width/2)-(this.enemySpawnText.width/2));
  }


  /**
   * getCurrentSong, gets the song currently playing in the game. This method is useful becuase it helps avoid duplicate code whenever 
   *                 the song needs to pause.
   * 
   * @param None
   * @return song -> Phaser.Sound.BaseSound, the song currently playing
   */
  getCurrentSong(): Phaser.Sound.BaseSound {
    let song: Phaser.Sound.BaseSound = this.levelOneTrack;
    switch(LevelComplete.levelNumber) {
      case 1:
        song = this.levelOneTrack;
        break;
      case 2: 
        song = this.levelTwoTrack;
        break;
      case 3:
        song = this.levelThreeTrack;
      default:
        break;
    }
    return song;
  }


  /**
   * handleMusic, plays the song for this scene. It is meant to be background music so it should'nt be to
   *              loud. A config is set up for this. Handles whether the song should be paused, started, or resumed.
   *              1: resume the song, 2: play the song, 3: pause the song
   * 
   * @param action -> number, a number indicating which action this method shouild perform, resume, play, or pause
   * @return None
   */
  handleMusic(action: number): void {
    let song: Phaser.Sound.BaseSound = this.getCurrentSong();
    let trackConfig = {
      mute: false,
      volume: .2,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    };
    if (song.isPaused) {
      if (action == 1) {
        song.resume();
      } 
    }
    if (action == 2) {
      song.play(trackConfig);
    } 
    if (action == 3) {
      song.pause();
    }
  }


  /**
   * makeTimeCrystal, displays the time crystal spritesheet in the center of the screen.
   * 
   * @param None
   * @return None
   */
  makeTimeCrystal(): void {
    this.timeCrystal = this.physics.add.sprite(this.scale.width/2, this.scale.height/2, "time_crystal");
    this.timeCrystal.play("time_crystal_anim");
  }


  /**
   * makeText, makes interactive text onscreen with the specified text and x, y values. The text is destroyed when clicked.
   *           This method appends the text to the tutorialTextArray class attribute.
   * 
   * @param messageIndex -> number, the index at which to get the message from the message array
   * @param text -> string, the message
   * @param x -> number, the x coordinate of the message
   * @param y -> number, the y coordinate of the message
   * @return None
   */
  makeText(messageIndex: number, text: string, x: number, y: number): void {
    let textSize: string = "24";
    if (messageIndex === 3)
      textSize = "35";
    let textDisplay = this.add.text(0, 0, text, {fill: "white", font: "bold " + textSize + "px Serif"});
    textDisplay.setBackgroundColor("black");
    textDisplay.setX((this.scale.width/2) - (textDisplay.width/2) + x);
    textDisplay.setY((this.scale.height/2) - (textDisplay.height/2) + y);
    textDisplay.setInteractive();
    textDisplay.on("pointerdown", () => {
      textDisplay.destroy();
      this.tutorialTextArray.pop();
    });
    this.tutorialTextArray.push(textDisplay);
  }


  /**
   * runTutorial, displays some text boxes for the player tro see a tthe start of the game. They are displayed one
   *              after the other after being destroyed by the player with a mouse click.
   *
   * @param messageNumber -> number, the index of the message list containing the messages to display
   * @return None
   */
  runTutorial(messageNumber: number): void {
    let turretText: string = "These are your defenses,\ndrag them around.\nCLICK TO DELETE";
    let startWaveText: string = "This button will spawn enemies\nget ready!";
    let chestText: string = "Here is a chest, enemies drop them.\nClick on it to pick it up.\nthen click \"open chests\" to open it.";
    let powerupText: string = "Hold down spacebar to see your items\ndrag them to vulnerable spots.";
    let stringList: Array<string> = [turretText, startWaveText, chestText, powerupText];
    if (messageNumber > stringList.length-1)
      return;
    switch(messageNumber) {
      case 0: // Turret Text
        this.makeText(0, stringList[messageNumber], -350, 260); // Display it above the turrets
        break;
      case 1: // Start Button Text
        this.makeText(1, stringList[messageNumber], -270, -275); // Display it above the turrets
        break;
      case 2: // Chest Text
        this.makeText(2, stringList[messageNumber], -250, -100);
        break;
      case 3: // Powerup Text
        this.makeText(3, stringList[messageNumber], 0, 0);
        break;
    }
  }
  

  /**
   * prepWave, displays the times enemies will spawn from and returns those times as an array to be used 
   *           in other parts of the program. This method also pushes hours from an array of four random hours
   *           into the spawn times array. Right now the most positions enemies can come from is 4, what is the
   *           point of having the spawn anywhere, the player wouldn't learn anything. 
   * 
   * @param None
   * @return None
   */
  prepWave(): void {
    this.resetGame = false;
    let levelWaves = this.levelInfo["level" + LevelComplete.levelNumber.toString()];
    let numEnemies = levelWaves[this.waveNumber];
    let randomHours: Array<number> = this.getPossibleHours();

    for (let i = 0; i < parseInt(numEnemies); i++)  // Addwing the times that enemies will sapawn from to an array
      this.spawnTimes.push(randomHours[Math.floor(Math.random() * randomHours.length)]); // Choose one of the four random hours to push
    this.announceTime(); // Display the times enemies will come from on screen
  } 



  /**
   * startWave, starts the wave of enemies. Spawns in enemies based on the time at which they are supposed to spawn.
   * 
   * @param None
   * @return None
   */
  async startWave() {
    this.enemySpawnText.destroy();
    this.setInvisibleHandler(); // Clears things off the screen 
    let levelWaves = this.levelInfo["level" + LevelComplete.levelNumber.toString()];
    let numEnemies = levelWaves[this.waveNumber];
    if (this.spawnTimes.length != 0) {
      for (let i = 0; i < parseInt(numEnemies); i++) { // Spawn the enemies, let the fun begin
        if (this.resetGame) {
          this.isWaveDone = true;
          return; // Stop spawing enemies if the game ends
        }
        await sleep(200); // Milliseconds
        if (this.resetGame) { // Using async causes weird problems, this is the only way I could fix it
          this.isWaveDone = true;
          return; // Stop spawing enemies if the game ends
        }
        this.spawnEnemy(this.getEnemyCoords(this.spawnTimes[i])); 
        this.isWaveStarted = true; // Defend mode
      }
      this.isWaveDone = true;
    }
  }


  /**
   * endWave, handles incrementing some key values after the wave is over and getting ready for the next wave. If the player has won, lost,
   *          or completed a level, this method switches scenes to the proper scene. 
   * 
   * @param None
   * @return None
   */
  endWave(): void {
    let waveIndex: number = parseInt(this.waveNumber[this.waveNumber.length-1]); // Get last character as number
    waveIndex++; // Go to next wave
    if (waveIndex > Object.keys(this.levelInfo["level" + LevelComplete.levelNumber.toString()]).length) {// Go to level complete scene if the end of the final wave is reached.
      if (LevelComplete.levelNumber+1 > 3) {
        this.resetGameProtocol(false);
        this.getCurrentSong().stop();
        this.scene.switch("VictoryScene"); // End of the game
      } else {
        this.endWaveHelper(waveIndex);
        this.waveNumber = "wave1"; // Go to next level
        this.handleMusic(3); // 3 for stopping the song
        this.isLevelSwitching = true;
        this.scene.switch("LevelComplete");
      }
    } else {
        this.endWaveHelper(waveIndex); // Just prepares for the next wave
    }
  }


  /**
   * endWaveHelper, deletes all of the turret projectiles, sets certain objects back to being visible, updates the
   *                wave number, and updates the booleans isWaveStarted and isWWaveDone.
   * 
   * @param waveIndex -> number, the wave the player is currently on
   * @return None
   */
  endWaveHelper(waveIndex: number): void {
    for (let i = 0; i < this.turretProjectiles.getChildren().length; i++)
      this.turretProjectiles.getChildren()[i].destroy();
    this.setVisibleHandler(); // Bring back invisible objects
    this.isWaveStarted = false; // Wave over, Prep mode
    this.isWaveDone = false;
    this.spawnTimes.splice(0, this.spawnTimes.length); // Reset the spawn times for the next wave
    if (!this.resetGame) {
      this.unlockTurret();
      this.waveNumber = this.waveNumber.substr(0, this.waveNumber.length-1); // Delete last character
      this.waveNumber += waveIndex; // Concatenate    
    }
  }


  /**
   * unlockTurret, chooses a random number between 1 and 3 which represents one of the three turrets the player has not unlocked yet.
   *               This turret is then unlocked and the player is free to use it. Happens once at the end of each wave, so everey turret
   *               will be available to the player after the first level. 
   * 
   * @param None
   * @return None
   */
  unlockTurret(): void {
    let randomUnlock: number = Math.floor(Math.random() * 3) + 1; // Get random number between 1 and 3
    let notUnlocked: boolean = true;
    if (!this.barrelTurret.isUnlocked || !this.wizardGuy.isUnlocked || !this.purpleShip.isUnlocked) {
      while (notUnlocked) { // Keep re rolling random number until a turret is unlocked
        if (randomUnlock == 1) { // Wizard Guy
          if (!this.wizardGuy.isUnlocked) {
            notUnlocked = false;
            this.wizardGuy.isUnlocked = true;
            this.lockImageList[2].setVisible(false);
            this.lockImageList[2] = -1; // Remove this image from the array
            this.wizardGuy.setInteractive({draggable: true});
          }
        } 
        if (randomUnlock == 2) { // Barrel Turret
          if (!this.barrelTurret.isUnlocked) {
            notUnlocked = false;
            this.barrelTurret.isUnlocked = true;
            this.lockImageList[1].setVisible(false);
            this.lockImageList[1] = -1;
            this.barrelTurret.setInteractive({draggable: true});
          }
        } 
        if (randomUnlock == 3) { // Purple Ship
          if (!this.purpleShip.isUnlocked) {
            notUnlocked = false;
            this.purpleShip.isUnlocked = true;
            this.lockImageList[0].setVisible(false);
            this.lockImageList[0] = -1;
            this.purpleShip.setInteractive({draggable: true});
          }
        }
        randomUnlock = Math.floor(Math.random() * 3) + 1; // Re-Roll
      }
    }
  }

  
  /**
   * setVisibleHandler, takes all of the objects that were set to invisible during the wave and sets them back to being visible again.
   * 
   * @param None
   * @return None
   */
  setVisibleHandler(): void {
    this.waveStartButton.setVisible(true); // Bring back the start wave button
    this.chestButton.setVisible(true); // Bring back the chest button after wave
    for (let i = 0; i < this.boxList.length; i++) // Bring backw the inventory boxes
      this.boxList[i].setVisible(true);
    for (let i = 0; i < this.turrets.getChildren().length; i++)
      this.turrets.getChildren()[i].setVisible(true);
    for (let i = 0; i < this.lockImageList.length; i++)
      if (this.lockImageList[i] != -1) // Fillinf in with -1 to indicate the image is gone
        this.lockImageList[i].setVisible(true);
  }


  /**
   * setInvisibleHandler, takes objects that are only meant to be displayed on the prep phase and makes them invisble for the defend phase.
   * 
   * @param None
   * @return None
   */
  setInvisibleHandler(): void {
    this.waveStartButton.setVisible(false);
      this.chestButton.setVisible(false);
      for (let i = 0; i < this.boxList.length; i++)
        this.boxList[i].setVisible(false);
      for (let i = 0; i < this.turrets.getChildren().length; i++)
        if (!this.turrets.getChildren()[i].isUnlocked)
          this.turrets.getChildren()[i].setVisible(false);
      for (let i = 0; i < this.lockImageList.length; i++)
        if (this.lockImageList[i] != -1)
          this.lockImageList[i].setVisible(false);
  }

  
  /**
   * makeWaveStartButton, makes a button which when pressed, brings forth the wave of enemies.
   * 
   * @param None
   * @return None
   */
  makeWaveStartButton(): void {
    this.waveStartButton = this.add.text(0, 200, "Start-Wave", {fill: "red", font: "bold 40px Serif"});
    this.waveStartButton.setBackgroundColor("black");
    this.waveStartButton.setX((this.scale.width/2)-(this.waveStartButton.width/2));
    this.waveStartButton.setInteractive();
    this.waveStartButton.on("pointerdown", () => this.startWave());
  }


  /**
   * makeChestButton, handles displaying the button to switch to the chest scene on the screen when the wave of enemies is over.
   * 
   * @param None
   * @return None
   */
  makeChestButton(): void {
    this.chestButton = this.add.text(0, 0, "Open Chests", {fill: "red", font: "bold 50px Serif"});
    this.chestButton.setBackgroundColor("black");
    this.chestButton.setX((this.scale.width/2) - (this.chestButton.width/2) + 350);
    this.chestButton.setY((this.scale.height/2) - (this.chestButton.height/2) + 400);
    this.chestButton.setInteractive();
    this.chestButton.on("pointerdown", () => {
      this.handleMusic(3);
      this.scene.switch("ChestScene");
    });
  }


   /**
   * getEnemyCoords, Returns a range of pixels for the enemy to spawn based on the random hour chosen.
   * 
   * @param hour -> number, the hour the enemy will spawn at
   * @return coords -> Array<number> an array containing the x and y coordinates of the enemy like [x, y]
   */
  getEnemyCoords(hour: number): Array<number> {
    let coords: Array<number> = [0, 0, 0];
    let offsetX: number = 300;
    let offsetY: number = 300;
    switch(hour) {
      case 1:
        coords = [(this.scale.width/2)+offsetX, 0, 1];
        break;
      case 2:
        coords = [this.scale.width, (this.scale.height/2)-offsetY, 2];
        break;
      case 3:
        coords = [this.scale.width, this.scale.height/2, 3];
        break;
      case 4:
        coords = [this.scale.width, (this.scale.height/2)+offsetY, 4];
        break;
      case 5:
        coords = [(this.scale.width/2)+offsetX, this.scale.height, 5];
        break;
      case 6:
        coords = [this.scale.width/2, this.scale.height, 6];
        break;
      case 7: 
        coords = [(this.scale.width/2)-offsetX, this.scale.height, 7];
        break;
      case 8:
        coords = [0, (this.scale.height/2)+offsetY, 8];
        break;
      case 9:
        coords = [0, this.scale.height/2, 9];
        break;
      case 10:
        coords = [0, (this.scale.height/2)-offsetY, 10];
        break;
      case 11:
        coords = [(this.scale.width/2)-offsetX, 0, 11];
        break;
      case 12:
        coords = [this.scale.width/2, 0, 12];
        break;
    }
    return coords;
  }


  /**
   * spawnEnemy, spawns an enemy on an edge of the map based on the time the enemy is supposed to come out from.
   *
   * @param coords -> Array<number>, an array containing the coordinates of the enemy like [x, y]
   * @return None
   */
  spawnEnemy(coords: Array<number>): void {
    let enemyNumber: number = Math.floor(Math.random() * this.numEnemies) + 1; // Gets random number between 1 and numEnemies
    let x: number = coords[0];
    let y: number = coords[1];
    let spawnPosition = coords[2];
    let name: string = "";
    let moveSpeed: number = 0;
    let enemy: Enemy;
    switch(enemyNumber) {
      case 1:
        name = "armor_goblin";
        moveSpeed = 50;
        enemy = new Enemy(this, x, y, spawnPosition, moveSpeed, name);
        enemy.setRotation(Phaser.Math.Angle.Between(500, 500, enemy.x, enemy.y)-this.ROTATION_MAGIC_NUMBER);
        this.enemies.add(enemy);
        break;
      case 2:
        name = "speed_goblin";
        moveSpeed = 100;
        enemy = new Enemy(this, x, y, spawnPosition, moveSpeed, name);
        enemy.setRotation(Phaser.Math.Angle.Between(500, 500, enemy.x, enemy.y)-this.ROTATION_MAGIC_NUMBER);
        this.enemies.add(enemy);
        break;
      case 3:
        name = "time_goblin";
        moveSpeed = 60;
        enemy = new Enemy(this, x, y, spawnPosition, moveSpeed, name);
        enemy.setRotation(Phaser.Math.Angle.Between(500, 500, enemy.x, enemy.y)-this.ROTATION_MAGIC_NUMBER);
        this.enemies.add(enemy);
        break;
      case 4: 
        name = "the_punisher";
        moveSpeed = 75;
        enemy = new Enemy(this, x, y, spawnPosition, moveSpeed, name);
        enemy.setRotation(Phaser.Math.Angle.Between(500, 500, enemy.x, enemy.y)-this.ROTATION_MAGIC_NUMBER);
        this.enemies.add(enemy);
        break;
    }
  }


  /**
   * getTurretPosition, defines a range in pixels iun which a turret can be placed in order to be in the right time
   *                    (hour) to be able to shoot at incoming enemies. Returns a number indicating the hour the
   *                     player put the turret at.
   * 
   * @param turret -> Turret, the turret
   * @return position -> number, the position of the turret
   */
  getTurretPosition(turret: Turret): number {
    let position: number = 0;
    let rotation: number = turret.rotation*(180/Math.PI); // Convert radians to degrees
    if (((rotation > -13) && (rotation < 0)) || ((rotation > 0) && (rotation < 11))) { // Range for 12:00, special case, signs switch
      position = 12;
    } else if (rotation > 19.69134377126048 && rotation < 39.99554037468087) {
      position = 1;
    } else if (rotation > 48.0614155170337 && rotation < 70.04563644592203) {
      position = 2;
    } else if (rotation > 80.32192165246756 && rotation < 101.3710007513927) {
      position = 3;
    } else if (rotation > 110.9259923779076 && rotation < 130.79472524869615) {
      position = 4;
    } else if (rotation > 138.24039917971746 && rotation < 159.47851711784577) {
      position = 5;
    } else if (((rotation > 168.2) && (rotation < 180)) || ((rotation > -180) && (rotation < -168.65868323804432))) { // Special case, degrees switch signs
      position = 6;
    } else if (rotation > -161.66294952200155 && rotation < -139.4393900240417) {
      position = 7;
    } else if (rotation > -129.250459164445 && rotation < -108.00933800945111) {
      position = 8;
    } else if (rotation > -99.85640683018694 && rotation < -80.7420033682108) {
      position = 9;
    } else if (rotation > -71.24635682830013 && rotation < -51.2913427210587) {
      position = 10;
    } else if (rotation > -41.02696598387933 && rotation < -20.08122146251615) {
      position = 11;
    }
    return position;
  }


  /**
   * moveProjectiles, handles the custom movement for each turrets projectile.
   *
   * @param turret -> Turret, the turret
   * @param enemy -> Enemy, the enemy
   * @param projectile -> Projectile, the projectile
   * @return None
   */
  moveProjectiles(turret: Turret, enemy: Enemy, projectile: Enemy): void {
      projectile.setRotation(turret.rotation-this.ROTATION_MAGIC_NUMBER); // Don't touch 
      let chromeSpeed: number = 400;
      let wizardSpeed: number = 400; 
      let barrelSpeed: number = 400;
      let purpleSpeed: number = 200;
      let speedSlow: number = 350;
      if (this.isScrollWheelUp) { // Slows projectiles while player is choosing powerup
        chromeSpeed -= speedSlow;
        wizardSpeed -= speedSlow;
        barrelSpeed -= speedSlow;
        purpleSpeed -= 150;
      } // Last parameter is the projectile speed
      if (turret === this.chromeTurret) {this.physics.moveTo(projectile, enemy.x, enemy.y, chromeSpeed);}
      if (turret === this.wizardGuy) {this.physics.moveTo(projectile, enemy.x, enemy.y, wizardSpeed);}
      if (turret === this.barrelTurret) {this.physics.moveTo(projectile, enemy.x, enemy.y, barrelSpeed);}
      if (turret === this.purpleShip) {this.physics.moveTo(projectile, enemy.x, enemy.y, purpleSpeed);}
  }


  /**
   * armoredResponseCoalition, takes in a turret and spawns projectiles for the turret based on which clas it belongs to.
   *                           The projectile moves towards an enemy at a speed pre determined by the turret class. 
   * 
   * @param turret -> Turret, the turret
   * @param enemy -> Enemy, the enemy
   * @param time -> number, the time delay
   * @return None
   */
  armoredResponseCoalition(turret: Turret, enemy: Enemy, time: number): void {
    let projectile: any = null;
    let bulletDelay: number = 3000;
    let chromeDelay: number = 200; // Milliseconds
    let purpleDelay: number = 2000;
    let barrelDelay: number = 1500;
    let wizardDelay: number = 1000;
    let soundRate: number = 1;
    if (this.isScrollWheelUp) {
      chromeDelay += bulletDelay;
      purpleDelay += bulletDelay;
      barrelDelay += bulletDelay;
      wizardDelay += bulletDelay;
      soundRate = .2;
    }
    let projectileSoundConfig = {rate: soundRate, volume: turret === this.chromeTurret || turret === this.purpleShip ? .2 : .4};
    if (turret === this.chromeTurret && (time - this.chromeTurret.bulletDelay > chromeDelay)) { // Magic numbers are just delays between each shot
      this.beamSound.play(projectileSoundConfig);
      projectile = new Projectile(this, this.chromeTurret, "laser_beam");
      this.chromeTurret.bulletDelay = new Date().getTime(); // Get new current time of day
    }
    if (turret === this.purpleShip && (time - this.purpleShip.bulletDelay > purpleDelay)) {
      this.kamehamehaSound.play(projectileSoundConfig);
      projectile = new Projectile(this, this.purpleShip, "kamehameha_beam");
      this.purpleShip.bulletDelay = new Date().getTime(); // Get new current time of day
    }
    if (turret === this.barrelTurret && (time - this.barrelTurret.bulletDelay > barrelDelay)) {
      this.pewPewSound.play(projectileSoundConfig);
      projectile = new Projectile(this, this.barrelTurret, "pixel_bullet");
      this.barrelTurret.bulletDelay = new Date().getTime(); // Get new current time of day
    }
    if (turret === this.wizardGuy && (time - this.wizardGuy.bulletDelay > wizardDelay)) {
      this.fireBallSound.play(projectileSoundConfig);
      projectile = new Projectile(this, this.wizardGuy, "fire_ball");
      this.wizardGuy.bulletDelay = new Date().getTime(); // Get new current time of day
    }
    if (projectile != null)
      this.moveProjectiles(turret, enemy, projectile);
  }


  /**
   * shootAtEnemy, make defenses fire if an enemy is within their range, so coming at the turret a tth e right hour(angle).
   * 
   * @param turret -> Turret, the turret to check
   * @return None
   */
  shootAtEnemy(turret: Turret): void {
    const turretPlacement: number = this.getTurretPosition(turret);
    for (let i = 0; i < this.spawnTimes.length; i++) {
      if (this.spawnTimes[i] == turretPlacement) {
        let time: number = new Date().getTime(); // Returns milliseconds
        for (let i = 0; i < this.enemies.getChildren().length; i++) {
          let enemy = this.enemies.getChildren()[i];
          if (enemy.spawnPosition == turretPlacement) // My attempt at staggering the projectile spawn rate
            this.armoredResponseCoalition(turret, enemy, time);
        }
      }
    }
  }


  /**
   * moveEnemy, updates the x and y position of the enemy based on the enemies speed attribute. Slows all enemies down to a crawl
   *            if the speedDown parsamter is not 0.
   * 
   * @param enemy -> Enemy, the enemy to move
   * @return None
   */
  moveEnemy(enemy: Enemy): void {
    let speed: number = this.isScrollWheelUp ? 5 : enemy.moveSpeed; // 5 is a pretty slow movement speed
    this.physics.moveTo(enemy, this.scale.width/2, this.scale.height/2, speed); // Add 4rth paramter for speed
  }


  /**
   * sceneSwitchUpdater, Uses global boolean variables to do actions such as playing music one time after switching back from 
   *                     a sub scene to the main scene.
   *       
   * @param None
   * @return None
   */
  sceneSwitchUpdater(): void {
    if (LevelComplete.switching) {
      LevelComplete.switching = false;
      this.isLevelSwitching = false;
      if (LevelComplete.levelNumber === 2) {
        this.levelOneBackground.setVisible(false);
        this.levelTwoBackground.setVisible(true);
      }
      if (LevelComplete.levelNumber === 3) {
        this.levelTwoBackground.setVisible(false);
        this.levelThreeBackground.setVisible(true);
      }
      this.handleMusic(2);
      this.prepWave();
    }
    if (LoseScene.switching) {
      LoseScene.switching = false;
      this.handleMusic(1);
    }
    if (ChestScene.switching) {
      ChestScene.switching = false;
      this.updatePowerupCount();
      this.handleMusic(1);
    }
    if (VictoryScene.switching) {
      VictoryScene.switching = false;
      this.handleMusic(2);
    }
  }

  
  /**
   * mainUpdater, this method is the most important in update. It handles resetting the game, going to the next level, spawning enemies, 
   *              moving enemies, just about anything you could think of.
   * 
   * @param None
   * @return None
   */
  mainUpdater(): void {
    let length = this.enemies.getChildren().length;
    if (this.isWaveStarted) {
      for(let i = 0; i < length; i++)
        this.moveEnemy(this.enemies.getChildren()[i]);
      if (length == 0 && this.isWaveDone && this.health > 0) { // If all the enemies are gone, go back to prep mode
        this.endWave();
        if (!this.isLevelSwitching)
          this.prepWave();
      }
      this.shootAtEnemy(this.chromeTurret);
      this.shootAtEnemy(this.wizardGuy);
      this.shootAtEnemy(this.purpleShip);
      this.shootAtEnemy(this.barrelTurret);
    }
  }


  /**
   * updatePowerupCount, draws the number of powerups available to the player when they use them or gain more.
   * 
   * @param None
   * @return None
   */
  updatePowerupCount(): void {
    for (let i = 0; i < this.powerupTextList.length; i++) // Update the on screen count
      this.powerupTextList[i].setText("X" + MainScene.numClones[i].toString());
  }


  /**
   * makeClones, makes clones of the powerups to be dragged and used. These clones make it possible to drag and drop a clone of the
   *             powerup image in one click because they are spawned in as the player gets more powerups. When the clone is clicked, 
   *             it is added to the activepowerup group so they can collide with enemies.
   *  
   * @param None
   * @return None
   */
  makeClones(): void {
    for (let i = 0; i < 5; i++) {
      if (MainScene.powerUps[i] > 0) {
        let powerupType: any; 
        let name: string = "";
        if (i === 0) {powerupType = this.flowerPowerup; name = "bombPowerup"};
        if (i === 1) {powerupType = this.spikePowerup; name = "spike_powerup"};
        if (i === 2) {powerupType = this.energyPowerup; name = "energy_ball"};
        if (i === 3) {powerupType = this.picklePowerup; name = "pickle_rick"};
        if (i === 4) {powerupType = this.pearlPowerup; name = "pearl"};
        let depthCount: number = 0;
        while (MainScene.powerUps[i] != 0) {
          MainScene.powerUps[i]--;
          let clone: any = new Clone(this, powerupType.x, powerupType.y, powerupType.texture, name);
          this.input.on("drag", () => {
              if (clone.x != powerupType.x || clone.y != powerupType.y) {
                if (!clone.isActive) { // Make sure this only happens once. This took way to long to figure out.
                  if (MainScene.numClones[i]) 
                    MainScene.numClones[i]--;
                  clone.isActive = true;
                  this.activePowerUps.add(clone); 
              } 
            }
          });   
          clone.depth = this.CLONE_DEPTH+depthCount;
          clone.setVisible(false);
          this.cloneList.add(clone);
          depthCount++;
        }
      }
    }
  }


  /**
   * displayPowerupBar, while the spacebar is held down, a wheel containing the powerups is displayed on screen and
   *                    in game time is slowed down.
   * 
   * @param None
   * @return None
   */
  displayPowerupBar(): void {
    this.isSpacebarDown = true;
    if (this.isSpacebarDown && !this.isScrollWheelUp) {
      this.makeClones();
      for (let i = 0; i < this.cloneList.getChildren().length; i++) {
        this.cloneList.getChildren()[i].setVisible(true);
        this.cloneList.getChildren()[i].setInteractive({draggable: true});
      }
      this.handleMusic(3);
      this.stopSounds();
      this.zaWarudo.play({volume: .6});
      this.powerupWheel.setVisible(true);
      for (let i = 0; i < this.powerupTextList.length; i++)
        this.powerupTextList[i].setVisible(true);
      for (let i = 0; i < this.POWERUP_COUNT; i++) 
        this.powerUpGroup.getChildren()[i].setVisible(true);
      this.isScrollWheelUp = true;
    }
  }

  
  /**
   * hidePowerBar, hides the powerbar and the powerups when the space bar is released. 
   * 
   * @param None
   * @return None
   */
  hidePowerBar(): void {
    this.powerupWheel.setVisible(false);
    for (let i = 0; i < this.cloneList.getChildren().length; i++) {
      if (!this.cloneList.getChildren()[i].isActive) {
        this.cloneList.getChildren()[i].disableInteractive();
        this.cloneList.getChildren()[i].setVisible(false);
      }
    }
    for (let i = 0; i < this.POWERUP_COUNT; i++) {
      this.powerUpGroup.getChildren()[i].setVisible(false);
      this.powerupTextList[i].setVisible(false);
    }
    this.isScrollWheelUp = false;
    this.isSpacebarDown = false;
    this.stopSounds();
    if (this.zaWarudo.isPlaying)
      this.zaWarudo.stop();
    this.handleMusic(1);
  }


  /**
   * stopSounds, stops the projectile sounds.
   * 
   * @param None
   * @return None
   */
  stopSounds(): void {
    this.fireBallSound.stop();
    this.kamehamehaSound.stop();
    this.fireBallSound.stop();
    this.beamSound.stop();
  }


  /**
   * setPowerupAlpha, if the powerups array is non zero for each of its indices, set the powerup at that index to have an alpha
   *                  value of 1, else .5.
   * 
   * @param None
   * @return None
   */
  setPowerupAlpha(): void {
    let powerups: any = this.powerUpGroup.getChildren();
    for (let i = 0; i < powerups.length; i++) 
      MainScene.powerUps[i] ? powerups[i].setAlpha(1) : powerups[i].setAlpha(.5);
  }


  /**
   * showTutorial, shows the next tutorial box if there is one
   * 
   * @param None
   * @return None
   */
  showTutorial(): void {
    if (!this.tutorialTextArray.length) {
      this.runTutorial(this.tutorialMessageNumber);
      this.tutorialMessageNumber++;
    }
  }


  /**
   * update, runs rapidly, updating things in the game.
   * 
   * @param None
   * @return None
   */
  update(): void {
    this.updatePowerupCount();
    this.setPowerupAlpha();
    this.sceneSwitchUpdater(); // Handle sounds and level resets
    this.mainUpdater(); // Level switching among other things
    this.showTutorial();
  }
}
