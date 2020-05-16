import 'phaser';
import MainScene from './scenes/mainScene';
import StartScene from './scenes/startScene';
import PreloadScene from './scenes/preloadScene';
import ChestScene from './scenes/chestScene';
import LoseScene from './scenes/loseScene';
import LevelComplete from './scenes/levelComplete';
import VictoryScene from './scenes/victoryScene';
import ChestHelp from './scenes/chestHelp';
import GameConfig = Phaser.Types.Core.GameConfig;


const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 1005;

const config: GameConfig = {
    backgroundColor: '#ffffff',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    scene: [PreloadScene, StartScene, MainScene, ChestScene, ChestHelp, LevelComplete, LoseScene, VictoryScene],
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            //gravity: { y: 400 }
        }
    }
};

window.addEventListener('load', () => {
    window['game'] = new Phaser.Game(config);
});

//
