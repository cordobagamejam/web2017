var mongo = require('mongodb').MongoClient;
var db_name = 'mongodb://localhost:27017/cgj';
var LIMIT = 10;

var db_service = {
	getScore: _getScore,
	setScore: _setScore
};


function _setScore(param_name, param_value, callback){

//form saved obj
    var val = {
        name : param_name, 
        score : Number(param_value)
    };

//connect to the db
    mongo.connect(db_name, function(err, db){
        //use score collection
        var col = db.collection('score');

        //insert new document
        col.insertOne(val, function(err, result){
            //on document creation, response the new score list
            callback(result);
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
	    //find 10 top users sorted by score 
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

