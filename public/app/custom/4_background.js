function gjBackground (texture, data, renderer ) {
    var self = this;

    self.width = data.width || texture.width;
    self.height = data.height || texture.height;
    self.initVelocity = data.initVelocity ? data.initVelocity : 0;
    self.blur = new PIXI.filters.BlurFilter();
    self.blur.blur = 0;
    self.tilingSprite = new PIXI.extras.TilingSprite(texture, self.width, self.height);
    self.tilingSprite.filters = [self.blur];
    if (renderer) {
        self.attach(renderer);
    }
}

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