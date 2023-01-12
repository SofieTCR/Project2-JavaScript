//Variables
var MyCanvas = document.getElementById("MyCanvas"); // link to the canvas
var ctx = MyCanvas.getContext("2d"); // set the canvas to 2d mode
var CanvasDimensions = [];
var Gameobjects = []; //each gameobject is structured as follows: 0:name, 1:type, 2:PositionX, 3:PositionY, 4:SizeX, 5:SizeY
var ObstacleIMG = new Image();
var SpriteIndex;
var Debug = false;

//temp vars
var ObstacleSize = [312, 129];
var sprite = CreateGameObject("My Sprite", "Sprite", 300, 180, 30, 30);




//Interupts
setInterval(fixedUpdate, 50); // Auto refresh
document.addEventListener("keydown", function(uitlezen) {
    PressedKey = PressedKey || [];
    PressedKey[uitlezen.keyCode] = true;
});
document.addEventListener("keyup", function(uitlezen) {
    PressedKey[uitlezen.keyCode] = false;
});

//Functions
function fixedUpdate() {
    ctx.clearRect(0,0, CanvasDimensions[0], CanvasDimensions[1]); //Clear the screen
    for (let index = 0; index < Gameobjects.length; index++) {
        DrawGameObject(Gameobjects[index])
    }   
}

function onLoad() {
    CanvasDimensions[0] = MyCanvas.offsetWidth;
    CanvasDimensions[1] = MyCanvas.offsetHeight;
    ObstacleIMG.src = "assets/SofieGame Obstacle.png";
    //Gameobjects.push(sprite);
    CreateRandomObstacles(true, 10, 50);

}    

function DrawGameObject(InputObject) {
    if (Debug) {console.log("Drawing GameObject: " + InputObject[0]);}
    switch (InputObject[1]) {
        case "Obstacle":
            ctx.drawImage(ObstacleIMG, InputObject[2], InputObject[3], InputObject[4], InputObject[5]);
            break;
        case "Sprite":
            ctx.fillStyle = "green";
            ctx.fillRect(InputObject[2], InputObject[3], InputObject[4], InputObject[5])
            break;
        default:
            break;
    }
}

function CreateGameObject(name, type, PositionX, PositionY, SizeX, SizeY)
{
    var ReturnObject = [];
    ReturnObject.push(name);
    ReturnObject.push(type);
    ReturnObject.push(PositionX);
    ReturnObject.push(PositionY);
    ReturnObject.push(SizeX);
    ReturnObject.push(SizeY);
    return ReturnObject;
}

function CreateRandomObstacles(DoRandomAmmount, Amount, Upperlimit)
{
    if (DoRandomAmmount) {
        Amount = Math.floor(Math.random()*Upperlimit);
    }
    for (let index = 0; index < Amount; index++) {
        var SizeDivide = Math.random()*4 + 2;
        var Position = [(CanvasDimensions[0] - (ObstacleSize[0]* 1/SizeDivide)) * Math.random(), (CanvasDimensions[1] - (ObstacleSize[1]* 1/SizeDivide)) * Math.random()];
        var GeneratedObstacle = CreateGameObject("Obstacle" + (index+1), "Obstacle", Position[0], Position[1], ObstacleSize[0]/SizeDivide, ObstacleSize[1]/SizeDivide);
        Gameobjects.push(GeneratedObstacle);
    }
}

//Code to execute uppon loading the page
onLoad();