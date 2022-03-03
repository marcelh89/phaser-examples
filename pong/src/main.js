import Phaser from 'phaser'
import TitleScene from "./scenes/TitleScene";
import GameScene from "./scenes/GameScene";
import GameBackground from "./scenes/GameBackground";
import GameOverScene from "./scenes/GameOverScene";
import * as SceneKeys from './consts/SceneKeys';
import PreloadScene from "./scenes/PreloadScene";

/** @type {Phaser.Game.config} **/
const config = {
    width: 800,
    height: 500,
    type: Phaser.AUTO,
    backgroundColor: '#616161',
    //backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0,
            },
            debug: true
        }
    }
}

const game = new Phaser.Game(config);

game.scene.add(SceneKeys.TitleScene, TitleScene);
game.scene.add(SceneKeys.GameScene, GameScene);
game.scene.add(SceneKeys.GameBackgroundScene, GameBackground);
game.scene.add(SceneKeys.GameOverScene, GameOverScene);
game.scene.add(SceneKeys.PreloadScene, PreloadScene);

game.scene.start(SceneKeys.PreloadScene)