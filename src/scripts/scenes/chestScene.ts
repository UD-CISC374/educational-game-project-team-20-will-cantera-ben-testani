import MainScene from "./mainScene";

export default class ChestScene extends Phaser.Scene {
  public static switching: boolean = false;
  closedChest: Phaser.GameObjects.Image;
  openedChest: Phaser.GameObjects.Image;
  clock: Phaser.GameObjects.Image;
  hoursDot: Phaser.GameObjects.Image;
  minuetsDot: Phaser.GameObjects.Image;
  bombPowerup: Phaser.GameObjects.Image;
  hoursLabel: Phaser.GameObjects.BitmapText;
  minLabel: Phaser.GameObjects.BitmapText;
  mainLabel: Phaser.GameObjects.BitmapText;
  hoursQuestion: Phaser.GameObjects.BitmapText;
  minutesQuestion: Phaser.GameObjects.BitmapText;
  response: Phaser.GameObjects.BitmapText;
  powerupNum: number; //number to return to mainScene

  
  rewardGroup: any;
  submitButton: Phaser.GameObjects.Text;
  chestNumLabel: Phaser.GameObjects.Text;
  backButton: Phaser.GameObjects.Text;
  helpButton: Phaser.GameObjects.Text;
  hour: number;
  min: number;
  backGroup: Phaser.GameObjects.Group;
  textGroup: Phaser.GameObjects.Group;
  chestNum: number;
  noChests: Phaser.GameObjects.Text;
  spikePowerup: any;
  powerupIndex: number = 1;
  orbPowerup: Phaser.GameObjects.Image;
  picklePowerup: Phaser.GameObjects.Image;
  pearlPowerup: Phaser.GameObjects.Image;
  noChestText: Phaser.GameObjects.Text;
  nextButton: Phaser.GameObjects.Text;

