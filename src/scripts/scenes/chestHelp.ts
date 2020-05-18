import { GameObjects } from 'phaser';


export default class ChestHelp extends Phaser.Scene {
    helpText: Phaser.GameObjects.Text;
    backButton: Phaser.GameObjects.Text;
    exampleButton: Phaser.GameObjects.Text;
    shouldRun: boolean = true;
    closedChest: Phaser.GameObjects.Image;
    clock: Phaser.GameObjects.Image;
    hourDot: Phaser.GameObjects.Image;
    minDot: Phaser.GameObjects.Image;
    mainLabel: Phaser.GameObjects.BitmapText;
    timeLabel: Phaser.GameObjects.BitmapText;

    constructor() {
        super({ key: 'ChestHelp' });
    }

    create(): void {
        this.drawText();
        this.makeExample();
        this.hideExample();
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
        this.helpText.setY(this.scale.height/2 - 300); // Put the text towards the bottom 

        this.backButton = this.add.text(0, 0, "Back", {fill: "red", font: "bold 80px Serif"});
        this.backButton.setBackgroundColor("black");
        this.backButton.setX(this.scale.width/2 - this.backButton.width/2);
        this.backButton.setY(this.scale.height/2 + 300); // Put the text towards the bottom 
        this.backButton.setInteractive();
        this.backButton.on("pointerdown", () => {
            this.scene.switch("ChestScene");
            this.resetScene();
        });

        this.exampleButton = this.add.text(0, 0, "Example", {fill: "green", font: "bold 80px Serif"});
        this.exampleButton.setBackgroundColor("black");
        this.exampleButton.setX(this.scale.width/2 - this.exampleButton.width/2);
        this.exampleButton.setY(this.scale.height/2 + 200); 
        this.exampleButton.setInteractive();
        this.exampleButton.on("pointerdown", () =>{
            this.clearScreen();
            this.showExample();
            this.backButton.setVisible(true);
        });

    }

    /**
   * resetScene, resets the scene
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
    resetScene(): void{
        this.hideExample();
        this.showButtons();
        this.showText();
    }

    /**
   * makeExample, adds all the images for the example to the screen
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
    makeExample(): void{
        this.closedChest=this.add.image(this.scale.width/2, this.scale.height/2, "closeChest");
        this.clock=this.add.image(this.scale.width/2, this.scale.height/2, "clock");
        this.mainLabel=this.add.bitmapText(140, 150, "pixelFont", "TIME TO DISPLAY ON CLOCK:", 75);
        this.timeLabel=this.add.bitmapText(this.scale.width/2 - 50, 200, "pixelFont", "4:30", 75);
        this.backButton = this.add.text(0, 0, "Back", {fill: "red", font: "bold 80px Serif"});
        this.hourDot = this.add.image(602,602,"hoursDot");
        this.minDot = this.add.image(500,644,"minutesDot");
        this.backButton.setBackgroundColor("black");
        this.backButton.setInteractive();
        this.backButton.on("pointerdown", () => {
            this.scene.switch("ChestScene");
            this.resetScene();
        });
    }

    /**
   * clearScreen, calls functions to hide the buttons and text on screen
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
    clearScreen(): void{
        this.hideButtons();
        this.hideText();
    }

    /**
   * showExample, sets the visibility for all the example images to true
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
    showExample(): void{
        this.closedChest.setVisible(true);
        this.clock.setVisible(true);
        this.mainLabel.setVisible(true);
        this.timeLabel.setVisible(true);
        this.minDot.setVisible(true);
        this.hourDot.setVisible(true);
    }

    /**
   * hideExample, sets the visibility for all the example images to false
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
    hideExample(): void{
        this.closedChest.setVisible(false);
        this.clock.setVisible(false);
        this.mainLabel.setVisible(false);
        this.timeLabel.setVisible(false);
        this.minDot.setVisible(false);
        this.hourDot.setVisible(false);
    }

    /**
   * hideButtons, sets the visibility for all the example button to false
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
    hideButtons(): void{
        this.exampleButton.setVisible(false);
        //this.backButton.setVisible(false);
    }

    /**
   * hideText, sets the visibility for all the example text to false
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
    hideText(): void{
        this.helpText.setVisible(false);
    }

    /**
   * showButtons, sets the visibility for all the buttons to true
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
    showButtons(): void{
        this.exampleButton.setVisible(true);
        this.backButton.setVisible(true);
    }

    /**
   * showText, sets the visibility for all the text to true
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
    showText(): void{
        this.helpText.setVisible(true);
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

