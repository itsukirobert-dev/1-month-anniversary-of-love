/**
 * ============================================================
 * BUTTERFLY PEA PETAL ENGINE (ĐỘNG CƠ CÁNH HOA ĐẬU BIẾC)
 * ============================================================
 * 
 * Hệ thống mô phỏng cánh hoa Đậu Biếc chân thực (Photorealistic)
 * lấy cảm hứng từ cử chỉ tay người thật: hất nhẹ, tung hoặc thả
 * một nắm cánh hoa vào làn gió nhẹ của căn phòng.
 * 
 * ĐẶC ĐIỂM VẬT LÝ & KHÍ ĐỘNG HỌC:
 * 1. Initial Impulse: Xung lực phóng ban đầu theo hướng hất tay thật.
 * 2. Bézier / Catmull-Rom Spline: Đường bay cong uốn lượn tự nhiên, không đi thẳng.
 * 3. 3D Tumbling & Flutter: Xoay lật 3 chiều (Pitch, Roll, Yaw) chao đảo theo gió.
 * 4. Lateral Drift & Vortex Shedding: Trôi dạt trái/phải với sóng xoáy khí quyển.
 * 5. Inertia & Air Drag: Quán tính ban đầu nhanh, sau đó hãm phanh do sức cản không khí.
 * 6. Non-repeating Trajectories: Mỗi cánh hoa có quỹ đạo riêng biệt độc nhất.
 * 7. Desynchronized Cluster: Nhóm cánh hoa phân tách không đồng bộ: cánh đi trước,
 *    cánh đi sau, cánh tản sang hai bên.
 * 8. Terminal Settle: Cuối hành trình cánh hoa giảm tốc, xoay nhẹ, mờ dần và trôi êm ả.
 * ============================================================
 */

