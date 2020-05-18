import MainScene from "../scenes/mainScene";

export default class Turret extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    spawnPosition: number;
    isUnlocked: boolean;
    name: string = "";
    bulletDelay: number = new Date().getTime();

    constructor (scene:MainScene, x: number, y: number, isUnlocked: boolean, name: string) { 
        super(scene, x, y, name);
        scene.add.existing(this);
        this.isUnlocked = isUnlocked;
        this.name = name
        scene.physics.world.enableBody(this);
    }

    toString(): string {
        return this.name;
    }
}