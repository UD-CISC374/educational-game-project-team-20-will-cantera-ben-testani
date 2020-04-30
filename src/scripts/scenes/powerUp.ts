import { GameObjects } from 'phaser';


export default class PowerUp extends Phaser.Scene {
    helpText: Phaser.GameObjects.Text;
    backButton: Phaser.GameObjects.Text;
    shouldRun: boolean = true;

    constructor() {
        super({ key: 'PowerUp' });
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
        this.helpText = this.add.text(0, 0, "Power Ups", {fill: "red", font: "bold 80px Serif"});
        this.helpText.setBackgroundColor("black");
        this.helpText.setX(this.scale.width/2 - this.helpText.width/2);
        this.helpText.setY(10); // Put the text towards the top 

        this.backButton = this.add.text(0, 0, "Back", {fill: "red", font: "bold 80px Serif"});
        this.backButton.setBackgroundColor("black");
        this.backButton.setX(10);
        this.backButton.setY(10); // Put the text towards the top 
        this.backButton.setInteractive();
        this.backButton.on("pointerdown", () => this.scene.switch("MainScene"));
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

