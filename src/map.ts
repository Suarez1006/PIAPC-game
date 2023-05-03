import { Container, Graphics, IPointData } from "pixi.js"
import mapData from "../static/PIAPC.json"

export class TileMap extends Container {
    constructor() {
        super()
        type floorTile = {
            walkable: boolean
            visual?: Graphics
        }
        const tilesQuantity: IPointData = { x: mapData.width, y: mapData.height }
        const tilesData: Array<number> = mapData.layers[0].data
        const tileSize: number = 32
        const holeSize: number = 30

        for (let index = 0; index < tilesData.length; index++) {
            const tilePosition: IPointData = { x: (index % tilesQuantity.x) * tileSize, y: (Math.floor(index / tilesQuantity.x)) * tileSize }
            const walkable = tilesData[index] == 0
            const newTile: floorTile = { walkable: walkable }
            if (!walkable) {
                const tileGraphic = new Graphics().beginFill(0x4B4B4B).drawRect(tilePosition.x, tilePosition.y, tileSize, tileSize).endFill()
                newTile.visual = tileGraphic
                this.addChild(tileGraphic)
            } else {
                const tileGraphic = new Graphics().beginFill(0x818181).drawRect(tilePosition.x, tilePosition.y, tileSize, tileSize).endFill().beginHole().drawRect(tilePosition.x + (tileSize - holeSize) / 2, tilePosition.y + (tileSize - holeSize) / 2, holeSize, holeSize)
                newTile.visual = tileGraphic
                this.addChild(tileGraphic)
            }
        }
    }
}