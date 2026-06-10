/* ==========================================================================
   SONG DATABASE CONFIGURATION
   ========================================================================== */
const PLAYLIST_DATA = {
    love: {
        emoji: "❤️",
        title: "Love",
        description: "Some songs aren't about a person. These are.",
        accentColor: "var(--accent-pink)",
        songs: [
            { title: "Tu Hi Haqeeqat", artist: "Pritam, Mohammad Irfan", file: "audio/tu_hi_haqeeqat.mp3" },
            { title: "Tera Hone Laga Hoon", artist: "Atif Aslam, Alisha Chinai", file: "audio/tera_hone_laga_hoon.mp3" },
            { title: "Aise Zaroori Ho Mujhko Tum Jaise Hawaayein Saanson Ko", artist: "Kshitij Tarey, Shilpa Rao", file: "audio/aise_zaroori_ho_mujhko.mp3" }
        ]
    },
    care: {
        emoji: "🌸",
        title: "Care",
        description: "The songs that remind me of the way you care.",
        accentColor: "var(--accent-lavender)",
        songs: [
            { title: "Raahon Mein Tumko Jo Dhoop Sataye, Chaand Bichha Denge Hum Chaar Qadam", artist: "Shreya Ghoshal, Shaan", file: "audio/raahon_mein_tumko.mp3" },
            { title: "Main Teri Nazar Utaaru", artist: "Lata Mangeshkar", file: "audio/main_teri_nazar_utaaru.mp3" }
        ]
    },
    comfort: {
        emoji: "✨",
        title: "Comfort",
        description: "The songs that feel like peace after a long day.",
        accentColor: "var(--accent-lavender)",
        songs: [
            { title: "Teri Baahon Mein Mili Aisi Raahat Si Mujhe", artist: "Shreya Ghoshal", file: "audio/teri_baahon_mein.mp3" },
            { title: "Meherbaan Hua Hua", artist: "Ash King, Shilpa Rao", file: "audio/meherbaan_hua_hua.mp3" }
        ]
    },
    admiration: {
        emoji: "😍",
        title: "Admiration",
        description: "Some people make observation easy.",
        accentColor: "var(--accent-pink)",
        songs: [
            { title: "Sundar Sundar Wo Haseena Badi Sundar Sundar", artist: "Pritam", file: "audio/sundar_sundar.mp3" },
            { title: "Deewana Kar Raha Hai Tera Roop Sunehra", artist: "Javed Ali", file: "audio/deewana_kar_raha_hai.mp3" },
            { title: "Gulabi Aankhen", artist: "Mohammed Rafi", file: "audio/gulabi_aankhen.mp3" }
        ]
    },
    destiny: {
        emoji: "💫",
        title: "Destiny",
        description: "Some meetings feel planned.",
        accentColor: "var(--accent-lavender)",
        songs: [
            { title: "Itthe Koi Na Milda Aappe, Tab Milaonda Hai", artist: "Sajjan Adeeb", file: "audio/itthe_koi_na_milda.mp3" }
        ]
    },
    mystery: {
        emoji: "🎭",
        title: "Mystery",
        description: "Still trying to figure you out.",
        accentColor: "var(--accent-lavender)",
        songs: [
            { title: "Dooran Dooran", artist: "Guri", file: "audio/dooran_dooran.mp3" }
        ]
    },
    special: {
        emoji: "👑",
        title: "Special",
        description: "Saved for last. This one never really had competition.",
        accentColor: "var(--gold)",
        songs: [
            { title: "Tumse Behtar", artist: "Arijit Singh", file: "audio/tumse_behtar.mp3" }
        ]
    }
};
/* ==========================================================================
   GLOBAL APP STATE
   ========================================================================== */
