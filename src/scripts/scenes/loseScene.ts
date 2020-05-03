import { GameObjects } from 'phaser';


export default class LoseScene extends Phaser.Scene {
    private mainTrack: Phaser.Sound.BaseSound;
    private shouldRun: boolean = true;
    public static switching: boolean = false;

    constructor() {
        super({ key: 'LoseScene' });
    }

    create() {
        let text = this.add.text(0, 0, "Game Over", {
            font: "60px Arial",
            bold: true,
            fill:"black"});
            text.setX((this.scale.width/2)-(text.width/2));
            text.setY((this.scale.height/2)-(text.height/2));

        // Button for restartng the game after a loss
        let resetButton = this.add.text(0, 0, "Try Again?", {fill: "red", font: "bold 80px Serif"});
        resetButton.setBackgroundColor("black");
        resetButton.setX(this.scale.width/2 - resetButton.width/2);
        resetButton.setY(this.scale.height/2 + 300); // Put the text towards the top 
        resetButton.setInteractive();
        resetButton.on("pointerdown", () => this.onClick());

        this.mainTrack = this.sound.add("lose_song");
        let mainTrackConfig = {
            mute: false,
            volume: 2,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        };
        this.mainTrack.play(mainTrackConfig);
    }


    /**
     * onClick, switches back to the main scene, but restarts it to reset the game state.
     * 
     * Consumes: Nothing
     * Produces: Nothing
     */
    onClick(): void {
        this.mainTrack.pause();
        this.shouldRun = true;
        LoseScene.switching = true;
        this.scene.switch("MainScene"); // The start method resets the main scene as if you were just starting the game for the first time.
    }

    update() {
        if (this.shouldRun) {
            this.shouldRun = false;
            this.mainTrack.resume();
        }
    }
}