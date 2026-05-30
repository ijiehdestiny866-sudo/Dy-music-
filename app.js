// Sample music data
const musicData = {
    artists: [
        { id: 1, name: 'Alex Wave', genre: 'Electronic', followers: 125000, image: '♪' },
        { id: 2, name: 'Luna Echo', genre: 'Indie Pop', followers: 89000, image: '♫' },
        { id: 3, name: 'Jazz Masters', genre: 'Jazz Fusion', followers: 76000, image: '♪' },
        { id: 4, name: 'Pulse Sync', genre: 'Synthwave', followers: 102000, image: '♫' },
        { id: 5, name: 'Urban Soul', genre: 'Hip Hop', followers: 145000, image: '♪' },
        { id: 6, name: 'Crystal Sound', genre: 'Ambient', followers: 67000, image: '♫' }
    ],
    songs: [
        { id: 1, title: 'Digital Dreams', artist: 'Alex Wave', duration: 245, downloads: 1200, plays: 25000, artistId: 1 },
        { id: 2, title: 'Midnight Glow', artist: 'Luna Echo', duration: 198, downloads: 890, plays: 18000, artistId: 2 },
        { id: 3, title: 'Jazz Conversation', artist: 'Jazz Masters', duration: 312, downloads: 654, plays: 12000, artistId: 3 },
        { id: 4, title: 'Neon Lights', artist: 'Pulse Sync', duration: 267, downloads: 1050, plays: 22000, artistId: 4 },
        { id: 5, title: 'Urban Vibes', artist: 'Urban Soul', duration: 215, downloads: 1450, plays: 30000, artistId: 5 },
        { id: 6, title: 'Peaceful Journey', artist: 'Crystal Sound', duration: 289, downloads: 567, plays: 11000, artistId: 6 },
        { id: 7, title: 'Electric Pulse', artist: 'Alex Wave', duration: 234, downloads: 980, plays: 19000, artistId: 1 },
        { id: 8, title: 'Starlight', artist: 'Luna Echo', duration: 203, downloads: 756, plays: 15000, artistId: 2 }
    ]
};

let currentSongIndex = 0;
let isPlaying = false;
let autoPlay = false;
let downloadedSongs = JSON.parse(localStorage.getItem('downloadedSongs')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    setupEventListeners();
    loadDownloads();
});

function loadContent() {
    displayFeaturedSongs();
    displayArtists();
    displayTrendingSongs();
    displayDownloads();
}

