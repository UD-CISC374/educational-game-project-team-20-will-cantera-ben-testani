import LevelComplete from "./levelComplete";

export default class VictoryScene  extends Phaser.Scene {
    private levelCompleteText: Phaser.GameObjects.Text;
    private shouldRun: boolean = true;
    private victoryMusic: Phaser.Sound.BaseSound;
    private background: Phaser.GameObjects.TileSprite;
    public static switching: boolean = false;

    constructor() {
        super({ key: 'VictoryScene' });
    }

    create() {
        this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "confetti_background");
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0);

        this.victoryMusic = this.sound.add("win_song");
        this.levelCompleteText = this.add.text(0, 0, "Game " + " Complete! ", {fill: "red", font: "bold 80px Serif"});
        this.levelCompleteText.setBackgroundColor("black");
        this.levelCompleteText.setX(this.scale.width/2 - this.levelCompleteText.width/2);
        this.levelCompleteText.setY(this.scale.height/2 - 300); // Put the text towards the top 

        // Button for restartng the game if you want to play again
        let resetButton = this.add.text(0, 0, "Play Again?", {fill: "red", font: "bold 80px Serif"});
        resetButton.setBackgroundColor("black");
        resetButton.setX(this.scale.width/2 - resetButton.width/2);
        resetButton.setY(this.scale.height/2 + 300); // Put the text towards the top 
        resetButton.setInteractive();
        resetButton.on("pointerdown", () => this.onClick());

    }


     /**
     * onClick, switches back to the main scene, but restarts it to reset the game state.
     * 
     * Consumes: Nothing
     * Produces: Nothing
     */
    onClick(): void {
        this.victoryMusic.pause();
        this.shouldRun = true;
        VictoryScene.switching = true;
        this.scene.switch("MainScene"); // The start method resets the main scene as if you were just starting the game for the first time.
    }


    update() {
        this.background.tilePositionY -= 2;
        if (this.shouldRun) {
            this.shouldRun = false;
            let victoryMusicConfig = {
                mute: false,
                volume: 1,
                rate: 1,
                detune: 0,
                seek: 0,
                loop: true,
                delay: 0
              };
            this.victoryMusic.play(victoryMusicConfig);
        }
    }
}