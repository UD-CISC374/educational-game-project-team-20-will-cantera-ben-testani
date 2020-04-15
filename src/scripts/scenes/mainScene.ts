import ExampleObject from '../objects/exampleObject';
import LaserBeam from '../objects/laserBeam';
import ArmorGoblin from '../objects/armorGoblin';
import TimeGoblin from '../objects/timeGoblin';
import SpeedGoblin from '../objects/speedGoblin';
import ThePunisher from '../objects/thePunisher';
import { GameObjects } from 'phaser';

function sleep (milliseconds) { // Making the program wait for the given time
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
export default class MainScene extends Phaser.Scene {
  // Constants
  private readonly numEnemies: number = 4;
  
  // Phaser objects
  private exampleObject: ExampleObject;
  private timeCrystal: Phaser.GameObjects.Sprite;
  private chestButton: Phaser.GameObjects.Text;
  private mainTrack: Phaser.Sound.BaseSound;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private spacebar: Phaser.Input.Keyboard.Key;
  private enemies: any;
  private waveStartButton: GameObjects.Text;
  private healthBar: GameObjects.Image;
  private enemySpawnText: GameObjects.Text;
  public chromeTurret: Phaser.Physics.Arcade.Sprite;
  public turretProjectiles: GameObjects.Group;
  private beamSound: Phaser.Sound.BaseSound;


  // Variables with set values
  public levelNumber: number = 1;
  private healthPercentage: number = 225; // Width in pixels of the health bar
  private levelInfo: Object = { // Three waves per level, key is the number of enemies per wave
    "level1": {
      "wave1": 1
      //"wave2": 3,
      //"wave3": 5,
      //"wave4": 12
    }, 
    "level2": {
      "wave1": 10,
      "wave2": 18,
      "wave3": 30,
      "wave4": 45
    }
  };
  private waveNumber: string = "wave1"; // Keep track of what wave the player is on 
  private spawnTimes: Array<number> = []; // Will be filled in with random numbers between 1 and 12
  private isWaveStarted: boolean = false; // True if the wave is ongoing, false otherwise
  private boxList: Array<any> = [];
  private defenseInventory: Array<any> = [];
  private defensiveInventoryCoords: Array<any> = [];
  private isWaveDone: boolean = false;


  /**
   * constructor, provides a reference to this scene
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  constructor() {
    super({ key: 'MainScene' });
  }

  
  /**
   * create, most of the code is moved to their own functions, that code is called in create to 
   *         setup this screen.
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  create() {
    // Analog clock in the background
    this.add.image(this.scale.width/2, this.scale.height/2, "main_clock");

    this.beamSound = this.sound.add("laser_sound");

    // Draw the players defensive strucutre inventory on screen
    this.handleBoxes();

    // Add starting defensive structure to inventory 
    this.addDefenses();
    
    // Health bar for the time crystal
    this.healthBar = this.add.image(this.scale.width/2, (this.scale.height/2)-80, "health_bar");

    // Make a physics enabled group for the enemies
    this.enemies = this.physics.add.group();

    // Enable spacebar
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Draws the button onscreen for starting the wave
    this.makeWaveStartButton();

    // Gets the times enemies will spawn, stores them in array
    this.prepWave(); // Takes a varying amount of time
    
    // Plays the background song for this scene
    this.handleMusic();

    // Making some things to be drawn on screen
    this.makeTimeCrystal();
    this.makeChestButton();

    this.turretProjectiles = this.add.group();
    // Adds collision between players shots and powerups, causing them to bounce
    this.physics.add.collider(this.turretProjectiles, this.enemies, function(projectile, enemy) {
      projectile.destroy();
      enemy.destroy();
    });

    // Adding collision for the time crystal and enemies
    this.physics.add.overlap(this.timeCrystal, this.enemies, this.hurtCrystal, this.giveTrue, this);
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
   * makeDefenses, adds sprites to the game for the defensive structures when they are recieved.
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  addDefenses(): void {
    // Starting Defense
    this.chromeTurret = this.physics.add.sprite(this.defensiveInventoryCoords[0][0], this.defensiveInventoryCoords[0][1], "chrome_turret");
    this.chromeTurret.setInteractive({draggable: true});
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) { // Update turrets position on drag
      let spriteRotation: number = Phaser.Math.Angle.Between(500, 500, gameObject.x, gameObject.y); 
      gameObject.setRotation(spriteRotation-80.1);
      gameObject.x = dragX;
      gameObject.y = dragY;      
    });
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
    if (this.healthPercentage - 45 < 0) {
      this.mainTrack.stop();
      this.scene.switch("LoseScene");
    } else {
      this.healthPercentage -= 45;
      this.healthBar.setCrop(0, 0, this.healthPercentage, 97); // Height in pixels of the health bar is 97
      enemy.destroy();
    }
  }


  /**
   * getHour, returns a random number between 1 and 12
   * 
   * Consumes: Nothing
   * Produces: A number
   */
  gethour(): number {
    return Math.floor(Math.random() * 12) + 1; // Gets random number between 1 and 12
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
   * handleMusic, plays the song for this scene. It is meant to be background music sou it should'nt be to
   *              loud. A config is set up for this.
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  handleMusic(): void {
    this.mainTrack = this.sound.add("warsaw_song");
    let mainTrackConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    };
    this.mainTrack.play(mainTrackConfig);
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
   * prepWave, displays the times enemies will spawn from and returns those times as an array to be used 
   *           in other parts of the program.
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  prepWave(): void {
    console.log(this.levelNumber);
    let levelWaves = this.levelInfo["level" + this.levelNumber.toString()];
    let numEnemies = levelWaves[this.waveNumber];
    for (let i = 0; i < parseInt(numEnemies); i++) // Addwing the times that enemies will sapawn from to an array
      this.spawnTimes.push(this.gethour());
    // Display the times enemies will come from on screen
    this.announceTime();
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
    let levelWaves = this.levelInfo["level" + this.levelNumber.toString()];
    let numEnemies = levelWaves[this.waveNumber];
    for (let i = 0; i < parseInt(numEnemies); i++) { // Spawn the enemies, let the fun begin
      await sleep(1000); // Wait between enemy spawns
      this.spawnEnemy(this.getEnemyCoords(this.spawnTimes[i])); // Converts the time to coordinates, spawns a Phaser sprite
      this.isWaveStarted = true; // Defend mode
    }
    this.isWaveDone = true;
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
    if (waveIndex > Object.keys(this.levelInfo["level" + this.levelNumber.toString()]).length) {// Go to level complete scene if the end of the final wave is reached.
      this.waveNumber = "wave1"; // 
      this.enemySpawnText.destroy();
      this.scene.switch("LevelComplete");
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
    this.spawnTimes.splice(0, this.spawnTimes.length); // Reset the spawn times for the next wave
    this.waveNumber = this.waveNumber.substr(0, this.waveNumber.length-1); // Delete last character
    this.waveNumber += waveIndex; // Concatenate
    this.isWaveStarted = false; // Wave over, Prep mode
    this.isWaveDone = false;
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
    this.chestButton.on("pointerdown", () => this.scene.switch("ChestScene"));
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
    let enemyNumber: number = Math.floor(Math.random() * this.numEnemies) +1; // Gets random number between 1 and numEnemies
    let x: number = coords[0];
    let y: number = coords[1];
    let spawnPosition = coords[2];
    switch(enemyNumber) {
      case 1:
        let armorGoblin: ArmorGoblin = new ArmorGoblin(this, x, y, spawnPosition);
        this.enemies.add(armorGoblin);
        break;
      case 2:
        let speedGoblin: SpeedGoblin = new SpeedGoblin(this, x, y, spawnPosition);
        this.enemies.add(speedGoblin);
        break;
      case 3:
        let timeGoblin: TimeGoblin = new TimeGoblin(this, x, y, spawnPosition);
        this.enemies.add(timeGoblin);
        break;
      case 4: 
        let thePunisher: ThePunisher = new ThePunisher(this, x, y, spawnPosition);
        this.enemies.add(thePunisher);
        break;
    }
  }


  /**
   * getTurretPosition, defines a range in pixels iun which a turret can be placed in order to be in the right time
   *                    (hour) to be able to shoot at incoming enemies. Returns a number indicating the hour the
   *                     player put the turret at.
   * 
   * Consumes: Nothing
   * Produces: A number
   */
  getTurretPosition(): number {
    let position: number = 0;
    let rotation: number = this.chromeTurret.rotation*(180/Math.PI); // Convert radians to degrees
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
   * shootAtEnemy, make defenses fire if an enemy is within their range.
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  shootAtEnemy(): void {
    const turretPlacement: number = this.getTurretPosition();
    this.chromeTurret.rotation*(180/Math.PI);
    for (let i = 0; i < this.spawnTimes.length; i++) {
      if (this.spawnTimes[i] == turretPlacement) {
          let milliseconds: number = new Date().getMilliseconds();
          for (let i = 0; i < this.enemies.getChildren().length; i++) {
            let enemy = this.enemies.getChildren()[i];
            if ((enemy.spawnPosition == turretPlacement) && milliseconds % 3 == 0) { // My attempt at staggering the projectile spawn rate
              this.beamSound.play();
              let laserBeam = new LaserBeam(this);
              laserBeam.setRotation(this.chromeTurret.rotation-80.1);
              this.physics.moveTo(laserBeam, enemy.x, enemy.y, 400); // Last arg is projectile speed
          }
        }
        break;
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
    this.physics.moveTo(enemy, this.scale.width/2, this.scale.height/2);
  }


  update(): void {
    let length = this.enemies.getChildren().length;
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      console.log("LENGTH: " + length.toString());
    }
    if (this.isWaveStarted) {
      let currentHour: number = this.gethour();
      for(let i = 0; i < length; i++)
        this.moveEnemy(this.enemies.getChildren()[i]);
      if (length == 0 && this.isWaveDone) { // If all the enemies are gone, go back to prep mode
        this.endWave();
        this.prepWave();
      }
      this.shootAtEnemy();
    }
  }
}
