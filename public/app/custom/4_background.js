function gjBackground (texture, data, renderer ) {
    var self = this;

    self.width = Number(data.width || texture.width);
    self.height = Number(data.height || texture.height);
    self.initVelocity = data.initVelocity ? data.initVelocity : 0;
    self.blur = new PIXI.filters.BlurFilter();
    self.blur.blur = 0;
    self.renderer = renderer;

    self.position = {
        x: 0,
        y: 0,
    };

    self.canHit =  data.canHit || false;

    if(!self.canHit) {
        self.sprite = new PIXI.extras.TilingSprite(texture, self.width, self.height);
        self.sprite.filters = [self.blur];
        self.visible = true;
    } else {
        self.sprite = new PIXI.Sprite(texture);
        self.sprite.filters = [self.blur];
        self.visible = false;
    }

    self.sprite.visible = self.visible;

    if (renderer) {
        self.attach(renderer);
    }

}


gjBackground.prototype.setPosition = function (pos) {
    var self = this;
    var p = {
        x : pos.x || self.position.x || 0,
        y:  pos.y || self.position.y || 0
    };


    if(p.x) {
        self.position.x = Number(p.x);
        self.sprite.position.x = self.position.x;
    }
    if(p.y) {
        self.position.y = Number(p.y);
        self.sprite.position.y = self.position.y;
    }
};


gjBackground.prototype.update = function (vel, rect) {
    var self = this;

    self.velocity = self.initVelocity * (vel ? vel : 1)  + (vel ? vel : 0);
    self.blur.blurX = vel ? self.velocity * (self.velocity / 10) : 0;

    if(!self.canHit) {
        self.sprite.tilePosition.x -= self.velocity;
    } else {

        var pos = self.position;
        if((pos.x + self.width ) < rect.x  || (pos.x + self.width) > rect.width) {
            self.visible = false;
        } else {
            self.visible = true;
        }

        self.sprite.visible = self.visible

    }

};



gjBackground.prototype.attach = function (renderer) {
    var self = this;
    renderer.stage.addChild(self.sprite);
};

gjBackground.prototype.hit  = function(player) {

    if(!player.alive) {
        return;
    }

    var sizePos = {x: player.position.x, y: player.position.y, width: player.width, height: player.height};
    var self = this;

        return !(self.position.x > (sizePos.x + sizePos.width) ||

        (self.position.x + self.width) < sizePos.x ||

        sizePos.y > (self.position.y + self.height) ||

        (sizePos.y + sizePos.height) < self.position.y);


};

