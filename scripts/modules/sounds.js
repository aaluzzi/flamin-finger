const MENU_SONG = new Audio('../resources/audio/music/menu.mp3');
MENU_SONG.volume = 0.10;
const GAME_SONGS = [];

const TRAVERSE = new Audio('../resources/audio/sounds/traverse.wav');
TRAVERSE.volume = 0.05;
const SWITCH = new Audio('../resources/audio/sounds/switch.wav');
SWITCH.volume = 0.15;

const STARTS = [];
const ENDS = [];

for (let i = 0; i < 3; i++) {
    GAME_SONGS[i] = new Audio(`../resources/audio/music/maze${i}.mp3`);
    GAME_SONGS[i].volume = 0.10;
    GAME_SONGS[i].addEventListener('ended', () => {
        GAME_SONGS[i].play();
    })
}

for (let i = 0; i < 8; i++) {
    STARTS[i] = new Audio(`../resources/audio/sounds/start/${i}.wav`);
    STARTS[i].volume = 0.15;
    ENDS[i] = new Audio(`../resources/audio/sounds/end/${i}.wav`);
    ENDS[i].volume = 0.15;
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

export function playTraverseSound() {
    TRAVERSE.currentTime = 0;
    TRAVERSE.play();
}

export function playSwitchSound() {
    SWITCH.currentTime = 0;
    SWITCH.play();
}

export function playStartSound() {
    const index = Math.floor(Math.random() * STARTS.length);
    STARTS[index].play();
}

export function playEndSound() {
    const index = Math.floor(Math.random() * ENDS.length);
    ENDS[index].play();
}
