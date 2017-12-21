// We create a global game world
var game = new Phaser.Game(800,600, Phaser.CANVAS,'gamediv');

var galaxy;
var bgv;
var player;
var cursors;
var bullets;
var fireButton;
var aliens;
var score = 0;
var scoreText;
var winText;
var bulletTime = 0;
var mainState = {
  //preload funtion which loads before the game starts.
  preload:function(){

    // load the images here
      game.load.image('galaxy', "assets/galaxy.png");  //setting an ID for the image in assets
      game.load.image('player', "assets/rocket.png");
      game.load.image('bullet', "assets/bullet.png");
      game.load.image('alien', "assets/alien.png");
      game.load.image('kaboom', "assets/explosion_ani.gif");
  },
  create:function(){
      galaxy = game.add.tileSprite(0,0,800,600,'galaxy');
      bgv = 2;
      player = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'player');
      game.physics.enable(player,Phaser.Physics.ARCADE);

      cursors=game.input.keyboard.createCursorKeys();

      bullets=game.add.group();   // adding bullet image to the group as wee need more bullets to fire from player
      bullets.enableBody = true;  //Enabling the bullet body
      bullets.physicsBodyType = Phaser.Physics.ARCADE;  //Adding physics to the bullet body
      bullets.createMultiple(30, 'bullet');      //
      bullets.setAll('anchor.x', 0.5);
      bullets.setAll('anchor.y', 1);
      bullets.setAll('outOfBoundsKill', true);
      bullets.setAll('checkWorldBounds', true);

      fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      // create a group
      aliens = game.add.group();
      // allowe the aliens to be affected by physics
      aliens.enableBody = true;
      //define a type of physics
      aliens.physicsBodyType = Phaser.Physics.ARCADE;
      //create a function
      createAliens();
      scoreString = 'Score : ';
      scoreText = game.add.text(0,550, scoreString , {font: '32px Times', fill: '#fff'});
      winText = game.add.text(200, 100, 'YOU WIN', {font: '32px Arial', fill: '#fff'});

    	winText.visible = false;
      //or
      //game.physics.enable(bullets, Phaser.Physics.ARCADE);
      /*********************************/
      //  An explosion pool
      explosions = game.add.group();
      explosions.createMultiple(50, 'kaboom');
      explosions.forEach(setupInvader, this);

  },
  update:function(){

      game.physics.arcade.overlap(aliens, bullets, collisionHandler, null, this);

      player.body.velocity.x=0;

      galaxy.tilePosition.y += bgv;
      if(cursors.left.isDown){
        player.body.velocity.x = -350;
      }
      if(cursors.right.isDown){
        player.body.velocity.x = 350;
      }
      if(fireButton.isDown){
        fireBullet();
      }
      scoreText.text = 'Score:' + score;

		if(score == 1000){
			winText.visible = true;
			scoreText.visible = false;
		}

   },
}

      //function to calculate bullet time
      function fireBullet(){
        if(game.time.now>bulletTime){
          bullet=bullets.getFirstExists(false);
        if(bullet){
          bullet.reset(player.x + 14,player.y);
          bullet.body.velocity.y = -400;
          bulletTime = game.time.now + 200;
        }
      }
    }

    function createAliens(){
      for(var y = 0; y < 4 ; y++){
        for(var x = 0; x < 10; x++){
          var alien = aliens.create(x*48, y*50, 'alien');
          //set the anchor point of the alien
        //  aliens.anchor.toFixed(0.5,0.5);
           alien.anchor.setTo(0.5,0.5);
      }
    }

    aliens.x = 100;
    aliens.y = 50;

    var tween = game.add.tween(aliens).to({x:200}, 2000, Phaser.Easing.Linear.None,true,0,1000,true);
    tween.onLoop.add(descend, this);

}

function descend(){
  aliens.y += 10;
}

function setupInvader (invader) {

   invader.anchor.x = 0.5;
   invader.anchor.y = 0.5;
   invader.animations.add('kaboom');

}
  function collisionHandler(bullet, alien){

    bullet.kill();
    alien.kill();
    score += 100;
    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);
  }
  // We take the main state of the funtion to initialise the game state.
        game.state.add('mainState', mainState);
        game.state.start('mainState');
