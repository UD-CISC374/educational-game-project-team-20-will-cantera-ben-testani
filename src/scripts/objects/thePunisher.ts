export default class ThePunisher extends Phaser.GameObjects.Sprite {
    private speed: number;
    body: Phaser.Physics.Arcade.Body;

    constructor(scene, x: number, y: number) {
        super(scene, x, y, "the_punisher");
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
    }
}