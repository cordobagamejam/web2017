// This function receive de elem to be changed
    // document.getElementById('Lose msg').style = "display:block";
var toggleTryAgain = true;
function _try_again(elem, score, callback){

    document.getElementById(elem).style = toggleTryAgain ? "display:inline-block" : "display:none";
    var stag = document.getElementById('retry__score');
    while (stag.firstChild) {
        stag.removeChild(stag.firstChild);
    }

    var para = document.createElement('div');
    var t = document.createTextNode(score.x);
    para.appendChild(t);
    stag.appendChild(para);


    toggleTryAgain = !toggleTryAgain;
    document.getElementById('retry_button').focus();
}