const state = {
    visitedCards: new Set(JSON.parse(localStorage.getItem("bhartee_playlist_visited") || "[]")),
    isSpecialUnlocked: localStorage.getItem("bhartee_playlist_special_unlocked") === "true",
    activeCategory: null,
    currentTrackIndex: 0,
    isPlaying: false,
    audioElement: new Audio(),
    stars: []
};
// Initializing lucide icons
lucide.createIcons();
/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
const DOM = {
    landingScreen: document.getElementById("landing-screen"),
    cardsScreen: document.getElementById("cards-screen"),
    playerModal: document.getElementById("player-modal"),
    vampireModal: document.getElementById("vampire-modal"),
    unlockOverlay: document.getElementById("unlock-overlay"),
    finalScreen: document.getElementById("final-screen"),
    
    // Buttons
    startBtn: document.getElementById("start-btn"),
    playerCloseBtn: document.getElementById("player-close-btn"),
    vampireCloseBtn: document.getElementById("vampire-close-btn"),
    reportVampireBtn: document.getElementById("report-vampire-btn"),
    unlockProceedBtn: document.getElementById("unlock-proceed-btn"),
    playPauseBtn: document.getElementById("play-pause-btn"),
    prevTrackBtn: document.getElementById("prev-track-btn"),
    nextTrackBtn: document.getElementById("next-track-btn"),
    volumeToggleBtn: document.getElementById("volume-toggle-btn"),
    
    // Player details
    playerCategoryBadge: document.getElementById("player-category-badge"),
    playerDiscEmoji: document.getElementById("player-disc-emoji"),
    nowPlayingTitle: document.getElementById("now-playing-title"),
    nowPlayingDesc: document.getElementById("now-playing-desc"),
    playlistUl: document.getElementById("playlist-ul"),
    albumDisc: document.querySelector(".album-art-disc"),
    
    // Sliders
    audioProgress: document.getElementById("audio-progress"),
    sliderFillVisual: document.getElementById("slider-fill-visual"),
    volumeSlider: document.getElementById("volume-slider"),
    volumeFillVisual: document.getElementById("volume-fill-visual"),
    timeCurrent: document.getElementById("time-current"),
    timeTotal: document.getElementById("time-total"),
    
    // Cards
    cards: document.querySelectorAll(".glass-card"),
    specialCard: document.getElementById("special-card"),
    
    // Progress
    progressText: document.getElementById("progress-text"),
    progressBarFill: document.getElementById("progress-bar-fill"),
    
    // Canvas
    starsCanvas: document.getElementById("stars-canvas"),
    
    // Toast
    toast: document.getElementById("audio-error-toast"),
    toastMsg: document.getElementById("toast-message"),
    toastCopyBtn: document.getElementById("toast-copy-btn"),
    toastCloseBtn: document.getElementById("toast-close-btn")
};
/* ==========================================================================
   BACKGROUND CANVAS STARS
   ========================================================================== */
function initStars() {
    const canvas = DOM.starsCanvas;
    const ctx = canvas.getContext("2d");
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    // Create star points
    const starCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 12000));
    state.stars = [];
    
    for (let i = 0; i < starCount; i++) {
        state.stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.7 + 0.3,
            twinkleSpeed: 0.005 + Math.random() * 0.015,
            direction: Math.random() > 0.5 ? 1 : -1
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFFFFF";
        
        state.stars.forEach(star => {
            // Update alpha for twinkling
            star.alpha += star.twinkleSpeed * star.direction;
            if (star.alpha >= 1) {
                star.alpha = 1;
                star.direction = -1;
            } else if (star.alpha <= 0.15) {
                star.alpha = 0.15;
                star.direction = 1;
            }
            
            ctx.globalAlpha = star.alpha;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.globalAlpha = 1.0;
        requestAnimationFrame(animate);
    }
    
    animate();
}
/* ==========================================================================
   TILT EFFECT ON HOVER
   ========================================================================== */
function initTilt() {
    DOM.cards.forEach(card => {
        // Skip adding tilt physics to locked card
        if (card.classList.contains("locked")) return;
        
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate within element
            const y = e.clientY - rect.top;  // y coordinate within element
            
            // Set radial gradient center for glow
            card.style.setProperty("--x", `${(x / rect.width) * 100}%`);
            card.style.setProperty("--y", `${(y / rect.height) * 100}%`);
            
            // Calculate tilt angle (max 10 degrees)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((centerY - y) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.transform = "rotateX(0) rotateY(0) scale(1)";
            card.style.setProperty("--x", "50%");
            card.style.setProperty("--y", "50%");
        });
    });
}
// Re-init tilt specifically for special card once unlocked
function initSpecialCardTilt() {
    const card = DOM.specialCard;
    if (card.classList.contains("locked")) return;
    
    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--x", `${(x / rect.width) * 100}%`);
        card.style.setProperty("--y", `${(y / rect.height) * 100}%`);
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((centerY - y) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });
    
    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
        card.style.setProperty("--x", "50%");
        card.style.setProperty("--y", "50%");
    });
}
/* ==========================================================================
   PROGRESS TRACKER & CARD LOCK SYSTEM
   ========================================================================== */
