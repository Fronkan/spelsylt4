import * as Phaser from 'phaser';
import { Player } from './player';
import { Enemy } from './enemy';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};
const WorldSettings = {
    enemyInfectionProba: 60,
    enemyPaths:[
        {name:"path0", duration:40000},
        {name:"path1", duration:20000},
        {name:"path2", duration:50000},
        {name:"path3", duration:50000},
        {name:"path4", duration:40000},
        {name:"path5", duration:50000},
    ],
    numCollectables:4,
}
  
export class GameScene extends Phaser.Scene {
    player: Player;
    enemies: Enemy[] = [];
    map: Phaser.Tilemaps.Tilemap;
    storeTiles: Phaser.Tilemaps.Tileset;
    objectTiles: Phaser.Tilemaps.Tileset;
    walls: Phaser.Tilemaps.StaticTilemapLayer;
    collectables: Phaser.Tilemaps.DynamicTilemapLayer;
    goal: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };

preload() {
    this.load.tilemapTiledJSON("storeMap","assets/store_map.json");
    this.load.image("storeTiles", "assets/store_tiles.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("objects","assets/objects.png")
    WorldSettings.enemyPaths.forEach(
        p => this.load.json(p.name, `assets/paths/${p.name}.json`)
    );

        
}

constructor() {
    super(sceneConfig);
}

public create() {
    this.map = this.make.tilemap({key: "storeMap"});
    this.storeTiles =  this.map.addTilesetImage("store_background", "storeTiles");
    let floor = this.map.createStaticLayer("floor", this.storeTiles);
    this.walls = this.map.createStaticLayer("walls", this.storeTiles);
    this.walls.setCollisionBetween(1,1000, true, true);
    this.objectTiles = this.map.addTilesetImage("objects", "objects");
    this.collectables = this.map.createDynamicLayer("objects", this.objectTiles);
    this.collectables.setCollisionBetween(1, 1000, true, true);
    

    let rnd = new Phaser.Math.RandomDataGenerator();
    this.enemies = WorldSettings.enemyPaths.map(
        path => {
            const isInfected = this.isEnemyInfected(rnd, WorldSettings.enemyInfectionProba);
            let enemy = new Enemy(this, path.name, isInfected, path.duration, rnd.realInRange(0.1,0.7));
            return enemy
    });
    this.player = new Player(this);

    console.log(this.map.objects);
    const eventLayer: Phaser.Tilemaps.ObjectLayer = this.map.objects[0];
    eventLayer.objects.forEach(
        eventObj => {
            console.log(eventObj);
            if(eventObj.name == "start"){
                let go = this.add.rectangle(
                    eventObj.x+25,
                    eventObj.y+10,
                    eventObj.width,
                    eventObj.height,
                    0xFFFFFF
                );
                const center = go.getCenter();
                this.player.go.setPosition(
                    center.x,
                    center.y
                )
            }
            if(eventObj.name == "goal"){
                let go = this.add.rectangle(
                    eventObj.x+200,
                    eventObj.y+50,
                    eventObj.width,
                    eventObj.height,
                    0xFFFFFF
                );
                this.physics.add.existing(go);
                this.goal = go as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
            }
        }
    )
    this.scale.setGameSize(floor.displayWidth, floor.displayHeight);
    this.physics.world.setBounds(0, 0, floor.displayWidth, floor.displayHeight);
    this.player.go.body.setCollideWorldBounds(true);
}

isEnemyInfected(rnd: Phaser.Math.RandomDataGenerator, prob: integer){
    // Prob is a interger in range [0, 100], giving the probability of a enemy being infected
    const role = rnd.integerInRange(0, 100);
    return role <= prob;
}

public update(dt: number) {
    this.player.update(dt);
    this.physics.world.collide(this.player.go, this.walls);
    this.enemies = this.enemies.filter( enemy => !enemy.isDestroyed);
    this.physics.overlap(this.player.go, this.goal,
        () => {
            this.add.text(
                this.cameras.main.centerX - 200,
                this.cameras.main.centerY- 200,
                "VICTORY!",
                {fontSize: '64px'}
            );
            const restartBtn = this.add.text(
                this.cameras.main.centerX-100,
                this.cameras.main.centerY-100,
                'Restart Game',
                { fill: '#0f0' }
            );
            restartBtn
                .setInteractive()
                .on("pointerover", () => restartBtn.setStyle({ fill: '#ff0'}))
                .on('pointerout', () =>  restartBtn.setStyle({ fill: '#0f0'}))
                .on('pointerdown', () =>  this.scene.restart());
        }   
    );
    this.enemies.forEach(
        enemy => {
            enemy.update();
            if (this.physics.world.overlap(this.player.go, enemy.go)){
                if(this.player.infectionCheck(enemy)){
                    this.add.text(
                        this.cameras.main.centerX - 200,
                        this.cameras.main.centerY- 200,
                        "Game Over",
                        {fontSize: '64px'}
                    );
                    const restartBtn = this.add.text(
                        this.cameras.main.centerX-100,
                        this.cameras.main.centerY-100,
                        'Restart Game',
                        { fill: '#0f0' }
                    );
                    restartBtn
                        .setInteractive()
                        .on("pointerover", () => restartBtn.setStyle({ fill: '#ff0'}))
                        .on('pointerout', () =>  restartBtn.setStyle({ fill: '#0f0'}))
                        .on('pointerdown', () =>  this.scene.restart());
                }
            }
    });
    this.physics.world.collide(
        this.player.go,
        this.collectables,
        (playerGo, collectable)  => {
            // @ts-ignore
            this.collectables.removeTileAt(collectable.x, collectable.y)
        }
    )
}
}