export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image("party_parrot", "assets/images/party_parrot.gif");
  }

  create() {
    this.scene.start('MainScene');
  }
}
