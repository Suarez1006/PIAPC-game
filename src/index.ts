import { Application, Graphics } from 'pixi.js'
import { Character } from './character';
import { TileMap } from './map';
import { pixelsToGrid } from './utils';

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

const map: TileMap = new TileMap()
app.stage.addChild(map)

var easystarjs = require("easystarjs")
var easystar = new easystarjs.js();
easystar.setGrid(map.getTilesMatrix())
easystar.setAcceptableTiles([0]);

const character: Character = new Character()
app.stage.addChild(character)

app.stage.interactive = true
app.stage.on("pointerdown", (e) => {
	const gridPosition = pixelsToGrid(e.global.x, e.global.y)
	// console.log("clicked pos", gridPosition);

	easystar.findPath(character.gridPos.x, character.gridPos.y, gridPosition.x, gridPosition.y, (path: any) => {
		console.log(path);
	})
	easystar.calculate()
})

