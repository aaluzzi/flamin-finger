import { loadGame, setHighscore } from "./modules/game.js";
import { hideLeaderboard, loadLeaderboard } from "./modules/leaderboard.js";

export const HOST = 'https://flamin-finger-backend.fly.dev'

async function fetchUserInfo() {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('token')) {
        localStorage.setItem('token', searchParams.get('token'));
    }

    if (localStorage.getItem('token')) {
        try {
            const resp = await fetch(`${HOST}/api/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const json = await resp.json();
    
            if (json.username) {
                localStorage.setItem('user', JSON.stringify(json));
                loadUser();
            }
        } catch (err) {
            
        }
    }
}

function loadUser() {
    if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user'));

        document.querySelector('.sign-in').classList.add('hidden');
        document.querySelector('.user').classList.remove('hidden');
        document.querySelector('.user').textContent = `${user.name} (${user.username})`;
        setHighscore(Number(user.highscore));
        console.log(user.highscore);
    }
}

export async function submitScore(score) {
    if (localStorage.getItem('token')) {
        try {
            await fetch(`${HOST}/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'score': score,
                }
            });
        } catch (err) {
            console.err(err);
        }
    }
}

loadUser();
fetchUserInfo();
loadGame();

document.querySelector('.leaderboard').addEventListener('click', e => {
    e.target.classList.add('hidden');
    document.querySelector('.play').classList.remove('hidden');
    loadLeaderboard();
});

document.querySelector('.play').addEventListener('click', e => {
    e.target.classList.add('hidden');
    document.querySelector('.leaderboard').classList.remove('hidden');
    hideLeaderboard();
});