document.addEventListener('DOMContentLoaded', () => {
  // 💖 Falling Hearts Animation
  const heartsContainer = document.querySelector('.falling-hearts') || (() => {
    const container = document.createElement('div');
    container.className = 'falling-hearts';
    document.body.insertBefore(container, document.body.firstChild);
    return container;
  })();

  function createHeart() {
    const maxHearts = 50;
    if (heartsContainer.childElementCount >= maxHearts) return;

    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '💖';
    const size = Math.random() * 24 + 12;
    heart.style.fontSize = size + 'px';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 7 + 5) + 's';
    heart.style.willChange = 'transform, opacity';
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 14000);
  }

  const heartInterval = setInterval(createHeart, 600);
  window.addEventListener('beforeunload', () => clearInterval(heartInterval));

  // 💋 AUTO-ADD KISS MARKS TO ALL FLIPPED CARDS
  const backElements = document.querySelectorAll('.letter1-card .back');
  backElements.forEach((back) => {
    // Check if kiss marks already exist to prevent duplicates
    if (!back.querySelector('.kiss1') && !back.querySelector('.kiss2')) {
      back.innerHTML = '<span class="kiss1">💋</span><span class="kiss2">💋</span>' + back.innerHTML;
    }
  });

  // ---------- Overlay, Login, and Letters ----------
  const elements = {
    preLoginOverlay: document.getElementById('preLoginOverlay'),
    preYes: document.getElementById('preYes'),
    preNo: document.getElementById('preNo'),
    confirmOverlay: document.getElementById('confirmOverlay'),
    confirmYes: document.getElementById('confirmYes'),
    confirmNo: document.querySelector('.confirm-buttons .moving-btn'),
    loginOverlay: document.getElementById('loginOverlay'),
    passwordInput: document.getElementById('pinInput'),
    passwordSubmit: document.getElementById('pinSubmit'),
    passwordError: document.getElementById('pinError'),
    bgMusic: document.getElementById('bgMusic'),
    letterModal: document.getElementById('letterModal'),
    letterTitle: document.getElementById('letterTitle'),
    letterText: document.getElementById('letterText'),
    readLetterBtn: document.getElementById('readLetterBtn'),
  };

  function showOverlay(el) {
    if (el) {
      el.style.display = 'flex';
      el.classList.add('active');
    }
  }

  function hideOverlay(el) {
    if (el) {
      el.style.display = 'none';
      el.classList.remove('active');
    }
  }

  function setModalHidden(el, isHidden) {
    if (!el) return;
    el.setAttribute('aria-hidden', isHidden);
    el.style.display = isHidden ? 'none' : 'flex';
  }

  // Step 1: Pre-login YES → Password login
  elements.preYes?.addEventListener('click', () => {
    hideOverlay(elements.preLoginOverlay);
    showOverlay(elements.loginOverlay);
    elements.passwordInput?.focus();
  });

  // Step 2: Pre-login NO → show confirmation popup
  elements.preNo?.addEventListener('click', () => {
    hideOverlay(elements.preLoginOverlay);
    elements.confirmOverlay?.classList.add('active');
  });

  // Step 3: Confirmation YES → move around
  function moveYesButton(e) {
    if (!elements.confirmOverlay || !elements.confirmYes) return;
    const overlayRect = elements.confirmOverlay.getBoundingClientRect();
    const btnRect = e.target.getBoundingClientRect();
    const maxX = Math.max(0, overlayRect.width - btnRect.width - 20);
    const maxY = Math.max(0, overlayRect.height - btnRect.height - 20);
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    e.target.style.position = 'absolute';
    e.target.style.left = newX + 'px';
    e.target.style.top = newY + 'px';
    e.target.style.transition = 'all 0.18s ease';
  }

  elements.confirmYes?.addEventListener('mouseover', moveYesButton);
  elements.confirmYes?.addEventListener('click', () => {
    elements.confirmOverlay?.classList.remove('active');
    showOverlay(elements.loginOverlay);
    elements.passwordInput?.focus();
  });

  // Step 4: Confirmation NO → Password login
  elements.confirmNo?.addEventListener('click', () => {
    elements.confirmOverlay?.classList.remove('active');
    showOverlay(elements.loginOverlay);
    elements.passwordInput?.focus();
  });

    // Step 5: Password login
  const correctPassword = 'trishanice';
  elements.passwordSubmit?.addEventListener('click', () => {
    const entered = elements.passwordInput?.value ?? '';
    if (entered.toLowerCase() === correctPassword.toLowerCase()) { // Case insensitive
      hideOverlay(elements.loginOverlay);
      const playerSection = document.getElementById('musicPlayerSection');
      if (playerSection) playerSection.style.display = 'block';
      
      // Initialize music player first
      initMusicPlayer();
      
      // Then play music and update UI to show playing state
      if (elements.bgMusic) {
        elements.bgMusic.play().then(() => {
          // Music started successfully - update UI to show playing state
          isPlaying = true;
          
          // Update play button to show pause icon
          const playBtn = document.getElementById('playPauseBtn');
          if (playBtn) playBtn.classList.add('playing');
          
          // Update album art to start pulsing
          const albumArt = document.getElementById('albumArt');
          if (albumArt) albumArt.classList.add('playing');
          
          console.log('🎵 Music started automatically after unlock');
        }).catch(() => {
          console.log('Autoplay blocked, waiting for user interaction.');
          // If autoplay blocked, button should show play icon
          document.body.addEventListener('click', () => {
            if (elements.bgMusic?.paused) {
              elements.bgMusic.play().then(() => {
                // Update UI after user interaction
                isPlaying = true;
                const playBtn = document.getElementById('playPauseBtn');
                if (playBtn) playBtn.classList.add('playing');
                const albumArt = document.getElementById('albumArt');
                if (albumArt) albumArt.classList.add('playing');
              }).catch((e) => console.error('Playback failed:', e));
            }
          }, { once: true });
        });
      }
    } else {
      if (elements.passwordError) elements.passwordError.textContent = 'Incorrect Password, try again!';
      if (elements.passwordInput) {
        elements.passwordInput.value = '';
        elements.passwordInput.focus();
      }
    }
  });

  elements.passwordInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') elements.passwordSubmit?.click();
  });

  // 🔹 Read a Letter Button
  elements.readLetterBtn?.addEventListener('click', () => {
    if (elements.letterTitle) elements.letterTitle.textContent = 'Hellooo My Loveyyyy!!';
    if (elements.letterText) {
      elements.letterText.innerHTML = 
        `I hope this little message finds you smiling, because that's exactly what I'm doing right now just thinking about you. You've been on my mind constantly, and I couldn't let another moment pass without telling you what's been filling my heart.<br><br>

From the very first time I saw you, I knew there was something special about you. The way you laugh, the way you care about the people around you, and the way you make even the simplest moments feel magical—it all drew me in. I used to admire you from afar, never thinking I'd have the chance to be this close to you, to know you the way I do now.<br><br>

Every day with you feels like a gift I never knew I needed. You've become my favorite hello and my hardest goodbye. When I'm with you, everything just feels right. You calm my restless heart and make me believe in all the beautiful things I used to only read about in stories.<br><br>

Thank you for accepting me, for giving me a chance, and for being exactly who you are. Thank you for the little moments we share, the inside jokes, the comfortable silences, and even the times when we're just being silly together. Those are the moments I treasure the most.<br><br>

I hope you never forget how deeply you're loved and how much you mean to me. You're not just my partner you're my peace, my happiness, and my greatest blessing.<br><br>

I love you more than words could ever express, mahal ko. 💚💛`;
    }
    setModalHidden(elements.letterModal, false);
  });

  // 🔹 Open letters from letter cards
  document.querySelectorAll('.open-letter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      const key = card?.dataset.key;
      if (key === 'letter1') {
        document.querySelector('.letter1-overlay')?.classList.add('active');
      }
    });
  });
  // 💌 LETTER 1 FLIP CARDS WITH SPARKLES ✨
  const letter1Overlay = document.querySelector('.letter1-overlay');
  const letter1Close = document.querySelector('.letter1-close');
  const letter1Footer = document.querySelector('.letter1-footer'); // Get the footer element
  const letter1Box = document.querySelector('.letter1-box'); // Get the box for celebrations
  
  // Hide footer initially
  if (letter1Footer) {
    letter1Footer.style.display = 'none';
  }
  
  // Track flipped cards
  let flippedCardsCount = 0;
  const totalCards = document.querySelectorAll('.letter1-card').length;

  
    // Function to check if all cards are flipped
  function checkAllCardsFlipped() {
    if (flippedCardsCount >= totalCards && letter1Footer) {
      letter1Footer.style.display = 'block';
      // Add a fun animation when it appears
      letter1Footer.style.animation = 'footerPopIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      // CALL THE CAT CELEBRATION!
      createCatKissCelebration();
    }
  }
      // Celebration function with cat kissing GIF
  function createCatKissCelebration() {
    // DO NOT close the popup - we want to stay inside!
    
    // HIDE THE FOOTER TEXT
    if (letter1Footer) {
      letter1Footer.style.display = 'none';
    }
    
    // Hide all flip cards
    const allCards = document.querySelectorAll('.letter1-card');
    allCards.forEach(card => {
      card.style.transition = 'opacity 0.5s ease';
      card.style.opacity = '0';
    });
    
    // Hide the notes container
    const notesContainer = document.querySelector('.letter1-notes');
    if (notesContainer) {
      notesContainer.style.transition = 'opacity 0.5s ease';
      notesContainer.style.opacity = '0';
    }
    
    // Hide the close button
    const closeBtn = document.querySelector('.letter1-close');
    if (closeBtn) {
      closeBtn.style.transition = 'opacity 0.5s ease';
      closeBtn.style.opacity = '0';
      closeBtn.style.pointerEvents = 'none';
    }
    
    // Create container for the celebration INSIDE the popup
    const celebrationContainer = document.createElement('div');
    celebrationContainer.id = 'catCelebrationContainer';
    celebrationContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: auto;
      z-index: 20000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: rgba(255, 200, 220, 0.8);
      backdrop-filter: blur(5px);
      animation: fadeInBg 0.8s ease;
      cursor: pointer;
      border-radius: 25px;
    `;
    
    // Add click event to remove the celebration
    celebrationContainer.addEventListener('click', function() {
      // Remove the celebration
      this.remove();
      
      // Restore cards visibility
      allCards.forEach(card => {
        card.style.opacity = '1';
      });
      
      if (notesContainer) {
        notesContainer.style.opacity = '1';
      }
      
      // Restore close button
      if (closeBtn) {
        closeBtn.style.opacity = '1';
        closeBtn.style.pointerEvents = 'auto';
      }
      
      // Reset flipped cards count
      flippedCardsCount = 0;
    });
    
    // Append to letter1Box instead of body
    letter1Box.appendChild(celebrationContainer);
    
    // Create cat kiss GIF (bigger! no circle)
    const catGif = document.createElement('img');
    catGif.src = 'img/kitty kiss.gif'; // Using your existing cute cat GIF
    catGif.alt = 'Kissing Cat';
    catGif.style.cssText = `
      width: 300px;
      height: auto;
      border-radius: 0;
      box-shadow: 0 30px 60px rgba(255, 105, 180, 0.6);
      border: none;
      animation: catPopIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), catFloat 3s ease-in-out infinite;
      position: relative;
      z-index: 20001;
      margin-bottom: 30px;
      pointer-events: none;
    `;
    celebrationContainer.appendChild(catGif);
    
    // Create text below the GIF
    const messageText = document.createElement('div');
    messageText.innerHTML = 'and countless more mahal kooo😘...';
    messageText.style.cssText = `
      font-size: 2rem;
      color: #ff4d6d;
      font-family: 'Dancing Script', cursive;
      font-weight: bold;
      text-shadow: 0 2px 10px rgba(255, 255, 255, 0.8);
      background: linear-gradient(135deg, #fff5f9, #ffffff);
      padding: 15px 30px;
      border-radius: 60px;
      border: 3px solid #ff85a2;
      box-shadow: 0 15px 30px rgba(255, 133, 162, 0.3);
      animation: textPopIn 0.8s 0.3s both;
      z-index: 20001;
      backdrop-filter: blur(5px);
      pointer-events: none;
    `;
    celebrationContainer.appendChild(messageText);
    
    // Add instruction text
    const instructionText = document.createElement('div');
    instructionText.innerHTML = '✨ Click anywhere to continue babi ✨';
    instructionText.style.cssText = `
      font-size: 1rem;
      color: white;
      margin-top: 20px;
      padding: 8px 20px;
      background: rgba(255, 77, 109, 0.7);
      border-radius: 30px;
      font-family: 'Montserrat', sans-serif;
      letter-spacing: 1px;
      animation: fadeIn 1s 1s both;
      pointer-events: none;
    `;
    celebrationContainer.appendChild(instructionText);
    
    // Create floating hearts around the cat
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.innerHTML = ['💕', '💖', '💗', '💓', '💘', '💝'][Math.floor(Math.random() * 6)];
        heart.style.cssText = `
          position: absolute;
          font-size: ${Math.random() * 40 + 25}px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 20002;
          animation: heartOrbit 3s ease-out forwards;
          filter: drop-shadow(0 0 20px #ff1493);
        `;
        
        // Calculate orbit position
        const angle = (i / 20) * Math.PI * 2;
        const radius = 250;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        heart.style.setProperty('--x', x + 'px');
        heart.style.setProperty('--y', y + 'px');
        
        celebrationContainer.appendChild(heart);
        
        setTimeout(() => heart.remove(), 3000);
      }, i * 100);
    }
    
    // Also create sparkles in the background
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const celebration = document.createElement('div');
        celebration.innerHTML = ['💚', '💛', '💕', '💖', '💗', '✨'][Math.floor(Math.random() * 6)];
        celebration.style.cssText = `
          position: absolute;
          font-size: ${Math.random() * 20 + 15}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          pointer-events: none;
          z-index: 100;
          animation: celebrationFloat 2s ease-out forwards;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
        `;
        letter1Box.appendChild(celebration);
        setTimeout(() => celebration.remove(), 2000);
      }, i * 150);
    }
    
    // Reset flipped cards count
    flippedCardsCount = 0;
    
    // NO TIMEOUT - stays until clicked!
  }

  letter1Close?.addEventListener('click', () => {
    letter1Overlay?.classList.remove('active');
    // Optional: Uncomment below if you want cards to reset when closing
    /*
    document.querySelectorAll('.letter1-card').forEach(card => {
      card.classList.remove('flipped');
    });
    flippedCardsCount = 0;
    if (letter1Footer) {
      letter1Footer.style.display = 'none';
    }
    */
  });

  // 💫 SPARKLE EFFECT ON FLIP + FLIP ANIMATION + TRACK FLIPPED CARDS
  document.querySelectorAll('.letter1-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    
    // Check if card is already flipped when overlay opens
    if (card.classList.contains('flipped')) {
      flippedCardsCount++;
    }
    
    card.addEventListener('click', () => {
      // Only count if it wasn't flipped before
      if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCardsCount++;
        createSparkles(card);
        checkAllCardsFlipped();
      }
    });
    
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!card.classList.contains('flipped')) {
          card.classList.add('flipped');
          flippedCardsCount++;
          createSparkles(card);
          checkAllCardsFlipped();
        }
      }
    });
  });

  // ✨ SPARKLE FUNCTION
  function createSparkles(card) {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        const randomX = (Math.random() * 40 - 20) + 'px';
        sparkle.style.cssText = `
          position: absolute;
          font-size: 12px;
          pointer-events: none;
          z-index: 100;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          animation: sparkleFly 1.5s ease-out forwards;
          filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.8));
          --random-x: ${randomX};
        `;
        card.appendChild(sparkle);
        sparkle.addEventListener('animationend', () => sparkle.remove());
      }, i * 100);
    }
  }

  // 🔹 Close modals
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      setModalHidden(modal, true);
    });
  });

  // Remove puzzle-related code since it's not in HTML
  // (commented out to avoid errors)

  // ESC key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (elements.letterModal?.getAttribute('aria-hidden') === 'false') {
        setModalHidden(elements.letterModal, true);
      }
      if (letter1Overlay?.classList.contains('active')) {
        letter1Overlay.classList.remove('active');
        document.querySelectorAll('.letter1-card').forEach(card => card.classList.remove('flipped'));
      }
    }
  });

  // 🎵 MUSIC PLAYER
  let currentTrackIndex = 0;
  let isPlaying = false;
  let audio = elements.bgMusic;

  const playlistData = [
    { 
      title: 'Malumanay', 
      artist: 'Tatin DC', 
      src: 'music/malumanay.mp3', 
      albumArt: 'img/albumcover-malumanay.jpg', 
      duration: '3:30',
      message: 'Malumanay is playing because you calm my heart just like this song... everything feels so peaceful when youre with me babi 💖'
    },
    { 
      title: 'Falling For You', 
      artist: 'The 1975', 
      src: 'music/fallingforyou.mp3', 
      albumArt: 'img/albumcover-fallingforyou.jpeg', 
      duration: '4:00',
      message: 'Falling for you is playing because every second I fell for your smile😘'
    },
    { 
      title: 'About You', 
      artist: 'The 1975', 
      src: 'music/aboutyou.mp3', 
      albumArt: 'img/albumcover-aboutyou.jpeg', 
      duration: '4:15',
      message: 'About You is playing because thats exactly how I feel...youre on my mind every single second mahal ko 💚💛'
    },
    { 
      title: 'Adore You', 
      artist: 'Miley Cyrus', 
      src: 'music/adoreyou.mp3', 
      albumArt: 'img/albumcover-adoreyou.jpeg', 
      duration: '3:45',
      message: 'Adore You is playing because I really do... I cherish every little moment we share together babi 🥰'
    },
    { 
      title: 'My Love All Mine', 
      artist: 'Mitski', 
      src: 'music/myloveallmine.mp3', 
      albumArt: 'img/albumcover-myloveallmine.jpeg', 
      duration: '4:00',
      message: 'My Love All Mine is playing because all my love is yours and yours alone... my heart belongs to you completely 💕'
    },
    { 
      title: 'The Only Exception', 
      artist: 'Paramore', 
      src: 'music/theonlyexception.mp3', 
      albumArt: 'img/albumcover-theonlyexception.jpeg', 
      duration: '3:52',
      message: 'The Only Exception is playing because you are my only exception, my everything 💗'
    }
  ];

  const playerElements = {
    playPauseBtn: document.getElementById('playPauseBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    progressBar: document.getElementById('progressBar'),
    progressFill: document.getElementById('progressFill'),
    currentTimeEl: document.getElementById('currentTime'),
    totalTimeEl: document.getElementById('totalTime'),
    volumeSlider: document.getElementById('volumeSlider'),
    volumeBtn: document.getElementById('volumeBtn'),
    albumArt: document.getElementById('albumArt'),
    songTitle: document.getElementById('songTitle'),
    songArtist: document.getElementById('songArtist'),
    playlist: document.getElementById('playlist'),
    songMessage: document.getElementById('songMessage'),
  };

  function initMusicPlayer() {
    function loadTrack(index) {
      if (!playlistData[index]) {
        console.error(`Track at index ${index} not found.`);
        return;
      }
      const track = playlistData[index];
      
      audio.src = track.src;
      audio.load();
      console.log(`Loading track: ${track.title} - ${track.src}`);

          function loadTrack(index) {
      if (!playlistData[index]) {
        console.error(`Track at index ${index} not found.`);
        return;
      }
      const track = playlistData[index];
      
      audio.src = track.src;
      audio.load();
      console.log(`Loading track: ${track.title} - ${track.src}`);

      if (playerElements.albumArt) {
        playerElements.albumArt.src = track.albumArt;
        playerElements.albumArt.alt = `${track.title} - ${track.artist}`;
        playerElements.albumArt.onerror = function() {
          this.src = 'img/albumcover.jpg';
          console.warn(`Failed to load album art: ${track.albumArt}, using fallback.`);
        };
      }
      
      if (playerElements.songTitle) playerElements.songTitle.textContent = track.title || 'Unknown Title';
      if (playerElements.songArtist) playerElements.songArtist.textContent = track.artist || 'Unknown Artist';

      // Don't show song message here - it will show when actually playing
      
      document.querySelectorAll('.playlist-track').forEach((trackEl, i) => {
        trackEl.classList.toggle('active', i === index);
      });

      currentTrackIndex = index;
      updateProgressBar();
      
      // Don't set playing state here - wait for actual play
    }

      if (playerElements.albumArt) {
        playerElements.albumArt.src = track.albumArt;
        playerElements.albumArt.alt = `${track.title} - ${track.artist}`;
        playerElements.albumArt.onerror = function() {
          this.src = 'img/albumcover.jpg';
          console.warn(`Failed to load album art: ${track.albumArt}, using fallback.`);
        };
      }
      
      if (playerElements.songTitle) playerElements.songTitle.textContent = track.title || 'Unknown Title';
      if (playerElements.songArtist) playerElements.songArtist.textContent = track.artist || 'Unknown Artist';

      if (playerElements.songMessage) {
        playerElements.songMessage.textContent = track.message;
        playerElements.songMessage.classList.remove('show');
        void playerElements.songMessage.offsetWidth;
        playerElements.songMessage.classList.add('show');
        setTimeout(() => {
          playerElements.songMessage.classList.remove('show');
        }, 5000);
      }

      document.querySelectorAll('.playlist-track').forEach((trackEl, i) => {
        trackEl.classList.toggle('active', i === index);
      });

      currentTrackIndex = index;
      updateProgressBar();
    }

    function initPlaylist() {
      if (!playerElements.playlist) {
        console.error('Playlist container not found.');
        return;
      }

      playerElements.playlist.innerHTML = playlistData.map((track, index) => `
        <div class="playlist-track" data-index="${index}" role="button" tabindex="0">
          <div class="track-info">
            <div class="track-title">${track.title}</div>
            <div class="track-artist">${track.artist}</div>
          </div>
          <div class="track-duration">${track.duration}</div>
        </div>
      `).join('');

      document.querySelectorAll('.playlist-track').forEach((trackEl, index) => {
        trackEl.addEventListener('click', () => {
          loadTrack(index);
          playAudio();
        });
        trackEl.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            loadTrack(index);
            playAudio();
          }
        });
      });
    }

    function playAudio() {
      audio.play().then(() => {
        isPlaying = true;
        if (playerElements.playPauseBtn) playerElements.playPauseBtn.classList.add('playing');
        if (playerElements.albumArt) playerElements.albumArt.classList.add('playing');
        console.log(`Playing: ${playlistData[currentTrackIndex].title}`);
      }).catch(e => {
        console.error('Playback failed:', e);
        isPlaying = false;
      });
    }

    function pauseAudio() {
      audio.pause();
      isPlaying = false;
      if (playerElements.playPauseBtn) playerElements.playPauseBtn.classList.remove('playing');
      if (playerElements.albumArt) playerElements.albumArt.classList.remove('playing');
      console.log('Paused');
    }

    function nextTrack() {
      const nextIndex = (currentTrackIndex + 1) % playlistData.length;
      loadTrack(nextIndex);
      playAudio();
    }

    function prevTrack() {
      const prevIndex = currentTrackIndex === 0 ? playlistData.length - 1 : currentTrackIndex - 1;
      loadTrack(prevIndex);
      playAudio();
    }

    function updateProgressBar() {
      if (audio.duration && !isNaN(audio.duration)) {
        const progress = (audio.currentTime / audio.duration) * 100;
        if (playerElements.progressBar) playerElements.progressBar.value = progress;
        if (playerElements.progressFill) playerElements.progressFill.style.width = progress + '%';
        if (playerElements.currentTimeEl) playerElements.currentTimeEl.textContent = formatTime(audio.currentTime);
        if (playerElements.totalTimeEl) playerElements.totalTimeEl.textContent = formatTime(audio.duration);
      }
    }

    audio.addEventListener('timeupdate', updateProgressBar);
    audio.addEventListener('loadedmetadata', updateProgressBar);
    audio.addEventListener('ended', nextTrack);
    audio.addEventListener('error', (e) => {
      console.error(`Audio error for ${playlistData[currentTrackIndex]?.src}:`, e);
      if (playerElements.songMessage) {
        playerElements.songMessage.textContent = 'Error loading track. Please try another.';
        playerElements.songMessage.classList.add('show');
        setTimeout(() => playerElements.songMessage.classList.remove('show'), 5000);
      }
    });

    if (playerElements.progressBar) {
      playerElements.progressBar.addEventListener('input', () => {
        const seekTime = (playerElements.progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
      });
    }

    if (playerElements.volumeSlider) {
      playerElements.volumeSlider.addEventListener('input', () => {
        audio.volume = playerElements.volumeSlider.value;
        updateVolumeIcon();
      });
      playerElements.volumeSlider.value = 0.7;
      audio.volume = 0.7;
    }

    if (playerElements.volumeBtn) {
      playerElements.volumeBtn.addEventListener('click', () => {
        if (audio.volume > 0) {
          audio.dataset.previousVolume = audio.volume;
          audio.volume = 0;
          playerElements.volumeSlider.value = 0;
        } else {
          const previousVolume = audio.dataset.previousVolume || 0.7;
          audio.volume = previousVolume;
          playerElements.volumeSlider.value = previousVolume;
        }
        updateVolumeIcon();
      });
    }

    function updateVolumeIcon() {
      if (!playerElements.volumeBtn) return;
      const volume = audio.volume;
      const volumeHigh = playerElements.volumeBtn.querySelector('.volume-high');
      const volumeLow = playerElements.volumeBtn.querySelector('.volume-low');
      const volumeMute = playerElements.volumeBtn.querySelector('.volume-mute');
      
      if (volumeHigh && volumeLow && volumeMute) {
        volumeHigh.style.display = volume > 0.5 ? 'inline-block' : 'none';
        volumeLow.style.display = volume > 0 && volume <= 0.5 ? 'inline-block' : 'none';
        volumeMute.style.display = volume === 0 ? 'inline-block' : 'none';
      }
    }

    // Play/Pause Button
    if (playerElements.playPauseBtn) {
      playerElements.playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
          pauseAudio();
        } else {
          playAudio();
        }
      });
    }

    // Previous Button
    if (playerElements.prevBtn) {
      playerElements.prevBtn.addEventListener('click', prevTrack);
    }

    // Next Button  
    if (playerElements.nextBtn) {
      playerElements.nextBtn.addEventListener('click', nextTrack);
    }

    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (isPlaying) pauseAudio();
          else playAudio();
          break;
        case 'ArrowRight':
          e.preventDefault();
          audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + 10);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          audio.currentTime = Math.max(0, audio.currentTime - 10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          audio.volume = Math.min(1, audio.volume + 0.1);
          if (playerElements.volumeSlider) playerElements.volumeSlider.value = audio.volume;
          updateVolumeIcon();
          break;
        case 'ArrowDown':
          e.preventDefault();
          audio.volume = Math.max(0, audio.volume - 0.1);
          if (playerElements.volumeSlider) playerElements.volumeSlider.value = audio.volume;
          updateVolumeIcon();
          break;
      }
    });

    function formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return mins + ':' + secs.toString().padStart(2, '0');
    }

    initPlaylist();
    if (playlistData.length > 0) loadTrack(0);
    updateVolumeIcon();
    console.log('🎵 Music Player Initialized');
  }

  // Add this function to handle clicking on progress bar
window.seekAudio = function(event) {
  const progressBar = document.getElementById('progressBar');
  const rect = event.currentTarget.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  const seekTime = percent * audio.duration;
  audio.currentTime = seekTime;
  progressBar.value = percent * 100;
}

  // 💧 WATER RIPPLE EFFECT
  function createRipple(x, y) {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1500);
      }, i * 150);
    }
    createSplashParticles(x, y);
  }

  function createSplashParticles(x, y) {
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'splash-particle';
      const angle = (Math.PI * 2 * i) / particleCount;
      const distance = 60 + Math.random() * 40;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.setProperty('--dx', dx + 'px');
      particle.style.setProperty('--dy', dy + 'px');
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }
  }

  document.addEventListener('click', (e) => {
    createRipple(e.clientX, e.clientY);
  });

  document.addEventListener('touchstart', (e) => {
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      createRipple(touch.clientX, touch.clientY);
    }
  });
});

// 🖼️ ENHANCED PHOTO GALLERY INTERACTIVITY
function initPhotoGallery() {
  // Create photo modal if it doesn't exist
  if (!document.querySelector('.photo-modal')) {
    const photoModal = document.createElement('div');
    photoModal.className = 'photo-modal';
    photoModal.innerHTML = `
      <div class="photo-modal-content">
        <button class="photo-modal-close">&times;</button>
        <button class="photo-nav-btn prev">&#10094;</button>
        <img src="" alt="Enlarged photo">
        <button class="photo-nav-btn next">&#10095;</button>
        <div class="photo-caption"></div>
      </div>
    `;
    document.body.appendChild(photoModal);
  }

  const photoModal = document.querySelector('.photo-modal');
  const modalImg = photoModal.querySelector('img');
  const modalCaption = photoModal.querySelector('.photo-caption');
  const closeBtn = photoModal.querySelector('.photo-modal-close');
  const prevBtn = photoModal.querySelector('.prev');
  const nextBtn = photoModal.querySelector('.next');
  
  // Get all photos
  const photos = Array.from(document.querySelectorAll('.polaroid'));
  let currentPhotoIndex = 0;

  // Add click event to each polaroid
  photos.forEach((polaroid, index) => {
    const img = polaroid.querySelector('.photo');
    const caption = polaroid.querySelector('.caption')?.textContent || 'My Love 💕';
    
    // Click to open modal
    polaroid.addEventListener('click', (e) => {
      // Don't open if clicking on caption (prevents double events)
      if (e.target.classList.contains('caption')) return;
      
      currentPhotoIndex = index;
      openPhotoModal(img.src, caption);
      
      // Create floating hearts on click
      createPhotoHearts(e.clientX, e.clientY);
    });

    // Double click for extra love
    polaroid.addEventListener('dblclick', (e) => {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          createPhotoHearts(e.clientX, e.clientY);
        }, i * 100);
      }
    });
  });

  // Function to open modal
  function openPhotoModal(src, caption) {
    modalImg.src = src;
    modalCaption.textContent = caption;
    photoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Function to close modal
  function closePhotoModal() {
    photoModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Navigate to previous photo
  function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    const prevPolaroid = photos[currentPhotoIndex];
    const prevImg = prevPolaroid.querySelector('.photo');
    const prevCaption = prevPolaroid.querySelector('.caption')?.textContent || 'My Love 💕';
    modalImg.src = prevImg.src;
    modalCaption.textContent = prevCaption;
    
    // Heart animation on navigation
    createPhotoHearts(window.innerWidth / 2, window.innerHeight / 2);
  }

  // Navigate to next photo
  function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    const nextPolaroid = photos[currentPhotoIndex];
    const nextImg = nextPolaroid.querySelector('.photo');
    const nextCaption = nextPolaroid.querySelector('.caption')?.textContent || 'My Love 💕';
    modalImg.src = nextImg.src;
    modalCaption.textContent = nextCaption;
    
    // Heart animation on navigation
    createPhotoHearts(window.innerWidth / 2, window.innerHeight / 2);
  }

  // Create floating hearts
  function createPhotoHearts(x, y) {
    const heartCount = 5;
    for (let i = 0; i < heartCount; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'photo-heart';
        heart.innerHTML = ['💖', '💕', '💗', '💓', '💘'][Math.floor(Math.random() * 5)];
        
        const angle = (Math.PI * 2 * i) / heartCount;
        const distance = 50 + Math.random() * 50;
        const dx = Math.cos(angle) * distance * (Math.random() * 0.5 + 0.5);
        const dy = Math.sin(angle) * distance * (Math.random() * 0.5 + 0.5) - 100;
        
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.setProperty('--dx', dx + 'px');
        heart.style.setProperty('--dy', dy + 'px');
        
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 2000);
      }, i * 100);
    }
  }

  // Event listeners
  closeBtn.addEventListener('click', closePhotoModal);
  prevBtn.addEventListener('click', prevPhoto);
  nextBtn.addEventListener('click', nextPhoto);

  // Close on background click
  photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) {
      closePhotoModal();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!photoModal.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape':
        closePhotoModal();
        break;
      case 'ArrowLeft':
        prevPhoto();
        break;
      case 'ArrowRight':
        nextPhoto();
        break;
    }
  });

  // Add touch swipe for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  photoModal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  photoModal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) {
      nextPhoto(); // Swipe left
    } else if (touchEndX > touchStartX + 50) {
      prevPhoto(); // Swipe right
    }
  });
}

// Initialize photo gallery
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPhotoGallery);
} else {
  initPhotoGallery();
}

// 📁 MEMORY FOLDER INTERACTIVITY
function initMemoryFolder() {
  const memoryFolder = document.getElementById('memoryFolder');
  const memoryGallery = document.getElementById('memoryGallery');
  const backBtn = document.getElementById('galleryBackBtn');
  const photosSection = document.querySelector('.photos-section');
  
  if (!memoryFolder || !memoryGallery) return;
  
  // Open folder
  memoryFolder.addEventListener('click', () => {
    // Hide folder
    memoryFolder.style.display = 'none';
    
    // Show gallery with animation
    memoryGallery.style.display = 'block';
    
    // Create opening sparkles
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = ['💖', '💕', '💗', '✨', '📸'][Math.floor(Math.random() * 5)];
        sparkle.style.cssText = `
          position: absolute;
          font-size: ${Math.random() * 20 + 15}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          pointer-events: none;
          z-index: 1000;
          animation: folderSparkle 1.5s ease-out forwards;
          filter: drop-shadow(0 0 10px rgba(255, 133, 162, 0.8));
        `;
        photosSection.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1500);
      }, i * 100);
    }
    
    // Play folder open sound effect? (Optional)
    console.log('📁 Memory folder opened!');
  });
  
  // Close gallery (back to folder)
  backBtn.addEventListener('click', () => {
    // Hide gallery
    memoryGallery.style.display = 'none';
    
    // Show folder
    memoryFolder.style.display = 'block';
    
    // Create closing sparkles
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = ['💖', '💕', '✨'][Math.floor(Math.random() * 3)];
        sparkle.style.cssText = `
          position: absolute;
          font-size: ${Math.random() * 20 + 15}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          pointer-events: none;
          z-index: 1000;
          animation: folderSparkle 1s ease-out forwards;
        `;
        photosSection.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
      }, i * 50);
    }
  });
  
  // Add CSS animation if not exists
  if (!document.querySelector('#folder-sparkle-animation')) {
    const style = document.createElement('style');
    style.id = 'folder-sparkle-animation';
    style.textContent = `
      @keyframes folderSparkle {
        0% {
          opacity: 0;
          transform: translateY(0) rotate(0deg) scale(0);
        }
        20% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: translateY(-100px) rotate(360deg) scale(1.5);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMemoryFolder);
} else {
  initMemoryFolder();
}

