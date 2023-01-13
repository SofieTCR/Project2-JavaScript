//Variables
var MyCanvas = document.getElementById("MyCanvas"); // link to the canvas
var ctx = MyCanvas.getContext("2d"); // set the canvas to 2d mode
var CanvasDimensions = [];
var PressedKey;
var SpriteSpeed = 5;
var Gameobjects = []; //each gameobject is structured as follows: 0:name, 1:type, 2:PositionX, 3:PositionY, 4:SizeX, 5:SizeY
var ObstacleIMG = new Image();
var SpriteIndex;
var Debug = false;

//temp vars
var ObstacleSize = [312, 129];
var sprite = CreateGameObject("My Sprite", "Sprite", 300, 180, 30, 60);




//Interupts
setInterval(fixedUpdate, 50); // Auto refresh
document.addEventListener("keydown", function(ReadKey) {
    PressedKey = PressedKey || [];
    PressedKey[ReadKey.keyCode] = true;
});
document.addEventListener("keyup", function(ReadKey) {
    PressedKey[ReadKey.keyCode] = false;
});

//Functions
function fixedUpdate() {
    ctx.clearRect(0,0, CanvasDimensions[0], CanvasDimensions[1]); //Clear the screen
    SpriteMovement();

    for (let index = 0; index < Gameobjects.length; index++) {
        if (Gameobjects[index][1] == "Obstacle") {
            DetectCollision(Gameobjects[SpriteIndex], Gameobjects[index])
        }
    }

    for (let index = 0; index < Gameobjects.length; index++) {
        DrawGameObject(Gameobjects[index])
    }   
}

function onLoad() {
    CanvasDimensions[0] = MyCanvas.offsetWidth - parseInt(MyCanvas.style.borderRightWidth) * 2;
    CanvasDimensions[1] = MyCanvas.offsetHeight - parseInt(MyCanvas.style.borderBottomWidth) * 2;
    ObstacleIMG.src = "assets/SofieGame Obstacle.png";
    Gameobjects.push(sprite);
    CreateRandomObstacles(true, 2, 50);
    GetSpriteIndex(Gameobjects);
}    

function GetSpriteIndex(list) {
    for (let index = 0; index < list.length; index++) {
        if (Gameobjects[index][1] == "Sprite") {
            SpriteIndex = index;
            if (Debug) {console.log("Sprite Object Index: " + index);}
        }
    }
}

function SpriteMovement() {
    if (PressedKey && PressedKey[38]) {
        Gameobjects[SpriteIndex][3] = Gameobjects[SpriteIndex][3] - SpriteSpeed;
    }
    if (PressedKey && PressedKey[40]) {
        Gameobjects[SpriteIndex][3] = Gameobjects[SpriteIndex][3] + SpriteSpeed;
    }
    if (PressedKey && PressedKey[39]) {
        Gameobjects[SpriteIndex][2] = Gameobjects[SpriteIndex][2] + SpriteSpeed;
    }
    if (PressedKey && PressedKey[37]) {
        Gameobjects[SpriteIndex][2] = Gameobjects[SpriteIndex][2] - SpriteSpeed;
    }
    switch (true) {
        case Gameobjects[SpriteIndex][3] < 0 :
            Gameobjects[SpriteIndex][3] = 0;
            break;

        case Gameobjects[SpriteIndex][3] > CanvasDimensions[1] - Gameobjects[SpriteIndex][5] :
            Gameobjects[SpriteIndex][3] = CanvasDimensions[1] - Gameobjects[SpriteIndex][5];
            break;

        case Gameobjects[SpriteIndex][2] < 0 :
            Gameobjects[SpriteIndex][2] = 0;
            break;

        case Gameobjects[SpriteIndex][2] > CanvasDimensions[0] - Gameobjects[SpriteIndex][4] :
            Gameobjects[SpriteIndex][2] = CanvasDimensions[0] - Gameobjects[SpriteIndex][4];
            break;

        default:
            break;
    }
}

function DetectCollision(GameObject1, GameObject2) { //GameObject1 is the movable object, GameObject2 is the static one.
        if (GameObject1[2] + GameObject1[4] > GameObject2[2] && GameObject1[2] < GameObject2[2] + GameObject2[4] && GameObject1[3] + GameObject1[5] > GameObject2[3] && GameObject1[3] < GameObject2[3] + GameObject2[5]) {
            if (Math.min(Math.abs(GameObject1[2] + GameObject1[4] - GameObject2[2]), Math.abs(GameObject2[2] + GameObject2[4] - GameObject1[2])) < Math.min(Math.abs(GameObject1[3] + GameObject1[5] - GameObject2[3]), Math.abs(GameObject2[3] + GameObject2[5] - GameObject1[3]))) {
                if (Math.abs(GameObject1[2] + GameObject1[4] - GameObject2[2]) < Math.abs(GameObject2[2] + GameObject2[4] - GameObject1[2])) {
                    GameObject1[2] = GameObject2[2] - GameObject1[4];
                }
                else {
                    GameObject1[2] = GameObject2[2] + GameObject2[4];
                }
            }
            else {
                if (Math.abs(GameObject1[3] + GameObject1[5] - GameObject2[3]) < Math.abs(GameObject2[3] + GameObject2[5] - GameObject1[3])) {
                    GameObject1[3] = GameObject2[3] - GameObject1[5];
                }
                else {
                    GameObject1[3] = GameObject2[3] + GameObject2[5];
                }
            }
        }  //AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH, This function was so confusing for my brain. But it works so that's good          
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