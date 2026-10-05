/**
 * ============================================================
 * BUTTERFLY PEA MEMORY GARDEN — STORY TRANSITION ENGINE
 * Hệ Thống Chuyển Động & Bối Cảnh 9 Chương Của Câu Chuyện Tình Yêu
 * 
 * Visual Identity Chung:
 * - Hồng Pastel (#ffd5e5, #fbcfe8, #f472b6)
 * - Xanh Hoa Đậu Biếc (#1d4ed8, #2563eb, #3b82f6)
 * - Photorealistic, Romantic, Luxury, Cinematic, Ánh Sáng Mềm
 * 
 * 9 Chương với bố cục, môi trường và animation riêng biệt:
 * Chapter 01: Mỹ phẩm studio (Vanity, specular glints, gold dust)
 * Chapter 02: Hoa rủ / botanical composition (Cascading vines, pendulum sway, falling petals)
 * Chapter 03: Nước / reflection / cánh hoa (Interactive water ripples, caustics, floating petals)
 * Chapter 04: Gương / luxury room (Candle flicker, mirror prismatic flare, 2.5D depth)
 * Chapter 05: Marble / glass / crystal (Rainbow prism dispersion, 4-point star glints, marble sheen)
 * Chapter 06: Satin / silk / flowers (Fluid silk wave displacement, satin luster sweep)
 * Chapter 07: Botanical garden (Volumetric god rays, rising greenhouse mist, climbing vines)
 * Chapter 08: Dreamy floral environment (Zero-gravity levitating flowers, bioluminescent stardust)
 * Chapter 09: Final romantic scene (Floating sky lanterns, heart petal vortex, soft fireworks)
 * ============================================================
 */

