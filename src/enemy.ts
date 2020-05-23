import * as Phaser from 'phaser'


export class Enemy{
    go: Phaser.GameObjects.PathFollower & {body: Phaser.Physics.Arcade.Body};
    isDestroyed: boolean = false;
    isInfected: boolean;
    pathLine: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, pathName: string, isInfected: boolean){
        this.isInfected = isInfected;
        var path = new Phaser.Curves.Path(scene.cache.json.get(pathName));

        this.pathLine = scene.add.graphics().lineStyle(1, 0x2d2d2d, 1);
    
        path.draw(this.pathLine);
    
        var follower = scene.add.follower(path, 0, 0, 'enemy');
        if( this.isInfected ){
            follower.setAlpha(0);
        }
        const goCenter = follower.getCenter();
        // follower.setOrigin(goCenter.x, goCenter.y);
        scene.physics.add.existing(follower, false);
        this.go = follower as Phaser.GameObjects.PathFollower & {body: Phaser.Physics.Arcade.Body};
        this.go.body.setCircle(48, -32, -32);
        this.go.startFollow({
            duration: 8000,
            positionOnPath: true,
            repeat: 0,
            ease: 'Linear',
            onComplete: () => {
                this.go.destroy();
                this.pathLine.destroy();
                this.isDestroyed = true;
            }
        });
    }
}