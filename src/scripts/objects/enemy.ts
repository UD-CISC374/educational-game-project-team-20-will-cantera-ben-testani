import MainScene from "../scenes/mainScene";

export default class Enemy extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    spawnPosition: number;
    moveSpeed: number;

    constructor (scene:MainScene, x: number, y: number, spawnPosition: number, moveSpeed: number, name: string) {
        super(scene, x, y, name);
        this.spawnPosition = spawnPosition;
        scene.add.existing(this);
        this.moveSpeed = moveSpeed;
        scene.physics.world.enableBody(this);
    }
}