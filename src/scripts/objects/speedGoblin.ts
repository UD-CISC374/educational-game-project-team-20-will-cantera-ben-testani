import MainScene from "../scenes/mainScene";

export default class SpeedGoblin extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    spawnPosition: number;

    constructor (scene:MainScene, x: number, y: number, spawnPosition: number) { 
        super(scene, x, y, "speed_goblin");
        this.spawnPosition = spawnPosition;
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
    }
}