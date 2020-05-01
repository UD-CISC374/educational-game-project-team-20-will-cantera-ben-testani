import MainScene from "../scenes/mainScene";

export default class PurpleShip extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    isUnlocked: boolean = false;
    name: string = "purpleShip";
    bulletDelay: number = new Date().getTime();

    constructor (scene:MainScene, x: number, y: number) { 
        super(scene, x, y, "purple_ship");
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
    }

    toString(): string {
        return this.name;
    }
}