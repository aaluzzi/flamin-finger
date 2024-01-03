import { loadGame, setHighscore } from "./modules/game.js";

const HOST = 'http://localhost:3000'

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
    
            setHighscore(json.highscore);
            document.querySelector('.sign-in').textContent = json.username;
        } catch (err) {
            document.querySelector('.sign-in').addEventListener('click', () => {
                window.location.href = `${HOST}/login`
            });
        }
    } else {
        document.querySelector('.sign-in').addEventListener('click', () => {
            window.location.href = `${HOST}/login`
        });
    }
}

fetchUserInfo();
loadGame();