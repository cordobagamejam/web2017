/**
 * Init controls
 * @param user
 * @returns {boolean}
 */

function controls (user) {

    if (!user) { return false; }

    // add touch controls

    var element = document.getElementById('main-canvas');
    var mc = Hammer(element);

    mc.on(CGJ.controls.touch.RUN, checkPress);
    mc.on(CGJ.controls.touch.JUMP, checkPressUp);

    function checkPress (e) {
        user.run(true, !user.velocity.fast);
    }

    function checkPressUp (e) {
        user.run(true, false);
        user.DoJump();
    }


    //bind keyboard controls
    document.onkeydown = checkKey;
    document.onkeyup = checkKeyUp;


    function checkKeyUp (e) {
        e = e || window.event;
        if (e.keyCode == CGJ.controls.keyboard.RUN.key1 || e.keyCode == CGJ.controls.keyboard.RUN.key2) {
            // right arrow
            user.run(true, false);
        }
    }

    function checkKey(e) {
        e = e || window.event;


        if (e.keyCode == CGJ.controls.keyboard.JUMP.key1 || e.keyCode == CGJ.controls.keyboard.JUMP.key2) {
            // up arrow
            user.run(true, user.velocity.fast);
            user.DoJump();
        }
        else if (e.keyCode == '37') {
            // left arrow
            user.stop();
        }
        else if (e.keyCode == CGJ.controls.keyboard.RUN.key1 || e.keyCode == CGJ.controls.keyboard.RUN.key2) {
            // right arrow
            user.run(true, true);
        }

    }


}


