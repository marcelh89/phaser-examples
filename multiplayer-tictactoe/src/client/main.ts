import Phaser from 'phaser'

import Bootstrap from './scenes/Bootstrap'
import GameScene from "./scenes/GameScene";
import GameOverScene from "./scenes/GameOverScene";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [Bootstrap, GameScene, GameOverScene]
}

export default new Phaser.Game(config)
