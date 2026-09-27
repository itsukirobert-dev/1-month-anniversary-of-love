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
    });

    livingFrame.addEventListener('mouseleave', () => {
      if (bottleSheen) bottleSheen.style.transform = '';
      if (sunlightCaustic) sunlightCaustic.style.transform = '';
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
  const activePetals = [];
  const activeSparkles = [];
  let isHintDismissed = false;

  function dismissTouchHint() {
    if (!isHintDismissed && touchHintEl) {
      isHintDismissed = true;
      touchHintEl.classList.add('fade-out');
      setTimeout(() => {
        if (touchHintEl.parentElement) touchHintEl.remove();
      }, 600);
    }
  }

  // --- Danh mục hình ảnh cành hoa và cánh hoa thật (từ hình chụp thực tế) ---
  const branchConfigs = [
    {
      src: 'assets/images/falling_branches/branch_1.png',
      width: 215,
      height: 146,
      blossomOffset: { x: 45, y: -20 }
    },
    {
      src: 'assets/images/falling_branches/branch_2.png',
      width: 155,
      height: 205,
      blossomOffset: { x: -25, y: 15 }
    },
    {
      src: 'assets/images/falling_branches/branch_3.png',
      width: 170,
      height: 158,
      blossomOffset: { x: -20, y: -25 }
    }
  ];

  const petalConfigs = [
    { src: 'assets/images/falling_branches/petal_1.png', width: 48, height: 50 },
    { src: 'assets/images/falling_branches/petal_2.png', width: 50, height: 52 },
    { src: 'assets/images/falling_branches/petal_3.png', width: 52, height: 38 },
    { src: 'assets/images/falling_branches/petal_4.png', width: 44, height: 33 },
    { src: 'assets/images/falling_branches/petal_5.png', width: 28, height: 43 },
    { src: 'assets/images/falling_branches/petal_6.png', width: 36, height: 26 }
  ];

  // Tải trước toàn bộ ảnh cành & cánh hoa vào bộ nhớ đệm
  [...branchConfigs.map(b => b.src), ...petalConfigs.map(p => p.src)].forEach(src => {
    const preImg = new Image();
    preImg.src = src;
  });

  // --- SVG Đốm sáng nắng lấp lánh (Sparkle) ---
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

  // --- Tạo cánh hoa thật tách rời rơi theo gió ---
  function createDetachedPetal(x, y, parentVx, parentVy) {
    const pCfg = petalConfigs[Math.floor(Math.random() * petalConfigs.length)];
    const isMobile = window.innerWidth < 768;
    const pWidth = Math.round(pCfg.width * (isMobile ? 0.75 : 1));
    const pHeight = Math.round(pCfg.height * (isMobile ? 0.75 : 1));

    const el = document.createElement('div');
    el.className = 'detached-petal';
    el.style.width = pWidth + 'px';
    el.style.height = pHeight + 'px';

    const img = document.createElement('img');
    img.src = pCfg.src;
    img.alt = 'Cánh hoa đậu biếc rơi';
    img.className = 'petal-img';
    el.appendChild(img);

    branchLayer.appendChild(el);

    const kickAngle = Math.random() * Math.PI * 2;
    const kickSpeed = 0.8 + Math.random() * 1.5;

    activePetals.push({
      el,
      x: x - pWidth / 2,
      y: y - pHeight / 2,
      vx: parentVx * 0.65 + Math.cos(kickAngle) * kickSpeed,
      vy: parentVy * 0.45 + Math.sin(kickAngle) * kickSpeed - 0.5,
      g: 0.05 + Math.random() * 0.03, // Nhẹ hơn cành rất nhiều
      dragX: 0.978,
      dragY: 0.982,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.055 + Math.random() * 0.035, // Lắc nhanh hơn cành
      swayAmp: 0.8 + Math.random() * 0.8,
      rotZ: Math.random() * 360,
      rotSpeedZ: (Math.random() - 0.5) * 5.5,
      rotY: Math.random() * 360,
      rotSpeedY: (Math.random() - 0.5) * 7.5,
      rotX: Math.random() * 360,
      rotSpeedX: (Math.random() - 0.5) * 4.5,
      life: 0,
      maxLife: 210 + Math.random() * 60,
      scale: 0.85 + Math.random() * 0.3
    });

    createSparkle(x, y);
  }

  // --- Khởi tạo cành hoa thật tách khỏi bố cục bay lượn ---
  function launchFlowerBranch(originX, originY, targetDirX = 0) {
    dismissTouchHint();

    // Giới hạn số lượng cành đang bay cùng lúc để luôn mượt 60fps
    if (activeBranches.length >= 4) {
      activeBranches[0].maxLife = activeBranches[0].life + 25;
    }

    const bIdx = Math.floor(Math.random() * branchConfigs.length);
    const bCfg = branchConfigs[bIdx];
    const isMobile = window.innerWidth < 768;
    const bWidth = Math.round(bCfg.width * (isMobile ? 0.72 : 1));
    const bHeight = Math.round(bCfg.height * (isMobile ? 0.72 : 1));

    const branchEl = document.createElement('div');
    branchEl.className = 'falling-branch';
    branchEl.style.width = bWidth + 'px';
    branchEl.style.height = bHeight + 'px';

    const innerEl = document.createElement('div');
    innerEl.className = 'branch-inner';

    const imgEl = document.createElement('img');
    imgEl.src = bCfg.src;
    imgEl.alt = 'Cành hoa đậu biếc rơi';
    imgEl.className = 'branch-img';
    innerEl.appendChild(imgEl);
    branchEl.appendChild(innerEl);

    branchLayer.appendChild(branchEl);

    // Hạt nắng lóe sáng tại điểm cành hoa tách ra
    for (let s = 0; s < 3; s++) {
      createSparkle(originX + (Math.random() - 0.5) * 24, originY + (Math.random() - 0.5) * 24);
    }

    const branch = {
      el: branchEl,
      innerEl: innerEl,
      width: bWidth,
      height: bHeight,
      x: originX - bWidth * 0.45,
      y: originY - bHeight * 0.45,
      vx: targetDirX * 1.3 + (Math.random() - 0.5) * 1.4,
      vy: -0.9 - Math.random() * 0.7, // Lực nâng nhẹ khi tách khỏi bình hoa
      g: 0.095 + Math.random() * 0.025, // Trọng lực dịu nhẹ
      dragX: 0.985,
      dragY: 0.988,
      swayPhase: Math.random() * Math.PI,
      swaySpeed: 0.025 + Math.random() * 0.012, // Dao động chao đảo nhẹ
      swayAmp: 1.3 + Math.random() * 0.8,
      baseRot: (Math.random() - 0.5) * 22,
      currentSkew: 0,
      life: 0,
      maxLife: 270 + Math.random() * 60, // Bay trong 4.5s - 5.5s
      petalMilestones: [0.30, 0.62],
      scale: 0.90 + Math.random() * 0.18,
      blossomOffset: bCfg.blossomOffset
    };

    activeBranches.push(branch);
  }

  // --- Bộ lắng nghe tương tác click / chạm ---
  function handleSceneInteraction(e) {
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

    let startX, startY, dirX = 0;

    if (isInsideImg) {
      const relX = (clientX - rect.left) / rect.width;
      const relY = (clientY - rect.top) / rect.height;

      // Bình hoa đậu biếc nằm ở nửa trên (relY: 0.08 - 0.48, relX: 0.28 - 0.72)
      if (relY <= 0.50 && relX >= 0.25 && relX <= 0.75) {
        // Chạm trúng vị trí chùm hoa: Cành tách ngay tại điểm bấm!
        startX = clientX;
        startY = clientY;
        dirX = (relX - 0.5) * 2.2;
      } else {
        // Chạm vào phần chai lọ, mặt bàn hoặc cạnh ảnh: cành tách từ chùm hoa trên bình và bay xuống điểm click
        startX = rect.left + rect.width * (0.42 + (Math.random() - 0.5) * 0.24);
        startY = rect.top + rect.height * (0.16 + Math.random() * 0.18);
        dirX = (clientX - startX) > 0 ? 0.9 : -0.9;
      }
    } else {
      // Bấm ra ngoài không gian xung quanh: tách từ bình hoa rồi bay theo hướng con trỏ
      startX = rect.left + rect.width * (0.45 + (Math.random() - 0.5) * 0.2);
      startY = rect.top + rect.height * 0.22;
      dirX = (clientX - startX) > 0 ? 1.0 : -1.0;
    }

    launchFlowerBranch(startX, startY, dirX);
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

  // --- Vòng lặp vật lý học khí động học cho cành hoa & cánh hoa ---
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

    // 2. Cập nhật cánh hoa nhỏ tách rời (Detached Petals)
    for (let i = activePetals.length - 1; i >= 0; i--) {
      const pt = activePetals[i];
      pt.life++;
      pt.swayPhase += pt.swaySpeed;

      const swayForce = Math.sin(pt.swayPhase) * pt.swayAmp;
      pt.vx += swayForce * 0.22;
      pt.vy += pt.g;
      pt.vx *= pt.dragX;
      pt.vy *= pt.dragY;

      // Cánh hoa rất nhẹ nên vận tốc rơi được hãm ở mức êm dịu
      if (pt.vy > 1.6) pt.vy = 1.6;

      pt.x += pt.vx;
      pt.y += pt.vy;

      pt.rotZ += pt.rotSpeedZ;
      pt.rotY += pt.rotSpeedY;
      pt.rotX += pt.rotSpeedX;

      const progress = pt.life / pt.maxLife;
      let alpha = 1;
      if (progress > 0.68) {
        alpha = 1 - (progress - 0.68) / 0.32;
      }

      pt.el.style.transform = `translate3d(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px, 0) scale(${pt.scale.toFixed(2)}) rotateZ(${pt.rotZ.toFixed(1)}deg) rotateY(${pt.rotY.toFixed(1)}deg) rotateX(${pt.rotX.toFixed(1)}deg)`;
      pt.el.style.opacity = Math.max(0, alpha).toFixed(3);

      if (pt.life >= pt.maxLife) {
        pt.el.remove();
        activePetals.splice(i, 1);
      }
    }

    // 3. Cập nhật cành hoa chính (Falling Branches)
    for (let i = activeBranches.length - 1; i >= 0; i--) {
      const br = activeBranches[i];
      br.life++;
      const progress = br.life / br.maxLife;

      br.swayPhase += br.swaySpeed;

      // Sức nâng khí động học khi cành chao đảo trong gió
      const sway = Math.sin(br.swayPhase);
      const lateralLift = Math.cos(br.swayPhase) * br.swayAmp;
      br.vx += lateralLift * 0.17;

      // Trọng lực kéo xuống nhẹ nhàng
      br.vy += br.g;

      // Cuối đường bay hơi chậm lại do sức cản không khí (air resistance cushioning)
      if (progress > 0.58) {
        br.vy *= 0.972;
        br.vx *= 0.975;
        if (br.vy > 1.85) br.vy = 1.85;
      } else {
        br.vx *= br.dragX;
        br.vy *= br.dragY;
        if (br.vy > 2.5) br.vy = 2.5;
      }

      br.x += br.vx;
      br.y += br.vy;

      // Uốn cong thân cành theo hướng bay (Stem flex)
      // Khi cành bay sang phải, gió ép cành cong về sau; khi lượn trái, cành uốn ngược lại
      const targetSkew = -br.vx * 6.8 + sway * 5.2;
      br.currentSkew += (targetSkew - br.currentSkew) * 0.12;

      // Xoay nhẹ & nghiêng 3D trong không gian (3D perspective tilt)
      const tiltZ = br.baseRot + sway * 25 + br.vx * 7.2;
      const tiltY = Math.cos(br.swayPhase * 0.82) * 32;
      const tiltX = Math.sin(br.swayPhase * 0.65) * 18;

      // Vài cánh hoa nhỏ tách rời khỏi cành giữa đường bay
      if (br.petalMilestones.length > 0 && progress >= br.petalMilestones[0]) {
        br.petalMilestones.shift();
        const rad = tiltZ * Math.PI / 180;
        const offX = br.blossomOffset ? br.blossomOffset.x : 0;
        const offY = br.blossomOffset ? br.blossomOffset.y : 0;
        const rotX = Math.cos(rad) * offX - Math.sin(rad) * offY;
        const rotY = Math.sin(rad) * offX + Math.cos(rad) * offY;
        createDetachedPetal(br.x + br.width / 2 + rotX, br.y + br.height / 2 + rotY, br.vx, br.vy);
      }

      // Cành mờ dần rồi biến mất êm đềm
      let alpha = 1;
      if (progress > 0.72) {
        alpha = 1 - (progress - 0.72) / 0.28;
      }

      br.el.style.transform = `translate3d(${br.x.toFixed(1)}px, ${br.y.toFixed(1)}px, 0) scale(${br.scale.toFixed(2)}) rotateZ(${tiltZ.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg) rotateX(${tiltX.toFixed(1)}deg)`;
      br.innerEl.style.transform = `skewX(${br.currentSkew.toFixed(1)}deg) scaleY(${(1 - Math.abs(br.currentSkew) * 0.008).toFixed(3)})`;
      br.el.style.opacity = Math.max(0, alpha).toFixed(3);

      if (br.life >= br.maxLife) {
        br.el.remove();
        activeBranches.splice(i, 1);
      }
    }

    requestAnimationFrame(updateFlowerBranchPhysics);
  }

  requestAnimationFrame(updateFlowerBranchPhysics);
});