(function (window, document) {
  'use strict';

  // --- Cấu hình 6 mẫu cánh hoa Đậu Biếc thật cắt từ ảnh chụp thực tế ---
  const PETAL_SPRITES = [
    {
      id: 'petal-1',
      src: 'assets/images/falling_branches/petal_1.png',
      width: 192,
      height: 200,
      aspect: 192 / 200,
      description: 'Cánh hoa xòe tròn màu xanh hoàng gia, cuống trắng ngọc'
    },
    {
      id: 'petal-2',
      src: 'assets/images/falling_branches/petal_2.png',
      width: 203,
      height: 209,
      aspect: 203 / 209,
      description: 'Cánh hoa uốn 3D đọng giọt sương mai lấp lánh'
    },
    {
      id: 'petal-3',
      src: 'assets/images/falling_branches/petal_3.png',
      width: 201,
      height: 148,
      aspect: 201 / 148,
      description: 'Cánh hoa thon dài viền lượn sóng phủ hạt sương li ti'
    },
    {
      id: 'petal-4',
      src: 'assets/images/falling_branches/petal_4.png',
      width: 159,
      height: 120,
      aspect: 159 / 120,
      description: 'Cánh hoa dập dờn như cánh bướm đón gió'
    },
    {
      id: 'petal-5',
      src: 'assets/images/falling_branches/petal_5.png',
      width: 84,
      height: 130,
      aspect: 84 / 130,
      description: 'Cánh hoa búp thon mảnh đài hoa xanh lục nhạt'
    },
    {
      id: 'petal-6',
      src: 'assets/images/falling_branches/petal_6.png',
      width: 115,
      height: 82,
      aspect: 115 / 82,
      description: 'Cánh hoa cong hình chiếc thuyền nhỏ bềnh bồng'
    }
  ];

  // Tiền tải (preload) ảnh vào RAM để đảm bảo hiển thị tức thì, không giật lag
  const preloadedImages = [];
  PETAL_SPRITES.forEach(item => {
    const img = new Image();
    img.src = item.src;
    preloadedImages.push(img);
  });

  // --- Âm thanh cánh hoa xào xạc rất khẽ lướt qua ngón tay (Web Audio API) ---
  function playPetalFlutterSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // 1. Tiếng xào xạc lụa/gió dịu ngọt
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastVal = 0;
      for (let i = 0; i < bufferSize; i++) {
        // Lọc Pink/Brownian noise êm ái
        const white = Math.random() * 2 - 1;
        data[i] = (lastVal + (0.04 * white)) / 1.04;
        lastVal = data[i];
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.4);
      filter.Q.value = 1.4;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.022, ctx.currentTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.42);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.45);
    } catch (_) {
      // Bỏ qua nếu audio bị trình duyệt chặn trước tương tác
    }
  }

  // ============================================================
  // LỚP TOÁN HỌC QUỸ ĐẠO: COMPOSITE BÉZIER / SPLINE
  // ============================================================
  class SplineCurve {
    /**
     * Đường cong Bézier bậc 3 (Cubic Bézier) 4 điểm điều khiển:
     * P0: Điểm bắt đầu
     * P1: Điểm xung lực & quán tính (Impulse & Inertia vector)
     * P2: Đỉnh vòm & giao thoa gió (Apex & Wind Capture)
     * P3: Điểm hạ cánh / trôi dạt (Descent & Drift)
     */
    static cubicBezier(p0, p1, p2, p3, t) {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
      const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

      // Đạo hàm vận tốc tức thời (để tính góc tiếp tuyến bay)
      const dx = 3 * uu * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * tt * (p3.x - p2.x);
      const dy = 3 * uu * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * tt * (p3.y - p2.y);

      return { x, y, dx, dy };
    }
  }

  // ============================================================
  // PETAL ENGINE CHÍNH
  // ============================================================
  class PetalEngine {
    constructor(options = {}) {
      this.options = Object.assign({
        maxConcurrentPetals: 45,
        defaultClusterCount: 6,
        ambientInterval: 14000, // Tự động thả 1-2 cánh hoa mỗi 14 giây khi rảnh rỗi
        enableAmbientBreeze: true,
        enablePointerFlick: true
      }, options);

      this.activePetals = [];
      this.activeSparkles = [];
      this.layerEl = null;
      this.isLoopRunning = false;
      this.lastFrameTime = performance.now();
      this.ambientTimer = null;

      // Theo dõi thao tác chuột/ngón tay để nhận diện cú hất (Hand Flick)
      this.pointerTracker = {
        isDown: false,
        startX: 0,
        startY: 0,
        startTime: 0,
        lastX: 0,
        lastY: 0,
        lastTime: 0,
        vx: 0,
        vy: 0
      };

      // Gió nền từ BackgroundEngine (nếu có)
      this.ambientWindX = 0.55; // Mặc định gió thoảng nhẹ sang phải

      this.init();
    }

    init() {
      // 1. Tạo hoặc tìm layer chứa cánh hoa
      let layer = document.getElementById('petalEngineLayer');
      if (!layer) {
        layer = document.createElement('div');
        layer.id = 'petalEngineLayer';
        layer.className = 'petal-engine-layer';
        layer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(layer);
      }
      this.layerEl = layer;

      // 2. Lắng nghe cử chỉ tay hất (Pointer Flick & Tap)
      if (this.options.enablePointerFlick) {
        this.bindPointerEvents();
      }

      // 3. Tự động liên kết với chùm hoa và các hotspot trong căn phòng
      this.bindSceneHotspots();

      // 4. Kích hoạt làn gió nhẹ tự nhiên thổi rải rác
      if (this.options.enableAmbientBreeze) {
        this.startAmbientBreeze();
      }

      // Đồng bộ gió với Background Engine nếu đang chạy
      this.syncWithBackgroundEngine();
    }

    // --- Đồng bộ hóa hướng gió động lực với Background Engine ---
    syncWithBackgroundEngine() {
      setInterval(() => {
        if (window.bgEngineInstance && window.bgEngineInstance.wind) {
          // Gió thay đổi tự nhiên theo thời gian
          this.ambientWindX = 0.4 + window.bgEngineInstance.wind.current * 0.8;
        }
      }, 1000);
    }

    // --- Lắng nghe cử chỉ hất / quẹt / chạm bằng tay ---
    bindPointerEvents() {
      // Nhường quyền điều phối cử chỉ và tương tác cho InteractionEngine nếu có
      if (window.InteractionEngine || window.interactionEngine) {
        return;
      }

      const handlePointerDown = (e) => {
        // Bỏ qua nếu chạm vào modal, nút điều khiển hoặc thẻ tương tác đặc biệt
        if (e.target.closest('#productWorldModal') || e.target.closest('.music-toggle-btn') || e.target.closest('.main-navigation')) {
          return;
        }

        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

        this.pointerTracker.isDown = true;
        this.pointerTracker.startX = clientX;
        this.pointerTracker.startY = clientY;
        this.pointerTracker.lastX = clientX;
        this.pointerTracker.lastY = clientY;
        this.pointerTracker.startTime = performance.now();
        this.pointerTracker.lastTime = this.pointerTracker.startTime;
        this.pointerTracker.vx = 0;
        this.pointerTracker.vy = 0;
      };

      const handlePointerMove = (e) => {
        if (!this.pointerTracker.isDown) return;

        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        const now = performance.now();
        const dt = Math.max(now - this.pointerTracker.lastTime, 8);

        // Vận tốc lướt tay
        this.pointerTracker.vx = (clientX - this.pointerTracker.lastX) / dt;
        this.pointerTracker.vy = (clientY - this.pointerTracker.lastY) / dt;

        this.pointerTracker.lastX = clientX;
        this.pointerTracker.lastY = clientY;
        this.pointerTracker.lastTime = now;
      };

      const handlePointerUp = (e) => {
        if (!this.pointerTracker.isDown) return;
        this.pointerTracker.isDown = false;

        const now = performance.now();
        const duration = now - this.pointerTracker.startTime;
        const totalDistX = this.pointerTracker.lastX - this.pointerTracker.startX;
        const totalDistY = this.pointerTracker.lastY - this.pointerTracker.startY;
        const totalDist = Math.hypot(totalDistX, totalDistY);

        // Trường hợp 1: Cử chỉ HẤT TAY THẬT (Flick / Swipe)
        // Quãng đường > 24px trong thời gian < 380ms
        if (totalDist > 24 && duration < 380) {
          const speed = Math.hypot(this.pointerTracker.vx, this.pointerTracker.vy);
          if (speed > 0.15) {
            // Hất một chùm cánh hoa theo đúng vận tốc và hướng vung tay!
            this.flick({
              x: this.pointerTracker.startX,
              y: this.pointerTracker.startY,
              vx: this.pointerTracker.vx,
              vy: this.pointerTracker.vy,
              count: 5 + Math.floor(Math.random() * 3)
            });
            return;
          }
        }

        // Trường hợp 2: Chạm / Click nhẹ nhàng (Tap / Click)
        // Người dùng buông một nắm cánh hoa vào không trung
        if (totalDist < 18 && duration < 450) {
          // Bỏ qua nếu click trúng hotspot (hotspot có handler riêng)
          if (e.target.closest('.bottle-hotspot')) return;

          this.toss({
            x: this.pointerTracker.lastX,
            y: this.pointerTracker.lastY,
            count: 4 + Math.floor(Math.random() * 3)
          });
        }
      };

      window.addEventListener('mousedown', handlePointerDown, { passive: true });
      window.addEventListener('mousemove', handlePointerMove, { passive: true });
      window.addEventListener('mouseup', handlePointerUp, { passive: true });

      window.addEventListener('touchstart', handlePointerDown, { passive: true });
      window.addEventListener('touchmove', handlePointerMove, { passive: true });
      window.addEventListener('touchend', handlePointerUp, { passive: true });
    }

    // --- Liên kết tự động với các vùng hoa đậu biếc và chai mỹ phẩm ---
    bindSceneHotspots() {
      if (window.InteractionEngine || window.interactionEngine) {
        return;
      }
      // 1. Chạm vào bình hoa đậu biếc (Blossom Heads & Hotspot)
      const flowerHotspot = document.querySelector('.bottle-hotspot[data-bottle-id="flower_vase"]');
      const blossom1 = document.getElementById('blossomHead1');
      const blossom2 = document.getElementById('blossomHead2');
      const branchTop = document.getElementById('branchTop');

      const triggerFlowerToss = (e) => {
        const rect = (e.currentTarget || e.target).getBoundingClientRect();
        const originX = rect.left + rect.width * (0.3 + Math.random() * 0.4);
        const originY = rect.top + rect.height * (0.3 + Math.random() * 0.4);

        // Hất bung chùm 6-8 cánh hoa rực rỡ từ cành hoa
        this.toss({
          x: originX,
          y: originY,
          count: 6 + Math.floor(Math.random() * 3),
          force: 1.25,
          angle: -Math.PI * 0.5 + (Math.random() - 0.5) * 0.8 // Vút lên cao rồi tỏa ra
        });
      };

      if (flowerHotspot) flowerHotspot.addEventListener('click', triggerFlowerToss);
      if (blossom1) blossom1.addEventListener('click', triggerFlowerToss);
      if (blossom2) blossom2.addEventListener('click', triggerFlowerToss);
      if (branchTop) branchTop.addEventListener('click', triggerFlowerToss);
    }

    // --- Làn gió thoảng định kỳ (Ambient Breeze) ---
    startAmbientBreeze() {
      const scheduleNextBreeze = () => {
        const interval = this.options.ambientInterval * (0.8 + Math.random() * 0.5);
        this.ambientTimer = setTimeout(() => {
          this.gentleBreeze();
          scheduleNextBreeze();
        }, interval);
      };
      scheduleNextBreeze();
    }

    gentleBreeze() {
      // Thả 1-2 cánh hoa từ vị trí bình hoa đậu biếc trong bức ảnh
      const livingFrame = document.getElementById('livingFrame');
      let originX = window.innerWidth * 0.48;
      let originY = window.innerHeight * 0.32;

      if (livingFrame) {
        const rect = livingFrame.getBoundingClientRect();
        originX = rect.left + rect.width * (0.38 + Math.random() * 0.22);
        originY = rect.top + rect.height * (0.12 + Math.random() * 0.20);
      }

      const count = 1 + (Math.random() < 0.4 ? 1 : 0);
      this.toss({
        x: originX,
        y: originY,
        count: count,
        force: 0.85,
        spread: 0.35,
        angle: -Math.PI * 0.35 + (this.ambientWindX > 0 ? 0.3 : -0.3)
      });
    }

    // ============================================================
    // API TƯƠNG TÁC 1: CỬ CHỈ HẤT TAY (FLICK GESTURE)
    // ============================================================
    flick(options = {}) {
      const {
        x = window.innerWidth / 2,
        y = window.innerHeight / 2,
        vx = 0,
        vy = -1,
        count = 6
      } = options;

      // Tính góc vung tay
      const heading = Math.atan2(vy, vx);
      const rawSpeed = Math.hypot(vx, vy);
      // Chuẩn hóa lực hất trong khoảng mượt mà [0.95, 2.2]
      const force = Math.max(0.95, Math.min(2.2, rawSpeed * 1.6));

      this.toss({
        x,
        y,
        angle: heading,
        force: force,
        count: count,
        spread: 0.52 // Góc xòe chùm cánh hoa khi hất
      });
    }

    // ============================================================
    // API TƯƠNG TÁC 2: TUNG / THẢ CÁNH HOA (TOSS / RELEASE)
    // ============================================================
    toss(options = {}) {
      const {
        x = window.innerWidth / 2,
        y = window.innerHeight / 2,
        count = this.options.defaultClusterCount,
        force = 1.1,
        spread = 0.58
      } = options;

      // Xác định góc tung mặc định nếu không truyền vào:
      // Tự nhiên như tay tung cánh hoa lên cao rồi để gió cuốn đi
      let baseAngle = options.angle;
      if (typeof baseAngle !== 'number') {
        const screenNormX = (x / window.innerWidth) * 2 - 1; // [-1: mép trái, +1: mép phải]
        // Nếu click bên trái -> tung vòm sang phải; nếu click bên phải -> tung vòm sang trái
        const lateralBias = -screenNormX * 0.45;
        baseAngle = -Math.PI * 0.5 + lateralBias + (Math.random() - 0.5) * 0.25;
      }

      playPetalFlutterSound();

      // Giới hạn số lượng cánh hoa tối đa cùng lúc để duy trì 60fps mượt mà
      while (this.activePetals.length + count > this.options.maxConcurrentPetals) {
        const oldest = this.activePetals.shift();
        if (oldest && oldest.el) oldest.el.remove();
      }

      // Tạo đốm sáng nắng lấp lánh tại điểm tương tác
      this.createSparkles(x, y, 4);

      // ------------------------------------------------------------
      // PHÂN TÁCH KHÔNG ĐỒNG BỘ CÁC CÁNH TRONG NHÓM (DESYNCHRONIZATION)
      // - Một số cánh đi trước (cánh dẫn đầu, xung lực mạnh, delay 0)
      // - Một số cánh đi sau (cánh theo sau, delay 80-220ms, tốc độ chậm hơn)
      // - Một số cánh lệch sang hai bên (góc lệch rộng)
      // ------------------------------------------------------------
      for (let i = 0; i < count; i++) {
        let role = 'wing'; // 'lead', 'wing', 'trailer'
        let delayMs = 0;
        let speedMult = 1.0;
        let angleOffset = 0;

        if (i === 0) {
          // Cánh 0: Cánh dẫn đầu (Lead) -> vút đi trước tiên, xung lực mạnh nhất
          role = 'lead';
          delayMs = 0;
          speedMult = 1.25 + Math.random() * 0.2;
          angleOffset = (Math.random() - 0.5) * 0.18;
        } else if (i === 1 && count >= 4) {
          // Cánh 1: Cánh lệch bên phải
          role = 'wing';
          delayMs = 35 + Math.random() * 45;
          speedMult = 1.05 + Math.random() * 0.15;
          angleOffset = (spread * 0.5) + (Math.random() * 0.3);
        } else if (i === 2 && count >= 4) {
          // Cánh 2: Cánh lệch bên trái
          role = 'wing';
          delayMs = 50 + Math.random() * 45;
          speedMult = 1.02 + Math.random() * 0.15;
          angleOffset = -(spread * 0.5) - (Math.random() * 0.3);
        } else if (i >= count - 2) {
          // Cánh cuối: Cánh theo sau (Trailer) -> xuất phát trễ hơn, lướt chậm
          role = 'trailer';
          delayMs = 120 + (i * 45) + Math.random() * 60;
          speedMult = 0.78 + Math.random() * 0.18;
          angleOffset = (Math.random() - 0.5) * spread;
        } else {
          // Các cánh còn lại trong lòng chùm
          delayMs = 60 + Math.random() * 90;
          speedMult = 0.90 + Math.random() * 0.25;
          angleOffset = (Math.random() - 0.5) * spread * 0.8;
        }

        const petalAngle = baseAngle + angleOffset;

        // Khởi tạo từng cánh hoa với độ trễ vi mô tự nhiên
        if (delayMs === 0) {
          this.spawnSinglePetal(x, y, petalAngle, force * speedMult, role);
        } else {
          setTimeout(() => {
            this.spawnSinglePetal(x, y, petalAngle, force * speedMult, role);
          }, delayMs);
        }
      }

      this.ensurePhysicsLoop();
    }

    // ============================================================
    // API TƯƠNG TÁC 3: MỘT CÁNH HOA RƠI XUỐNG (DÀNH CHO LIP BALM)
    // ============================================================
    dropSinglePetal(options = {}) {
      const originX = options.x !== undefined ? options.x : window.innerWidth * 0.65;
      const originY = options.y !== undefined ? options.y : window.innerHeight * 0.45;
      const isMobile = window.innerWidth < 768;
      const spriteIdx = options.spriteIndex !== undefined ? options.spriteIndex : 0;
      const sprite = PETAL_SPRITES[spriteIdx] || PETAL_SPRITES[0];

      const basePixelW = isMobile ? 36 : 46;
      const scale = options.scale !== undefined ? options.scale : 0.95;
      const petalW = Math.round(basePixelW * scale);
      const petalH = Math.round(petalW / sprite.aspect);

      const p0 = { x: originX, y: originY };
      const driftX = (Math.random() - 0.5) * 50;
      const fallDist = options.fallDistance || (isMobile ? 240 : 300);

      // Quỹ đạo rơi buông nhẹ xuống, chao liệng đón gió
      const p1 = { x: p0.x + driftX * 0.5, y: p0.y + fallDist * 0.28 };
      const p2 = { x: p0.x - driftX * 0.8, y: p0.y + fallDist * 0.65 };
      const p3 = { x: p0.x + (driftX > 0 ? 30 : -30), y: p0.y + fallDist };

      const baseDurationMs = options.duration || 4200;

      const petalEl = document.createElement('div');
      petalEl.className = 'engine-petal lipbalm-falling-petal';
      petalEl.style.width = petalW + 'px';
      petalEl.style.height = petalH + 'px';

      const innerEl = document.createElement('div');
      innerEl.className = 'engine-petal-inner';

      const imgEl = document.createElement('img');
      imgEl.className = 'engine-petal-img';
      imgEl.src = sprite.src;
      imgEl.alt = sprite.description;
      imgEl.draggable = false;

      innerEl.appendChild(imgEl);
      petalEl.appendChild(innerEl);
      this.layerEl.appendChild(petalEl);

      const petalObj = {
        el: petalEl,
        innerEl: innerEl,
        sprite: sprite,
        width: petalW,
        height: petalH,
        p0, p1, p2, p3,
        startTime: performance.now(),
        durationMs: baseDurationMs,
        durationSec: baseDurationMs / 1000,
        rotZ: Math.random() * 360,
        rotX: 18,
        rotY: 22,
        flipTurnsX: 1.1,
        flipSpeedY: 1.3,
        flutterFreq: 1.9,
        flutterAmpX: 18,
        flutterAmpY: 8,
        phase: Math.random() * Math.PI,
        baseScale: scale,
        depthZ: 1.05,
        role: 'falling'
      };

      this.activePetals.push(petalObj);
      this.ensurePhysicsLoop();
      return petalObj;
    }

    // ============================================================
    // API TƯƠNG TÁC 4: MỘT CÁNH HOA CUỐI CÙNG BAY QUA MÀN HÌNH (KHI ĐÓNG)
    // ============================================================
    flySinglePetalAcross(options = {}) {
      const isMobile = window.innerWidth < 768;
      const startX = options.startX !== undefined ? options.startX : (window.innerWidth * 0.40);
      const startY = options.startY !== undefined ? options.startY : (window.innerHeight * 0.48);
      const targetX = options.targetX !== undefined ? options.targetX : (window.innerWidth + 90);
      const targetY = options.targetY !== undefined ? options.targetY : (startY - 80);

      const spriteIdx = options.spriteIndex !== undefined ? options.spriteIndex : 1;
      const sprite = PETAL_SPRITES[spriteIdx] || PETAL_SPRITES[1];

      const basePixelW = isMobile ? 38 : 50;
      const scale = options.scale !== undefined ? options.scale : 1.05;
      const petalW = Math.round(basePixelW * scale);
      const petalH = Math.round(petalW / sprite.aspect);

      const p0 = { x: startX, y: startY };
      const deltaX = targetX - startX;
      const p1 = { x: startX + deltaX * 0.32, y: startY - 45 };
      const p2 = { x: startX + deltaX * 0.68, y: startY + 25 };
      const p3 = { x: targetX, y: targetY };

      const baseDurationMs = options.duration || 4800;

      const petalEl = document.createElement('div');
      petalEl.className = 'engine-petal lipbalm-final-petal';
      petalEl.style.width = petalW + 'px';
      petalEl.style.height = petalH + 'px';

      const innerEl = document.createElement('div');
      innerEl.className = 'engine-petal-inner';

      const imgEl = document.createElement('img');
      imgEl.className = 'engine-petal-img';
      imgEl.src = sprite.src;
      imgEl.alt = sprite.description;
      imgEl.draggable = false;

      innerEl.appendChild(imgEl);
      petalEl.appendChild(innerEl);
      this.layerEl.appendChild(petalEl);

      const petalObj = {
        el: petalEl,
        innerEl: innerEl,
        sprite: sprite,
        width: petalW,
        height: petalH,
        p0, p1, p2, p3,
        startTime: performance.now(),
        durationMs: baseDurationMs,
        durationSec: baseDurationMs / 1000,
        rotZ: Math.random() * 360,
        rotX: 24,
        rotY: 28,
        flipTurnsX: 1.4,
        flipSpeedY: 1.8,
        flutterFreq: 2.1,
        flutterAmpX: 16,
        flutterAmpY: 9,
        phase: Math.random() * Math.PI,
        baseScale: scale,
        depthZ: 1.15,
        role: 'flying-across'
      };

      this.activePetals.push(petalObj);
      this.ensurePhysicsLoop();
      return petalObj;
    }

    // ============================================================
    // KHỞI TẠO MỘT CÁNH HOA ĐẬU BIẾC ĐỘC NHẤT (SINGLE PETAL)
    // ============================================================
    spawnSinglePetal(originX, originY, launchAngle, launchForce, role) {
      // 1. Chọn ngẫu nhiên 1 trong 6 mẫu cánh hoa thật
      const spriteIdx = Math.floor(Math.random() * PETAL_SPRITES.length);
      const sprite = PETAL_SPRITES[spriteIdx];

      // 2. Kích thước tương thích theo màn hình (Responsive Scale)
      const isMobile = window.innerWidth < 768;
      const basePixelW = isMobile ? 38 : 52;
      // Random scale nhẹ nhàng (từ 0.8x đến 1.25x)
      const scaleRandom = 0.82 + Math.random() * 0.42;
      const petalW = Math.round(basePixelW * scaleRandom);
      const petalH = Math.round(petalW / sprite.aspect);

      // 3. TẠO CÁC ĐIỂM ĐIỀU KHIỂN BÉZIER ĐỘC NHẤT (KHÔNG BAO GIỜ TRÙNG LẶP)
      // Điểm P0: Tọa độ xuất phát (với jitter vị trí ngẫu nhiên nhỏ)
      const p0 = {
        x: originX + (Math.random() - 0.5) * 16,
        y: originY + (Math.random() - 0.5) * 16
      };

      // Vector xung lực phóng ban đầu (Initial Impulse)
      const dirX = Math.cos(launchAngle);
      const dirY = Math.sin(launchAngle);

      // Độ dài quãng xung lực ban đầu do lực hất tay
      const impulseDist = launchForce * (140 + Math.random() * 110) * (isMobile ? 0.72 : 1.0);

      // Điểm P1: Đỉnh quán tính phóng (Inertia Point)
      // Cánh hoa vút thẳng theo hướng hất tay trước khi bị không khí hãm lại
      const p1 = {
        x: p0.x + dirX * impulseDist,
        y: p0.y + dirY * impulseDist
      };

      // Gió phòng và độ xoáy ngang (Wind & Aerodynamic Loft)
      const windDir = this.ambientWindX >= 0 ? 1 : -1;
      const windIntensity = Math.abs(this.ambientWindX);
      const windDriftDist = (120 + Math.random() * 160) * windIntensity * (isMobile ? 0.7 : 1.0);

      // Điểm P2: Đỉnh vòm giao thoa gió (Apex & Wind Capture)
      // Tốc độ phóng giảm dần, cánh hoa bắt đầu bốc lên hoặc võng theo luồng gió
      const apexLift = Math.random() * 45 - 20; // Bốc nhẹ lên hoặc chùng nhẹ
      const p2 = {
        x: p1.x + (dirX * impulseDist * 0.45) + (windDir * windDriftDist * 0.65) + (Math.random() - 0.5) * 50,
        y: p1.y + (dirY * impulseDist * 0.25) - apexLift + (Math.random() * 30)
      };

      // Điểm P3: Điểm lướt hạ cánh & trôi dạt ra ngoài (Descent & Terminal Glide)
      // Trọng lực kết hợp với gió cuốn cánh hoa trôi dần ra xa
      const fallDistY = (240 + Math.random() * 220) * (isMobile ? 0.75 : 1.0);
      const lateralExitDrift = (windDir * windDriftDist * 1.4) + (Math.random() - 0.5) * 90;
      const p3 = {
        x: p2.x + lateralExitDrift,
        y: p2.y + fallDistY
      };

      // 4. Thời lượng bay (Duration): 3.2s đến 5.2s cho chuyển động chậm rãi, hữu cơ
      const baseDurationMs = (role === 'lead' ? 3400 : 4200) + Math.random() * 1100;
      const durationSeconds = baseDurationMs / 1000;

      // 5. CẤU HÌNH XOAY 3D & LƯỢN SÓNG KHÍ ĐỘNG HỌC (3D TUMBLING & FLUTTER)
      // - Roll (xoay quanh trục Y): lật mặt hoa
      // - Pitch (xoay quanh trục X): gập cánh xuôi theo gió
      // - Yaw (xoay quanh trục Z): lắc lư hình con lắc
      const initialRotZ = Math.random() * 360;
      const initialRotX = (Math.random() - 0.5) * 50;
      const initialRotY = (Math.random() - 0.5) * 50;

      // Số vòng lộn nhào 3D (Tumbling Flips) trong suốt chuyến bay:
      // Không quay tít mù như quạt, chỉ lật nhẹ 1-2 lần rồi ổn định
      const flipTurnsX = (Math.random() < 0.5 ? 1 : -1) * (0.8 + Math.random() * 1.4);
      const flipSpeedY = (Math.random() < 0.5 ? 1 : -1) * (1.2 + Math.random() * 1.8);

      // Tần số chao đảo ngang (Vortex shedding frequency)
      const flutterFreq = 2.4 + Math.random() * 2.2;
      const flutterAmpX = 14 + Math.random() * 18;
      const flutterAmpY = 6 + Math.random() * 10;
      const phaseOffset = Math.random() * Math.PI * 2;

      // 6. TẠO CÁC PHẦN TỬ DOM VỚI TỐI ƯU HÓA GPU
      const petalEl = document.createElement('div');
      petalEl.className = 'engine-petal';
      petalEl.style.width = petalW + 'px';
      petalEl.style.height = petalH + 'px';

      const innerEl = document.createElement('div');
      innerEl.className = 'engine-petal-inner';

      const imgEl = document.createElement('img');
      imgEl.className = 'engine-petal-img';
      imgEl.src = sprite.src;
      imgEl.alt = sprite.description;
      imgEl.draggable = false;

      innerEl.appendChild(imgEl);
      petalEl.appendChild(innerEl);
      this.layerEl.appendChild(petalEl);

      // 7. ĐÓNG GÓI OBJECT CÁNH HOA VÀO HỆ THỐNG VẬT LÝ
      const petalObj = {
        el: petalEl,
        innerEl: innerEl,
        sprite: sprite,
        width: petalW,
        height: petalH,
        p0,
        p1,
        p2,
        p3,
        startTime: performance.now(),
        durationMs: baseDurationMs,
        durationSec: durationSeconds,
        // Các biến trạng thái 3D
        rotZ: initialRotZ,
        rotX: initialRotX,
        rotY: initialRotY,
        flipTurnsX: flipTurnsX,
        flipSpeedY: flipSpeedY,
        flutterFreq: flutterFreq,
        flutterAmpX: flutterAmpX,
        flutterAmpY: flutterAmpY,
        phase: phaseOffset,
        baseScale: scaleRandom,
        // Độ sâu 3D (Z-depth)
        depthZ: 0.85 + Math.random() * 0.35,
        role: role
      };

      this.activePetals.push(petalObj);
      this.ensurePhysicsLoop();
    }

    // --- Tạo đốm sáng sương mai / phấn hoa tại điểm hất ---
    createSparkles(x, y, count = 4) {
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'petal-sparkle-dot';
        this.layerEl.appendChild(dot);

        this.activeSparkles.push({
          el: dot,
          x: x + (Math.random() - 0.5) * 24,
          y: y + (Math.random() - 0.5) * 24,
          vx: (Math.random() - 0.5) * 1.6,
          vy: -0.8 - Math.random() * 1.4,
          life: 0,
          maxLife: 24 + Math.random() * 20
        });
      }
    }

    // ============================================================
    // VÒNG LẶP VẬT LÝ HỌC CHÍNH (60FPS RAF LOOP)
    // ============================================================
    ensurePhysicsLoop() {
      if (!this.isLoopRunning && (this.activePetals.length > 0 || this.activeSparkles.length > 0)) {
        this.isLoopRunning = true;
        this.lastFrameTime = performance.now();
        requestAnimationFrame((now) => this.renderLoop(now));
      }
    }

    renderLoop(currentTime) {
      if (!this.isLoopRunning) return;

      const dt = Math.min((currentTime - this.lastFrameTime) / 1000, 0.05);
      this.lastFrameTime = currentTime;

      // 1. CẬP NHẬT ĐỐM SÁNG NẮNG / SƯƠNG MAI (SPARKLES)
      for (let i = this.activeSparkles.length - 1; i >= 0; i--) {
        const sp = this.activeSparkles[i];
        sp.life++;
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.04; // Trọng lực nhẹ

        const progress = sp.life / sp.maxLife;
        const scale = Math.sin(progress * Math.PI) * 1.4;
        const opacity = Math.sin(progress * Math.PI);

        sp.el.style.transform = `translate3d(${sp.x.toFixed(1)}px, ${sp.y.toFixed(1)}px, 0) scale(${scale.toFixed(2)})`;
        sp.el.style.opacity = opacity.toFixed(3);

        if (sp.life >= sp.maxLife) {
          sp.el.remove();
          this.activeSparkles.splice(i, 1);
        }
      }

      // 2. CẬP NHẬT TỪNG CÁNH HOA ĐẬU BIẾC (PETAL DYNAMICS)
      for (let i = this.activePetals.length - 1; i >= 0; i--) {
        const p = this.activePetals[i];
        const elapsed = currentTime - p.startTime;
        const rawProgress = Math.max(0, Math.min(1, elapsed / p.durationMs));

        // ------------------------------------------------------------
        // BIẾN ĐỔI THỜI GIAN THEO LỰC CẢN KHÔNG KHÍ (AERODYNAMIC DRAG EASING)
        // Ban đầu phóng rất nhanh (quán tính tay hất), sau đó giảm tốc
        // tự nhiên khi gặp lực cản không khí, cuối cùng trôi dạt êm đềm
        // ------------------------------------------------------------
        // Hàm easing mô phỏng chính xác phương trình vi phân cản v^2:
        const tCurve = 1 - Math.pow(1 - rawProgress, 2.15);

        // Lấy tọa độ và tiếp tuyến tức thời trên đường cong Bézier 3D
        const sample = SplineCurve.cubicBezier(p.p0, p.p1, p.p2, p.p3, tCurve);

        // ------------------------------------------------------------
        // CHAO ĐẢO SÓNG KHÍ & DRIFT TRÁI/PHẢI (AERODYNAMIC FLUTTER)
        // Cánh hoa là một vật thể mỏng nhẹ, luôn lắc lư sang hai bên
        // ------------------------------------------------------------
        const flightTime = elapsed / 1000;
        const flutterProgress = 0.35 + 0.65 * rawProgress; // Càng về sau càng trôi dạt rõ
        const flutterX = Math.sin(flightTime * p.flutterFreq + p.phase) * (p.flutterAmpX * flutterProgress);
        const flutterY = Math.cos(flightTime * (p.flutterFreq * 1.3) + p.phase) * (p.flutterAmpY * flutterProgress);

        const currentX = sample.x + flutterX;
        const currentY = sample.y + flutterY;

        // ------------------------------------------------------------
        // TÍNH TOÁN GÓC XOAY 3D (PITCH, ROLL, YAW)
        // ------------------------------------------------------------
        // Tiếp tuyến hướng bay
        const headingRad = Math.atan2(sample.dy, sample.dx);
        const headingDeg = headingRad * (180 / Math.PI);

        // Giảm tốc độ xoay khi về cuối animation ("Cuối animation: cánh hoa giảm tốc, xoay nhẹ")
        const spinDamping = Math.max(0.18, 1 - Math.pow(rawProgress, 1.4));

        // Yaw (Z-axis): Hướng theo đầu mũi cánh hoa + con lắc đung đưa
        const swayZ = Math.sin(flightTime * p.flutterFreq + p.phase) * (18 * spinDamping);
        const currentRotZ = p.rotZ + headingDeg * 0.35 + swayZ;

        // Pitch (X-axis): Lộn nhào 3D quanh trục ngang (cánh lật úp / ngửa đón nắng)
        const currentRotX = p.rotX + (p.flipTurnsX * 360 * Math.pow(tCurve, 0.85)) + Math.sin(flightTime * 3) * (12 * spinDamping);

        // Roll (Y-axis): Nghiêng mạn thuyền đón gió
        const currentRotY = p.rotY + Math.sin(flightTime * p.flipSpeedY + p.phase) * (32 * spinDamping);

        // ------------------------------------------------------------
        // QUANG HỌC: ĐỘ SÁNG THAY ĐỔI THEO GÓC ÁNH NẮNG CHIẾU VÀO CÁNH
        // Khi cánh hoa lật mặt đón nắng sớm, giọt sương và thớ vân sáng bừng lên
        // ------------------------------------------------------------
        const sunDot = Math.cos((currentRotX * Math.PI) / 180) * Math.cos((currentRotY * Math.PI) / 180);
        const dynamicBrightness = 0.94 + 0.14 * Math.max(0, sunDot);

        // ------------------------------------------------------------
        // CUỐI ANIMATION: GIẢM TỐC, GIẢM OPACITY VÀ BIẾN MẤT ÊM ÁI
        // ------------------------------------------------------------
        let opacity = 1.0;
        // Bắt đầu hiện êm trong 6% đầu
        if (rawProgress < 0.06) {
          opacity = Math.sin((rawProgress / 0.06) * (Math.PI * 0.5));
        }
        // Giảm opacity mềm mại trong 25% cuối vòng đời (Cosine fade-out)
        else if (rawProgress > 0.75) {
          const fadeProgress = (rawProgress - 0.75) / 0.25;
          opacity = Math.cos(fadeProgress * (Math.PI * 0.5));
        }

        // Kích thước co giãn tự nhiên theo nhịp thở không khí
        const breatheScale = p.baseScale * (1 + 0.06 * Math.sin(rawProgress * Math.PI));

        // ------------------------------------------------------------
        // ÁP DỤNG BIẾN ĐỔI 3D LÊN DOM (HARDWARE ACCELERATED)
        // ------------------------------------------------------------
        const posX = (currentX - p.width * 0.5).toFixed(1);
        const posY = (currentY - p.height * 0.5).toFixed(1);

        p.el.style.transform = `translate3d(${posX}px, ${posY}px, 0) scale(${breatheScale.toFixed(3)}) rotateZ(${currentRotZ.toFixed(1)}deg) rotateX(${currentRotX.toFixed(1)}deg) rotateY(${currentRotY.toFixed(1)}deg)`;
        p.innerEl.style.filter = `drop-shadow(0 ${(10 + 10 * tCurve).toFixed(1)}px ${(18 + 8 * tCurve).toFixed(1)}px rgba(15, 23, 42, 0.28)) drop-shadow(0 2px 6px rgba(30, 58, 138, 0.20)) brightness(${dynamicBrightness.toFixed(2)})`;
        p.el.style.opacity = Math.max(0, Math.min(1, opacity)).toFixed(3);

        // Khi kết thúc hành trình: Xóa bỏ hoàn toàn khỏi DOM để không rò rỉ bộ nhớ
        if (rawProgress >= 1.0) {
          p.el.remove();
          this.activePetals.splice(i, 1);
        }
      }

      // Tiếp tục vòng lặp nếu còn cánh hoa hoặc đốm sáng đang bay
      if (this.activePetals.length > 0 || this.activeSparkles.length > 0) {
        requestAnimationFrame((now) => this.renderLoop(now));
      } else {
        this.isLoopRunning = false;
      }
    }

    // --- Hủy bỏ dọn dẹp tài nguyên khi cần ---
    destroy() {
      if (this.ambientTimer) {
        clearTimeout(this.ambientTimer);
        this.ambientTimer = null;
      }
      this.activePetals.forEach(p => p.el && p.el.remove());
      this.activePetals = [];
      this.activeSparkles.forEach(s => s.el && s.el.remove());
      this.activeSparkles = [];
      this.isLoopRunning = false;
      if (this.layerEl) {
        this.layerEl.remove();
        this.layerEl = null;
      }
    }
  }

  // Khởi tạo và gán toàn cục
  window.PetalEngine = PetalEngine;

  // Tự động khởi tạo instance mặc định khi DOM sẵn sàng
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.petalEngine) {
      window.petalEngine = new PetalEngine();
    }
  });

})(window, document);
