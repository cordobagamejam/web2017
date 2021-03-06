/**
 * Player object
 * @param name
 * @param texture
 * @param data
 */

function gjPlayer (name, texture, data, renderer, socket) {
    // se crea el sprite
    var self = this;
    self.sprite = new PIXI.Sprite(texture);
    self.width = Number(self.sprite.width);
    self.height = Number(self.sprite.height);
    self.alive = true;
    self.name = name;
    //se crea el nombre
    if (name) {
        self.text = new PIXI.Text(name);
        var style = {font:'bold 10px Arial', fill:'green', align:'center'};
        self.text.style = style;
    }
    //se asigna configuraciones
    self.data = data;
    if (data) {
        self.id = data.id ? data.id : CGJ.players.default_id;
        self.sprite.alpha = data.type === CGJ.players.type.ENEMY ? CGJ.players.alpha.ENEMY : CGJ.players.alpha.PLAYABLE;
        if(self.data.type == CGJ.players.type.PLAYABLE) {
            gjPlayer.prototype.controls = controls;
            self.controls(self, renderer.name);
        }
    }
    self.initPosition({x:CGJ.players.type.PLAYABLE ? CGJ.players.default_position.left : -100, y: CGJ.players.default_position.floor});
    //se atachea a una escena
    if (renderer) {self.attach(renderer);}
    self.socket = socket;
    if(self.socket) {self.socket.emit('add user', self.name);}
}

// constantes
gjPlayer.prototype.velocity = {
    running: false,
    fast: false,
    actual: 0,
    max: CGJ.players.velocity.max,
    min: CGJ.players.velocity.min
};

gjPlayer.prototype.acceleration = {
    increase: CGJ.players.acceleration.increase,
    inertia: CGJ.players.acceleration.inertia
};

gjPlayer.prototype.gravity = {
    actual: 0,
    max: CGJ.gravity.max,
    acceleration: CGJ.gravity.acceleration
};


gjPlayer.prototype.jump = {
    jumping: false,
    force: CGJ.players.jump
};

gjPlayer.prototype.run = function (run, fast) {
    var self = this;
    self.velocity.running = run ? true : false;
    self.velocity.fast = fast ? true : false;
};



//se inicializa la posicion
gjPlayer.prototype.initPosition = function (position) {
    var self  = this;
    if(!position) {return false;}
    self.alive = true;
    self.sprite.position.x = position.x;
    self.sprite.position.y = position.y;
    self.position = position;
    self.text.x = position.x;
    self.floor = position.y;
    self.text.y = position.y + self.sprite.height;
};

gjPlayer.prototype.respawn = function() {
    var self = this;
    self.initPosition({x:CGJ.players.type.PLAYABLE ? CGJ.players.default_position.left : -100, y: CGJ.players.default_position.floor});
};

// salta yeti salta
gjPlayer.prototype.DoJump = function () {
    var self = this;
    if (self.jump.jumping) {return false;}
    self.jump.jumping = true;
};

// agunataaaa
gjPlayer.prototype.stop = function() {
    var self = this;
    self.velocity.running = false;
    self.velocity.actual = 0;
};

// se actualiza a si mismo con los controles locos
gjPlayer.prototype._updateSelf = function (realtime) {
    var self = this;
    //si el loco salta creo gravedad, cosmico
    if(!self.alive) {return;}
    if (self.jump.jumping) {
        self.gravity.actual = self.gravity.actual <= self.gravity.max ? self.gravity.actual + self.gravity.acceleration : self.gravity.max;
        self.sprite.position.y = self.sprite.position.y - (self.jump.force - self.gravity.actual);
        self.position = self.sprite.position;
        if (self.sprite.position.y > self.floor) {
            self.sprite.position.y = self.floor;
            self.position.y = self.sprite.position.y;
            self.jump.jumping = false;
            self.gravity.actual = self.gravity.acceleration;
        }
    }

    //si el loco corre
    if (self.velocity.running) {
        //si el loco corre rapido
        if (self.velocity.fast) {
            self.velocity.actual = self.velocity.actual <= self.velocity.max ? self.velocity.actual + self.acceleration.increase : self.velocity.max;
        } else {
        //si el loco deja de correr rapido
            self.velocity.actual = self.velocity.actual >= self.velocity.min ? self.velocity.actual - self.acceleration.inertia : self.velocity.min;
        }

        //updateame esta posicion
        self.sprite.position.x = self.sprite.position.x + self.velocity.actual;
        self.position = self.sprite.position;
        self.text.x = self.sprite.position.x;
        //se emite coso realtime
        realtime.emit('change position', {x: self.position.x, y: self.position.y});
    }
};

//se updatea la posicion desde el server
gjPlayer.prototype.updateServer = function (playerData) {
    var self = this;
    if(!playerData) {return false}
    self.sprite.position.x = playerData.x;
    self.sprite.position.y = playerData.y;
    self.position = self.sprite.position;
    self.text.x = self.sprite.position.x;
};

// no se lo que quice hacer aca
gjPlayer.prototype.update = function (realtime) {
    var self = this;
    if(!self.alive) {return;}
    if (self.data) {
       if (self.data.type === CGJ.players.type.PLAYABLE) {
           self._updateSelf(realtime)
       }
    }
};

// ataccheame esta
gjPlayer.prototype.attach = function (renderer) {
    var self = this;
    renderer.stage.addChild(self.sprite);
    if(self.text) {renderer.stage.addChild(self.text);}
};

gjPlayer.prototype.die = function() {
    var self = this;
    var score = {x: Math.round(self.position.x), y: Math.round(self.position.y)};
    self.alive = false;
    self.sprite.tint =  0xFFFF00;
    self.stop();


    _try_again('Lose msg', score);
    _setScore(self.name, score);
}

// borra todo
gjPlayer.prototype.destroy = function (renderer) {
    var self = this;
    if(!renderer) {return false};
    renderer.stage.removeChild(self.sprite);
    if(self.text){renderer.stage.removeChild(self.text);}
};