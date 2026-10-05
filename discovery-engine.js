/**
 * ============================================================
 * BUTTERFLY PEA DISCOVERY ENGINE (TIẾN TRÌNH KHÁM PHÁ CHAPTER)
 * ============================================================
 * 
 * Hệ thống tiến trình khám phá tinh tế & thi vị:
 * 1. Ghi nhận 5 sản phẩm: SERUM, CREAM, TONER, ESSENCE, LIP BALM.
 * 2. Tuyệt đối không hiển thị popup kiểu game hay achievement.
 * 3. Mỗi sản phẩm được khám phá để lại 1 cành hoa trong background:
 *    - SERUM    → 1 cành vươn góc trên bên trái
 *    - CREAM    → 1 cành đọng trên dải lụa góc dưới bên trái
 *    - TONER    → 1 cành uốn lượn đón nắng trên đỉnh vòm
 *    - ESSENCE  → 1 cành che chở góc trên bên phải
 *    - LIP BALM → 1 cành đọng thanh nhã bên khay cẩm thạch góc dưới bên phải
 * 4. Khi người dùng khám phá toàn bộ các chức năng của chapter:
 *    - Các cành hoa đã mở khóa sẽ xuất hiện lại.
 *    - Từng cành bay vào màn hình từ các hướng khác nhau.
 *    - Cành hoa chuyển động uốn lượn và có secondary motion (lá rung, hoa nhung,
 *      nụ đung đưa, thân uốn dẻo, bụi sáng & cánh hoa rơi rụng).
 *    - Tất cả từ từ hội tụ ở trung tâm khung cảnh.
 *    - Các cành hòa quyện kết hợp thành một BÓ HOA ĐẬU BIẾC HOÀN CHỈNH.
 *    - Ánh sáng xanh đậu biếc và vàng champagne xuất hiện nhẹ nhàng.
 *    - Một vài cánh hoa bay xung quanh lơ lửng trong gió.
 *    - KHÔNG hiển thị achievement - để người dùng tự nhận ra khu vườn đã thay đổi!
 * ============================================================
 */

