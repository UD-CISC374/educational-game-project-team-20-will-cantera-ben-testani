import { GameObjects } from 'phaser';


export default class ChestHelp extends Phaser.Scene {
    helpText: Phaser.GameObjects.Text;
    backButton: Phaser.GameObjects.Text;
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
        this.helpText = this.add.text(0, 0, "Drag and drop the hour \nand minute dots to the \nlocation on the clock that \ndisplays the correct time \nand then press submit :)", {fill: "red", font: "bold 80px Serif"});
        this.helpText.setBackgroundColor("black");
        this.helpText.setX(this.scale.width/2 - this.helpText.width/2);
        this.helpText.setY(this.scale.height/2 - 300); // Put the text towards the top 

        this.backButton = this.add.text(0, 0, "Back", {fill: "red", font: "bold 80px Serif"});
        this.backButton.setBackgroundColor("black");
        this.backButton.setX(this.scale.width/2 - this.backButton.width/2);
        this.backButton.setY(this.scale.height/2 + 300); // Put the text towards the top 
        this.backButton.setInteractive();
        this.backButton.on("pointerdown", () => this.scene.switch("ChestScene"));
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

