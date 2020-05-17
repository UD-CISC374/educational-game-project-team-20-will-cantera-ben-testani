import MainScene from "../scenes/mainScene";

export default class Clone extends Phaser.GameObjects.Sprite {
    name: string = "clone";
    body: Phaser.Physics.Arcade.Body;
    isActive: boolean = false;
    x: number; 
    y: number;
    powerup1Img: string = "bombPowerup";
    powerup2Img: string = "spike_powerup";
    powerup3Img: string = "energy_ball";
    powerup4Img: string = "pickle_rick";
    powerup5Img: string = "pearl";

    constructor (scene:MainScene, x: number, y: number, texture: any, name: string) { 
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.name = name;
        this.x = x;
        this.y = y;
        scene.physics.world.enableBody(this);
    }

    toString(): string {
        return this.name;
    }
}