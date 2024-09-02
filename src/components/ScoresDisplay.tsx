import NumberDisplay from "./NumberDisplay";

export function ScoresDisplay({score, highscore} : {score: number, highscore: number}) {
    return (
        <div className="flex gap-4">
            <NumberDisplay number={score} color="red-500" />
            <NumberDisplay number={highscore} color="yellow-400" />
        </div>
    )
}