const TOTAL_STANDARD_CARDS = 7; // Love, Care, Comfort, Admiration, Destiny, Mystery, Vampire
function updateProgressUI() {
    const visited = state.visitedCards;
    // We only count the 7 regular cards for unlocking the Special card
    const regularVisitedCount = Array.from(visited).filter(c => c !== 'special').length;
    
    // Update progress text & bar
    DOM.progressText.textContent = `${regularVisitedCount} / ${TOTAL_STANDARD_CARDS} Explored`;
    const percent = (regularVisitedCount / TOTAL_STANDARD_CARDS) * 100;
    DOM.progressBarFill.style.width = `${percent}%`;
    
    // Sync UI visited classes on cards
    DOM.cards.forEach(card => {
        const cardKey = card.getAttribute("data-card");
        if (visited.has(cardKey)) {
            card.classList.add("visited");
        }
    });
    
    // Check if we should unlock the special card
    if (regularVisitedCount === TOTAL_STANDARD_CARDS && !state.isSpecialUnlocked) {
        unlockSpecialSequence();
    } else if (state.isSpecialUnlocked) {
        enableSpecialCardUI();
    }
}
function markCardVisited(cardKey) {
    if (!state.visitedCards.has(cardKey)) {
        state.visitedCards.add(cardKey);
        localStorage.setItem("bhartee_playlist_visited", JSON.stringify(Array.from(state.visitedCards)));
        updateProgressUI();
    }
}
function enableSpecialCardUI() {
    DOM.specialCard.classList.remove("locked");
    DOM.specialCard.classList.add("unlocked-premium");
    initSpecialCardTilt();
}
function unlockSpecialSequence() {
    state.isSpecialUnlocked = true;
    localStorage.setItem("bhartee_playlist_special_unlocked", "true");
    
    // Wait briefly for modal exits to finish before prompting unlock
    setTimeout(() => {
        DOM.unlockOverlay.classList.remove("hidden");
        // Force reflow
        DOM.unlockOverlay.offsetHeight;
        DOM.unlockOverlay.classList.add("active");
        
        // Soft haptic/alert animation
        DOM.specialCard.classList.add("unlocking-pulse");
    }, 800);
}
/* ==========================================================================
   CUSTOM PLAYER ENGINE
   ========================================================================== */
