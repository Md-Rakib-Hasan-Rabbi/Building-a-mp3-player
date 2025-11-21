const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const songList = document.getElementById('song-list');
const currentSongDisplay = document.getElementById('current-song');
const songTimeDisplay = document.getElementById('song-time');
const progressBar = document.getElementById('progress');
const progressContainer = document.querySelector('.progress-bar');

let songs = [];
let currentSongIndex = -1;

// Initialize the player
document.addEventListener('DOMContentLoaded', loadSongs);

// Control button events
playBtn.addEventListener('click', playSong);
pauseBtn.addEventListener('click', pauseSong);
stopBtn.addEventListener('click', stopSong);

// Audio events
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);

// Progress bar click to seek
progressContainer.addEventListener('click', seek);

async function loadSongs() {
    try {
        // Fetch songs from backend (you'll need to create a backend endpoint)
        // For now, using mock data - replace with actual backend call
        const response = await fetch('/api/songs');
        songs = await response.json();
        
        renderSongList();
    } catch (error) {
        console.log('Backend not available. Using demo mode.');
        // Demo songs
        songs = [
            { id: 1, name: 'Song 1.mp3' },
            { id: 2, name: 'Song 2.mp3' },
            { id: 3, name: 'Song 3.mp3' }
        ];
        renderSongList();
    }
}

function renderSongList() {
    songList.innerHTML = '';
    
    if (songs.length === 0) {
        songList.innerHTML = '<p class="placeholder">No MP3 files found</p>';
        return;
    }

    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerHTML = `
            <span class="song-index">${index + 1}</span>
            <span class="song-name">${song.name}</span>
        `;
        
        songItem.addEventListener('click', () => selectSong(index));
        songList.appendChild(songItem);
    });
}

function selectSong(index) {
    currentSongIndex = index;
    audio.src = `/music/${songs[index].name}`;
    updateSongDisplay();
    playSong();
}

function playSong() {
    if (currentSongIndex === -1 && songs.length > 0) {
        selectSong(0);
        return;
    }
    
    audio.play();
    updateButtonStates(true);
}

function pauseSong() {
    audio.pause();
    updateButtonStates(false);
}

function stopSong() {
    audio.pause();
    audio.currentTime = 0;
    currentSongIndex = -1;
    currentSongDisplay.textContent = 'No song selected';
    progressBar.style.width = '0%';
    updateButtonStates(false);
    clearSongSelection();
}

function nextSong() {
    if (currentSongIndex < songs.length - 1) {
        selectSong(currentSongIndex + 1);
    } else {
        stopSong();
    }
}

function updateProgress() {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + '%';
        
        songTimeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
}

function seek(e) {
    const rect = progressContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
}

function updateSongDisplay() {
    if (currentSongIndex !== -1) {
        currentSongDisplay.textContent = songs[currentSongIndex].name;
        clearSongSelection();
        document.querySelectorAll('.song-item')[currentSongIndex].classList.add('active');
    }
}

function updateButtonStates(isPlaying) {
    playBtn.disabled = isPlaying;
    pauseBtn.disabled = !isPlaying;
    stopBtn.disabled = currentSongIndex === -1;
}

function clearSongSelection() {
    document.querySelectorAll('.song-item').forEach(item => {
        item.classList.remove('active');
    });
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}