// 📁 MEMORY FOLDER POPUP - ADD THIS ENTIRE BLOCK
function initMemoryPopup() {
  // Create popup if it doesn't exist
  if (!document.querySelector('.memory-popup-overlay')) {
    const popupHTML = `
      <div class="memory-popup-overlay" id="memoryPopup">
        <div class="memory-popup-content">
          <div class="memory-popup-header">
            <h2>Our Beautiful Memories 💕</h2>
            <button class="memory-popup-close">&times;</button>
          </div>
          <div class="photo-counter" id="photoCounter"></div>
          <div class="memory-photo-grid" id="memoryPhotoGrid">
            <!-- Photos will be inserted here by JavaScript -->
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
  }

  const popup = document.getElementById('memoryPopup');
  const closeBtn = popup?.querySelector('.memory-popup-close');
  const folderCard = document.getElementById('memoryFolderCard');
  const openBtn = document.querySelector('.open-folder-btn');
  const photoGrid = document.getElementById('memoryPhotoGrid');
  const photoCounter = document.getElementById('photoCounter');

  // 📸 ADD YOUR PHOTOS HERE - REPLACE WITH YOUR ACTUAL PHOTOS
  const memoryPhotos = [
    { src: 'img/photo1.jpeg', caption: '💚💛' },
    { src: 'img/photo2.jpeg', caption: '💕' },
    { src: 'img/photo3.jpeg', caption: '🥰' },
    { src: 'img/photo4.jpeg', caption: '💖' },
    { src: 'img/photo5.jpeg', caption: '💗' },
    { src: 'img/photo6.jpeg', caption: '💓' },
    { src: 'img/photo7.jpeg', caption: '💘' },
    { src: 'img/photo8.jpeg', caption: '💝' },
    // Add more photos up to 35!
  ];

  // Function to load photos into grid
  function loadPhotos() {
    if (!photoGrid) return;
    
    photoGrid.innerHTML = memoryPhotos.map((photo, index) => `
      <div class="memory-popup-photo" style="--delay: ${index * 0.2}s">
        <img src="${photo.src}" alt="Memory ${index + 1}" loading="lazy">
        <div class="memory-popup-caption">${photo.caption}</div>
      </div>
    `).join('');
    
    if (photoCounter) {
      photoCounter.textContent = `📸 ${memoryPhotos.length} precious memories 💕`;
    }
  }

  // Open popup
  function openPopup() {
    loadPhotos();
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Create sparkles effect
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = ['💖', '💕', '💗', '✨', '📸'][Math.floor(Math.random() * 5)];
        sparkle.style.cssText = `
          position: fixed;
          font-size: ${Math.random() * 20 + 15}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          pointer-events: none;
          z-index: 10001;
          animation: folderSparkle 1.5s ease-out forwards;
          filter: drop-shadow(0 0 10px rgba(255, 133, 162, 0.8));
        `;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1500);
      }, i * 100);
    }
  }

  // Close popup
  function closePopup() {
    popup.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners
  folderCard?.addEventListener('click', openPopup);
  openBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openPopup();
  });
  
  closeBtn?.addEventListener('click', closePopup);
  
  // Close on background click
  popup?.addEventListener('click', (e) => {
    if (e.target === popup) {
      closePopup();
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup?.classList.contains('active')) {
      closePopup();
    }
  });

  // Add sparkle animation if not exists
  if (!document.querySelector('#folder-sparkle-animation')) {
    const style = document.createElement('style');
    style.id = 'folder-sparkle-animation';
    style.textContent = `
      @keyframes folderSparkle {
        0% {
          opacity: 0;
          transform: translateY(0) rotate(0deg) scale(0);
        }
        20% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: translateY(-100px) rotate(360deg) scale(1.5);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize memory popup
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMemoryPopup);
} else {
  initMemoryPopup();
}

// 💚💛 LOVE TIMER - EXACT START DATE & TIME
function startLoveTimer() {
  console.log("❤️ LOVE TIMER STARTING (Exact Date & Time)...");
  
  // ⭐⭐⭐ SHE SAID YES ON October 27, 2025 at 1:50 PM ⭐⭐⭐
  const startDate = new Date(2025, 9, 27, 13, 50, 0); // October 27, 2025, 1:50:00 PM
  
  function updateLoveTimer() {
    const now = new Date();
    
    // ===== YEAR CALCULATION =====
    let years = now.getFullYear() - startDate.getFullYear();
    
    // ===== MONTH CALCULATION =====
    let months = now.getMonth() - startDate.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // ===== DAYS CALCULATION =====
    let days = now.getDate() - startDate.getDate();
    
    // Adjust days and months
    if (days < 0) {
      // Get days in previous month
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
      months--;
      if (months < 0) {
        months += 12;
        years--;
      }
    }
    
    // ===== TIME CALCULATION (with 1:50 PM start) =====
    // Calculate hours and minutes considering the 1:50 PM start time
    let hours = now.getHours() - startDate.getHours();
    let minutes = now.getMinutes() - startDate.getMinutes();
    let seconds = now.getSeconds() - startDate.getSeconds();
    
    // Adjust time values
    if (seconds < 0) {
      seconds += 60;
      minutes--;
    }
    if (minutes < 0) {
      minutes += 60;
      hours--;
    }
    if (hours < 0) {
      hours += 24;
      days--;
      if (days < 0) {
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        months--;
        if (months < 0) {
          months += 12;
          years--;
        }
      }
    }
    
    // Get timer elements
    const yearsEl = document.getElementById('timerYears');
    const monthsEl = document.getElementById('timerMonths');
    const daysEl = document.getElementById('timerDays');
    const hoursEl = document.getElementById('timerHours');
    const minutesEl = document.getElementById('timerMinutes');
    const secondsEl = document.getElementById('timerSeconds');
    
    if (!yearsEl || !monthsEl || !daysEl || !hoursEl || !minutesEl || !secondsEl) {
      console.error("❌ Timer elements not found!");
      return;
    }
    
    // Update display with leading zeros
    yearsEl.textContent = String(years).padStart(2, '0');
    monthsEl.textContent = String(months).padStart(2, '0');
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    
    // Detailed debug info
    console.log('========== EXACT LOVE TIMER ==========');
    console.log(`💕 She said YES: October 27, 2025 at 1:50 PM`);
    console.log(`📅 Current: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`);
    console.log(`-------------------------------------`);
    console.log(`⏱️  Together for: ${years} years, ${months} months, ${days} days`);
    console.log(`⏰ Exact time: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    console.log('=====================================');
  }
  
  // Update immediately and every second
  updateLoveTimer();
  setInterval(updateLoveTimer, 1000);
}

// Start timer when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log("✅ DOM loaded, starting exact timer...");
  startLoveTimer();
});

// 💌 DIGITAL LOVE NOTES
function initLoveNotes() {
  console.log("💌 Love Notes initializing...");
  
  // Collection of love notes (YOU CAN CUSTOMIZE THESE!)
  const loveNotes = [
    { text: "You're the most beautiful part of my everyday.", emoji: "💕" },
    { text: "Every love story is beautiful, but ours is my favorite.", emoji: "📖" },
    { text: "I fell in love with you, and then I kept falling.", emoji: "🍂" },
    { text: "You're my favorite notification.", emoji: "📱" },
    { text: "I love you more than coffee, and that's saying a lot.", emoji: "☕" },
    { text: "You're the reason I believe in forever.", emoji: "∞" },
    { text: "My heart whispers your name when you're not around.", emoji: "💓" },
    { text: "You're my today and all my tomorrows.", emoji: "📅" },
    { text: "I didn't believe in love at first sight until I met you.", emoji: "👀" },
    { text: "You're my favorite hello and my hardest goodbye.", emoji: "👋" },
    { text: "Being with you feels like coming home.", emoji: "🏠" },
    { text: "You're the piece of me I didn't know was missing.", emoji: "🧩" },
    { text: "I love you more than all the stars in the sky.", emoji: "⭐" },
    { text: "You make my heart smile.", emoji: "😊" },
    { text: "Every moment with you is a treasure.", emoji: "💎" },
    { text: "You're my safe place in a chaotic world.", emoji: "🛡️" },
    { text: "I love the way you laugh it's my favorite sound.", emoji: "😄" },
    { text: "You're the best thing that ever happened to me.", emoji: "🏆" },
    { text: "I still get butterflies thinking about you.", emoji: "🦋" },
    { text: "You're my dream come true.", emoji: "✨" },
    { text: "I love you more than pizza, and that's serious.", emoji: "🍕" },
    { text: "You're the reason I look forward to waking up.", emoji: "☀️" },
    { text: "My favorite place is anywhere with you.", emoji: "🌍" },
    { text: "You're my sunshine on a rainy day.", emoji: "🌧️" },
    { text: "I love you to the moon and back, and then some.", emoji: "🌙" },
    { text: "You're my favorite thought when I wake up.", emoji: "💭" },
    { text: "I love you more today than yesterday, but less than tomorrow.", emoji: "📈" },
    { text: "You're the 'good' in my morning and the 'night' in my goodnight.", emoji: "🌅" },
    { text: "My love for you grows stronger every single day.", emoji: "🌱" },
    { text: "You're my favorite person to do nothing with.", emoji: "🛋️" },
    { text: "I love you more than words can express.", emoji: "💬" },
    { text: "You're the beat of my heart.", emoji: "💓" },
    { text: "I choose you. And I'll choose you over and over again.", emoji: "✅" },
    { text: "You're my forever and always.", emoji: "🕰️" },
    { text: "I love you not only for who you are, but for who I am when I'm with you.", emoji: "🌟" },
    { text: "You're my favorite distraction.", emoji: "🎯" },
    { text: "I love you more than all the grains of sand.", emoji: "🏖️" },
    { text: "You're my happily ever after.", emoji: "🏰" },
    { text: "I love you more than sleep, and that's a lot.", emoji: "😴" },
    { text: "You're the best part of my day.", emoji: "🎉" },
    { text: "I love you more than all the wifi in the world.", emoji: "📶" },
    { text: "You're my favorite 'good morning' and 'good night'.", emoji: "🌙" },
    { text: "I love you more than chocolate.", emoji: "🍫" },
    { text: "You're my greatest adventure.", emoji: "🗺️" },
    { text: "I love you more than music, and you know that's true.", emoji: "🎵" },
    { text: "You're my favorite place to be.", emoji: "📍" },
    { text: "I love you more than all the stars in the universe.", emoji: "🌌" },
    { text: "You're my always and forever.", emoji: "💞" },
    { text: "I love you more than words can say.", emoji: "🔤" },
    { text: "You're my one in a million.", emoji: "💯" },
    { text: "I love you more than all the oxygen in the air.", emoji: "🌬️" },
    { text: "You're my favorite song on repeat.", emoji: "🔄" },
    { text: "I love you more than all the pages in my favorite book.", emoji: "📚" },
    { text: "You're my masterpiece.", emoji: "🎨" },
    { text: "I love you more than all the pixels on this screen.", emoji: "🖥️" },
    { text: "You're my favorite discovery.", emoji: "🔍" },
    { text: "I love you more than all the raindrops in a storm.", emoji: "☔" },
    { text: "You're my silver lining.", emoji: "☁️" },
    { text: "I love you more than all the memories we've made.", emoji: "📸" },
    { text: "You're my favorite 'us'.", emoji: "👫" },
    { text: "I love you more than all the dreams I've ever dreamed.", emoji: "💤" },
    { text: "You're my reality, better than any dream.", emoji: "🌈" },
    { text: "I love you more than all the seasons combined.", emoji: "🍂❄️🌸☀️" },
    { text: "You're my forever home.", emoji: "🏡" },
    { text: "I love you more than all the coffee in the world.", emoji: "☕" },
    { text: "You're my favorite notification.", emoji: "🔔" },
    { text: "I love you more than all the sunsets we've watched.", emoji: "🌇" },
    { text: "You're my favorite color.", emoji: "🎨" },
    { text: "I love you more than all the butterflies in my stomach.", emoji: "🦋" },
    { text: "You're my favorite smell the one I search for in a crowd.", emoji: "👃" },
    { text: "I love you more than all the hugs we've shared.", emoji: "🤗" },
    { text: "You're my favorite taste like sweet forever.", emoji: "🍯" },
    { text: "I love you more than all the kisses we've stolen.", emoji: "💋" },
    { text: "You're my favorite touch the hand I want to hold.", emoji: "🤝" },
    { text: "I love you more than all the sounds of laughter.", emoji: "😆" },
    { text: "You're my favorite sight the face I want to see.", emoji: "👀" },
    { text: "I love you more than all the feelings in my heart.", emoji: "💖" }
  ];

  // DOM Elements
  const noteText = document.getElementById('loveNoteText');
  const noteIcon = document.querySelector('.note-icon');
  const newNoteBtn = document.getElementById('newNoteBtn');
  const saveNoteBtn = document.getElementById('saveNoteBtn');
  const shareNoteBtn = document.getElementById('shareNoteBtn');
  const notesCount = document.getElementById('notesCount');
  const favoritesCount = document.getElementById('favoritesCount');
  const lastNoteDate = document.getElementById('lastNoteDate');
  const favoritesSection = document.getElementById('favoritesSection');
  const favoritesGrid = document.getElementById('favoritesGrid');
  const closeFavoritesBtn = document.getElementById('closeFavoritesBtn');
  const noteCard = document.querySelector('.note-card');
  
  // State
  let currentNoteIndex = 0;
  let favorites = JSON.parse(localStorage.getItem('loveNotesFavorites')) || [];
  let viewCount = parseInt(localStorage.getItem('loveNotesViewCount') || '0');
  
  // Initialize
  function init() {
    updateStats();
    showRandomNote();
    
    // Set up event listeners
    newNoteBtn?.addEventListener('click', showRandomNote);
    saveNoteBtn?.addEventListener('click', saveCurrentNote);
    shareNoteBtn?.addEventListener('click', shareNote);
    closeFavoritesBtn?.addEventListener('click', toggleFavorites);
    
    // Add double-click to copy
    noteCard?.addEventListener('dblclick', copyNoteToClipboard);
  }
  
  function showRandomNote() {
    const randomIndex = Math.floor(Math.random() * loveNotes.length);
    currentNoteIndex = randomIndex;
    const note = loveNotes[randomIndex];
    
    // Update display
    if (noteText) {
      noteText.textContent = `"${note.text}"`;
    }
    
    if (noteIcon) {
      noteIcon.textContent = note.emoji || '💕';
    }
    
    // Add animation
    if (noteCard) {
      noteCard.classList.add('note-pop');
      setTimeout(() => {
        noteCard.classList.remove('note-pop');
      }, 500);
    }
    
    // Update view count
    viewCount++;
    localStorage.setItem('loveNotesViewCount', viewCount.toString());
    updateStats();
    
    // Update last viewed date
    const today = new Date();
    lastNoteDate.textContent = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  function saveCurrentNote() {
    const currentNote = loveNotes[currentNoteIndex];
    
    // Check if already saved
    const isAlreadySaved = favorites.some(fav => fav.text === currentNote.text);
    
    if (!isAlreadySaved) {
      favorites.push(currentNote);
      localStorage.setItem('loveNotesFavorites', JSON.stringify(favorites));
      
      // Show success message
      showSuccessMessage('💖 Note saved to favorites!');
      
      updateStats();
    } else {
      showSuccessMessage('✨ Note already in favorites');
    }
  }
  
  function shareNote() {
    const currentNote = loveNotes[currentNoteIndex];
    const shareText = `"${currentNote.text}" - From your Baby 💕`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Love Note for You',
        text: shareText,
      }).catch(() => {
        // Fallback to clipboard
        copyToClipboard(shareText);
      });
    } else {
      // Fallback to clipboard
      copyToClipboard(shareText);
    }
  }
  
  function copyNoteToClipboard() {
    const currentNote = loveNotes[currentNoteIndex];
    const copyText = `"${currentNote.text}" - From your Baby 💕`;
    
    copyToClipboard(copyText);
  }
  
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      showSuccessMessage('📋 Copied to clipboard!');
    }).catch(() => {
      alert('Copy failed, but here\'s the note: ' + text);
    });
  }
  
  function showSuccessMessage(message) {
    const msg = document.createElement('div');
    msg.className = 'save-success';
    msg.textContent = message;
    document.body.appendChild(msg);
    
    setTimeout(() => {
      msg.remove();
    }, 2000);
  }
  
  function toggleFavorites() {
    if (favoritesSection.style.display === 'none' || !favoritesSection.style.display) {
      displayFavorites();
      favoritesSection.style.display = 'block';
    } else {
      favoritesSection.style.display = 'none';
    }
  }
  
  function displayFavorites() {
    if (!favoritesGrid) return;
    
    if (favorites.length === 0) {
      favoritesGrid.innerHTML = '<div class="no-favorites">No saved notes yet 💕</div>';
      return;
    }
    
    favoritesGrid.innerHTML = favorites.map((note, index) => `
      <div class="favorite-item" data-index="${index}">
        <div class="favorite-text">"${note.text.substring(0, 30)}${note.text.length > 30 ? '...' : ''}"</div>
        <div class="favorite-remove" onclick="removeFavorite(${index})">×</div>
      </div>
    `).join('');
    
    // Add click event to each favorite to load it
    document.querySelectorAll('.favorite-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('favorite-remove')) {
          const index = item.dataset.index;
          loadFavorite(index);
        }
      });
    });
  }
  
  window.removeFavorite = function(index) {
    favorites.splice(index, 1);
    localStorage.setItem('loveNotesFavorites', JSON.stringify(favorites));
    displayFavorites();
    updateStats();
    showSuccessMessage('💔 Note removed');
  };
  
  function loadFavorite(index) {
    const note = favorites[index];
    
    // Find the note in the main list
    const mainIndex = loveNotes.findIndex(n => n.text === note.text);
    if (mainIndex !== -1) {
      currentNoteIndex = mainIndex;
      noteText.textContent = `"${note.text}"`;
      noteIcon.textContent = note.emoji || '💕';
      
      // Add animation
      noteCard.classList.add('note-pop');
      setTimeout(() => {
        noteCard.classList.remove('note-pop');
      }, 500);
    }
    
    // Close favorites
    favoritesSection.style.display = 'none';
  }
  
  function updateStats() {
    if (notesCount) {
      notesCount.textContent = viewCount;
    }
    
    if (favoritesCount) {
      favoritesCount.textContent = favorites.length;
    }
  }
  
  // Start
  init();
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoveNotes);
} else {
  initLoveNotes();
}

// 💌 DIGITAL LOVE NOTES - UPDATED VERSION (with Stats)
function initLoveNotes() {
  console.log("💌 Love Notes initializing...");
  
  // Collection of love notes with categories
  const loveNotes = [
    // Sweet & Romantic (category: sweet)
    { text: "You're the most beautiful part of my everyday.", emoji: "💕", category: "sweet" },
    { text: "Every love story is beautiful, but ours is my favorite.", emoji: "📖", category: "sweet" },
    { text: "I fell in love with you, and then I kept falling.", emoji: "🍂", category: "sweet" },
    { text: "You're my favorite notification.", emoji: "📱", category: "daily" },
    { text: "You're the reason I believe in forever.", emoji: "∞", category: "sweet" },
    { text: "My heart whispers your name when you're not around.", emoji: "💓", category: "sweet" },
    { text: "You're my today and all my tomorrows.", emoji: "📅", category: "sweet" },
    { text: "I didn't believe in love at first sight until I met you.", emoji: "👀", category: "sweet" },
    { text: "You're my favorite hello and my hardest goodbye.", emoji: "👋", category: "deep" },
    { text: "Being with you feels like coming home.", emoji: "🏠", category: "deep" },
    
    // More Sweet
    { text: "You're the piece of me I didn't know was missing.", emoji: "🧩", category: "deep" },
    { text: "I love you more than all the stars in the sky.", emoji: "⭐", category: "sweet" },
    { text: "You make my heart smile.", emoji: "😊", category: "sweet" },
    { text: "Every moment with you is a treasure.", emoji: "💎", category: "sweet" },
    { text: "You're my safe place in a chaotic world.", emoji: "🛡️", category: "deep" },
    { text: "I love the way you laugh - it's my favorite sound.", emoji: "😄", category: "sweet" },
    { text: "You're the best thing that ever happened to me.", emoji: "🏆", category: "sweet" },
    { text: "I still get butterflies thinking about you.", emoji: "🦋", category: "sweet" },
    { text: "You're my dream come true.", emoji: "✨", category: "sweet" },
    
    // Funny & Playful (category: funny)
    { text: "I love you more than coffee, and that's saying a lot.", emoji: "☕", category: "funny" },
    { text: "I love you more than pizza, and that's serious.", emoji: "🍕", category: "funny" },
    { text: "You're the reason I look forward to waking up.", emoji: "☀️", category: "daily" },
    { text: "My favorite place is anywhere with you.", emoji: "🌍", category: "sweet" },
    { text: "You're my sunshine on a rainy day.", emoji: "🌧️", category: "sweet" },
    { text: "I love you to the moon and back, and then some.", emoji: "🌙", category: "sweet" },
    { text: "You're my favorite thought when I wake up.", emoji: "💭", category: "daily" },
    { text: "I love you more today than yesterday, but less than tomorrow.", emoji: "📈", category: "sweet" },
    { text: "You're the 'good' in my morning and the 'night' in my goodnight.", emoji: "🌅", category: "daily" },
    { text: "My love for you grows stronger every single day.", emoji: "🌱", category: "deep" },
    { text: "You're my favorite person to do nothing with.", emoji: "🛋️", category: "funny" },
    
    // Deep Feelings (category: deep)
    { text: "I love you more than words can express.", emoji: "💬", category: "deep" },
    { text: "You're the beat of my heart.", emoji: "💓", category: "deep" },
    { text: "I choose you. And I'll choose you over and over again.", emoji: "✅", category: "deep" },
    { text: "You're my forever and always.", emoji: "🕰️", category: "deep" },
    { text: "I love you not only for who you are, but for who I am when I'm with you.", emoji: "🌟", category: "deep" },
    { text: "You're my favorite distraction.", emoji: "🎯", category: "funny" },
    { text: "I love you more than all the grains of sand.", emoji: "🏖️", category: "sweet" },
    { text: "You're my happily ever after.", emoji: "🏰", category: "deep" },
    { text: "I love you more than sleep, and that's a lot.", emoji: "😴", category: "funny" },
    { text: "You're the best part of my day.", emoji: "🎉", category: "daily" },
    
    // More Funny
    { text: "I love you more than all the wifi in the world.", emoji: "📶", category: "funny" },
    { text: "You're my favorite 'good morning' and 'good night'.", emoji: "🌙", category: "daily" },
    { text: "I love you more than chocolate.", emoji: "🍫", category: "funny" },
    { text: "You're my greatest adventure.", emoji: "🗺️", category: "sweet" },
    { text: "I love you more than music, and you know that's true.", emoji: "🎵", category: "sweet" },
    { text: "You're my favorite place to be.", emoji: "📍", category: "sweet" },
    { text: "I love you more than all the stars in the universe.", emoji: "🌌", category: "sweet" },
    { text: "You're my always and forever.", emoji: "💞", category: "deep" },
    { text: "I love you more than words can say.", emoji: "🔤", category: "deep" },
    { text: "You're my one in a million.", emoji: "💯", category: "sweet" },
    
    // Creative
    { text: "I love you more than all the oxygen in the air.", emoji: "🌬️", category: "deep" },
    { text: "You're my favorite song on repeat.", emoji: "🔄", category: "sweet" },
    { text: "I love you more than all the pages in my favorite book.", emoji: "📚", category: "sweet" },
    { text: "You're my masterpiece.", emoji: "🎨", category: "deep" },
    { text: "I love you more than all the pixels on this screen.", emoji: "🖥️", category: "funny" },
    { text: "You're my favorite discovery.", emoji: "🔍", category: "sweet" },
    { text: "I love you more than all the raindrops in a storm.", emoji: "☔", category: "sweet" },
    { text: "You're my silver lining.", emoji: "☁️", category: "deep" },
    { text: "I love you more than all the memories we've made.", emoji: "📸", category: "sweet" },
    { text: "You're my favorite 'us'.", emoji: "👫", category: "sweet" },
    
    // Dreamy
    { text: "I love you more than all the dreams I've ever dreamed.", emoji: "💤", category: "deep" },
    { text: "You're my reality, better than any dream.", emoji: "🌈", category: "deep" },
    { text: "I love you more than all the seasons combined.", emoji: "🍂❄️🌸☀️", category: "sweet" },
    { text: "You're my forever home.", emoji: "🏡", category: "deep" },
    { text: "I love you more than all the coffee in the world.", emoji: "☕", category: "funny" },
    { text: "You're my favorite notification.", emoji: "🔔", category: "daily" },
    { text: "I love you more than all the sunsets we've watched.", emoji: "🌇", category: "sweet" },
    { text: "You're my favorite color.", emoji: "🎨", category: "sweet" },
    { text: "I love you more than all the butterflies in my stomach.", emoji: "🦋", category: "sweet" },
    { text: "You're my favorite smell - the one I search for in a crowd.", emoji: "👃", category: "sweet" },
    
    // Physical & Emotional
    { text: "I love you more than all the hugs we've shared.", emoji: "🤗", category: "sweet" },
    { text: "You're my favorite taste - like sweet forever.", emoji: "🍯", category: "sweet" },
    { text: "I love you more than all the kisses we've stolen.", emoji: "💋", category: "sweet" },
    { text: "You're my favorite touch - the hand I want to hold.", emoji: "🤝", category: "sweet" },
    { text: "I love you more than all the sounds of laughter.", emoji: "😆", category: "funny" },
    { text: "You're my favorite sight - the face I want to see.", emoji: "👀", category: "sweet" },
    { text: "I love you more than all the feelings in my heart.", emoji: "💖", category: "deep" },
    { text: "You're the calm in my storm.", emoji: "🌊", category: "deep" },
    { text: "I love you more than all the waves in the ocean.", emoji: "🌊", category: "sweet" },
    { text: "You're my lighthouse guiding me home.", emoji: "💡", category: "deep" },
    
    // Daily Life
    { text: "I love you more than my morning coffee.", emoji: "☕", category: "funny" },
    { text: "You're the highlight of my day, every day.", emoji: "✨", category: "daily" },
    { text: "I love you more than all the memes in the world.", emoji: "😂", category: "funny" },
    { text: "You're my favorite person to annoy.", emoji: "😜", category: "funny" },
    { text: "I love you more than my phone, and that's impressive.", emoji: "📱", category: "funny" },
    { text: "You're my favorite Wi-Fi - I always connect with you.", emoji: "📶", category: "funny" },
    { text: "I love you more than all the Netflix shows.", emoji: "📺", category: "funny" },
    { text: "You're my favorite binge-watch.", emoji: "🍿", category: "funny" },
    { text: "I love you more than all the desserts.", emoji: "🍰", category: "funny" },
    { text: "You're my sweetest treat.", emoji: "🍬", category: "sweet" },
    
    // Extra Special
    { text: "I love you more than all the flowers in the garden.", emoji: "🌸", category: "sweet" },
    { text: "You're my sunshine on a cloudy day.", emoji: "☁️", category: "daily" },
    { text: "I love you more than all the rainbows after rain.", emoji: "🌈", category: "sweet" },
    { text: "You're my pot of gold.", emoji: "🏆", category: "sweet" },
    { text: "I love you more than all the candles on my cake.", emoji: "🎂", category: "funny" },
    { text: "You're my birthday wish come true.", emoji: "✨", category: "sweet" },
    { text: "I love you more than all the fireworks in the sky.", emoji: "🎆", category: "sweet" },
    { text: "You're my sparkle in the dark.", emoji: "💫", category: "sweet" },
    { text: "I love you more than all the songs ever written.", emoji: "🎶", category: "sweet" },
    { text: "You're my favorite melody.", emoji: "🎵", category: "sweet" }
  ];

  // DOM Elements
  const noteText = document.getElementById('loveNoteText');
  const noteIcon = document.querySelector('.note-icon');
  const newNoteBtn = document.getElementById('newNoteBtn');
  const saveNoteBtn = document.getElementById('saveNoteBtn');
  
  // NEW STATS ELEMENTS
  const totalNotesReadEl = document.getElementById('totalNotesRead');
  const daysActiveEl = document.getElementById('daysActive');
  const favoritesCount = document.getElementById('favoritesCount');
  
  const favoritesMiniGrid = document.getElementById('favoritesMiniGrid');
  const viewAllBtn = document.getElementById('viewAllFavorites');
  const favoritesModal = document.getElementById('favoritesModal');
  const closeModalBtn = document.getElementById('closeFavoritesModal');
  const favoritesFullGrid = document.getElementById('favoritesFullGrid');
  const noteCard = document.querySelector('.note-card');
  const categoryBtns = document.querySelectorAll('.category-btn');
  
  // State
  let currentNoteIndex = 0;
  let currentCategory = 'all';
  let favorites = JSON.parse(localStorage.getItem('loveNotesFavorites')) || [];
  
  // NEW STATS
  let totalNotesRead = parseInt(localStorage.getItem('totalNotesRead') || '0');
  let firstVisitDate = localStorage.getItem('firstVisitDate');
  
  // Initialize
  function init() {
    updateStats();
    updateFavoritesDisplay();
    showRandomNote();
    
    // Set up event listeners
    newNoteBtn?.addEventListener('click', showRandomNote);
    saveNoteBtn?.addEventListener('click', saveCurrentNote);
    viewAllBtn?.addEventListener('click', showAllFavorites);
    closeModalBtn?.addEventListener('click', closeModal);
    
    // Category buttons
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        showRandomNote();
      });
    });
    
    // Double-click to save
    noteCard?.addEventListener('dblclick', saveCurrentNote);
    
    // Close modal when clicking outside
    favoritesModal?.addEventListener('click', (e) => {
      if (e.target === favoritesModal) {
        closeModal();
      }
    });
  }
  
  // NEW STATS FUNCTION - replaces updateStreak
  function updateStats() {
    // Update notes read count
    if (totalNotesReadEl) {
      totalNotesReadEl.textContent = totalNotesRead;
    }
    
    // Calculate days active
    if (!firstVisitDate) {
      firstVisitDate = new Date().toDateString();
      localStorage.setItem('firstVisitDate', firstVisitDate);
      if (daysActiveEl) daysActiveEl.textContent = '1';
    } else {
      const firstDate = new Date(firstVisitDate);
      const today = new Date();
      const dayDiff = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24)) + 1;
      if (daysActiveEl) daysActiveEl.textContent = dayDiff;
    }
    
    // Update favorites count
    if (favoritesCount) {
      favoritesCount.textContent = favorites.length;
    }
  }
  
  function showRandomNote() {
    // Filter notes by category
    let availableNotes = loveNotes;
    if (currentCategory !== 'all') {
      availableNotes = loveNotes.filter(note => note.category === currentCategory);
    }
    
    const randomIndex = Math.floor(Math.random() * availableNotes.length);
    const note = availableNotes[randomIndex];
    
    // Find original index for saving
    currentNoteIndex = loveNotes.findIndex(n => n.text === note.text);
    
    // Update display
    if (noteText) {
      noteText.textContent = `"${note.text}"`;
    }
    
    if (noteIcon) {
      noteIcon.textContent = note.emoji || '💕';
    }
    
    // Add animation
    if (noteCard) {
      noteCard.classList.add('note-pop');
      setTimeout(() => {
        noteCard.classList.remove('note-pop');
      }, 500);
    }
    
    // Increment notes read counter
    totalNotesRead++;
    localStorage.setItem('totalNotesRead', totalNotesRead);
    updateStats();
  }
  
  function saveCurrentNote() {
    const currentNote = loveNotes[currentNoteIndex];
    
    // Check if already saved
    const isAlreadySaved = favorites.some(fav => fav.text === currentNote.text);
    
    if (!isAlreadySaved) {
      favorites.push(currentNote);
      localStorage.setItem('loveNotesFavorites', JSON.stringify(favorites));
      
      showSuccessMessage('💖 Saved to favorites!');
      updateFavoritesDisplay();
      updateStats(); // Update favorites count
    } else {
      showSuccessMessage('✨ Already in favorites');
    }
  }
  
  function updateFavoritesDisplay() {
    // Update count
    if (favoritesCount) {
      favoritesCount.textContent = favorites.length;
    }
    
    // Update mini grid
    if (favoritesMiniGrid) {
      if (favorites.length === 0) {
        favoritesMiniGrid.innerHTML = '<div class="empty-favorites">Save notes to see them here 💕</div>';
      } else {
        favoritesMiniGrid.innerHTML = favorites.slice(0, 8).map((note, index) => `
          <div class="favorite-mini-item" data-note="${note.text}" data-index="${index}">
            ${note.emoji || '💕'}
          </div>
        `).join('');
        
        // Add click events to mini items
        document.querySelectorAll('.favorite-mini-item').forEach(item => {
          item.addEventListener('click', () => {
            const index = item.dataset.index;
            loadFavorite(favorites[index]);
          });
        });
      }
    }
  }
  
  function showAllFavorites() {
    if (!favoritesFullGrid) return;
    
    if (favorites.length === 0) {
      favoritesFullGrid.innerHTML = '<div class="empty-favorites">No saved notes yet 💕</div>';
    } else {
      favoritesFullGrid.innerHTML = favorites.map((note, index) => `
        <div class="favorite-full-item" data-index="${index}">
          <div class="favorite-full-emoji">${note.emoji || '💕'}</div>
          <div class="favorite-full-text">"${note.text.substring(0, 30)}${note.text.length > 30 ? '...' : ''}"</div>
          <div class="favorite-remove-btn" onclick="removeFavorite(${index})">×</div>
        </div>
      `).join('');
      
      // Add click events to load note
      document.querySelectorAll('.favorite-full-item').forEach(item => {
        item.addEventListener('click', (e) => {
          if (!e.target.classList.contains('favorite-remove-btn')) {
            const index = item.dataset.index;
            loadFavorite(favorites[index]);
            closeModal();
          }
        });
      });
    }
    
    favoritesModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  window.removeFavorite = function(index) {
    favorites.splice(index, 1);
    localStorage.setItem('loveNotesFavorites', JSON.stringify(favorites));
    updateFavoritesDisplay();
    updateStats(); // Update favorites count
    showAllFavorites(); // Refresh modal
    showSuccessMessage('💔 Note removed');
  };
  
  function loadFavorite(note) {
    const index = loveNotes.findIndex(n => n.text === note.text);
    if (index !== -1) {
      currentNoteIndex = index;
      noteText.textContent = `"${note.text}"`;
      noteIcon.textContent = note.emoji || '💕';
      
      noteCard.classList.add('note-pop');
      setTimeout(() => {
        noteCard.classList.remove('note-pop');
      }, 500);
    }
  }
  
  function closeModal() {
    favoritesModal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function showSuccessMessage(message) {
    const msg = document.createElement('div');
    msg.className = 'save-success';
    msg.textContent = message;
    document.body.appendChild(msg);
    
    setTimeout(() => {
      msg.remove();
    }, 2000);
  }
  
  // Start
  init();
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoveNotes);
} else {
  initLoveNotes();
}