  /**
   * constructor, provides a reference to this scene
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  constructor(powerup: number) {
    super({ key: 'ChestScene' });
  }


  init(data){
    this.powerupNum = data.powerup;
    this.chestNum = data.chest;
  }


  /**
   * create, most of the code is moved to their own functions, that code is called in create to 
   *         setup this screen.
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  create(): void {
    MainScene.beginning = true;
    this.backGroup = this.add.group();
    this.textGroup = this.add.group();
    this.rewardGroup = this.physics.add.group({
      immovable: false,
      allowGravity: false
    });
    this.makeHelpButton();

    this.makeBackButton();
    this.makeSubmitButton();
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

      gameObject.x = dragX;
      gameObject.y = dragY;
      
    });
    this.setUpScreen();
    this.makeNextButton();
    this.makeHelpButton();
    this.makeBackButton();
    this.makeSubmitButton();
    this.questionTime();
  }

  makeNextButton() {
    this.nextButton = this.add.text(0, this.scale.height/2, "Next Chest", {fill: "red", font: "bold 35px Serif"});
    this.nextButton.setBackgroundColor("black");
    this.nextButton.setX(this.scale.width-this.nextButton.width);
    this.nextButton.setInteractive();
    this.nextButton.on("pointerdown", () => {
      this.chestNumLabel.setText("Chests: " + MainScene.chestNum);
      if (MainScene.chestNum) {
        this.resetScene();
      } else {
        this.displayNoChests();
      }
    });
  }


  /**
   * setUpScreen, sets up most of the labels and images for the scene
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  setUpScreen(): void{
    this.noChestText = this.add.text(0, 0, "No Chests Available");
    this.noChestText.depth = 100;
    this.noChestText.setColor("red");
    this.noChestText.setFontSize(32);
    this.noChestText.setFontStyle("bold");
    this.noChestText.setX(this.scale.width/2-this.noChestText.width/2);
    this.noChestText.setY(this.scale.height/2-this.noChestText.height/2);
    this.response = this.add.bitmapText(0,0,"pixelFont"," ", 75);
    this.closedChest=this.add.image(this.scale.width/2, this.scale.height/2, "closeChest");
    this.openedChest=this.add.image(this.scale.width/2, this.scale.height/2, "openChest");
    this.hideOpenedChest();
    this.bombPowerup=this.add.image(this.scale.width/2, this.scale.height/2, "bombPowerup");
    this.spikePowerup = this.add.image(this.scale.width/2, this.scale.height/2, "spike_powerup");
    this.orbPowerup = this.add.image(this.scale.width/2, this.scale.height/2, "energy_ball");
    this.picklePowerup = this.add.image(this.scale.width/2, this.scale.height/2, "pickle_rick");
    this.pearlPowerup = this.add.image(this.scale.width/2, this.scale.height/2, "pearl");
    this.clock=this.add.image(this.scale.width/2, this.scale.height/2, "clock");
    this.hoursDot=this.add.image(this.scale.width/4 + this.scale.width/2, this.scale.width/4 + this.scale.width/2, "hoursDot");
    this.minuetsDot=this.add.image(this.scale.width/4, this.scale.height/4 + this.scale.height/2, "minutesDot");
    this.hoursLabel=this.add.bitmapText(this.scale.width/4 + this.scale.width/2 - 45, this.scale.width/4 + this.scale.width/2 + 40, "pixelFont", "HOURS", 50);
    this.minLabel=this.add.bitmapText(this.scale.width/4 - 65, this.scale.height/4 + this.scale.height/2 + 40, "pixelFont", "MINUTES", 50);
    this.mainLabel=this.add.bitmapText(150, 150, "pixelFont", "TIME TO DISPLAY ON CLOCK: ", 75);
    this.hoursQuestion = this.add.bitmapText(0,0,"pixelFont", " ", 75);
    this.chestNumLabel = this.add.text(0, 0, "Chests: " + MainScene.chestNum, {fill: "red", font: "bold 80px Serif"});
    this.chestNumLabel.setBackgroundColor("black");
    this.chestNumLabel.setX(this.scale.width/2 - this.chestNumLabel.width/2);
    this.hoursDot.setInteractive({draggable:true});
    this.minuetsDot.setInteractive({draggable:true}); 
    this.backGroup.add(this.closedChest);
    this.textGroup.add(this.hoursQuestion);
    this.rewardGroup.add(this.bombPowerup);
    this.rewardGroup.add(this.spikePowerup);
    this.rewardGroup.add(this.orbPowerup);
    this.rewardGroup.add(this.picklePowerup);
    this.rewardGroup.add(this.pearlPowerup);
    this.hidePowerup();
  }


  /**
   * makeHelpButton, makes the help button for the scene
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  makeHelpButton(): void{
    this.helpButton = this.add.text(0, 0, "Help", {fill: "red", font: "bold 80px Serif"});
    this.helpButton.setBackgroundColor("black");
    this.helpButton.setX(this.scale.width-this.helpButton.width);
    this.helpButton.setInteractive();
    this.helpButton.on("pointerdown", () => {
      this.scene.switch("ChestHelp");
    });
  }


  /** 
   * makeSubmitButton, makes the submit button for the scene
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  makeSubmitButton(): void{
    this.submitButton = this.add.text(0, 0, "Submit", {fill: "red", font: "bold 80px Serif"});
    this.submitButton.setBackgroundColor("black");
    this.submitButton.setX(this.scale.width/2 - this.submitButton.width/2);
    this.submitButton.setY(this.scale.height/2 + 350);
    this.submitButton.setInteractive();
    this.submitButton.on("pointerdown", () => this.onClickCheck());
    this.submitButton.depth = 100;
  }


  /**
   * makeBackButton, makes the back button for the scene
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  makeBackButton(): void{
    this.backButton = this.add.text(0, 0, "Back", {fill: "red", font: "bold 80px Serif"});
    this.backButton.setBackgroundColor("black");
    //this.backButton.setX(this.scale.width/2 - this.submitButton.width/2);
    //this.backButton.setY(this.scale.height/2 + 350);
    this.backButton.setInteractive();
    this.backButton.on("pointerdown", () => {
      MainScene.beginning = true;
      ChestScene.switching = true;
      this.resetScene();
      //this.scene.start("MainScene", {powerup: this.powerupNum, chest: this.chestNum});
      this.scene.switch("MainScene");
    });
  }

  hideNoChestScene(): void{
    this.noChests.setVisible(false);
  }

  /**
   * questionTime, generates a random time to ask the user to display on the clock
   *         
   * Consumes: Nothing
   * Produces: Nothing
   */
  questionTime(){
    if (!MainScene.chestNum) {
      this.displayNoChests();
      return;
    }
    this.hour = Math.floor(Math.random() * 12)+1;
    this.min = Math.round(Math.floor(Math.random() * 59)/5)*5;
    if(this.min==60){
      this.min=0;
    }
    if(this.min<10){
      //this.hoursQuestion=this.add.bitmapText(this.scale.width/2 - 60, 200, "pixelFont", this.hour+":0"+this.min, 75);
      this.hoursQuestion.setText(this.hour+":0"+this.min);
    }
    else{
      //this.hoursQuestion=this.add.bitmapText(this.scale.width/2 - 60, 200, "pixelFont", this.hour+":"+this.min, 75);
      this.hoursQuestion.setText(this.hour+":"+this.min);
    }
    //console.log(hour +" " + min);
    //this.hideClosedChest()
    // UPDATED TIME NOT SHOWING
    this.textGroup.add(this.hoursQuestion);
    this.hoursQuestion.setX(this.scale.width/2 - 60);
    this.hoursQuestion.setY(200);
    this.hoursQuestion.depth = 100;
    //this.hoursQuestion.setTint(0x00FF06)

  }


