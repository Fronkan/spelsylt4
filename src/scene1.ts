import * as Phaser from 'phaser';
import { Player } from './player';
import { Enemy } from './enemy';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};


class EnemyConfig{
    constructor(
        public name: string,
        public duration: integer,
        public isInfected: boolean = false,
    ){}
}

const WorldSettings = {
    enemyInfectionProba: 60,
    enemyConfigs:[
        new EnemyConfig("path0", 40000, true),
        new EnemyConfig("path1", 20000),
        new EnemyConfig("path2", 50000),
        new EnemyConfig("path3", 50000),
        new EnemyConfig("path4", 40000),
        new EnemyConfig("path5", 50000)
    ],
    numCollectables:4,
}
  
export class GameScene extends Phaser.Scene {
    isRunning: boolean;
    player: Player;
    enemies: Enemy[] = [];
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
    WorldSettings.enemyConfigs.forEach(
        p => this.load.json(p.name, `assets/paths/${p.name}.json`)
    );

        
}


constructor() {
    super(sceneConfig);
}


public create() {
    this.setUp();   
}


public restart() {
    this.scene.restart();
    this.setUp();
}


private setUp(){
    this.player = new Player(this);
    this.player.go.body.setCollideWorldBounds(true);
    let map = this.make.tilemap({key: "storeMap"});
    const storeSize = this.createStore(map, "storeTiles");
    this.addStoreItems(map, "objects", "objects");
    this.addStartAndGoal(map, 0);
    this.scale.setGameSize(storeSize.width, storeSize.height);
    this.physics.world.setBounds(0, 0, storeSize.width, storeSize.height);
    
    this.createEnemies(WorldSettings.enemyConfigs);
    this.isRunning = true;
}


private createEnemies(enemyConfigs: EnemyConfig[]){
    let rnd = new Phaser.Math.RandomDataGenerator();
    this.enemies = WorldSettings.enemyConfigs.map(
        enemyConf => {
            return new Enemy(this, enemyConf.name, enemyConf.isInfected, enemyConf.duration, rnd.realInRange(0.1,0.7));
        }
    );
}


private createStore(map: Phaser.Tilemaps.Tilemap, tileName, floorLayer: string="floor", wallLayer: string = "walls"): {"width": number, "height":number}{
    const storeTiles: Phaser.Tilemaps.Tileset =  map.addTilesetImage("store_background", tileName);
    const floor = map.createStaticLayer(floorLayer, storeTiles);
    this.walls = map.createStaticLayer(wallLayer, storeTiles);
    this.walls.setCollisionBetween(1,1000, true, true);

    return {"width":floor.displayWidth, "height": floor.displayHeight};
}


private addStoreItems(map: Phaser.Tilemaps.Tilemap,tileName: string, layerName: string){
    const objectTiles = map.addTilesetImage(tileName, tileName);
    this.collectables = map.createDynamicLayer(layerName, objectTiles);
    this.collectables.setCollisionBetween(1, 1000, true, true);
}


private addStartAndGoal(map: Phaser.Tilemaps.Tilemap, objectLayer: number, start: string="start", goal: string="goal"){
    const eventLayer: Phaser.Tilemaps.ObjectLayer = map.objects[objectLayer];
    eventLayer.objects.forEach(
        obj => {
            console.log(obj);
            if(obj.name == start){
                let go = this.add.rectangle(obj.x+25, obj.y+10, obj.width ,obj.height, 0xFFFFFF);
                const center = go.getCenter();
                this.player.go.setPosition(center.x, center.y)
            }
            if(obj.name == goal){
                let go = this.add.rectangle(obj.x+200, obj.y+50, obj.width, obj.height, 0xFFFFFF);
                this.physics.add.existing(go);
                this.goal = go as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
            }
        }
    )
}


public update(dt: number) {
    console.log(this.isRunning);
    this.player.update(dt);
    this.physics.world.collide(this.player.go, this.walls);
    this.enemies = this.enemies.filter( enemy => !enemy.isDestroyed);
    this.physics.overlap(this.player.go, this.goal, () => this.restartScreen("Victory"));
    this.enemies.forEach(
        enemy => {
            enemy.update();
            if(!this.isRunning){
                return;
            }
            if (this.physics.world.overlap(this.player.go, enemy.go)){
                if(this.player.infectionCheck(enemy)){
                    this.restartScreen("Infected!");
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


private restartScreen(title: string) {
    this.isRunning = false;
    this.player.disabled = true;
    this.add.text(
        this.cameras.main.centerX - 200,
        this.cameras.main.centerY- 200,
        title,
        {fontSize: '64px'}
    );
    const restartBtn = this.add.text(
        this.cameras.main.centerX-150,
        this.cameras.main.centerY-100,
        'Restart Game',
        { fill: '#0f0', fontSize:'30px',  boundsAlignH: "center", boundsAlignV: "middle" }
    );
    restartBtn
        .setInteractive()
        .on("pointerover", () => restartBtn.setStyle({ fill: '#ff0'}))
        .on('pointerout', () =>  restartBtn.setStyle({ fill: '#0f0'}))
        .on('pointerdown', () =>  this.restart());
    
}

}