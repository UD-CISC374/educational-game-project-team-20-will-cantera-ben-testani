import ExampleObject from '../objects/exampleObject';
import { GameObjects } from 'phaser';


export default class MainScene extends Phaser.Scene {
  // Constants
  private readonly numEnemies: number = 4;
  private readonly modeList: Array<String> = ["defend", "prep"];

  private exampleObject: ExampleObject;
  private timeCrystal: Phaser.GameObjects.Sprite;
  private chestButton: Phaser.GameObjects.Text;
  private mainTrack: Phaser.Sound.BaseSound;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private spacebar: Phaser.Input.Keyboard.Key;
  private enemies: Phaser.Physics.Arcade.Group;
  private waveStartButton: GameObjects.Text;
  private healthBar: GameObjects.Image;

  private mode: String = this.modeList[1];
  private healthPercentage: number = 225; // Width in pixels of the health bar


  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    console.log("hello");
    // Analog clock in the background
    this.add.image(this.scale.width/2, this.scale.height/2, "main_clock");

    // Health bar for the time crystal
    this.healthBar = this.add.image(this.scale.width/2, (this.scale.height/2)-80, "health_bar");

    // Make a physics enabled group for the enemies
    this.enemies = this.physics.add.group();

    this.announceTime(8);


    // Enable spacebar
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Draws the button onscreen for starting the wave
    this.makeWaveStartButton();
    
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
    let text = this.add.text(0, 10, "Enemies coming from: " + time.toString(10) + ":00", {
      font: "60px Arial",
      bold: true,
      fill:"black"});
      text.setX((this.scale.width/2)-(text.width/2));
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
   * onClick, for switching scenes when a button is pressed.
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  onClick(): void {
    this.scene.switch("ChestScene"); // Move onto main scene for the game
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

  endWave(): void {
    /*
    for(let i = 0; i < this.enemies.getChildren().length; i++) {
      if (this.enemies.getChildren()[i].)
    }
    */
  }


  /**
   * startWave, starts the wave of enemies. Spawns in enemies based on the time at which they are supposed to spawn.
   * 
   * Cpnsumes: Nothing
   * Produces: Nothing
   */
  startWave(): void {
    this.waveStartButton.setVisible(false);
    this.mode = this.modeList[0]; // Defend mode
  }


  /**
   * makeWaveStartButton, makes a button which when pressed, brings forth the wave of enemies.
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  makeWaveStartButton(): void {
    this.waveStartButton = this.add.text(0, 100, "Start-Wave", {fill: "red", font: "bold 40px Serif"});
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
    this.chestButton = this.add.text(0, 0, "Chest", {fill: "red", font: "bold 80px Serif"});
    this.chestButton.setX(this.scale.width/2 - this.chestButton.width/2);
    this.chestButton.setY(this.scale.height/2 + 300);
    this.chestButton.setInteractive();
    this.chestButton.on("pointerdown", () => this.onClick());
  }


   /**
   * getEnemyCoords, Returns a range of pixels for the enemy to spawn based on the random hour chosen.
   * 
   * Consumes: hour(number)
   * Produces: Coordinates(number array)
   */
  getEnemyCoords(hour: number): Array<number> {
    let randomHour: number = Math.floor(Math.random() * 12) + 1; // Gets random number between 1 and 12
    let coords: Array<number> = [0, 0];
    let offsetX: number = 300;
    let offsetY: number = 300;
    switch(randomHour) {
      case 1:
        coords = [(this.scale.width/2)+offsetX, 0];
        break;
      case 2:
        coords = [this.scale.width, (this.scale.height/2)-offsetY];
        break;
      case 3:
        coords = [this.scale.width, this.scale.height/2];
        break;
      case 4:
        coords = [this.scale.width, (this.scale.height/2)+offsetY];
        break;
      case 5:
        coords = [(this.scale.width/2)+offsetX, this.scale.height];
        break;
      case 6:
        coords = [this.scale.width/2, this.scale.height];
        break;
      case 7:
        coords = [(this.scale.width/2)-offsetX, this.scale.height];
        break;
      case 8:
        coords = [0, (this.scale.height/2)+offsetY];
        break;
      case 9:
        coords = [0, this.scale.height/2];
        break;
      case 10:
        coords = [0, (this.scale.height/2)-offsetY];
        break;
      case 11:
        coords = [(this.scale.width/2)-offsetX, 0];
        break;
      case 12:
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
    let currentHour: number = this.gethour();
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.spawnEnemy(this.getEnemyCoords(currentHour));
    }
    for(let i = 0; i < this.enemies.getChildren().length; i++)
      this.moveEnemy(this.enemies.getChildren()[i]);
  }
}