// ===== SONGS DISPLAY =====
function displayFeaturedSongs() {
    const grid = document.getElementById('featuredGrid');
    grid.innerHTML = musicData.songs.map(song => `
        <div class="song-card" onclick="openSongModal(${song.id})">
            <div class="song-thumbnail">
                <span>${song.artist.charAt(0)}</span>
            </div>
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
            <div class="song-meta">
                <span><i class="fas fa-play"></i> ${song.plays}K</span>
                <span><i class="fas fa-download"></i> ${song.downloads}</span>
            </div>
            <div class="song-actions">
                <button class="action-btn" onclick="playSong(${song.id}, event)">
                    <i class="fas fa-play"></i> Play
                </button>
                <button class="action-btn download" onclick="downloadSong(${song.id}, event)">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== ARTISTS DISPLAY =====
function displayArtists() {
    const grid = document.getElementById('artistsGrid');
    grid.innerHTML = musicData.artists.map(artist => `
        <div class="artist-card" onclick="openArtistModal(${artist.id})">
            <div class="artist-avatar">${artist.image}</div>
            <div class="artist-name">${artist.name}</div>
            <div class="artist-info">${artist.genre}</div>
            <div class="artist-stats">
                <div class="artist-stat">
                    <div class="artist-stat-number">${(artist.followers / 1000).toFixed(0)}K</div>
                    <div class="artist-stat-label">Followers</div>
                </div>
                <div class="artist-stat">
                    <div class="artist-stat-number">${musicData.songs.filter(s => s.artistId === artist.id).length}</div>
                    <div class="artist-stat-label">Tracks</div>
                </div>
            </div>
            <div class="artist-actions">
                <button onclick="followArtist(${artist.id}, event)">Follow</button>
                <button onclick="viewArtistSongs(${artist.id}, event)">Songs</button>
            </div>
        </div>
    `).join('');
}

// ===== TRENDING DISPLAY =====
function displayTrendingSongs() {
    const list = document.getElementById('trendingList');
    const trending = musicData.songs.sort((a, b) => b.plays - a.plays).slice(0, 5);
    
    list.innerHTML = trending.map((song, index) => `
        <div class="trending-item" onclick="openSongModal(${song.id})">
            <div class="trending-rank">#${index + 1}</div>
            <div class="trending-thumbnail">${song.artist.charAt(0)}</div>
            <div class="trending-details">
                <div class="trending-title">${song.title}</div>
                <div class="trending-artist">${song.artist}</div>
                <div class="trending-stats">
                    <span><i class="fas fa-play"></i> ${song.plays}K plays</span>
                    <span><i class="fas fa-download"></i> ${song.downloads} downloads</span>
                </div>
            </div>
            <div class="trending-actions">
                <button onclick="playSong(${song.id}, event)" title="Play">
                    <i class="fas fa-play"></i>
                </button>
                <button onclick="downloadSong(${song.id}, event)" title="Download">
                    <i class="fas fa-download"></i>
                </button>
                <button onclick="addToFavorites(${song.id}, event)" title="Add to Favorites">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== PLAY SONG =====
function playSong(songId, event) {
    if (event) event.stopPropagation();
    
    const song = musicData.songs.find(s => s.id === songId);
    if (!song) return;

    currentSongIndex = songId;
    isPlaying = true;

    // Update player display
    document.getElementById('playerTitle').textContent = song.title;
    document.getElementById('playerArtist').textContent = song.artist;
    document.getElementById('duration').textContent = formatTime(song.duration);
    document.getElementById('playBtn').innerHTML = '<i class="fas fa-pause"></i>';

    // Simulate auto-play
    simulatePlayback(song);
    showNotification(`♪ Now playing: ${song.title}`);
}

function simulatePlayback(song) {
    const audio = document.getElementById('audioPlayer');
    let currentTime = 0;
    const duration = song.duration;

    const interval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(interval);
            return;
        }

        currentTime++;
        const progress = (currentTime / duration) * 100;
        document.getElementById('progress').style.width = progress + '%';
        document.getElementById('currentTime').textContent = formatTime(currentTime);

        if (currentTime >= duration) {
            clearInterval(interval);
            if (autoPlay) {
                playNextSong();
            } else {
                isPlaying = false;
                document.getElementById('playBtn').innerHTML = '<i class="fas fa-play"></i>';
            }
        }
    }, 1000);
}

// ===== DOWNLOAD SONG =====
function downloadSong(songId, event) {
    if (event) event.stopPropagation();

    const song = musicData.songs.find(s => s.id === songId);
    if (!song) return;

    if (!downloadedSongs.find(s => s.id === songId)) {
        const downloadedSong = {
            ...song,
            downloadDate: new Date().toLocaleString()
        };
        downloadedSongs.push(downloadedSong);
        localStorage.setItem('downloadedSongs', JSON.stringify(downloadedSongs));
        displayDownloads();
        showNotification(`✓ Downloaded: ${song.title}`);
    } else {
        showNotification(`Already downloaded: ${song.title}`);
    }
}

