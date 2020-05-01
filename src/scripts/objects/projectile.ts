import MainScene from "../scenes/mainScene";

export default class Projectile extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    name: string;

    constructor (scene:MainScene, turret: any, projectileType: string) {
        let x = turret.x;
        let y = turret.y; 
        super(scene, x, y, projectileType);
        scene.add.existing(this);

        this.name = projectileType;

        scene.physics.world.enableBody(this);
        this.body.rotation = scene.chromeTurret.rotation;
        scene.turretProjectiles.add(this); 
    }
}