function gjBackground (texture, width, height, stage, initVel) {
    var self = this;

    self.width = width || texture.width;
    self.height = height || texture.height;
    self.initVelocity = initVel ? initVel : 0;
    self.blur = new PIXI.filters.BlurFilter();
    self.blur.blur = 0;
    self.tilingSprite = new PIXI.extras.TilingSprite(texture, self.width, self.height);
    self.tilingSprite.filters = [self.blur];
    if (stage) {
        self.attach(stage);
    }
}

gjBackground.prototype.update = function (vel) {
    var self = this;
    self.velocity = self.initVelocity * (vel ? vel : 1)  + (vel ? vel : 0);
    self.blur.blurX = vel ? self.velocity * (self.velocity / 10) : 0;
    self.tilingSprite.tilePosition.x -= self.velocity;
};

gjBackground.prototype.attach = function (stage) {
    var self = this;
    stage.addChild(self.tilingSprite);
};