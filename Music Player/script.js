// DOM Elements
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const volumeControl = document.getElementById('volume-control');
const songTitle = document.getElementById('song-title');
const artist = document.getElementById('artist');
const albumArt = document.getElementById('album-art');
const playlist = document.getElementById('playlist');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');

// Playlist Data
const songs = [
  {
    title: "Jal Jamna Ro Paani",
    artist: "Seema Mishra",
    src: "assets/song1.mp3",
    cover: "assets/covers/song1.png"
  },
  {
    title: "Perfume Lagawe Chunni Me",
    artist: "Lovekush Dhungri",
    src: "assets/song2.mp3",
    cover: "assets/covers/song2.png"
  }
];

let currentSongIndex = 0;
const audio = new Audio();

// Format time from seconds to MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update time display
function updateTimeDisplay() {
  currentTimeDisplay.textContent = formatTime(audio.currentTime);
  
  // Only update duration if it's available and valid
  if (!isNaN(audio.duration) && isFinite(audio.duration)) {
    durationDisplay.textContent = formatTime(audio.duration);
  }
}

// Load a song into the player
function loadSong(song) {
  songTitle.textContent = song.title;
  artist.textContent = song.artist;
  albumArt.src = song.cover;
  audio.src = song.src;
  
  // Reset time display when loading new song
  currentTimeDisplay.textContent = '0:00';
  durationDisplay.textContent = '0:00';
  
  // If the song is already loaded (from cache), update duration immediately
  if (audio.readyState > 0) {
    updateTimeDisplay();
  }
}

// Play/Pause toggle
function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = '⏸';
  } else {
    audio.pause();
    playBtn.textContent = '▶';
  }
}

// Play next song
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(songs[currentSongIndex]);
  audio.play();
  playBtn.textContent = '⏸';
}

// Play previous song
function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(songs[currentSongIndex]);
  audio.play();
  playBtn.textContent = '⏸';
}

// Update progress bar
function updateProgress() {
  if (!isNaN(audio.duration)) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    updateTimeDisplay();
  }
}

// Seek to position in song
function setProgress(e) {
  const seekTime = (e.target.value / 100) * audio.duration;
  audio.currentTime = seekTime;
}

// Adjust volume
function setVolume() {
  audio.volume = volumeControl.value;
}

// Render playlist
function renderPlaylist() {
  playlist.innerHTML = songs.map((song, index) => `
    <li onclick="playSong(${index})">
      ${song.title} - ${song.artist}
    </li>
  `).join('');
}

// Play selected song from playlist
function playSong(index) {
  currentSongIndex = index;
  loadSong(songs[index]);
  audio.play();
  playBtn.textContent = '⏸';
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
progressBar.addEventListener('input', setProgress);
volumeControl.addEventListener('input', setVolume);

// Audio event listeners
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', updateTimeDisplay);
audio.addEventListener('canplay', updateTimeDisplay);
audio.addEventListener('ended', nextSong);

// Initialize the player
loadSong(songs[currentSongIndex]);
renderPlaylist();

// Set initial volume
audio.volume = volumeControl.value;