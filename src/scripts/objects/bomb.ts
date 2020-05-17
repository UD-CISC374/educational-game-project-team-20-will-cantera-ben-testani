import MainScene from "../scenes/mainScene";

export default class Bomb extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;

    constructor (scene:MainScene) {
        super(scene, scene.scale.width/5, scene.scale.height/5, "bombPowerup");
        this.setScale(.2);
        this.setInteractive({draggable:true});
        scene.add.existing(this);
        scene.powerUpGroup.add(this); 
        scene.physics.world.enableBody(this);
        this.body.rotation = scene.chromeTurret.rotation;
        //this.body.velocity.x = scene.chromeTurret.angle > 45 ? 500 : -500; // For shooting left and right
        
    }
}