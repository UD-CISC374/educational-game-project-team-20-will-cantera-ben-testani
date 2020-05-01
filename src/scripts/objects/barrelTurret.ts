import MainScene from "../scenes/mainScene";

export default class BarrelTurret extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    spawnPosition: number;
    isUnlocked: boolean = false;
    name: string = "barrelTurret";
    bulletDelay: number = new Date().getTime();


    constructor (scene:MainScene, x: number, y: number) { 
        super(scene, x, y, "barrel_turret");
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
    }

    toString(): string {
        return this.name;
    }
}