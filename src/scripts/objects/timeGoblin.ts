export default class TimeGoblin extends Phaser.GameObjects.Sprite {
    private speed: number;
    body: Phaser.Physics.Arcade.Body;

    constructor(scene, x: number, y: number) {
        super(scene, x, y, "time_goblin");
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
    }
}