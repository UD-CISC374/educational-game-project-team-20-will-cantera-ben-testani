export default class VictoryScene  extends Phaser.Scene {
    private levelCompleteText: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'VictoryScene' });
    }

    create() {
        this.levelCompleteText = this.add.text(0, 0, "Game " + " Complete! ", {fill: "red", font: "bold 80px Serif"});
        this.levelCompleteText.setBackgroundColor("black");
        this.levelCompleteText.setX(this.scale.width/2 - this.levelCompleteText.width/2);
        this.levelCompleteText.setY(this.scale.height/2 - 300); // Put the text towards the top 
    }
}