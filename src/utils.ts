import { IPointData } from "pixi.js";

/**  This function converts grid coordinates to screen pixels */
export function gridToPixels(xCoordinate: number, yCoordinate: number): IPointData {
    const xPosition = xCoordinate * 32 + 16;
    const yPosition = yCoordinate * 32 + 16;
    return { x: xPosition, y: yPosition };
}

/** This function converts screen pixels to grid coordinates */
export function pixelsToGrid(xPosition: number, yPosition: number): IPointData {
    const xCoordinate = Math.floor(xPosition / 32);
    const yCoordinate = Math.floor(yPosition / 32);
    return { x: xCoordinate, y: yCoordinate };
}

export function clampToTheGrid(pos: IPointData): IPointData {
    const pixelPos = pixelsToGrid(pos.x, pos.y)
    return gridToPixels(pixelPos.x, pixelPos.y)
}

export function calculateDistance(a: IPointData, b: IPointData): number {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

// var Container = PIXI.Container,
// autoDetectRenderer = PIXI.autoDetectRenderer,
// loader = PIXI.loader,
// resources = PIXI.loader.resources,
// Sprite = PIXI.Sprite;

// var stage = new PIXI.Container(),
// renderer = PIXI.autoDetectRenderer(1000, 1000);
// document.body.appendChild(renderer.view);

// PIXI.loader
//   .add("animal.png")
//   .load(setup);

// var rocket, state;

// function setup() {

//   //Create the `tileset` sprite from the texture
//   var texture = PIXI.utils.TextureCache["animal.png"];

//   //Create a rectangle object that defines the position and
//   //size of the sub-image you want to extract from the texture
//   var rectangle = new PIXI.Rectangle(192, 128, 32, 32);

//   //Tell the texture to use that rectangular section
//   texture.frame = rectangle;

//   //Create the sprite from the texture
//   rocket = new Sprite(texture);
//   rocket.anchor.x = 0.5;
//   rocket.anchor.y = 0.5;
//   rocket.x = 50;
//   rocket.y = 50;
//   rocket.vx = 0;
//   rocket.vy = 0;

//   //Add the rocket to the stage
//   stage.addChild(rocket);

//   document.addEventListener("click", function(){
//     rocket.clickx = event.clientX;
//     rocket.clicky = event.clientY;
//     var x = event.clientX - rocket.x;
//     var y = event.clientY - rocket.y;

//     rocket.vmax = 5;
//     var total = Math.sqrt(x * x + y * y);
//     var tx = x/total;
//     var ty = y/total;
//     rocket.vx = tx*rocket.vmax;
//     rocket.vy = ty*rocket.vmax;
//   });

//   state = play;
//   gameLoop();
// }

// function gameLoop() {

//   //Loop this function at 60 frames per second
// requestAnimationFrame(gameLoop);
// state();

// //Render the stage to see the animation
// renderer.render(stage);
// }

// function play(){
//   rocket.x += rocket.vx;
//   rocket.y += rocket.vy;
//   if(rocket.x >= rocket.clickx){
//       if(rocket.y >= rocket.clicky){
//           rocket.x = rocket.clickx;
//           rocket.y = rocket.clicky;
//       }
//   }
// }