function setupPlayerEvents() {
    const audio = state.audioElement;
    
    audio.addEventListener("timeupdate", () => {
        if (!audio.duration) return;
        
        // Progress percentage
        const pct = (audio.currentTime / audio.duration) * 100;
        DOM.audioProgress.value = pct;
        DOM.sliderFillVisual.style.width = `${pct}%`;
        
        // Track current time formatting
        DOM.timeCurrent.textContent = formatTime(audio.currentTime);
    });
    
    audio.addEventListener("durationchange", () => {
        DOM.timeTotal.textContent = formatTime(audio.duration || 0);
    });
    
    audio.addEventListener("ended", () => {
        playNextTrack();
    });
    
    audio.addEventListener("error", (e) => {
        console.error("Audio playback error: ", e);
        // If playing fails (e.g. file doesn't exist), pause disc animation and show warning toast
        setPlayingState(false);
        
        const categorySongs = PLAYLIST_DATA[state.activeCategory]?.songs;
        const currentSong = categorySongs ? categorySongs[state.currentTrackIndex] : null;
        
        if (currentSong) {
            showAudioErrorToast(currentSong.file);
        }
    });
    // Sync input sliders visual fills on manual dragging
    DOM.audioProgress.addEventListener("input", () => {
        const val = DOM.audioProgress.value;
        DOM.sliderFillVisual.style.width = `${val}%`;
        if (audio.duration) {
            audio.currentTime = (val / 100) * audio.duration;
        }
    });
    
    DOM.volumeSlider.addEventListener("input", () => {
        const val = DOM.volumeSlider.value;
        audio.volume = val;
        DOM.volumeFillVisual.style.width = `${val * 100}%`;
        
        // Switch volume icons if muted
        if (parseFloat(val) === 0) {
            audio.muted = true;
            DOM.volumeToggleBtn.querySelector(".vol-icon").classList.add("hidden");
            DOM.volumeToggleBtn.querySelector(".mute-icon").classList.remove("hidden");
        } else {
            audio.muted = false;
            DOM.volumeToggleBtn.querySelector(".vol-icon").classList.remove("hidden");
            DOM.volumeToggleBtn.querySelector(".mute-icon").classList.add("hidden");
        }
    });
}
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
function loadCategoryInPlayer(categoryKey) {
    state.activeCategory = categoryKey;
    const catData = PLAYLIST_DATA[categoryKey];
    
    // Style adjustments for special card experience
    if (categoryKey === "special") {
        DOM.playerModal.classList.add("premium-reveal-card");
        DOM.playerCategoryBadge.classList.add("premium-reveal-title");
        DOM.nowPlayingTitle.classList.add("special-prompt-text");
    } else {
        DOM.playerModal.classList.remove("premium-reveal-card");
        DOM.playerCategoryBadge.classList.remove("premium-reveal-title");
        DOM.nowPlayingTitle.classList.remove("special-prompt-text");
    }
    
    // Set headers
    DOM.playerCategoryBadge.textContent = `${catData.emoji} ${catData.title}`;
    DOM.playerDiscEmoji.textContent = catData.emoji;
    
    // Render list
    DOM.playlistUl.innerHTML = "";
    catData.songs.forEach((song, idx) => {
        const li = document.createElement("li");
        li.className = `track-item ${idx === 0 ? 'active' : ''}`;
        li.setAttribute("data-index", idx);
        
        li.innerHTML = `
            <div class="track-info-left">
                <span class="track-num-title">${idx + 1}. ${song.title}</span>
                <span class="track-subtitle">${song.artist}</span>
            </div>
            <div class="track-play-indicator">
                <i data-lucide="music" style="width: 14px; height: 14px;"></i>
            </div>
        `;
        
        li.addEventListener("click", () => {
            playTrack(idx);
        });
        
        DOM.playlistUl.appendChild(li);
    });
    
    // Re-trigger lucide icons inside track items
    lucide.createIcons();
    
    // Select first track
    playTrack(0, false); // load but do not force play on initial modal opening (browser policy)
}
function playTrack(index, shouldPlay = true) {
    const catData = PLAYLIST_DATA[state.activeCategory];
    if (!catData || !catData.songs[index]) return;
    
    state.currentTrackIndex = index;
    const song = catData.songs[index];
    
    // UI tracking active state in list
    const items = DOM.playlistUl.querySelectorAll(".track-item");
    items.forEach((item, idx) => {
        if (idx === index) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
    
    // Set track values
    // Special presentation timings:
    if (state.activeCategory === "special") {
        DOM.nowPlayingTitle.textContent = "Saved for last.";
        DOM.nowPlayingDesc.textContent = "Loading song...";
        
        // Sequential description fades
        setTimeout(() => {
            DOM.nowPlayingTitle.textContent = "This one never really had competition.";
        }, 3000);
    } else {
        DOM.nowPlayingTitle.textContent = song.title;
        DOM.nowPlayingDesc.textContent = catData.description;
    }
    
    // Load source
    state.audioElement.src = song.file;
    state.audioElement.load();
    
    // Set slider defaults
    DOM.audioProgress.value = 0;
    DOM.sliderFillVisual.style.width = "0%";
    DOM.timeCurrent.textContent = "0:00";
    DOM.timeTotal.textContent = "0:00";
    
    if (shouldPlay) {
        const playPromise = state.audioElement.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setPlayingState(true);
            }).catch(err => {
                console.log("Autoplay was blocked or file missing: ", err);
                setPlayingState(false);
            });
        }
    } else {
        setPlayingState(false);
    }
}
function setPlayingState(playing) {
    state.isPlaying = playing;
    if (playing) {
        DOM.playPauseBtn.querySelector(".play-icon").classList.add("hidden");
        DOM.playPauseBtn.querySelector(".pause-icon").classList.remove("hidden");
        DOM.albumDisc.style.animationPlayState = "running";
    } else {
        DOM.playPauseBtn.querySelector(".play-icon").classList.remove("hidden");
        DOM.playPauseBtn.querySelector(".pause-icon").classList.add("hidden");
        DOM.albumDisc.style.animationPlayState = "paused";
    }
}
function togglePlayPause() {
    if (state.isPlaying) {
        state.audioElement.pause();
        setPlayingState(false);
    } else {
        // Play
        state.audioElement.play().then(() => {
            setPlayingState(true);
        }).catch(err => {
            console.log("Playback error: ", err);
            const catData = PLAYLIST_DATA[state.activeCategory];
            const song = catData?.songs[state.currentTrackIndex];
            if (song) showAudioErrorToast(song.file);
        });
    }
}
function playNextTrack() {
    const catData = PLAYLIST_DATA[state.activeCategory];
    if (!catData) return;
    
    let nextIndex = state.currentTrackIndex + 1;
    if (nextIndex >= catData.songs.length) {
        nextIndex = 0; // Wrap around
    }
    playTrack(nextIndex, true);
}
function playPrevTrack() {
    const catData = PLAYLIST_DATA[state.activeCategory];
    if (!catData) return;
    
    let prevIndex = state.currentTrackIndex - 1;
    if (prevIndex < 0) {
        prevIndex = catData.songs.length - 1; // Wrap around
    }
    playTrack(prevIndex, true);
}
/* ==========================================================================
   ERROR NOTIFICATION SYSTEM
   ========================================================================== */
