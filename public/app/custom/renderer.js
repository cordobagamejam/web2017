
function ntRenderer (name, w , h) {
    var self = this;

    if(!name) {
        console.log('cannot init without canvas');
        return false;
    }

    self.name = name;
    self.width  = w  ||  document.body.clientWidth > self.minWidth ? document.body.clientWidth : self.minWidth;
    self.height = h  ||  document.body.clientHeight > self.minHeight ? document.body.clientHeight : self.minHeight;

    self.instance   = PIXI.autoDetectRenderer( self.width , self.height,  { transparent: true, view: document.getElementById(self.name) });
    self.stage      = new PIXI.Container();

    self.onResize();
}

//set fps at 60
ntRenderer.prototype.fps = 60;

ntRenderer.prototype.minHeight = 500;
ntRenderer.prototype.minWidth = 1000;


ntRenderer.prototype.onResize = function(w, h) {
    var self = this;

    window.onresize = function() {
        self.width = w  || document.body.clientWidth > self.minWidth ? document.body.clientWidth : self.minWidth;
        self.height = h ||  document.body.clientHeight > self.minHeight ? document.body.clientHeight : self.minHeight;
        self.instance.resize(self.width , self.height);
    };
};

ntRenderer.prototype.render = function () {
    var self = this;
    self.instance.render(self.stage);
};