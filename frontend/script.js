const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const songList = document.getElementById('song-list');
const currentSongDisplay = document.getElementById('current-song');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const progressBar = document.getElementById('progress');
const progressContainer = document.querySelector('.progress-container');
const volumeSlider = document.getElementById('volume-slider');
const albumArt = document.querySelector('.album-art');
const songCount = document.getElementById('song-count');

let songs = [];
let currentSongIndex = -1;

// Initialize the player
document.addEventListener('DOMContentLoaded', () => {
    loadSongs();
    volumeSlider.value = 70;
    audio.volume = 0.7;
});

// Control button events
playBtn.addEventListener('click', playSong);
pauseBtn.addEventListener('click', pauseSong);
stopBtn.addEventListener('click', stopSong);
prevBtn.addEventListener('click', previousSong);
nextBtn.addEventListener('click', nextSong);
volumeSlider.addEventListener('input', changeVolume);

// Audio events
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);
audio.addEventListener('play', () => albumArt.classList.add('playing'));
audio.addEventListener('pause', () => albumArt.classList.remove('playing'));

// Progress bar click to seek
progressContainer.addEventListener('click', seek);

async function loadSongs() {
    try {
        const response = await fetch('/api/songs');
        if (!response.ok) throw new Error('Failed to fetch songs');
        songs = await response.json();
        renderSongList();
        updateSongCount();
    } catch (error) {
        console.error('Error loading songs:', error);
        songList.innerHTML = '<p class="placeholder"><i class="fas fa-exclamation-circle"></i> Error loading songs. Make sure the backend is running.</p>';
    }
}

function renderSongList() {
    songList.innerHTML = '';
    
    if (songs.length === 0) {
        songList.innerHTML = '<p class="placeholder"><i class="fas fa-music"></i> No MP3 files found</p>';
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
    audio.src = `/music/${encodeURIComponent(songs[index].name)}`;
    updateSongDisplay();
    playSong();
}

function playSong() {
    if (currentSongIndex === -1 && songs.length > 0) {
        selectSong(0);
        return;
    }
    
    audio.play().catch(err => console.error('Play error:', err));
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
    currentTimeDisplay.textContent = '00:00';
    totalTimeDisplay.textContent = '00:00';
    progressBar.style.width = '0%';
    updateButtonStates(false);
    clearSongSelection();
    albumArt.classList.remove('playing');
}

function previousSong() {
    if (currentSongIndex > 0) {
        selectSong(currentSongIndex - 1);
    } else if (songs.length > 0) {
        selectSong(songs.length - 1);
    }
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
        
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        totalTimeDisplay.textContent = formatTime(audio.duration);
    }
}

function seek(e) {
    const rect = progressContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
}

function changeVolume(e) {
    audio.volume = e.target.value / 100;
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
    prevBtn.disabled = songs.length === 0;
    nextBtn.disabled = songs.length === 0;
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

function updateSongCount() {
    songCount.textContent = `${songs.length} ${songs.length === 1 ? 'song' : 'songs'}`;
}