(function (window, document) {
  'use strict';

  // --- DỮ LIỆU 9 CHƯƠNG NGHỆ THUẬT ---
  const CHAPTERS_DATA = [
    {
      id: 1,
      key: 'cosmetic-studio',
      number: 'CHAPTER 01',
      roman: 'I',
      title: 'Mỹ Phẩm Studio',
      subtitle: 'Ký Ức Ban Đầu & Hương Sắc Tinh Khôi',
      desc: 'Căn phòng studio sang trọng ngập tràn ánh nắng sớm mai. Những lọ mỹ phẩm hoa đậu biếc cao cấp, lụa hồng pastel và mặt bàn cẩm thạch Carrara phản chiếu nét kiêu sa.',
      reflectionNarrative: '🌸 Khởi nguồn từ Bông Hoa Gốc: Ánh hoa biếc tinh khôi soi bóng trên mặt bàn cẩm thạch Carrara và những lọ mỹ phẩm tình yêu.',
      image: 'assets/images/chapters/chapter_01.jpg?v=20261005_v3',
      moodColor: 'rgba(255, 182, 193, 0.25)',
      accentColor: '#3b82f6'
    },
    {
      id: 2,
      key: 'cascading-flora',
      number: 'CHAPTER 02',
      roman: 'II',
      title: 'Hoa Rủ & Vũ Điệu Màn Thơ',
      subtitle: 'Thác Hoa Đậu Biếc & Nhành Hồng Đung Đưa',
      desc: 'Vòm trần cổ điển buông rủ những chùm hoa đậu biếc biếc xanh và hoa hồng pastel như bức màn hoa sống động. Từng nhánh hoa đung đưa êm dịu trong làn gió thoảng.',
      reflectionNarrative: '🌿 Vũ điệu hoa rủ: Luồng sáng phản chiếu lay động thác hoa biếc và nhành hồng đung đưa êm dịu trong làn gió thoảng.',
      image: 'assets/images/chapters/chapter_02.jpg',
      moodColor: 'rgba(59, 130, 246, 0.22)',
      accentColor: '#1d4ed8'
    },
    {
      id: 3,
      key: 'water-reflection',
      number: 'CHAPTER 03',
      roman: 'III',
      title: 'Mặt Nước & Phản Chiếu',
      subtitle: 'Gợn Sóng Pha Lê & Cánh Hoa Trôi Lững Lờ',
      desc: 'Làn nước trong vắt phẳng lặng như gương phản chiếu bầu trời hoàng hôn tím hồng. Những cánh hoa đậu biếc bồng bềnh dập dềnh theo từng gợn sóng đồng tâm.',
      reflectionNarrative: '💧 Mặt nước phản chiếu: Làn nước pha lê bừng sáng với những vòng sóng đồng tâm phản chiếu ảo ảnh hoa đậu biếc lung linh.',
      image: 'assets/images/chapters/chapter_03.jpg',
      moodColor: 'rgba(96, 165, 250, 0.25)',
      accentColor: '#2563eb'
    },
    {
      id: 4,
      key: 'mirror-luxury-room',
      number: 'CHAPTER 04',
      roman: 'IV',
      title: 'Gương Soi & Phòng Quý Tộc',
      subtitle: 'Khung Gương Mạ Vàng & Chiều Sâu Vô Tận',
      desc: 'Chiếc gương Baroque mạ vàng chạm khắc tỉ mỉ phản chiếu căn phòng boudoir lãng mạn. Ánh nến ấm áp lung linh chập chờn, hoa đậu biếc cắm trong bình pha lê kiêu hãnh.',
      reflectionNarrative: '🪞 Gương soi Boudoir: Khung gương Baroque mạ vàng phản chiếu ánh hoa vào chiều sâu vô tận cùng ánh nến ấm áp.',
      image: 'assets/images/chapters/chapter_04.jpg',
      moodColor: 'rgba(251, 191, 36, 0.22)',
      accentColor: '#d97706'
    },
    {
      id: 5,
      key: 'marble-crystal',
      number: 'CHAPTER 05',
      roman: 'V',
      title: 'Đá Marble & Pha Lê Tinh Khiết',
      subtitle: 'Hình Khối Kiệt Tác & Khúc Xạ Cầu Vồng',
      desc: 'Các bục đá hoa cương Carrara đa tầng kết hợp khối pha lê vát cạnh và bình nước hoa trong suốt. Ánh sáng xuyên qua tán sắc thành dải cầu vồng rực rỡ.',
      reflectionNarrative: '💎 Pha lê & Marble: Ánh hoa tán sắc qua các lăng kính pha lê vát cạnh thành dải cầu vồng 7 màu rực rỡ.',
      image: 'assets/images/chapters/chapter_05.jpg',
      moodColor: 'rgba(236, 72, 153, 0.22)',
      accentColor: '#db2777'
    },
    {
      id: 6,
      key: 'satin-silk-flowers',
      number: 'CHAPTER 06',
      roman: 'VI',
      title: 'Lụa Satin & Cánh Hoa Tình Ái',
      subtitle: 'Dòng Sông Lụa Hồng & Sắc Biếc Kiêu Sa',
      desc: 'Những nếp gấp lụa satin hồng pastel và xanh hoa đậu biếc uốn lượn mềm mại như suối mây, nâng niu những bông hoa tươi và sợi chỉ vàng champagne óng ánh.',
      reflectionNarrative: '🎀 Dòng sông lụa satin: Dải phản chiếu mềm mại lướt trên những nếp gấp lụa hồng pastel và xanh hoa đậu biếc óng ả.',
      image: 'assets/images/chapters/chapter_06.jpg',
      moodColor: 'rgba(244, 114, 182, 0.26)',
      accentColor: '#ec4899'
    },
    {
      id: 7,
      key: 'botanical-garden',
      number: 'CHAPTER 07',
      roman: 'VII',
      title: 'Vườn Địa Đàng Trong Nhà Kính',
      subtitle: 'Vòm Kính Victorian & Suối Nắng Ban Mai',
      desc: 'Nhà kính thực vật hoàng gia với vòm sắt cổ kính đón ánh nắng ban mai rọi xiên qua làn sương mờ ảo. Những giàn hoa đậu biếc leo quấn quýt quanh cột trụ lãng mạn.',
      reflectionNarrative: '🌿 Vườn địa đàng Victorian: Suối ánh sáng phản chiếu hòa cùng god rays và làn sương sớm vút qua vòm kính hoàng gia.',
      image: 'assets/images/chapters/chapter_07.jpg',
      moodColor: 'rgba(52, 211, 153, 0.22)',
      accentColor: '#059669'
    },
    {
      id: 8,
      key: 'dreamy-floral',
      number: 'CHAPTER 08',
      roman: 'VIII',
      title: 'Miền Cổ Tích Mộng Mơ',
      subtitle: 'Không Trọng Lực & Bụi Sao Phát Quang',
      desc: 'Không gian siêu thực mộng mơ, nơi những bông hoa đậu biếc và cánh hoa trôi nổi bồng bềnh không trọng lực giữa màn sương hồng lam và những đốm bụi sao phát sáng kỳ ảo.',
      reflectionNarrative: '✨ Miền cổ tích siêu thực: Bông hoa lơ lửng không trọng lực giữa màn đêm huyền ảo và bụi sao phát quang nhiệm màu.',
      image: 'assets/images/chapters/chapter_08.jpg',
      moodColor: 'rgba(168, 85, 247, 0.25)',
      accentColor: '#8b5cf6'
    },
    {
      id: 9,
      key: 'final-romantic',
      number: 'CHAPTER 09',
      roman: 'IX',
      title: 'Khúc Vĩ Thanh Lãng Mạn',
      subtitle: 'Bầu Trời Đêm Hoa Đăng & Ban Công Nguyện Ước',
      desc: 'Khoảnh khắc êm đềm và riêng tư của đôi mình: Ban công hoàng hôn nhìn ra vịnh biển yên bình dưới ngàn vì sao, hai ly champagne sóng sánh, ánh nến lung linh và những ngọn hoa đăng mang theo lời nguyện ước dài lâu dành riêng cho Cá Sudo & Khây Ti.',
      reflectionNarrative: '💖 Khúc vĩ thanh lãng mạn: Đích đến tuyệt mỹ nơi ban công ngàn sao, hoa đăng nguyện ước thắp sáng tình yêu dài lâu của Cá Sudo ♡ Khây Ti!',
      image: 'assets/images/chapters/chapter_09_romantic.jpg?v=20261005_v3',
      moodColor: 'rgba(251, 113, 133, 0.28)',
      accentColor: '#e11d48'
    }
  ];

  // --- ÂM THANH CHUÔNG GIÓ CELESTIAL KHI ĐỔI CHƯƠNG (WEB AUDIO HARMONIC CHIME) ---
  let audioCtx = null;
  function playChapterTransitionChime(chapterIdx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});

      const now = audioCtx.currentTime;
      // Gam hợp âm ngũ cung lãng mạn (Pentatonic Major Harmony)
      const baseFreqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
      const root = baseFreqs[chapterIdx % baseFreqs.length];
      const notes = [root, root * 1.25, root * 1.5, root * 2];

      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.045 / (i + 1), now + i * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 1.3);
      });
    } catch (e) {
      // Bỏ qua lỗi audio nếu chưa được user interaction
    }
  }

  // --- ÂM THANH BỪNG NỞ PHA LÊ KHI BẤM BÔNG HOA GỐC (CRYSTALLINE AWAKENING CHORD) ---
  function playReflectionAwakeningChord() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});

      const now = audioCtx.currentTime;
      // Crystalline Major 9th Harmonic Bloom (E, B, E', G#', D#'', F#'')
      const freqs = [329.63, 493.88, 659.25, 830.61, 1174.66, 1479.98];
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.035 / (idx + 1), now + idx * 0.05 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 2.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 2.6);
      });
    } catch (_) {}
  }

  // ============================================================
  // CLASS STORY TRANSITION ENGINE
  // ============================================================
  class StoryTransitionEngine {
    constructor() {
      this.currentChapterIndex = -1; // -1: Nền Gốc (Root living scene), 0..8: Chapter 1..9
      this.isTransitioning = false;
      this.autoPlayInterval = null;
      this.autoPlayDuration = 9000; // 9 giây mỗi chương khi tự động chiếu
      this.isAutoPlaying = false;
      this.activeAnimationCancel = null;

      // Trạng thái Hành Trình Phản Chiếu 9 Màn Hình từ Bông Hoa Gốc
      this.isReflectionJourneyActive = false;
      this.isReflectionPaused = false;
      this.reflectionStepIndex = 0;
      this.reflectionTimer = null;
      this.reflectionHUD = null;

      this.livingFrame = document.getElementById('livingFrame');
      if (!this.livingFrame) {
        console.warn('StoryTransitionEngine: #livingFrame not found.');
        return;
      }

      this.initDOMElements();
      this.initScenes();
      this.initNavbar();
      this.initExitChapterPill();
      this.initActiveChapterTag();
      this.initReflectionHUD();
      this.bindEvents();
      this.bindRootFlowerInteractions();

      // Gắn Singleton toàn cục sớm
      window.storyEngineInstance = this;
      window.storyTransitionEngine = this;

      // Bật Chapter theo URL parameter ?ch=X hoặc mặc định Nền Gốc ban đầu
      let startIdx = -1;
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const chParam = parseInt(urlParams.get('ch'), 10);
        if (!isNaN(chParam) && chParam >= 1 && chParam <= 9) {
          startIdx = chParam - 1;
        } else {
          const hashMatch = window.location.hash.match(/chapter-(\d+)/i);
          if (hashMatch) {
            const hNum = parseInt(hashMatch[1], 10);
            if (hNum >= 1 && hNum <= 9) startIdx = hNum - 1;
          }
        }
      } catch (_) {}

      if (startIdx >= 0) {
        this.switchChapter(startIdx, false);
      } else {
        // Mặc định ban đầu: Nền Gốc (Root Living Scene) với đầy đủ mỹ phẩm và bông hoa tương tác
        this.returnToRootScene(false);
      }
    }

    // --- Khởi tạo cấu trúc DOM container bên trong #livingFrame ---
    initDOMElements() {
      // 1. Container bao trùm 9 Scene
      let container = document.getElementById('storyChaptersContainer');
      if (!container) {
        container = document.createElement('div');
        container.id = 'storyChaptersContainer';
        container.className = 'story-chapters-container';
        // Chèn ngay đầu #livingFrame để làm nền chuẩn
        this.livingFrame.insertBefore(container, this.livingFrame.firstChild);
      }
      this.scenesContainer = container;

      // 2. Lớp chớp sáng điện ảnh khi chuyển cảnh
      let flash = document.getElementById('storyTransitionFlash');
      if (!flash) {
        flash = document.createElement('div');
        flash.id = 'storyTransitionFlash';
        flash.className = 'story-transition-flash';
        this.livingFrame.appendChild(flash);
      }
      this.transitionFlash = flash;
    }

    // --- Tạo 9 Scene cho 9 Chương ---
    initScenes() {
      this.scenes = [];
      this.canvases = [];
      this.sceneAnimations = [];

      CHAPTERS_DATA.forEach((data, index) => {
        const sceneEl = document.createElement('div');
        sceneEl.className = `story-chapter-scene scene-ch${data.id}`;
        sceneEl.setAttribute('data-chapter', data.id);

        // Ảnh nền Photorealistic
        const imgEl = document.createElement('img');
        imgEl.className = 'story-chapter-backdrop';
        imgEl.src = data.image;
        imgEl.alt = `${data.number} - ${data.title}`;
        imgEl.loading = 'eager';

        // Lớp phủ ánh sáng Ambient
        const ambientEl = document.createElement('div');
        ambientEl.className = 'story-chapter-ambient';

        // Lớp Vignette điện ảnh
        const vignetteEl = document.createElement('div');
        vignetteEl.className = 'story-chapter-vignette';

        // Lớp Môi Trường DOM riêng
        const envEl = document.createElement('div');
        envEl.className = 'story-chapter-env';

        // Thêm các thành phần môi trường đặc thù
        if (data.id === 3) {
          const sheen = document.createElement('div');
          sheen.className = 'scene-ch3-water-sheen';
          envEl.appendChild(sheen);
        } else if (data.id === 4) {
          const candleGlow = document.createElement('div');
          candleGlow.className = 'scene-ch4-candle-glow';
          envEl.appendChild(candleGlow);
        } else if (data.id === 9) {
          const loveAura = document.createElement('div');
          loveAura.className = 'scene-ch9-love-aura';
          envEl.appendChild(loveAura);
        }

        // Canvas vẽ hiệu ứng chuyển động riêng
        const canvasEl = document.createElement('canvas');
        canvasEl.className = 'story-chapter-canvas';
        canvasEl.id = `chapterCanvas${data.id}`;

        sceneEl.appendChild(imgEl);
        sceneEl.appendChild(ambientEl);
        sceneEl.appendChild(vignetteEl);
        sceneEl.appendChild(envEl);
        sceneEl.appendChild(canvasEl);

        this.scenesContainer.appendChild(sceneEl);
        this.scenes.push(sceneEl);
        this.canvases.push(canvasEl);
      });
    }

    // --- Khởi tạo thanh điều hướng 9 Chapter (Story Chapter NavBar) ---
    initNavbar() {
      let navBar = document.getElementById('storyChapterNavBar');
      if (!navBar) {
        navBar = document.createElement('nav');
        navBar.id = 'storyChapterNavBar';
        navBar.className = 'story-chapter-nav-bar';
        navBar.setAttribute('aria-label', 'Điều hướng 9 chương câu chuyện');

        // Nút Quay Lại Nền Gốc (Root Living Scene)
        const rootBtn = document.createElement('button');
        rootBtn.type = 'button';
        rootBtn.className = 'story-nav-root-btn active';
        rootBtn.id = 'storyNavRootBtn';
        rootBtn.title = 'Quay lại nền phòng gốc với mỹ phẩm & hoa tương tác';
        rootBtn.innerHTML = '<i class="fa-solid fa-house"></i> <span>Nền Gốc</span>';
        rootBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.returnToRootScene();
        });

        // Nút lùi (Prev)
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'story-nav-btn prev-btn';
        prevBtn.title = 'Chương trước (Mũi tên trái)';
        prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.prevChapter();
        });

        // Danh sách 9 nút chương
        const dotsList = document.createElement('div');
        dotsList.className = 'story-chapter-dots-list';

        this.dotButtons = [];
        CHAPTERS_DATA.forEach((data, index) => {
          const dotBtn = document.createElement('button');
          dotBtn.type = 'button';
          dotBtn.className = 'story-chapter-dot-btn';
          dotBtn.setAttribute('data-index', index);
          dotBtn.title = `${data.number}: ${data.title}`;
          dotBtn.innerHTML = `<span class="dot-num">${data.roman}</span>`;
          dotBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.switchChapter(index);
            // Mở thẻ thông tin chương khi bấm vào chương
            if (this.activeChapterTag && this.activeChapterTag.classList.contains('closed')) {
              this.activeChapterTag.classList.remove('closed');
              this.updateActiveChapterTag(CHAPTERS_DATA[index]);
            }
          });
          dotsList.appendChild(dotBtn);
          this.dotButtons.push(dotBtn);
        });

        // Nút tiến (Next)
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'story-nav-btn next-btn';
        nextBtn.title = 'Chương kế tiếp (Mũi tên phải)';
        nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.nextChapter();
        });

        // Nút Tự Động Trình Chiếu (Auto-play Tour)
        const autoPlayBtn = document.createElement('button');
        autoPlayBtn.type = 'button';
        autoPlayBtn.className = 'story-autoplay-btn';
        autoPlayBtn.id = 'storyAutoplayBtn';
        autoPlayBtn.title = 'Tự động trình chiếu 9 chương';
        autoPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        autoPlayBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleAutoPlay();
        });

        // Nút Bông Hoa Gốc Phản Chiếu 9 Màn Hình
        const flowerReflectBtn = document.createElement('button');
        flowerReflectBtn.type = 'button';
        flowerReflectBtn.className = 'story-nav-flower-btn';
        flowerReflectBtn.id = 'storyNavFlowerReflectBtn';
        flowerReflectBtn.title = 'Bấm hoa gốc và phản chiếu qua 9 màn hình';
        flowerReflectBtn.innerHTML = '<span>🌸</span> <span>Phản Chiếu 9 Màn Hình</span>';
        flowerReflectBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.startReflectionJourney();
        });

        navBar.appendChild(rootBtn);
        navBar.appendChild(prevBtn);
        navBar.appendChild(dotsList);
        navBar.appendChild(nextBtn);
        navBar.appendChild(autoPlayBtn);
        navBar.appendChild(flowerReflectBtn);

        this.livingFrame.appendChild(navBar);
      }
      this.navBar = navBar;
    }

    // --- Nút Nổi Thoát Nhanh Về Nền Gốc khi đang ở trong các Chương ---
    initExitChapterPill() {
      let pill = document.getElementById('storyExitChapterBtn');
      if (!pill) {
        pill = document.createElement('button');
        pill.type = 'button';
        pill.id = 'storyExitChapterBtn';
        pill.className = 'story-exit-chapter-btn hidden';
        pill.title = 'Tắt chế độ chương và quay lại nền phòng gốc';
        pill.innerHTML = '<i class="fa-solid fa-arrow-left"></i> <span>Quay lại Nền Gốc</span>';
        pill.addEventListener('click', (e) => {
          e.stopPropagation();
          this.returnToRootScene();
        });
        this.livingFrame.appendChild(pill);
      }
      this.exitChapterBtn = pill;
    }

    // --- Khởi tạo Thẻ Thông Tin Chương Đang Chiếu ---
    initActiveChapterTag() {
      let tag = document.getElementById('storyActiveChapterTag');
      if (!tag) {
        tag = document.createElement('div');
        tag.id = 'storyActiveChapterTag';
        tag.className = 'story-active-chapter-tag closed';
        tag.setAttribute('aria-live', 'polite');

        tag.innerHTML = `
          <div class="tag-header">
            <span class="tag-badge" id="storyTagBadge">
              <span class="ch-text">CHƯƠNG 01</span>
              <span class="roman">I</span>
            </span>
            <button type="button" class="tag-close-btn" id="storyTagCloseBtn" title="Tắt chương &amp; Quay lại nền gốc" aria-label="Tắt chương &amp; Quay lại nền gốc">
              <i class="fa-solid fa-xmark"></i> <span class="btn-text">Về Nền Gốc</span>
            </button>
          </div>
          <h3 class="tag-title" id="storyTagTitle">Mỹ Phẩm Studio</h3>
          <p class="tag-subtitle" id="storyTagSubtitle">Ký Ức Ban Đầu & Hương Sắc Tinh Khôi</p>
          <p class="tag-desc" id="storyTagDesc">Căn phòng studio sang trọng ngập tràn ánh nắng sớm mai...</p>
        `;

        this.livingFrame.appendChild(tag);

        const closeBtn = tag.querySelector('#storyTagCloseBtn');
        if (closeBtn) {
          closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.returnToRootScene();
          });
        }
      }
      this.activeChapterTag = tag;
    }

    // --- Cập nhật nội dung Thẻ Thông Tin Chương ---
    updateActiveChapterTag(chapter) {
      if (!this.activeChapterTag || !chapter) return;

      const badge = this.activeChapterTag.querySelector('#storyTagBadge');
      const title = this.activeChapterTag.querySelector('#storyTagTitle');
      const subtitle = this.activeChapterTag.querySelector('#storyTagSubtitle');
      const desc = this.activeChapterTag.querySelector('#storyTagDesc');

      if (badge) {
        badge.innerHTML = `<span class="ch-text">${chapter.number}</span> <span class="roman">${chapter.roman}</span>`;
      }
      if (title) title.textContent = chapter.title;
      if (subtitle) subtitle.textContent = chapter.subtitle;
      if (desc) desc.textContent = chapter.desc;

      if (this.activeChapterTag.classList.contains('closed')) return;

      // Hiệu ứng fade in nhẹ khi đổi thông tin
      this.activeChapterTag.style.animation = 'none';
      void this.activeChapterTag.offsetWidth;
      this.activeChapterTag.style.animation = 'tagEntrance 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    }

    // --- Quay Lại Nền Gốc (Exit Chapter Mode -> Restore Root Living Scene) ---
    returnToRootScene(playSound = true) {
      this.stopAutoPlay();
      this.stopReflectionJourney();

      this.currentChapterIndex = -1;

      // Hủy bỏ animation riêng của chapter đang chạy (nếu có)
      if (this.activeAnimationCancel) {
        try { this.activeAnimationCancel(); } catch (_) {}
        this.activeAnimationCancel = null;
      }

      // Ẩn toàn bộ 9 chapter scenes
      if (this.scenes) {
        this.scenes.forEach((scene) => {
          scene.classList.remove('active', 'exiting');
        });
      }

      // Xóa các class chapter trên livingFrame và kích hoạt class scene-root-active
      for (let c = 1; c <= 9; c++) {
        this.livingFrame.classList.remove(`chapter-active-${c}`);
      }
      this.livingFrame.classList.add('scene-root-active');

      // Cập nhật trạng thái các nút trong Navbar
      if (this.dotButtons) {
        this.dotButtons.forEach(btn => btn.classList.remove('active'));
      }
      const rootNavBtn = document.getElementById('storyNavRootBtn');
      if (rootNavBtn) rootNavBtn.classList.add('active');

      const autoPlayBtn = document.getElementById('storyAutoplayBtn');
      if (autoPlayBtn) {
        autoPlayBtn.classList.remove('playing');
        autoPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      }

      const navFlowerBtn = document.getElementById('storyNavFlowerReflectBtn');
      if (navFlowerBtn) navFlowerBtn.classList.remove('active-journey');

      // Đóng thẻ chương & ẩn pill thoát & ẩn reflection HUD
      if (this.activeChapterTag) this.activeChapterTag.classList.add('closed');
      if (this.exitChapterBtn) this.exitChapterBtn.classList.add('hidden');
      this.hideReflectionHUD();

      // Phục hồi lại hoàn toàn hiển thị và tương tác của nền gốc
      const hotspots = document.getElementById('bottleHotspotsContainer');
      const touchHint = document.getElementById('flowerTouchHint');
      const originalPhoto = this.livingFrame.querySelector('.main-uncut-image.living-photo');
      const flowerHalo = this.livingFrame.querySelector('.flower-root-halo');

      if (hotspots) {
        hotspots.style.opacity = '1';
        hotspots.style.pointerEvents = 'auto';
        hotspots.style.visibility = 'visible';
      }
      if (touchHint) {
        touchHint.style.display = 'flex';
        touchHint.style.opacity = '1';
        touchHint.style.pointerEvents = 'auto';
        touchHint.style.visibility = 'visible';
      }
      if (originalPhoto) {
        originalPhoto.style.opacity = '1';
        originalPhoto.style.visibility = 'visible';
      }
      if (flowerHalo) {
        flowerHalo.style.opacity = '1';
        flowerHalo.style.visibility = 'visible';
      }

      // Âm thanh chuông ngân êm dịu khi trở về phòng gốc
      if (playSound) {
        playChapterTransitionChime(0);
      }
    }

    // --- Chuyển Đổi Sang Chương Mục Tiêu ---
    switchChapter(targetIndex, playSound = true) {
      if (targetIndex < 0 || targetIndex >= CHAPTERS_DATA.length) return;
      if (this.isTransitioning && targetIndex === this.currentChapterIndex) return;

      this.isTransitioning = true;
      const prevIndex = this.currentChapterIndex;
      this.currentChapterIndex = targetIndex;
      const currentData = CHAPTERS_DATA[targetIndex];

      // Bỏ trạng thái nền gốc, tắt active trên nút Nền Gốc
      this.livingFrame.classList.remove('scene-root-active');
      const rootNavBtn = document.getElementById('storyNavRootBtn');
      if (rootNavBtn) rootNavBtn.classList.remove('active');

      // Hiển thị nút thoát nhanh về nền gốc (chỉ khi không trong hành trình phản chiếu)
      if (this.exitChapterBtn) {
        if (this.isReflectionJourneyActive) {
          this.exitChapterBtn.classList.add('hidden');
        } else {
          this.exitChapterBtn.classList.remove('hidden');
        }
      }

      // Đảm bảo ẩn thanh navbar dưới nếu đang trong hành trình phản chiếu
      if (this.navBar) {
        if (this.isReflectionJourneyActive) {
          this.navBar.classList.add('hidden');
        } else {
          this.navBar.classList.remove('hidden');
        }
      }

      // 1. Chớp sáng chuyển cảnh điện ảnh
      if (playSound && this.transitionFlash) {
        this.transitionFlash.classList.add('flash-active');
        setTimeout(() => {
          this.transitionFlash.classList.remove('flash-active');
        }, 900);
      }

      // 2. Âm thanh chuông gió
      if (playSound) {
        playChapterTransitionChime(targetIndex);
      }

      // 3. Cập nhật trạng thái class của các Scene
      this.scenes.forEach((scene, idx) => {
        if (idx === targetIndex) {
          scene.classList.remove('exiting');
          scene.classList.add('active');
        } else if (idx === prevIndex) {
          scene.classList.remove('active');
          scene.classList.add('exiting');
          setTimeout(() => {
            scene.classList.remove('exiting');
          }, 1400);
        } else {
          scene.classList.remove('active', 'exiting');
        }
      });

      // 4. Cập nhật các nút Dot trong Navbar
      if (this.dotButtons) {
        this.dotButtons.forEach((btn, idx) => {
          if (idx === targetIndex) {
            btn.classList.add('active');
            btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          } else {
            btn.classList.remove('active');
          }
        });
      }

      // 5. Cập nhật Thẻ Thông Tin Chương & class trên livingFrame
      for (let c = 1; c <= 9; c++) {
        this.livingFrame.classList.remove(`chapter-active-${c}`);
      }
      this.livingFrame.classList.add(`chapter-active-${targetIndex + 1}`);

      // Nếu không trong hành trình phản chiếu, mở thẻ chương
      if (!this.isReflectionJourneyActive && this.activeChapterTag) {
        this.activeChapterTag.classList.remove('closed');
      }
      this.updateActiveChapterTag(currentData);

      // 6. Ẩn hoàn toàn các phần tử của nền gốc để chiêm ngưỡng tác phẩm nghệ thuật từng chương
      const hotspots = document.getElementById('bottleHotspotsContainer');
      const touchHint = document.getElementById('flowerTouchHint');
      const originalPhoto = this.livingFrame.querySelector('.main-uncut-image.living-photo');
      const flowerHalo = this.livingFrame.querySelector('.flower-root-halo');

      if (hotspots) {
        hotspots.style.opacity = '0';
        hotspots.style.pointerEvents = 'none';
      }
      if (touchHint) {
        touchHint.style.opacity = '0';
        touchHint.style.pointerEvents = 'none';
      }
      if (originalPhoto) originalPhoto.style.opacity = '0';
      if (flowerHalo) flowerHalo.style.opacity = '0';

      // 7. Khởi động Animation riêng biệt của Chapter được kích hoạt
      this.startChapterAnimation(targetIndex);

      setTimeout(() => {
        this.isTransitioning = false;
      }, 1000);
    }

    prevChapter() {
      let target;
      if (this.currentChapterIndex < 0) {
        target = CHAPTERS_DATA.length - 1;
      } else {
        target = (this.currentChapterIndex - 1 + CHAPTERS_DATA.length) % CHAPTERS_DATA.length;
      }
      this.switchChapter(target);
    }

    nextChapter() {
      let target;
      if (this.currentChapterIndex < 0) {
        target = 0;
      } else {
        target = (this.currentChapterIndex + 1) % CHAPTERS_DATA.length;
      }
      this.switchChapter(target);
    }

    // --- Chế Độ Trình Chiếu Tự Động ---
    toggleAutoPlay() {
      const btn = document.getElementById('storyAutoplayBtn');
      if (this.isAutoPlaying) {
        this.stopAutoPlay();
        if (btn) {
          btn.classList.remove('playing');
          btn.innerHTML = '<i class="fa-solid fa-play"></i> <span>Tự Động</span>';
        }
      } else {
        this.startAutoPlay();
        if (btn) {
          btn.classList.add('playing');
          btn.innerHTML = '<i class="fa-solid fa-pause"></i> <span>Tạm Dừng</span>';
        }
      }
    }

    startAutoPlay() {
      this.isAutoPlaying = true;
      if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = setInterval(() => {
        this.nextChapter();
      }, this.autoPlayDuration);
    }

    stopAutoPlay() {
      this.isAutoPlaying = false;
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    }

    // --- Lắng nghe sự kiện bàn phím & vuốt chạm ---
    bindEvents() {
      // Phím mũi tên Trái / Phải để chuyển chương, phím Escape để về Nền Gốc
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowLeft') {
          this.prevChapter();
        } else if (e.key === 'ArrowRight') {
          this.nextChapter();
        } else if (e.key === 'Escape') {
          this.returnToRootScene();
        }
      });

      // Hỗ trợ Touch Swipe trên Mobile
      let touchStartX = 0;
      let touchStartY = 0;
      this.livingFrame.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      this.livingFrame.addEventListener('touchend', (e) => {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;
        // Chỉ nhận diện vuốt ngang nếu khoảng cách > 55px và góc nghiêng nhỏ
        if (Math.abs(diffX) > 55 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
          if (diffX > 0) {
            this.prevChapter();
          } else {
            this.nextChapter();
          }
        }
      }, { passive: true });

      // Resize Canvas đồng bộ
      window.addEventListener('resize', () => {
        this.resizeCurrentCanvas();
      });
    }

    resizeCurrentCanvas() {
      const canvas = this.canvases[this.currentChapterIndex];
      if (!canvas) return;
      const rect = this.livingFrame.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    // --- Lắng nghe sự kiện click trực tiếp vào Bông Hoa Gốc ---
    bindRootFlowerInteractions() {
      // 1. Hotspot Bông Hoa Gốc [data-bottle-id="flower_vase"]
      const flowerHotspot = this.livingFrame.querySelector('.bottle-hotspot[data-bottle-id="flower_vase"]');
      if (flowerHotspot) {
        flowerHotspot.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          this.startReflectionJourney();
        });
      }

      // 2. Thẻ gợi ý chạm bông hoa gốc (#flowerTouchHint)
      const touchHint = document.getElementById('flowerTouchHint');
      if (touchHint) {
        touchHint.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          this.startReflectionJourney();
        });
      }

      // 3. Các đầu hoa & cành hoa đung đưa
      ['blossomHead1', 'blossomHead2', 'branchTop', 'branchLeft', 'branchRight'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('click', (e) => {
            e.stopPropagation();
            this.startReflectionJourney();
          });
        }
      });
    }

    // --- Khởi tạo HUD Điều Khiển Hành Trình Phản Chiếu 9 Màn Hình ---
    initReflectionHUD() {
      let hud = document.getElementById('storyReflectionHUD');
      if (!hud) {
        hud = document.createElement('div');
        hud.id = 'storyReflectionHUD';
        hud.className = 'story-reflection-hud hidden';
        hud.setAttribute('aria-live', 'polite');

        hud.innerHTML = `
          <div class="hud-top-bar">
            <div class="hud-title-wrap">
              <span class="hud-pulse-flower">🌸</span>
              <span class="hud-main-title">Ánh Hoa Gốc Phản Chiếu Qua 9 Màn Hình</span>
            </div>
            <div class="hud-controls-wrap">
              <button type="button" class="hud-ctrl-btn hud-pause-btn" id="hudPauseBtn" title="Tạm dừng / Tiếp tục">
                <i class="fa-solid fa-pause"></i> <span class="pause-text">Tạm dừng</span>
              </button>
              <button type="button" class="hud-ctrl-btn hud-root-btn" id="hudRootBtn" title="Quay lại Nền Gốc">
                <i class="fa-solid fa-house"></i> <span>Nền Gốc</span>
              </button>
              <button type="button" class="hud-ctrl-btn hud-close-btn" id="hudCloseBtn" title="Dừng &amp; Quay lại nền gốc" aria-label="Đóng &amp; Quay lại nền gốc">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div class="hud-chapter-info">
            <div class="hud-ch-badge-row">
              <span class="hud-ch-badge" id="hudChBadge">CHƯƠNG 01 / 09</span>
              <h4 class="hud-ch-title" id="hudChTitle">Mỹ Phẩm Studio</h4>
            </div>
            <p class="hud-reflection-narrative" id="hudReflectionNarrative">Khởi nguồn từ Bông Hoa Gốc...</p>
          </div>
          <div class="hud-timeline-track">
            <div class="hud-beam-line-bg"></div>
            <div class="hud-beam-line-fill" id="hudBeamLineFill"></div>
            <div class="hud-nodes-list" id="hudNodesList">
              ${CHAPTERS_DATA.map((ch, idx) => `
                <button type="button" class="hud-node-dot" data-step="${idx}" title="${ch.number}: ${ch.title}">
                  ${ch.roman}
                </button>
              `).join('')}
            </div>
          </div>
          <div class="hud-finale-actions" id="hudFinaleActions">
            <button type="button" class="hud-finale-btn hud-replay-btn" id="hudReplayBtn">
              <i class="fa-solid fa-rotate-left"></i> <span>Chiêm ngưỡng lại từ đầu</span>
            </button>
            <button type="button" class="hud-finale-btn hud-root-btn" id="hudFinaleRootBtn">
              <i class="fa-solid fa-house"></i> <span>Quay về Nền Gốc</span>
            </button>
            <button type="button" class="hud-finale-btn hud-explore-btn" id="hudExploreBtn">
              <i class="fa-solid fa-compass"></i> <span>Tự do khám phá 9 chương</span>
            </button>
          </div>
        `;

        this.livingFrame.appendChild(hud);

        // Bắt sự kiện các nút điều khiển
        const pauseBtn = hud.querySelector('#hudPauseBtn');
        if (pauseBtn) {
          pauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleReflectionPause();
          });
        }

        const rootBtn = hud.querySelector('#hudRootBtn');
        if (rootBtn) {
          rootBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.returnToRootScene();
          });
        }

        const closeBtn = hud.querySelector('#hudCloseBtn');
        if (closeBtn) {
          closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.returnToRootScene();
          });
        }

        const replayBtn = hud.querySelector('#hudReplayBtn');
        if (replayBtn) {
          replayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.startReflectionJourney();
          });
        }

        const finaleRootBtn = hud.querySelector('#hudFinaleRootBtn');
        if (finaleRootBtn) {
          finaleRootBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.returnToRootScene();
          });
        }

        const exploreBtn = hud.querySelector('#hudExploreBtn');
        if (exploreBtn) {
          exploreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.stopReflectionJourney();
            if (this.activeChapterTag) this.activeChapterTag.classList.remove('closed');
          });
        }

        // Bấm vào bất kỳ node I - IX nào trên thanh tiến trình
        const dots = hud.querySelectorAll('.hud-node-dot');
        dots.forEach((dot) => {
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            const step = parseInt(dot.getAttribute('data-step'), 10);
            if (!isNaN(step)) {
              this.reflectionStepIndex = step;
              this.switchChapter(step, true);
              this.triggerSceneReflectionSheen();
              this.updateReflectionHUD(step);
              if (!this.isReflectionPaused) {
                this.scheduleNextReflectionStep();
              }
            }
          });
        });
      }
      this.reflectionHUD = hud;
    }

    showReflectionHUD() {
      if (!this.reflectionHUD) this.initReflectionHUD();
      if (this.reflectionHUD) {
        this.reflectionHUD.classList.remove('hidden');
      }
      // Tạm ẩn thẻ chương cố định & nút thoát góc trên để nhường không gian cho HUD phản chiếu
      if (this.activeChapterTag) {
        this.activeChapterTag.classList.add('closed');
      }
      if (this.exitChapterBtn) {
        this.exitChapterBtn.classList.add('hidden');
      }
      // Ẩn thanh điều hướng ở đáy màn hình để giao diện chỉ hiển thị duy nhất 1 thanh HUD điều khiển
      if (this.navBar) {
        this.navBar.classList.add('hidden');
      }
    }

    hideReflectionHUD() {
      if (this.reflectionHUD) {
        this.reflectionHUD.classList.add('hidden');
      }
      // Khôi phục thanh điều hướng ở đáy màn hình
      if (this.navBar) {
        this.navBar.classList.remove('hidden');
      }
    }

    // --- Khởi động Hành Trình Ánh Hoa Gốc Phản Chiếu Qua 9 Màn Hình ---
    startReflectionJourney() {
      this.stopAutoPlay();
      this.isReflectionJourneyActive = true;
      this.isReflectionPaused = false;
      this.reflectionStepIndex = 0;

      const navFlowerBtn = document.getElementById('storyNavFlowerReflectBtn');
      if (navFlowerBtn) navFlowerBtn.classList.add('active-journey');

      // 1. Chuyển ngay về Chapter 1 (nơi chứa Bông Hoa Gốc)
      this.switchChapter(0, false);

      // 2. Âm thanh bừng nở pha lê & haptic
      playReflectionAwakeningChord();
      if (window.navigator && window.navigator.vibrate) {
        try { window.navigator.vibrate([24, 40, 30]); } catch (_) {}
      }

      // 3. Hiệu ứng sóng phản chiếu bung tỏa từ Bông Hoa Gốc
      const rect = this.livingFrame.getBoundingClientRect();
      const originX = rect.width * 0.5;
      const originY = rect.height * 0.22;
      this.createReflectionShockwave(originX, originY);
      this.triggerSceneReflectionSheen();

      // Rung cành hoa gốc
      const canopy = document.getElementById('engineFloraCanopy') || document.getElementById('engineFloraLayer');
      if (canopy) {
        canopy.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.3, 1)';
        canopy.style.transform = 'scale(1.06) rotate(-1.5deg)';
        setTimeout(() => { canopy.style.transform = ''; }, 500);
      }

      // Tung chùm cánh hoa rực rỡ từ bông hoa gốc
      if (window.petalEngine) {
        window.petalEngine.toss({
          x: rect.left + originX,
          y: rect.top + originY,
          count: 18,
          force: 1.5,
          angle: -Math.PI * 0.5,
          spread: 0.85
        });
      }

      // 4. Mở HUD Phản Chiếu và cập nhật chặng 0
      this.showReflectionHUD();
      this.updateReflectionHUD(0);

      const finaleActions = document.getElementById('hudFinaleActions');
      if (finaleActions) finaleActions.classList.remove('visible');

      const pauseBtn = document.getElementById('hudPauseBtn');
      if (pauseBtn) {
        pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> <span class="pause-text">Tạm dừng</span>';
      }

      // 5. Bắt đầu tự động chuyển tiếp qua từng màn hình
      this.scheduleNextReflectionStep();
    }

    scheduleNextReflectionStep() {
      if (this.reflectionTimer) clearTimeout(this.reflectionTimer);
      if (!this.isReflectionJourneyActive || this.isReflectionPaused) return;

      // Mỗi màn hình dừng 3.2 giây để người dùng thưởng thức trọn vẹn cảnh sắc phản chiếu
      const dwellTime = 3200;

      this.reflectionTimer = setTimeout(() => {
        if (!this.isReflectionJourneyActive || this.isReflectionPaused) return;

        const nextStep = this.reflectionStepIndex + 1;
        if (nextStep < CHAPTERS_DATA.length) {
          this.reflectionStepIndex = nextStep;
          this.switchChapter(nextStep, true);
          this.triggerSceneReflectionSheen();
          this.updateReflectionHUD(nextStep);

          // Cánh hoa rơi hòa theo từng cảnh
          if (window.petalEngine) {
            window.petalEngine.toss({
              x: window.innerWidth * (0.35 + Math.random() * 0.3),
              y: window.innerHeight * 0.22,
              count: 8,
              force: 1.15,
              angle: -Math.PI * 0.5 + (Math.random() - 0.5) * 0.6,
              spread: 0.6
            });
          }

          this.scheduleNextReflectionStep();
        } else {
          // Đến đích: Chapter 9 - Khúc Vĩ Thanh Lãng Mạn
          this.onReflectionJourneyCompleted();
        }
      }, dwellTime);
    }

    toggleReflectionPause() {
      if (this.isReflectionPaused) {
        this.resumeReflectionJourney();
      } else {
        this.pauseReflectionJourney();
      }
    }

    pauseReflectionJourney() {
      this.isReflectionPaused = true;
      if (this.reflectionTimer) {
        clearTimeout(this.reflectionTimer);
        this.reflectionTimer = null;
      }
      const btn = document.getElementById('hudPauseBtn');
      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-play"></i> <span class="pause-text">Tiếp tục</span>';
      }
    }

    resumeReflectionJourney() {
      this.isReflectionPaused = false;
      const btn = document.getElementById('hudPauseBtn');
      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-pause"></i> <span class="pause-text">Tạm dừng</span>';
      }
      this.scheduleNextReflectionStep();
    }

    stopReflectionJourney() {
      this.isReflectionJourneyActive = false;
      this.isReflectionPaused = false;
      if (this.reflectionTimer) {
        clearTimeout(this.reflectionTimer);
        this.reflectionTimer = null;
      }
      this.hideReflectionHUD();
      const navFlowerBtn = document.getElementById('storyNavFlowerReflectBtn');
      if (navFlowerBtn) navFlowerBtn.classList.remove('active-journey');
    }

    updateReflectionHUD(stepIndex) {
      if (!this.reflectionHUD) return;
      const data = CHAPTERS_DATA[stepIndex];
      if (!data) return;

      const badge = document.getElementById('hudChBadge');
      const title = document.getElementById('hudChTitle');
      const narrative = document.getElementById('hudReflectionNarrative');
      const fill = document.getElementById('hudBeamLineFill');

      if (badge) badge.textContent = `${data.number} / 09`;
      if (title) title.textContent = data.title;
      if (narrative) narrative.textContent = data.reflectionNarrative || data.subtitle;

      // Cập nhật thanh tia sáng
      if (fill) {
        const pct = (stepIndex / (CHAPTERS_DATA.length - 1)) * 100;
        fill.style.width = `${pct}%`;
      }

      // Cập nhật các node I đến IX
      const dots = this.reflectionHUD.querySelectorAll('.hud-node-dot');
      dots.forEach((dot, idx) => {
        dot.classList.remove('active', 'passed');
        if (idx === stepIndex) {
          dot.classList.add('active');
        } else if (idx < stepIndex) {
          dot.classList.add('passed');
        }
      });
    }

    onReflectionJourneyCompleted() {
      this.updateReflectionHUD(8);
      const finaleActions = document.getElementById('hudFinaleActions');
      if (finaleActions) finaleActions.classList.add('visible');

      const narrative = document.getElementById('hudReflectionNarrative');
      if (narrative) {
        narrative.innerHTML = '💖 <strong>Đích đến trọn vẹn:</strong> Ánh hoa gốc đã phản chiếu trọn vẹn qua 9 miền ký ức & tình yêu của Cá Sudo ♡ Khây Ti!';
      }

      // Bung chùm cánh hoa trái tim & pháo hoa chúc mừng
      if (window.petalEngine) {
        window.petalEngine.toss({
          x: window.innerWidth * 0.5,
          y: window.innerHeight * 0.35,
          count: 22,
          force: 1.6,
          spread: 1.0
        });
      }
    }

    createReflectionShockwave(x, y) {
      const wave = document.createElement('div');
      wave.className = 'story-reflection-shockwave';
      wave.style.left = `${x}px`;
      wave.style.top = `${y}px`;
      wave.style.width = '120px';
      wave.style.height = '120px';
      this.livingFrame.appendChild(wave);
      setTimeout(() => wave.remove(), 1600);
    }

    triggerSceneReflectionSheen() {
      const old = this.livingFrame.querySelectorAll('.story-scene-reflection-sheen');
      old.forEach(el => el.remove());

      const sheen = document.createElement('div');
      sheen.className = 'story-scene-reflection-sheen';
      this.livingFrame.appendChild(sheen);
      setTimeout(() => sheen.remove(), 1800);
    }

    // ============================================================
    // CÁC HỆ THỐNG ANIMATION ĐỘC BẢN CHO TỪNG CHAPTER
    // ============================================================
    startChapterAnimation(chapterIdx) {
      if (this.activeAnimationCancel) {
        this.activeAnimationCancel();
        this.activeAnimationCancel = null;
      }

      const canvas = this.canvases[chapterIdx];
      if (!canvas) return;

      const rect = this.livingFrame.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      let isRunning = true;
      let startTime = performance.now();

      // Dispatch tới bộ điều phối tương ứng
      switch (chapterIdx) {
        case 0:
          this.runChapter01Animation(ctx, w, h, () => isRunning);
          break;
        case 1:
          this.runChapter02Animation(ctx, w, h, () => isRunning);
          break;
        case 2:
          this.runChapter03Animation(ctx, w, h, () => isRunning);
          break;
        case 3:
          this.runChapter04Animation(ctx, w, h, () => isRunning);
          break;
        case 4:
          this.runChapter05Animation(ctx, w, h, () => isRunning);
          break;
        case 5:
          this.runChapter06Animation(ctx, w, h, () => isRunning);
          break;
        case 6:
          this.runChapter07Animation(ctx, w, h, () => isRunning);
          break;
        case 7:
          this.runChapter08Animation(ctx, w, h, () => isRunning);
          break;
        case 8:
          this.runChapter09Animation(ctx, w, h, () => isRunning);
          break;
      }

      this.activeAnimationCancel = () => {
        isRunning = false;
        ctx.clearRect(0, 0, w, h);
      };
    }

    // --- ANIMATION CH01: Mỹ Phẩm Studio (Specular Glints & Gold Shimmer) ---
    runChapter01Animation(ctx, w, h, isRunning) {
      const glints = [
        { x: w * 0.51, y: h * 0.40, size: 22, period: 3800, phase: 0 },
        { x: w * 0.60, y: h * 0.36, size: 26, period: 4400, phase: 1.2 },
        { x: w * 0.72, y: h * 0.61, size: 20, period: 3200, phase: 2.4 }
      ];

      const loop = (t) => {
        if (!isRunning()) return;
        ctx.clearRect(0, 0, w, h);

        glints.forEach(g => {
          const p = (Math.sin((t / g.period) * Math.PI * 2 + g.phase) + 1) * 0.5;
          const alpha = Math.pow(p, 4) * 0.85;
          if (alpha > 0.05) {
            // Tia chớp 4 cánh vàng champagne
            ctx.save();
            ctx.translate(g.x, g.y);
            ctx.rotate(t * 0.0003);

            const rad = g.size * p;
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
            grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            grad.addColorStop(0.35, `rgba(251, 191, 36, ${alpha * 0.7})`);
            grad.addColorStop(1, 'rgba(251, 191, 36, 0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, rad, 0, Math.PI * 2);
            ctx.fill();

            // Vẽ chữ thập sáng
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(-rad * 1.4, 0); ctx.lineTo(rad * 1.4, 0);
            ctx.moveTo(0, -rad * 1.4); ctx.lineTo(0, rad * 1.4);
            ctx.stroke();

            ctx.restore();
          }
        });

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    // --- ANIMATION CH02: Khung Cảnh Tinh Khôi (Soft Ambient Light - Không có hoa/cánh hoa rơi) ---
    runChapter02Animation(ctx, w, h, isRunning) {
      const loop = (t) => {
        if (!isRunning()) return;
        ctx.clearRect(0, 0, w, h);

        // Vệt sáng sớm mai mềm mại lướt nhẹ qua không gian
        const sweep = (Math.sin(t * 0.0006) + 1) * 0.5;
        const grad = ctx.createRadialGradient(w * 0.5, h * 0.25, 30, w * 0.5, h * 0.25, w * 0.65);
        grad.addColorStop(0, `rgba(255, 248, 235, ${(0.14 + sweep * 0.08).toFixed(3)})`);
        grad.addColorStop(0.5, `rgba(251, 207, 232, ${(0.06 + sweep * 0.04).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    // --- ANIMATION CH03: Nước / Reflection (Interactive Ripples & Caustics - Không có hoa/cánh hoa) ---
    runChapter03Animation(ctx, w, h, isRunning) {
      const ripples = [];
      const waterY = h * 0.38; // Nửa dưới khung cảnh là mặt nước

      // Tự động tạo gợn sóng chu kỳ
      let lastAutoRipple = 0;

      // Thêm gợn sóng khi rê chuột qua mặt nước
      const onMove = (e) => {
        const rect = this.livingFrame.getBoundingClientRect();
        const my = e.clientY - rect.top;
        const mx = e.clientX - rect.left;
        if (my >= waterY && ripples.length < 16) {
          ripples.push({ x: mx, y: my, radius: 2, maxRadius: 75, alpha: 0.65 });
        }
      };
      this.livingFrame.addEventListener('mousemove', onMove);

      const loop = (t) => {
        if (!isRunning()) {
          this.livingFrame.removeEventListener('mousemove', onMove);
          return;
        }
        ctx.clearRect(0, 0, w, h);

        // Sinh gợn sóng tự nhiên
        if (t - lastAutoRipple > 2600) {
          lastAutoRipple = t;
          ripples.push({
            x: w * (0.25 + Math.random() * 0.55),
            y: waterY + Math.random() * (h - waterY - 40),
            radius: 2,
            maxRadius: 85,
            alpha: 0.55
          });
        }

        // Vẽ các vòng tròn gợn sóng nước
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.radius += 0.75;
          r.alpha *= 0.982;

          ctx.save();
          ctx.beginPath();
          // Hình elip nằm ngang mô phỏng góc nhìn nghiêng của mặt nước
          ctx.ellipse(r.x, r.y, r.radius * 1.5, r.radius * 0.45, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(224, 242, 254, ${r.alpha.toFixed(3)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Vệt sáng lấp lánh ở mép gợn sóng
          ctx.beginPath();
          ctx.ellipse(r.x, r.y - 1, r.radius * 1.4, r.radius * 0.4, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${(r.alpha * 0.6).toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.restore();

          if (r.alpha < 0.02 || r.radius > r.maxRadius) {
            ripples.splice(i, 1);
          }
        }

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    // --- ANIMATION CH04: Gương / Luxury Room (Candle Flame & Prismatic Reflection) ---
    runChapter04Animation(ctx, w, h, isRunning) {
      // Tọa độ ngọn nến trên bàn trang điểm
      const candles = [
        { x: w * 0.43, y: h * 0.80 },
        { x: w * 0.47, y: h * 0.78 }
      ];

      const loop = (t) => {
        if (!isRunning()) return;
        ctx.clearRect(0, 0, w, h);

        // 1. Ánh nến lung linh chập chờn
        candles.forEach((c, idx) => {
          const flicker = Math.sin(t * 0.015 + idx * 2.3) * 0.15 + Math.cos(t * 0.03 + idx) * 0.1;
          const rad = 28 + flicker * 8;

          ctx.save();
          const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, rad);
          grad.addColorStop(0, 'rgba(255, 250, 220, 0.9)');
          grad.addColorStop(0.3, 'rgba(251, 191, 36, 0.55)');
          grad.addColorStop(0.7, 'rgba(245, 158, 11, 0.2)');
          grad.addColorStop(1, 'rgba(245, 158, 11, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(c.x, c.y, rad, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // 2. Vệt sáng cầu vồng tán sắc trên mặt gương trung tâm
        const prismSweep = (Math.sin(t * 0.0006) + 1) * 0.5;
        const prismX = w * (0.46 + prismSweep * 0.08);
        const prismY = h * (0.35 + (1 - prismSweep) * 0.06);

        ctx.save();
        ctx.translate(prismX, prismY);
        ctx.rotate(-Math.PI / 4);

        const rainbow = ctx.createLinearGradient(-40, 0, 40, 0);
        rainbow.addColorStop(0, 'rgba(244, 114, 182, 0)');
        rainbow.addColorStop(0.2, 'rgba(244, 114, 182, 0.35)');
        rainbow.addColorStop(0.4, 'rgba(251, 191, 36, 0.4)');
        rainbow.addColorStop(0.6, 'rgba(52, 211, 153, 0.35)');
        rainbow.addColorStop(0.8, 'rgba(96, 165, 250, 0.4)');
        rainbow.addColorStop(1, 'rgba(96, 165, 250, 0)');

        ctx.fillStyle = rainbow;
        ctx.fillRect(-45, -120, 90, 240);
        ctx.restore();

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    // --- ANIMATION CH05: Marble / Crystal (Prismatic Dispersion & 4-Point Stars) ---
    runChapter05Animation(ctx, w, h, isRunning) {
      const crystals = [
        { x: w * 0.69, y: h * 0.30, size: 30, speed: 0.0008, phase: 0 },
        { x: w * 0.81, y: h * 0.70, size: 24, speed: 0.0011, phase: 1.8 },
        { x: w * 0.12, y: h * 0.68, size: 22, speed: 0.0009, phase: 3.1 },
        { x: w * 0.68, y: h * 0.85, size: 26, speed: 0.0012, phase: 4.5 }
      ];

      const loop = (t) => {
        if (!isRunning()) return;
        ctx.clearRect(0, 0, w, h);

        // Vệt quang phổ di chuyển trên mặt bàn đá hoa cương
        const sweep = (Math.sin(t * 0.0005) + 1) * 0.5;
        const sheenX = w * (0.2 + sweep * 0.5);

        ctx.save();
        const sheenGrad = ctx.createLinearGradient(sheenX - 60, 0, sheenX + 60, 0);
        sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.22)');
        sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sheenGrad;
        ctx.fillRect(0, h * 0.65, w, h * 0.35);
        ctx.restore();

        // Ngôi sao 4 cánh lấp lánh trên các tinh thể pha lê
        crystals.forEach(c => {
          const pulse = (Math.sin(t * c.speed * Math.PI * 2 + c.phase) + 1) * 0.5;
          const alpha = Math.pow(pulse, 3) * 0.9;
          if (alpha > 0.08) {
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(t * 0.0004);

            const r = c.size * pulse;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 1.6;

            ctx.beginPath();
            ctx.moveTo(-r * 1.5, 0); ctx.lineTo(r * 1.5, 0);
            ctx.moveTo(0, -r * 1.5); ctx.lineTo(0, r * 1.5);
            ctx.stroke();

            // Vòng hào quang bảy sắc
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
            grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            grad.addColorStop(0.4, `rgba(147, 197, 253, ${alpha * 0.7})`);
            grad.addColorStop(1, 'rgba(244, 114, 182, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }
        });

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    // --- ANIMATION CH06: Satin / Silk / Flowers (Fluid Silk Waves & Sheen Sweep) ---
    runChapter06Animation(ctx, w, h, isRunning) {
      const loop = (t) => {
        if (!isRunning()) return;
        ctx.clearRect(0, 0, w, h);

        // Dải sóng sáng trượt dọc theo thớ vải lụa chéo
        const waveProgress = (Math.sin(t * 0.0008) + 1) * 0.5;
        const waveX = w * (0.15 + waveProgress * 0.6);
        const waveY = h * (0.35 + waveProgress * 0.4);

        ctx.save();
        ctx.translate(waveX, waveY);
        ctx.rotate(Math.PI / 6);

        const sheenGrad = ctx.createLinearGradient(-80, 0, 80, 0);
        sheenGrad.addColorStop(0, 'rgba(255, 220, 235, 0)');
        sheenGrad.addColorStop(0.5, 'rgba(255, 250, 245, 0.28)');
        sheenGrad.addColorStop(1, 'rgba(30, 58, 138, 0)');

        ctx.fillStyle = sheenGrad;
        ctx.fillRect(-120, -200, 240, 400);
        ctx.restore();

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    // --- ANIMATION CH07: Botanical Garden (Volumetric God Rays & Greenhouse Mist) ---
    runChapter07Animation(ctx, w, h, isRunning) {
      const rays = [
        { x: w * 0.60, angle: Math.PI * 0.35, width: 90, alphaBase: 0.18, speed: 0.0006 },
        { x: w * 0.68, angle: Math.PI * 0.33, width: 130, alphaBase: 0.22, speed: 0.0008 },
        { x: w * 0.78, angle: Math.PI * 0.31, width: 100, alphaBase: 0.16, speed: 0.0005 }
      ];

      // Hạt sương mù bay lững lờ trong chùm nắng
      const mistMotes = Array.from({ length: 30 }, () => ({
        x: w * (0.5 + Math.random() * 0.4),
        y: Math.random() * h,
        speedY: -(0.15 + Math.random() * 0.25),
        speedX: 0.1 + Math.random() * 0.2,
        size: 1.2 + Math.random() * 2.2,
        alpha: 0.2 + Math.random() * 0.4
      }));

      const loop = (t) => {
        if (!isRunning()) return;
        ctx.clearRect(0, 0, w, h);

        // Vẽ các luồng nắng Volumetric God Rays
        rays.forEach(r => {
          const pulse = (Math.sin(t * r.speed) + 1) * 0.5;
          const currentAlpha = r.alphaBase * (0.75 + pulse * 0.5);

          ctx.save();
          ctx.translate(r.x, 0);
          ctx.rotate(r.angle);

          const grad = ctx.createLinearGradient(0, 0, h * 1.4, 0);
          grad.addColorStop(0, `rgba(254, 243, 199, ${currentAlpha.toFixed(3)})`);
          grad.addColorStop(0.6, `rgba(255, 237, 213, ${(currentAlpha * 0.5).toFixed(3)})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = grad;
          ctx.fillRect(0, -r.width * 0.5, h * 1.5, r.width);
          ctx.restore();
        });

        // Vẽ các hạt sương nắng lơ lửng trong nhà kính
        mistMotes.forEach(m => {
          m.y += m.speedY;
          m.x += m.speedX;
          if (m.y < -10) { m.y = h + 10; m.x = w * (0.5 + Math.random() * 0.4); }
          if (m.x > w + 10) m.x = w * 0.5;

          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 250, 230, ${m.alpha.toFixed(3)})`;
          ctx.fill();
        });

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    // --- ANIMATION CH08: Dreamy Floral (Zero-Gravity Stardust - Không có bông hoa bay) ---
    runChapter08Animation(ctx, w, h, isRunning) {
      // Bụi sao phát quang sinh học (Bioluminescent Stardust)
      const stardust = Array.from({ length: 42 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        size: 1.5 + Math.random() * 2.5,
        twinkleSpeed: 0.002 + Math.random() * 0.003,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? 'rgba(244, 114, 182,' : 'rgba(96, 165, 250,'
      }));

      const loop = (t) => {
        if (!isRunning()) return;
        ctx.clearRect(0, 0, w, h);

        // Vẽ bụi sao lấp lánh
        stardust.forEach(s => {
          s.x += s.speedX;
          s.y += s.speedY;
          if (s.x < 0) s.x = w;
          if (s.x > w) s.x = 0;
          if (s.y < 0) s.y = h;
          if (s.y > h) s.y = 0;

          const alpha = (Math.sin(t * s.twinkleSpeed + s.phase) + 1) * 0.45 + 0.1;

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `${s.color} ${(alpha * 0.3).toFixed(3)})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
          ctx.fill();
        });

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    // --- ANIMATION CH09: Final Romantic Scene (Sky Lanterns, Fireworks & Subtle Petals - Tém Tém Lại) ---
    runChapter09Animation(ctx, w, h, isRunning) {
      // Đèn lồng bay lên trời đêm
      const lanterns = Array.from({ length: 18 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        speedY: -(0.25 + Math.random() * 0.35),
        swayAmp: 1.5 + Math.random() * 2,
        swaySpeed: 0.0015 + Math.random() * 0.002,
        phase: Math.random() * Math.PI * 2,
        size: 5 + Math.random() * 6
      }));

      // Hạt pháo hoa bụi sao dịu dàng
      const fireworks = [];
      let lastFireworkTime = 0;

      const loop = (t) => {
        if (!isRunning()) return;
        ctx.clearRect(0, 0, w, h);

        // Sinh pháo hoa bụi sao
        if (t - lastFireworkTime > 2400) {
          lastFireworkTime = t;
          const fx = w * (0.65 + Math.random() * 0.28);
          const fy = h * (0.12 + Math.random() * 0.22);
          for (let i = 0; i < 28; i++) {
            const angle = (i / 28) * Math.PI * 2;
            const spd = 0.8 + Math.random() * 1.6;
            fireworks.push({
              x: fx,
              y: fy,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              alpha: 1,
              decay: 0.016 + Math.random() * 0.012,
              color: Math.random() > 0.5 ? 'rgba(251, 191, 36,' : 'rgba(255, 214, 229,'
            });
          }
        }

        // Vẽ và cập nhật pháo hoa
        for (let i = fireworks.length - 1; i >= 0; i--) {
          const fw = fireworks[i];
          fw.x += fw.vx;
          fw.y += fw.vy;
          fw.vy += 0.015; // Trọng lực nhẹ
          fw.alpha -= fw.decay;

          if (fw.alpha <= 0) {
            fireworks.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `${fw.color} ${fw.alpha.toFixed(3)})`;
          ctx.fill();
        }

        // Vẽ đèn lồng bay lên bầu trời
        lanterns.forEach(l => {
          l.y += l.speedY;
          const sway = Math.sin(t * l.swaySpeed + l.phase) * l.swayAmp;
          const lx = l.x + sway;

          if (l.y < -20) {
            l.y = h + 20;
            l.x = Math.random() * w;
          }

          ctx.save();
          ctx.translate(lx, l.y);

          // Ánh sáng ấm từ tim đèn
          const lanternGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, l.size * 2);
          lanternGrad.addColorStop(0, 'rgba(255, 245, 200, 0.95)');
          lanternGrad.addColorStop(0.4, 'rgba(251, 191, 36, 0.65)');
          lanternGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');

          ctx.fillStyle = lanternGrad;
          ctx.beginPath();
          ctx.arc(0, 0, l.size * 2, 0, Math.PI * 2);
          ctx.fill();

          // Thân đèn lồng
          ctx.fillStyle = 'rgba(255, 237, 213, 0.9)';
          ctx.beginPath();
          ctx.roundRect(-l.size * 0.5, -l.size * 0.7, l.size, l.size * 1.4, 3);
          ctx.fill();

          ctx.restore();
        });

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  // Khởi tạo và gắn toàn cục
  window.StoryTransitionEngine = StoryTransitionEngine;

  document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo sau một nhịp ngắn để bảo đảm các phần tử layout sẵn sàng
    setTimeout(() => {
      window.storyEngineInstance = new StoryTransitionEngine();
    }, 150);
  });

})(window, document);
