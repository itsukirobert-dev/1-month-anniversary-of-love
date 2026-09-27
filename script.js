document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // 1. NHẠC NỀN LÃNG MẠN (AUDIO PLAYER TOGGLE)
  // ============================================================
  const bgMusic = document.getElementById('bgMusic');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicLabel = document.getElementById('musicLabel');
  const musicIcon = document.getElementById('musicIcon');

  if (musicToggleBtn && bgMusic) {
    let isPlaying = false;

    musicToggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        bgMusic.pause();
        if (musicLabel) musicLabel.textContent = 'Bật Nhạc';
        if (musicIcon) musicIcon.innerHTML = '<i class="fa-solid fa-music"></i>';
        isPlaying = false;
      } else {
        bgMusic.play().then(() => {
          if (musicLabel) musicLabel.textContent = 'Tắt Nhạc';
          if (musicIcon) musicIcon.innerHTML = '<i class="fa-solid fa-pause"></i>';
          isPlaying = true;
        }).catch(err => {
          console.warn('Playback error (user interaction needed):', err);
        });
      }
    });
  }

  // ============================================================
  // 2. MENU MOBILE & HEADER EFFECT
  // ============================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
      });
    });
  }

  // ============================================================
  // 3. FOOTER MILESTONES DRAWER TOGGLE (MỞ/ĐÓNG CỘT MỐC)
  // ============================================================
  const footerInfoBtn = document.getElementById('footerInfoBtn');
  const footerMilestonesDrawer = document.getElementById('footerMilestonesDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  if (footerInfoBtn && footerMilestonesDrawer) {
    footerInfoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      footerMilestonesDrawer.classList.toggle('active');
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        footerMilestonesDrawer.classList.remove('active');
      });
    }

    document.addEventListener('click', (e) => {
      if (!footerMilestonesDrawer.contains(e.target) && e.target !== footerInfoBtn) {
        footerMilestonesDrawer.classList.remove('active');
      }
    });
  }

  // ============================================================
  // 4. HỆ THỐNG HẠT BỤI NẮNG LƠ LỬNG TRONG CĂN PHÒNG (SUNLIGHT DUST MOTES)
  // ============================================================
  const canvas = document.getElementById('dustCanvas');
  const livingFrame = document.getElementById('livingFrame') || (canvas ? canvas.parentElement : null);

  if (canvas && livingFrame) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    const particleCount = 48;

    function resizeCanvas() {
      const rect = livingFrame.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particles.length === 0) {
        initParticles();
      }
    }

    function initParticles() {
      particles = [];
      const colors = [
        { r: 255, g: 248, b: 220 }, // Nắng vàng champagne
        { r: 255, g: 238, b: 195 }, // Hổ phách dịu
        { r: 255, g: 225, b: 235 }, // Phớt hồng lụa
        { r: 240, g: 250, b: 255 }  // Ánh sáng pha lê
      ];

      for (let i = 0; i < particleCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0.8 + Math.random() * 1.8,
          baseAlpha: 0.2 + Math.random() * 0.55,
          speedY: -(0.14 + Math.random() * 0.32),
          swayAmp: 0.3 + Math.random() * 0.6,
          swaySpeed: 0.008 + Math.random() * 0.015,
          swayPhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.012 + Math.random() * 0.025,
          twinklePhase: Math.random() * Math.PI * 2,
          color: color
        });
      }
    }

    function renderDust() {
      if (width > 0 && height > 0) {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          p.y += p.speedY;
          p.swayPhase += p.swaySpeed;
          p.x += Math.sin(p.swayPhase) * p.swayAmp;
          p.twinklePhase += p.twinkleSpeed;

          const currentAlpha = p.baseAlpha * (0.65 + 0.35 * Math.sin(p.twinklePhase));

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.8);
          glowGrad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha.toFixed(3)})`);
          glowGrad.addColorStop(0.4, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${(currentAlpha * 0.45).toFixed(3)})`);
          glowGrad.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${(currentAlpha * 0.9).toFixed(3)})`;
          ctx.fill();
        }
      }

      requestAnimationFrame(renderDust);
    }

    const livingImg = livingFrame.querySelector('img');
    if (livingImg) {
      if (livingImg.complete) {
        resizeCanvas();
      } else {
        livingImg.addEventListener('load', resizeCanvas);
      }
    } else {
      resizeCanvas();
    }

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => resizeCanvas());
      ro.observe(livingFrame);
    }
    window.addEventListener('resize', resizeCanvas);
    requestAnimationFrame(renderDust);

    // ============================================================
    // 5. TƯƠNG TÁC QUANG HỌC KHI RÊ CHUỘT QUA BỨC ẢNH
    // ============================================================
    const bottleSheen = livingFrame.querySelector('.bottle-sheen-layer');
    const sunlightCaustic = livingFrame.querySelector('.sunlight-caustic-layer');

    livingFrame.addEventListener('mousemove', (e) => {
      const rect = livingFrame.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      if (bottleSheen) {
        bottleSheen.style.transform = `translate(${nx * 8}px, ${ny * 5}px)`;
      }
      if (sunlightCaustic) {
        sunlightCaustic.style.transform = `translate(${nx * -10}px, ${ny * -8}px)`;
      }

      // Nhận diện hover qua chai lọ mỹ phẩm
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      if (typeof getBottleAtRel === 'function') {
        const hoveredBottle = getBottleAtRel(relX, relY);
        if (hoveredBottle) {
          livingFrame.setAttribute('data-hover-bottle', 'true');
          livingFrame.title = `Chạm để cảm nhận mùi hương ${hoveredBottle.name}`;
        } else {
          livingFrame.removeAttribute('data-hover-bottle');
          livingFrame.title = 'Chạm vào hoa hoặc chai mỹ phẩm';
        }
      }
    });

    livingFrame.addEventListener('mouseleave', () => {
      if (bottleSheen) bottleSheen.style.transform = '';
      if (sunlightCaustic) sunlightCaustic.style.transform = '';
      livingFrame.removeAttribute('data-hover-bottle');
    });
  }

  // ============================================================
  // 6. CÀNH HOA ĐẬU BIẾC TÁCH KHỎI BỐ CỤC & RƠI UỐN LƯỢN (FALLING BRANCH)
  // - Click vào hoa hoặc ảnh: cành hoa thật tách ra khỏi bố cục
  // - Chuyển động khí động học giống cành cây bị gió cuốn:
  //   + Xoay nhẹ & uốn cong theo đường bay (stem flex)
  //   + Lúc nghiêng trái, lúc nghiêng phải (3D tilt & pendulum sway)
  //   + Có quán tính vật lý (inertia, drag, velocity)
  //   + Cuối đường bay chậm lại do sức cản không khí
  //   + Vài cánh hoa nhỏ tách khỏi cành giữa đường bay
  //   + Cành mờ dần và biến mất êm đềm
  // ============================================================
  const branchLayer = document.getElementById('flowerBranchLayer') || document.body;
  const livingFrameEl = document.getElementById('livingFrame');
  const livingPhotoEl = document.querySelector('.main-uncut-image');
  const mainContentEl = document.getElementById('mainContent') || document.querySelector('.site-main');
  const touchHintEl = document.getElementById('flowerTouchHint');

  let branchIdSeq = 0;
  const activeBranches = [];
  const activeSparkles = [];
  let isHintDismissed = false;
  let hintInterval = null;

  function dismissTouchHint() {
    if (!isHintDismissed && touchHintEl) {
      isHintDismissed = true;
      if (hintInterval) clearInterval(hintInterval);
      touchHintEl.classList.add('fade-out');
      setTimeout(() => {
        if (touchHintEl.parentElement) touchHintEl.remove();
      }, 600);
    }
  }

  // Chu kỳ gợi ý luân phiên: Hoa & Chai mỹ phẩm
  const hintMessages = [
    { icon: '🌿', text: 'Chạm vào hoa để đón cành rơi...' },
    { icon: '🧴', text: 'Chạm chai mỹ phẩm để ngát hương thơm...' }
  ];
  let hintIdx = 0;

  if (touchHintEl) {
    const iconEl = touchHintEl.querySelector('.hint-icon');
    const textEl = touchHintEl.querySelector('.hint-text');

    hintInterval = setInterval(() => {
      if (isHintDismissed) {
        clearInterval(hintInterval);
        return;
      }
      hintIdx = (hintIdx + 1) % hintMessages.length;
      if (iconEl && textEl) {
        textEl.style.opacity = '0';
        iconEl.style.opacity = '0';
        setTimeout(() => {
          iconEl.textContent = hintMessages[hintIdx].icon;
          textEl.textContent = hintMessages[hintIdx].text;
          textEl.style.opacity = '1';
          iconEl.style.opacity = '1';
        }, 300);
      }
    }, 4200);
  }

  // --- Danh mục hình ảnh cành hoa thật (cành + lá + hoa là một khối thực tế) ---
  const branchConfigs = [
    {
      id: 'branch-1',
      src: 'assets/images/falling_branches/branch_1.png',
      width: 215,
      height: 146
    },
    {
      id: 'branch-2',
      src: 'assets/images/falling_branches/branch_2.png',
      width: 155,
      height: 205
    },
    {
      id: 'branch-3',
      src: 'assets/images/falling_branches/branch_3.png',
      width: 170,
      height: 158
    }
  ];

  // Tải trước toàn bộ ảnh cành hoa vào bộ nhớ đệm
  branchConfigs.forEach(b => {
    const preImg = new Image();
    preImg.src = b.src;
  });

  // --- SVG Đốm sáng nắng lấp lánh (Sparkle) tại điểm tách cành ---
  const sparkleSvg = `
    <svg viewBox="0 0 30 30" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path d="M 15 0 Q 15 15 30 15 Q 15 15 15 30 Q 15 15 0 15 Q 15 15 15 0 Z" fill="#fff9db"/>
      <circle cx="15" cy="15" r="3.5" fill="#ffffff"/>
    </svg>
  `;

  function createSparkle(x, y) {
    const el = document.createElement('div');
    el.className = 'branch-sparkle';
    el.innerHTML = sparkleSvg;
    branchLayer.appendChild(el);

    activeSparkles.push({
      el,
      x: x - 8,
      y: y - 8,
      life: 0,
      maxLife: 32 + Math.random() * 20,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      rot: Math.random() * 360
    });
  }

  // Âm thanh gió thoảng lướt nhẹ khi cành hoa tách ra bay (Web Audio API)
  function playBranchFlightSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.65);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(290, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch (_) { }
  }

  // ============================================================
  // CÁC QUỸ ĐẠO BAY NGHỆ THUẬT CỦA CÀNH HOA (BRANCH TRAJECTORIES)
  // Mỗi quỹ đạo là một cấu trúc toán học Catmull-Rom Spline mượt mà.
  // Cành + Lá + Hoa là MỘT OBJECT DUY NHẤT (không tách rời thành particles).
  // ============================================================
  const branchTrajectories = [
    {
      id: 0,
      name: 'Cành 01: Vút lên rồi hạ cánh êm đềm',
      symbol: '↗ ↗ ↘ ↘',
      durationFrames: 280,
      // Quỹ đạo Cành 01:
      //   ↗
      //     ↗
      //       ↘
      //         ↘
      points: [
        { x: -50, y: 50 },    // P0: điểm dẫn tiếp tuyến ban đầu
        { x: 0, y: 0 },       // P1: Bắt đầu tại điểm click
        { x: 120, y: -110 },  // P2: [↗] Vút nhanh lên cao sang phải
        { x: 230, y: -145 },  // P3: [↗] Đỉnh cua vút lên
        { x: 350, y: -45 },   // P4: [↘] Chuyển hướng dốc xuống sang phải
        { x: 470, y: 105 },   // P5: [↘] Lướt là đà hạ cánh sang phải
        { x: 560, y: 220 }    // P6: điểm dẫn tiếp tuyến kết thúc
      ]
    },
    {
      id: 1,
      name: 'Cành 02: Rơi nhẹ rồi lộng gió bốc cao',
      symbol: '↓ ↘ ↗ ↗',
      durationFrames: 290,
      // Quỹ đạo Cành 02:
      //   ↓
      //    ↘
      //      ↗
      //        ↗
      points: [
        { x: -5, y: -60 },    // P0
        { x: 0, y: 0 },       // P1: Bắt đầu tại điểm click
        { x: 15, y: 95 },     // P2: [↓] Rơi thẳng xuống nhẹ nhàng
        { x: 110, y: 175 },   // P3: [↘] Chao võng chéo xuống sang phải
        { x: 245, y: 45 },    // P4: [↗] Gió cuộn hất tung bốc ngược lên
        { x: 385, y: -125 },  // P5: [↗] Vút thẳng bay cao lên trời
        { x: 470, y: -220 }   // P6
      ]
    },
    {
      id: 2,
      name: 'Cành 03: Sóng lượn dập dềnh & trôi lững lờ',
      symbol: '→ ↘ ↘ ↗ →',
      durationFrames: 310,
      // Quỹ đạo Cành 03:
      //   →
      //    ↘
      //      ↘
      //        ↗
      //          →
      points: [
        { x: -50, y: 0 },     // P0
        { x: 0, y: 0 },       // P1: Bắt đầu tại điểm click
        { x: 95, y: 8 },      // P2: [→] Trôi ngang ban đầu
        { x: 190, y: 85 },    // P3: [↘] Lượn dốc xuống dưới
        { x: 285, y: 155 },   // P4: [↘] Đáy trũng võng sóng
        { x: 390, y: 70 },    // P5: [↗] Uốn cong ngóc đầu bay lên
        { x: 495, y: 65 },    // P6: [→] San phẳng trôi ngang lững lờ
        { x: 580, y: 65 }     // P7
      ]
    },
    {
      id: 3,
      name: 'Cành 04: Vòng xoáy lốc cuộn 3D',
      symbol: '↙ ↘ ↗ ↖',
      durationFrames: 320,
      // Quỹ đạo Cành 04:
      //   ↙
      //     ↘
      //       ↗
      //         ↖
      points: [
        { x: 45, y: -45 },    // P0
        { x: 0, y: 0 },       // P1: Bắt đầu tại điểm click
        { x: -90, y: 105 },   // P2: [↙] Chao chếch xuống sang trái
        { x: 45, y: 175 },    // P3: [↘] Cua vòng đáy lượn sang phải
        { x: 185, y: -25 },   // P4: [↗] Cuộn vút lên cao sang phải
        { x: 65, y: -135 },   // P5: [↖] Vòng cua ngược đầu về trái lên cao
        { x: -25, y: -170 }   // P6
      ]
    }
  ];

  // Tính toán vị trí và đạo hàm vận tốc trên đường cong Catmull-Rom Spline
  function sampleCatmullRomSpline(points, u) {
    const numSegments = points.length - 3;
    const clampedU = Math.max(0, Math.min(1, u));
    const scaledT = clampedU * numSegments;
    const segIdx = Math.min(Math.floor(scaledT), numSegments - 1);
    const localT = scaledT - segIdx;

    const p0 = points[segIdx];
    const p1 = points[segIdx + 1];
    const p2 = points[segIdx + 2];
    const p3 = points[segIdx + 3];

    const t = localT;
    const t2 = t * t;
    const t3 = t2 * t;

    const x = 0.5 * (
      (2 * p1.x) +
      (-p0.x + p2.x) * t +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
    );

    const y = 0.5 * (
      (2 * p1.y) +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
    );

    const dx = 0.5 * (
      (-p0.x + p2.x) +
      2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t +
      3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t2
    ) * numSegments;

    const dy = 0.5 * (
      (-p0.y + p2.y) +
      2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t +
      3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t2
    ) * numSegments;

    return { x, y, dx, dy };
  }

  // Lựa chọn ngẫu nhiên một quỹ đạo (không lặp lại quỹ đạo vừa bay)
  let lastTrajectoryIdx = -1;
  function pickRandomTrajectory() {
    const choices = [0, 1, 2, 3].filter(idx => idx !== lastTrajectoryIdx);
    const selected = choices[Math.floor(Math.random() * choices.length)];
    lastTrajectoryIdx = selected;
    return branchTrajectories[selected];
  }

  // --- Khởi tạo cành hoa thật nguyên vẹn (Cành + Lá + Hoa là một Object duy nhất) ---
  function launchFlowerBranch(originX, originY, targetDirX = 0, forcedTrajectoryIdx = null) {
    dismissTouchHint();
    playBranchFlightSound();

    // Giới hạn số lượng cành đang bay cùng lúc để luôn mượt mà 60fps
    if (activeBranches.length >= 5) {
      activeBranches[0].maxLife = activeBranches[0].life + 20;
    }

    // 1. Chọn cấu hình cành hoa thật (chứa đầy đủ cành, lá, hoa kết liền với nhau)
    const bIdx = Math.floor(Math.random() * branchConfigs.length);
    const bCfg = branchConfigs[bIdx];
    const isMobile = window.innerWidth < 768;
    const bWidth = Math.round(bCfg.width * (isMobile ? 0.72 : 1));
    const bHeight = Math.round(bCfg.height * (isMobile ? 0.72 : 1));

    // 2. Chọn ngẫu nhiên quỹ đạo khí động học (không trùng lần click trước)
    let trajectory = null;
    if (typeof forcedTrajectoryIdx === 'number' && branchTrajectories[forcedTrajectoryIdx]) {
      trajectory = branchTrajectories[forcedTrajectoryIdx];
      lastTrajectoryIdx = forcedTrajectoryIdx;
    } else {
      trajectory = pickRandomTrajectory();
    }

    // 3. Xác định hướng bay ngang (dir: +1 bay phải, -1 đối xứng bay trái)
    let dir = 1;
    if (targetDirX !== 0) {
      dir = targetDirX < 0 ? -1 : 1;
    } else if (originX > window.innerWidth * 0.58) {
      dir = -1; // Click bên phải -> bay hướng vào giữa/trái
    } else if (originX < window.innerWidth * 0.42) {
      dir = 1;  // Click bên trái -> bay hướng vào giữa/phải
    } else {
      dir = Math.random() < 0.5 ? -1 : 1;
    }

    // 4. Tạo element DOM: Cành + Lá + Hoa là MỘT OBJECT DUY NHẤT
    const branchEl = document.createElement('div');
    branchEl.className = 'falling-branch';
    branchEl.style.width = bWidth + 'px';
    branchEl.style.height = bHeight + 'px';
    branchEl.setAttribute('data-trajectory', trajectory.id);

    const innerEl = document.createElement('div');
    innerEl.className = 'branch-inner';

    const imgEl = document.createElement('img');
    imgEl.src = bCfg.src;
    imgEl.alt = 'Cành hoa đậu biếc bay nghệ thuật';
    imgEl.className = 'branch-img';
    innerEl.appendChild(imgEl);
    branchEl.appendChild(innerEl);

    branchLayer.appendChild(branchEl);

    // Hạt nắng lóe sáng tại điểm cành hoa tách ra
    for (let s = 0; s < 3; s++) {
      createSparkle(originX + (Math.random() - 0.5) * 20, originY + (Math.random() - 0.5) * 20);
    }

    // Tỉ lệ khoảng cách co giãn theo thiết bị (responsive distance scale)
    const baseDistScale = isMobile ? (0.68 + Math.random() * 0.08) : (0.96 + Math.random() * 0.12);

    const branch = {
      el: branchEl,
      innerEl: innerEl,
      trajectory: trajectory,
      width: bWidth,
      height: bHeight,
      originX: originX,
      originY: originY,
      dir: dir,
      scaleFactor: baseDistScale,
      life: 0,
      maxLife: Math.round(trajectory.durationFrames * (0.92 + Math.random() * 0.16)),
      baseScale: (0.90 + Math.random() * 0.16) * (isMobile ? 0.85 : 1),
      baseRot: (Math.random() - 0.5) * 16,
      currentTiltZ: 0,
      currentSkew: 0,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.035 + Math.random() * 0.015,
      swayAmp: 0.9 + Math.random() * 0.7
    };

    activeBranches.push(branch);
  }

  // --- Bộ lắng nghe tương tác click / chạm ---
  function handleSceneInteraction(e) {
    // 0. Bỏ qua nếu click vào bên trong modal hoặc nút hotspot (hotspot đã có listener riêng)
    if (e.target.closest('#productWorldModal') || e.target.closest('.bottle-hotspot')) {
      return;
    }

    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    if (clientX === undefined || clientY === undefined) return;

    // Xác định vị trí tương quan với bức ảnh
    const targetImg = livingPhotoEl || (livingFrameEl ? livingFrameEl.querySelector('img') : null);
    if (!targetImg) return;

    const rect = targetImg.getBoundingClientRect();
    const isInsideImg = (
      clientX >= rect.left && clientX <= rect.right &&
      clientY >= rect.top && clientY <= rect.bottom
    );

    if (isInsideImg) {
      const relX = (clientX - rect.left) / rect.width;
      const relY = (clientY - rect.top) / rect.height;

      // 1. Kiểm tra trực tiếp xem có click trúng chai lọ mỹ phẩm nào không
      if (typeof getBottleAtRel === 'function') {
        const clickedBottle = getBottleAtRel(relX, relY);
        if (clickedBottle) {
          if (typeof activateProductWorld === 'function') {
            activateProductWorld(clickedBottle);
          } else {
            launchFragranceMist(clickedBottle);
          }
          return;
        }
      }

      // 2. Chạm vào chùm hoa đậu biếc ở nửa trên (loại trừ vùng chai lọ)
      if (relY <= 0.48 && relX >= 0.22 && relX <= 0.78) {
        const startX = clientX;
        const startY = clientY;
        const dirX = (relX - 0.5) * 2.2;
        launchFlowerBranch(startX, startY, dirX);
        return;
      }

      // 3. Chạm vào nửa dưới (mặt bàn đá hoa cương, cạnh chai lọ, lụa hồng)
      // Mở thế giới từ chai mỹ phẩm gần nhất!
      if (relY >= 0.38 && typeof getNearestBottle === 'function') {
        const nearestBottle = getNearestBottle(relX, relY);
        if (nearestBottle) {
          if (typeof activateProductWorld === 'function') {
            activateProductWorld(nearestBottle);
          } else {
            launchFragranceMist(nearestBottle);
          }
          return;
        }
      }

      // 4. Các góc nền còn lại: cành tách từ chùm hoa trên bình và bay xuống điểm click
      const startX = rect.left + rect.width * (0.42 + (Math.random() - 0.5) * 0.24);
      const startY = rect.top + rect.height * (0.16 + Math.random() * 0.18);
      const dirX = (clientX - startX) > 0 ? 0.9 : -0.9;
      launchFlowerBranch(startX, startY, dirX);
    } else {
      // Bấm ra ngoài không gian xung quanh: tách từ bình hoa rồi bay theo hướng con trỏ
      const startX = rect.left + rect.width * (0.45 + (Math.random() - 0.5) * 0.2);
      const startY = rect.top + rect.height * 0.22;
      const dirX = (clientX - startX) > 0 ? 1.0 : -1.0;
      launchFlowerBranch(startX, startY, dirX);
    }
  }

  if (livingFrameEl) {
    livingFrameEl.addEventListener('click', handleSceneInteraction);
    livingFrameEl.addEventListener('touchstart', (e) => {
      // Mobile touch
      handleSceneInteraction(e);
    }, { passive: true });
  }

  if (mainContentEl) {
    mainContentEl.addEventListener('click', (e) => {
      // Nếu click vào vùng ngoài livingFrame trong mainContent
      if (livingFrameEl && !livingFrameEl.contains(e.target)) {
        handleSceneInteraction(e);
      }
    });
  }

  // --- Vòng lặp vật lý học khí động học cho cành hoa (60fps) ---
  function updateFlowerBranchPhysics() {
    // 1. Cập nhật đốm sáng nắng lấp lánh (Sparkles)
    for (let i = activeSparkles.length - 1; i >= 0; i--) {
      const sp = activeSparkles[i];
      sp.life++;
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.rot += 1.8;

      const progress = sp.life / sp.maxLife;
      const scale = Math.sin(progress * Math.PI) * 1.25;
      const alpha = Math.sin(progress * Math.PI);

      sp.el.style.transform = `translate3d(${sp.x.toFixed(1)}px, ${sp.y.toFixed(1)}px, 0) scale(${scale.toFixed(2)}) rotate(${sp.rot.toFixed(1)}deg)`;
      sp.el.style.opacity = alpha.toFixed(3);

      if (sp.life >= sp.maxLife) {
        sp.el.remove();
        activeSparkles.splice(i, 1);
      }
    }

    // 2. Cập nhật cành hoa bay chính (Unified Falling Branches - Cành + Lá + Hoa là một Object duy nhất)
    for (let i = activeBranches.length - 1; i >= 0; i--) {
      const br = activeBranches[i];
      br.life++;
      const u = Math.min(1, Math.max(0, br.life / br.maxLife));

      // Lấy tọa độ và đạo hàm vận tốc từ quỹ đạo Spline
      const sample = sampleCatmullRomSpline(br.trajectory.points, u);
      const curX = br.originX + sample.x * br.dir * br.scaleFactor;
      const curY = br.originY + sample.y * br.scaleFactor;

      // Tính góc tiếp tuyến hướng bay
      const vx = sample.dx * br.dir;
      const vy = sample.dy;
      const headingRad = Math.atan2(vy, vx);
      const headingDeg = headingRad * (180 / Math.PI);

      // Dao động con lắc khí động học tự nhiên
      br.swayPhase += br.swaySpeed;
      const sway = Math.sin(br.swayPhase) * br.swayAmp;

      // Hướng đầu cành uốn lượn theo tiếp tuyến đường bay, kết hợp đung đưa tự nhiên
      const targetTiltZ = br.baseRot + headingDeg * 0.46 + sway * 12;
      br.currentTiltZ += (targetTiltZ - br.currentTiltZ) * 0.14;

      // Độ uốn cong khí động học của thân cành khi đón gió rẽ hướng (Stem Flex)
      const targetSkew = -Math.sin(headingRad) * 7.2 * br.dir + sway * 3.2;
      br.currentSkew += (targetSkew - br.currentSkew) * 0.12;

      // Góc nghiêng 3D trong không gian (3D perspective tilt & roll)
      const tiltY = Math.cos(br.swayPhase * 0.85) * (br.trajectory.id === 3 ? 34 : 22);
      const tiltX = Math.sin(br.swayPhase * 0.68) * 16;

      // Đường cong độ trong suốt: hiện êm ái đầu đường bay, vững vàng giữa không trung, mờ dần cuối đường
      let alpha = 1;
      if (u < 0.08) {
        alpha = Math.sin((u / 0.08) * Math.PI * 0.5);
      } else if (u > 0.74) {
        alpha = 1 - (u - 0.74) / 0.26;
      }

      // Kích thước cành hoa co giãn nhẹ theo nhịp thở của luồng gió
      const scaleBreathe = 0.95 + 0.09 * Math.sin(u * Math.PI);
      const renderScale = br.baseScale * scaleBreathe;

      // Render cành hoa như một object thống nhất (Cành + Lá + Hoa)
      br.el.style.transform = `translate3d(${(curX - br.width * 0.5).toFixed(1)}px, ${(curY - br.height * 0.5).toFixed(1)}px, 0) scale(${renderScale.toFixed(3)}) rotateZ(${br.currentTiltZ.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg) rotateX(${tiltX.toFixed(1)}deg)`;
      br.innerEl.style.transform = `skewX(${br.currentSkew.toFixed(1)}deg) scaleY(${(1 - Math.abs(br.currentSkew) * 0.007).toFixed(3)})`;
      br.el.style.opacity = Math.max(0, Math.min(1, alpha)).toFixed(3);

      if (br.life >= br.maxLife) {
        br.el.remove();
        activeBranches.splice(i, 1);
      }
      requestAnimationFrame(updateFlowerBranchPhysics);
    }

    requestAnimationFrame(updateFlowerBranchPhysics);

    // ============================================================
    // 7. HIỆU ỨNG THỊ GIÁC "MÙI HƯƠNG" (FRAGRANCE MIST & RIBBON)
    // - Diễn đạt mùi hương hoa đậu biếc bằng hình ảnh thị giác lung linh
    // - Khi người dùng click vào chai nước hoa/mỹ phẩm:
    //   + Lớp sương cực mịn bay lên với độ mờ dịu (opacity thấp)
    //   + Chuyển động dạng ribbon uốn lượn hình sóng sin mềm mại
    //   + Hạt sáng nhỏ, đốm sao lấp lánh (sparkles & stardust)
    //   + Quầng sáng glow xanh ngọc đậu biếc & trắng ngọc trai
    //   + Thẻ chữ bay bổng:
    //       ✨  ·  ✨
    //       Butterfly Pea
    //       A gentle floral moment...
    //   + Sau vài giây tự động tan biến êm đềm vào không khí
    // ============================================================
    const fragranceCanvas = document.getElementById('fragranceCanvas');
    const fragranceTextContainer = document.getElementById('fragranceTextContainer');

    let fCtx = null;
    let fWidth = 0;
    let fHeight = 0;
    const activeFragranceBursts = [];
    let isFragranceLoopActive = false;

    const fragranceBottles = [
      {
        id: 'serum',
        brand: 'Butterfly Pea',
        name: 'Rejuvenating Serum',
        subtitle: 'Một khoảnh khắc dịu dàng dành cho em.',
        tag: 'Serum Dưỡng Trẻ Hóa',
        message: 'Một khoảnh khắc\ndịu dàng dành cho em.',
        nozzle: { x: 0.211, y: 0.372 },
        bounds: { minX: 0.135, maxX: 0.28, minY: 0.31, maxY: 0.83 },
        ribbonColor: { r: 147, g: 197, b: 253 }, // Blue sapphire
        sprayAngle: -0.06
      },
      {
        id: 'cream',
        brand: 'Butterfly Pea',
        name: 'Radiance Cream',
        subtitle: 'Nâng niu từng nét rạng rỡ của em.',
        tag: 'Kem Dưỡng Sáng Mịn',
        message: 'Nâng niu từng nét rạng rỡ,\nvỗ về giấc mơ êm đềm của em.',
        nozzle: { x: 0.344, y: 0.620 },
        bounds: { minX: 0.27, maxX: 0.43, minY: 0.54, maxY: 0.86 },
        ribbonColor: { r: 199, g: 210, b: 254 }, // Lavender pearl
        sprayAngle: -0.03
      },
      {
        id: 'toner',
        brand: 'Butterfly Pea',
        name: 'Hydrating Toner',
        subtitle: 'Từng giọt sương mát lành ban mai...',
        tag: 'Toner Cấp Ẩm Tươi Mát',
        message: 'Từng giọt sương mát lành,\nđánh thức sự tươi mới và nét cười em.',
        nozzle: { x: 0.600, y: 0.357 },
        bounds: { minX: 0.54, maxX: 0.66, minY: 0.31, maxY: 0.85 },
        ribbonColor: { r: 147, g: 197, b: 253 },
        sprayAngle: 0.04
      },
      {
        id: 'essence',
        brand: 'Butterfly Pea',
        name: 'Soothing Essence',
        subtitle: 'Làn sương thơm dịu ngọt vấn vương...',
        tag: 'Nước Hoa & Tinh Chất Xịt',
        message: 'Làn sương thơm dịu ngọt,\nvấn vương chở che em qua từng ngày dài.',
        nozzle: { x: 0.729, y: 0.430 },
        bounds: { minX: 0.68, maxX: 0.79, minY: 0.38, maxY: 0.86 },
        ribbonColor: { r: 125, g: 211, b: 252 }, // Sky blue mist
        sprayAngle: 0.08
      },
      {
        id: 'lipbalm',
        brand: 'Butterfly Pea',
        name: 'Lip Balm Nourish & Glow',
        subtitle: 'Gửi chút ngọt ngào vương nhẹ...',
        tag: 'Son Dưỡng Căng Mọng',
        message: 'Gửi chút ngọt ngào vương nhẹ,\ncho đôi môi em luôn hé nụ cười tươi.',
        nozzle: { x: 0.667, y: 0.758 },
        bounds: { minX: 0.60, maxX: 0.74, minY: 0.71, maxY: 0.93 },
        ribbonColor: { r: 244, g: 208, b: 234 }, // Pink-violet
        sprayAngle: 0.02
      },
      {
        id: 'liptube',
        brand: 'Butterfly Pea',
        name: 'Lip Balm Tube',
        subtitle: 'Sự chăm sóc ân cần bên em...',
        tag: 'Tuýp Son Đậu Biếc',
        message: 'Sự chăm sóc ân cần,\nluôn bên em từ những điều nhỏ bé nhất.',
        nozzle: { x: 0.813, y: 0.583 },
        bounds: { minX: 0.77, maxX: 0.88, minY: 0.51, maxY: 0.91 },
        ribbonColor: { r: 249, g: 168, b: 212 },
        sprayAngle: 0.06
      },
      {
        id: 'flower_vase',
        brand: 'Butterfly Pea',
        name: 'Botanical Blossom',
        subtitle: 'Sắc biếc hoa thủy chung...',
        tag: 'Bình Hoa Đậu Biếc',
        message: 'Sắc biếc hoa thủy chung,\nthay ngàn lời yêu gửi trọn đến em.',
        nozzle: { x: 0.500, y: 0.220 },
        bounds: { minX: 0.28, maxX: 0.72, minY: 0.04, maxY: 0.38 },
        ribbonColor: { r: 147, g: 197, b: 253 },
        sprayAngle: 0.0
      }
    ];

    function getBottleAtRel(relX, relY) {
      // Chỉ các chai lọ mỹ phẩm mới mở thế giới riêng (không chặn click vào hoa)
      for (let i = 0; i < fragranceBottles.length; i++) {
        const b = fragranceBottles[i];
        if (b.id === 'flower_vase') continue;
        if (
          relX >= b.bounds.minX && relX <= b.bounds.maxX &&
          relY >= b.bounds.minY && relY <= b.bounds.maxY
        ) {
          return b;
        }
      }
      return null;
    }

    function getNearestBottle(relX, relY) {
      let closest = null;
      let minDist = Infinity;
      for (let i = 0; i < fragranceBottles.length; i++) {
        const b = fragranceBottles[i];
        if (b.id === 'flower_vase') continue;
        const dx = (relX - b.nozzle.x) * 1.35;
        const dy = relY - b.nozzle.y;
        const dist = Math.hypot(dx, dy);
        if (dist < minDist) {
          minDist = dist;
          closest = b;
        }
      }
      return closest;
    }

    function resizeFragranceCanvas() {
      if (!fragranceCanvas || !livingFrameEl) return;
      const rect = livingFrameEl.getBoundingClientRect();
      fWidth = rect.width;
      fHeight = rect.height;
      if (fWidth === 0 || fHeight === 0) return;

      const dpr = window.devicePixelRatio || 1;
      fragranceCanvas.width = fWidth * dpr;
      fragranceCanvas.height = fHeight * dpr;
      if (fCtx) {
        fCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }

    if (fragranceCanvas && livingFrameEl) {
      fCtx = fragranceCanvas.getContext('2d');
      resizeFragranceCanvas();

      if (window.ResizeObserver) {
        const roF = new ResizeObserver(() => resizeFragranceCanvas());
        roF.observe(livingFrameEl);
      }
      window.addEventListener('resize', resizeFragranceCanvas);
      if (livingPhotoEl) {
        if (livingPhotoEl.complete) resizeFragranceCanvas();
        else livingPhotoEl.addEventListener('load', resizeFragranceCanvas);
      }
    }

    // Âm thanh xịt sương dịu êm qua Web Audio API (thanh khiết, không chói tai)
    function playFragranceSound() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const actx = new AudioCtx();
        if (actx.state === 'suspended') {
          actx.resume();
        }

        const bufferSize = Math.floor(actx.sampleRate * 0.42);
        const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
        }

        const noise = actx.createBufferSource();
        noise.buffer = buffer;

        const filter = actx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3400, actx.currentTime);
        filter.Q.setValueAtTime(1.6, actx.currentTime);

        const gain = actx.createGain();
        gain.gain.setValueAtTime(0.001, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.040, actx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.38);

        const osc = actx.createOscillator();
        const oscGain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1567.98, actx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2093.00, actx.currentTime + 0.35);
        oscGain.gain.setValueAtTime(0.012, actx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.42);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(actx.destination);

        osc.connect(oscGain);
        oscGain.connect(actx.destination);

        noise.start();
        osc.start();
        noise.stop(actx.currentTime + 0.40);
        osc.stop(actx.currentTime + 0.44);
      } catch (e) {
        // Bỏ qua nếu audio bị chặn
      }
    }

    // Hiển thị thẻ chữ bay bổng "Butterfly Pea / A gentle floral moment..."
    function showFragranceCard(bottle, nozzleX, nozzleY) {
      if (!fragranceTextContainer) return;

      // Xóa thẻ cũ của cùng chai lọ nếu đang hiển thị
      const existing = fragranceTextContainer.querySelector(`[data-bottle-id="${bottle.id}"]`);
      if (existing) {
        existing.classList.remove('active');
        existing.classList.add('dissolving');
        setTimeout(() => existing.remove(), 600);
      }

      const card = document.createElement('div');
      card.className = 'fragrance-moment-card';
      card.setAttribute('data-bottle-id', bottle.id);

      // Canh chỉnh vị trí thẻ chữ: nằm ngay phía trên chai, giới hạn không tràn khung hình
      const cardX = Math.max(110, Math.min(fWidth - 110, nozzleX));
      const cardY = Math.max(65, nozzleY - 60);

      card.style.left = `${cardX}px`;
      card.style.top = `${cardY}px`;

      card.innerHTML = `
      <div class="fragrance-sparkle-row">
        <span class="f-star">✨</span>
        <span class="f-dot">·</span>
        <span class="f-star">✨</span>
      </div>
      <div class="fragrance-title">Butterfly Pea</div>
      <div class="fragrance-subtitle">A gentle floral moment...</div>
      <div class="fragrance-product-tag">${bottle.name}</div>
    `;

      fragranceTextContainer.appendChild(card);

      // Kích hoạt animation xuất hiện
      requestAnimationFrame(() => {
        card.classList.add('active');
      });

      // Sau 3.3s bắt đầu mờ tan biến
      setTimeout(() => {
        if (card.parentElement) {
          card.classList.remove('active');
          card.classList.add('dissolving');
        }
      }, 3300);

      // Sau 4.3s gỡ bỏ hoàn toàn khỏi DOM
      setTimeout(() => {
        if (card.parentElement) {
          card.remove();
        }
      }, 4300);
    }

    // ============================================================
    // THẾ GIỚI RIÊNG KHI CLICK VÀO TỪNG MÓN MỸ PHẨM (PRODUCT WORLDS)
    // 1️⃣ Chai rung nhẹ (haptic shake + focus aura)
    // 2️⃣ Cành hoa xung quanh bắt đầu bay
    // 3️⃣ Ánh sáng lóe nhẹ trên chai
    // 4️⃣ Hương thơm xuất hiện (làn sương ribbon & âm thanh)
    // 5️⃣ Thông tin hiện ra (người dùng tự đóng, không timeout)
    // ============================================================
    function activateProductWorld(bottle) {
      if (!bottle) return;
      dismissTouchHint();

      // 0. Đóng modal hiện tại nếu có
      const currentModal = document.getElementById('productWorldModal');
      if (currentModal) {
        currentModal.remove();
      }
      const oldShaker = livingFrameEl ? livingFrameEl.querySelector('.bottle-shaker-element') : null;
      if (oldShaker) oldShaker.remove();

      if (!fCtx || fWidth === 0 || fHeight === 0) {
        resizeFragranceCanvas();
      }

      const targetImg = livingPhotoEl || (livingFrameEl ? livingFrameEl.querySelector('img') : null);
      const fRect = livingFrameEl ? livingFrameEl.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
      const iRect = targetImg ? targetImg.getBoundingClientRect() : fRect;

      const bottleBox = {
        left: bottle.bounds.minX * iRect.width + (iRect.left - fRect.left),
        top: bottle.bounds.minY * iRect.height + (iRect.top - fRect.top),
        width: (bottle.bounds.maxX - bottle.bounds.minX) * iRect.width,
        height: (bottle.bounds.maxY - bottle.bounds.minY) * iRect.height
      };

      const nozzleX = bottle.nozzle.x * fWidth;
      const nozzleY = bottle.nozzle.y * fHeight;
      const absNozzleX = fRect.left + nozzleX;
      const absNozzleY = fRect.top + nozzleY;

      // ==========================================
      // 1️⃣ CHAI RUNG NHẸ (0ms)
      // ==========================================
      // Haptic vibration cho thiết bị di động
      if (window.navigator && window.navigator.vibrate) {
        try {
          window.navigator.vibrate([28, 35, 28]);
        } catch (err) { }
      }

      // Tách lớp phần tử chai thực tế và rung nhẹ tự nhiên
      if (targetImg && targetImg.complete && targetImg.naturalWidth > 0 && livingFrameEl && bottle.id !== 'flower_vase') {
        const shakerEl = document.createElement('div');
        shakerEl.className = 'bottle-shaker-element bottle-shaking';
        shakerEl.style.left = `${bottleBox.left}px`;
        shakerEl.style.top = `${bottleBox.top}px`;
        shakerEl.style.width = `${bottleBox.width}px`;
        shakerEl.style.height = `${bottleBox.height}px`;

        const shakerCanvas = document.createElement('canvas');
        const dpr = window.devicePixelRatio || 1;
        shakerCanvas.width = Math.max(1, Math.round(bottleBox.width * dpr));
        shakerCanvas.height = Math.max(1, Math.round(bottleBox.height * dpr));
        shakerCanvas.style.width = '100%';
        shakerCanvas.style.height = '100%';

        const sCtx = shakerCanvas.getContext('2d');
        sCtx.scale(dpr, dpr);

        const sx = bottle.bounds.minX * targetImg.naturalWidth;
        const sy = bottle.bounds.minY * targetImg.naturalHeight;
        const sw = (bottle.bounds.maxX - bottle.bounds.minX) * targetImg.naturalWidth;
        const sh = (bottle.bounds.maxY - bottle.bounds.minY) * targetImg.naturalHeight;

        sCtx.drawImage(targetImg, sx, sy, sw, sh, 0, 0, bottleBox.width, bottleBox.height);

        const shineEl = document.createElement('div');
        shineEl.className = 'bottle-shaker-shine';

        shakerEl.appendChild(shakerCanvas);
        shakerEl.appendChild(shineEl);
        livingFrameEl.appendChild(shakerEl);

        setTimeout(() => {
          shakerEl.classList.remove('bottle-shaking');
          shakerEl.classList.add('bottle-focused');
        }, 500);
      }

      // ==========================================
      // 2️⃣ CÀNH HOA XUNG QUANH BẮT ĐẦU BAY (60ms)
      // ==========================================
      setTimeout(() => {
        // 2 cành hoa bay từ 2 hướng trái phải xung quanh chai
        const bOriginX1 = fRect.left + bottleBox.left + bottleBox.width * 0.15;
        const bOriginY1 = fRect.top + bottleBox.top + bottleBox.height * 0.2;
        launchFlowerBranch(bOriginX1, bOriginY1, -1.1);

        setTimeout(() => {
          const bOriginX2 = fRect.left + bottleBox.left + bottleBox.width * 0.85;
          const bOriginY2 = fRect.top + bottleBox.top + bottleBox.height * 0.15;
          launchFlowerBranch(bOriginX2, bOriginY2, 1.15);
        }, 90);
      }, 60);

      // ==========================================
      // 3️⃣ ÁNH SÁNG LÓE NHẸ TRÊN CHAI (140ms)
      // ==========================================
      setTimeout(() => {
        const flashEl = document.createElement('div');
        flashEl.className = 'bottle-spray-flash';
        flashEl.style.left = `${nozzleX}px`;
        flashEl.style.top = `${nozzleY}px`;
        if (livingFrameEl) {
          livingFrameEl.appendChild(flashEl);
          setTimeout(() => flashEl.remove(), 750);
        }

        for (let s = 0; s < 5; s++) {
          const sx = absNozzleX + (Math.random() - 0.5) * 35;
          const sy = absNozzleY + (Math.random() - 0.5) * 30;
          createSparkle(sx, sy);
        }
      }, 140);

      // ==========================================
      // 4️⃣ HƯƠNG THƠM XUẤT HIỆN (220ms)
      // ==========================================
      setTimeout(() => {
        launchFragranceMist(bottle, false);
      }, 220);

      // ==========================================
      // 5️⃣ THÔNG TIN HIỆN RA (480ms)
      // (Người dùng tự đóng, không ép timeout)
      // ==========================================
      setTimeout(() => {
        renderProductWorldModal(bottle);
      }, 480);
    }

    // Hiển thị thẻ thông tin "Thế giới riêng" với nút [ Đóng ]
    function renderProductWorldModal(bottle) {
      if (!livingFrameEl) return;

      const existing = document.getElementById('productWorldModal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.className = 'product-world-modal';
      modal.id = 'productWorldModal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', `${bottle.brand || 'Butterfly Pea'} - ${bottle.name}`);

      const formattedMessage = (bottle.message || 'Một khoảnh khắc\ndịu dàng dành cho em.').replace(/\n/g, '<br>');

      modal.innerHTML = `
      <div class="world-card-backdrop" id="worldCardBackdrop"></div>
      <div class="world-card-container">
        <div class="world-sparkle-top">
          <span class="world-star">✨</span>
        </div>

        <div class="world-brand-title">${bottle.brand || 'Butterfly Pea'}</div>

        <div class="world-product-name">${bottle.name}</div>

        <div class="world-divider">
          <span class="world-divider-line"></span>
          <span class="world-divider-gem">✦</span>
          <span class="world-divider-line"></span>
        </div>

        <div class="world-message">${formattedMessage}</div>

        <button type="button" class="world-close-btn" id="worldCloseBtn" aria-label="Đóng thế giới riêng">
          <span class="world-close-bracket">[</span>
          <span class="world-close-text">Đóng</span>
          <span class="world-close-bracket">]</span>
        </button>
      </div>
    `;

      livingFrameEl.appendChild(modal);

      requestAnimationFrame(() => {
        modal.classList.add('active');
        const closeBtn = modal.querySelector('#worldCloseBtn');
        if (closeBtn) closeBtn.focus();
      });

      function closeModal() {
        modal.classList.remove('active');
        modal.classList.add('closing');

        const shaker = livingFrameEl.querySelector('.bottle-shaker-element');
        if (shaker) {
          shaker.classList.add('shaker-fade-out');
        }

        setTimeout(() => {
          modal.remove();
          if (shaker) shaker.remove();
        }, 420);

        document.removeEventListener('keydown', handleKeydown);
      }

      function handleKeydown(e) {
        if (e.key === 'Escape') {
          closeModal();
        }
      }

      const closeBtn = modal.querySelector('#worldCloseBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeModal();
        });
      }

      const backdrop = modal.querySelector('#worldCardBackdrop');
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          e.stopPropagation();
          closeModal();
        });
      }

      document.addEventListener('keydown', handleKeydown);
    }

    // Khởi phát làn sương hương thơm mỹ phẩm (Fragrance Mist Launch)
    function launchFragranceMist(bottle, showCard = true) {
      dismissTouchHint();
      playFragranceSound();

      if (!fCtx || fWidth === 0 || fHeight === 0) {
        resizeFragranceCanvas();
      }

      const nozzleX = bottle.nozzle.x * fWidth;
      const nozzleY = bottle.nozzle.y * fHeight;

      // 1. Đốm sáng aura lóe lên ngay miệng chai/vòi xịt
      const flashEl = document.createElement('div');
      flashEl.className = 'bottle-spray-flash';
      flashEl.style.left = `${nozzleX}px`;
      flashEl.style.top = `${nozzleY}px`;
      if (livingFrameEl) {
        livingFrameEl.appendChild(flashEl);
        setTimeout(() => flashEl.remove(), 700);
      }

      // 2. Thẻ chữ nghệ thuật nổi lên (nếu không dùng modal thế giới riêng)
      if (showCard) {
        showFragranceCard(bottle, nozzleX, nozzleY);
      }

      // 3. Khởi tạo chùm sương (Fragrance Burst)
      if (activeFragranceBursts.length >= 4) {
        activeFragranceBursts[0].maxLife = activeFragranceBursts[0].life + 25;
      }

      const maxRise = Math.min(300, fHeight * 0.44);

      // A. Các dải lụa sương Ribbon
      const ribbons = [
        {
          originX: nozzleX,
          originY: nozzleY,
          maxWidth: 28,
          maxHeight: maxRise,
          waveFreq1: 0.021,
          waveAmp1: 18,
          waveFreq2: 0.045,
          waveAmp2: 8,
          phase1: 0,
          phase2: Math.PI * 0.4,
          twistFreq: 0.022,
          twistPhase: 0,
          driftX: bottle.sprayAngle * 0.28,
          baseAlpha: 0.42,
          color: bottle.ribbonColor,
          life: 0,
          maxLife: 220
        },
        {
          originX: nozzleX,
          originY: nozzleY,
          maxWidth: 22,
          maxHeight: maxRise * 0.90,
          waveFreq1: 0.025,
          waveAmp1: 24,
          waveFreq2: 0.050,
          waveAmp2: 10,
          phase1: -0.9,
          phase2: 1.1,
          twistFreq: 0.028,
          twistPhase: 0.8,
          driftX: -0.16 + bottle.sprayAngle * 0.2,
          baseAlpha: 0.32,
          color: { r: 186, g: 230, b: 253 },
          life: 0,
          maxLife: 200
        },
        {
          originX: nozzleX,
          originY: nozzleY,
          maxWidth: 24,
          maxHeight: maxRise * 0.94,
          waveFreq1: 0.023,
          waveAmp1: 22,
          waveFreq2: 0.046,
          waveAmp2: 9,
          phase1: 0.8,
          phase2: -1.3,
          twistFreq: 0.026,
          twistPhase: -0.9,
          driftX: 0.17 + bottle.sprayAngle * 0.2,
          baseAlpha: 0.34,
          color: { r: 199, g: 210, b: 254 },
          life: 0,
          maxLife: 210
        },
        {
          originX: nozzleX,
          originY: nozzleY,
          maxWidth: 15,
          maxHeight: maxRise * 1.05,
          waveFreq1: 0.032,
          waveAmp1: 14,
          waveFreq2: 0.065,
          waveAmp2: 6,
          phase1: 1.4,
          phase2: 0,
          twistFreq: 0.038,
          twistPhase: 2.0,
          driftX: bottle.sprayAngle * 0.12,
          baseAlpha: 0.45,
          color: { r: 255, g: 255, b: 255 },
          life: 0,
          maxLife: 230
        }
      ];

      // B. Lớp sương cực mịn (Micro-mist cloud particles)
      const mistParticles = [];
      const mistCount = 48;
      for (let i = 0; i < mistCount; i++) {
        const spraySpread = (Math.random() - 0.5) * 2.2 + bottle.sprayAngle * 2.5;
        const initialBurstSpeed = 2.6 + Math.random() * 2.6;
        mistParticles.push({
          x: nozzleX + (Math.random() - 0.5) * 8,
          y: nozzleY - Math.random() * 4,
          vx: spraySpread,
          vy: -initialBurstSpeed,
          drag: 0.945,
          driftY: -(0.32 + Math.random() * 0.45),
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.025 + Math.random() * 0.025,
          swayAmp: 0.35 + Math.random() * 0.65,
          radius: 4 + Math.random() * 4,
          maxRadius: 28 + Math.random() * 24,
          baseAlpha: 0.16 + Math.random() * 0.12,
          life: 0,
          maxLife: 170 + Math.random() * 70,
          color: bottle.ribbonColor
        });
      }

      // C. Hạt sáng nhỏ & đốm sao lấp lánh (Sparkles & Stardust)
      const sparkles = [];
      const sparkleCount = 28;
      for (let i = 0; i < sparkleCount; i++) {
        const isStar = Math.random() > 0.4;
        sparkles.push({
          x: nozzleX + (Math.random() - 0.5) * 14,
          y: nozzleY - Math.random() * 8,
          vx: (Math.random() - 0.5) * 1.8 + bottle.sprayAngle * 1.5,
          vy: -(1.6 + Math.random() * 2.5),
          drag: 0.965,
          driftY: -(0.25 + Math.random() * 0.45),
          rot: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 4.5,
          size: isStar ? 3.5 + Math.random() * 4.5 : 1.2 + Math.random() * 1.8,
          type: isStar ? 'star' : 'dot',
          twinkleSpeed: 0.05 + Math.random() * 0.08,
          twinklePhase: Math.random() * Math.PI * 2,
          baseAlpha: 0.55 + Math.random() * 0.4,
          life: 0,
          maxLife: 150 + Math.random() * 80,
          color: Math.random() > 0.3 ? { r: 255, g: 255, b: 255 } : { r: 186, g: 230, b: 253 }
        });
      }

      // D. Vòng sóng aura lan tỏa ở miệng chai
      const rings = [
        { x: nozzleX, y: nozzleY, startR: 4, maxR: 30, baseAlpha: 0.65, life: 0, maxLife: 32 },
        { x: nozzleX, y: nozzleY, startR: 2, maxR: 22, baseAlpha: 0.45, life: -6, maxLife: 30 }
      ];

      activeFragranceBursts.push({
        id: Date.now() + Math.random(),
        ribbons,
        mistParticles,
        sparkles,
        rings
      });

      if (!isFragranceLoopActive) {
        isFragranceLoopActive = true;
        requestAnimationFrame(renderFragranceMist);
      }
    }

    // Vòng lặp vẽ làn sương hương thơm (Fragrance Mist Canvas Render Loop)
    function renderFragranceMist() {
      if (!fCtx || fWidth === 0 || fHeight === 0) {
        if (activeFragranceBursts.length > 0) {
          requestAnimationFrame(renderFragranceMist);
        } else {
          isFragranceLoopActive = false;
        }
        return;
      }

      fCtx.clearRect(0, 0, fWidth, fHeight);

      let totalActiveElements = 0;

      for (let b = activeFragranceBursts.length - 1; b >= 0; b--) {
        const burst = activeFragranceBursts[b];

        // 1. Vẽ vòng sóng aura miệng chai
        for (let i = burst.rings.length - 1; i >= 0; i--) {
          const ring = burst.rings[i];
          ring.life++;
          if (ring.life < 0) continue;
          if (ring.life >= ring.maxLife) {
            burst.rings.splice(i, 1);
            continue;
          }
          totalActiveElements++;
          const prog = ring.life / ring.maxLife;
          const currentR = ring.startR + (ring.maxR - ring.startR) * Math.sqrt(prog);
          const alpha = ring.baseAlpha * (1 - prog);

          fCtx.save();
          fCtx.globalCompositeOperation = 'screen';
          fCtx.beginPath();
          fCtx.ellipse(ring.x, ring.y, currentR, currentR * 0.45, 0, 0, Math.PI * 2);
          fCtx.lineWidth = 1.4;
          fCtx.strokeStyle = `rgba(224, 242, 254, ${alpha.toFixed(3)})`;
          fCtx.stroke();
          fCtx.restore();
        }

        // 2. Vẽ các dải lụa sương Ribbon
        for (let i = 0; i < burst.ribbons.length; i++) {
          const strand = burst.ribbons[i];
          strand.life++;
          if (strand.life >= strand.maxLife) continue;
          totalActiveElements++;

          const progress = strand.life / strand.maxLife;
          const headProgress = Math.min(1, progress / 0.32);
          const headDist = headProgress * strand.maxHeight;
          const headY = strand.originY - headDist;

          let tailDist = 0;
          if (progress > 0.22) {
            tailDist = ((progress - 0.22) / 0.78) * strand.maxHeight;
          }
          const tailY = strand.originY - tailDist;

          const activeHeight = tailY - headY;
          if (activeHeight <= 4) continue;

          let strandAlpha = 1;
          if (progress < 0.12) {
            strandAlpha = progress / 0.12;
          } else if (progress > 0.52) {
            strandAlpha = 1 - (progress - 0.52) / 0.48;
          }
          strandAlpha *= strand.baseAlpha;
          if (strandAlpha <= 0.005) continue;

          const steps = 24;
          const spinePts = [];
          const leftPts = [];
          const rightPts = [];

          for (let s = 0; s <= steps; s++) {
            const tSeg = s / steps;
            const y = tailY - tSeg * activeHeight;
            const distFromOrigin = strand.originY - y;

            const wave1 = Math.sin(distFromOrigin * strand.waveFreq1 + strand.phase1 + strand.life * 0.032) * strand.waveAmp1;
            const wave2 = Math.sin(distFromOrigin * strand.waveFreq2 + strand.phase2 + strand.life * 0.052) * strand.waveAmp2;
            const growth = Math.min(1.25, distFromOrigin / 65);
            const x = strand.originX + (wave1 + wave2 + strand.driftX * distFromOrigin) * growth;

            const widthEnvelope = Math.sin(tSeg * Math.PI);
            const twist = Math.sin(distFromOrigin * strand.twistFreq + strand.twistPhase + strand.life * 0.024);
            const currentW = Math.max(1.8, strand.maxWidth * widthEnvelope * (0.32 + 0.68 * Math.abs(twist)));

            spinePts.push({ x, y, w: currentW });
          }

          for (let j = 0; j < spinePts.length; j++) {
            const pt = spinePts[j];
            let dx, dy;
            if (j === 0) {
              dx = spinePts[1].x - pt.x;
              dy = spinePts[1].y - pt.y;
            } else if (j === spinePts.length - 1) {
              dx = pt.x - spinePts[j - 1].x;
              dy = pt.y - spinePts[j - 1].y;
            } else {
              dx = spinePts[j + 1].x - spinePts[j - 1].x;
              dy = spinePts[j + 1].y - spinePts[j - 1].y;
            }
            const len = Math.hypot(dx, dy) || 1;
            const nx = -dy / len;
            const ny = dx / len;

            leftPts.push({ x: pt.x + nx * (pt.w * 0.5), y: pt.y + ny * (pt.w * 0.5) });
            rightPts.push({ x: pt.x - nx * (pt.w * 0.5), y: pt.y - ny * (pt.w * 0.5) });
          }

          fCtx.save();
          fCtx.globalCompositeOperation = 'screen';

          const grad = fCtx.createLinearGradient(0, tailY, 0, headY);
          const col = strand.color;
          grad.addColorStop(0, `rgba(255, 255, 255, ${(strandAlpha * 0.55).toFixed(3)})`);
          grad.addColorStop(0.35, `rgba(${col.r}, ${col.g}, ${col.b}, ${(strandAlpha * 0.38).toFixed(3)})`);
          grad.addColorStop(0.75, `rgba(${Math.min(255, col.r + 35)}, ${Math.min(255, col.g + 25)}, 255, ${(strandAlpha * 0.18).toFixed(3)})`);
          grad.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);

          fCtx.beginPath();
          fCtx.moveTo(leftPts[0].x, leftPts[0].y);
          for (let k = 1; k < leftPts.length - 1; k++) {
            const midX = (leftPts[k].x + leftPts[k + 1].x) * 0.5;
            const midY = (leftPts[k].y + leftPts[k + 1].y) * 0.5;
            fCtx.quadraticCurveTo(leftPts[k].x, leftPts[k].y, midX, midY);
          }
          fCtx.lineTo(leftPts[leftPts.length - 1].x, leftPts[leftPts.length - 1].y);
          fCtx.lineTo(rightPts[rightPts.length - 1].x, rightPts[rightPts.length - 1].y);
          for (let k = rightPts.length - 2; k > 0; k--) {
            const midX = (rightPts[k].x + rightPts[k - 1].x) * 0.5;
            const midY = (rightPts[k].y + rightPts[k - 1].y) * 0.5;
            fCtx.quadraticCurveTo(rightPts[k].x, rightPts[k].y, midX, midY);
          }
          fCtx.lineTo(rightPts[0].x, rightPts[0].y);
          fCtx.closePath();

          fCtx.fillStyle = grad;
          fCtx.fill();

          // Đường sống lụa óng ánh phát sáng ở giữa
          fCtx.beginPath();
          fCtx.moveTo(spinePts[0].x, spinePts[0].y);
          for (let k = 1; k < spinePts.length - 1; k++) {
            const midX = (spinePts[k].x + spinePts[k + 1].x) * 0.5;
            const midY = (spinePts[k].y + spinePts[k + 1].y) * 0.5;
            fCtx.quadraticCurveTo(spinePts[k].x, spinePts[k].y, midX, midY);
          }
          fCtx.lineTo(spinePts[spinePts.length - 1].x, spinePts[spinePts.length - 1].y);
          fCtx.lineWidth = Math.max(1, strand.maxWidth * 0.12);
          fCtx.strokeStyle = `rgba(255, 255, 255, ${(strandAlpha * 0.65).toFixed(3)})`;
          fCtx.stroke();

          fCtx.restore();
        }

        // 3. Vẽ lớp hạt sương cực mịn (Micro-mist cloud particles)
        for (let i = burst.mistParticles.length - 1; i >= 0; i--) {
          const p = burst.mistParticles[i];
          p.life++;
          if (p.life >= p.maxLife) {
            burst.mistParticles.splice(i, 1);
            continue;
          }
          totalActiveElements++;

          p.vy *= p.drag;
          p.vx *= p.drag;
          p.y += p.vy + p.driftY;
          p.swayPhase += p.swaySpeed;
          p.x += p.vx + Math.sin(p.swayPhase) * p.swayAmp;

          const prog = p.life / p.maxLife;
          const rad = p.radius + (p.maxRadius - p.radius) * prog;
          let alpha = p.baseAlpha * Math.sin(prog * Math.PI);

          if (alpha <= 0.005) continue;

          const mg = fCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
          mg.addColorStop(0, `rgba(255, 255, 255, ${(alpha * 0.72).toFixed(3)})`);
          mg.addColorStop(0.35, `rgba(186, 230, 253, ${(alpha * 0.42).toFixed(3)})`);
          mg.addColorStop(0.70, `rgba(96, 165, 250, ${(alpha * 0.16).toFixed(3)})`);
          mg.addColorStop(1, 'rgba(59, 130, 246, 0)');

          fCtx.save();
          fCtx.globalCompositeOperation = 'screen';
          fCtx.beginPath();
          fCtx.arc(p.x, p.y, rad, 0, Math.PI * 2);
          fCtx.fillStyle = mg;
          fCtx.fill();
          fCtx.restore();
        }

        // 4. Vẽ hạt sáng nhỏ & đốm sao lấp lánh (Sparkles & Stardust)
        for (let i = burst.sparkles.length - 1; i >= 0; i--) {
          const sp = burst.sparkles[i];
          sp.life++;
          if (sp.life >= sp.maxLife) {
            burst.sparkles.splice(i, 1);
            continue;
          }
          totalActiveElements++;

          sp.vy *= sp.drag;
          sp.vx *= sp.drag;
          sp.y += sp.vy + sp.driftY;
          sp.x += sp.vx + Math.sin(sp.twinklePhase) * 0.25;
          sp.rot += sp.rotSpeed;
          sp.twinklePhase += sp.twinkleSpeed;

          const prog = sp.life / sp.maxLife;
          const alpha = sp.baseAlpha * Math.sin(prog * Math.PI) * (0.65 + 0.35 * Math.sin(sp.twinklePhase));
          if (alpha <= 0.01) continue;

          fCtx.save();
          fCtx.translate(sp.x, sp.y);
          fCtx.rotate((sp.rot * Math.PI) / 180);

          if (sp.type === 'star') {
            const r = sp.size;
            fCtx.beginPath();
            fCtx.moveTo(0, -r);
            fCtx.quadraticCurveTo(0, 0, r, 0);
            fCtx.quadraticCurveTo(0, 0, 0, r);
            fCtx.quadraticCurveTo(0, 0, -r, 0);
            fCtx.quadraticCurveTo(0, 0, 0, -r);
            fCtx.closePath();
            fCtx.fillStyle = `rgba(${sp.color.r}, ${sp.color.g}, ${sp.color.b}, ${alpha.toFixed(3)})`;
            fCtx.shadowColor = 'rgba(147, 197, 253, 0.85)';
            fCtx.shadowBlur = 7;
            fCtx.fill();

            fCtx.beginPath();
            fCtx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
            fCtx.fillStyle = `rgba(255, 255, 255, ${(alpha * 0.95).toFixed(3)})`;
            fCtx.fill();
          } else {
            fCtx.beginPath();
            fCtx.arc(0, 0, sp.size, 0, Math.PI * 2);
            fCtx.fillStyle = `rgba(${sp.color.r}, ${sp.color.g}, ${sp.color.b}, ${alpha.toFixed(3)})`;
            fCtx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            fCtx.shadowBlur = 5;
            fCtx.fill();
          }

          fCtx.restore();
        }

        // Xóa burst khi toàn bộ thành phần đã tan biến
        const hasRibbonsAlive = burst.ribbons.some(r => r.life < r.maxLife);
        if (!hasRibbonsAlive && burst.mistParticles.length === 0 && burst.sparkles.length === 0 && burst.rings.length === 0) {
          activeFragranceBursts.splice(b, 1);
        }
      }

      if (totalActiveElements > 0 && activeFragranceBursts.length > 0) {
        requestAnimationFrame(renderFragranceMist);
      } else {
        fCtx.clearRect(0, 0, fWidth, fHeight);
        isFragranceLoopActive = false;
      }
    }

    // ============================================================
    // 9. LẮNG NGHE TƯƠNG TÁC CHO CÁC NÚT HOTSPOT TỪNG MÓN
    // ============================================================
    const bottleHotspots = document.querySelectorAll('.bottle-hotspot');
    bottleHotspots.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const bottleId = btn.getAttribute('data-bottle-id');
        if (bottleId === 'flower_vase') {
          const rect = btn.getBoundingClientRect();
          const startX = rect.left + rect.width * (0.35 + Math.random() * 0.3);
          const startY = rect.top + rect.height * (0.3 + Math.random() * 0.4);
          launchFlowerBranch(startX, startY, (Math.random() - 0.5) * 2);
          return;
        }
        const bottle = fragranceBottles.find(b => b.id === bottleId);
        if (bottle) {
          activateProductWorld(bottle);
        }
      });
    });
  });

