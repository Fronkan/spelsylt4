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
    enemyConfigs:[
        new EnemyConfig("path0",  38000),
        new EnemyConfig("path1",  20000),
        new EnemyConfig("path2",  25000),
        new EnemyConfig("path3",  50000),
        new EnemyConfig("path4",  40000),
        new EnemyConfig("path5",  50000),
        new EnemyConfig("path6",  40000),
        new EnemyConfig("path7",  30000),
        new EnemyConfig("path8",  40000),
        new EnemyConfig("path9",  55000),
        new EnemyConfig("path10", 20000),
        new EnemyConfig("path11", 40000),
    ],
    numCollectables:4,
    numInfected: 4,
    debug: false,
}
  
export class StoreScene extends Phaser.Scene {
    isRunning: boolean;
    player: Player;
    enemies: Enemy[] = [];
    storeTiles: Phaser.Tilemaps.Tileset;
    objectTiles: Phaser.Tilemaps.Tileset;
    walls: Phaser.Tilemaps.StaticTilemapLayer;
    collectables: Phaser.Tilemaps.DynamicTilemapLayer;
    goal: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    collectablesLeft: integer;
    readonly debugMode: boolean;

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
    this.debugMode = WorldSettings.debug;
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
    this.collectablesLeft = WorldSettings.numCollectables;
    let map = this.make.tilemap({key: "storeMap"});
    const storeSize = this.createStore(map, "storeTiles");
    this.addStoreItems(map, "objects", "objects");
    this.addStartAndGoal(map, 0);
    // this.scale.setGameSize(storeSize.width, storeSize.height);
    this.physics.world.setBounds(0, 0, storeSize.width, storeSize.height);
    this.player.go.body.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.player.go);
    
    this.createEnemies(WorldSettings.enemyConfigs);
    this.isRunning = true;
}


private createEnemies(enemyConfigs: EnemyConfig[]){
    let rnd = new Phaser.Math.RandomDataGenerator();
    const shuffledEnemies = rnd.shuffle(WorldSettings.enemyConfigs);
    let hasInfected = 0;
    this.enemies = shuffledEnemies.map(
        enemyConf => {
            enemyConf.isInfected = hasInfected < WorldSettings.numInfected;
            hasInfected++;
            const positionOnPath = rnd.realInRange(0.1,0.3);
            const infectionRange = 60;
            return new Enemy(this, enemyConf.name, enemyConf.isInfected, enemyConf.duration, positionOnPath, this.debugMode, infectionRange);
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
            const color = this.debugMode ? 0xFFFFFF: undefined; 
            if(obj.name == start){
                let go = this.add.rectangle(obj.x+25, obj.y+10, obj.width ,obj.height, color);
                const center = go.getCenter();
                this.player.go.setPosition(center.x, center.y)
            }
            if(obj.name == goal){
                let go = this.add.rectangle(obj.x+200, obj.y+50, obj.width, obj.height, color);
                this.physics.add.existing(go);
                this.goal = go as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
            }
        }
    )
}


public update(dt: number) {
    this.player.update(dt);
    this.physics.world.collide(this.player.go, this.walls);
    
    this.enemies = this.enemies.filter( enemy => !enemy.isDestroyed);
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
            this.collectablesLeft--;
        }
    )

    this.physics.overlap(this.player.go, this.goal, 
        () => {
            if(this.collectablesLeft == 0 && this.isRunning){
                this.restartScreen("Victory");
            }
        }
    );

    const esc = this.input.keyboard.addKey("esc");
    if (esc.isDown && this.isRunning) {
        this.restartScreen("Infected");
    }
    
}

private restartScreen(title: string) {
    this.isRunning = false;
    this.player.disabled = true;
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.add.text(
        screenCenterX,
        screenCenterY-200,
        title,
        {fontSize: '64px', align:"center"}
    ).setOrigin(0.5);

    const menuButton = this.add.text(
        screenCenterX,
        screenCenterY-130,
        'Main Menu',
        { fill: '#0f0', fontSize:'30px', align:"center"}
    );
    menuButton
        .setInteractive()
        .on("pointerover", () => menuButton.setStyle({ fill: '#ff0'}))
        .on('pointerout', () =>  menuButton.setStyle({ fill: '#0f0'}))
        .on('pointerdown', () =>  this.scene.start("MainMenu"))
        .setOrigin(0.5);

    const restartBtn = this.add.text(
        screenCenterX,
        screenCenterY-90,
        'Restart Game',
        { fill: '#0f0', fontSize:'30px', align:"center"}
    );
    restartBtn
        .setInteractive()
        .on("pointerover", () => restartBtn.setStyle({ fill: '#ff0'}))
        .on('pointerout', () =>  restartBtn.setStyle({ fill: '#0f0'}))
        .on('pointerdown', () =>  this.restart())
        .setOrigin(0.5);  
}

}