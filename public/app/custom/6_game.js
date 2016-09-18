var renderer = new gjRenderer('main');
var socket = io();

var playerTexture;

var player;
var enemy = [];

var background = {};
var obj = [];

PIXI.loader
    .add('texture', 'assets/p2.png')
    .add('yeti', 'assets/yeti.png')
    .add('texture2', 'assets/background.png')
    .load(onLoadedCallback);


function onLoadedCallback(loader, resources) {
    background.ground = new gjBackground(resources.texture2.texture, {width: renderer.width, initVelocity: 0.3} , renderer);
    background.air = new gjBackground(resources.texture.texture, {width: renderer.width}, renderer);

    var name = prompt('Elija un nombre','Jugador1');

    playerTexture = resources.yeti.texture;

    player = new gjPlayer(name, playerTexture, {type: CGJ.players.type.PLAYABLE}, renderer, socket);

    background.ground.setPosition({y: 50});
    background.air.setPosition({y: 295});

    renderer.doLoop(gameUpdate);
}


function gameUpdate() {
    background.ground.update(player.velocity.running ? player.velocity.actual : 0);
    background.air.update(player.velocity.running ? player.velocity.actual : 0);

    if(player.velocity.running) {
        if(player.sprite.position.x > renderer.width * 0.3) {
            renderer.stage.position.x -= player.velocity.actual;
            background.ground.setPosition({x : background.ground.position.x + player.velocity.actual});
            background.air.setPosition({x : background.air.position.x + player.velocity.actual});
        }
    }
    player.update(socket);
}

