function gjBackground (texture, data, renderer ) {
    var self = this;

    self.width = data.width || texture.width;
    self.height = data.height || texture.height;
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
    } else {
        self.sprite = new PIXI.Sprite(texture);
        self.sprite.filters = [self.blur];

    }
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
        self.position.x = p.x;
        self.sprite.position.x = self.position.x;
    }
    if(p.y) {
        self.position.y = p.y;
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
        if(!self.hit(rect)) {
            self.sprite.visible = false;
        }
    }

};

gjBackground.prototype.attach = function (renderer) {
    var self = this;
    renderer.stage.addChild(self.sprite);
};

gjBackground.prototype.hit  = function(sizePos) {

    var self = this;

    return !(sizePos.x > (self.x + self.width) ||

    (sizePos.x + sizePos.width) < self.position.x ||

    sizePos.y > (self.position.y + self.height) ||

    (sizePos.y + sizePos.height) < self.position.y);

};