import MainScene from "../scenes/mainScene";

export default class ThePunisher extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    spawnPosition: number;
    moveSpeed: number = 75;

    constructor (scene:MainScene, x: number, y: number, spawnPosition: number) { 
        super(scene, x, y, "the_punisher");
        this.spawnPosition = spawnPosition;
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
    }
}