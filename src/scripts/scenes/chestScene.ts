import ExampleObject from '../objects/exampleObject';

export default class ChestScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  closedChest: Phaser.GameObjects.Image;
  clock: Phaser.GameObjects.Image;
  hoursDot: Phaser.GameObjects.Image;
  minuetsDot: Phaser.GameObjects.Image;


  constructor() {
    super({ key: 'ChestScene' });
  }

  create() {
    this.exampleObject = new ExampleObject(this, 0, 0);
    this.closedChest=this.add.image(this.scale.width/2, this.scale.height/2, "closeChest");
    this.clock=this.add.image(this.scale.width/2, this.scale.height/2, "clock");
    this.hoursDot=this.add.image(this.scale.width/4 + this.scale.width/2, this.scale.height/4 + this.scale.height/2, "hoursDot");
    this.minuetsDot=this.add.image(this.scale.width/4, this.scale.height/4 + this.scale.height/2, "minutesDot");

    this.hoursDot.setInteractive({draggable:true});
    this.minuetsDot.setInteractive({draggable:true});
    // http://labs.phaser.io/index.html?dir=input/dragging/&q=
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

      gameObject.x = dragX;
      gameObject.y = dragY;

  });
  }

  update() {
  }
}
