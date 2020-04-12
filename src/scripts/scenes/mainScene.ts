import ExampleObject from '../objects/exampleObject';
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
  private enemies: Phaser.Physics.Arcade.Group;
  private waveStartButton: GameObjects.Text;
  private healthBar: GameObjects.Image;
  private enemySpawnText: GameObjects.Text;

  // Variables with set values
  private healthPercentage: number = 225; // Width in pixels of the health bar
  private waveInfo: Object = { // Three waves per level, key is the number of enemies per wave
    "wave1": 1,
    "wave2": 3,
    "wave3": 5
  };
  private waveNumber: string = "wave1"; // Keep track of what wave the player is on 
  private spawnTimes: Array<number> = []; // Will be filled in with random numbers between 1 and 12
  private isWaveStarted: boolean = false; // True if the wave is ongoing, false otherwise
  private isTimesDone: boolean = false; // True if the spawn times aare done displaying, false otherwise


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
    this.isTimesDone = false; // Don't touch it works
    
    // Plays the background song for this scene
    this.handleMusic();

    // Making some things to be drawn on screen
    this.makeTimeCrystal();
    this.makeChestButton();

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
  announceTime(time: number): void {
    this.enemySpawnText = this.add.text(0, 10, "Enemies coming from: " + time.toString(10) + ":00", {
      font: "60px Arial",
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
      volume: 2,
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
  async prepWave() {
    let numEnemies = this.waveInfo[this.waveNumber];
    for (let i = 0; i < parseInt(numEnemies); i++) // Addwing the times that enemies will sapawn from to an array
      this.spawnTimes.push(this.gethour());
    for (let i = 0; i < parseInt(numEnemies); i++) {  // Display the times enemies will come from on screen
      this.announceTime(this.spawnTimes[i]);
      await sleep(3000); // In milliseconds
      this.enemySpawnText.destroy();
    } 
    this.isTimesDone = true;
  }


  /**
   * startWave, starts the wave of enemies. Spawns in enemies based on the time at which they are supposed to spawn.
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  async startWave() {
    if (this.isTimesDone) { // Only start the wave if all of the time have been displayed to the player
      console.log(this.spawnTimes);
      this.waveStartButton.setVisible(false);
      this.chestButton.setVisible(false);
      let numEnemies = this.waveInfo[this.waveNumber];
      for (let i = 0; i < parseInt(numEnemies); i++) { // Spawn the enemies, let the fun begin
        await sleep(3000); // Wait between enemy spawns
        this.spawnEnemy(this.getEnemyCoords(this.spawnTimes[i])); // Converts the time to coordinates, spawns a Phaser sprite
        this.isWaveStarted = true; // Defend mode
      }
    }
  }


  /**
   * endWave, handles incrementing some key values after the wave is over and getting ready for the next wave.
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  endWave(): void {
    this.waveStartButton.setVisible(true); // Bring back the start wave button
    this.chestButton.setVisible(true); // Bring back the chest button after wave
    this.spawnTimes = []; // Reset the spawn times for the next wave
    let waveIndex: number = parseInt(this.waveNumber[this.waveNumber.length-1]); // Get last character as number
    waveIndex++; // Go to next wave
    this.waveNumber = this.waveNumber.substr(0, this.waveNumber.length-1); // Delete last character
    this.waveNumber += waveIndex; // Concatenate
    this.isWaveStarted = false; // Wave over, Prep mode
    this.isTimesDone = false;
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
    let coords: Array<number> = [0, 0];
    let offsetX: number = 300;
    let offsetY: number = 300;
    switch(hour) {
      case 1:
        console.log("1:00");
        coords = [(this.scale.width/2)+offsetX, 0];
        break;
      case 2:
        console.log("2:00");
        coords = [this.scale.width, (this.scale.height/2)-offsetY];
        break;
      case 3:
        console.log("3:00");
        coords = [this.scale.width, this.scale.height/2];
        break;
      case 4:
        console.log("4:00");
        coords = [this.scale.width, (this.scale.height/2)+offsetY];
        break;
      case 5:
        console.log("5:00");
        coords = [(this.scale.width/2)+offsetX, this.scale.height];
        break;
      case 6:
        console.log("6:00");
        coords = [this.scale.width/2, this.scale.height];
        break;
      case 7:
        console.log("7:00");
        coords = [(this.scale.width/2)-offsetX, this.scale.height];
        break;
      case 8:
        console.log("8:00");
        coords = [0, (this.scale.height/2)+offsetY];
        break;
      case 9:
        console.log("9:00");
        coords = [0, this.scale.height/2];
        break;
      case 10:
        console.log("10:00");
        coords = [0, (this.scale.height/2)-offsetY];
        break;
      case 11:
        console.log("11:00");
        coords = [(this.scale.width/2)-offsetX, 0];
        break;
      case 12:
        console.log("12:00");
        coords = [this.scale.width/2, 0];
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
    switch(enemyNumber) {
      case 1:
        let armorGoblin = this.add.sprite(x, y, "armor_goblin");
        this.enemies.add(armorGoblin);
        break;
      case 2:
        let speedGoblin = this.add.sprite(x, y, "speed_goblin");
        this.enemies.add(speedGoblin);
        break;
      case 3:
        let timeGoblin = this.add.sprite(x, y, "time_goblin");
        this.enemies.add(timeGoblin);
        break;
      case 4: 
        let thePunisher = this.add.sprite(x, y, "the_punisher");
        this.enemies.add(thePunisher);
        break;
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
    if (this.isWaveStarted) {
      let currentHour: number = this.gethour();
      if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
        this.spawnEnemy(this.getEnemyCoords(currentHour));
      }
      for(let i = 0; i < length; i++)
        this.moveEnemy(this.enemies.getChildren()[i]);
      if (!length) { // If all the enemies are gone, go back to prep mode
        this.endWave();
        this.prepWave();
      }
    }
  }
}
