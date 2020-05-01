import MainScene from "../scenes/mainScene";

export default class ChromeTurret extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    spawnPosition: number;
    isUnlocked: boolean = true;
    name: string = "chromeTurret";
    bulletDelay: number = new Date().getTime(); // Get new current time of day

    constructor (scene:MainScene, x: number, y: number) { 
        super(scene, x, y, "chrome_turret");
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
    }

    toString(): string {
        return this.name;
    }
}