import { GameObjects } from 'phaser';


export default class ChestHelp extends Phaser.Scene {
    helpText: Phaser.GameObjects.Text;
    shouldRun: boolean = true;

    constructor() {
        super({ key: 'ChestHelp' });
    }

    create() {
        this.drawText();
    }

    /**
     * drawText, draws sometext onscreen to tell the player instructions
     * 
     * Consumes: Nothing
     * Produces: Nothing
     */
    drawText(): void {
        this.helpText = this.add.text(0, 0, "Level " + " \nComplete! ", {fill: "red", font: "bold 80px Serif"});
        this.helpText.setBackgroundColor("black");
        this.helpText.setX(this.scale.width/2 - this.helpText.width/2);
        this.helpText.setY(this.scale.height/2 - 300); // Put the text towards the top 

        // let nextLevelButton = this.add.text(0, 0, "Next Level", {fill: "red", font: "bold 80px Serif"});
        // nextLevelButton.setBackgroundColor("black");
        // nextLevelButton.setX(this.scale.width/2 - nextLevelButton.width/2);
        // nextLevelButton.setY(this.scale.height/2 + 300); // Put the text towards the top 
        // nextLevelButton.setInteractive();
        // nextLevelButton.on("pointerdown", () => this.onClick());
    }

    /**
     * onClick, switches the scene back to the main scene to play the next level.
     * 
     * Consumes: Nothing
     * Produces: Nothing
     */
    onClick(): void {
        this.shouldRun = true;
        this.scene.switch("MainScene");
    }

    update(): void {

    }
}