(function (window, document) {
  'use strict';

  const STORAGE_KEY = 'c1m_discovery_progress_v2';

  // Danh mục 5 sản phẩm tương ứng với 5 cành hoa trong background & quỹ đạo hội tụ
  const PRODUCT_SPECS = {
    serum: {
      id: 'serum',
      name: 'Rejuvenating Serum',
      role: 'KÝ ỨC',
      sprite: 'assets/images/falling_branches/branch_1.png',
      className: 'discovery-branch-serum',
      aspect: 406 / 277,
      baseWidthRel: 0.26,
      // Vị trí nghỉ ngơi tĩnh trong background
      restAngle: -8,
      startRel: { x: 0.14, y: 0.28 },
      // Quỹ đạo bay vào từ ngoài màn hình (Top-Left)
      flight: {
        entryRel: { x: -0.16, y: 0.10 },     // Mép ngoài trên bên trái
        cp1Rel: { x: 0.14, y: 0.36 },       // Vòng uốn qua góc trái
        cp2Rel: { x: 0.32, y: 0.24 },       // Lượn võng đón gió
        targetOffset: { x: -24, y: -6 },    // Cánh trái trên của bó hoa
        targetAngle: -50,
        flipX: false,
        staggerDelay: 0,
        duration: 3400,
        undulationFreq: 3.4,
        undulationAmp: 48
      }
    },
    cream: {
      id: 'cream',
      name: 'Radiance Cream',
      role: 'DÒNG THỜI GIAN',
      sprite: 'assets/images/falling_branches/branch_2.png',
      className: 'discovery-branch-cream',
      aspect: 279 / 369,
      baseWidthRel: 0.22,
      restAngle: 11,
      startRel: { x: 0.16, y: 0.70 },
      // Quỹ đạo bay vào từ ngoài màn hình (Bottom-Left)
      flight: {
        entryRel: { x: -0.14, y: 0.88 },     // Mép ngoài dưới bên trái
        cp1Rel: { x: 0.12, y: 0.70 },       // Lượn là đà trên dải lụa
        cp2Rel: { x: 0.30, y: 0.54 },       // Bốc vút lên theo chiều gió
        targetOffset: { x: -16, y: 14 },     // Cánh trái dưới của bó hoa
        targetAngle: -22,
        flipX: false,
        staggerDelay: 420,
        duration: 3300,
        undulationFreq: 3.8,
        undulationAmp: 44
      }
    },
    toner: {
      id: 'toner',
      name: 'Hydrating Toner',
      role: 'LỜI NHẮN',
      sprite: 'assets/images/falling_branches/branch_3.png',
      className: 'discovery-branch-toner',
      aspect: 281 / 261,
      baseWidthRel: 0.23,
      restAngle: -2,
      startRel: { x: 0.55, y: 0.12 },
      // Quỹ đạo bay vào từ đỉnh vòm trên cao (Top-Center)
      flight: {
        entryRel: { x: 0.50, y: -0.20 },     // Đỉnh vòm trên cao ngoài khung hình
        cp1Rel: { x: 0.42, y: 0.10 },       // Uốn lượn đón ánh nắng mai
        cp2Rel: { x: 0.55, y: 0.24 },       // Chao cánh hoa hạ dần xuống tâm
        targetOffset: { x: 0, y: -18 },      // Vương miện đỉnh trung tâm bó hoa
        targetAngle: 0,
        flipX: false,
        staggerDelay: 840,
        duration: 3200,
        undulationFreq: 4.0,
        undulationAmp: 40
      }
    },
    essence: {
      id: 'essence',
      name: 'Soothing Essence',
      role: 'HƯƠNG KỶ NIỆM',
      sprite: 'assets/images/falling_branches/branch_1.png',
      className: 'discovery-branch-essence',
      aspect: 406 / 277,
      baseWidthRel: 0.25,
      restAngle: 16,
      startRel: { x: 0.85, y: 0.23 },
      // Quỹ đạo bay vào từ ngoài màn hình (Top-Right)
      flight: {
        entryRel: { x: 1.16, y: 0.14 },      // Mép ngoài trên bên phải
        cp1Rel: { x: 0.86, y: 0.38 },       // Vòng uốn qua góc phải
        cp2Rel: { x: 0.68, y: 0.25 },       // Lượn chéo vào tâm
        targetOffset: { x: 24, y: -6 },     // Cánh phải trên của bó hoa
        targetAngle: 50,
        flipX: true,
        staggerDelay: 1260,
        duration: 3400,
        undulationFreq: 3.5,
        undulationAmp: 48
      }
    },
    lipbalm: {
      id: 'lipbalm',
      name: 'Lip Balm Nourish & Glow',
      role: 'LỜI HẸN',
      sprite: 'assets/images/falling_branches/branch_2.png',
      className: 'discovery-branch-lipbalm',
      aspect: 279 / 369,
      baseWidthRel: 0.21,
      restAngle: -22,
      startRel: { x: 0.85, y: 0.73 },
      // Quỹ đạo bay vào từ ngoài màn hình (Bottom-Right)
      flight: {
        entryRel: { x: 1.14, y: 0.84 },      // Mép ngoài dưới bên phải
        cp1Rel: { x: 0.88, y: 0.68 },       // Lượn qua khay cẩm thạch
        cp2Rel: { x: 0.70, y: 0.52 },       // Cuộn bốc lên hướng vào tâm
        targetOffset: { x: 16, y: 14 },     // Cánh phải dưới của bó hoa
        targetAngle: 22,
        flipX: true,
        staggerDelay: 1680,
        duration: 3300,
        undulationFreq: 3.7,
        undulationAmp: 44
      }
    }
  };

  const ALL_PRODUCT_KEYS = ['serum', 'cream', 'toner', 'essence', 'lipbalm'];

  // --- ÂM THANH THIÊN HÀ HÒA QUYỆN (WEB AUDIO HARMONIC CHORD) ---
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => { });
    }
    return audioCtx;
  }

  // Tiếng chùm chuông gió ngân nga êm ái khi các cành hoa bắt đầu hội tụ
  function playCelestialConvergenceChord() {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;

      const freqs = [329.63, 440.00, 554.37, 659.25, 880.00]; // E maj9 chord (ấm áp, thi vị)
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, ctx.currentTime);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.16);

        const startTime = ctx.currentTime + idx * 0.16;
        const dur = 4.2;

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.018, startTime + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur + 0.1);
      });
    } catch (_) { }
  }

  // Tiếng chuông ngọc pha lê khi bó hoa hoàn chỉnh nở rộ
  function playBouquetBloomChime() {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;

      const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C maj crystalline bloom chord
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

        const startTime = ctx.currentTime + idx * 0.07;
        const dur = 4.8;

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.024, startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur + 0.1);
      });
    } catch (_) { }
  }

  // Tiếng rung cánh hoa êm ái khi chạm vào bó hoa
  function playSoftFloralTouchTone() {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.0);
    } catch (_) { }
  }

  // ============================================================
  // LỚP ĐIỀU KHIỂN CHÍNH: DISCOVERY ENGINE
  // ============================================================
  class DiscoveryEngine {
    constructor() {
      this.state = this.loadState();
      this.container = null;
      this.branchesLayer = null;
      this.centerpieceBouquet = null;
      this.bouquetRadiance = null;
      this.branchElements = {};
      this.activeFlyingBranches = [];
      this.isConverging = false;
      this.pendingFinale = false;
      this.flightRafId = null;
      this.ambientPetalTimer = null;

      this.init();
    }

    loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            discovered: Object.assign({
              serum: false,
              cream: false,
              toner: false,
              essence: false,
              lipbalm: false
            }, parsed.discovered || {}),
            finaleCompleted: !!parsed.finaleCompleted
          };
        }
      } catch (_) { }

      return {
        discovered: {
          serum: false,
          cream: false,
          toner: false,
          essence: false,
          lipbalm: false
        },
        finaleCompleted: false
      };
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (_) { }
    }

    init() {
      this.container = document.getElementById('livingFrame') ||
        document.querySelector('.living-frame') ||
        document.querySelector('.living-scene-wrapper');

      if (!this.container) {
        setTimeout(() => this.init(), 100);
        return;
      }

      // Xóa sạch bộ nhớ cũ và các phần tử hoa thừa trong DOM
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}

      ['discoveryCenterpieceBouquet', 'bouquetAmbientRadiance', 'discoveryBranchesLayer'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });

      this.buildBranchesLayer();
      this.buildBouquetCenterpiece();
      this.renderCurrentState();
    }

    // --- 1. Đã tắt toàn bộ cành hoa background theo yêu cầu ---
    buildBranchesLayer() {
      const layer = document.getElementById('discoveryBranchesLayer');
      if (layer) layer.remove();
      this.branchesLayer = null;
    }

    // --- 2. Đã tắt toàn bộ bó hoa trung tâm theo yêu cầu ---
    buildBouquetCenterpiece() {
      const c = document.getElementById('discoveryCenterpieceBouquet');
      if (c) c.remove();
      const r = document.getElementById('bouquetAmbientRadiance');
      if (r) r.remove();
      this.centerpieceBouquet = null;
      this.bouquetRadiance = null;
    }

    // --- 3. Không hiển thị bất kỳ bó hoa hay cành hoa nào ---
    renderCurrentState() {
      ['discoveryCenterpieceBouquet', 'bouquetAmbientRadiance', 'discoveryBranchesLayer'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    }

    // --- 4. Ghi nhận khi một sản phẩm được khám phá ---
    onProductDiscovered(rawId) {
      if (!rawId) return;

      let pId = String(rawId).toLowerCase().trim();
      if (pId === 'liptube') pId = 'lipbalm';

      if (!PRODUCT_SPECS[pId]) return;

      const isNew = !this.state.discovered[pId];
      this.state.discovered[pId] = true;
      this.saveState();

      // Hiển thị cành hoa trong background
      const branchEl = this.branchElements[pId];
      if (branchEl) {
        branchEl.classList.add('discovered');
        if (isNew) {
          branchEl.classList.add('sprouting');
          setTimeout(() => {
            branchEl.classList.remove('sprouting');
          }, 2000);

          // Tạo vài bụi sáng quanh cành mới nhú
          if (window.branchEngine && typeof window.branchEngine.spawnSparkle === 'function') {
            const rect = branchEl.getBoundingClientRect();
            for (let i = 0; i < 4; i++) {
              setTimeout(() => {
                const rx = rect.left + rect.width * (0.2 + Math.random() * 0.6);
                const ry = rect.top + rect.height * (0.2 + Math.random() * 0.6);
                window.branchEngine.spawnSparkle(rx, ry);
              }, i * 150);
            }
          }
        }
      }

      // Kiểm tra xem đã đủ tất cả 5 chức năng chưa
      this.checkAllDiscovered();
    }

    recordDiscovery(productId) {
      this.onProductDiscovered(productId);
    }

    // --- 5. Kiểm tra điều kiện hoàn thành chapter ---
    checkAllDiscovered() {
      const allDone = ALL_PRODUCT_KEYS.every((k) => !!this.state.discovered[k]);
      if (!allDone) return false;

      // Nếu finale đã diễn ra xong rồi thì giữ nguyên hiện trường
      if (this.state.finaleCompleted) return true;

      // Nếu đang có một modal/chuỗi ký ức đang mở (người dùng đang đọc thư/ký ức):
      // Đợi người dùng đọc xong và đóng modal rồi mới bắt đầu hội tụ!
      if (this.isAnyModalOpen()) {
        this.pendingFinale = true;
        return true;
      }

      // Kích hoạt nhẹ nhàng sau 1.1s
      this.scheduleGrandConvergence(1100);
      return true;
    }

    onSequenceClosed(productId) {
      if (this.pendingFinale || ALL_PRODUCT_KEYS.every((k) => !!this.state.discovered[k])) {
        if (!this.state.finaleCompleted && !this.isConverging) {
          this.pendingFinale = false;
          this.scheduleGrandConvergence(950);
        }
      }
    }

    isAnyModalOpen() {
      return !!document.querySelector(
        '#serumMemoryModal, #creamMilestoneModal, #creamTimelineContainer, #tonerMessageModal, #lipbalmPromiseModal, #productWorldModal, .modal.active, .serum-memory-modal, .toner-message-modal, .lipbalm-promise-modal'
      );
    }

    scheduleGrandConvergence(delayMs = 1000) {
      if (this.isConverging || this.state.finaleCompleted) return;
      this.isConverging = true;

      setTimeout(() => {
        if (this.isAnyModalOpen()) {
          this.isConverging = false;
          this.pendingFinale = true;
          return;
        }
        this.triggerGrandConvergence();
      }, delayMs);
    }

    // ============================================================
    // 6. ĐẠI HỘI TỤ (GRAND CONVERGENCE):
    //    - Các cành hoa đã mở khóa xuất hiện lại
    //    - Từng cành bay vào màn hình từ các hướng khác nhau
    //    - Chuyển động uốn lượn và có secondary motion
    //    - Tất cả từ từ hội tụ ở trung tâm
    //    - Kết hợp thành bó hoa hoàn chỉnh
    //    - Ánh sáng xanh & vàng champagne xuất hiện nhẹ
    //    - Một vài cánh hoa bay xung quanh
    //    - KHÔNG hiển thị achievement!
    // ============================================================
    triggerGrandConvergence() {
      playCelestialConvergenceChord();
      this.state.finaleCompleted = true;
      this.saveState();
      this.isConverging = false;
      return;
      const centerY = fRect.height * 0.40;

      // 1. Tạm ẩn cành hoa tĩnh trong background với hiệu ứng tan nhẹ
      ALL_PRODUCT_KEYS.forEach((key) => {
        const el = this.branchElements[key];
        if (el) {
          el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          el.style.opacity = '0';
          el.style.transform = 'scale(0.92)';
        }
      });

      // 2. Dọn dẹp các cành bay cũ nếu có
      this.clearActiveFlyingBranches();

      // 3. Khởi tạo 5 thực thể cành hoa bay khí động học hoàn chỉnh (Botanical Objects)
      const now = performance.now();
      const isMobile = window.innerWidth < 768;

      ALL_PRODUCT_KEYS.forEach((key, index) => {
        const spec = PRODUCT_SPECS[key];
        const fl = spec.flight;

        // Tọa độ xuất phát ngoài màn hình (từ các hướng khác nhau)
        const startX = fRect.width * fl.entryRel.x;
        const startY = fRect.height * fl.entryRel.y;

        // Điểm kiểm soát Bézier 1 & 2 tạo đường cong uốn lượn
        const cp1X = fRect.width * fl.cp1Rel.x;
        const cp1Y = fRect.height * fl.cp1Rel.y;
        const cp2X = fRect.width * fl.cp2Rel.x;
        const cp2Y = fRect.height * fl.cp2Rel.y;

        // Điểm đích tại trung tâm bó hoa
        const endX = centerX + fl.targetOffset.x;
        const endY = centerY + fl.targetOffset.y;

        // Kích thước cành hoa tỉ lệ
        const width = Math.round(fRect.width * spec.baseWidthRel * (isMobile ? 0.9 : 1.0));
        const height = Math.round(width / spec.aspect);

        // Tạo cấu trúc DOM phân cấp với Secondary Motion nodes
        const flyingEl = document.createElement('div');
        flyingEl.className = 'convergence-flying-branch';
        flyingEl.style.width = width + 'px';
        flyingEl.style.height = height + 'px';
        flyingEl.style.opacity = '0';

        const blurWrap = document.createElement('div');
        blurWrap.className = 'branch-blur-wrapper';

        const stemFlex = document.createElement('div');
        stemFlex.className = 'branch-stem-flex';

        const compositeBody = document.createElement('div');
        compositeBody.className = 'branch-composite-body';

        const img = document.createElement('img');
        img.src = spec.sprite;
        img.className = 'branch-base-img';
        img.alt = `Cành hoa ${spec.name}`;

        // Node rung cánh hoa (Secondary motion 1)
        const blossomFlutter = document.createElement('div');
        blossomFlutter.className = 'branch-blossom-flutter-zone';
        blossomFlutter.style.left = '45%';
        blossomFlutter.style.top = '40%';
        blossomFlutter.style.width = '30%';
        blossomFlutter.style.height = '30%';

        // Node rung lá chét (Secondary motion 2)
        const leafFlutter = document.createElement('div');
        leafFlutter.className = 'branch-leaf-flutter-zone';
        leafFlutter.style.left = '30%';
        leafFlutter.style.top = '55%';
        leafFlutter.style.width = '32%';
        leafFlutter.style.height = '32%';

        // Node nụ hoa đung đưa (Secondary motion 3)
        const budNode = document.createElement('div');
        budNode.className = 'branch-bud-node';
        budNode.style.left = '65%';
        budNode.style.top = '30%';
        budNode.style.width = '18%';
        budNode.style.height = '18%';

        compositeBody.appendChild(img);
        compositeBody.appendChild(blossomFlutter);
        compositeBody.appendChild(leafFlutter);
        compositeBody.appendChild(budNode);
        stemFlex.appendChild(compositeBody);
        blurWrap.appendChild(stemFlex);
        flyingEl.appendChild(blurWrap);
        this.branchesLayer.appendChild(flyingEl);

        const branchData = {
          id: key,
          el: flyingEl,
          stemFlex: stemFlex,
          leafFlutter: leafFlutter,
          blossomFlutter: blossomFlutter,
          budNode: budNode,
          spec: spec,
          flight: fl,
          p0: { x: startX, y: startY },
          p1: { x: cp1X, y: cp1Y },
          p2: { x: cp2X, y: cp2Y },
          p3: { x: endX, y: endY },
          startTime: now + fl.staggerDelay,
          duration: fl.duration,
          prevX: startX,
          prevY: startY,
          seed: Math.random() * 10,
          petalDetached: false,
          sparkleCooldown: 0,
          isFinished: false
        };

        this.activeFlyingBranches.push(branchData);
      });

      // 4. Khởi động vòng lặp khí động học 60FPS
      this.startFlightPhysicsLoop();
    }

    // --- Vòng lặp tính toán vật lý chuyển động uốn lượn & secondary motion ---
    startFlightPhysicsLoop() {
      if (this.flightRafId) {
        cancelAnimationFrame(this.flightRafId);
      }

      const fRect = this.container.getBoundingClientRect();

      const updateFrame = (now) => {
        let allCompleted = true;

        for (let i = 0; i < this.activeFlyingBranches.length; i++) {
          const br = this.activeFlyingBranches[i];
          const elapsed = now - br.startTime;

          // Chưa tới thời điểm xuất phát (stagger delay)
          if (elapsed < 0) {
            allCompleted = false;
            br.el.style.opacity = '0';
            continue;
          }

          br.el.style.opacity = '1';

          const rawProgress = Math.min(1, Math.max(0, elapsed / br.duration));
          if (rawProgress < 1) {
            allCompleted = false;
          }

          // Hàm giảm tốc êm ái khi về đích (Cubic ease out cushion)
          const u = 1 - Math.pow(1 - rawProgress, 3);

          // 1. Tọa độ Bézier bậc 3 cơ bản
          const bx = Math.pow(1 - u, 3) * br.p0.x +
            3 * Math.pow(1 - u, 2) * u * br.p1.x +
            3 * (1 - u) * u * u * br.p2.x +
            Math.pow(u, 3) * br.p3.x;

          const by = Math.pow(1 - u, 3) * br.p0.y +
            3 * Math.pow(1 - u, 2) * u * br.p1.y +
            3 * (1 - u) * u * u * br.p2.y +
            Math.pow(u, 3) * br.p3.y;

          // 2. Vector tiếp tuyến đạo hàm (Tangent Vector)
          const dx = 3 * Math.pow(1 - u, 2) * (br.p1.x - br.p0.x) +
            6 * (1 - u) * u * (br.p2.x - br.p1.x) +
            3 * u * u * (br.p3.x - br.p2.x);

          const dy = 3 * Math.pow(1 - u, 2) * (br.p1.y - br.p0.y) +
            6 * (1 - u) * u * (br.p2.y - br.p1.y) +
            3 * u * u * (br.p3.y - br.p2.y);

          const tLen = Math.hypot(dx, dy) || 1;
          const nx = -dy / tLen; // Pháp tuyến trực giao
          const ny = dx / tLen;

          // 3. Dao động sóng hình sin uốn lượn tự nhiên (Harmonic Undulating Wave)
          // Biên độ sóng lớn lúc giữa chặng, triệt tiêu dần khi hạ cánh vào bó hoa
          const waveEnvelope = Math.sin(Math.PI * Math.min(1, u * 1.25)) * (1 - u * 0.82);
          const waveOffset = Math.sin(u * br.flight.undulationFreq * Math.PI * 2 + br.seed) *
            br.flight.undulationAmp * waveEnvelope;

          const curX = bx + nx * waveOffset;
          const curY = by + ny * waveOffset;

          // Vận tốc tức thời
          const vx = curX - br.prevX;
          const vy = curY - br.prevY;
          br.prevX = curX;
          br.prevY = curY;
          const speed = Math.hypot(vx, vy);

          // 4. Góc quay khí động học (Yaw Z):
          // Khi bay nhanh bám theo tiếp tuyến; khi về gần tâm thì chuyển mượt sang thế bó hoa
          const tangentHeading = Math.atan2(vy, vx) * (180 / Math.PI);
          const flipSign = br.flight.flipX ? -1 : 1;
          const adjustedHeading = br.flight.flipX ? (tangentHeading + 180) : tangentHeading;

          const blendToTarget = Math.pow(u, 2.2);
          const currentYaw = (1 - blendToTarget) * adjustedHeading + blendToTarget * br.flight.targetAngle;

          // 5. Nghiêng 3D (Roll Y banking vào cua)
          const rollY = Math.sin(u * br.flight.undulationFreq * Math.PI * 2 + br.seed) * 24 * (1 - u);

          // 6. Uốn dẻo thân cây (Stem Flex Skew X)
          const stemSkew = -Math.sin(u * br.flight.undulationFreq * Math.PI * 2 + br.seed) * 8 * (1 - u) * flipSign;
          br.stemFlex.style.transform = `skewX(${stemSkew.toFixed(1)}deg)`;

          // 7. SECONDARY MOTION:
          // (a) Lá rung nhẹ tần số cao (Leaf micro-flutter)
          const leafRot = Math.sin(now * 0.038 + br.seed) * (1.8 + Math.min(2.8, speed * 0.22));
          br.leafFlutter.style.transform = `rotate(${leafRot.toFixed(1)}deg) scale(${(1 + Math.sin(now * 0.02) * 0.04).toFixed(3)})`;

          // (b) Cánh hoa nhung mượt rung dịu êm (Blossom velvet tremor)
          const blossomRot = Math.cos(now * 0.028 + br.seed) * (1.4 + Math.min(2.0, speed * 0.16));
          br.blossomFlutter.style.transform = `rotate(${blossomRot.toFixed(1)}deg)`;

          // (c) Nụ hoa dao động quán tính (Bud inertia sway)
          const budRot = Math.sin(now * 0.032 + br.seed) * 2.2;
          br.budNode.style.transform = `rotate(${budRot.toFixed(1)}deg)`;

          // 8. Tách cánh hoa lơ lửng giữa đường bay (Detached Petal)
          if (!br.petalDetached && u >= 0.48 && u <= 0.65) {
            br.petalDetached = true;
            if (window.branchEngine && typeof window.branchEngine.spawnDetachedPetal === 'function') {
              window.branchEngine.spawnDetachedPetal(
                fRect.left + curX,
                fRect.top + curY,
                vx * 0.5,
                vy * 0.5 + 0.8
              );
            }
          }

          // 9. Bụi sáng lấp lánh dọc đường bay (Sparkle Trails)
          br.sparkleCooldown++;
          if (br.sparkleCooldown % 14 === 0 && speed > 1.2) {
            if (window.branchEngine && typeof window.branchEngine.spawnSparkle === 'function') {
              window.branchEngine.spawnSparkle(
                fRect.left + curX + (Math.random() - 0.5) * 20,
                fRect.top + curY + (Math.random() - 0.5) * 20
              );
            }
          }

          // Áp dụng biến đổi không gian cho cành hoa
          const scale = 0.92 + (1 - u) * 0.08;
          const flipTransform = br.flight.flipX ? ' scaleX(-1)' : '';
          br.el.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0)${flipTransform} rotate(${currentYaw.toFixed(1)}deg) rotateY(${rollY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        }

        if (!allCompleted) {
          this.flightRafId = requestAnimationFrame(updateFrame);
        } else {
          // Khi tất cả 5 cành đã hạ cánh vẹn tròn tại tâm: KẾT HỢP THÀNH BÓ HOA HOÀN CHỈNH!
          this.flightRafId = null;
          this.fuseIntoBouquet();
        }
      };

      this.flightRafId = requestAnimationFrame(updateFrame);
    }

    // --- 7. KẾT HỢP HÒA QUYỆN THÀNH BÓ HOA ĐẬU BIẾC HOÀN CHỈNH ---
    fuseIntoBouquet() {
      playBouquetBloomChime();

      // (a) Ánh sáng xanh đậu biếc & vàng champagne xuất hiện nhẹ nhàng
      if (this.bouquetRadiance) {
        this.bouquetRadiance.classList.add('active');
      }

      // (b) Bó hoa đậu biếc hoàn chỉnh xuất hiện tại trung tâm
      if (this.centerpieceBouquet) {
        this.centerpieceBouquet.classList.add('visible');
      }

      // (c) 5 cành hoa riêng lẻ tan biến mềm mại, hòa quyện trọn vẹn vào bó hoa
      this.activeFlyingBranches.forEach((br) => {
        if (br.el) {
          br.el.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
          br.el.style.opacity = '0';
          br.el.style.transform += ' scale(0.96)';
        }
      });

      setTimeout(() => {
        this.clearActiveFlyingBranches();
      }, 1000);

      // (d) Một vài cánh hoa bay xung quanh lơ lửng trong gió nhẹ
      if (window.petalEngine && typeof window.petalEngine.toss === 'function') {
        const fRect = this.container.getBoundingClientRect();
        window.petalEngine.toss({
          x: fRect.left + fRect.width * 0.50,
          y: fRect.top + fRect.height * 0.40,
          count: 12,
          force: 0.85,
          spread: 0.68
        });
      }

      // (e) Bắt đầu làn gió định kỳ thoảng qua bó hoa
      this.startAmbientGardenBreeze();

      // Lưu trạng thái hoàn thành - KHÔNG hiển thị achievement!
      this.state.finaleCompleted = true;
      this.saveState();
      this.isConverging = false;

      console.log('🌸 [DiscoveryEngine] 5 cành hoa đã hội tụ thành bó hoa hoàn chỉnh. Khu vườn đã chuyển mình thi vị.');
    }

    // Dọn dẹp DOM các cành bay
    clearActiveFlyingBranches() {
      if (this.flightRafId) {
        cancelAnimationFrame(this.flightRafId);
        this.flightRafId = null;
      }
      this.activeFlyingBranches.forEach((br) => {
        if (br.el && br.el.parentNode) {
          br.el.remove();
        }
      });
      this.activeFlyingBranches = [];
    }

    // Gió thoảng định kỳ nuôi dưỡng cánh hoa bay quanh bó hoa
    startAmbientGardenBreeze() {
      if (this.ambientPetalTimer) return;

      const scheduleBreeze = () => {
        this.ambientPetalTimer = setTimeout(() => {
          if (!this.state.finaleCompleted || !this.centerpieceBouquet) return;

          // Thỉnh thoảng tung 2-3 cánh hoa nhẹ nhàng quanh bó hoa
          if (window.petalEngine && typeof window.petalEngine.toss === 'function' && this.container) {
            const fRect = this.container.getBoundingClientRect();
            window.petalEngine.toss({
              x: fRect.left + fRect.width * (0.45 + Math.random() * 0.1),
              y: fRect.top + fRect.height * (0.36 + Math.random() * 0.08),
              count: 3,
              force: 0.55
            });
          }

          scheduleBreeze();
        }, 14000 + Math.random() * 6000);
      };

      scheduleBreeze();
    }

    // Khi người dùng bấm nhẹ vào bó hoa trung tâm: rung cánh & tung vài cánh hoa lãng mạn
    handleBouquetInteraction(e) {
      playSoftFloralTouchTone();

      if (window.petalEngine && typeof window.petalEngine.toss === 'function' && this.container) {
        const fRect = this.container.getBoundingClientRect();
        const clickX = e && e.clientX ? e.clientX : (fRect.left + fRect.width * 0.5);
        const clickY = e && e.clientY ? e.clientY : (fRect.top + fRect.height * 0.4);

        window.petalEngine.toss({
          x: clickX,
          y: clickY,
          count: 5,
          force: 0.8
        });
      }

      // Tạo bụi sáng lấp lánh tại điểm chạm
      if (window.branchEngine && typeof window.branchEngine.spawnSparkle === 'function' && e) {
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            window.branchEngine.spawnSparkle(
              e.clientX + (Math.random() - 0.5) * 24,
              e.clientY + (Math.random() - 0.5) * 24
            );
          }, i * 80);
        }
      }
    }

    // --- 8. Tiện ích: Đặt lại toàn bộ tiến trình để trải nghiệm lại ---
    resetProgress() {
      this.state = {
        discovered: {
          serum: false,
          cream: false,
          toner: false,
          essence: false,
          lipbalm: false
        },
        finaleCompleted: false
      };
      this.saveState();
      this.isConverging = false;
      this.pendingFinale = false;

      this.clearActiveFlyingBranches();

      if (this.ambientPetalTimer) {
        clearTimeout(this.ambientPetalTimer);
        this.ambientPetalTimer = null;
      }

      if (this.centerpieceBouquet) {
        this.centerpieceBouquet.classList.remove('visible');
      }

      if (this.bouquetRadiance) {
        this.bouquetRadiance.classList.remove('active');
      }

      ALL_PRODUCT_KEYS.forEach((key) => {
        const el = this.branchElements[key];
        if (el) {
          el.classList.remove('discovered', 'sprouting');
          el.style.opacity = '0';
          el.style.transform = '';
        }
      });

      console.log('🌸 [DiscoveryEngine] Đã đặt lại toàn bộ tiến trình khám phá.');
    }

    // Mở khóa nhanh cả 5 sản phẩm và kích hoạt hội tụ (tiện cho kiểm thử)
    unlockAll() {
      ALL_PRODUCT_KEYS.forEach((k) => {
        this.state.discovered[k] = true;
      });
      this.state.finaleCompleted = false;
      this.saveState();
      this.renderCurrentState();
      this.scheduleGrandConvergence(400);
    }

    // API truy vấn trạng thái
    getState() {
      return JSON.parse(JSON.stringify(this.state));
    }
  }

  // Khởi tạo Singleton toàn cục
  window.DiscoveryEngine = DiscoveryEngine;

  function initDiscoveryEngine() {
    if (!window.discoveryEngine) {
      window.discoveryEngine = new DiscoveryEngine();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiscoveryEngine);
  } else {
    initDiscoveryEngine();
  }

})(window, document);
