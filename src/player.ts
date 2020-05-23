import * as Phaser from 'phaser'

export class Player{
    private scene: Phaser.Scene;
    go: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };

    constructor(scene: Phaser.Scene){
        this.scene = scene;
        let go = this.scene.add.rectangle(200, 200, 30, 30, 0xFFFFFF);
        this.scene.physics.add.existing(go);
        this.go = go as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    }

    update(dt){
        const cursorKeys = this.scene.input.keyboard.createCursorKeys();
        if (cursorKeys.up.isDown) {
            this.go.body.setVelocityY(-500);
          } else if (cursorKeys.down.isDown) {
            this.go.body.setVelocityY(500);
          } else {
            this.go.body.setVelocityY(0);
          }
          
          if (cursorKeys.right.isDown) {
            this.go.body.setVelocityX(500);
          } else if (cursorKeys.left.isDown) {
            this.go.body.setVelocityX(-500);
          } else {
            this.go.body.setVelocityX(0);
          }
          // console.log(this.getPos());
    }

    getPos(){
        return this.go.body.position;
    }
}