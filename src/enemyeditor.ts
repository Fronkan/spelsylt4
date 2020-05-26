import * as Phaser from 'phaser';
import { EditorScene } from './editorscene';


const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Edior',
 
  type: Phaser.AUTO,
 
  // scale: {
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
 
  parent: 'game',
  // backgroundColor: '#000000',
  scene: EditorScene
};

export const game = new Phaser.Game(gameConfig);