//Variables
var MyCanvas = document.getElementById("MyCanvas"); // link to the canvas
var ctx = MyCanvas.getContext("2d"); // set the canvas to 2d mode
var CanvasDimensions = [];
var PressedKey;
var SpriteSpeed = 5;
var Gameobjects = []; //each gameobject is structured as follows: 0:name, 1:type, 2:PositionX, 3:PositionY, 4:SizeX, 5:SizeY 6:Colour 7:Font, 8:parameter
// Accepted Types: Sprite, Obstacle, StaticCollidibleObject, StaticNonCollidibleObject, Interactible, Text, Image
var ObstacleIMG = new Image();
var ObstacleSize = [312, 129];
var KeyIMG = new Image();
var Keysize = [83, 83];
var DoorIMG = new Image();
var SpriteIndex;
var PopupTextIndex;
var ScoreboardCounterIndex;
var Debug = false;
var ObstacleList = [];
var Interacting;
var CollectedKeys = 0;
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

    
    for (let index = 0; index < ObstacleList.length; index++) {
        //check if we're colliding with any obstacles or collidible static objects
        if (DetectCollision(Gameobjects[SpriteIndex], ObstacleList[index])) {
            FixCollision(Gameobjects[SpriteIndex], ObstacleList[index]); //Move the sprite out of the collision
        }        
    }
    NoInteraction = true;
    for (let index = 0; index < Gameobjects.length; index++) {
        if (Gameobjects[index][1] == "Interactible") {
            if (DetectCollision(Gameobjects[SpriteIndex], Gameobjects[index])) {
                if (Debug) { console.log("Sprite is colliding with " + Gameobjects[index][0]); }
                Gameobjects[PopupTextIndex][8] = "Press E to interact with " + Gameobjects[index][0];
                NoInteraction = false;
                if (Interacting && Gameobjects[index][0].includes("Key")) {
                    console.log("Sprite is interacting with " + Gameobjects[index][0]);
                    Gameobjects.splice(index, 1);
                    NoInteraction = true;
                    CollectedKeys++;
                    ReloadIndexes(Gameobjects);
                }
                else if (Interacting && Gameobjects[index][0].includes("Door")) {
                    if (CollectedKeys >= 3) {
                        alert("Congratulations, you made it out!");
                        PressedKey[69] = false;
                        location.reload();
                    }
                    else {
                        alert("Sorry, you're " + (3-CollectedKeys) + " keys short so you cannot leave yet!");
                        PressedKey = [];
                    }
                }
            }
        }
    }
    if (NoInteraction) {
        Gameobjects[PopupTextIndex][8] = "";
    }
    Gameobjects[ScoreboardCounterIndex][8] = CollectedKeys;
    for (let index = 0; index < Gameobjects.length; index++) {
        DrawGameObject(Gameobjects[index])
    }   
}

function onLoad() {
    CanvasDimensions[0] = MyCanvas.offsetWidth - parseInt(MyCanvas.style.borderRightWidth) * 2;
    CanvasDimensions[1] = MyCanvas.offsetHeight - parseInt(MyCanvas.style.borderBottomWidth) * 2;

    // CreateRandomObstacles(true, 0, 50);
    CreateRandomObjects("Obstacle", "Obstacle", ObstacleSize, true, 15, 50, true, 0.15, 0.40); //Generate Obstacles

    CreateRandomObjects("Key", "Interactible", Keysize, false, 3, 0, false, .3, 0, KeyIMG); //Generate Keys

    ReadyCanvas();

    for (let index = 0; index < Gameobjects.length; index++) { //Add all the obstacles to a list for easier use
        if (Gameobjects[index][1] == "Obstacle" || Gameobjects[index][1] == "StaticCollidibleObject") {
            ObstacleList.push(Gameobjects[index]);
        }
    }

    for (let index = 0; index < Gameobjects.length; index++) {
        if(Gameobjects[index][1] == "Interactible") {
            for (let ObstacleIndex = 0; ObstacleIndex < ObstacleList.length; ObstacleIndex++) {
                if (DetectCollision(Gameobjects[index], ObstacleList[ObstacleIndex])) {
                    FixCollision(Gameobjects[index], ObstacleList[ObstacleIndex])
                    console.log("Moving " + Gameobjects[index][0] + " To fix collision with " + ObstacleList[ObstacleIndex][0]);
                }
            }
        }
    }

    ReloadIndexes(Gameobjects);
    // GenerateInteractibleList(Gameobjects);
    // GetSpriteIndex(Gameobjects);
    // GetPopupTextIndex(Gameobjects);
    // GetScoreboardIndex(Gameobjects);
}    

