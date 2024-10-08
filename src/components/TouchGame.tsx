import { useRef, useEffect, useState } from 'react';
import { Game } from '../game/game';
import NumberDisplay from './NumberDisplay';
import { Graphics } from '../game/graphics';
import { loadSounds } from '../game/sounds';
import { ScoresDisplay } from './ScoresDisplay';

const TOUCH_DIMENSION = 19;

export default function TouchGame({ highscore, submitScore }: { highscore: number, submitScore: (score: number) => void }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [game, setGame] = useState<Game | null>(null);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState('00.0');

    useEffect(() => {
        const load = async () => {
            await loadSounds();
            const graphics = new Graphics(canvasRef.current!, TOUCH_DIMENSION);
            graphics.drawTimer = (timeLeft: number) => setTimer(timeLeft.toFixed(1).padStart(4, '0'));
            setGame(new Game(graphics, TOUCH_DIMENSION, setScore, submitScore, true));
        }

        load();
    }, []);

    return (
        <>
            <ScoresDisplay score={score} highscore={highscore} />
            <canvas
                ref={canvasRef}
                className="h-[min(90vw,calc(93vh-128px))] p-2 bg-black rounded-xl aspect-square cursor-grab"
                onClick={game?.handleClick}
                onPointerMove={game?.handlePointerMove}
                onContextMenu={(e) => e.preventDefault()}
            />
            <NumberDisplay number={timer} color="red-500" />
        </>
    );
}
