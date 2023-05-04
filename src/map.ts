import { Container, Graphics, IPointData } from "pixi.js"
import mapData from "../static/PIAPC.json"
import { gridToPixels } from "./utils"

export type floorTile = {
    walkable: boolean
    visual?: Graphics
}
export class TileMap extends Container {
    private pathTiles: Array<Graphics> = []
    private lastDestinyPos: IPointData = { x: 0, y: 0 }
    private tilesQuantity: IPointData = { x: mapData.width, y: mapData.height }

    constructor() {
        super()
        this.eventMode = "static"
        const tilesData: Array<number> = mapData.layers[0].data
        const tileSize: number = 32
        const holeSize: number = 30

        for (let index = 0; index < tilesData.length; index++) {
            const tilePosition: IPointData = { x: (index % this.tilesQuantity.x) * tileSize, y: (Math.floor(index / this.tilesQuantity.x)) * tileSize }
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

    public getTilesMatrix(): Array<Array<number>> {
        let rv = new Array<Array<number>>(this.tilesQuantity.y)
        let tileIndex = 0
        for (let y = 0; y < rv.length; y++) {
            rv[y] = new Array<number>(this.tilesQuantity.x)
            for (let x = 0; x < rv[y].length; x++) {
                rv[y][x] = mapData.layers[0].data[tileIndex++]
            }
        }
        return rv
    }

    public drawTrace(pathArray: Array<IPointData>): void {
        if (pathArray != undefined && this.pathTiles.length > 1 && pathArray[pathArray.length - 1].x == this.lastDestinyPos.x && pathArray[pathArray.length - 1].y == this.lastDestinyPos.y) {
            console.log("same");
        }

        while (this.pathTiles.length > 0) {
            this.pathTiles[0].destroy()
            this.pathTiles.splice(0, 1)
        }

        for (const pathTile of pathArray) {
            const traceGraph = new Graphics().beginFill(0xffffff, 0.3).drawRect(-7, -7, 14, 14)
            const posInPixels = gridToPixels(pathTile.x, pathTile.y)
            traceGraph.position.set(posInPixels.x, posInPixels.y)
            this.addChild(traceGraph)
            this.pathTiles.push(traceGraph)
        }
        const lastTilePos = pathArray[pathArray.length - 1]
        this.lastDestinyPos = { x: lastTilePos.x, y: lastTilePos.y }
    }
}