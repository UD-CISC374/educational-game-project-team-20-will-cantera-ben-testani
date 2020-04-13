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
<<<<<<< HEAD
  submitButton;
  hour;
  min;
=======
>>>>>>> chestScene


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

    this.submitButton = this.add.text(0, 0, "Submit", {fill: "red", font: "bold 80px Serif"});
    this.submitButton.setBackgroundColor("black");
    this.submitButton.setX(this.scale.width/2 - this.submitButton.width/2);
    this.submitButton.setY(this.scale.height/2 + 350);
    this.submitButton.setInteractive();
    this.submitButton.on("pointerdown", () => this.onClickCheck());
  }

  questionTime(){
    this.hour = Math.floor(Math.random() * 12)+1;
    this.min = Math.round(Math.floor(Math.random() * 59)/5)*5;
    if(this.min==60){
      this.min=0;
    }
    this.hoursQuestion=this.add.bitmapText(this.scale.width/2 - 60, 200, "pixelFont", this.hour+":"+this.min, 75);
    //console.log(hour +" " + min);
    return;
  }

  onClickCheck(){
    let h = this.checkHour();
    let m = this.checkMin();
    console.log(h + " " + m);
    console.log(this.hoursDot.x + " " + this.hoursDot.y);
    console.log(this.minuetsDot.x + " " + this.minuetsDot.y);
  }

  checkMin(): boolean{
    let m = false;
    switch(this.min){
      case 0:
        if(this.minuetsDot.x >= 475 && this.minuetsDot.x <= 520 && this.minuetsDot.y >= 340 && this.minuetsDot.y <= 380){
          m = true;
        }
        break;
      case 5:
        if(this.minuetsDot.x >= 555 && this.minuetsDot.x <= 596 && this.minuetsDot.y >= 355 && this.minuetsDot.y <= 398){
          m = true;
        }
        break;
      case 10:
        if(this.minuetsDot.x >= 598 && this.minuetsDot.x <= 648 && this.minuetsDot.y >= 400 && this.minuetsDot.y <= 456){
          m = true;
        }
        break;
      case 15:
        if(this.minuetsDot.x >= 615 && this.minuetsDot.x <= 656 && this.minuetsDot.y >= 475 && this.minuetsDot.y <= 527){
          m = true;
        }
        break;
      case 20:
        if(this.minuetsDot.x >= 604 && this.minuetsDot.x <= 646 && this.minuetsDot.y >= 550 && this.minuetsDot.y <= 610){
          m = true;
        }
        break;
      case 25:
        if(this.minuetsDot.x >= 545 && this.minuetsDot.x <= 600 && this.minuetsDot.y >= 610 && this.minuetsDot.x <= 635){
          m = true;
        }
        break;
      case 30:
        if(this.minuetsDot.x >= 475 && this.minuetsDot.x <= 527 && this.minuetsDot.y >= 623 && this.minuetsDot.y <= 658){
          m = true;
        }
        break;
      case 35:
        if(this.minuetsDot.x >= 400 && this.minuetsDot.x <= 462 && this.minuetsDot.y >= 600 && this.minuetsDot.y <= 652){
          m = true;
        }
        break;
      case 40:
        if(this.minuetsDot.x >= 351 && this.minuetsDot.x <= 410 && this.minuetsDot.y >= 340 && this.minuetsDot.y <= 587){
          m = true;
        }
        break;
      case 45:
        if(this.minuetsDot.x >= 342 && this.minuetsDot.x <= 384 && this.minuetsDot.y >= 475 && this.minuetsDot.y <= 538){
          m = true;
        }
        break;
      case 50:
        if(this.minuetsDot.x >= 365 && this.minuetsDot.x <= 395 && this.minuetsDot.y >= 400 && this.minuetsDot.y <= 459){
          m = true;
        }
        break;
      case 55:
        if(this.minuetsDot.x >= 418 && this.minuetsDot.x <= 445 && this.minuetsDot.y >= 355 && this.minuetsDot.y <= 410){
          m = true;
        }
        break;
    }
    return m;
  }
  checkHour(): boolean{
    let h = false;
    switch(this.hour){
      case 0:
        if(this.hoursDot.x >= 475 && this.hoursDot.x <= 520 && this.hoursDot.y >= 340 && this.hoursDot.y <= 380){
          h = true;
        }
        break;
      case 12:
        if(this.hoursDot.x >= 475 && this.hoursDot.x <= 520 && this.hoursDot.y >= 340 && this.hoursDot.y <= 380){
          h = true;
        }
        break;
      case 1:
        if(this.hoursDot.x >= 555 && this.hoursDot.x <= 596 && this.hoursDot.y >= 355 && this.hoursDot.y <= 398){
          h = true;
        }
        break;
      case 2:
        if(this.hoursDot.x >= 598 && this.hoursDot.x <= 648 && this.hoursDot.y >= 400 && this.hoursDot.y <= 456){
          h = true;
        }
        break;
      case 3:
        if(this.hoursDot.x >= 615 && this.hoursDot.x <= 656 && this.hoursDot.y >= 475 && this.hoursDot.y <= 527){
          h = true;
        }
        break;
      case 4:
        if(this.hoursDot.x >= 604 && this.hoursDot.x <= 646 && this.hoursDot.y >= 550 && this.hoursDot.y <= 610){
          h = true;
        }
        break;
      case 5:
        if(this.hoursDot.x >= 545 && this.hoursDot.x <= 600 && this.hoursDot.y >= 610 && this.hoursDot.y <= 635){
          h = true;
        }
        break;
      case 6:
        if(this.hoursDot.x >= 475 && this.hoursDot.x <= 527 && this.hoursDot.y >= 623 && this.hoursDot.y <= 658){
          h = true;
        }
        break;
      case 7:
        if(this.hoursDot.x >= 400 && this.hoursDot.x <= 462 && this.hoursDot.y >= 600 && this.hoursDot.y <= 652){
          h = true;
        }
        break;
      case 8:
        if(this.hoursDot.x >= 351 && this.hoursDot.x <= 410 && this.hoursDot.y >= 340 && this.hoursDot.y <= 587){
          h = true;
        }
        break;
      case 9:
        if(this.hoursDot.x >= 342 && this.hoursDot.x <= 384 && this.hoursDot.y >= 475 && this.hoursDot.y <= 538){
          h = true;
        }
        break;
      case 10:
        if(this.hoursDot.x >= 365 && this.hoursDot.x <= 395 && this.hoursDot.y >= 400 && this.hoursDot.y <= 459){
          h = true;
        }
        break;
      case 11:
        if(this.hoursDot.x >= 418 && this.hoursDot.x <= 445 && this.hoursDot.y >= 355 && this.hoursDot.y <= 410){
          h = true;
        }
        break;
      default: break;
    }
    return h;
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