  /**
   * onClickCheck, calls helper functions to decide if the player correctly displayed the time on the clock
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  onClickCheck(): void{
    MainScene.beginning = false;
    this.hideResponse();
    let h = this.checkHour();
    let m = this.checkMin();
    //console.log(h + " " + m);
    //console.log(this.hoursDot.x + " " + this.hoursDot.y);
    //console.log(this.minuetsDot.x + " " + this.minuetsDot.y);
    if(h && m){
      this.hideClosedChest();
      this.hideClock();
      this.hideDots();
      this.showOpenedChest();
      this.hideText();
      this.hideSubmit();
      this.showResponse(1);
      this.showPowerup();
    }
    else this.showResponse(0);
  }


  resetScene(): void{
    this.questionTime();
    this.hideResponse();
    this.showSubmit()
    this.hideOpenedChest();
    this.showClosedChest();
    this.showDots();
    this.showText();
    this.showClock();
    this.setDots();
    this.hidePowerup();
  }


  /**
   * hidePowerup, hides the powerup
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  hidePowerup(): void{
    for(let i = 0; i < this.rewardGroup.getChildren().length; i++){
      this.rewardGroup.getChildren()[i].setVisible(false);
    }
  }


  /**
   * showPowerup, shows the powerup the player won
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  showPowerup(): void{
    this.powerupIndex = Math.floor(Math.random() * this.rewardGroup.getChildren().length);
    console.log(this.powerupIndex);
    if (this.powerupIndex === 0)
      this.bombPowerup.setVisible(true);
    if (this.powerupIndex === 1)
      this.spikePowerup.setVisible(true);
    if (this.powerupIndex === 2)
      this.orbPowerup.setVisible(true);
    if (this.powerupIndex === 3) 
      this.picklePowerup.setVisible(true);
    if (this.powerupIndex === 4)
      this.pearlPowerup.setVisible(true);
    MainScene.powerUps[this.powerupIndex] += 2;
    MainScene.numClones[this.powerupIndex] += 2;
    MainScene.chestNum--;
  }

  /**
   * setDots, resets the dots locations
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  setDots(): void{
    this.hoursDot.setX(this.scale.width/4 + this.scale.width/2);
    this.hoursDot.setY(this.scale.width/4 + this.scale.width/2);
    this.minuetsDot.setX(this.scale.width/4);
    this.minuetsDot.setY(this.scale.height/4 + this.scale.height/2);
  }


  /**
   * showResponse, shows if the users response was correct or incorrect
   * 
   * Consumes: A number representing if the answer is right or wrong
   * Produces: Nothing
   */
  showResponse(num: number): void{
    if(num==1){
      this.response = this.add.bitmapText(0, 0, "pixelFont", "CORRECT ", 75);
      this.response.setX(this.scale.width/2 - this.response.width/2);
      this.response.setY(this.chestNumLabel.height + 10);
      this.response.setTint(0x00FF06);
    }
    if(num==0){
      this.response = this.add.bitmapText(0, 0, "pixelFont", "INCORRECT ", 75);
      this.response.setX(this.scale.width/2 - this.response.width/2);
      this.response.setY(this.chestNumLabel.height + 10);
      this.response.setTint(0xFF2D00);
    }
    this.response.setVisible(true);
  }

  /**
   * hideResponse, hides if the users response was correct or incorrect
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  hideResponse(): void{
    this.response.setVisible(false);
  }

  /**
   * hideClosedChest, sets the closedChest image to invisible
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  hideClosedChest(): void{
    this.closedChest.setVisible(false);
  }

  /**
   * hideClock, sets the clock image to invisible
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  hideClock(): void{
    this.clock.setVisible(false);
  }

  /**
   * hideOpenedChest, sets the openedChest image to invisible
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  hideOpenedChest(): void{
    this.openedChest.setVisible(false);
  }

  /**
   * showClosedChest, sets the closedChest image to visible
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  showClosedChest(): void{
    this.closedChest.setVisible(true);
  }

  /**
   * showClock, sets the clock image to visible
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  showClock(): void{
    this.clock.setVisible(true);
  }

  /**
   * showOpenedChest, sets the openedChest image to visible
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  showOpenedChest(): void{
    this.openedChest.setVisible(true);
  }

  /**
   * hideDots, sets the dots images to invisible
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  hideDots(): void{
    this.hoursDot.setVisible(false);
    this.minuetsDot.setVisible(false);
  }

  /**
   * showDots, sets the dots images to visible
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  showDots(): void{
    this.hoursDot.setVisible(true);
    this.minuetsDot.setVisible(true);
  }

  /**
   * hideText, sets the text on the screen to invisible
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  hideText(): void{
    this.hoursLabel.setVisible(false);
    this.minLabel.setVisible(false);
    this.mainLabel.setVisible(false);
    this.hoursQuestion.setVisible(false);
  }

  /**
   * showText, sets the text on the screen to visible
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  showText(): void{
    this.hoursLabel.setVisible(true);
    this.minLabel.setVisible(true);
    this.mainLabel.setVisible(true);
    this.hoursQuestion.setVisible(true);
  }

  /**
   * hideSubmit, sets the submit button on the screen to invisible
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  hideSubmit(): void{
    this.submitButton.setVisible(false);
  }

  /**
   * showSubmit, sets the submit button on the screen to visible
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  showSubmit(): void{
    this.submitButton.setVisible(true);
  }

  /**
   * checkMin, checks if the minute dot is within the bounds for the minute part of the time question
   * 
   * Consumes: Nothing
   * Produces: Boolean
   */
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

