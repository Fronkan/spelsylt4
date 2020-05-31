import * as Phaser from 'phaser'


export class Enemy{
    go: Phaser.GameObjects.PathFollower & {body: Phaser.Physics.Arcade.Body};
    isDestroyed: boolean = false;
    isInfected: boolean;
    pathLine: Phaser.GameObjects.Graphics;
    label: Phaser.GameObjects.Text
    circle: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, pathName: string, isInfected: boolean, duration: number, startAt: number = 0, debugMode: boolean = false, infectionRadius: number=48){
        /*
            duration:   How long time it will take the enemy to walk the entier path.
                        This will affect the speed of the enemy.
            startAt:    A number between 0 and 1 which shows where on the path the enemy
                        will start. 0 is the begining and 1 is the very end.
        */
        this.isInfected = isInfected;
        var path = new Phaser.Curves.Path(scene.cache.json.get(pathName));

        var follower = scene.add.follower(path, 0, 0, 'enemy');
        const goCenter = follower.getCenter();
        // follower.setOrigin(goCenter.x, goCenter.y);
        scene.physics.add.existing(follower, false);
        this.go = follower as Phaser.GameObjects.PathFollower & {body: Phaser.Physics.Arcade.Body};
        this.go.body.setCircle(infectionRadius, -32, -32);
        this.circle = scene.add.graphics({"lineStyle":{"color":0xFFFFFF, "width":2}}).strokeCircle(goCenter.x-32, goCenter.y-32, infectionRadius);

        this.go.startFollow({
            duration: duration,
            positionOnPath: true,
            repeat: -1,
            ease: 'Linear',
            startAt: startAt,
            onComplete: this.onFinishedPath
        });

        if (debugMode){
            this.pathLine = scene.add.graphics().lineStyle(1, 0x2d2d2d, 1);   
            path.draw(this.pathLine);
            
            this.label = scene.add.text(this.go.x-(this.go.width/2), this.go.y-(this.go.height/2), pathName, {"fontSize":20, "color":"black", "backgroundColor":"white"});
            if( this.isInfected ){
                this.label.setBackgroundColor("red");
            }
        }
    }

    update(){
        if( this.label){
            this.label.setPosition(this.go.x-(this.go.width/2+10), this.go.y-(this.go.height+20))
        }
        this.circle.setPosition(this.go.x +32, this.go.y +32);
    }

    onFinishedPath() {
        this.go.destroy();
        this.isDestroyed = true;
        if (this.pathLine){
            this.pathLine.destroy()
        }
    }
}