function ReadyCanvas() {
    ObstacleIMG.src = "assets/SofieGame Obstacle.png";
    KeyIMG.src = "assets/SofieGame Key.png";
    DoorIMG.src = "assets/SofieGame Exit Door.png";

    Gameobjects.push(CreateGameObject("Door", "Interactible", 600, 0, 60, 35, "", "", DoorIMG)); // create Exit

    Gameobjects.push(CreateGameObject("PopupText", "Text", CanvasDimensions[0]/2-200, CanvasDimensions[1]*.85, 0, 0, "black", "32px Arial", "")); // create Splash Text

    Gameobjects.push(CreateGameObject("Scoreboard Border", "StaticCollidibleObject", 0, 35, 60, 4, "black")); // Scoreboard
    Gameobjects.push(CreateGameObject("Scoreboard Border", "StaticCollidibleObject", 60, 0, 4, 39, "black"));
    Gameobjects.push(CreateGameObject("Scoreboard Border", "StaticCollidibleObject", 0, 0, 60, 35, "#ededed"));
    Gameobjects.push(CreateGameObject("Scoreboard Key", "Image", 5, 2.5, 30, 30, "", "", KeyIMG));
    Gameobjects.push(CreateGameObject("Scoreboard Counter", "Text", 35, 30, 0, 0, "black", "30px Arial", "0"));

    Gameobjects.push(CreateGameObject("My Sprite", "Sprite", 300, 180, 35, 35, "green")); // create sprite

}

function ReloadIndexes(list) {
    for (let index = 0; index < list.length; index++) {
        if (list[index][1] == "Sprite") {
            SpriteIndex = index;
            if (Debug) {console.log("Sprite Object Index: " + index);}
        }
        if (list[index][0] == "PopupText") {
            PopupTextIndex = index;
            if (Debug) {console.log("PopupText Index: " + index);}
        }
        if (list[index][0] == "Scoreboard Counter") {
            ScoreboardCounterIndex = index;
            if (Debug) {console.log("Scoreboard Counter Index: " + index);}
        }
    }
}


function SpriteMovement() {
    if (PressedKey && PressedKey[87]) {
        Gameobjects[SpriteIndex][3] = Gameobjects[SpriteIndex][3] - SpriteSpeed;
    }
    if (PressedKey && PressedKey[83]) {
        Gameobjects[SpriteIndex][3] = Gameobjects[SpriteIndex][3] + SpriteSpeed;
    }
    if (PressedKey && PressedKey[68]) {
        Gameobjects[SpriteIndex][2] = Gameobjects[SpriteIndex][2] + SpriteSpeed;
    }
    if (PressedKey && PressedKey[65]) {
        Gameobjects[SpriteIndex][2] = Gameobjects[SpriteIndex][2] - SpriteSpeed;
    }
    if (PressedKey && PressedKey[69]) {
        Interacting = true;
    }
    else {
        Interacting = false;
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
        case "Image" :
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

function CreateRandomObstacles(DoRandomAmmount, Amount, Upperlimit) //retired function
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

function CreateRandomObjects(ObjectName, ObjectType, ObjectSize, DoRandomAmmount, MinAmount, MaxAmount, DoRandomSize, MinSize, MaxSize, parameter) {
    var SizeModifier;
    if (DoRandomAmmount) {
        //If a random amount is desired, Generate it and store it in the Minimum Amount parameter.
        MinAmount = Math.max(MinAmount, Math.round(Math.random() * MaxAmount));
    }
    for (let index = 0; index < MinAmount; index++) {
        if (DoRandomSize) {
            //If a random size is desired, Generate it and store it in the size modifier.
            SizeModifier = Math.max(MinSize, Math.random() * MaxSize);
        }
        else {
            SizeModifier = MinSize;
        }
        var Position = [ //Generate a random position between 0 and the maximum width of the canvas minus the size of the object
           Math.round(Math.random() * (CanvasDimensions[0] - ObjectSize[0] * SizeModifier)),
           Math.round(Math.random() * (CanvasDimensions[1] - ObjectSize[1] * SizeModifier))
        ];
        Gameobjects.push(
            CreateGameObject( //Create the Gameobject and push into the list containing all the gameobjects
                ObjectName + (index+1),
                ObjectType,
                Position[0],
                Position[1],
                ObjectSize[0]*SizeModifier,
                ObjectSize[1]*SizeModifier,
                "",
                "",
                parameter
            )
        );
    }
}

//Code to execute uppon loading the page
onLoad();