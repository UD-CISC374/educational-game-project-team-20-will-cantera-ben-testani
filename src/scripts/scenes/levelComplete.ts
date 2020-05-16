export default class LevelComplete extends Phaser.Scene {
    public static levelNumber: number = 1; // Global
    public static switching: boolean = false;
    private levelCount: number = LevelComplete.levelNumber;

    private levelOneVictoryMusic: Phaser.Sound.BaseSound;
    private levelTwoVictoryMusic: Phaser.Sound.BaseSound;
    private levelOneCompleteImage: Phaser.GameObjects.Image;
    private levelTwoCompleteImage: Phaser.GameObjects.Image;
    levelCompleteText: Phaser.GameObjects.Text;
    shouldRun: boolean = true;

    constructor() {
        super({ key: 'LevelComplete' });
    }

    create() {
        this.levelOneVictoryMusic = this.sound.add("level_one_victory");
        this.levelTwoVictoryMusic = this.sound.add("level_two_victory");
    }

    /**
     * handleMusic, plays the victory song based on the level that was just passed.
     * 
     * Consumes: Nothing
     * Produces: Nothing
     */
    handleMusic(): void {
        let victoryMusicConfig = {
            mute: false,
            volume: .6,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false, // Just play it once
            delay: 0
        };
        switch(this.levelCount) {
            case 1:
                this.levelOneVictoryMusic.play(victoryMusicConfig);
                break;
            case 2:
                this.levelTwoVictoryMusic.play(victoryMusicConfig);
        }
    }

    /**
     * drawText, draws sometext onscreen to indicate the level has been won
     * 
     * Consumes: Nothing
     * Produces: Nothing
     */
    drawText(): void {
        this.levelCompleteText = this.add.text(0, 0, "Level " + this.levelCount.toString() + " Complete! ", {fill: "red", font: "bold 80px Serif"});
        this.levelCompleteText.setBackgroundColor("black");
        this.levelCompleteText.setX(this.scale.width/2 - this.levelCompleteText.width/2);
        this.levelCompleteText.setY(this.scale.height/2 - 300); // Put the text towards the top 

        let nextLevelButton = this.add.text(0, 0, "Next Level", {fill: "red", font: "bold 80px Serif"});
        nextLevelButton.setBackgroundColor("black");
        nextLevelButton.setX(this.scale.width/2 - nextLevelButton.width/2);
        nextLevelButton.setY(this.scale.height/2 + 300); // Put the text towards the top 
        nextLevelButton.setInteractive();
        nextLevelButton.on("pointerdown", () => this.onClick());
    }


    drawBackground(): void {
        switch(this.levelCount) {
            case 1:
                this.levelOneCompleteImage = this.add.image(this.scale.width/2, this.scale.height/2, "level_one_complete_image");
                break;
            case 2:
                this.levelOneCompleteImage.destroy();
                this.levelTwoCompleteImage = this.add.image(this.scale.width/2, this.scale.height/2, "level_two_complete_image");
        }
    }


    /**
     * onClick, switches the scene back to the main scene to play the next level.
     * 
     * Consumes: Nothing
     * Produces: Nothing
     */
    onClick(): void {
        switch(this.levelCount) {
            case 1:
                this.levelOneVictoryMusic.stop()
                break;
            case 2:
                this.levelTwoVictoryMusic.stop();
        }
        this.shouldRun = true;
        LevelComplete.switching = true;
        LevelComplete.levelNumber++; // This should be the only spot this variable is ever incremented
        this.scene.switch("MainScene");
    }

    update(): void {
        if (this.shouldRun) {
            this.shouldRun = false;
            this.levelCount = LevelComplete.levelNumber;
            this.drawBackground();
            this.drawText();
            this.handleMusic();
        }
    }
}