let toastTimeout;
function showAudioErrorToast(filePath) {
    DOM.toastMsg.textContent = `Please add the song to: "${filePath}"`;
    DOM.toast.classList.remove("hidden");
    
    // Force browser reflow
    DOM.toast.offsetHeight;
    DOM.toast.classList.add("active");
    
    // Configure copy button behavior
    DOM.toastCopyBtn.onclick = () => {
        // Copy relative audio filename
        navigator.clipboard.writeText(filePath).then(() => {
            const lbl = DOM.toastCopyBtn.querySelector(".copy-lbl");
            const originalText = lbl.textContent;
            lbl.textContent = "Copied!";
            setTimeout(() => {
                lbl.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error("Could not copy text: ", err);
        });
    };
    
    // Auto hide after 8s
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(hideAudioErrorToast, 8000);
}
function hideAudioErrorToast() {
    DOM.toast.classList.remove("active");
    setTimeout(() => {
        DOM.toast.classList.add("hidden");
    }, 500);
}
/* ==========================================================================
   NAVIGATION & UI EVENT HANDLERS
   ========================================================================== */
function initNavigation() {
    // 1. Landing Screen to Grid Screen
    DOM.startBtn.addEventListener("click", () => {
        DOM.landingScreen.classList.add("hidden");
        DOM.landingScreen.classList.remove("active");
        DOM.cardsScreen.classList.add("active");
    });
    
    // 2. Open Category Card
    DOM.cards.forEach(card => {
        card.addEventListener("click", () => {
            const cardKey = card.getAttribute("data-card");
            
            if (cardKey === "special" && card.classList.contains("locked")) {
                // Shake locked animation
                card.classList.add("unlock-shake-anim");
                setTimeout(() => card.classList.remove("unlock-shake-anim"), 500);
                return;
            }
            
            if (cardKey === "vampire") {
                // Open Vampire Checklist Modal
                markCardVisited("vampire");
                DOM.vampireModal.classList.add("active");
            } else {
                // Open Playlist Modal
                markCardVisited(cardKey);
                loadCategoryInPlayer(cardKey);
                DOM.playerModal.classList.add("active");
            }
        });
    });
    
    // 3. Close Player Modal
    DOM.playerCloseBtn.addEventListener("click", () => {
        state.audioElement.pause();
        setPlayingState(false);
        DOM.playerModal.classList.remove("active");
        checkFinalTransition();
    });
    
    // 4. Close Vampire Modal
    DOM.vampireCloseBtn.addEventListener("click", () => {
        DOM.vampireModal.classList.remove("active");
        checkFinalTransition();
    });
    
    // 5. Vampire Report Activity Button
    DOM.reportVampireBtn.addEventListener("click", () => {
        // Premium customized popup overlay instead of basic alert
        showCustomPopup("Evidence already sufficient.");
    });
    
    // 6. Dismiss Special Unlocked Overlay
    DOM.unlockProceedBtn.addEventListener("click", () => {
        DOM.unlockOverlay.classList.remove("active");
        setTimeout(() => {
            DOM.unlockOverlay.classList.add("hidden");
            // Remove pulsers and enable tilt on special card
            DOM.specialCard.classList.remove("unlocking-pulse");
            enableSpecialCardUI();
        }, 800);
    });
    
    // 7. Toast Dismiss
    DOM.toastCloseBtn.addEventListener("click", hideAudioErrorToast);
}
/* ==========================================================================
   CUSTOM MODAL POPUP
   ========================================================================== */
function showCustomPopup(messageText) {
    const popup = document.createElement("div");
    popup.className = "custom-popup-overlay";
    popup.innerHTML = `
        <div class="custom-popup-card">
            <span class="popup-icon">🦇</span>
            <p class="popup-text">${messageText}</p>
            <button class="popup-close-btn">Close</button>
        </div>
    `;
    
    // Styles inside js container to isolate and avoid CSS bloat
    const style = document.createElement("style");
    style.id = "popup-styles";
    style.textContent = `
        .custom-popup-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(6, 8, 16, 0.85);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: flex; justify-content: center; align-items: center;
            opacity: 0; transition: opacity 0.4s ease;
        }
        .custom-popup-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            padding: 30px 24px;
            width: 85%;
            max-width: 320px;
            text-align: center;
            backdrop-filter: blur(20px);
            transform: scale(0.9); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5);
        }
        .popup-icon {
            font-size: 2.5rem;
            display: block; margin-bottom: 12px;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }
        .popup-text {
            font-size: 1.05rem;
            color: var(--text-primary);
            font-weight: 400;
            margin-bottom: 24px;
        }
        .popup-close-btn {
            background: #FFFFFF;
            border: none; color: #060810;
            padding: 12px 28px;
            border-radius: 30px;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: var(--transition-smooth);
            width: 100%;
        }
        .popup-close-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(popup);
    
    // Force reflow
    popup.offsetHeight;
    
    // Trigger transition
    popup.style.opacity = "1";
    popup.querySelector(".custom-popup-card").style.transform = "scale(1)";
    
    // Event listeners
    const closeBtn = popup.querySelector(".popup-close-btn");
    closeBtn.addEventListener("click", () => {
        popup.style.opacity = "0";
        popup.querySelector(".custom-popup-card").style.transform = "scale(0.9)";
        setTimeout(() => {
            popup.remove();
            style.remove();
        }, 400);
    });
}
/* ==========================================================================
   FINAL EXPERIENCE ENDING TIMINGS
   ========================================================================== */
function checkFinalTransition() {
    const visited = state.visitedCards;
    // Check if ALL 8 cards have been visited/explored
    const totalVisited = visited.size; // 7 regular + 1 special
    
    if (totalVisited === 8) {
        // All cards explored, transition to final elegant credits screen
        setTimeout(() => {
            DOM.cardsScreen.classList.remove("active");
            DOM.cardsScreen.classList.add("hidden");
            
            DOM.finalScreen.classList.add("active");
            // Force layout reflow
            DOM.finalScreen.offsetHeight;
        }, 1000);
    }
}
/* ==========================================================================
   AUDIO INITIALIZATIONS & VOLUME DEFAULT FILLS
   ========================================================================== */
function initVolumeSlider() {
    const defaultVol = state.audioElement.volume;
    DOM.volumeSlider.value = defaultVol;
    DOM.volumeFillVisual.style.width = `${defaultVol * 100}%`;
}
/* ==========================================================================
   PAGE SETUP / STARTUP INVOCATION
   ========================================================================== */
window.addEventListener("DOMContentLoaded", () => {
    // 1. Particle Simulation
    initStars();
    
    // 2. Element Tilt bindings
    initTilt();
    
    // 3. Navigation routes setup
    initNavigation();
    
    // 4. Custom Player events
    setupPlayerEvents();
    
    // 5. Volume layout defaults
    initVolumeSlider();
    
    // 6. Restore saved progress
    updateProgressUI();
    
    // Double check if volume control toggle works
    DOM.volumeToggleBtn.addEventListener("click", () => {
        const audio = state.audioElement;
        audio.muted = !audio.muted;
        
        if (audio.muted) {
            DOM.volumeToggleBtn.querySelector(".vol-icon").classList.add("hidden");
            DOM.volumeToggleBtn.querySelector(".mute-icon").classList.remove("hidden");
            DOM.volumeFillVisual.style.width = "0%";
        } else {
            DOM.volumeToggleBtn.querySelector(".vol-icon").classList.remove("hidden");
            DOM.volumeToggleBtn.querySelector(".mute-icon").classList.add("hidden");
            DOM.volumeFillVisual.style.width = `${audio.volume * 100}%`;
        }
    });
    
    // Double check Player Play/Pause button
    DOM.playPauseBtn.addEventListener("click", togglePlayPause);
    
    // Previous & Next navigation button bindings
    DOM.prevTrackBtn.addEventListener("click", playPrevTrack);
    DOM.nextTrackBtn.addEventListener("click", playNextTrack);
});
