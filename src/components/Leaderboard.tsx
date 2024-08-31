import { useEffect, useState } from "react";
import { HOST } from "../App";

type LeaderboardUser = {
    highscore: string,
    highscoreDate: string,
    username: string
}

export default function Leaderboard() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [status, setStatus] = useState('Fetching..');

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const resp = await fetch(`${HOST}/api/scores`, {
                    method: 'GET',
                });
                const json = await resp.json();
                setUsers(json)
            } catch (err) {
                setStatus('Failed to fetch. Try again later.')
            }
        }
        fetchScores();
    }, []);

    return (
        <div className="h-full w-full p-4 text-[min(32px,5vmin)] text-red-500 font-clock text-center bg-black rounded-xl">
            {users.length > 0
                ? <table>
                    <thead>
                        <th>Ranking</th>
                        <th>Username</th>
                        <th>Score</th>
                        <th>Date</th>
                    </thead>
                    <tbody>
                        {users.map((user, index) =>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.highscore}</td>
                                <td>{new Date(user.highscoreDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}</td>
                            </tr>)}
                    </tbody>
                </table>
                : status
            }

        </div>
    );

}