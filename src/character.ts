import { Container, Graphics, IPointData, Point, utils } from "pixi.js";
import { calculateDistance, clampToTheGrid, gridToPixels, pixelsToGrid } from "./utils";

type charState = "idle" | "walking" | "running"
export class Character extends Container {
    private eventEmitter: utils.EventEmitter
    public state: charState = "idle"

    public gridPos = { x: 5, y: 4 }
    private maxVelocity: number = 2
    private velocity: Point
    private pathToFollow: IPointData[] = [];
    private pathIndex: number = 0;
    constructor(eventEmitter: utils.EventEmitter) {
        super()
        this.eventEmitter = eventEmitter
        this.velocity = new Point(0, 0)

        const visual: Graphics = new Graphics().beginFill(0x24c7e1).drawCircle(0, 0, 12);
        const raycast: Graphics = new Graphics().beginFill(0xff0000).drawRect(0, -1, 19, 2);
        this.addChild(visual, raycast)

        const globalPos = gridToPixels(this.gridPos.x, this.gridPos.y)

        this.position.set(globalPos.x, globalPos.y)
    }

    public update(_dt: number): void {
        if (this.state == "idle") {
            return
        }
        this.followPath()
    }

    public changePath(path: Array<IPointData>): void {
        this.pathToFollow = Array.from(path)
        this.pathIndex = 0
        this.state = "walking"
    }

    private followPath(): void {
        if (this.pathToFollow == null) {
            return
        }
        let desiredPos = this.pathToFollow[this.pathIndex]

        if (this.gridPos.x == desiredPos.x && this.gridPos.y == desiredPos.y && this.pathIndex < this.pathToFollow.length - 1) {
            this.eventEmitter.emit("reachedTile")
            this.pathIndex++
        }
        desiredPos = this.pathToFollow[this.pathIndex]
        let desiredGlobalPos = clampToTheGrid(gridToPixels(desiredPos.x, desiredPos.y))


        const xDistance = desiredGlobalPos.x - this.position.x
        const yDistance = desiredGlobalPos.y - this.position.y
        const totalDistance = calculateDistance(this.position, desiredGlobalPos)
        if (totalDistance <= this.maxVelocity) {
            this.pathIndex = 0;
            this.state = "idle"
            this.eventEmitter.emit("stop")
            return
        }
        this.velocity.x = xDistance / totalDistance
        this.velocity.y = yDistance / totalDistance

        const direction = this.getDirection(this.pathToFollow[this.pathIndex])

        this.angle = this.rotateChar(direction)

        this.position.x += this.velocity.x * this.maxVelocity
        this.position.y += this.velocity.y * this.maxVelocity


        const gridPosition = pixelsToGrid(this.position.x, this.position.y)
        this.gridPos.x = gridPosition.x
        this.gridPos.y = gridPosition.y
    }

    private rotateChar(distance: IPointData): number {
        if (distance.x == 1) {
            if (distance.y == 0) {
                return 0
            } else if (distance.y == 1) {
                return 45
            } else {
                return 315
            }
        } else if (distance.x == 0) {
            if (distance.y == 1) {
                return 90
            } else {
                return 270
            }
        } else {
            if (distance.y == 0) {
                return 180
            } else if (distance.y == 1) {
                return 135
            } else {
                return 225
            }
        }
    }

    private getDirection(desiredPos: IPointData): IPointData {
        const globalPos = gridToPixels(desiredPos.x, desiredPos.y)
        let rv: IPointData = { x: 0, y: 0 }
        if (this.position.x > globalPos.x + 1) {
            rv.x = -1
        } else if (this.position.x < globalPos.x - 1) {
            rv.x = 1
        }
        if (this.position.y > globalPos.y + 1) {
            rv.y = -1
        } else if (this.position.y < globalPos.y - 1) {
            rv.y = 1
        }
        return rv
    }

}