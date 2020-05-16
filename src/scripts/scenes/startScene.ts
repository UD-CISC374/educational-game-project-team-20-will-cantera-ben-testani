
export default class StartScene extends Phaser.Scene {
  private introTrack: Phaser.Sound.BaseSound;
  spacebar: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'StartScene' });
  }

  create() {
    // Music that plays when game is first started
    this.introTrack = this.sound.add("magic_cave");    
    let introTrackConfig = {
      mute: false,
      volume: .7,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    };
    this.introTrack.play(introTrackConfig);

    // Start screen image
    this.add.image(this.scale.width/2, this.scale.height/2, "start_screen");

    // Button for starting game
    const startButton = this.add.text(0, 0, "Start Game", {fill: "red", font: "bold 80px Serif"});
    startButton.setBackgroundColor("black");
    startButton.setX(this.scale.width/2 - startButton.width/2);
    startButton.setY(this.scale.height/2 + 300);
    startButton.setInteractive();
    startButton.on("pointerdown", () => this.onClick());
  }

  /** 
   * onClick, handles the mouse clicks for the start screen. 
   *
   * Consumes: Nothing
   * Produces: Nothing
   */
  onClick(): void {
    this.introTrack.stop()
    this.scene.start("MainScene", {powerup:1, chest:1}); // Move onto main scene for the game
  }

  
  update() {
  }
}