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
      image: 'assets/images/chapters/chapter_01.jpg',
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
      subtitle: 'Cổng Hoa Vĩnh Cửu & Đèn Lồng Nguyện Ước',
      desc: 'Khoảnh khắc trọn vẹn của tình yêu đôi lứa: Cổng vòm hoa đậu biếc rực rỡ, hàng ngàn ngọn nến lung linh bên bờ biển hoàng hôn, đèn lồng bay lên trời sao và pháo hoa rực sáng mừng Cá Sudo & Khây Ti.',
      image: 'assets/images/chapters/chapter_09.jpg',
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

  // ============================================================
  // CLASS STORY TRANSITION ENGINE
  // ============================================================
  class StoryTransitionEngine {
    constructor() {
      this.currentChapterIndex = 0; // 0-based: 0 -> Chapter 1, ..., 8 -> Chapter 9
      this.isTransitioning = false;
      this.autoPlayInterval = null;
      this.autoPlayDuration = 9000; // 9 giây mỗi chương khi tự động chiếu
      this.isAutoPlaying = false;
      this.activeAnimationCancel = null;

      this.livingFrame = document.getElementById('livingFrame');
      if (!this.livingFrame) {
        console.warn('StoryTransitionEngine: #livingFrame not found.');
        return;
      }

      this.initDOMElements();
      this.initScenes();
      this.initNavbar();
      this.initActiveChapterTag();
      this.bindEvents();

      // Bật Chapter 1 làm mặc định
      this.switchChapter(0, false);
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
        imgEl.loading = index === 0 ? 'eager' : 'lazy';

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
        if (data.id === 2) {
          const vines = document.createElement('div');
          vines.className = 'scene-ch2-vines';
          envEl.appendChild(vines);
        } else if (data.id === 3) {
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
            // Nếu thẻ đang đóng, cho phép mở lại khi người dùng bấm vào chương
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

        navBar.appendChild(prevBtn);
        navBar.appendChild(dotsList);
        navBar.appendChild(nextBtn);
        navBar.appendChild(autoPlayBtn);

        this.livingFrame.appendChild(navBar);
      }
      this.navBar = navBar;
    }

    // --- Khởi tạo Thẻ Thông Tin Chương Đang Chiếu ---
    initActiveChapterTag() {
      let tag = document.getElementById('storyActiveChapterTag');
      if (!tag) {
        tag = document.createElement('div');
        tag.id = 'storyActiveChapterTag';
        tag.className = 'story-active-chapter-tag';
        tag.setAttribute('aria-live', 'polite');

        tag.innerHTML = `
          <div class="tag-header">
            <span class="tag-badge" id="storyTagBadge">
              <span class="ch-text">CHƯƠNG 01</span>
              <span class="roman">I</span>
            </span>
            <button type="button" class="tag-close-btn" id="storyTagCloseBtn" title="Đóng thẻ chương" aria-label="Đóng">
              <i class="fa-solid fa-xmark"></i> <span class="btn-text">Đóng</span>
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
            tag.classList.add('closed');
          });
        }
      }
      this.activeChapterTag = tag;
    }

    // --- Cập nhật nội dung Thẻ Thông Tin Chương ---
    updateActiveChapterTag(chapter) {
      if (!this.activeChapterTag) return;
      if (this.activeChapterTag.classList.contains('closed')) return;

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

      // Hiệu ứng fade in nhẹ khi đổi thông tin
      this.activeChapterTag.style.animation = 'none';
      void this.activeChapterTag.offsetWidth;
      this.activeChapterTag.style.animation = 'tagEntrance 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    }

    // --- Chuyển Đổi Sang Chương Mục Tiêu ---
    switchChapter(targetIndex, playSound = true) {
      if (targetIndex < 0 || targetIndex >= CHAPTERS_DATA.length) return;
      if (this.isTransitioning && targetIndex === this.currentChapterIndex) return;

      this.isTransitioning = true;
      const prevIndex = this.currentChapterIndex;
      this.currentChapterIndex = targetIndex;
      const currentData = CHAPTERS_DATA[targetIndex];

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
      this.updateActiveChapterTag(currentData);

      // 6. Điều phối các phần tử tương tác của Chapter 1 (Hotspots & Silk Layer)
      const hotspots = document.getElementById('bottleHotspotsContainer');
      const touchHint = document.getElementById('flowerTouchHint');
      const originalPhoto = this.livingFrame.querySelector('.main-uncut-image.living-photo');

      if (targetIndex === 0) {
        // Trở về Chapter 1: Hiện lại các Hotspot mỹ phẩm
        if (hotspots) {
          hotspots.style.opacity = '1';
          hotspots.style.pointerEvents = 'auto';
        }
        if (touchHint) touchHint.style.display = '';
        if (originalPhoto) originalPhoto.style.opacity = '0.01'; // Để Scene 1 làm nền chính
      } else {
        // Các Chapter 2 - 9: Tạm ẩn Hotspots mỹ phẩm để chiêm ngưỡng trọn vẹn bối cảnh
        if (hotspots) {
          hotspots.style.opacity = '0';
          hotspots.style.pointerEvents = 'none';
        }
        if (touchHint) touchHint.style.display = 'none';
        if (originalPhoto) originalPhoto.style.opacity = '0.01';
      }

      // 7. Khởi động Animation riêng biệt của Chapter được kích hoạt
      this.startChapterAnimation(targetIndex);

      setTimeout(() => {
        this.isTransitioning = false;
      }, 1000);
    }

    prevChapter() {
      const target = (this.currentChapterIndex - 1 + CHAPTERS_DATA.length) % CHAPTERS_DATA.length;
      this.switchChapter(target);
    }

    nextChapter() {
      const target = (this.currentChapterIndex + 1) % CHAPTERS_DATA.length;
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
      // Phím mũi tên Trái / Phải để chuyển chương
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowLeft') {
          this.prevChapter();
        } else if (e.key === 'ArrowRight') {
          this.nextChapter();
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

    // --- ANIMATION CH02: Hoa Rủ / Botanical (Pendulum Sway & Spiral Petals) ---
    runChapter02Animation(ctx, w, h, isRunning) {
      // Các cụm hoa rủ đung đưa theo con lắc vật lý
      const vines = [
        { x: w * 0.32, y: h * 0.15, len: h * 0.38, amp: 0.045, speed: 0.0011, phase: 0.2 },
        { x: w * 0.48, y: h * 0.12, len: h * 0.52, amp: 0.065, speed: 0.0009, phase: 1.5 },
        { x: w * 0.62, y: h * 0.16, len: h * 0.42, amp: 0.052, speed: 0.0013, phase: 2.8 },
        { x: w * 0.76, y: h * 0.20, len: h * 0.35, amp: 0.040, speed: 0.0010, phase: 3.9 }
      ];

      // Cánh hoa rơi xoắn ốc chậm
      const fallingPetals = Array.from({ length: 14 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        speedY: 0.35 + Math.random() * 0.45,
        spiralAmp: 1.2 + Math.random() * 1.8,
        spiralSpeed: 0.002 + Math.random() * 0.003,
        size: 7 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        isBlue: Math.random() > 0.4
      }));

      const loop = (t) => {
        if (!isRunning()) return;
        ctx.clearRect(0, 0, w, h);

        // Vẽ hiệu ứng đung đưa của các chùm hoa buông rủ
        vines.forEach(v => {
          const angle = Math.sin(t * v.speed + v.phase) * v.amp;
          ctx.save();
          ctx.translate(v.x, v.y);
          ctx.rotate(angle);

          // Tia sáng mềm mại dọc thân cành
          const grad = ctx.createLinearGradient(0, 0, 0, v.len);
          grad.addColorStop(0, 'rgba(255, 245, 230, 0.2)');
          grad.addColorStop(0.5, 'rgba(59, 130, 246, 0.12)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(0, v.len * 0.5, 6, v.len * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        // Vẽ cánh hoa xoắn ốc rơi
        fallingPetals.forEach(p => {
          p.y += p.speedY;
          p.x += Math.sin(t * p.spiralSpeed + p.y * 0.01) * p.spiralAmp;
          p.rot += 0.015;

          if (p.y > h + 20) {
            p.y = -20;
            p.x = Math.random() * w;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);

          ctx.fillStyle = p.isBlue ? 'rgba(37, 99, 235, 0.65)' : 'rgba(244, 114, 182, 0.65)';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    // --- ANIMATION CH03: Nước / Reflection (Interactive Ripples & Caustics) ---
    runChapter03Animation(ctx, w, h, isRunning) {
      const ripples = [];
      const waterY = h * 0.38; // Nửa dưới khung cảnh là mặt nước

      // Tự động tạo gợn sóng chu kỳ
      let lastAutoRipple = 0;

      // Cánh hoa nổi dập dềnh trên mặt nước
      const floatingPetals = Array.from({ length: 12 }, () => ({
        x: w * (0.2 + Math.random() * 0.65),
        y: waterY + Math.random() * (h - waterY - 30),
        baseY: 0,
        bobSpeed: 0.0016 + Math.random() * 0.0012,
        bobAmp: 3.5 + Math.random() * 2.5,
        size: 8 + Math.random() * 7,
        rot: Math.random() * Math.PI * 2,
        color: Math.random() > 0.45 ? 'rgba(30, 58, 138, 0.72)' : 'rgba(251, 207, 232, 0.8)'
      }));

      floatingPetals.forEach(p => p.baseY = p.y);

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

        // Vẽ các cánh hoa bập bềnh theo nhịp sóng nước
        floatingPetals.forEach(p => {
          const bob = Math.sin(t * p.bobSpeed + p.x * 0.02) * p.bobAmp;
          const currY = p.baseY + bob;

          ctx.save();
          ctx.translate(p.x, currY);
          ctx.rotate(p.rot + bob * 0.02);

          // Bóng mờ cánh hoa dưới đáy nước
          ctx.fillStyle = 'rgba(15, 23, 42, 0.14)';
          ctx.beginPath();
          ctx.ellipse(0, 4, p.size * 0.9, p.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();

          // Cánh hoa chính
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.52, 0, 0, Math.PI * 2);
          ctx.fill();

          // Điểm sáng đọng nước
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(p.size * 0.25, -p.size * 0.1, 1.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

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

        // Một số cánh hoa khẽ bay lướt trên bề mặt lụa
        const floatY = Math.sin(t * 0.0015) * 4;
        ctx.save();
        ctx.translate(w * 0.45, h * 0.62 + floatY);
        ctx.fillStyle = 'rgba(37, 99, 235, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 8, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
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

    // --- ANIMATION CH08: Dreamy Floral (Zero-Gravity Levitation & Stardust) ---
    runChapter08Animation(ctx, w, h, isRunning) {
      // Các bông hoa bồng bềnh không trọng lực
      const floatingBlossoms = Array.from({ length: 16 }, () => ({
        x: w * (0.15 + Math.random() * 0.7),
        y: h * (0.2 + Math.random() * 0.6),
        baseY: 0,
        bobSpeed: 0.0012 + Math.random() * 0.0016,
        bobAmp: 8 + Math.random() * 12,
        rotSpeed: 0.0006 + Math.random() * 0.001,
        rot: Math.random() * Math.PI * 2,
        size: 10 + Math.random() * 14,
        isBlue: Math.random() > 0.45
      }));
      floatingBlossoms.forEach(b => b.baseY = b.y);

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

        // Vẽ hoa trôi nổi không trọng lực
        floatingBlossoms.forEach(b => {
          const currY = b.baseY + Math.sin(t * b.bobSpeed + b.x) * b.bobAmp;
          const currRot = b.rot + t * b.rotSpeed;

          ctx.save();
          ctx.translate(b.x, currY);
          ctx.rotate(currRot);

          // Hào quang quanh bông hoa thần tiên
          const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, b.size * 1.8);
          halo.addColorStop(0, b.isBlue ? 'rgba(59, 130, 246, 0.4)' : 'rgba(244, 114, 182, 0.4)');
          halo.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(0, 0, b.size * 1.8, 0, Math.PI * 2);
          ctx.fill();

          // Cánh hoa
          ctx.fillStyle = b.isBlue ? 'rgba(30, 58, 138, 0.85)' : 'rgba(251, 207, 232, 0.9)';
          ctx.beginPath();
          ctx.ellipse(0, 0, b.size, b.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    // --- ANIMATION CH09: Final Romantic Scene (Sky Lanterns & Fireworks & Heart Petals) ---
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
