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