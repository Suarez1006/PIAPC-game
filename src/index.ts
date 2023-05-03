import { Application } from 'pixi.js'
import { Character } from './character';
import { TileMap } from './map';

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x9E9E9E,
	width: 1280,
	height: 768
});
const map: TileMap = new TileMap()
app.stage.addChild(map)

const character: Character = new Character()
character.position.set(200, 200)
app.stage.addChild(character)