var r = new gjRenderer('main');
var enemy = [];
var yetiTexture;

var socket = io();


PIXI.loader
    .add('texture', 'assets/p2.png')
    .add('yeti', 'assets/yeti.png')
    .add('texture2', 'assets/background.png')
    .load(onLoadedCallback);


function onLoadedCallback(loader, resources) {
    customBg = new background(resources.texture2.texture, r.width , undefined, r.stage, 0.3);
    customBg2 = new background(resources.texture.texture, r.width , undefined, r.stage, 0);

    yetiName = prompt('Elija un nombre','Jugador1');

    yetiTexture = resources.yeti.texture;

    yeti = new gjPlayer(yetiName, yetiTexture, {type: CGJ.players.type.PLAYABLE}, r.stage);
    socket.emit('add user', yetiName);

    controls(yeti);

    customBg.tilingSprite.position.y = 50;
    customBg2.tilingSprite.position.y = 295;

    r.doLoop(gameUpdate);
}


function gameUpdate() {
    customBg.update(yeti.velocity.running ? yeti.velocity.actual : 0);
    customBg2.update(yeti.velocity.running ? yeti.velocity.actual : 0);

    if(yeti.velocity.running) {
        if(yeti.sprite.position.x > r.width * 0.3) {
            r.stage.position.x -= yeti.velocity.actual;
            customBg.tilingSprite.position.x += yeti.velocity.actual;
            customBg2.tilingSprite.position.x += yeti.velocity.actual;
        }
    }
    yeti.update(socket);
}

socket.on('user joined', function(data) {
    var newEnemy = new gjPlayer(data.username, yetiTexture, {type: CGJ.players.type.ENEMY, id: data.id}, r.stage);
    enemy.push(newEnemy);
});

socket.on('init users', function(data){

    var users = data.users;
    if(users) {
        var l = users.length;
        if(users.length) {
            for (var i = 0; i < l ; i++) {
                var newEnemy = new gjPlayer(users[i].username, yetiTexture, {type: CGJ.players.type.ENEMY, id: users[i].id}, r.stage);
                var playerData = users[i].playerData;

                if(playerData){
                    newEnemy.initPosition({x: playerData.x, y: playerData.y});
                }

                enemy.push(newEnemy);
            }

        }
    }
});

socket.on('user left', function(data){

    var toRemove = _.findIndex(enemy, {id: data.id});

    if(toRemove >= 0){
        enemy[toRemove].destroy(r.stage);
        enemy.splice(toRemove, 1);
    }
});

socket.on('change position', function(data) {
    var toUpdate = _.find(enemy, {id: data.id});
    if(toUpdate) { toUpdate.updateServer(data.data)}
});
