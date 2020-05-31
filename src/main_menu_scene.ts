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

preload(){
    this.load.image("infectionRange","assets/main_menu/infection_range.png");
    this.load.image("pickups","assets/objects.png");
}


public create() {
    const centerX = this.cameras.main.centerX; 
    const centerY = this.cameras.main.centerY; 
    this.add.text(
        centerX,
        centerY-300,
        'Supply Run',
        {fontSize:'30px', align:"center"}
    ).setOrigin(0.5);

    this.add.text(
        centerX,
        centerY-200,
        "Find all supplies you need and get out of the store, without getting infected!",
        {fontSize:'19px', align:"center"}
    ).setOrigin(0.5);

    this.add.text(
        centerX,
        centerY-100,
        "Avoid getting to close to others shopping, the white circle is the infection range.",
        {fontSize:'19px', align:"center"}
    ).setOrigin(0.5);
    this.add.text(
        centerX,
        centerY-50,
        "Not everyone is infected, but getting infected loses you the game. Keep your distance!",
        {fontSize:'19px', align:"center"}
    ).setOrigin(0.5);

    this.add.image(
        centerX,
        centerY +30,
        "infectionRange"
    )

    this.add.text(
        centerX,
        centerY+130,
        "Everyting you will need:",
        {fontSize:'19px', align:"center"}
    ).setOrigin(0.5);

    
    this.add.image(
        centerX,
        centerY + 170,
        "pickups"
    )

    const playBtn = this.add.text(
        centerX,
        centerY+ 250,
        'Play Game',
        { fill: '#0f0', fontSize:'30px', align:"center"}
    );
    playBtn.setInteractive()
        .on("pointerover", () => playBtn.setStyle({ fill: '#ff0'}))
        .on('pointerout', () =>  playBtn.setStyle({ fill: '#0f0'}))
        .on('pointerdown', () =>  this.scene.start("Game"))
        .setOrigin(0.5);
}



public update(dt: number) {   }
}