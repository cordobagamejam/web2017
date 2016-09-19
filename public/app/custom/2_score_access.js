var URL = location.protocol+'//'+location.host+'/score'

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


function _attach(result, scoreID) {
    // Create element/s for the ranking

    var parent = document.getElementById(scoreID);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    for(var i = 0; i < result.length; i++){
        var para = document.createElement('li');
        var t = document.createTextNode(result[i].name+': '+result[i].score);
        para.appendChild(t);
        parent.appendChild(para);
    }
}

//scoreService.setScore('chafa', Math.floor(Math.random()*100));
scoreService.getScore('score');