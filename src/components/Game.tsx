import { useRef, useEffect, useState } from 'react';
import { Game } from '../game/game';

export default function GameComponent({ submitScore }: { submitScore: (score: number) => void }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [game, setGame] = useState<Game | null>(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        setGame(new Game(canvasRef.current!, 37, setScore, submitScore));
    }, []);

    return (
        <>
            <div className="px-2 leading-none text-[72px] w-[160px] font-clock text-red-500 text-right bg-black rounded-xl select-none">
                {score}
            </div>
            <canvas
                ref={canvasRef}
                className="h-[min(90vw,calc(93vh-128px))] p-2 bg-black rounded-xl aspect-square cursor-grab"
                onClick={game?.handleClick}
                onMouseMove={game?.handleMouseMove}
            />
        </>
    );
}
