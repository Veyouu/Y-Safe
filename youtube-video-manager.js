// YouTube Video Manager for First Aid Tutorials
class YouTubeVideoManager {
    constructor() {
        this.videos = [
            {
                id: 'triangular-bandage-parts',
                title: 'Parts of Triangular Bandage',
                topic: 'bandage-basics',
                videoId: 'A7UIePi5ngM',
                description: 'Learn the different parts and components of a triangular bandage for proper first aid application',
                duration: '5:23'
            },
            {
                id: 'burn-face-head',
                title: 'Burn on Face and/or Back of Head',
                topic: 'burn-treatment',
                videoId: '4NnhldZISuQ',
                description: 'Proper treatment techniques for burns affecting the face and head area',
                duration: '8:15'
            },
            {
                id: 'triangular-bandage-application',
                title: 'Triangular Bandage Application',
                topic: 'bandage-basics',
                videoId: '4NnhldZISuQ',
                description: 'Complete guide on how to apply triangular bandages for various injuries',
                duration: '6:45'
            },
            {
                id: 'arm-sling',
                title: 'Arm Sling Technique',
                topic: 'slings-support',
                videoId: 'PzZPxMwozE4',
                description: 'Step-by-step instructions for creating and applying arm slings',
                duration: '4:30'
            },
            {
                id: 'wound-forearm',
                title: 'Wound on Forearm Treatment',
                topic: 'wound-care',
                videoId: 'PzZPxMwozE4',
                description: 'Proper first aid for wounds located on the forearm',
                duration: '7:12'
            },
            {
                id: 'wound-head',
                title: 'Wound on Top of Head',
                topic: 'wound-care',
                videoId: 'PzZPxMwozE4',
                description: 'Emergency treatment for head wounds and injuries',
                duration: '9:20'
            },
            {
                id: 'square-knot',
                title: 'Square Knot Technique',
                topic: 'knot-tying',
                videoId: '40TQ7qFwEfs',
                description: 'Essential knot-tying skill for securing bandages and dressings',
                duration: '3:45'
            },
            {
                id: 'burn-hand',
                title: 'Burn on Hand Treatment',
                topic: 'burn-treatment',
                videoId: 'x4QndeNf85A',
                description: 'Proper first aid procedures for hand burns and injuries',
                duration: '6:30'
            }
        ];

        this.topics = {
            'bandage-basics': {
                name: 'Bandage Basics',
                icon: '🩹',
                color: '#e53e3e',
                description: 'Fundamental bandage techniques and applications'
            },
            'burn-treatment': {
                name: 'Burn Treatment',
                icon: '🔥',
                color: '#dd6b20',
                description: 'Emergency care for burn injuries'
            },
            'slings-support': {
                name: 'Slings & Support',
                icon: '💪',
                color: '#3182ce',
                description: 'Creating and applying supportive slings'
            },
            'wound-care': {
                name: 'Wound Care',
                icon: '🩺',
                color: '#38a169',
                description: 'Treatment and dressing of various wounds'
            },
            'knot-tying': {
                name: 'Knot Tying',
                icon: '🪢',
                color: '#805ad5',
                description: 'Essential knots for first aid applications'
            }
        };

        this.currentTopic = 'all';
        this.players = {};
        this.init();
    }

    init() {
        this.loadYouTubeAPI();
        this.createLayout();
        this.attachEventListeners();
    }

    loadYouTubeAPI() {
        // Load YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // This function will be called by the YouTube API
        window.onYouTubeIframeAPIReady = () => {
            this.initializePlayers();
        };
    }

