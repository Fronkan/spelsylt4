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
    floor: Phaser.Tilemaps.StaticTilemapLayer;
    collectables: Phaser.Tilemaps.DynamicTilemapLayer;

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
    this.floor = this.map.createStaticLayer("floor", this.storeTiles);
    this.walls = this.map.createStaticLayer("walls", this.storeTiles);
    this.walls.setCollisionBetween(1,1000, true, true);
    this.objectTiles = this.map.addTilesetImage("objects", "objects");
    this.collectables = this.map.createDynamicLayer("objects", this.objectTiles);
    this.collectables.setCollisionBetween(1, 1000, true, true);


    // this.collectables = this.map.getObjectLayer("objects").objects;
    // this.collectables.forEach(
    //     obj =>{
    //         obj.

    //     }
    // )
    // this.floor.setScale(0.5,0.5);
    // this.walls.setScale(0.5,0.5);

    let rnd = new Phaser.Math.RandomDataGenerator();
    this.enemies = WorldSettings.enemyPaths.map(
        path => {
            const isInfected = this.isEnemyInfected(rnd, WorldSettings.enemyInfectionProba);
            let enemy = new Enemy(this, path.name, isInfected, path.duration, rnd.realInRange(0.1,0.7));
            return enemy
    });

    // this.walls.forEachTile(
    //     tile => {
    //         if (tile.collides){
    //             tile.setAlpha(0.1)
    //         }
    //     }
    // )
    this.player = new Player(this);
    this.scale.setGameSize(this.floor.displayWidth,this.floor.displayHeight);
    this.physics.world.setBounds(0, 0, this.floor.displayWidth, this.floor.displayHeight);
    this.player.go.body.setCollideWorldBounds(true);
}

isEnemyInfected(rnd: Phaser.Math.RandomDataGenerator, prob: integer){
    // Prob is a interger in range [0, 100], giving the probability of a enemy being infected
    const role = rnd.integerInRange(0, 100);
    return role <= prob;
}

public update(dt) {
    this.player.update(dt);
    this.physics.world.collide(this.player.go, this.walls);
    this.enemies = this.enemies.filter( enemy => !enemy.isDestroyed);
    this.enemies.forEach(
        enemy => {
            enemy.update();
            if (this.physics.world.overlap(this.player.go, enemy.go)){
                if(this.player.infectionCheck(enemy)){
                    this.add.text(300, 300, "Game Over", {fontSize: '64px'});
                    const restartBtn = this.add.text(350, 400, 'Restart Game', { fill: '#0f0' });
                    restartBtn
                        .setInteractive()
                        .on("pointerover", () => restartBtn.setStyle({ fill: '#ff0'}))
                        .on('pointerout', () =>  restartBtn.setStyle({ fill: '#0f0'}))
                        .on('pointerdown', () => this.scene.restart());
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