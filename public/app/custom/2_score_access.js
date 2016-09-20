var URL = location.protocol+'//'+location.host+'/score';

// Objeto scoreService
var scoreService = {
    getScore : _getScore,
    setScore : _setScore,
    updateScoreList : _attach
}

// Get the score from the server trought AJAX
function _getScore(scoreID){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText);
            _attach(result, scoreID);
        }
    };
    request.open('GET', URL, true);
    request.send();
}

// Set new score in db
function _setScore(paramName, paramValue){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', URL, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlhttp.send(JSON.stringify({name:paramName, score:paramValue}))
}

// Create element/s for the ranking
function _attach(result, scoreID) {
    var parent = document.getElementById(scoreID);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    for(var i = 0; i < result.length; i++){
        var para = document.createElement('li');
        var t = document.createTextNode(result[i].name+': '+result[i].distance);
        para.appendChild(t);
        parent.appendChild(para);
    }
}

//scoreService.setScore('chafa', Math.floor(Math.random()*100));
scoreService.getScore('score');

function sender(parameters, callback) {
    if(parameters['method'] === undefined){
        parameters['method'] = 'POST';}
    if(parameters['URL'] === undefined){
        parameters['URL'] = String(location.protocol+'//'+location.host+'/score');}
    if(parameters['jsonData'] === undefined){
        parameters['jsonData'] = {};}
    if(parameters['header'] === undefined){
        parameters['header'] = ['Content-Type', 'application/json;charset=UTF-8'];}
    if(parameters['id'] === undefined){
        parameters['id'] = 'score';}
    var xmlhttp = new XMLHttpRequest();
    if(parameters['method'] === 'GET'){
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(this.responseText);
                callback(result, null)
                _attach(result, parameters['id']);
            } else {
                callback(null, error)
            }
        };
        xmlhttp.open('GET', parameters['URL'], true);
        xmlhttp.send();
    } else {
        xmlhttp.open('POST', parameters['URL'], true);
        xmlhttp.setRequestHeader(parameters['header'][0], parameters['header'][1]); // Hay que hacer un while por si son muchos valores del arreglo de headers
        xmlhttp.send(JSON.stringify(parameters['jsonData']))
    }
}