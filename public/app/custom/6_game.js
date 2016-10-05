var renderer = new gjRenderer('main');
var socket = io();
var playerTexture;
var player;
var enemy = [];
var background = {};
var obj = [];
var objlength = 100;

PIXI.loader
    .add('ground', 'assets/p2.png')
    .add('air', 'assets/background.png')
    .add('player', 'assets/yeti.png')
    .add('obj','assets/obj.png')
    .load(onLoadedCallback);

function onLoadedCallback(loader, resources) {
    background.air = new gjBackground(resources.air.texture, {width: renderer.width, initVelocity: 0.3} , renderer);
    background.ground = new gjBackground(resources.ground.texture, {width: renderer.width}, renderer);
    var name = prompt('Elija un nombre','Jugador1');
    playerTexture = resources.player.texture;
    player = new gjPlayer(name, playerTexture, {type: CGJ.players.type.PLAYABLE}, renderer, socket);
    player.run()
    for (var i = 0; i < objlength; i++) {
        obj[i] = new gjBackground(resources.obj.texture, { canHit: true}, renderer, player);
        obj[i].setPosition({y: 235, x: ((i + 1) * 600) });
    }
    background.air.setPosition({y: 50});
    background.ground.setPosition({y: 295});
    renderer.doLoop(gameUpdate);
    document.getElementById('retry_button').onclick = function(){
        player.stop();
        player.initPosition({x: CGJ.players.default_position.left , y: CGJ.players.default_position.floor});
        player.sprite.tint =  0xFFFFFF;

        renderer.stage.position.x = 0;
        background.air.setPosition({x: 0.01, y: 50});
        background.ground.setPosition({x: 0.01, y: 295});

        for (var i = 0; i < objlength; i++) {
            obj[i].setPosition({y: 235, x: ((i + 1) * 600) });
        }


        _try_again('Lose msg', {y: player.position.y, x: player.position.x });
    };
}

function gameUpdate() {
    var vel = player.velocity.running ? player.velocity.actual : 0;
    background.air.update(vel);
    background.ground.update(vel);
        for (var i = 0; i < objlength; i++) {
            obj[i].update(vel ,  {x: -renderer.stage.position.x  , y: 0, width: renderer.width + player.sprite.position.x,  height: renderer.height }, player);
            if(obj[i].hit(player)) {player.die();}
        }
        if(player.velocity.running) {
            if(player.sprite.position.x > renderer.width * 0.3) {
                renderer.stage.position.x -= player.velocity.actual;
                background.air.setPosition({x : background.air.position.x + player.velocity.actual});
                background.ground.setPosition({x : background.ground.position.x + player.velocity.actual});
            } else {
                for (var i = 0; i < objlength; i++) {
                    obj[i].setPosition({x : obj[i].position.x - player.velocity.actual});
                }
            }
        }
    player.update(socket);
}

