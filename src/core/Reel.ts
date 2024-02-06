import { COLUMNS_LENGTH, REEL_WIDTH, SPRITE_SIZE, slotTextures } from "../constants";
import gsap from "gsap";
import { Application, BlurFilter, Container, DisplayObject, Resource, Sprite, Texture } from "pixi.js";

export default class Reel {
    public readonly position: number;
    public sprites: Array<Sprite> = [];
    private readonly app: Application;
    private readonly container: Container;
    private previousPosition = 0;
    public readonly textures: Texture<Resource>[];
    private readonly blur: BlurFilter;

    constructor(app: Application, position: number) {
        this.container = new Container();
        this.blur = new BlurFilter();
        this.app = app;
        this.position = position;
        this.container.x = this.position * REEL_WIDTH;
        this.textures = slotTextures.map(texture => Texture.from(texture));
        this.initialize();
    }

    public spinTo(
        target: number,
        time: number,
        easing: gsap.EaseString | gsap.EaseFunction,
        onComplete: () => void
    ): void {
        gsap.to(this, {
            position: target,
            duration: time / 1000,
            ease: easing,
            onComplete: onComplete,
            onUpdate: () => this.updateSprites(),
        });
    }

    private initialize() {
        this.container.x = this.position * REEL_WIDTH;

        for (let j = 0; j < COLUMNS_LENGTH + 1; j++) {
            const sprite = new Sprite(this.getRandomTexture());
            sprite.y = j * SPRITE_SIZE;
            sprite.scale.x = sprite.scale.y = Math.min(SPRITE_SIZE / sprite.width, SPRITE_SIZE / sprite.height);
            sprite.x = Math.round((SPRITE_SIZE - sprite.width) / 2);
            this.sprites.push(sprite);
            this.container.addChild(sprite as DisplayObject);
        }

        this.app.stage.addChild(this.container as DisplayObject);
    }

    private getRandomTexture() {
        return this.textures[Math.floor(Math.random() * this.textures.length)];
    }

    private updateSprites(): void {
        this.blur.blurY = (this.position - this.previousPosition) * 8;
        this.previousPosition = this.position;

        for (let j = 0; j < this.sprites.length; j++) {
            const sprite = this.sprites[j];
            const prevY = sprite.y;

            sprite.y = ((this.position + j) % this.sprites.length) * SPRITE_SIZE - SPRITE_SIZE;

            if (sprite.y < 0 && prevY > SPRITE_SIZE) {
                sprite.texture = this.getRandomTexture();
                sprite.scale.x = sprite.scale.y = Math.min(
                    SPRITE_SIZE / sprite.texture.width,
                    SPRITE_SIZE / sprite.texture.height
                );
                sprite.x = Math.round((SPRITE_SIZE - sprite.width) / 2);
            }
        }
    }
}
