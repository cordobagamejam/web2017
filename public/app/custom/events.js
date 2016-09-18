socket.on('user joined', function(data) {
    var newEnemy = new gjPlayer(data.username, yetiTexture, {type: CGJ.players.type.ENEMY, id: data.id}, renderer.stage);
    enemy.push(newEnemy);
});

socket.on('init users', function(data){

    var users = data.users;
    if(users) {
        var l = users.length;
        if(users.length) {
            for (var i = 0; i < l ; i++) {
                var newEnemy = new gjPlayer(users[i].username, yetiTexture, {type: CGJ.players.type.ENEMY, id: users[i].id}, renderer.stage);
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
        enemy[toRemove].destroy(renderer.stage);
        enemy.splice(toRemove, 1);
    }
});

socket.on('change position', function(data) {
    var toUpdate = _.find(enemy, {id: data.id});
    if(toUpdate) { toUpdate.updateServer(data.data)}
});