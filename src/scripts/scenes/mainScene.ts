import ExampleObject from '../objects/exampleObject';

export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.exampleObject = new ExampleObject(this, 0, 0);

    const chestButton = this.add.text(0, 0, "Chest", {fill: "red", font: "bold 80px Serif"});
    chestButton.setX(this.scale.width/2 - chestButton.width/2);
    chestButton.setY(this.scale.height/2 + 300);
    chestButton.setInteractive();
    chestButton.on("pointerdown", () => this.onClick());
  }

  onClick(): void {
    this.scene.switch("ChestScene"); // Move onto main scene for the game
  }

  update() {
  }
}
