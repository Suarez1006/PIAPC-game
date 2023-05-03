import { Container, Graphics } from "pixi.js";
import { gridToPixels } from "./utils";

export class Character extends Container {
    public gridPos = { x: 6, y: 5 }
    constructor() {
        super()
        const visual: Graphics = new Graphics().beginFill(0x24c7e1).drawCircle(0, 0, 12);
        const raycast: Graphics = new Graphics().beginFill(0xff0000).drawRect(0, -1, 19, 2);
        this.addChild(visual, raycast)

        const globalPos = gridToPixels(this.gridPos.x, this.gridPos.y)

        this.position.set(globalPos.x, globalPos.y)
    }
}