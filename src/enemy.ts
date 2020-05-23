import * as Phaser from 'phaser'


export class Enemy{
    go: Phaser.GameObjects.PathFollower & {body: Phaser.Physics.Arcade.Body};
    private scene: Phaser.Scene

    constructor(scene: Phaser.Scene){
        this.scene = scene;
        var path = new Phaser.Curves.Path(this.scene.cache.json.get('enemyPath'));

        var graphics = this.scene.add.graphics().lineStyle(1, 0x2d2d2d, 1);
    
        path.draw(graphics);
    
        var follower = this.scene.add.follower(path, 0, 0, 'enemy');
        const goCenter = follower.getCenter();
        // follower.setOrigin(goCenter.x, goCenter.y);
        this.scene.physics.add.existing(follower, false);
        this.go = follower as Phaser.GameObjects.PathFollower & {body: Phaser.Physics.Arcade.Body};
        this.go.body.setCircle(48, -32, -32);
        this.go.startFollow({
            duration: 8000,
            positionOnPath: true,
            repeat: -1,
            ease: 'Linear'
        });
    }
}