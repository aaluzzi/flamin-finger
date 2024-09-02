const audioContext = new window.AudioContext();
let TRAVERSE_SOUND: AudioBuffer;
let SWITCH_SOUND: AudioBuffer;
let MENU_SONG: { buffer: AudioBuffer | null, playing: AudioBufferSourceNode | null } = {buffer: null, playing: null};
const MAZE_SONGS: { buffers: AudioBuffer[], playing: AudioBufferSourceNode | null } = { buffers: [], playing: null };
let START_SOUNDS: AudioBuffer[];
let END_SOUNDS: AudioBuffer[];

async function getAudioBuffer(url: string) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await audioContext.decodeAudioData(arrayBuffer);
    return buffer;
}

export async function loadSounds() {
    const [menuSongBuffer, traverseSound, switchSound, mazeSongBuffers, startSounds, endSounds] = await Promise.all([
        getAudioBuffer('/audio/music/menu.mp3'),
        getAudioBuffer('/audio/sounds/traverse.wav'),
        getAudioBuffer('/audio/sounds/switch.wav'),
        Promise.all(Array.from({ length: 3 }, (_, i) => getAudioBuffer(`/audio/music/maze${i}.mp3`))),
        Promise.all(Array.from({ length: 8 }, (_, i) => getAudioBuffer(`/audio/sounds/start/${i}.wav`))),
        Promise.all(Array.from({ length: 8 }, (_, i) => getAudioBuffer(`/audio/sounds/end/${i}.wav`)))
    ]);

    MENU_SONG = { buffer: menuSongBuffer, playing: null };
    TRAVERSE_SOUND = traverseSound;
    SWITCH_SOUND = switchSound;

    MAZE_SONGS.buffers = mazeSongBuffers;

    START_SOUNDS = startSounds;
    END_SOUNDS = endSounds;
}

function playSound(buffer: AudioBuffer, volume: number, loop: boolean=false) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.loop = loop;
    source.start(0);

    return source;
}

export function playMenuMusic() {
    if (!MENU_SONG.playing) {
        MENU_SONG.playing = playSound(MENU_SONG.buffer!, 0.05);
    }
}

export function stopMenuMusic() {
    MENU_SONG.playing?.stop();
    MENU_SONG.playing = null;
}

export function playMazeMusic() {
    const songIndex = Math.floor(Math.random() * MAZE_SONGS.buffers.length);
    MAZE_SONGS.playing = playSound(MAZE_SONGS.buffers[songIndex], 0.04, true);
}

export function stopMazeMusic() {
    MAZE_SONGS.playing?.stop();
}

export function playTraverseSound() {
    playSound(TRAVERSE_SOUND, 0.02);
}

export function playSwitchSound() {
    playSound(SWITCH_SOUND, 0.05);
}

export function playStartSound() {
    const index = Math.floor(Math.random() * START_SOUNDS.length);
    playSound(START_SOUNDS[index], 0.05);
}

export function playEndSound() {
    const index = Math.floor(Math.random() * END_SOUNDS.length);
    playSound(END_SOUNDS[index], 0.05);
}