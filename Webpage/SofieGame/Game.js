//Variables
var MyCanvas = document.getElementById("MyCanvas"); // link to the canvas
var ctx = MyCanvas.getContext("2d"); // set the canvas to 2d mode
var CanvasDimensions = [];
var Gameobjects = []; //GameObject[0] = name, 1 = type, 2 = posx, 3 = posy, 4 = sizex, 5 = sizey
var Obstacle = new Image();
var Debug = true;

//temp vars
var ObstacleSize = [312, 129];
var obstcl = ["test obstacle", "Obstacle", 40, 60, ObstacleSize[0]/3, ObstacleSize[1]/3];


//Functions
setInterval(fixedUpdate, 50); // Auto refresh

function fixedUpdate() {
    ctx.clearRect(0,0, CanvasDimensions[0], CanvasDimensions[1]);
    DrawGameObject(obstcl);

}

function onLoad() {
    CanvasDimensions[0] = MyCanvas.MyCanvas;
    CanvasDimensions[1] = MyCanvas.offsetHeight;
    Obstacle.src = "assets/SofieGame Obstacle.png";
}    

function DrawGameObject(GameObject) {
    if (Debug) {console.log("Drawing GameObject: " + GameObject[0]);}
    switch (GameObject[1]) {
        case "Obstacle":
            ctx.drawImage(Obstacle, GameObject[2], GameObject[3], GameObject[4], GameObject[5])
            break;
        default:
            break;
    }

}





//Code to execute uppon loading the page
onLoad();