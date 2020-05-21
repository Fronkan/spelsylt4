import * as Phaser from 'phaser';
import { Player } from './player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
  };
  
export class GameScene extends Phaser.Scene {
    player: Player;

preload() {
}

constructor() {
    super(sceneConfig);
}

public create() {
    this.player = new Player(this);
}

public update(dt) {
    this.player.update(dt);
}
}