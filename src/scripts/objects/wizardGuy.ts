import MainScene from "../scenes/mainScene";

export default class WizardGuy extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    spawnPosition: number;
    isUnlocked: boolean = false;

    constructor (scene:MainScene, x: number, y: number) { 
        super(scene, x, y, "wizard_dude");
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
    }
}