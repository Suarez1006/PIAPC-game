import { Application, Graphics, IPointData, utils } from 'pixi.js'
import { Character } from './character';
import { TileMap } from './map';
import { pixelsToGrid } from './utils';
import { Enemy } from './enemy';

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x9E9E9E,
	width: 1280,
	height: 768
});


const background = new Graphics().beginFill(0x9E9E9E).drawRect(0, 0, 1280, 768).endFill()
app.stage.addChild(background)

const eventEmitter = new utils.EventEmitter
const map: TileMap = new TileMap(eventEmitter)
app.stage.addChild(map)

const easyStarJs = require("easystarjs")
const easyStar = new easyStarJs.js();
easyStar.setGrid(map.getTilesMatrix())
easyStar.setAcceptableTiles([0]);


const character: Character = new Character(eventEmitter)
app.stage.addChild(character)

const enemyAmount = 4
const enemies: Array<Enemy> = new Array(enemyAmount)
const enemyPositions = [{ x: 14, y: 17 }, { x: 18, y: 5 }, { x: 18, y: 9 }, { x: 36, y: 9 }]
const enemyPatrolFinal = [{ x: 14, y: 2 }, { x: 32, y: 5 }, { x: 18, y: 18 }, { x: 36, y: 19 }]
for (let i = 0; i < enemyAmount; i++) {
	const enemy = new Enemy(enemyPositions[i], enemyPatrolFinal[i], character, easyStar)
	enemies[i] = enemy
	app.stage.addChild(enemy)
}
app.ticker.add((dt) => {
	character.update(dt)
	enemies.forEach((enemy) => enemy.update())
})

app.stage.interactive = true
app.stage.on("pointerdown", (e) => {
	const gridPosition = pixelsToGrid(e.global.x, e.global.y)
	console.log("clicked pos", gridPosition);
	return

	easyStar.findPath(character.gridPos.x, character.gridPos.y, gridPosition.x, gridPosition.y, (path: Array<IPointData>) => {
		if (path == undefined || path.length <= 0) {
			return
		}
		// Use shift because the first element of the array is the character position and i don't need it
		path.shift()
		character.changePath(path)

		map.drawTrace(path)
	})
	easyStar.calculate()
})

