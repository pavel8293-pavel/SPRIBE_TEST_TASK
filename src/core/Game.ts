import { Application, IApplicationOptions, DisplayObject } from "pixi.js";
import Loader from "./Loader";
import ReelsContainer from "./ReelsContainer";
import VictoryScreen from "./VictoryScreen";

export default class Game {
    public app: Application<HTMLCanvasElement>;
    public reelsContainer?: ReelsContainer;
    public isButtonDisabled = false;
    private victoryScreen?: VictoryScreen;

    constructor(config: Partial<IApplicationOptions>) {
        this.app = new Application<HTMLCanvasElement>(config);
        new Loader(this.app, this.init.bind(this));
    }

    private init() {
        this.createReelsContainer();
        this.createVictoryScreen();
    }

    public async spinAllReels(): Promise<void> {
        await this.reelsContainer?.spinAllReels();
        this.processSpinResult(!!this.reelsContainer?.isWin);
    }

    private createReelsContainer() {
        this.reelsContainer = new ReelsContainer(this.app);
    }

    private createVictoryScreen() {
        this.victoryScreen = new VictoryScreen(this.app, this);
        this.app.stage.addChild(this.victoryScreen.container as DisplayObject);
    }

    private processSpinResult(isWin: boolean) {
        if (isWin) {
            this.victoryScreen?.show();
        }
    }
}