    createLayout() {
        const container = document.getElementById('video-container');
        if (!container) return;

        container.innerHTML = `
            <div class="video-manager">
                <header class="manager-header">
                    <h1>🚑 First Aid Video Tutorials</h1>
                    <p>Essential medical emergency training videos organized by topic</p>
                </header>

                <div class="topic-navigation">
                    <div class="topic-buttons" id="topicButtons">
                        <button class="topic-btn active" data-topic="all">
                            📚 All Videos
                        </button>
                    </div>
                </div>

                <div class="video-grid" id="videoGrid">
                    <!-- Videos will be dynamically inserted here -->
                </div>

                <div class="video-modal" id="videoModal">
                    <div class="modal-content">
                        <span class="close-btn" id="closeModal">&times;</span>
                        <div class="modal-video-container" id="modalVideoContainer">
                            <!-- YouTube player will be inserted here -->
                        </div>
                        <div class="modal-info" id="modalInfo">
                            <!-- Video information will be displayed here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.createTopicButtons();
        this.renderVideos();
    }

    createTopicButtons() {
        const topicButtons = document.getElementById('topicButtons');
        
        Object.keys(this.topics).forEach(topicKey => {
            const topic = this.topics[topicKey];
            const button = document.createElement('button');
            button.className = 'topic-btn';
            button.dataset.topic = topicKey;
            button.innerHTML = `${topic.icon} ${topic.name}`;
            topicButtons.appendChild(button);
        });
    }

    renderVideos() {
        const videoGrid = document.getElementById('videoGrid');
        videoGrid.innerHTML = '';

        const filteredVideos = this.currentTopic === 'all' 
            ? this.videos 
            : this.videos.filter(video => video.topic === this.currentTopic);

        filteredVideos.forEach(video => {
            const videoCard = this.createVideoCard(video);
            videoGrid.appendChild(videoCard);
        });
    }

    createVideoCard(video) {
        const topic = this.topics[video.topic];
        const card = document.createElement('div');
        card.className = 'video-card';
        card.dataset.videoId = video.id;

        card.innerHTML = `
            <div class="video-thumbnail" onclick="videoManager.playVideo('${video.id}')">
                <img src="https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg" alt="${video.title}">
                <div class="play-overlay">
                    <div class="play-button">▶️</div>
                </div>
                <div class="duration-badge">${video.duration}</div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-description">${video.description}</p>
                <div class="video-meta">
                    <span class="topic-tag" style="background-color: ${topic.color}20; color: ${topic.color}">
                        ${topic.icon} ${topic.name}
                    </span>
                    <span class="video-duration">⏱️ ${video.duration}</span>
                </div>
                <div class="video-actions">
                    <button class="action-btn primary" onclick="videoManager.playVideo('${video.id}')">
                        ▶️ Play Now
                    </button>
                    <button class="action-btn secondary" onclick="videoManager.showVideoDetails('${video.id}')">
                        ℹ️ Details
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    initializePlayers() {
        // Initialize YouTube players for each video
        this.videos.forEach(video => {
            const playerId = `player-${video.id}`;
            this.players[video.id] = {
                element: null,
                videoId: video.videoId,
                ready: false
            };
        });
    }

    playVideo(videoId) {
        const video = this.videos.find(v => v.id === videoId);
        if (!video) return;

        const modal = document.getElementById('videoModal');
        const modalVideoContainer = document.getElementById('videoModal');
        const modalInfo = document.getElementById('modalInfo');

        // Show modal
        modal.style.display = 'flex';

        // Create or update YouTube player
        const playerDiv = document.createElement('div');
        playerDiv.id = `modal-player-${videoId}`;
        modalVideoContainer.innerHTML = '';
        modalVideoContainer.appendChild(playerDiv);

        // Create YouTube player
        new YT.Player(playerDiv.id, {
            height: '390',
            width: '640',
            videoId: video.videoId,
            playerVars: {
                'playsinline': 1,
                'autoplay': 1,
                'rel': 0,
                'showinfo': 1
            },
            events: {
                'onReady': (event) => {
                    event.target.playVideo();
                }
            }
        });

        // Update modal info
        const topic = this.topics[video.topic];
        modalInfo.innerHTML = `
            <h2>${video.title}</h2>
            <p>${video.description}</p>
            <div class="modal-meta">
                <span class="topic-tag" style="background-color: ${topic.color}20; color: ${topic.color}">
                    ${topic.icon} ${topic.name}
                </span>
                <span class="video-duration">⏱️ ${video.duration}</span>
            </div>
        `;
    }

    showVideoDetails(videoId) {
        const video = this.videos.find(v => v.id === videoId);
        if (!video) return;

        const topic = this.topics[video.topic];
        
        alert(`
📹 ${video.title}

📝 Description: ${video.description}

🏷️ Topic: ${topic.name} ${topic.icon}

⏱️ Duration: ${video.duration}

🎥 YouTube ID: ${video.videoId}

💡 Tip: Click "Play Now" to watch the full video tutorial
        `);
    }

    attachEventListeners() {
        // Topic navigation
        document.getElementById('topicButtons').addEventListener('click', (e) => {
            if (e.target.classList.contains('topic-btn')) {
                this.setTopic(e.target.dataset.topic);
            }
        });

        // Modal close
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside
        document.getElementById('videoModal').addEventListener('click', (e) => {
            if (e.target.id === 'videoModal') {
                this.closeModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setTopic(topic) {
        this.currentTopic = topic;
        
        // Update button states
        document.querySelectorAll('.topic-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.topic === topic);
        });

        // Re-render videos
        this.renderVideos();
    }

    closeModal() {
        const modal = document.getElementById('videoModal');
        modal.style.display = 'none';
        
        // Stop video playback
        const modalVideoContainer = document.getElementById('modalVideoContainer');
        modalVideoContainer.innerHTML = '';
    }

    // Utility method to get video by ID
    getVideoById(videoId) {
        return this.videos.find(v => v.id === videoId);
    }

    // Utility method to get videos by topic
    getVideosByTopic(topic) {
        return this.videos.filter(v => v.topic === topic);
    }

    // Get statistics
    getStats() {
        return {
            totalVideos: this.videos.length,
            totalTopics: Object.keys(this.topics).length,
            videosPerTopic: Object.keys(this.topics).map(topic => ({
                topic: topic,
                name: this.topics[topic].name,
                count: this.getVideosByTopic(topic).length
            }))
        };
    }
}

// Initialize the video manager when DOM is ready
let videoManager;

document.addEventListener('DOMContentLoaded', () => {
    videoManager = new YouTubeVideoManager();
    
    // Make it globally accessible
    window.videoManager = videoManager;
});

// CSS Styles
const styles = `
.video-manager {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
}

.manager-header {
    text-align: center;
    margin-bottom: 40px;
    color: #2d3748;
}

.manager-header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: #1a202c;
}

.manager-header p {
    font-size: 1.1rem;
    color: #718096;
}

.topic-navigation {
    margin-bottom: 30px;
}

.topic-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    padding: 20px;
    background: #f7fafc;
    border-radius: 10px;
}

.topic-btn {
    padding: 12px 24px;
    border: 2px solid #e2e8f0;
    background: white;
    color: #4a5568;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    font-size: 0.95rem;
}

.topic-btn:hover {
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-2px);
}

.topic-btn.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
}

.video-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.video-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.video-thumbnail {
    position: relative;
    cursor: pointer;
    overflow: hidden;
}

.video-thumbnail img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.video-thumbnail:hover img {
    transform: scale(1.05);
}

.play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.video-thumbnail:hover .play-overlay {
    opacity: 1;
}

.play-button {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    transform: scale(0);
    transition: transform 0.3s ease;
}

.video-thumbnail:hover .play-button {
    transform: scale(1);
}

.duration-badge {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
}

.video-info {
    padding: 20px;
}

.video-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 8px;
    line-height: 1.4;
}

.video-description {
    color: #718096;
    font-size: 0.95rem;
    margin-bottom: 15px;
    line-height: 1.5;
}

.video-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.topic-tag {
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 0.85rem;
    font-weight: 500;
}

.video-duration {
    color: #718096;
    font-size: 0.85rem;
}

.video-actions {
    display: flex;
    gap: 10px;
}

.action-btn {
    flex: 1;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.action-btn.primary {
    background: #667eea;
    color: white;
}

.action-btn.primary:hover {
    background: #5a67d8;
}

.action-btn.secondary {
    background: #e2e8f0;
    color: #4a5568;
}

.action-btn.secondary:hover {
    background: #cbd5e0;
}

.video-modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: white;
    border-radius: 15px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
}

.close-btn {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    color: #718096;
    z-index: 1001;
}

.close-btn:hover {
    color: #2d3748;
}

.modal-video-container {
    padding: 20px;
    background: #000;
    border-radius: 15px 15px 0 0;
}

.modal-info {
    padding: 20px;
}

.modal-info h2 {
    color: #2d3748;
    margin-bottom: 10px;
}

.modal-info p {
    color: #718096;
    margin-bottom: 15px;
    line-height: 1.5;
}

.modal-meta {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

@media (max-width: 768px) {
    .video-grid {
        grid-template-columns: 1fr;
    }
    
    .topic-buttons {
        flex-direction: column;
    }
    
    .manager-header h1 {
        font-size: 2rem;
    }
    
    .modal-content {
        width: 95%;
        margin: 10px;
    }
}
`;

// Inject CSS into the page
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);