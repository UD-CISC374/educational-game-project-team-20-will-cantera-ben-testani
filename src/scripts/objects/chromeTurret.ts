import MainScene from "../scenes/mainScene";

export default class ChromeTurret extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    spawnPosition: number;
    isUnlocked: boolean = true;

    constructor (scene:MainScene, x: number, y: number) { 
        super(scene, x, y, "chrome_turret");
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
    }
}