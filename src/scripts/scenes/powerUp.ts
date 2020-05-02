import { GameObjects } from 'phaser';


export default class PowerUp extends Phaser.Scene {
    helpText: Phaser.GameObjects.Text;
    backButton: Phaser.GameObjects.Text;
    selectTect: Phaser.GameObjects.Text;
    shouldRun: boolean = true;
    bombPowerup: Phaser.GameObjects.Image;
    bombPowerUpLabel: Phaser.GameObjects.BitmapText;
    bombPowerUpNum: number;
    bombPowerUpDesc: Phaser.GameObjects.BitmapText;

    constructor() {
        super({ key: 'PowerUp' });
    }

    init(data){
        this.bombPowerUpNum = data.bombPowerUp;
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
        this.bombPowerup=this.add.image(this.scale.width/5, this.scale.height/4, "bombPowerup");
        this.bombPowerup.setScale(.3);
        this.bombPowerUpLabel = this.add.bitmapText(25, this.scale.height/5, "pixelFont", "x" + this.bombPowerUpNum, 120);
        let bombtext = "Bomb - Blows up destroying \nnearby enemies";
        this.bombPowerUpDesc = this.add.bitmapText(this.scale.width/3.3, this.scale.height/5, "pixelFont", bombtext, 70);

        globalThis.camera = this.cameras.add(0, 0, this.scale.width, this.scale.height);
        globalThis.camera.setBackgroundColor('rgba(255, 0, 0, 0.5)');

        this.helpText = this.add.text(0, 0, "Power Ups", {fill: "red", font: "bold 80px Serif"});
        this.helpText.setBackgroundColor("black");
        this.helpText.setX(this.scale.width/2 - this.helpText.width/2);
        this.helpText.setY(10); // Put the text towards the top 

        this.selectTect = this.add.text(0,0, "Select an available\n  power up to use", {fill: "red", font: "bold 80px Serif"});
        this.selectTect.setBackgroundColor("black");
        this.selectTect.setX(this.scale.width/2 - this.selectTect.width/2);
        this.selectTect.setY(this.scale.height-this.scale.height/6);

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

