import { useRef, useEffect, useState } from 'react';
import { Game } from '../game/game';
import { Graphics } from '../game/graphics';
import { loadSounds } from '../game/sounds';
import { ScoresDisplay } from './ScoresDisplay';

const MOUSE_DIMENSION = 37;

export default function MouseGame({ highscore, submitScore }: { highscore: number, submitScore: (score: number) => void }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [game, setGame] = useState<Game | null>(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const load = async () => {
            const graphics = new Graphics(canvasRef.current!, MOUSE_DIMENSION);
            await loadSounds();
            setGame(new Game(graphics, MOUSE_DIMENSION, setScore, submitScore, false));
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
        </>
    );
}
