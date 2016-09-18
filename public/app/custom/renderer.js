
function gjRenderer (name, w , h) {
    var self = this;

    if(!name) {
        console.log('cannot init without canvas');
        return false;
    }

    self.name = name;
    self.width  = w  ||  document.body.clientWidth > self.minWidth ? document.body.clientWidth : self.minWidth;
    self.height = h  ||  self.minHeight;

    self.instance   = PIXI.autoDetectRenderer( self.width , self.height,  { transparent: true, view: document.getElementById(self.name) });
    self.stage      = new PIXI.Container();
    self.deltaTime = {
        previous: 0,
        frameDuration: 1000 / this.fps,
        lag : 0
    };
    self.onResize();
}

//set fps at 60
gjRenderer.prototype.fps = 60;

gjRenderer.prototype.minHeight = 300;
gjRenderer.prototype.minWidth = 1000;


gjRenderer.prototype.onResize = function(w, h) {
    var self = this;

    window.onresize = function() {
        self.width  = w || document.body.clientWidth > self.minWidth ? document.body.clientWidth : self.minWidth;
        self.height = h ||  self.minHeight;
        self.instance.resize(self.width , self.height);
    };
};

gjRenderer.prototype.doLoop = function(callback, timestamp) {

    var self = this;

    window.requestAnimationFrame(
        function(timestamp) {
            self.doLoop(callback, timestamp)
    });

    if (!timestamp) { timestamp = 0; }
    var elapsed = timestamp - self.deltaTime.previous;
    if (elapsed > 1000) { elapsed = self.deltaTime.frameDuration };
    self.deltaTime.lag += elapsed;

    while (self.deltaTime.lag >= self.deltaTime.frameDuration) {

        if(callback) {
            callback();
        }

        self.deltaTime.lag -= self.deltaTime.frameDuration;
    }


    self.render();
    self.deltaTime.previous = timestamp;

};

gjRenderer.prototype.render = function () {
    var self = this;
    self.instance.render(self.stage);
};