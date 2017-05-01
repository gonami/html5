/**
 * Generated from the Phaser Sandbox
 *
 * //phaser.io/sandbox/EnAJFKxE
 *
 * This source requires Phaser 2.6.2
 */


var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });




function preload() {

    game.load.baseURL = 'http://examples.phaser.io/';
    game.load.crossOrigin = 'anonymous';

    game.load.image('background-starfield', 'assets/games/invaders/starfield.png');
    game.load.image('background-deep-space', 'assets/skies/deep-space.jpg');

    game.load.image('ship', 'assets/sprites/ship.png');
    game.load.image('ship2', 'assets/sprites/shmup-ship.png');

    game.load.image('bullet', 'assets/misc/bullet0.png');
    game.load.image('bullet2', 'assets/sprites/bullet.png');

    game.load.spritesheet('explosion1', 'assets/games/invaders/explode.png', 128, 128);
    game.load.audio('audioExplosion1', 'assets/audio/SoundEffects/explosion.mp3');

    game.load.spritesheet('spinner', 'assets/sprites/bluemetal_32x32x4.png', 32, 32);

    game.load.audio('boden', ['assets/audio/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/audio/bodenstaendig_2000_in_rock_4bit.ogg']);
    game.load.audio('sfx', 'assets/audio/SoundEffects/fx_mixdown.ogg');

}

var background;
var backgroundChanger;
var player;
var enemy;
var bullets;

var cursors;
var fireButton;

var bulletTime = 0;
var bulletTimeOfPlayer2 = 0;
var bullet;
var bulletOfPlayer2;

var explosions;

var fx

function create() {

    background = game.add.tileSprite(0, 0, 800, 600, 'background-starfield');
    music = game.add.audio('boden');
    music.play();

    fx = game.add.audio('sfx');
    fx.allowMultiple = true;

    //available sounds-effect :-)
    fx.addMarker('alien death', 1, 1.0);
    fx.addMarker('boss hit', 3, 0.5);
    fx.addMarker('escape', 4, 3.2);
    fx.addMarker('meow', 8, 0.5);
    fx.addMarker('numkey', 9, 0.1);
    fx.addMarker('ping', 10, 1.0);
    fx.addMarker('death', 12, 4.2);
    fx.addMarker('shot', 17, 1.0);
    fx.addMarker('squit', 19, 0.3);

    //  bullet group for the player1
    bullets = game.add.physicsGroup();
    bullets.createMultiple(32, 'bullet', false);
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    //  bullet group for the player2
    bulletSOfPlayer2 = game.add.physicsGroup();
    bulletSOfPlayer2.createMultiple(32, 'bullet2', false);
    bulletSOfPlayer2.setAll('checkWorldBounds', true);
    bulletSOfPlayer2.setAll('outOfBoundsKill', true);

    player = game.add.sprite(500, 680, 'ship');
    player.scale.setTo(0.5,0.5); //TODO noch nötig???
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true; //???

    enemy = game.add.sprite(150, 50, 'spinner');
    game.physics.arcade.enable(enemy);
    enemy.body.collideWorldBounds = true; //???

    player2 = game.add.sprite(350, 680, 'ship2');
    game.physics.arcade.enable(player2);
    player2.body.collideWorldBounds = true; //???

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    backgroundChanger = game.input.keyboard.addKey(Phaser.Keyboard.A);

    explosions = game.add.group();
    explosions.createMultiple(30, 'explosion1');
    explosions.forEach(setupEnemy, this);

}

function setupEnemy (enemy) {

    enemy.anchor.x = 0.5;
    enemy.anchor.y = 0.5;
    enemy.animations.add('explosion1');

}





var i = 0;

function update () {

    backgroundAction();

    enemyAction();

    player1Action();

    player2Action();

    collisionAction();

}

function collisionAction(){
    //  Run collision
    game.physics.arcade.overlap(bullets, enemy, collisionWithBulletOfPlayer1, null, this);
    game.physics.arcade.overlap(bulletSOfPlayer2, enemy, collisionWithBulletOfPlayer2, null, this);
}

function collisionWithBulletOfPlayer1(){

    fx.play('death');

    bullet.kill();
    enemy.kill();

    createCollision();
}

function collisionWithBulletOfPlayer2(){

    fx.play('death');

    bulletOfPlayer2.kill();
    enemy.kill();

    createCollision();

}


function createCollision(){
    var explosion = explosions.getFirstExists(false);
    explosion.reset(enemy.body.x, enemy.body.y);
    explosion.play('explosion1', 30, false, true);
}

function backgroundAction(){
    //scroll background
    background.tilePosition.y += 1;

    //change background by keyboard A key click
    if(backgroundChanger.isDown)
    {
        changeBackground();
    }
}

function changeBackground(){
    if( i === 0){
        i = 1;
        background.loadTexture("background-deep-space");
    }else{
        background.loadTexture("background-starfield");
        i = 0;
    }
}

function enemyAction() {

    //enemy.body.velocity.x = -100;
    //enemy.body.velocity.y = 100;

    if (cursors.left.isDown)
    {
        enemy.body.velocity.x = -350;
    }
    else if (cursors.right.isDown)
    {
        enemy.body.velocity.x = 350;
    }

    if (cursors.up.isDown)
    {
        enemy.body.velocity.y = -250;
    }
    else if (cursors.down.isDown)
    {
        enemy.body.velocity.y = 250;
    }

}

function player1Action() {

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -400;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 400;
    }

    if (cursors.up.isDown)
    {
        player.body.velocity.y = -300;
    }
    else if (cursors.down.isDown)
    {
        player.body.velocity.y = 300;
    }

    if (fireButton.isDown)
    {
        fx.play('shot');
        fireBullet();
    }

}

function player2Action(){

    game.input.onDown.addOnce(fireBulletOfPlayer2, this);

    if (game.physics.arcade.distanceToPointer(player2, game.input.activePointer) > 8)
    {
        //  Make the object seek to the active pointer (mouse or touch).
        game.physics.arcade.moveToPointer(player2, 300);
    }
    else
    {
        //  Otherwise turn off velocity because we're close enough to the pointer
        player2.body.velocity.set(0);
    }
}


function fireBullet () {

    if (game.time.time > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(player.x + 15, player.y - 12);
            bullet.body.velocity.y = -600;
            bulletTime = game.time.time + 250;
        }
    }
}

function fireBulletOfPlayer2 () {

    fx.play('boss hit');

    if (game.time.time > bulletTimeOfPlayer2)
    {
        bulletOfPlayer2 = bulletSOfPlayer2.getFirstExists(false);

        if (bulletOfPlayer2)
        {
            bulletOfPlayer2.reset(player2.x + 15, player2.y - 12);
            bulletOfPlayer2.body.velocity.y = -600;
            bulletTimeOfPlayer2 = game.time.time + 250;
        }
    }
}















function render () {

}
