import * as Phaser from 'phaser';
import { GameScene } from './scene1';


const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Supply Run',
 
  type: Phaser.AUTO,
 
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT, //Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
 
  parent: 'game',
  // backgroundColor: '#000000',
  scene: GameScene
};

export const game = new Phaser.Game(gameConfig);