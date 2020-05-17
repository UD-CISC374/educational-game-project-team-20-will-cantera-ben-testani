import ArmorGoblin from '../objects/armorGoblin';
import TimeGoblin from '../objects/timeGoblin';
import SpeedGoblin from '../objects/speedGoblin';
import ThePunisher from '../objects/thePunisher';
import { GameObjects } from 'phaser';
import LevelComplete from './levelComplete';
import ChromeTurret from '../objects/chromeTurret';
import PurpleShip from '../objects/purpleShip';
import BarrelGun from '../objects/barrelTurret';
import WizardGuy from '../objects/wizardGuy';
import Projectile from '../objects/projectile';
import LoseScene from './loseScene';
import VictoryScene from './victoryScene';
import ChestScene from './chestScene';
import Explosion from '../objects/explosion';
import Bomb from '../objects/bomb';

function sleep (milliseconds) { // Making the program wait for the given time
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export default class MainScene extends Phaser.Scene {
  // Constants
  private readonly numEnemies: number = 4;
  private readonly MAXHEALTH: number = 225;
  
  // Turrets and enemies, must be any to accept custom attributes
  public chromeTurret: any;
  private purpleShip: any;
  private wizardGuy: any;
  private barrelTurret: any;

  // Phaser groups
  private enemies: any;
  private turrets: any;

  // Phaser objects
  public turretProjectiles: GameObjects.Group;
  private timeCrystal: Phaser.GameObjects.Sprite;
  private chestButton: Phaser.GameObjects.Text;
  private powerUpButton: Phaser.GameObjects.Text;
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

  // Powerup Stuff
  public powerUps: any;
  public static bombPowerUpNum = 1;
  public static chestNum = 2;
  public static bombBool = false;
  public static beginning: boolean;

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
      "wave1": 12,
      "wave2": 20,
      "wave3": 40
      //"wave4": 10
    }
  };
  private waveNumber: string = "wave1"; // Keep track of what wave the player is on 
  private spawnTimes: Array<number> = []; // Will be filled in with random numbers between 1 and 12
  private isWaveStarted: boolean = false; // True if the wave is ongoing, false otherwise
  private boxList: Array<any> = [];
  private lockImageList: Array<any> = [];
  private defensiveInventoryCoords: Array<any> = [];
  private isWaveDone: boolean = false;
  private tutorialTextArray: Array<GameObjects.Text> = [];
  private tutorialMessageNumber: number = 0;
  private resetGame: boolean = false;
  private isLevelSwitching: boolean = false;


  /**
   * constructor, provides a reference to this scene
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  constructor() {
    super({ key: 'MainScene' });
  }


  init(data){
    // this.powerUpNum = data.powerup;
    // this.chestNum = data.chest;
    // this.bombBool= data.bombBool;
    //this.checkPowerUps();
  }

  /**
   * create, most of the code is moved to their own functions, that code is called in create to 
   *         setup this screen.
   * 
   * Consumes: Nothing
   * Produces: Nothing
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

    // Death Sound
    this.deathSound = this.sound.add("death_sound", {volume: 2});

    // Projectile Sounds
    this.beamSound = this.sound.add("laser_sound");
    this.kamehamehaSound = this.sound.add("kamehameha_sound");
    this.pewPewSound = this.sound.add("pew_pew");
    this.fireBallSound = this.sound.add("fireball_sound");

    // Draw the players defensive strucutre inventory on screen
    this.handleBoxes();

    // Add starting defensive structure to inventory 
    this.addDefenses();
    
    // Health bar for the time crystal
    this.healthBar = this.add.image(this.scale.width/2, (this.scale.height/2)-80, "health_bar");

    // Make a physics enabled group for the enemies
    this.enemies = this.physics.add.group();

    // Make a physics enabled group for the turrets
    this.turrets = this.physics.add.group();
    this.turrets.add(this.chromeTurret);
    this.turrets.add(this.purpleShip);
    this.turrets.add(this.barrelTurret);
    this.turrets.add(this.wizardGuy);

    // Draws the button onscreen for starting the wave
    this.makeWaveStartButton();

    // Gets the times enemies will spawn, stores them in array
    this.prepWave(); // Takes a varying amount of time
    
    // Load all the main songs for each level
    this.levelOneTrack = this.sound.add("warsaw_song");
    this.levelTwoTrack = this.sound.add("peace_reigns"); 
    this.levelThreeTrack = this.sound.add("shadow");

    // Plays the background song for this scene
    this.levelOneTrack.play({volume: .3}); // 2 for playing the song

    // Making some things to be drawn on screen
    this.makeTimeCrystal();
    this.makeChestButton();
    this.makePowerUpButton();

    // Group for projectiles
    this.turretProjectiles = this.add.group();

    // Adds collision between players shots and powerups, causing them to bounce
    this.physics.add.overlap(this.turretProjectiles, this.enemies, this.handleBulletCollision, this.giveTrue, this);

    this.powerUps = this.add.group();
    this.physics.add.collider(this.powerUps, this.enemies, function(powerUp, enemy){
      //let explosion = new Explosion(MainScene, powerUp., enemy.y);
      powerUp.destroy();
      enemy.destroy();
    });

    this.physics.add.overlap(this.powerUps, this.enemies, this.hitEnemy, this.giveTrue, this);

    // Adding collision for the time crystal and enemies
    this.physics.add.overlap(this.timeCrystal, this.enemies, this.hurtCrystal, this.giveTrue, this);
  }

hitEnemy(powerUp){
  let explosion = new Explosion(this, powerUp.x, powerUp.y);
}

  checkPowerUps(){
    if(MainScene.bombBool){
      this.makeBomb();
      MainScene.bombBool = false;
    }
  }

  makeBomb(){
    // this.bomb=this.add.image(this.scale.width/5, this.scale.height/5, "bombPowerup");
    // this.bomb.setScale(.2);
    // this.bombBool = false;
    // this.bomb.setInteractive({draggable:true});

    let bomb = new Bomb(this);
    //this.powerUps.add(bomb);
  }

  /**
   * giveTrue, for some reason, the Phaser overlap function needs a callback that returns true?
   * 
   * Consumes: Nothing
   * Produces: A boolean
   */
  giveTrue(): boolean {
    return true;
  }


  /**
   * handleBulletCollision, destroys projectiles and enemies.
   * 
   * Consumes: projectile, enemy
   * Produces: Nothing
   */
  handleBulletCollision(projectile, enemy): void {
    projectile.destroy();
    enemy.destroy();
    if (projectile.name === "kamehameha_beam" || projectile.name === "pixel_bullet") {
      this.collideMultiple(enemy);
    }
  }


  /**
   * collideMultiple, destroys multiple enemies based on how close they are to the enemy that collided with a projectile.
   * 
   * Consumes: An enemy
   * Produces: Nothing
   */
  collideMultiple(enemy) {
    for (let i = 0; i < this.enemies.getChildren().length; i++) {
      let child = this.enemies.getChildren()[i];
      if (child.x < enemy.x+50 && child.x > enemy.x - 50) {
        if (child.y < enemy.y+50 && child.y > enemy.y - 50) {
          child.destroy();
        }
      }
    }
  }


  /**
   * onDrag, defines the behaviour for the turrets when they are dragged. THe turrets get rotated to match the angle of the clock.
   * 
   * Consumes: Nothing 
   * Produces: Nothing
   */
  onDrag(): void {
    // Defining drag behaviour
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) { // Update turrets position on drag
      let spriteRotation: number = Phaser.Math.Angle.Between(500, 500, gameObject.x, gameObject.y); 
      gameObject.setRotation(spriteRotation-80.1); // Don't touch this number
      gameObject.x = dragX;
      gameObject.y = dragY;      
    });


  }
  /**
   * makeDefenses, adds sprites to the game for the defensive structures when they are recieved.
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  addDefenses(): void {
    // Starting Defense
    this.chromeTurret = new ChromeTurret(this, this.defensiveInventoryCoords[0][0], this.defensiveInventoryCoords[0][1]);
    this.purpleShip = new PurpleShip(this, this.defensiveInventoryCoords[1][0], this.defensiveInventoryCoords[1][1]);
    this.barrelTurret = new BarrelGun(this, this.defensiveInventoryCoords[2][0], this.defensiveInventoryCoords[2][1]);
    this.wizardGuy = new WizardGuy(this, this.defensiveInventoryCoords[3][0], this.defensiveInventoryCoords[3][1]);

    this.chromeTurret.setInteractive({draggable: true}); // Chrome Turret is the only available turret at first
    this.onDrag();
    
    for (let i = 1; i < 4; i++) { // Add locks on the other three turrets
      let ironBarLock = this.add.image(this.defensiveInventoryCoords[i][0], this.defensiveInventoryCoords[i][1], "iron_bar");
      this.lockImageList.push(ironBarLock);
    }
  }


  /**
   * handleBoxes, handles setting up the coordinates for the boxes thatr will be drawn on screen to represent
   *              the players inventory space for defensive structures. Calls the makeBoxes method to draw them.
   * 
   * Consumes: Nothing
   * Produces: Nothing
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
   * Consumes: x(number), y(number)
   * Produces: Nothing
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
   *              a percentage of the healthbar to indicate the crystal is losing life. 
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  hurtCrystal(crystal, enemy): void {
    this.health -= 45;
    this.healthBar.setCrop(0, 0, this.health, 97); // Height in pixels of the health bar is 97
    enemy.destroy();
    if (this.health - 45 < 0) {
      this.deathSequence();
    }
  }


  /**
   * deathSequence, plays an animation and sound upon death.
   * 
   * Consumes: Nothing
   * Produces: Nothing
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
   * resetGameProtocol, resets the game if the crystal health goes below 0. 
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  resetGameProtocol(hasLost: boolean): void {
    this.resetGame = true;
    this.levelTwoBackground.setVisible(false);
    this.levelThreeBackground.setVisible(false);
    this.levelOneBackground.setVisible(true);
    if (!hasLost) {
      this.setVisibleHandler();
      this.isWaveDone = false;
      this.isWaveStarted = false;
    }
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
    this.getCurrentSong().pause(); // Stop song from playing in lose scene
    LevelComplete.levelNumber = 1; // Back to level 1
  }


  /**
   * getPossibleHours, generates an array of four number each is randomly chosen between 1 and 12.
   * 
   * Consumes: Nothing
   * Produces: randomHours(number array)
   */
  getPossibleHours(): Array<number> {
    let randomHours: Array<number> = [];
    for (let i = 0; i < 4; i++) {
      randomHours.push(Math.floor(Math.random() * 12) + 1); // Gets random number between 1 and 12
    }
    return randomHours;
  }


  /**
   * announceTime, displays a warning onscreen telling the player which time the enemies will come from.
   * 
   * Consumes: Nothing
   * Produces: Nothing
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
   * getCurrentSong, gets the song currently playing in the game.
   * 
   * Consumes: Nothing
   * Produces: song(Phaser Sound)
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
   *              loud. A config is set up for this. Handles whether the song should be stopped, started, or resumed.
   * 
   *              action -> 1: resume the song
   *              action -> 2: play the song
   *              action -> 3: stop the song
   * 
   * Consumes: action(number)
   * Produces: Nothing
   */
  handleMusic(action: number) {
    let song: Phaser.Sound.BaseSound = this.getCurrentSong();
    let trackConfig = {
      mute: false,
      volume: .3,
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
   * Consumes: Nothing
   * Produces: Nothing 
   */
  makeTimeCrystal(): void {
    this.timeCrystal = this.physics.add.sprite(this.scale.width/2, this.scale.height/2, "time_crystal");
    this.timeCrystal.play("time_crystal_anim");
  }


  /**
   * makeText, makes interactive text onscreen with the specified text and x, y values. The text is destroyed when clicked.
   *           This method appends the text to the tutorialTextArray class attribute.
   * 
   * Consumes: text(String), x(number), y(number)
   * Produces: Nothing
   */
  makeText(text: string, x: number, y: number) {
    let textDisplay = this.add.text(0, 0, text, {fill: "red", font: "bold 24px Serif"});
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
   *              afte the other after being destroyed by the  player by a mouse click
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  runTutorial(messageNumber: number): void {
    let turretText: string = "These are your defenses,\ndrag them to the correct\ntimes up top to\ndefend your crystal!\nCLICK TO DELETE";
    let startWaveText: string = "This is the start wave\nbutton, click it when you\n have set up your defenses\nto start defending."
    let stringList: Array<string> = [turretText, startWaveText];
    if (messageNumber > stringList.length-1)
      return;
    switch(messageNumber) {
      case 0: // Turret Text
        this.makeText(stringList[messageNumber], -350, 200); // Display it above the turrets
        break;
      case 1: // Start Button Text
        this.makeText(stringList[messageNumber], -250, -250); // Display it above the turrets
        break;
    }
  }
  

  /**
   * prepWave, displays the times enemies will spawn from and returns those times as an array to be used 
   *           in other parts of the program. This method also pushes hours from an array of four random hours
   *           into the spawn times array. Right now the most positions enemies can come from is 4, what is the
   *           point of having the spawn anywhere, the player wouldn't learn anything. 
   * 
   * Consumes: Nothing
   * Produces: Nothing
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
   * Consumes: Nothing
   * Produces: Nothing
   */
  async startWave() {
    this.enemySpawnText.destroy();
    this.setInvisibleHandler(); // Clears things off the screen 
    let levelWaves = this.levelInfo["level" + LevelComplete.levelNumber.toString()];
    let numEnemies = levelWaves[this.waveNumber];
    console.log(this.spawnTimes.length);
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
   * endWave, handles incrementing some key values after the wave is over and getting ready for the next wave.
   * 
   * Consumes: Nothing
   * Produces: Nothing
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
   * Consumes: waveIndex(number)
   * Produces: Nothing
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
   * Consumes: Nothing
   * Produces: Nothing
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
   * setVisibleHandler, takes all of the objects that were set to invisible during the wave and sets
   *                    them back to being visible again.
   * 
   * Consumes: Nothing
   * Produces: Nothing
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
   * setInvisibleHandler, takes objects that are only meant to be displayed on the prep phase and makes them invisble for
   *                      the defend phase.
   * 
   * Consumes: Nothing
   * Produces: Nothing
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
   * Consumes: Nothing
   * Produces: Nothing
   */
  makeWaveStartButton(): void {
    this.waveStartButton = this.add.text(0, 200, "Start-Wave", {fill: "red", font: "bold 40px Serif"});
    this.waveStartButton.setBackgroundColor("black");
    this.waveStartButton.setX((this.scale.width/2)-(this.waveStartButton.width/2));
    this.waveStartButton.setInteractive();
    this.waveStartButton.on("pointerdown", () => this.startWave());
  }


  /**
   * makeChestButton, handles displaying the button to switch to the chest scene on the screen when the wave of enemies 
   *                  is over.
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  makeChestButton(): void {
    this.chestButton = this.add.text(0, 0, "Open Chests", {fill: "red", font: "bold 50px Serif"});
    this.chestButton.setBackgroundColor("black");
    this.chestButton.setX((this.scale.width/2) - (this.chestButton.width/2) + 350);
    this.chestButton.setY((this.scale.height/2) - (this.chestButton.height/2) + 400);
    this.chestButton.setInteractive();
    this.chestButton.on("pointerdown", () => {
      let song: Phaser.Sound.BaseSound = this.getCurrentSong();
      song.pause();
      //this.scene.start("ChestScene", {powerup: this.powerUpNum, chest: this.chestNum});
      this.scene.switch("ChestScene");
    });
  }


  /**
   * makePowerUpButton, handles displaying the button to switch to the chest scene on the screen when the wave of enemies 
   *                  is over.
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  makePowerUpButton(): void {
    this.powerUpButton = this.add.text(0, 0, "Power-Ups", {fill: "red", font: "bold 50px Serif"});
    this.powerUpButton.setBackgroundColor("black");
    this.powerUpButton.setX((this.scale.width/2) - (this.powerUpButton.width/2) + 350);
    this.powerUpButton.setY((this.scale.height/2) - (this.chestButton.height/2) + 460);
    this.powerUpButton.setInteractive();
    this.powerUpButton.on("pointerdown", () => {
      //console.log(this.chestNum);
      //this.scene.start("PowerUp", {bombPowerUp: this.powerUpNum, chest: this.chestNum, bombBool: this.bombBool});
      this.scene.switch("PowerUp");
    });
  }

   /**
   * getEnemyCoords, Returns a range of pixels for the enemy to spawn based on the random hour chosen.
   * 
   * Consumes: hour(number)
   * Produces: Coordinates(number array)
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
   * Consumes: Coordinates(number array)
   * Produces: An Object
   */
  spawnEnemy(coords: Array<number>): void {
    let enemyNumber: number = Math.floor(Math.random() * this.numEnemies) + 1; // Gets random number between 1 and numEnemies
    let x: number = coords[0];
    let y: number = coords[1];
    let spawnPosition = coords[2];
    switch(enemyNumber) {
      case 1:
        let armorGoblin: ArmorGoblin = new ArmorGoblin(this, x, y, spawnPosition);
        armorGoblin.setRotation(Phaser.Math.Angle.Between(500, 500, armorGoblin.x, armorGoblin.y)-80.1);
        this.enemies.add(armorGoblin);
        break;
      case 2:
        let speedGoblin: SpeedGoblin = new SpeedGoblin(this, x, y, spawnPosition);
        speedGoblin.setRotation(Phaser.Math.Angle.Between(500, 500, speedGoblin.x, speedGoblin.y)-80.1);
        this.enemies.add(speedGoblin);
        break;
      case 3:
        let timeGoblin: TimeGoblin = new TimeGoblin(this, x, y, spawnPosition);
        timeGoblin.setRotation(Phaser.Math.Angle.Between(500, 500, timeGoblin.x, timeGoblin.y)-80.1);
        this.enemies.add(timeGoblin);
        break;
      case 4: 
        let thePunisher: ThePunisher = new ThePunisher(this, x, y, spawnPosition);
        thePunisher.setRotation(Phaser.Math.Angle.Between(500, 500, thePunisher.x, thePunisher.y)-80.1);
        this.enemies.add(thePunisher);
        break;
    }
  }


  /**
   * getTurretPosition, defines a range in pixels iun which a turret can be placed in order to be in the right time
   *                    (hour) to be able to shoot at incoming enemies. Returns a number indicating the hour the
   *                     player put the turret at.
   * 
   * Consumes: A turret
   * Produces: A number
   */
  getTurretPosition(turret: any): number {
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
   * Consumes: turret, enemy, projectile
   * Produces: Nothing
   */
  moveProjectiles(turret: any, enemy: any, projectile: any): void {
      projectile.setRotation(turret.rotation-80.1); // Don't touch 
      if (turret === this.chromeTurret) {
        this.physics.moveTo(projectile, enemy.x, enemy.y, 400); // Last arg is projectile speed

      }
      if (turret === this.wizardGuy) {
        this.physics.moveTo(projectile, enemy.x, enemy.y, 400); // Last arg is projectile speed

      }
      if (turret === this.barrelTurret) {
        this.physics.moveTo(projectile, enemy.x, enemy.y, 400); // Last arg is projectile speed

      }
      if (turret === this.purpleShip) {
        this.physics.moveTo(projectile, enemy.x, enemy.y, 200); // Last arg is projectile speed

      }
  }


  /**
   * armoredResponseCoalition, takes in a turret and spawns projectiles for the turret based on which clas it belongs to.
   *                           The projectile moves towards an enemy at a speed pre determined by the turret class. 
   * 
   * Consumes: turret 
   * Produces: Nothing
   */
  armoredResponseCoalition(turret: any, enemy: any, time: number): void {
    let projectile: any = null;
    if (turret === this.chromeTurret && (time - this.chromeTurret.bulletDelay > 200)) { // Magic numbers are just delays between each shot
      this.beamSound.play({volume: .4});
      projectile = new Projectile(this, this.chromeTurret, "laser_beam");
      this.chromeTurret.bulletDelay = new Date().getTime(); // Get new current time of day
    }
    if (turret === this.purpleShip && (time - this.purpleShip.bulletDelay > 2000)) {
      this.kamehamehaSound.play({volume: .4});
      projectile = new Projectile(this, this.purpleShip, "kamehameha_beam");
      this.purpleShip.bulletDelay = new Date().getTime(); // Get new current time of day
    }
    if (turret === this.barrelTurret && (time - this.barrelTurret.bulletDelay > 1500)) {
      this.pewPewSound.play();
      projectile = new Projectile(this, this.barrelTurret, "pixel_bullet");
      this.barrelTurret.bulletDelay = new Date().getTime(); // Get new current time of day
    }
    if (turret === this.wizardGuy && (time - this.wizardGuy.bulletDelay > 1000)) {
      this.fireBallSound.play();
      projectile = new Projectile(this, this.wizardGuy, "fire_ball");
      this.wizardGuy.bulletDelay = new Date().getTime(); // Get new current time of day
    }
    if (projectile != null)
      this.moveProjectiles(turret, enemy, projectile);
  }


  /**
   * shootAtEnemy, make defenses fire if an enemy is within their range.
   * 
   * Consumes: turret
   * Produces: Nothing
   */
  shootAtEnemy(turret: any): void {
    const turretPlacement: number = this.getTurretPosition(turret);
    for (let i = 0; i < this.spawnTimes.length; i++) {
      if (this.spawnTimes[i] == turretPlacement) {
        let time: number = new Date().getTime(); // Returns milliseconds
        for (let i = 0; i < this.enemies.getChildren().length; i++) {
          let enemy = this.enemies.getChildren()[i];
          if (enemy.spawnPosition == turretPlacement) { // My attempt at staggering the projectile spawn rate
            this.armoredResponseCoalition(turret, enemy, time);
          }
        }
      }
    }
  }


  /**
   * moveEnemy, updates the x and y position of the enemy based on the enemies speed attribute.
   * 
   * Consumes: enemy(Object)
   * Produces: Nothing
   */
  moveEnemy(enemy): void {
    this.physics.moveTo(enemy, this.scale.width/2, this.scale.height/2); // Add 4rth paramter for speed
  }


  /**
   * sceneSwitchUpdater, Uses global boolean variables to do actions such as playing music one time after switching back from 
   *                     a sub scene to the main scene.
   *       
   * Consumes: Nothing
   * Produces: Nothing
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
      this.handleMusic(1);
    }
    if (VictoryScene.switching) {
      VictoryScene.switching = false;
      this.handleMusic(2);
    }
  }

  
  /**
   * mainUpdater, this method is the most important in update. It handles resetting the game, going to the next level, spawning enemies, 
   *              moving enemies, just about anythin yu could think of.
   * 
   * Consumes: Nothing
   * Produces: Nothing
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
   * update, runs rapidly, updating things in the game.
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  update(): void {
    this.checkPowerUps();
    this.sceneSwitchUpdater(); // Handle sounds and level resets
    this.mainUpdater(); // Level switching among other things
    if (!this.tutorialTextArray.length) {
      this.runTutorial(this.tutorialMessageNumber);
      this.tutorialMessageNumber++;
    }
  }
}
