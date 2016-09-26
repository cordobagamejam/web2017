// This function receive de elem to be changed
    // document.getElementById('Lose msg').style = "display:block";
var toggleTryAgain = true;
function _try_again(elem, callback){

    document.getElementById(elem).style = toggleTryAgain ? "display:inline-block" : "display:none";
    toggleTryAgain = !toggleTryAgain;
}