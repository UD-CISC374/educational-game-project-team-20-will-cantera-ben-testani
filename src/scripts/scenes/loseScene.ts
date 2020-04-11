import { GameObjects } from 'phaser';


export default class LoseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoseScene' });
    }

    create() {
        let text = this.add.text(0, this.scale.height/2, "Game Over", {
            font: "60px Arial",
            bold: true,
            fill:"black"});
            text.setX((this.scale.width/2)-(text.width/2));
    }
}