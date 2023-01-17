var context, controller, rectangle, loop;

context = document.querySelector("canvas").getContext("2d");

context.canvas.height = 700;
context.canvas.width = 1200;


platform = {
    height:30,
    width:100,
    x:800,
    y:525,
}

rectangle = {
    height:75,
    jumping:true,
    width:32,
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

loop = function() {
    if (controller.up && rectangle.jumping == false) {
        rectangle.y_velocity -= 25;
        rectangle.jumping = true;
        
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
    //platform context
    context.fillStyle = "yellow";
    context.beginPath();
    context.fillRect(platform.x, platform.y, platform.width, platform.height);
    context.fill();

    // call update when the browser is ready to draw again
    window.requestAnimationFrame(loop); //executes the code every frame forever
};



window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);