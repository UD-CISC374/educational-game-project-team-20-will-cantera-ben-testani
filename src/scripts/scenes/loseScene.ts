import { GameObjects } from 'phaser';


export default class LoseScene extends Phaser.Scene {
    private mainTrack: Phaser.Sound.BaseSound;

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
}