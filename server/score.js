var mongo = require('mongodb').MongoClient;
var db_name = 'mongodb://localhost:27017/cgj';
var LIMIT = 10;
var LIMIT_DIST = 200;
var events = require('events');
var eventEmitter = new events.EventEmitter();
var score_flag = false;

var db_service = {
    getScore: _getScore,
    setScore: _setScore,
    onScoreChange: _onScoreChange,
    getLastDistance : _getLastDistance
};

function _onScoreChange(callback) {
    eventEmitter.on('scoreEventChange', function() {
        if(score_flag) {return;}
        score_flag = true;
        console.log('EVENTO INICIALIZADO');
        var intervalo = setTimeout(function(){ 
            _getScore(function(results) {
                callback(results);
                score_flag = false;
            });
        }, 5000);
    });
}

function _getLastDistance(callback) {
    //mongo connect
    mongo.connect(db_name, function(err, db){
        //use score collection
        var col = db.collection('score');
        //find LIMIT_DIST top users sorted by score 
        col.find().sort({'date': -1}).limit(LIMIT_DIST).toArray(function(err, docs) {
            //check if callback is a function to return async result
            if(typeof callback === 'function') {
                callback(docs);
                db.close();
            }
        });
    });
}

function _setScore(paramName, paramScore, paramDistance, callback){
    //form saved obj
    var val = {
        name : paramName,
        distance : paramDistance,
        date : new Date
    };
    if(paramScore){val.score = paramScore;}

//connect to the db
    mongo.connect(db_name, function(err, db){
        //use score collection
        var col = db.collection('score');
        //insert new document
        col.insertOne(val, function(err, result){
            //on document creation, response the new score list
            if (typeof callback === 'function') {callback(result);}
            if (val.score) {eventEmitter.emit('scoreEventChange');}
            //close db
            db.close();
        });
    });
}

function _getScore(callback) {
    //mongo connect
	mongo.connect(db_name, function(err, db){
        //use score collection
		var col = db.collection('score');
	    //find LIMIT top users sorted by score 
	    col.find().sort({'score': -1}).limit(LIMIT).toArray(function(err, docs) {
	    	//check if callback is a function to return async result
            if(typeof callback === 'function') {
                callback(docs);
                db.close();
            }
	    });
        //wait db executions and close after it
	});
}

module.exports = db_service;