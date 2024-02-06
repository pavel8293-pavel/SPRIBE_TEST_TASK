import Reel from "./Reel";
import { COLUMNS_LENGTH, POSITION_INCREMENT, ROW_LENGTH } from "../constants";
import { Application, Sprite } from "pixi.js";

interface SpritesRow {
    [key: string]: string[];
}

export default class ReelsContainer {
    public isWin = false;
    private readonly reels: Reel[] = [];
    private readonly app: Application;
    private spritesRows: SpritesRow = {};

    constructor(app: Application) {
        this.app = app;
        this.initialize();
    }

    public async spinAllReels(): Promise<void> {
        this.resetSpritesCombination();
        const durations = Array.from({ length: 5 }, this.getRandomNumber);
        const spinPromises: Promise<void>[] = [];
        this.reels.forEach((reel, i) => {
            const targetPosition = reel.position + POSITION_INCREMENT;
            const duration = durations[i];

            const spinPromise = new Promise<void>(resolve => {
                reel.spinTo(targetPosition, duration, "back.out(0.5)", () => {
                    resolve();
                    this.calculateSpritesPlacement(reel.sprites, targetPosition);
                });
            });
            spinPromises.push(spinPromise);
        });
        await Promise.all(spinPromises);
    }

    private initialize(): void {
        for (let i = 0; i < ROW_LENGTH; i++) {
            const reel = new Reel(this.app, i);
            this.reels.push(reel);
        }
    }

    private resetSpritesCombination(): void {
        this.isWin = false;
        this.spritesRows = {};
    }

    private getRandomNumber(): number {
        return Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000;
    }

    private calculateSpritesPlacement(sprites: Sprite[], position: number): void {
        for (const sprite of sprites) {
            if (this.isWin) {
                break;
            }
            this.transformSpritesRow(sprite, position);
            this.checkForWin(this.spritesRows);
        }
    }

    private checkForWin(spritesRows: SpritesRow): void {
        const spriteLevelKeys = Object.keys(spritesRows);
        if (
            spriteLevelKeys.length === COLUMNS_LENGTH &&
            spriteLevelKeys.every(key => spritesRows[key].length === ROW_LENGTH)
        ) {
            for (let j = 0; j < spriteLevelKeys.length; j++) {
                const currentRow = spriteLevelKeys[j];
                const uniqueSpritesInRow = new Set(spritesRows[currentRow]);
                console.log(spritesRows[currentRow]);
                if (uniqueSpritesInRow.size <= 3 && this.findEqualSpritesInRow(spritesRows[currentRow])) {
                    this.isWin = true;
                    break;
                }
            }
        }
    }

    private transformSpritesRow(sprite: Sprite, position: number): void {
        const positionY = sprite.position.y;
        if (positionY >= 0) {
            const index = position % POSITION_INCREMENT;

            if (!this.spritesRows[positionY]) {
                this.spritesRows[positionY] = [];
            }

            const currentRow = this.spritesRows[positionY];
            currentRow[index] = sprite.texture.textureCacheIds[0];
        }
    }

    private findEqualSpritesInRow(arr: string[]): boolean {
        for (let i = 0; i < arr.length - 2; i++) {
            if (arr[i] && arr[i + 1] && arr[i + 2] && arr[i] === arr[i + 1] && arr[i] === arr[i + 2]) {
                return true;
            }
        }
        return false;
    }
}
