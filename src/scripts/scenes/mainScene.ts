import ExampleObject from '../objects/exampleObject';
import ArmorGoblin from '../objects/armorGoblin';

export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  private timeCrystal: Phaser.GameObjects.Sprite;
  private readonly num_enemies: number = 4;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    // Analog clock in the background
    this.add.image(this.scale.width/2, this.scale.height/2, "main_clock");

    // Time Goblin enemy
    this.add.image(this.scale.width/2, this.scale.height/2+200, "time_goblin");
    // Armor Goblin enemy
    //this.add.image(this.scale.width/2, this.scale.height/2-200, "armor_goblin");
    // Speed Goblin enemy
    this.add.image(this.scale.width/2-200, this.scale.height/2, "speed_goblin");
    // The Punisher enemy
    this.add.image(this.scale.width/2+200, this.scale.height/2, "the_punisher");

    this.spawnEnemy();


    this.timeCrystal = this.add.sprite(this.scale.width/2, this.scale.height/2, "time_crystal");
    this.timeCrystal.play("time_crystal_anim");
  }

  /**
   * enemyChooser, picks a random number between 1 and the numEnemies attribute
   * 
   * Consumes: Nothing
   * Produces: An Enemy(Enemy)
   */

  /**
   * spawnEnemy, spawns an enemy on an edge of the map based on the time the enemy is supposed to come out from.
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  spawnEnemy(): void {
    let armorGoblin: ArmorGoblin = new ArmorGoblin(this, 500, 500);
  }


  update() {
  }
}
