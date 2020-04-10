import ExampleObject from '../objects/exampleObject';
import ArmorGoblin from '../objects/armorGoblin';
import TimeGoblin from '../objects/timeGoblin';
import SpeedGoblin from '../objects/speedGoblin';
import ThePunisher from '../objects/thePunisher';


export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  private timeCrystal: Phaser.GameObjects.Sprite;
  private readonly numEnemies: number = 4;
  private chestButton: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    // Analog clock in the background
    this.add.image(this.scale.width/2, this.scale.height/2, "main_clock");


    for (let i = 0; i < 8; i++) { // Spawns 8 enemies 
      let randomHour: Array<number> = this.pickRandomTime();
      this.spawnEnemy(randomHour);
    }

    this.makeTimeCrystal();
    this.makeChestButton();
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
    this.timeCrystal = this.add.sprite(this.scale.width/2, this.scale.height/2, "time_crystal");
    this.timeCrystal.play("time_crystal_anim");
    this.exampleObject = new ExampleObject(this, 0, 0);
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
   * pickRandomTime, gets a random time for the enemies to come from. Returns a range of pixels for the enemy to spawn
   *                 based on the random hour chosen.
   * 
   * Consumes: Nothing
   * Produces: Coordinates(number array)
   */
  pickRandomTime(): Array<number> {
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
   * Produces: Nothing
   */
  spawnEnemy(coords: Array<number>): void {
    let enemyNumber: number = Math.floor(Math.random() * this.numEnemies) +1; // Gets random number between 1 and numEnemies
    let x: number = coords[0];
    let y: number = coords[1];
    switch(enemyNumber) {
      case 1:
        let armorGoblin: ArmorGoblin = new ArmorGoblin(this, x, y);
        break;
      case 2:
        let speedGoblin: SpeedGoblin = new SpeedGoblin(this, x, y);
        break;
      case 3:
        let timeGoblin: TimeGoblin = new TimeGoblin(this, x, y);
        break;
      case 4: 
        let thePunisher: ThePunisher = new ThePunisher(this, x, y);
        break;
    }
  }


  update() {
  }
}
