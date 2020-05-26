import * as Phaser from 'phaser'
import { Enemy } from './enemy';

export class Player{
    private scene: Phaser.Scene;
    private infected: boolean = false;
    private speed: number = 400;
    go: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };

    constructor(scene: Phaser.Scene){
        this.scene = scene;
        let go = this.scene.add.rectangle(200, 200, 30, 30, 0xFFFFFF);
        this.scene.physics.add.existing(go);
        this.go = go as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    }

    update(dt){
      if(this.infected){
        this.go.body.setVelocity(0);
        return;
      }
      const cursorKeys = this.scene.input.keyboard.createCursorKeys();
      if (cursorKeys.up.isDown) {
          this.go.body.setVelocityY(-this.speed);
        } else if (cursorKeys.down.isDown) {
          this.go.body.setVelocityY(this.speed);
        } else {
          this.go.body.setVelocityY(0);
        }
        
        if (cursorKeys.right.isDown) {
          this.go.body.setVelocityX(this.speed);
        } else if (cursorKeys.left.isDown) {
          this.go.body.setVelocityX(-this.speed);
        } else {
          this.go.body.setVelocityX(0);
        }
    }

    infectionCheck(enemy: Enemy){
      if (enemy.isInfected){
        this.infected = true;
        return true;
      }
      return false;
    }

}