  /**
   * checkHour, checks if the hour dot is within the bounds for the minute part of the time question
   * 
   * Consumes: Nothing
   * Produces: Boolean
   */
  checkHour(): boolean{
    let h = false;
    switch(this.hour){
      // case 0:
      //   if(this.hoursDot.x >= 475 && this.hoursDot.x <= 520 && this.hoursDot.y >= 340 && this.hoursDot.y <= 380){
      //     h = true;
      //   }
      //   break;
      case 1:
        if(this.hoursDot.x >= 564 && this.hoursDot.x <= 648 && this.hoursDot.y >= 361 && this.hoursDot.y <= 449){
          h = true;
        }
        break;
      case 2:
        if(this.hoursDot.x >= 604 && this.hoursDot.x <= 667 && this.hoursDot.y >= 415 && this.hoursDot.y <= 514){
          h = true;
        }
        break;
      case 3:
        if(this.hoursDot.x >= 592 && this.hoursDot.x <= 668 && this.hoursDot.y >= 494 && this.hoursDot.y <= 595){
          h = true;
        }
        break;
      case 4:
        if(this.hoursDot.x >= 564 && this.hoursDot.x <= 644 && this.hoursDot.y >= 560 && this.hoursDot.y <= 651){
          h = true;
        }
        break;
      case 5:
        if(this.hoursDot.x >= 480 && this.hoursDot.x <= 579 && this.hoursDot.y >= 603 && this.hoursDot.y <= 668){
          h = true;
        }
        break;
      case 6:
        if(this.hoursDot.x >= 419 && this.hoursDot.x <= 516 && this.hoursDot.y >= 603 && this.hoursDot.y <= 667){
          h = true;
        }
        break;
      case 7:
        if(this.hoursDot.x >= 346 && this.hoursDot.x <= 442 && this.hoursDot.y >= 559 && this.hoursDot.y <= 658){
          h = true;
        }
        break;
      case 8:
        if(this.hoursDot.x >= 334 && this.hoursDot.x <= 395 && this.hoursDot.y >= 491 && this.hoursDot.y <= 591){
          h = true;
        }
        break;
      case 9:
        if(this.hoursDot.x >= 339 && this.hoursDot.x <= 387 && this.hoursDot.y >= 402 && this.hoursDot.y <= 519){
          h = true;
        }
        break;
      case 10:
        if(this.hoursDot.x >= 353 && this.hoursDot.x <= 439 && this.hoursDot.y >= 354 && this.hoursDot.y <= 450){
          h = true;
        }
        break;
      case 11:
        if(this.hoursDot.x >= 414 && this.hoursDot.x <= 516 && this.hoursDot.y >= 337 && this.hoursDot.y <= 397){
          h = true;
        }
        break;
      case 12:
        if(this.hoursDot.x >= 492 && this.hoursDot.x <= 575 && this.hoursDot.y >= 337 && this.hoursDot.y <= 391){
          h = true;
        }
        break;
      default: break;
    }
    return h;
  }

  /**
   * displayNoChests, displays the "no chest scene"
   * 
   * Consumes: Nothing
   * Produces: Nothing
   */
  displayNoChests(): void {
    this.hideClosedChest();
    this.hideOpenedChest();
    this.hideClock();
    this.hideDots();
    this.hideSubmit();
    this.hidePowerup()
    this.hideText();
    this.hideResponse();
    this.noChestText.setVisible(true);
  }

  update() {
    if(MainScene.beginning){
      MainScene.beginning = false;
      if (!MainScene.chestNum) {
        this.displayNoChests();
      } else {
        this.showClosedChest();
        this.showDots();
        this.showText();
        this.showClock();
        this.showSubmit();
        this.noChestText.setVisible(false);
      }
      this.questionTime();
      this.chestNumLabel.setText("Chests: " + MainScene.chestNum);
    }
  }
}