// ===== DISPLAY DOWNLOADS =====
function displayDownloads() {
    const grid = document.getElementById('downloadsGrid');
    
    if (downloadedSongs.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No downloads yet</p>
                <small>Click the download button on any song to get started</small>
            </div>
        `;
        return;
    }

    grid.innerHTML = downloadedSongs.map(song => `
        <div class="song-card">
            <div class="song-thumbnail">${song.artist.charAt(0)}</div>
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
            <div class="song-meta">
                <span><i class="fas fa-calendar"></i> ${song.downloadDate}</span>
            </div>
            <div class="song-actions">
                <button class="action-btn" onclick="playSong(${song.id})">
                    <i class="fas fa-play"></i>
                </button>
                <button class="action-btn" onclick="removeSongDownload(${song.id}, event)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function removeSongDownload(songId, event) {
    if (event) event.stopPropagation();
    downloadedSongs = downloadedSongs.filter(s => s.id !== songId);
    localStorage.setItem('downloadedSongs', JSON.stringify(downloadedSongs));
    displayDownloads();
    showNotification('Removed from downloads');
}

// ===== MODALS =====
function openSongModal(songId) {
    const song = musicData.songs.find(s => s.id === songId);
    if (!song) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">${song.artist.charAt(0)}</div>
            <h2>${song.title}</h2>
            <p style="color: #b3b3b3; margin-bottom: 1.5rem;">${song.artist}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                <div>
                    <div style="font-size: 0.85rem; color: #b3b3b3;">Duration</div>
                    <div style="font-size: 1.3rem; color: #0066ff;">${formatTime(song.duration)}</div>
                </div>
                <div>
                    <div style="font-size: 0.85rem; color: #b3b3b3;">Plays</div>
                    <div style="font-size: 1.3rem; color: #0066ff;">${song.plays}K</div>
                </div>
                <div>
                    <div style="font-size: 0.85rem; color: #b3b3b3;">Downloads</div>
                    <div style="font-size: 1.3rem; color: #0066ff;">${song.downloads}</div>
                </div>
                <div>
                    <div style="font-size: 0.85rem; color: #b3b3b3;">Genre</div>
                    <div style="font-size: 1.3rem; color: #0066ff;">Music</div>
                </div>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button class="btn btn-primary" onclick="playSong(${song.id})">
                    <i class="fas fa-play"></i> Play Now
                </button>
                <button class="btn btn-secondary" onclick="downloadSong(${song.id})">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    `;

    document.getElementById('songModal').style.display = 'block';
}

function openArtistModal(artistId) {
    const artist = musicData.artists.find(a => a.id === artistId);
    if (!artist) return;

    const artistSongs = musicData.songs.filter(s => s.artistId === artistId);
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">${artist.image}</div>
            <h2>${artist.name}</h2>
            <p style="color: #b3b3b3; margin-bottom: 1rem;">${artist.genre}</p>
            <p style="color: #0066ff; margin-bottom: 1.5rem;">${artist.followers.toLocaleString()} Followers</p>
            <h3 style="margin-top: 1.5rem; margin-bottom: 1rem;">Top Tracks</h3>
            <div style="text-align: left; max-height: 300px; overflow-y: auto;">
                ${artistSongs.map(song => `
                    <div style="padding: 0.75rem; border-bottom: 1px solid rgba(0, 102, 255, 0.2);">
                        <div style="font-weight: 600;">${song.title}</div>
                        <div style="color: #b3b3b3; font-size: 0.9rem;">${formatTime(song.duration)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.getElementById('songModal').style.display = 'block';
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    document.getElementById('playBtn').addEventListener('click', togglePlay);
    document.getElementById('nextBtn').addEventListener('click', playNextSong);
    document.getElementById('prevBtn').addEventListener('click', playPrevSong);
    document.getElementById('autoPlayBtn').addEventListener('click', toggleAutoPlay);
    document.getElementById('downloadBtn').addEventListener('click', downloadCurrentSong);

    document.querySelector('.close-btn').addEventListener('click', () => {
        document.getElementById('songModal').style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('songModal');
        if (e.target === modal) modal.style.display = 'none';
    });

    document.getElementById('searchInput').addEventListener('input', filterSearch);
}

function togglePlay() {
    isPlaying = !isPlaying;
    const btn = document.getElementById('playBtn');
    btn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

function playNextSong() {
    if (currentSongIndex < musicData.songs.length - 1) {
        playSong(currentSongIndex + 1);
    }
}

function playPrevSong() {
    if (currentSongIndex > 0) {
        playSong(currentSongIndex - 1);
    }
}

function toggleAutoPlay() {
    autoPlay = !autoPlay;
    const btn = document.getElementById('autoPlayBtn');
    btn.style.color = autoPlay ? '#1db954' : '#0066ff';
    showNotification(autoPlay ? 'Auto-play enabled' : 'Auto-play disabled');
}

function downloadCurrentSong() {
    if (currentSongIndex > 0) {
        downloadSong(currentSongIndex);
    }
}

function addToFavorites(songId, event) {
    if (event) event.stopPropagation();
    showNotification('Added to favorites ♥');
}

function followArtist(artistId, event) {
    if (event) event.stopPropagation();
    const artist = musicData.artists.find(a => a.id === artistId);
    showNotification(`Followed ${artist.name}`);
}

function viewArtistSongs(artistId, event) {
    if (event) event.stopPropagation();
    const artist = musicData.artists.find(a => a.id === artistId);
    openArtistModal(artistId);
}

function filterSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    // Implement search filtering for songs and artists
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// ===== UTILITIES =====
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

function loadDownloads() {
    const stored = localStorage.getItem('downloadedSongs');
    if (stored) {
        downloadedSongs = JSON.parse(stored);
    }
}
