// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var realtime = require('./server/realtime');
var db_service = require('./server/score');
var bodyParser = require('body-parser')

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());
app.get('/', function(req, res){
  res.sendfile(__dirname + '/dist/index.html');
});

var numUsers = 0;
realtime(io, numUsers, db_service);


//on try to check score, return scored array
app.get('/score', function(req, res){
  db_service.getScore(function(results) {
      res.send(results);
  });
});

app.get('/lastDistance', function(req, res){
	db_service.getLastDistance(function(results) {
  		res.send(results);
	});
});

//create new score
app.post('/score', function(req, res){
    //check if username exist
    if(req.body.name){
        //create and response new results
        db_service.setScore(req.body.name, req.body.score || 0, function(docs){
            res.send(docs);
        });
    }
    else {
        //reject DB document creation
        res.status(400).send('Error, se necesita nombre: {"name": "YOUR_NAME", "score": Number("YOUR_SCORE")}');
    }
});

