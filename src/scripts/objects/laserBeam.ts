import MainScene from "../scenes/mainScene";

export default class Beam extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;

    constructor (scene:MainScene) {
        let x = scene.chromeTurret.x;
        let y = scene.chromeTurret.y; 
        super(scene, x, y, "laser_beam");
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        this.body.rotation = scene.chromeTurret.rotation;
        //this.body.velocity.x = scene.chromeTurret.angle > 45 ? 500 : -500; // For shooting left and right
        scene.turretProjectiles.add(this); 
    }
}