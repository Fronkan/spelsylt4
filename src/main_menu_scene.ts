import * as Phaser from 'phaser';


const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'MainMenu',
};

export class MainMenuScene extends Phaser.Scene {


constructor() {
    super(sceneConfig);
}


public create() { 
    const playBtn = this.add.text(
        this.cameras.main.centerX-150,
        this.cameras.main.centerY-100,
        'Play Game',
        { fill: '#0f0', fontSize:'30px',  boundsAlignH: "center", boundsAlignV: "middle" }
    );
    playBtn.setInteractive()
        .on("pointerover", () => playBtn.setStyle({ fill: '#ff0'}))
        .on('pointerout', () =>  playBtn.setStyle({ fill: '#0f0'}))
        .on('pointerdown', () =>  this.scene.start("Game"));
}



public update(dt: number) {   }
}