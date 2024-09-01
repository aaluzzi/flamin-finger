import { useRef, useEffect, useState } from 'react';
import { Game } from '../game/game';
import NumberDisplay from './NumberDisplay';
import { Graphics } from '../game/graphics';

const MOUSE_DIMENSION = 37;

export default function MouseGame({ submitScore }: { submitScore: (score: number) => void }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [game, setGame] = useState<Game | null>(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const graphics = new Graphics(canvasRef.current!, MOUSE_DIMENSION);
        setGame(new Game(graphics, MOUSE_DIMENSION, setScore, submitScore, false));
    }, []);

    return (
        <>
            <NumberDisplay number={score} />
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
