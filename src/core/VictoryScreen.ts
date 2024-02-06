import { defaultTextStyles } from "../constants";
import { Container, Graphics, Application, TextStyle, Text, DisplayObject } from "pixi.js";
import Game from "./Game";

export default class VictoryScreen {
    public container: Container;
    private overlay?: Graphics;

    constructor(app: Application, game: Game) {
        this.container = new Container();
        this.generate(app.screen.width, app.screen.height);
    }

    show() {
        this.container.visible = true;
        const id = window.setTimeout(this.hide.bind(this), 3000);
        const handler = () => {
            window.clearTimeout(id);
            this.hide();
        };
        this.overlay?.addListener("pointerdown", handler.bind(this));
    }

    hide() {
        this.container.visible = false;
    }

    private generate(appWidth: number, appHeight: number) {
        this.container.visible = false;

        this.overlay = new Graphics();
        this.overlay.beginFill(0xffffff, 0.001);
        this.overlay.drawRect(0, 0, appWidth, appHeight);
        this.overlay.endFill();
        this.overlay.interactive = true;
        this.overlay.cursor = "default";

        const rect = new Graphics();
        rect.beginFill(0x02474e, 0.8);
        rect.drawRect(0, 0, 717.5, 400);
        rect.x = 70;
        rect.y = (appHeight - rect.height) / 2;
        rect.endFill();

        const style = new TextStyle(defaultTextStyles);

        const text = new Text("YOU WON!, 3 elements in a row are set", style);
        text.x = 35 + (rect.width - text.width) / 2;
        text.y = (appHeight - text.height) / 2;

        this.container.addChild(rect as DisplayObject, text as DisplayObject, this.overlay as DisplayObject);
    }
}
