import { useRef, useEffect, useState } from 'react';
import { Game } from '../game/game';

export default function GameComponent({ submitScore } : { submitScore: (score: number) => void }) {
    const canvasRef = useRef(null);
    const [game, setGame] = useState<Game | null>(null);
    const [score, setScore] = useState(0);

    useEffect(() => {       
        setGame(new Game(canvasRef.current!, setScore, submitScore));
    }, []);

    return (
        <>
            <div className="score">{score}</div>
            <canvas
                ref={canvasRef}
                className="game"
                onClick={game?.handleClick}
                onMouseMove={game?.handleMouseMove}
            />
        </>
    );
}
