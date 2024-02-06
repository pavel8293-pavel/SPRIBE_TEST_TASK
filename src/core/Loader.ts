import { Loader as PixiLoader } from "@pixi/loaders";
import { defaultTextStyles, slotTextures } from "../constants";
import { LocalizationId } from "../localizationId";
import { Application, DisplayObject, TextStyle, Text } from "pixi.js";

export default class Loader {
    public loader: PixiLoader;
    private loadingScreen: Text;

    constructor(app: Application, onAssetsLoaded: () => void) {
        this.loader = new PixiLoader();
        this.loadingScreen = this.generateLoadingScreen(app.screen.width, app.screen.height);

        this.loadAssets();

        this.loader.load(() => {
            app.stage.removeChild(this.loadingScreen as DisplayObject);
            onAssetsLoaded();
        });

        app.stage.addChild(this.loadingScreen as DisplayObject);
    }

    private loadAssets() {
        slotTextures.forEach((texture, idx) => {
            return this.loader.add(`texture${idx}`, texture);
        });
    }

    private generateLoadingScreen(appWidth: number, appHeight: number) {
        const style = new TextStyle(defaultTextStyles);
        const playText = new Text(LocalizationId.LoadingLabel, style);
        playText.x = (appWidth - playText.width) / 2;
        playText.y = (appHeight - playText.height) / 2;
        return playText;
    }
}
