var context, controller, rectangle, loop, timeout = 0, flag;
var gameIMG = new Image();

context = document.querySelector("canvas").getContext("2d");

context.canvas.height = 700;
context.canvas.width = 1200;
gameIMG.src = "./assets/finishflag2.jpg";


flag = {
    height:100,
    width:100,
    x:1000,
    y:175,
}

platform = {
    height:30,
    width:100,
    x:800,
    y:550,
}
platform2 = {
    height:30,
    width:150,
    x:950,
    y:450,
}
platform3 = {
    height:30,
    width:100,
    x:675,
    y:400,
}
platform4 = {
    height:15,
    width:75,
    x:450,
    y:350,
}
platform5 = {
    height:30,
    width:50,
    x:275,
    y:350,
}
platform6 = {
    height:30,
    width:50,
    x:150,
    y:300,
}
platform7 = {
    height:15,
    width:40,
    x:200,
    y:200,
}
platform8 = {
    height:20,
    width:100,
    x:350,
    y:150,
}
platform9 = {
    height:10,
    width:80,
    x:680,
    y:150,
}
platform10 = {
    height:100,
    width:50,
    x:850,
    y:80,
}
platform11 = {
    height:10,
    width:200,
    x:950,
    y:275,
}


var platforms = [platform, platform2, platform3, platform4, platform5, platform6, platform7, platform8, platform9, platform10, platform11];
var flags= [flag]

rectangle = {
    height:50,
    jumping:true,
    width:30,
    x:30, //bottom left of canvas
    x_velocity:0,
    y:700,
    y_velocity:0
};

controller = {
 // checks if keys are pressed
    left:false,
    right:false,
    up:false,
    keyListener:function(event) {
        
        var key_state = (event.type == "keydown")?true:false;

        switch(event.keyCode) {
            
            case 65: //left key = a
                controller.left = key_state;
            break;
            case 32: //up key = space
                controller.up = key_state;
            break;
            case 68: //right key = d
                controller.right = key_state;
            break;
        }
    }
};

setInterval(jumptimeout, 1);
function jumptimeout() {
    timeout++;
}

loop = function() {
    if (controller.up && rectangle.jumping == false && timeout >= 70 && rectangle.y_velocity == 0) {
        rectangle.y_velocity -= 25;
        rectangle.jumping = true;
        timeout = 0;
    }
    if (controller.left) {
        rectangle.x_velocity -= 10;
    }
    if (controller.right) {
        rectangle.x_velocity += 10;
    }

    rectangle.y_velocity += 1.5; //adds gravity to the jump
    rectangle.x += rectangle.x_velocity; //adds movement to left/right
    rectangle.y += rectangle.y_velocity; //adds movement to up/down
    rectangle.x_velocity *= 0; //friction, makes a max-movement speed
    rectangle.y_velocity *= 0.9; //friction

    //fake collision detection for the jump hitting the bottom ground line
    if (rectangle.y > 700 - 100 - rectangle.height) {
        rectangle.jumping = false;
        rectangle.y = 700 - 100 - rectangle.height; 
        rectangle.y_velocity = 0; //collision makes velocity 0 once it hits something
    }
    //fake collision detection left and right side of the screen
    if (rectangle.x < 0) {
        rectangle.x = 0;
    }
    else if (rectangle.x > 1168) {
        rectangle.x = 1168;
    }
    for (let index = 0; index < platforms.length; index++) {
        if (DetectCollision(platforms[index])) {
            FixCollision(platforms[index]);
        }
        
    }

    //background context
    context.fillStyle = "#83b7d0"; //background color
    context.fillRect(0, 0, 1200, 700); //x, y, width, height for background
    //rectangle context
    context.fillStyle = "#ff0000"; //rectangle color
    context.beginPath();
    context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height); //rectangle position and size
    context.fill();
    //bottom ground context
    context.fillStyle = "#683d28"; //ground color
    context.beginPath();
    context.fillRect(0, 600, 1200, 100)
    context.fill();
    //bottom grass line context
    context.fillStyle = "#136b24"; //bottom line color
    context.beginPath();
    context.rect(0, 600, 1200, 20);
    context.fill();
    //Flag context
    context.drawImage(gameIMG, flag.x, flag.y, flag.width, flag.height);
    //platform context
    for (let index = 0; index < platforms.length; index++) {
        context.fillStyle = "yellow";
        context.beginPath();
        context.fillRect(platforms[index].x, platforms[index].y, platforms[index].width, platforms[index].height);        
    }


    //gestolen van sOfie
    function DetectCollision(staticobject) {
        // Check if the two objects are overlapping
        if (rectangle.x + rectangle.width > staticobject.x &&
            rectangle.x < staticobject.x + staticobject.width &&
            rectangle.y + rectangle.height > staticobject.y &&
            rectangle.y < staticobject.y + staticobject.height) {
            
            return true;
        }     
        else {
            return false;
        }    
    }
    
    //gestolen van sOfie/Sofie's hulp gekregen cuz Im a dumb dumb
    function FixCollision(staticobject) {
        // Calculate the distance between the objects on the x and y axis
        const xDistance = Math.min(
            Math.abs(rectangle.x + rectangle.width - staticobject.x),
            Math.abs(staticobject.x + staticobject.width - rectangle.x)
        );
        const yDistance = Math.min(
            Math.abs(rectangle.y + rectangle.height - staticobject.y),
            Math.abs(staticobject.y + staticobject.height - rectangle.y)
        );
    
        // Determine which axis the collision occurred on
        if (xDistance < yDistance) {
            // The collision occurred on the x-axis
            if (Math.abs(rectangle.x + rectangle.width - staticobject.x) < Math.abs(staticobject.x + staticobject.width - rectangle.x)) {
                rectangle.x = staticobject.x - rectangle.width;
            }
            else {
                rectangle.x = staticobject.x + staticobject.width;
            }
        }
        else {
            // The collision occurred on the y-axis
            if (Math.abs(rectangle.y + rectangle.height - staticobject.y) < Math.abs(staticobject.y + staticobject.height - rectangle.y)) {
                rectangle.y = staticobject.y - rectangle.height;
                rectangle.jumping = false
                rectangle.y_velocity = 0; //collision makes velocity 0 once it hits something
            }
            else {
                rectangle.y = staticobject.y + staticobject.height;
                rectangle.y_velocity = 0; //collision makes velocity 0 once it hits something
            }
        }
    }

    for (let index = 0; index < flags.length; index++) {
        if (DetectCollision_flag(flags[index])) {
            alert("You win!");
        }
    }

    function DetectCollision_flag() {
        // Check if the two objects are overlapping
        if (rectangle.x + rectangle.width > flag.x &&
            rectangle.x < flag.x + flag.width &&
            rectangle.y + rectangle.height > flag.y &&
            rectangle.y < flag.y + flag.height) {
            
            return true;
        }     
        else {
            return false;
        }    
    }

    // call update when the browser is ready to draw again
    window.requestAnimationFrame(loop); //executes the code every frame forever
};



window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);