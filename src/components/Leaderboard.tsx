import { useEffect, useState } from "react";
import { HOST } from "../App";

type LeaderboardUser = {
    highscore: string,
    highscoreDate: string,
    username: string
}

type Leaderboard = {
    mouse: LeaderboardUser[];
    touch: LeaderboardUser[];
}

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<Leaderboard>({ mouse: [], touch: [] });
    const [selectedLeaderboard, setSelectedLeaderboard] = useState<LeaderboardUser[]>([]);
    const [selectedType, setSelectedType] = useState<'mouse' | 'touch'>('mouse');
    const [status, setStatus] = useState('Fetching..');

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const [mouseResp, touchResp] = await Promise.all([
                    fetch(`${HOST}/api/scores/mouse`, {
                        method: 'GET',
                    }),
                    fetch(`${HOST}/api/scores/touch`, {
                        method: 'GET',
                    })
                ]);

                const mouseScores = await mouseResp.json();
                const touchScores = await touchResp.json();

                setLeaderboard({
                    mouse: mouseScores,
                    touch: touchScores,
                });
                setSelectedLeaderboard(mouseScores);
            } catch (err) {
                setStatus('Failed to fetch. Try again later.');
            }
        };
        fetchScores();
    }, []);

    return (

        <div className="h-full w-full p-4 text-[min(48px,7vmin)] text-red-500 font-clock text-center bg-black rounded-xl">
            <div className="w-full pb-4 flex justify-around">
                <button className={"font-bold text-yellow-400 px-8 " + (selectedType === 'mouse' ? " outline-dotted " : "")}
                    onClick={() => setSelectedType('mouse')}>
                    Mouse
                </button>
                <button className={"font-bold text-yellow-400 px-8 " + (selectedType === 'touch' ? " outline-dotted " : "")}
                    onClick={() => setSelectedType('touch')}>
                    Touch
                </button>
            </div>
            {selectedLeaderboard.length > 0
                ? <table className="w-full table-fixed">
                    <thead>
                        <th className="w-1/4">Rank</th>
                        <th className="w-1/2">Username</th>
                        <th className="w-1/4">Score</th>
                    </thead>
                    <tbody>
                        {selectedType === 'mouse' ? leaderboard.mouse.map((user, index) =>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td >{user.highscore}</td>
                            </tr>
                        ) : leaderboard.touch.map((user, index) =>
                            <tr>
                                <td >{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.highscore}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                : status
            }
        </div>
    );

}