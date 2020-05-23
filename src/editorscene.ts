import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Editor',
  };
  
export class EditorScene extends Phaser.Scene {
    map: Phaser.Tilemaps.Tilemap;
    storeTiles: Phaser.Tilemaps.Tileset;
    walls: Phaser.Tilemaps.StaticTilemapLayer;
    floor: Phaser.Tilemaps.StaticTilemapLayer;

preload() {
    this.load.tilemapTiledJSON("storeMap","assets/store_map.json");
    this.load.image("storeTiles", "assets/store_tiles.png");
    this.load.plugin('PathBuilder', "plugins/PathBuilder.js", true);
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
}
}