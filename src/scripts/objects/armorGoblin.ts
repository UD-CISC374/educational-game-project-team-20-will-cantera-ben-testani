import MainScene from "../scenes/mainScene";

export default class ArmorGoblin extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    spawnPosition: number;

    constructor (scene:MainScene, x: number, y: number, spawnPosition: number) { 
        super(scene, x, y, "armor_goblin");
        this.spawnPosition = spawnPosition;
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        scene.turretProjectiles.add(this); 
    }
}