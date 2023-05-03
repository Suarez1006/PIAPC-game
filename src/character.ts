import { Container, Graphics } from "pixi.js";

export class Character extends Container {
    constructor() {
        super()
        const visual: Graphics = new Graphics().beginFill(0x24c7e1).drawCircle(0, 0, 12);
        const raycast: Graphics = new Graphics().beginFill(0xff0000).drawRect(0, -1, 19, 2);
        this.addChild(visual, raycast)
    }
}