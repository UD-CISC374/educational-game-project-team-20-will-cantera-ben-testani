import ExampleObject from '../objects/exampleObject';

export default class ChestScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  closedChest: Phaser.GameObjects.Image;
  clock: Phaser.GameObjects.Image;
  hoursDot: Phaser.GameObjects.Image;
  minuetsDot: Phaser.GameObjects.Image;
  hoursLabel: Phaser.GameObjects.BitmapText;
  minLabel: Phaser.GameObjects.BitmapText;
  mainLabel: Phaser.GameObjects.BitmapText;
  hoursQuestion: Phaser.GameObjects.BitmapText;
  minutesQuestion: Phaser.GameObjects.BitmapText;


  constructor() {
    super({ key: 'ChestScene' });
  }

  create() {
    this.exampleObject = new ExampleObject(this, 0, 0);
    this.closedChest=this.add.image(this.scale.width/2, this.scale.height/2, "closeChest");
    this.clock=this.add.image(this.scale.width/2, this.scale.height/2, "clock");
    this.hoursDot=this.add.image(this.scale.width/4 + this.scale.width/2, this.scale.width/4 + this.scale.width/2, "hoursDot");
    this.minuetsDot=this.add.image(this.scale.width/4, this.scale.height/4 + this.scale.height/2, "minutesDot");
    this.hoursLabel=this.add.bitmapText(this.scale.width/4 + this.scale.width/2 - 45, this.scale.width/4 + this.scale.width/2 + 40, "pixelFont", "HOURS", 50);
    this.minLabel=this.add.bitmapText(this.scale.width/4 - 65, this.scale.height/4 + this.scale.height/2 + 40, "pixelFont", "MINUTES", 50);
    this.mainLabel=this.add.bitmapText(150, 150, "pixelFont", "TIME TO DISPLAY ON CLOCK: ", 75);
    this.hoursDot.setInteractive({draggable:true});
    this.minuetsDot.setInteractive({draggable:true});

    this.questionTime();
    // http://labs.phaser.io/index.html?dir=input/dragging/&q=
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

      gameObject.x = dragX;
      gameObject.y = dragY;

      console.log("X: " + dragX + " " + " Y: " + dragY);
      
    });
  }

  questionTime(){
    let hour = Math.floor(Math.random() * 12)+1;
    let min = Math.round(Math.floor(Math.random() * 59)/5)*5;
    if(min==60){
      min=0;
    }
    this.hoursQuestion=this.add.bitmapText(this.scale.width/2 - 60, 200, "pixelFont", hour+":"+min, 75);
    //console.log(hour +" " + min);
    return;
  }
  update() {
  }
}
