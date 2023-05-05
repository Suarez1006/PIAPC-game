import { Container, Graphics, IPointData, Point } from "pixi.js";
import { Character } from "./character";
import { calculateDistance, clampToTheGrid, gridToPixels, pixelsToGrid } from "./utils";

type EnemyState = "idle" | "patrol" | "chase"
export class Enemy extends Container {
    private enemyArea: Graphics = new Graphics()
    private gridPos: IPointData
    // private maxChaseVelocity = 2
    private maxPatrolVelocity = .5
    private patrolFinalPos: IPointData
    private patrolPath: Array<IPointData> = []
    private pathIndex: number = 0
    private velocity: Point = new Point(0, 0)

    private state: EnemyState = "patrol"
    private character: Character
    private easyStarPlugin: any

    constructor(position: IPointData, patrolFinalPos: IPointData, character: Character, easyStar: any) {
        super()
        this.gridPos = { x: position.x, y: position.y }
        const globalPos = gridToPixels(position.x, position.y)
        this.position.set(globalPos.x, globalPos.y)
        this.character = character
        this.easyStarPlugin = easyStar
        this.patrolFinalPos = patrolFinalPos

        const visual: Graphics = new Graphics().beginFill(0xCB2727).drawCircle(0, 0, 12);
        this.addChild(visual)

        this.enemyArea.beginFill(0x0f0f0f, .4).drawCircle(0, 0, 60).endFill()
        this.addChild(this.enemyArea)

        this.easyStarPlugin.findPath(this.gridPos.x, this.gridPos.y, this.patrolFinalPos.x, this.patrolFinalPos.y, (path: Array<IPointData>) => {
            this.patrolPath = Array.from(path)
        })
        this.easyStarPlugin.calculate()
    }

    public update(): void {
        switch (this.state) {
            case "idle":
                return
            case "chase":
                this.chasePlayer()
                break
            case "patrol":
                this.patrol()
                break
        }
    }

    private chasePlayer(): void {
        this.easyStarPlugin.findPath(this.gridPos.x, this.gridPos.y, this.character.gridPos.x, this.character.gridPos.y, (path: Array<IPointData>) => {
            console.log(path)
        })
        this.easyStarPlugin.calculate()
    }

    private patrol(): void {
        let desiredPos = this.patrolPath[this.pathIndex]

        if (this.gridPos.x == desiredPos.x && this.gridPos.y == desiredPos.y && this.pathIndex < this.patrolPath.length - 1) {
            this.pathIndex++
        }
        desiredPos = this.patrolPath[this.pathIndex]
        let desiredGlobalPos = clampToTheGrid(gridToPixels(desiredPos.x, desiredPos.y))


        const xDistance = desiredGlobalPos.x - this.position.x
        const yDistance = desiredGlobalPos.y - this.position.y
        const totalDistance = calculateDistance(this.position, desiredGlobalPos)
        if (totalDistance <= this.maxPatrolVelocity) {
            this.patrolPath.reverse()
            this.pathIndex = 0;
            return
        }
        this.velocity.x = xDistance / totalDistance
        this.velocity.y = yDistance / totalDistance

        const direction = this.getDirection(this.patrolPath[this.pathIndex])

        this.angle = this.rotateChar(direction)

        this.position.x += this.velocity.x * this.maxPatrolVelocity
        this.position.y += this.velocity.y * this.maxPatrolVelocity


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