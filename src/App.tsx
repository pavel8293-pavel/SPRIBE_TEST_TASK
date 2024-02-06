import React, { useEffect, useRef, useState } from "react";
import { config } from "./config";
import Game from "./core/Game";
import "./App.css";

const App: React.FC = () => {
    const gameRef = useRef<Game | null>(null);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        const pixiContainer = document.getElementById("pixi-container");
        const game = new Game(config);
        gameRef.current = game;
        pixiContainer?.appendChild(game.app.view);
    }, []);

    const handleSpinClick = async () => {
        setIsDisabled(true);
        await gameRef.current?.spinAllReels?.();
        setIsDisabled(false);
    };

    return (
        <div className="root">
            <div id="pixi-container" className="pixi-container"></div>
            <button disabled={isDisabled} onClick={handleSpinClick} className="button">
                SPIN
            </button>
        </div>
    );
};

export default App;
