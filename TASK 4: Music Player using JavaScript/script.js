// Music data
const songs = [
    {
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        duration: "3:20",
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        title: "Save Your Tears",
        artist: "The Weeknd",
        album: "After Hours",
        duration: "3:35",
        cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        title: "Levitating",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        duration: "3:23",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        title: "Don't Start Now",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        duration: "3:03",
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        title: "Watermelon Sugar",
        artist: "Harry Styles",
        album: "Fine Line",
        duration: "2:54",
        cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    }
];

// DOM Elements
const albumArt = document.querySelector('.album-art');
const songTitle = document.querySelector('.song-title');
const songArtist = document.querySelector('.song-artist');
const songAlbum = document.querySelector('.song-album');
const currentTimeEl = document.querySelector('.current-time');
const songDurationEl = document.querySelector('.song-duration');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const volumeBar = document.querySelector('.volume-bar');
const volumeLevel = document.querySelector('.volume-level');
const autoplayToggle = document.getElementById('autoplay-toggle');
const playlistEl = document.getElementById('playlist');

// Audio object
const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let isRepeating = false;

// Initialize the player
function initPlayer() {
    loadSong(currentSongIndex);
    renderPlaylist();
    setupEventListeners();
}

// Load a song
function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    songAlbum.textContent = song.album;
    songDurationEl.textContent = song.duration;
    albumArt.querySelector('img').src = song.cover;
    
    // Update active song in playlist
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Render playlist
function renderPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.className = `playlist-item ${index === currentSongIndex ? 'active' : ''}`;
        playlistItem.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
            <div class="playlist-item-duration">${song.duration}</div>
        `;
        playlistItem.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
        playlistEl.appendChild(playlistItem);
    });
}

// Play song
function playSong() {
    isPlaying = true;
    audio.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    albumArt.classList.add('playing');
}

// Pause song
function pauseSong() {
    isPlaying = false;
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    albumArt.classList.remove('playing');
}

// Next song
function nextSong() {
    if (isShuffled) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// Previous song
function prevSong() {
    if (isShuffled) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// Update progress bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // Update time display
    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
    
    // Update song duration
    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = Math.floor(duration % 60);
    if (duration) {
        songDurationEl.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
    }
}

// Set progress
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    
    audio.currentTime = (clickX / width) * duration;
}

// Set volume
function setVolume(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const volume = clickX / width;
    
    audio.volume = volume;
    volumeLevel.style.width = `${volume * 100}%`;
}

// Setup event listeners
function setupEventListeners() {
    // Play/Pause button
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    // Next button
    nextBtn.addEventListener('click', nextSong);

    // Previous button
    prevBtn.addEventListener('click', prevSong);

    // Shuffle button
    shuffleBtn.addEventListener('click', () => {
        isShuffled = !isShuffled;
        shuffleBtn.style.opacity = isShuffled ? '1' : '0.7';
    });

    // Repeat button
    repeatBtn.addEventListener('click', () => {
        isRepeating = !isRepeating;
        repeatBtn.style.opacity = isRepeating ? '1' : '0.7';
        audio.loop = isRepeating;
    });

    // Progress bar
    audio.addEventListener('timeupdate', updateProgress);
    progressBar.addEventListener('click', setProgress);

    // Volume control
    volumeBar.addEventListener('click', setVolume);

    // Autoplay toggle
    autoplayToggle.addEventListener('change', () => {
        // In a real app, this would enable autoplay of next songs
        console.log('Autoplay:', autoplayToggle.checked);
    });

    // Song ended
    audio.addEventListener('ended', () => {
        if (isRepeating) {
            audio.currentTime = 0;
            playSong();
        } else if (autoplayToggle.checked) {
            nextSong();
        } else {
            pauseSong();
            progress.style.width = '0%';
            currentTimeEl.textContent = '0:00';
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (isPlaying) {
                pauseSong();
            } else {
                playSong();
            }
        } else if (e.code === 'ArrowRight') {
            nextSong();
        } else if (e.code === 'ArrowLeft') {
            prevSong();
        } else if (e.code === 'ArrowUp') {
            audio.volume = Math.min(audio.volume + 0.1, 1);
            volumeLevel.style.width = `${audio.volume * 100}%`;
        } else if (e.code === 'ArrowDown') {
            audio.volume = Math.max(audio.volume - 0.1, 0);
            volumeLevel.style.width = `${audio.volume * 100}%`;
        }
    });
}

// Initialize the player when the page loads
window.addEventListener('load', initPlayer);