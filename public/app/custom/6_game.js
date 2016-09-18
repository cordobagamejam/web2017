var renderer = new gjRenderer('main');
var enemy = [];
var yetiTexture;

var socket = io();
var player;

PIXI.loader
    .add('texture', 'assets/p2.png')
    .add('yeti', 'assets/yeti.png')
    .add('texture2', 'assets/background.png')
    .load(onLoadedCallback);


function onLoadedCallback(loader, resources) {
    customBg = new gjBackground(resources.texture2.texture, {width: renderer.width, initVelocity: 0.3} , renderer);
    customBg2 = new gjBackground(resources.texture.texture, {width: renderer.width}, renderer);

    yetiName = prompt('Elija un nombre','Jugador1');

    yetiTexture = resources.yeti.texture;

    player = new gjPlayer(yetiName, yetiTexture, {type: CGJ.players.type.PLAYABLE}, renderer);
    socket.emit('add user', yetiName);

    customBg.tilingSprite.position.y = 50;
    customBg2.tilingSprite.position.y = 295;

    renderer.doLoop(gameUpdate);
}


function gameUpdate() {
    customBg.update(player.velocity.running ? player.velocity.actual : 0);
    customBg2.update(player.velocity.running ? player.velocity.actual : 0);

    if(player.velocity.running) {
        if(player.sprite.position.x > renderer.width * 0.3) {
            renderer.stage.position.x -= player.velocity.actual;
            customBg.tilingSprite.position.x += player.velocity.actual;
            customBg2.tilingSprite.position.x += player.velocity.actual;
        }
    }
    player.update(socket);
}

