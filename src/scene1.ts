import * as Phaser from 'phaser';
import { Player } from './player';
import { Enemy } from './enemy';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
  };
  
export class GameScene extends Phaser.Scene {
    player: Player;
    enemy: Enemy;
    map: Phaser.Tilemaps.Tilemap;
    storeTiles: Phaser.Tilemaps.Tileset;
    walls: Phaser.Tilemaps.StaticTilemapLayer;
    floor: Phaser.Tilemaps.StaticTilemapLayer;

preload() {
    this.load.tilemapTiledJSON("storeMap","assets/store_map.json");
    this.load.image("storeTiles", "assets/store_tiles.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.json("enemyPath","assets/path.json");
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
    this.enemy = new Enemy(this);
    // this.walls.forEachTile(
    //     tile => {
    //         if (tile.collides){
    //             tile.setAlpha(0.1)
    //         }
    //     }
    // )
    this.player = new Player(this);
}

public update(dt) {
    this.player.update(dt);
    this.physics.world.collide(this.player.go, this.walls);
    if (this.physics.world.overlap(this.player.go, this.enemy.go)){
        console.log("INFECTED");
    }
}
}