const MENU_SONG = new Audio('../resources/audio/music/menu.mp3');
MENU_SONG.volume = 0.25;
const GAME_SONGS = [];

for (let i = 0; i <= 2; i++) {
    GAME_SONGS[i] = new Audio(`../resources/audio/music/maze${i}.mp3`);
    GAME_SONGS[i].volume = 0.25;
}

let songIndex = 0;
export function playMazeMusic() {
    songIndex = Math.floor(Math.random() * GAME_SONGS.length);
    GAME_SONGS[songIndex].currentTime = 0;
    GAME_SONGS[songIndex].play();
}

export function stopMazeMusic() {
    GAME_SONGS[songIndex].pause();
}

export function playMenuMusic() {
    MENU_SONG.currentTime = 0;
    MENU_SONG.play();
}

export function stopMenuMusic() {
    MENU_SONG.pause();
}