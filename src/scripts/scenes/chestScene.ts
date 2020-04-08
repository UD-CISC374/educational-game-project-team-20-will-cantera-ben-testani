import ExampleObject from '../objects/exampleObject';

export default class ChestScene extends Phaser.Scene {
  private exampleObject: ExampleObject;

  constructor() {
    super({ key: 'ChestScene' });
  }

  create() {
    this.exampleObject = new ExampleObject(this, 0, 0);
    this.add.image(this.scale.width/2, this.scale.height/2, "closeChest");
    this.add.image(this.scale.width/2, this.scale.height/2, "clock");
    this.add.image(this.scale.width/4 + this.scale.width/2, this.scale.height/4 + this.scale.height/2, "hoursDot");
    this.add.image(this.scale.width/4, this.scale.height/4 + this.scale.height/2, "minutesDot");
  }

  update() {
  }
}
