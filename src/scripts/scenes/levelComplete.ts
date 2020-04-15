import MainScene from "./mainScene";

export default class LevelComplete extends Phaser.Scene {
    private levelCount: number = 0;

    constructor() {
        super({ key: 'LevelComplete' });
    }

    create() {
        this.levelCount++; // Display what level the user just completed

        let levelCompleteText = this.add.text(0, 0, "Level " +  this.levelCount.toString() + " Complete! ", {fill: "red", font: "bold 80px Serif"});
        levelCompleteText.setBackgroundColor("black");
        levelCompleteText.setX(this.scale.width/2 - levelCompleteText.width/2);
        levelCompleteText.setY(this.scale.height/2 - 300); // Put the text towards the top 

        let nextLevelButton = this.add.text(0, 0, "Next Level", {fill: "red", font: "bold 80px Serif"});
        nextLevelButton.setBackgroundColor("black");
        nextLevelButton.setX(this.scale.width/2 - levelCompleteText.width/2);
        nextLevelButton.setY(this.scale.height/2 + 300); // Put the text towards the top 
        nextLevelButton.setInteractive();
        nextLevelButton.on("pointerdown", () => this.onClick());
    }


    /**
     * onClick, swithces the scene back to the main scene to play the next level.
     * 
     * Consumes: Nothing
     * Produces: Nothing
     */
    onClick(): void {
        this.scene.switch("MainScene");
    } 
}