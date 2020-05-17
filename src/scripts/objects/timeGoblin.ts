import MainScene from "../scenes/mainScene";

export default class TimeGoblin extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    spawnPosition: number;
    moveSpeed: number = 40;

    constructor (scene:MainScene, x: number, y: number, spawnPosition: number) {
        super(scene, x, y, "time_goblin");
        this.spawnPosition = spawnPosition;
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
    }
}