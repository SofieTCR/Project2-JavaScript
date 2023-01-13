document.onkeydown = detectKey;

function detectKey(e) {
    var posleft = document.getElementById("character").offsetLeft;

    e = e || windown.event;

    if (e.keyCode == "37") {
        document.getElementById("character").style.left = (posleft-20)+"px";
    }
    else if (e.keyCode == "39") {
        document.getElementById("character").style.left = (posleft+20)+"px";
    }
}