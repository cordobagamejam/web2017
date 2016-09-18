var renderer = new gjRenderer('main');
var socket = io();

var playerTexture;

var player;
var enemy = [];

var background = {};
var obj = [];



PIXI.loader
    .add('ground', 'assets/p2.png')
    .add('air', 'assets/background.png')
    .add('player', 'assets/yeti.png')
    .add('obj','assets/obj.png')
    .load(onLoadedCallback);


function onLoadedCallback(loader, resources) {
    background.air = new gjBackground(resources.air.texture, {width: renderer.width, initVelocity: 0.3} , renderer);
    background.ground = new gjBackground(resources.ground.texture, {width: renderer.width}, renderer);

    for (var i = 0; i < 50; i++) {
        obj[i] = new gjBackground(resources.obj.texture, { canHit: true}, renderer);
        obj[i].setPosition({y: 235, x: (i * 200) + Math.random() * 20 });
    }

    var name = prompt('Elija un nombre','Jugador1');

    playerTexture = resources.player.texture;

    player = new gjPlayer(name, playerTexture, {type: CGJ.players.type.PLAYABLE}, renderer, socket);

    background.air.setPosition({y: 50});
    background.ground.setPosition({y: 295});

    renderer.doLoop(gameUpdate);
}


function gameUpdate() {
    background.air.update(player.velocity.running ? player.velocity.actual : 0);
    background.ground.update(player.velocity.running ? player.velocity.actual : 0);


    for (var i = 0; i < 50; i++) {
        obj[i].update(null, {x: player.position.x , y: player.position.y, width: renderer.width + player.position.x,  height: renderer.height + player.position.y});
    }

    if(player.velocity.running) {
        if(player.sprite.position.x > renderer.width * 0.3) {
            renderer.stage.position.x -= player.velocity.actual;
            background.air.setPosition({x : background.air.position.x + player.velocity.actual});
            background.ground.setPosition({x : background.ground.position.x + player.velocity.actual});
        } else {
            for (var i = 0; i < 50; i++) {
                obj[i].setPosition({x : obj[i].position.x - player.velocity.actual});
            }
        }
    }

    player.update(socket);
}

