function gjBackground (texture, data, renderer ) {
    var self = this;

    self.width = data.width || texture.width;
    self.height = data.height || texture.height;
    self.initVelocity = data.initVelocity ? data.initVelocity : 0;
    self.blur = new PIXI.filters.BlurFilter();
    self.blur.blur = 0;

    self.position = {
        x: 0,
        y: 0,
    };

    self.tilingSprite = new PIXI.extras.TilingSprite(texture, self.width, self.height);
    self.tilingSprite.filters = [self.blur];
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
        self.tilingSprite.position.x = self.position.x;
    }
    if(p.y) {
        self.position.y = p.y;
        self.tilingSprite.position.y = self.position.y;
    }
};


gjBackground.prototype.update = function (vel) {
    var self = this;
    self.velocity = self.initVelocity * (vel ? vel : 1)  + (vel ? vel : 0);
    self.blur.blurX = vel ? self.velocity * (self.velocity / 10) : 0;
    self.tilingSprite.tilePosition.x -= self.velocity;

};

gjBackground.prototype.attach = function (renderer) {
    var self = this;
    renderer.stage.addChild(self.tilingSprite);
};

gjBackground.prototype.hit  = function(sizePos) {

    var self = this;

    return !(sizePos.position.x > (self.position.x + self.width) ||

    (sizePos.position.x + sizePos.width) < self.position.x ||

    sizePos.position.y > (self.position.y + self.height) ||

    (sizePos.position.y + sizePos.height) < self.position.y);

};