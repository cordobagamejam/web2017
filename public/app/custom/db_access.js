// var URL = 'http://localhost:3000/score';
var URL = location.protocol+'//'+location.host+'/score'

// Objeto scoreService
    var scoreService = {
        getScore : _getScore,
        setScore : _setScore
    }

// Get the score from the server trought AJAX
    function _getScore(){
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(this.responseText);
                
                // Create element/s for the ranking
                for(var i = 0; i < result.length; i++){
                    var para = document.createElement("p");
                    var t = document.createTextNode(result[i].name+': '+result[i].score);
                    para.appendChild(t);
                    document.getElementById('score').appendChild(para);
                }
            }
        };
        request.open("GET", '/score', true);
        request.send();
    }
// Set new score in db
    function _setScore(paramName, paramValue){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "/score", true);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify({name:"Alkachito", score:"554444"}))
    }

_setScore('chafa', 200);
// setScore('chafa', Math.random());
_getScore();