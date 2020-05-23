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
        "start_in_store1",
        "start_in_store2",
        "start_in_store3"
    ]
}
  
export class GameScene extends Phaser.Scene {
    player: Player;
    enemies: Enemy[] = [];
    map: Phaser.Tilemaps.Tilemap;
    storeTiles: Phaser.Tilemaps.Tileset;
    walls: Phaser.Tilemaps.StaticTilemapLayer;
    floor: Phaser.Tilemaps.StaticTilemapLayer;

preload() {
    this.load.tilemapTiledJSON("storeMap","assets/store_map.json");
    this.load.image("storeTiles", "assets/store_tiles.png");
    this.load.image("enemy", "assets/enemy.png");
    WorldSettings.enemyPaths.forEach(
        p => this.load.json(p, `assets/paths/${p}.json`)
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
    let rnd = new Phaser.Math.RandomDataGenerator();
    this.enemies = WorldSettings.enemyPaths.map(
        path => {
            const isInfected = this.isEnemyInfected(rnd, WorldSettings.enemyInfectionProba);
            let enemy = new Enemy(this, path, isInfected);
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
}
}