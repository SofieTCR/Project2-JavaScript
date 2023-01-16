//Variables
var MyCanvas = document.getElementById("MyCanvas"); // link to the canvas
var ctx = MyCanvas.getContext("2d"); // set the canvas to 2d mode
var CanvasDimensions = [];
var PressedKey;
var SpriteSpeed = 5;
var Gameobjects = []; //each gameobject is structured as follows: 0:name, 1:type, 2:PositionX, 3:PositionY, 4:SizeX, 5:SizeY 6:Colour 7:Font, parameter
// Accepted Types: Sprite, Obstacle, StaticCollidibleObject, StaticNonCollidibleObject, Interactible, Text
var ObstacleIMG = new Image();
var ObstacleSize = [312, 129];
var KeyIMG = new Image();
var Keysize = [83, 83];
var SpriteIndex;
var Debug = false;

//temp vars




//Interupts
setInterval(fixedUpdate, 50); // Auto refresh
document.addEventListener("keydown", function(ReadKey) {
    PressedKey = PressedKey || [];
    PressedKey[ReadKey.keyCode] = true;
});
document.addEventListener("keyup", function(ReadKey) {
    PressedKey = PressedKey || [];
    PressedKey[ReadKey.keyCode] = false;
});

//Functions
function fixedUpdate() {
    ctx.clearRect(0,0, CanvasDimensions[0], CanvasDimensions[1]); //Clear the screen
    SpriteMovement();

    for (let index = 0; index < Gameobjects.length; index++) {
        if (Gameobjects[index][1] == "Obstacle" || Gameobjects[index][1] == "StaticCollidibleObject") {
            //check if we're colliding with anything
            if (DetectCollision(Gameobjects[SpriteIndex], Gameobjects[index])) {
                FixCollision(Gameobjects[SpriteIndex], Gameobjects[index]); //Move the sprite out of the collision
            }
        }
    }

    for (let index = 0; index < Gameobjects.length; index++) {
        DrawGameObject(Gameobjects[index])
    }   
}

function onLoad() {
    CanvasDimensions[0] = MyCanvas.offsetWidth - parseInt(MyCanvas.style.borderRightWidth) * 2;
    CanvasDimensions[1] = MyCanvas.offsetHeight - parseInt(MyCanvas.style.borderBottomWidth) * 2;
    CreateRandomObstacles(true, 0, 50);
    ReadyCanvas();
    GetSpriteIndex(Gameobjects);
}    

function ReadyCanvas() {
    ObstacleIMG.src = "assets/SofieGame Obstacle.png";
    KeyIMG.src = "assets/SofieGame Key.png";

    Gameobjects.push(CreateGameObject("My Sprite", "Sprite", 300, 180, 30, 60, "green")); // create sprite

    Gameobjects.push(CreateGameObject("Scoreboard Border", "StaticCollidibleObject", 0, 35, 60, 4, "black")); // Scoreboard
    Gameobjects.push(CreateGameObject("Scoreboard Border", "StaticCollidibleObject", 60, 0, 4, 39, "black"));
    Gameobjects.push(CreateGameObject("Scoreboard Border", "StaticCollidibleObject", 0, 0, 60, 35, "#ededed"));
    Gameobjects.push(CreateGameObject("Scoreboard Key", "Interactible", 5, 2.5, 30, 30, "", "", KeyIMG));
    Gameobjects.push(CreateGameObject("Scoreboard Counter", "Text", 35, 30, 0, 0, "black", "30px Arial", "0"));

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

        default:
            break;
    }
    switch (true) {
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

function DetectCollision(movableObject, staticObject) {
    // Check if the two objects are overlapping
    if (movableObject[2] + movableObject[4] > staticObject[2] &&
        movableObject[2] < staticObject[2] + staticObject[4] &&
        movableObject[3] + movableObject[5] > staticObject[3] &&
        movableObject[3] < staticObject[3] + staticObject[5]) {
        
        return true;
    }     
    else {
        return false;
    }    
}

function FixCollision(movableObject, staticObject) {
    // Calculate the distance between the objects on the x and y axis
    const xDistance = Math.min(
        Math.abs(movableObject[2] + movableObject[4] - staticObject[2]),
        Math.abs(staticObject[2] + staticObject[4] - movableObject[2])
    );
    const yDistance = Math.min(
        Math.abs(movableObject[3] + movableObject[5] - staticObject[3]),
        Math.abs(staticObject[3] + staticObject[5] - movableObject[3])
    );

    // Determine which axis the collision occurred on
    if (xDistance < yDistance) {
        // The collision occurred on the x-axis
        if (Math.abs(movableObject[2] + movableObject[4] - staticObject[2]) < Math.abs(staticObject[2] + staticObject[4] - movableObject[2])) {
            movableObject[2] = staticObject[2] - movableObject[4];
        }
        else {
            movableObject[2] = staticObject[2] + staticObject[4];
        }
    }
    else {
        // The collision occurred on the y-axis
        if (Math.abs(movableObject[3] + movableObject[5] - staticObject[3]) < Math.abs(staticObject[3] + staticObject[5] - movableObject[3])) {
            movableObject[3] = staticObject[3] - movableObject[5];
        }
        else {
            movableObject[3] = staticObject[3] + staticObject[5];
        }
    }
}

function DrawGameObject(InputObject) {
    if (Debug) {console.log("Drawing GameObject: " + InputObject[0]);}
    switch (InputObject[1]) {
        case "Obstacle":
            ctx.drawImage(ObstacleIMG, InputObject[2], InputObject[3], InputObject[4], InputObject[5]);
            break;
        case "Sprite":
            ctx.fillStyle = InputObject[6];
            ctx.fillRect(InputObject[2], InputObject[3], InputObject[4], InputObject[5]);
            break;
        case "StaticCollidibleObject":
            ctx.fillStyle = InputObject[6];
            ctx.fillRect(InputObject[2], InputObject[3], InputObject[4], InputObject[5]);
            break;
        case "StaticNonCollidibleObject":
            ctx.fillStyle = InputObject[6];
            ctx.fillRect(InputObject[2], InputObject[3], InputObject[4], InputObject[5]);
            break;
        case "Interactible" :
            ctx.drawImage(InputObject[8], InputObject[2], InputObject[3], InputObject[4], InputObject[5]);
            break;
        case "Text" : 
            ctx.fillStyle = InputObject[6];
            ctx.font = InputObject[7];
            ctx.fillText(InputObject[8], InputObject[2], InputObject[3]);
        default:
            break;
    }
}

function CreateGameObject(name, type, PositionX, PositionY, SizeX, SizeY, Colour, Font, parameter)
{
    var ReturnObject = [];
    ReturnObject.push(name);
    ReturnObject.push(type);
    ReturnObject.push(PositionX);
    ReturnObject.push(PositionY);
    ReturnObject.push(SizeX);
    ReturnObject.push(SizeY);
    ReturnObject.push(Colour);
    ReturnObject.push(Font);    
    ReturnObject.push(parameter);
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