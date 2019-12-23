class GameScene extends Phaser.Scene {
  constructor(){
    super({key:'GameScene'});
  }
  preload() {
      this.load.image('m1', 'assets/monster1.png');
      this.load.image('m2', 'assets/monster2.png');
      this.load.image('m3', 'assets/monster3.png');
      this.load.image('m4', 'assets/monster4.png');
      this.load.image('m5', 'assets/monster5.png');
      this.load.image('platform', 'assets/platform.png');
      this.load.image('hero', 'assets/hero.png');
  }

  create() {
      gameState.player = this.physics.add.sprite(225,450,'hero').setScale(0.75);
      const platforms = this.physics.add.staticGroup();
      platforms.create(225,500,'platform').setScale(1,0.5).refreshBody();
      gameState.scoreText = this.add.text(195, 485, 'Score 0',{fontSize: '14px', fill: '#ffffff'});
      gameState.player.setCollideWorldBounds(true);
      this.physics.add.collider(gameState.player, platforms);
      gameState.cursors = this.input.keyboard.createCursorKeys();
      const enemies = this.physics.add.group();
      function enemyPick(){
          const enemies = ['m1','m2','m3','m4','m5']
          var choice = enemies[Math.floor(Math.random()*enemies.length)];
          return choice;
      }
      function enemyGen() {
          const xCoord = Math.random() * 450;
          enemies.create(xCoord, 10, enemyPick());
      }
      const enemyGenLoop = this.time.addEvent({
          delay: 100,
          callback: enemyGen,
          callbackScope: this,
          loop: true,
      });
      this.physics.add.overlap(enemies,platforms,function(enemy){
          enemy.destroy();
          gameState.score += 10;
          gameState.scoreText.setText(`Score: ${gameState.score}`);
      });
      this.physics.add.collider(gameState.player, enemies, () => {
          enemyGenLoop.destroy();
          this.physics.pause();
          this.add.text(180, 250, 'GAME OVER', { fontSize: '15px', fill: '#000000' }).setPadding(5,5,5,5).setShadow(0, 0, '#ffffff', 3);
          this.add.text(152, 270, 'Click to Restart', { fontSize: '15px', fill: '#000000' }).setPadding(5,5,5,5).setShadow(0, 0, '#ffffff', 3);

          // Add your code below:
          this.input.on('pointerup', () => {
              gameState.score = 0;
              this.scene.restart();
          });
      });
      this.physics.add.collider(gameState.player, enemies, ()=>{
          enemyGenLoop.destroy();
          this.physics.pause();
          this.add.text(180, 250, 'GAME OVER', {fontSize: '20px', fill: '#000000'});
          this.add.text(152, 270, 'Click to Restart', {fontSize: '16px', fill: '#000000'});
          this.input.on('pointerup', ()=>{
              gameState.score = 0;
              this.scene.restart();
          });
      });
  }

  update() {
      if (gameState.cursors.left.isDown) {
          gameState.player.setVelocityX(-160);
      } else if (gameState.cursors.right.isDown) {
          gameState.player.setVelocityX(160);
      } else if (gameState.cursors.up.isDown) {
          gameState.player.setVelocityY(-100);
      } else if (gameState.cursors.down.isDown) {
          gameState.player.setVelocityY(160);
      } else {
          gameState.player.setVelocityX(0);
      }
  }
}