/**
 * ============================================================
 * BUTTERFLY PEA INTERACTION ENGINE (ĐỘNG CƠ TƯƠNG TÁC THỰC THỂ)
 * ============================================================
 * Hệ thống điều phối toàn diện tương tác người dùng:
 * 1. Mouse click (Chuột máy tính).
 * 2. Touch trên điện thoại & máy tính bảng (Cảm ứng đơn điểm & chống xung đột).
 * 3. Swipe gesture (Cử chỉ vuốt tay với quán tính, góc, lực và truyền gió).
 * 4. Pointer movement (Rê chuột tạo gợn phản chiếu, quang học, luồng khí vi mô).
 * 
 * THỨ TỰ TƯƠNG TÁC CHUẨN XÁC:
 * TOUCH
 *   ↓ (0ms - 80ms)
 * OBJECT RESPONSE (Phản ứng nhẹ: nén đàn hồi vi mô, nghiêng theo góc chạm, aura lướt)
 *   ↓ (90ms - 150ms)
 * FLOWER BRANCH (Cành hoa đung đưa hoặc tách nhánh bay lượn ra ngoài)
 *   ↓ (180ms - 240ms)
 * PETALS (Chùm cánh hoa đậu biếc bung nở theo góc & xung lực tương tác)
 *   ↓ (290ms - 370ms)
 * LIGHT / SCENT (Ánh sáng lóa lấp lánh & làn sương hương thơm tỏa ngát)
 *   ↓ (500ms - 620ms)
 * CONTENT (Mở thẻ thi vị hương thơm / thông tin thế giới mỹ phẩm tương ứng)
 * 
 * NGUYÊN TẮC:
 * - "Không tạo phản ứng quá mạnh" -> Chuyển động nhẹ nhàng, sang trọng, thanh lịch.
 * - "Người dùng phải cảm giác mình thực sự tác động vào thế giới trong background".
 * ============================================================
 */

(function (window, document) {
  'use strict';

  // --- ÂM THANH XÚC GIÁC TỔNG HỢP (WEB AUDIO API) ---
  // Tạo tiếng chạm pha lê & tiếng gió vuốt siêu nhẹ không cần tải file ngoài
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => { });
    }
    return audioCtx;
  }

  // Tiếng chạm pha lê cực êm dịu khi ngón tay tiếp xúc vật thể
  function playCrystalTouchTone() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.32);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(680, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.024, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.32);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.33);
    } catch (_) { }
  }

  // Tiếng gió lướt êm dịu khi người dùng thực hiện cử chỉ vuốt (Swipe)
  function playSwipeWindTone(force = 1.0) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const bufferSize = Math.floor(ctx.sampleRate * 0.38);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.03 * white) / 1.03;
        data[i] = last * 1.8;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(380, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.18);
      filter.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.36);
      filter.Q.value = 1.4;

      const gain = ctx.createGain();
      const peakVol = Math.min(0.035, 0.015 * force);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(peakVol, ctx.currentTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (_) { }
  }

  // Tiếng chuông vàng/hồng ấm áp khi ánh sáng chạy quanh hũ Radiance Cream
  function playCreamOrbitTone() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Gam hợp âm E major 9 ấm áp, sang trọng (E5, G#5, B5, D#6, E6)
      const freqs = [659.25, 830.61, 987.77, 1244.51, 1318.51];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.11);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, now + idx * 0.11);
        filter.frequency.exponentialRampToValueAtTime(700, now + idx * 0.11 + 0.6);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.11);
        gain.gain.linearRampToValueAtTime(0.024, now + idx * 0.11 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.11 + 0.65);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.11);
        osc.stop(now + idx * 0.11 + 0.68);
      });
    } catch (_) { }
  }

  // Tiếng chuông ngân hoa khi timeline cánh hoa hé nở
  function playTimelineBloomTone() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5 - E5 - G5 - C6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.026, now + idx * 0.09 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.9);
      });
    } catch (_) { }
  }

  // Tiếng ngân hoa khi chạm chọn một mốc kỷ niệm
  function playMilestoneSelectTone() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const freqs = [880.0, 1108.73, 1318.51, 1760.0]; // A5 - C#6 - E6 - A6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.028, now + idx * 0.07 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.75);
      });
    } catch (_) { }
  }

  // --- LỚP ĐIỀU PHỐI TƯƠNG TÁC (INTERACTION ENGINE) ---
  class InteractionEngine {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          containerId: 'livingFrame',
          enableSwipe: true,
          enablePointerHover: true,
          enableAudio: true,
          enableHaptics: true,
          swipeThreshold: 18, // Khoảng cách tối thiểu để nhận diện swipe (px)
          swipeMaxDuration: 620 // Thời gian tối đa cho 1 cú vuốt (ms)
        },
        options
      );

      this.container = document.getElementById(this.options.containerId);
      this.overlayCanvas = null;
      this.ctx = null;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Trạng thái theo dõi con trỏ & cử chỉ
      this.pointer = {
        isDown: false,
        pointerId: null,
        startX: 0,
        startY: 0,
        startTime: 0,
        currentX: 0,
        currentY: 0,
        lastX: 0,
        lastY: 0,
        lastTime: 0,
        vx: 0,
        vy: 0,
        history: [], // Lưu các mẫu điểm gần nhất để tính góc thoát và vận tốc
        targetElement: null,
        targetBottle: null
      };

      // Vệt gió (Wind trails) đang hiển thị trên overlay canvas
      this.activeWindTrails = [];
      this.activeRipples = [];
      this.isRenderLoopActive = false;

      // Chống kích hoạt đúp giữa Touch và giả lập Mouse Click
      this.lastTouchEndTime = 0;
      this.activeSequences = new Set(); // ID vật thể đang thực hiện chuỗi

      // Hướng gió phụ gia do cử chỉ swipe tác động
      this.windImpulseTimer = null;

      this.init();
    }

    init() {
      if (!this.container) {
        this.container = document.querySelector('.living-frame') || document.body;
      }
      if (!this.container) return;

      this.setupOverlayCanvas();
      this.bindEvents();
      this.startRenderLoop();
    }

    // --- Tạo Canvas phủ cho các hiệu ứng gợn gió và sóng nước ---
    setupOverlayCanvas() {
      let canvas = document.getElementById('interactionOverlayCanvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'interactionOverlayCanvas';
        canvas.className = 'interaction-overlay-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        this.container.appendChild(canvas);
      }
      this.overlayCanvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.resizeCanvas();

      window.addEventListener('resize', () => this.resizeCanvas());
      if (window.ResizeObserver) {
        new ResizeObserver(() => this.resizeCanvas()).observe(this.container);
      }
    }

    resizeCanvas() {
      if (!this.overlayCanvas || !this.container) return;
      const rect = this.container.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w === 0 || h === 0) return;

      this.overlayCanvas.width = w * this.dpr;
      this.overlayCanvas.height = h * this.dpr;
      this.overlayCanvas.style.width = w + 'px';
      this.overlayCanvas.style.height = h + 'px';
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    // ============================================================
    // LẮNG NGHE SỰ KIỆN: CHUỘT, TOUCH & POINTER MOVEMENT
    // ============================================================
    bindEvents() {
      // 1. Pointer Down (Chuột nhấn / Chạm ngón tay)
      const onPointerDown = (e) => {
        // Bỏ qua nếu chạm vào modal hiển thị, navbar menu, hoặc nút nhạc
        if (
          e.target.closest('#productWorldModal') ||
          e.target.closest('#serumMemoryModal') ||
          e.target.closest('#tonerMessageModal') ||
          e.target.closest('#creamTimelineContainer') ||
          e.target.closest('#creamMilestoneModal') ||
          e.target.closest('#lipbalmPromiseModal') ||
          e.target.closest('#storyChapterNavBar') ||
          e.target.closest('#storyReflectionHUD') ||
          e.target.closest('#storyActiveChapterTag') ||
          e.target.closest('#storyChapterCardBridge') ||
          e.target.closest('.site-header') ||
          e.target.closest('.music-toggle-btn') ||
          e.target.closest('.mobile-menu-btn') ||
          e.target.closest('.site-footer')
        ) {
          return;
        }

        const coords = this.getEventCoords(e);
        if (!coords) return;

        // Nếu là touch, ghi lại thời điểm
        if (e.pointerType === 'touch' || e.touches) {
          this.lastTouchEndTime = performance.now();
        }

        const now = performance.now();
        this.pointer.isDown = true;
        this.pointer.pointerId = e.pointerId !== undefined ? e.pointerId : 1;
        this.pointer.startX = coords.clientX;
        this.pointer.startY = coords.clientY;
        this.pointer.currentX = coords.clientX;
        this.pointer.currentY = coords.clientY;
        this.pointer.lastX = coords.clientX;
        this.pointer.lastY = coords.clientY;
        this.pointer.startTime = now;
        this.pointer.lastTime = now;
        this.pointer.vx = 0;
        this.pointer.vy = 0;
        this.pointer.history = [{ x: coords.clientX, y: coords.clientY, t: now }];
        this.pointer.targetElement = e.target;
        this.pointer.targetBottle = this.resolveBottleFromTarget(e.target, coords);

        // Khởi động trước AudioContext để đảm bảo phát âm thanh tức thì trên iOS
        getAudioContext();
      };

      // 2. Pointer Move (Rê chuột / Lướt ngón tay)
      const onPointerMove = (e) => {
        const coords = this.getEventCoords(e);
        if (!coords) return;

        const now = performance.now();

        // Xử lý khi ngón tay đang chạm/kéo (Swipe tracking)
        if (this.pointer.isDown) {
          const dt = Math.max(now - this.pointer.lastTime, 6);
          const dx = coords.clientX - this.pointer.lastX;
          const dy = coords.clientY - this.pointer.lastY;

          this.pointer.vx = dx / dt;
          this.pointer.vy = dy / dt;

          this.pointer.currentX = coords.clientX;
          this.pointer.currentY = coords.clientY;
          this.pointer.lastX = coords.clientX;
          this.pointer.lastY = coords.clientY;
          this.pointer.lastTime = now;

          // Lưu mẫu lịch sử để tính vận tốc ra (exit velocity)
          this.pointer.history.push({ x: coords.clientX, y: coords.clientY, t: now });
          if (this.pointer.history.length > 8) {
            this.pointer.history.shift();
          }

          const totalDist = Math.hypot(
            coords.clientX - this.pointer.startX,
            coords.clientY - this.pointer.startY
          );

          // Nếu đang kéo dài qua màn hình (Swipe gesture)
          if (totalDist > 14 && this.options.enableSwipe) {
            // Thêm điểm gợn gió trên canvas
            this.addWindTrailPoint(coords.clientX, coords.clientY, this.pointer.vx, this.pointer.vy);

            // Tác động vi mô lên các hạt bụi nắng trong phòng
            this.displaceAtmosphere(coords.clientX, coords.clientY, this.pointer.vx, this.pointer.vy);
          }
        } else {
          // Xử lý POINTER MOVEMENT (Khi rê chuột không bấm)
          if (this.options.enablePointerHover && e.pointerType !== 'touch') {
            this.handlePointerHover(coords);
          }
        }
      };

      // 3. Pointer Up (Thả chuột / Nhấc ngón tay)
      const onPointerUp = (e) => {
        if (!this.pointer.isDown) return;
        this.pointer.isDown = false;

        const coords = this.getEventCoords(e) || {
          clientX: this.pointer.lastX,
          clientY: this.pointer.lastY
        };

        const now = performance.now();
        const duration = now - this.pointer.startTime;
        const totalDistX = coords.clientX - this.pointer.startX;
        const totalDistY = coords.clientY - this.pointer.startY;
        const totalDist = Math.hypot(totalDistX, totalDistY);

        // Tính vận tốc thoát từ lịch sử di chuyển gần nhất
        let exitVx = this.pointer.vx;
        let exitVy = this.pointer.vy;
        if (this.pointer.history.length >= 2) {
          const firstSample = this.pointer.history[0];
          const lastSample = this.pointer.history[this.pointer.history.length - 1];
          const sampleDt = Math.max(lastSample.t - firstSample.t, 10);
          exitVx = (lastSample.x - firstSample.x) / sampleDt;
          exitVy = (lastSample.y - firstSample.y) / sampleDt;
        }

        const exitSpeed = Math.hypot(exitVx, exitVy);

        // ============================================================
        // PHÂN LOẠI CỬ CHỈ: SWIPE HAY CHẠM (CLICK/TAP)
        // ============================================================
        // Trường hợp 1: CỬ CHỈ SWIPE (VUỐT TAY)
        // - Quãng đường vuốt >= ngưỡng quy định (18px)
        // - Hoặc vận tốc thoát cao
        if (
          this.options.enableSwipe &&
          totalDist >= this.options.swipeThreshold &&
          duration <= this.options.swipeMaxDuration &&
          exitSpeed >= 0.12
        ) {
          const swipeAngle = Math.atan2(totalDistY, totalDistX);
          const normalizedForce = Math.min(2.4, Math.max(0.75, exitSpeed * 1.15));

          this.handleSwipeGesture({
            startX: this.pointer.startX,
            startY: this.pointer.startY,
            endX: coords.clientX,
            endY: coords.clientY,
            distX: totalDistX,
            distY: totalDistY,
            dist: totalDist,
            angle: swipeAngle,
            speed: exitSpeed,
            force: normalizedForce,
            target: this.pointer.targetElement,
            bottle: this.pointer.targetBottle
          });
          return;
        }

        // Trường hợp 2: CỬ CHỈ CHẠM (TAP / CLICK)
        // Quãng đường dịch chuyển nhỏ < 16px
        if (totalDist < 16 && duration < 550) {
          this.handleTapGesture({
            clientX: coords.clientX,
            clientY: coords.clientY,
            target: this.pointer.targetElement,
            bottle: this.pointer.targetBottle,
            originalEvent: e
          });
        }
      };

      const onPointerCancel = () => {
        this.pointer.isDown = false;
        this.pointer.history = [];
      };

      // Đăng ký bộ lắng nghe sự kiện Pointer Events (hỗ trợ chuẩn nhất trên trình duyệt hiện đại)
      if (window.PointerEvent) {
        this.container.addEventListener('pointerdown', onPointerDown, { passive: true });
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerup', onPointerUp, { passive: true });
        window.addEventListener('pointercancel', onPointerCancel, { passive: true });
      } else {
        // Fallback cho trình duyệt cũ
        this.container.addEventListener('mousedown', onPointerDown, { passive: true });
        window.addEventListener('mousemove', onPointerMove, { passive: true });
        window.addEventListener('mouseup', onPointerUp, { passive: true });

        this.container.addEventListener('touchstart', onPointerDown, { passive: true });
        window.addEventListener('touchmove', onPointerMove, { passive: true });
        window.addEventListener('touchend', onPointerUp, { passive: true });
        window.addEventListener('touchcancel', onPointerCancel, { passive: true });
      }

      // Ngăn chặn các sự kiện click chuột ảo (synthetic click) sau touch
      this.container.addEventListener(
        'click',
        (e) => {
          // Nếu sự kiện click xảy ra ngay sau touch, chặn lại để không lặp lại chuỗi
          if (performance.now() - this.lastTouchEndTime < 450) {
            e.stopPropagation();
          }
        },
        true
      );
    }

    // Lấy tọa độ Client chính xác từ PointerEvent / TouchEvent / MouseEvent
    getEventCoords(e) {
      if (e.clientX !== undefined && e.clientY !== undefined) {
        return { clientX: e.clientX, clientY: e.clientY };
      }
      if (e.touches && e.touches.length > 0) {
        return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
      }
      if (e.changedTouches && e.changedTouches.length > 0) {
        return { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY };
      }
      return null;
    }

    // Tìm chai mỹ phẩm từ target element hoặc tọa độ tương đối
    resolveBottleFromTarget(target, coords) {
      if (!target) return null;

      // 1. Kiểm tra nếu bấm trực tiếp vào nút hotspot có data-bottle-id
      const hotspot = target.closest('.bottle-hotspot');
      if (hotspot) {
        const bId = hotspot.getAttribute('data-bottle-id');
        const bottles = window.fragranceBottles || [];
        const found = bottles.find((b) => b.id === bId);
        if (found) return found;
        if (bId === 'flower_vase') {
          return {
            id: 'flower_vase',
            brand: 'Butterfly Pea',
            name: 'Botanical Blossom',
            tag: 'Bình Hoa Đậu Biếc',
            nozzle: { x: 0.5, y: 0.22 },
            bounds: { minX: 0.28, maxX: 0.72, minY: 0.04, maxY: 0.38 }
          };
        }
      }

      // 2. Kiểm tra tọa độ tương quan trong livingFrame
      if (this.container && coords && typeof window.getBottleAtRel === 'function') {
        const rect = this.container.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const relX = (coords.clientX - rect.left) / rect.width;
          const relY = (coords.clientY - rect.top) / rect.height;
          return window.getBottleAtRel(relX, relY);
        }
      }

      return null;
    }

    // ============================================================
    // XỬ LÝ POINTER MOVEMENT: RÊ CHUỘT TẠO KHÍ QUYỂN & GỢN SÁNG
    // ============================================================
    handlePointerHover(coords) {
      if (!this.container) return;
      const rect = this.container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const relX = (coords.clientX - rect.left) / rect.width;
      const relY = (coords.clientY - rect.top) / rect.height;

      // 1. Nhận diện vật thể dưới con trỏ
      const hoveredBottle = this.resolveBottleFromTarget(null, coords);
      if (hoveredBottle) {
        this.container.setAttribute('data-hover-bottle', 'true');
        this.container.style.cursor = 'pointer';
      } else {
        this.container.removeAttribute('data-hover-bottle');
        this.container.style.cursor = '';
      }

      // 2. Tạo gợn sóng khúc xạ rất mỏng tại mặt bàn đá nếu rê chuột ở nửa dưới
      if (relY >= 0.55 && Math.random() < 0.2) {
        this.addTableCausticWave(coords.clientX - rect.left, coords.clientY - rect.top);
      }
    }

    // Tác động luồng khí vi mô lên các hạt bụi sáng 3D
    displaceAtmosphere(clientX, clientY, vx, vy) {
      if (!window.bgEngineInstance || !window.bgEngineInstance.particles) return;
      const rect = this.container.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;

      const particles = window.bgEngineInstance.particles;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dist = Math.hypot(p.x - localX, p.y - localY);
        if (dist < 60) {
          // Hạt bụi bị ngón tay lướt dạt nhẹ sang bên
          const push = (1 - dist / 60) * 1.6;
          p.x += (vx * 12 + (p.x - localX) * 0.1) * push;
          p.y += (vy * 12 + (p.y - localY) * 0.1) * push;
        }
      }
    }

    // ============================================================
    // XỬ LÝ CỬ CHỈ SWIPE (VUỐT TAY)
    // "Cánh hoa có thể nhận hướng và lực tương đối từ hướng swipe,
    // sau đó tiếp tục bay theo quán tính và gió."
    // ============================================================
    handleSwipeGesture(gesture) {
      const { startX, startY, endX, endY, angle, force, speed, bottle } = gesture;

      // 1. Âm thanh gió thoảng lướt nhẹ
      if (this.options.enableAudio) {
        playSwipeWindTone(force);
      }

      // 2. Phản hồi xúc giác cực nhẹ trên mobile (Haptics)
      if (this.options.enableHaptics && window.navigator && window.navigator.vibrate) {
        try {
          window.navigator.vibrate([16]);
        } catch (_) { }
      }

      // 3. TÁC ĐỘNG VÀO GIÓ PHÒNG (Ambient Wind Coupling)
      // Vuốt tay thổi thêm luồng gió tức thời theo trục ngang
      const windPush = Math.cos(angle) * force * 0.72;
      this.applyWindImpulse(windPush);

      // 4. KÍCH HOẠT CÁNH HOA THEO ĐÚNG HƯỚNG VÀ LỰC CỦA CÚ VUỐT
      // Số lượng cánh hoa tỷ lệ với lực vuốt: 5 đến 11 cánh
      const petalCount = Math.min(11, Math.max(5, Math.round(4 + force * 3.2)));

      if (window.petalEngine) {
        // Cánh hoa nhận góc vuốt chính xác (angle) và lực hất (force)
        // Sau khi vút theo quán tính ban đầu, sức cản không khí và gió phòng sẽ đưa cánh hoa lượn êm ả
        window.petalEngine.toss({
          x: endX,
          y: endY,
          count: petalCount,
          force: force,
          angle: angle,
          spread: 0.38 + (1 / force) * 0.12
        });
      }

      // 5. HIỆU ỨNG GỢN GIÓ TRÊN OVERLAY CANVAS (Wind Gust Ribbon)
      this.createWindGustVisual(startX, startY, endX, endY, angle, force);

      // 6. NẾU ĐƯỜNG VUỐT LƯỚT QUA HOẶC CHẠM CHAI MỸ PHẨM
      if (bottle && bottle.id !== 'flower_vase') {
        // Chai khẽ nghiêng nhẹ xuôi theo chiều vuốt (Micro-recoil theo hướng gió)
        this.reactObjectSoftly(bottle, {
          tiltDir: Math.sign(Math.cos(angle)),
          impulseScale: 0.8
        });

        // Emits a gentle puff of fragrance in swipe direction
        if (window.scentEngine && typeof window.scentEngine.emit === 'function') {
          setTimeout(() => {
            const rect = this.container.getBoundingClientRect();
            const nozzleRelX = bottle.nozzle ? bottle.nozzle.x : 0.5;
            const nozzleRelY = bottle.nozzle ? bottle.nozzle.y : 0.4;
            window.scentEngine.emit(nozzleRelX * rect.width, nozzleRelY * rect.height, {
              sprayAngle: Math.cos(angle) * 0.15,
              showCard: false,
              intensity: 0.75
            });
          }, 120);
        }
      }

      // 7. NẾU VUỐT QUA KHU VỰC VÒM HOA TRÊN CAO (CANOPY / VASE)
      const rect = this.container.getBoundingClientRect();
      const relStartY = (startY - rect.top) / rect.height;
      if (relStartY <= 0.42 && force > 1.25) {
        // Vuốt mạnh qua vòm hoa: cành hoa vút theo chiều gió vuốt!
        const branchDir = Math.cos(angle) >= 0 ? 1 : -1;
        if (window.branchEngine) {
          window.branchEngine.launch({
            originX: startX,
            originY: startY,
            dir: branchDir,
            allowPetalDetach: true
          });
        }
      }

      // 8. Tự động ẩn gợi ý nếu có
      this.dismissTouchHint();
    }

    // Tác động luồng gió tức thời rồi từ từ trả về bình thường
    applyWindImpulse(windDelta) {
      if (window.petalEngine) {
        window.petalEngine.ambientWindX = Math.min(
          1.8,
          Math.max(-1.8, window.petalEngine.ambientWindX + windDelta)
        );
      }
      if (window.bgEngineInstance && window.bgEngineInstance.wind) {
        window.bgEngineInstance.wind.current = Math.min(
          1.8,
          Math.max(-1.8, window.bgEngineInstance.wind.current + windDelta)
        );
      }

      // Hồi phục dần về mức gió tự nhiên sau 2.4 giây
      if (this.windImpulseTimer) clearTimeout(this.windImpulseTimer);
      this.windImpulseTimer = setTimeout(() => {
        if (window.petalEngine) {
          window.petalEngine.ambientWindX = 0.55;
        }
      }, 2400);
    }

    // ============================================================
    // XỬ LÝ CỬ CHỈ CHẠM (TAP / CLICK GESTURE)
    // CHUỖI TƯƠNG TÁC TUẦN TỰ THEO THỨ TỰ BẮT BUỘC:
    // TOUCH
    //   ↓
    // OBJECT RESPONSE
    //   ↓
    // FLOWER BRANCH
    //   ↓
    // PETALS
    //   ↓
    // LIGHT / SCENT
    //   ↓
    // CONTENT
    // ============================================================
    handleTapGesture(tap) {
      const { clientX, clientY, target, bottle } = tap;

      // 1. Tự động ẩn gợi ý chạm ban đầu
      this.dismissTouchHint();

      // 2. Nếu chạm vào một vật thể cụ thể (Chai mỹ phẩm hoặc Bình hoa)
      if (bottle) {
        this.triggerSequentialChoreography(bottle, clientX, clientY);
        return;
      }

      // 3. Nếu chạm vào các cành hoa đung đưa trên vòm canopy
      const canopyBranch = target ? target.closest('.engine-swaying-branch, .engine-living-blossom') : null;
      if (canopyBranch) {
        this.handleCanopyTouch(canopyBranch, clientX, clientY);
        return;
      }

      // 4. Nếu chạm vào không gian nền (Vải lụa, mặt bàn, tán hoa chung)
      this.handleAmbientTouch(clientX, clientY);
    }

    // ============================================================
    // CHUỖI TƯƠNG TÁC THỰC THỂ TUẦN TỰ (SEQUENTIAL CHOREOGRAPHY)
    // ============================================================
    triggerSequentialChoreography(bottle, clientX, clientY) {
      if (!bottle) return;

      // ============================================================
      // SERUM = KÝ ỨC (DÀNH RIÊNG CHO CHAI SERUM)
      // ============================================================
      if (bottle.id === 'serum') {
        this.triggerSerumMemoryChoreography(bottle, clientX, clientY);
        if (window.discoveryEngine) window.discoveryEngine.onProductDiscovered('serum');
        return;
      }

      // ============================================================
      // CREAM = DÒNG THỜI GIAN (DÀNH RIÊNG CHO HŨ RADIANCE CREAM)
      // ============================================================
      if (bottle.id === 'cream') {
        this.triggerCreamTimelineChoreography(bottle, clientX, clientY);
        if (window.discoveryEngine) window.discoveryEngine.onProductDiscovered('cream');
        return;
      }

      // ============================================================
      // ESSENCE = HƯƠNG CỦA KỶ NIỆM (DÀNH RIÊNG CHO CHAI SOOTHING ESSENCE)
      // ============================================================
      if (bottle.id === 'essence') {
        this.triggerEssenceMemoryChoreography(bottle, clientX, clientY);
        if (window.discoveryEngine) window.discoveryEngine.onProductDiscovered('essence');
        return;
      }

      // TONER = LỜI NHẮN (DÀNH RIÊNG CHO CHAI HYDRATING TONER)
      // ============================================================
      if (bottle.id === 'toner') {
        this.triggerTonerMessageChoreography(bottle, clientX, clientY);
        if (window.discoveryEngine) window.discoveryEngine.onProductDiscovered('toner');
        return;
      }

      // ============================================================
      // LIP BALM = LỜI HẸN (DÀNH RIÊNG CHO HŨ LIP BALM HOẶC TUÝP SON)
      // ============================================================
      if (bottle.id === 'lipbalm' || bottle.id === 'liptube') {
        this.triggerLipbalmPromiseChoreography(bottle, clientX, clientY);
        if (window.discoveryEngine) window.discoveryEngine.onProductDiscovered('lipbalm');
        return;
      }

      // ============================================================
      // FLOWER VASE = BÔNG HOA GỐC (PHẢN CHIẾU ĐI QUA 9 MÀN HÌNH)
      // ============================================================
      if (bottle.id === 'flower_vase') {
        this.triggerFlowerRootReflectionChoreography(bottle, clientX, clientY);
        return;
      }

      // Chống chồng chéo hiệu ứng trên cùng 1 vật thể nếu đang chạy
      if (this.activeSequences.has(bottle.id)) return;
      this.activeSequences.add(bottle.id);

      const fRect = this.container.getBoundingClientRect();
      const targetImg = document.querySelector('.main-uncut-image') || this.container.querySelector('img');
      const iRect = targetImg ? targetImg.getBoundingClientRect() : fRect;

      // Tính toán kích thước & vị trí chính xác của vật thể
      const bounds = bottle.bounds || { minX: 0.3, maxX: 0.7, minY: 0.1, maxY: 0.5 };
      const bottleBox = {
        left: bounds.minX * iRect.width + (iRect.left - fRect.left),
        top: bounds.minY * iRect.height + (iRect.top - fRect.top),
        width: (bounds.maxX - bounds.minX) * iRect.width,
        height: (bounds.maxY - bounds.minY) * iRect.height
      };

      // Tọa độ tâm của vật thể
      const objCenterX = fRect.left + bottleBox.left + bottleBox.width * 0.5;
      const objCenterY = fRect.top + bottleBox.top + bottleBox.height * 0.5;

      // Vector hướng tương tác (Từ điểm chạm so với tâm vật thể)
      // Nếu chạm bên trái -> nghiêng sang phải và phóng cành/cánh hoa sang phải
      const touchOffsetX = clientX - objCenterX;
      const touchOffsetY = clientY - objCenterY;
      const dirX = touchOffsetX >= 0 ? 1 : -1;
      const normTilt = Math.min(1.4, Math.max(-1.4, (touchOffsetX / (bottleBox.width * 0.5)) * 1.3));

      // Tọa độ miệng vòi xịt / điểm phát sáng
      const nozzleRelX = bottle.nozzle ? bottle.nozzle.x : 0.5;
      const nozzleRelY = bottle.nozzle ? bottle.nozzle.y : 0.35;
      const nozzleScreenX = fRect.left + nozzleRelX * fRect.width;
      const nozzleScreenY = fRect.top + nozzleRelY * fRect.height;

      // ------------------------------------------------------------
      // GIAI ĐOẠN 1: TOUCH (0ms)
      // ------------------------------------------------------------
      // Haptic feedback xúc giác siêu nhẹ trên điện thoại
      if (this.options.enableHaptics && window.navigator && window.navigator.vibrate) {
        try {
          window.navigator.vibrate([14]);
        } catch (_) { }
      }

      // Âm thanh pha lê chạm thanh thoát
      if (this.options.enableAudio) {
        playCrystalTouchTone();
      }

      // Tạo gợn sóng chạm nhẹ tại đúng vị trí ngón tay
      this.createTouchWaveVisual(clientX, clientY);

      // ------------------------------------------------------------
      // GIAI ĐOẠN 2: OBJECT RESPONSE (0ms - 80ms)
      // "1. Vật thể phản ứng nhẹ. Không tạo phản ứng quá mạnh."
      // ------------------------------------------------------------
      this.reactObjectSoftly(bottle, {
        bottleBox,
        tiltDir: -normTilt, // Nghiêng lùi lại nhẹ theo lực chạm
        impulseScale: 1.0
      });

      // Tạo gợn sóng phản chiếu trên mặt bàn đá hoa cương ngay dưới chân chai
      const tableRippleY = bottleBox.top + bottleBox.height * 0.95;
      this.addTableCausticWave(bottleBox.left + bottleBox.width * 0.5, tableRippleY);

      // ------------------------------------------------------------
      // GIAI ĐOẠN 3: FLOWER BRANCH (90ms - 150ms)
      // "4. Có thể kích hoạt cành hoa."
      // ------------------------------------------------------------
      setTimeout(() => {
        // Cành hoa vút ra theo hướng tương tác thoát khỏi vật thể
        const branchOriginX = fRect.left + bottleBox.left + (dirX < 0 ? bottleBox.width * 0.8 : bottleBox.width * 0.2);
        const branchOriginY = fRect.top + bottleBox.top + bottleBox.height * 0.18;
        const branchFlightDir = -dirX; // Hướng bay đối xứng ra khoảng không thoáng

        if (window.branchEngine) {
          window.branchEngine.launch({
            originX: branchOriginX,
            originY: branchOriginY,
            dir: branchFlightDir,
            allowPetalDetach: true
          });
        } else if (typeof window.launchFlowerBranch === 'function') {
          window.launchFlowerBranch(branchOriginX, branchOriginY, branchFlightDir);
        }
      }, 95);

      // ------------------------------------------------------------
      // GIAI ĐOẠN 4: PETALS (180ms - 240ms)
      // "3. Kích hoạt hiệu ứng cánh hoa."
      // ------------------------------------------------------------
      setTimeout(() => {
        // Chùm cánh hoa đậu biếc bung nở theo góc tiếp tuyến tự nhiên
        const petalLaunchAngle = -Math.PI * 0.5 + (-dirX * 0.38) + (Math.random() - 0.5) * 0.25;
        const petalOriginX = objCenterX + touchOffsetX * 0.4;
        const petalOriginY = fRect.top + bottleBox.top + bottleBox.height * 0.25;

        if (window.petalEngine) {
          window.petalEngine.toss({
            x: petalOriginX,
            y: petalOriginY,
            count: 6,
            force: 1.22,
            angle: petalLaunchAngle,
            spread: 0.48
          });
        }
      }, 190);

      // ------------------------------------------------------------
      // GIAI ĐOẠN 5: LIGHT / SCENT (290ms - 370ms)
      // "5. Kích hoạt ánh sáng/hương thơm."
      // ------------------------------------------------------------
      setTimeout(() => {
        // Ánh sáng: Đốm sáng hào quang lấp lánh tại đầu vòi xịt
        this.createNozzleStarburst(nozzleScreenX, nozzleScreenY);

        // Hương thơm: Làn sương khói mỏng uốn lượn mang hương sắc hoa đậu biếc
        if (window.scentEngine) {
          window.scentEngine.emitFromBottle(bottle, {
            showCard: false, // Thẻ chữ sẽ được mở ở GIAI ĐOẠN 6: CONTENT
            intensity: 1.0
          });
        }
      }, 300);

      // ------------------------------------------------------------
      // GIAI ĐOẠN 6: CONTENT (500ms - 620ms)
      // "6. Sau đó mở chức năng tương ứng."
      // ------------------------------------------------------------
      setTimeout(() => {
        // Mở thẻ thi vị Scent Note Card mang lời thơ và chức năng tương ứng
        if (window.scentEngine && typeof window.scentEngine.showScentNoteCard === 'function') {
          window.scentEngine.showScentNoteCard(
            bottle,
            nozzleRelX * fRect.width,
            nozzleRelY * fRect.height
          );
        } else if (typeof window.renderProductWorldModal === 'function') {
          window.renderProductWorldModal(bottle);
        }

        // Giải phóng khóa chuỗi
        this.activeSequences.delete(bottle.id);
      }, 530);
    }

    // ============================================================
    // PHẢN ỨNG VẬT THỂ NHẸ NHÀNG (GENTLE OBJECT RESPONSE)
    // "1. Vật thể phản ứng nhẹ. Không tạo phản ứng quá mạnh."
    // - Co nén vi mô (Scale 0.985)
    // - Nghiêng nhẹ theo góc chạm (Tilt 1.0 - 1.4 độ)
    // - Đàn hồi mềm mại trở lại vị trí ban đầu (Cubic-bezier elastic settle)
    // - Vệt sáng ngọc trai lướt qua thân chai
    // ============================================================
    reactObjectSoftly(bottle, options = {}) {
      if (!bottle) return;
      if (bottle.id === 'flower_vase') {
        const canopy = document.getElementById('engineFloraCanopy') || document.getElementById('engineFloraLayer');
        if (canopy) {
          canopy.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.4, 1)';
          canopy.style.transform = 'scale(0.99) rotate(-0.8deg)';
          setTimeout(() => {
            canopy.style.transform = '';
          }, 380);
        }
        return;
      }

      const targetImg = document.querySelector('.main-uncut-image') || this.container.querySelector('img');
      if (!targetImg || !targetImg.complete) return;

      const fRect = this.container.getBoundingClientRect();
      const iRect = targetImg.getBoundingClientRect();
      const bounds = bottle.bounds || { minX: 0.2, maxX: 0.4, minY: 0.4, maxY: 0.8 };

      const bottleBox = options.bottleBox || {
        left: bounds.minX * iRect.width + (iRect.left - fRect.left),
        top: bounds.minY * iRect.height + (iRect.top - fRect.top),
        width: (bounds.maxX - bounds.minX) * iRect.width,
        height: (bounds.maxY - bounds.minY) * iRect.height
      };

      const tiltDeg = (options.tiltDir || 0) * (options.impulseScale || 1.0);

      // Xóa phần tử shaker cũ nếu có
      const oldShaker = this.container.querySelector(`.bottle-reaction-${bottle.id}`);
      if (oldShaker) oldShaker.remove();

      const shakerEl = document.createElement('div');
      shakerEl.className = `bottle-shaker-element bottle-reaction-${bottle.id} interaction-object-recoil`;
      shakerEl.style.left = `${bottleBox.left.toFixed(1)}px`;
      shakerEl.style.top = `${bottleBox.top.toFixed(1)}px`;
      shakerEl.style.width = `${bottleBox.width.toFixed(1)}px`;
      shakerEl.style.height = `${bottleBox.height.toFixed(1)}px`;

      // Cắt đúng hình ảnh chai từ bức ảnh gốc
      const shakerCanvas = document.createElement('canvas');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      shakerCanvas.width = Math.max(1, Math.round(bottleBox.width * dpr));
      shakerCanvas.height = Math.max(1, Math.round(bottleBox.height * dpr));
      shakerCanvas.style.width = '100%';
      shakerCanvas.style.height = '100%';

      const sCtx = shakerCanvas.getContext('2d');
      sCtx.scale(dpr, dpr);

      const sx = bounds.minX * targetImg.naturalWidth;
      const sy = bounds.minY * targetImg.naturalHeight;
      const sw = (bounds.maxX - bounds.minX) * targetImg.naturalWidth;
      const sh = (bounds.maxY - bounds.minY) * targetImg.naturalHeight;

      sCtx.drawImage(targetImg, sx, sy, sw, sh, 0, 0, bottleBox.width, bottleBox.height);

      // Vệt sáng ngọc trai lướt qua thân chai
      const sheenEl = document.createElement('div');
      sheenEl.className = 'interaction-sheen-sweep';

      // Hào quang viền ngọc trai dịu mát
      const auraEl = document.createElement('div');
      auraEl.className = 'interaction-pearl-aura active';

      shakerEl.appendChild(shakerCanvas);
      shakerEl.appendChild(sheenEl);
      shakerEl.appendChild(auraEl);
      this.container.appendChild(shakerEl);

      // 1. Phản ứng nén nhẹ & nghiêng nhẹ ban đầu (Micro recoil)
      // "Không tạo phản ứng quá mạnh"
      requestAnimationFrame(() => {
        shakerEl.style.transform = `scale(0.984, 0.988) rotate(${tiltDeg.toFixed(2)}deg)`;
      });

      // 2. Đàn hồi trở lại kích thước chuẩn sau 130ms
      setTimeout(() => {
        shakerEl.style.transform = `scale(1.008, 1.004) rotate(0deg)`;
      }, 130);

      // 3. Ổn định và mờ dần vào ảnh nền sau 520ms
      setTimeout(() => {
        shakerEl.style.transform = 'scale(1) rotate(0deg)';
        auraEl.classList.remove('active');
        setTimeout(() => {
          shakerEl.remove();
        }, 350);
      }, 520);
    }

    // ============================================================
    // SERUM = KÝ ỨC (THIẾT KẾ CHỨC NĂNG DÀNH RIÊNG CHO CHAI SERUM)
    // ============================================================
    // Khi người dùng chạm vào chai:
    // 1. Chai rung nhẹ.
    // 2. Một điểm sáng chạy trên thân chai.
    // 3. Cành hoa phía sau tách ra.
    // 4. Cành hoa bay theo trajectory uốn lượn.
    // 5. Một vài cánh hoa tách khỏi cành.
    // 6. Glow xanh lan nhẹ.
    // 7. Background giảm sáng nhẹ.
    // 8. Nội dung ký ức xuất hiện.
    //
    // Nội dung hiển thị:
    // KÝ ỨC
    // "Có những ngày chẳng có gì đặc biệt...
    //
    // nhưng khi nhớ lại,
    // ta vẫn mỉm cười."
    //
    // Text xuất hiện từng dòng một cách mềm mại.
    // Người dùng tự đóng bằng nút "Đóng".
    // Không tự động đóng nội dung quan trọng.
    // ============================================================
    triggerSerumMemoryChoreography(bottle, clientX, clientY) {
      if (!bottle || !this.container) return;

      // Chống kích hoạt đúp nếu đang hiển thị ký ức
      if (this.activeSequences.has('serum') || document.getElementById('serumMemoryModal')) {
        return;
      }
      this.activeSequences.add('serum');
      this.dismissTouchHint();

      const fRect = this.container.getBoundingClientRect();
      const targetImg = document.querySelector('.main-uncut-image') || this.container.querySelector('img');
      const iRect = targetImg ? targetImg.getBoundingClientRect() : fRect;

      const bounds = bottle.bounds || { minX: 0.135, maxX: 0.28, minY: 0.31, maxY: 0.83 };
      const bottleBox = {
        left: bounds.minX * iRect.width + (iRect.left - fRect.left),
        top: bounds.minY * iRect.height + (iRect.top - fRect.top),
        width: (bounds.maxX - bounds.minX) * iRect.width,
        height: (bounds.maxY - bounds.minY) * iRect.height
      };

      const objCenterX = fRect.left + bottleBox.left + bottleBox.width * 0.5;
      const touchX = clientX !== undefined ? clientX : objCenterX;
      const touchY = clientY !== undefined ? clientY : (fRect.top + bottleBox.top + bottleBox.height * 0.45);

      // ------------------------------------------------------------
      // BƯỚC 1: CHAI RUNG NHẸ (0ms)
      // ------------------------------------------------------------
      if (this.options.enableHaptics && window.navigator && window.navigator.vibrate) {
        try {
          window.navigator.vibrate([22, 30, 22]);
        } catch (_) { }
      }

      if (this.options.enableAudio) {
        this.playMemoryChimeTone();
      }

      this.createTouchWaveVisual(touchX, touchY);

      // Xóa phần tử shaker cũ nếu có
      const oldShaker = this.container.querySelector('.serum-memory-bottle');
      if (oldShaker) oldShaker.remove();

      const serumShaker = document.createElement('div');
      serumShaker.className = 'bottle-shaker-element serum-memory-bottle bottle-shaking';
      serumShaker.style.left = `${bottleBox.left.toFixed(1)}px`;
      serumShaker.style.top = `${bottleBox.top.toFixed(1)}px`;
      serumShaker.style.width = `${bottleBox.width.toFixed(1)}px`;
      serumShaker.style.height = `${bottleBox.height.toFixed(1)}px`;

      const shakerCanvas = document.createElement('canvas');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      shakerCanvas.width = Math.max(1, Math.round(bottleBox.width * dpr));
      shakerCanvas.height = Math.max(1, Math.round(bottleBox.height * dpr));
      shakerCanvas.style.width = '100%';
      shakerCanvas.style.height = '100%';

      const sCtx = shakerCanvas.getContext('2d');
      sCtx.scale(dpr, dpr);

      if (targetImg && targetImg.complete && targetImg.naturalWidth > 0) {
        const sx = bounds.minX * targetImg.naturalWidth;
        const sy = bounds.minY * targetImg.naturalHeight;
        const sw = (bounds.maxX - bounds.minX) * targetImg.naturalWidth;
        const sh = (bounds.maxY - bounds.minY) * targetImg.naturalHeight;
        sCtx.drawImage(targetImg, sx, sy, sw, sh, 0, 0, bottleBox.width, bottleBox.height);
      }
      serumShaker.appendChild(shakerCanvas);

      // Hào quang xanh ngọc bích trên thân chai
      const auraEl = document.createElement('div');
      auraEl.className = 'serum-bottle-aura active';
      serumShaker.appendChild(auraEl);

      this.container.appendChild(serumShaker);

      // Sau 480ms kết thúc rung và duy trì trạng thái phát sáng tập trung
      setTimeout(() => {
        serumShaker.classList.remove('bottle-shaking');
        serumShaker.classList.add('bottle-focused');
      }, 480);

      this.addTableCausticWave(bottleBox.left + bottleBox.width * 0.5, bottleBox.top + bottleBox.height * 0.95);

      // ------------------------------------------------------------
      // BƯỚC 2: MỘT ĐIỂM SÁNG CHẠY TRÊN THÂN CHAI (100ms - 850ms)
      // ------------------------------------------------------------
      setTimeout(() => {
        this.runLightPointOnBottle(serumShaker, bottleBox);
      }, 100);

      // ------------------------------------------------------------
      // BƯỚC 3: CÀNH HOA PHÍA SAU TÁCH RA (200ms)
      // ------------------------------------------------------------
      const branchOriginX = fRect.left + bottleBox.left + bottleBox.width * 0.60;
      const branchOriginY = fRect.top + bottleBox.top + bottleBox.height * 0.16;

      setTimeout(() => {
        const branchLeftEl = document.getElementById('branchLeft');
        if (branchLeftEl) {
          branchLeftEl.classList.add('branch-detaching');
        }
        this.createBranchPartingFlash(branchOriginX, branchOriginY);
      }, 200);

      // ------------------------------------------------------------
      // BƯỚC 4: CÀNH HOA BAY THEO TRAJECTORY UỐN LƯỢN (260ms)
      // ------------------------------------------------------------
      setTimeout(() => {
        if (window.branchEngine) {
          window.branchEngine.launch({
            originX: branchOriginX,
            originY: branchOriginY,
            dir: 1, // Lướt bay sang phải theo làn gió
            branchIndex: 0, // Nhánh branch_1.png
            trajectory: 'A', // Quỹ đạo A: ↗ → cong → ↘ uốn lượn
            allowPetalDetach: true
          });
        }
      }, 260);

      // ------------------------------------------------------------
      // BƯỚC 5: MỘT VÀI CÁNH HOA TÁCH KHỎI CÀNH (850ms & 1500ms)
      // ------------------------------------------------------------
      setTimeout(() => {
        if (window.petalEngine) {
          window.petalEngine.toss({
            x: branchOriginX + 175,
            y: branchOriginY - 90,
            count: 3,
            force: 0.95,
            angle: -Math.PI * 0.22,
            spread: 0.45
          });
        }
      }, 850);

      setTimeout(() => {
        if (window.petalEngine) {
          window.petalEngine.toss({
            x: branchOriginX + 350,
            y: branchOriginY - 20,
            count: 2,
            force: 0.85,
            angle: Math.PI * 0.45,
            spread: 0.5
          });
        }
      }, 1500);

      // ------------------------------------------------------------
      // BƯỚC 6: GLOW XANH LAN NHẸ (1100ms)
      // ------------------------------------------------------------
      setTimeout(() => {
        this.spreadGentleCyanGlow(bottleBox);

        if (window.scentEngine && typeof window.scentEngine.emitFromBottle === 'function') {
          window.scentEngine.emitFromBottle(bottle, {
            showCard: false,
            intensity: 0.85
          });
        }
      }, 1100);

      // ------------------------------------------------------------
      // BƯỚC 7: BACKGROUND GIẢM SÁNG NHẸ (1300ms)
      // ------------------------------------------------------------
      setTimeout(() => {
        this.dimBackgroundGently();
      }, 1300);

      // ------------------------------------------------------------
      // BƯỚC 8: NỘI DUNG KÝ ỨC XUẤT HIỆN (2100ms)
      // ------------------------------------------------------------
      setTimeout(() => {
        this.displaySerumMemoryContent(serumShaker);
      }, 2100);
    }

    // Âm thanh ngân vang pha lê ký ức ấm áp
    playMemoryChimeTone() {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        const frequencies = [587.33, 880.0, 1174.66]; // D5, A5, D6
        frequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);

          gain.gain.setValueAtTime(0.0001, now + idx * 0.05);
          gain.gain.linearRampToValueAtTime(0.016 / (idx + 1), now + idx * 0.05 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 1.25);
        });
      } catch (_) { }
    }

    // Âm thanh vệt sáng chạy lướt trên thân chai
    playLightGlideTone() {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2600, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(740, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.55);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.018, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.68);
      } catch (_) { }
    }

    // Điểm sáng chạy trên thân chai (Bước 2)
    runLightPointOnBottle(serumShaker, bottleBox) {
      if (!serumShaker) return;

      if (this.options.enableAudio) {
        this.playLightGlideTone();
      }

      const lightPoint = document.createElement('div');
      lightPoint.className = 'serum-light-point';
      lightPoint.innerHTML = `
        <div class="light-point-core"></div>
        <div class="light-point-spark">✦</div>
        <div class="light-point-glow"></div>
        <div class="light-point-tail"></div>
      `;
      serumShaker.appendChild(lightPoint);

      const sheen = document.createElement('div');
      sheen.className = 'serum-glass-sheen';
      serumShaker.appendChild(sheen);

      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          if (!serumShaker.parentElement) return;
          const spark = document.createElement('div');
          spark.className = 'serum-trail-sparkle';
          spark.style.left = `${(bottleBox.width * (0.46 + (Math.random() - 0.5) * 0.12)).toFixed(1)}px`;
          spark.style.top = `${(bottleBox.height * (0.22 + i * 0.13)).toFixed(1)}px`;
          serumShaker.appendChild(spark);
          setTimeout(() => spark.remove(), 600);
        }, i * 120);
      }

      setTimeout(() => {
        if (lightPoint.parentElement) lightPoint.remove();
        if (sheen.parentElement) sheen.remove();
      }, 950);
    }

    // Hào quang tách cành hoa phía sau (Bước 3)
    createBranchPartingFlash(x, y) {
      const fRect = this.container.getBoundingClientRect();
      const localX = x - fRect.left;
      const localY = y - fRect.top;

      const flash = document.createElement('div');
      flash.className = 'serum-branch-parting-burst';
      flash.style.left = `${localX.toFixed(1)}px`;
      flash.style.top = `${localY.toFixed(1)}px`;
      this.container.appendChild(flash);

      for (let i = 0; i < 6; i++) {
        const dot = document.createElement('div');
        dot.className = 'interaction-sparkle-dot';
        dot.style.left = `${localX.toFixed(1)}px`;
        dot.style.top = `${localY.toFixed(1)}px`;
        const angle = (i / 6) * Math.PI * 2;
        const dist = 14 + Math.random() * 20;
        dot.style.setProperty('--dx', `${(Math.cos(angle) * dist).toFixed(1)}px`);
        dot.style.setProperty('--dy', `${(Math.sin(angle) * dist).toFixed(1)}px`);
        this.container.appendChild(dot);
        setTimeout(() => dot.remove(), 600);
      }

      setTimeout(() => flash.remove(), 850);
    }

    // Glow xanh lan nhẹ (Bước 6)
    spreadGentleCyanGlow(bottleBox) {
      let glow = document.getElementById('serumMemoryGlow');
      if (glow) glow.remove();

      glow = document.createElement('div');
      glow.id = 'serumMemoryGlow';
      glow.className = 'serum-memory-glow';
      glow.style.left = `${(bottleBox.left + bottleBox.width * 0.5).toFixed(1)}px`;
      glow.style.top = `${(bottleBox.top + bottleBox.height * 0.55).toFixed(1)}px`;
      this.container.appendChild(glow);

      requestAnimationFrame(() => {
        glow.classList.add('active');
      });
    }

    // Background giảm sáng nhẹ (Bước 7)
    dimBackgroundGently() {
      let backdrop = document.getElementById('serumMemoryBackdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'serumMemoryBackdrop';
        backdrop.className = 'serum-memory-backdrop';
        this.container.appendChild(backdrop);
      }

      requestAnimationFrame(() => {
        backdrop.classList.add('active');
      });
    }

    // Hiển thị nội dung ký ức từng dòng mềm mại (Bước 8)
    displaySerumMemoryContent(serumShaker) {
      const existing = document.getElementById('serumMemoryModal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.className = 'serum-memory-modal';
      modal.id = 'serumMemoryModal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'memoryModalTitle');

      modal.innerHTML = `
        <div class="serum-memory-card" id="serumMemoryCard">
          <div class="memory-card-halo"></div>

          <div class="memory-header-ornament" aria-hidden="true">
            <span class="memory-star-icon">✦</span>
            <span class="memory-diamond-icon">✧</span>
            <span class="memory-star-icon">✦</span>
          </div>

          <h2 class="memory-title" id="memoryModalTitle">KÝ ỨC</h2>

          <div class="memory-divider" aria-hidden="true">
            <span class="memory-divider-line"></span>
            <span class="memory-divider-gem">❖</span>
            <span class="memory-divider-line"></span>
          </div>

          <div class="memory-lines-container">
            <p class="memory-line memory-line-1">“Có những ngày chẳng có gì đặc biệt...</p>
            <div class="memory-line-spacer" aria-hidden="true"></div>
            <p class="memory-line memory-line-2">nhưng khi nhớ lại,</p>
            <p class="memory-line memory-line-3">ta vẫn mỉm cười.”</p>
          </div>

          <div class="memory-serum-tag">
            <span class="serum-tag-dot"></span>
            <span class="serum-tag-text">Rejuvenating Serum • Giọt Ký Ức Đậu Biếc</span>
          </div>

          <div class="memory-action-footer">
            <button type="button" class="memory-close-btn" id="serumMemoryCloseBtn" aria-label="Đóng ký ức">
              <span class="memory-close-bracket">[</span>
              <span class="memory-close-text">Đóng</span>
              <span class="memory-close-bracket">]</span>
            </button>
          </div>
        </div>
      `;

      this.container.appendChild(modal);

      const card = modal.querySelector('#serumMemoryCard');
      const closeBtn = modal.querySelector('#serumMemoryCloseBtn');

      requestAnimationFrame(() => {
        modal.classList.add('active');
        if (card) {
          card.classList.add('revealed');
        }
        if (closeBtn) {
          setTimeout(() => closeBtn.focus(), 3200);
        }
      });

      // Đóng ký ức: NGƯỜI DÙNG TỰ ĐÓNG BẰNG NÚT "ĐÓNG", KHÔNG TỰ ĐỘNG ĐÓNG
      const closeMemoryModal = () => {
        modal.classList.add('closing');
        modal.classList.remove('active');

        if (serumShaker) {
          serumShaker.classList.add('shaker-fade-out');
        }

        const glow = document.getElementById('serumMemoryGlow');
        if (glow) {
          glow.classList.remove('active');
          glow.classList.add('dissolving');
        }

        const backdrop = document.getElementById('serumMemoryBackdrop');
        if (backdrop) {
          backdrop.classList.remove('active');
        }

        const branchLeftEl = document.getElementById('branchLeft');
        if (branchLeftEl) {
          branchLeftEl.classList.remove('branch-detaching');
          branchLeftEl.classList.add('branch-regrowing');
          setTimeout(() => {
            if (branchLeftEl) branchLeftEl.classList.remove('branch-regrowing');
          }, 2600);
        }

        setTimeout(() => {
          modal.remove();
          if (backdrop) backdrop.remove();
          if (glow) glow.remove();
          if (serumShaker) serumShaker.remove();
          this.activeSequences.delete('serum');
          if (window.discoveryEngine) {
            window.discoveryEngine.onSequenceClosed('serum');
          }
        }, 650);

        document.removeEventListener('keydown', handleKeydown);
      };

      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          closeMemoryModal();
        }
      };

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeMemoryModal();
        });
      }

      const backdrop = document.getElementById('serumMemoryBackdrop');
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          e.stopPropagation();
          closeMemoryModal();
        });
      }

      document.addEventListener('keydown', handleKeydown);
    }

    // ============================================================
    // CREAM = DÒNG THỜI GIAN (THIẾT KẾ CHỨC NĂNG DÀNH RIÊNG CHO HŨ RADIANCE CREAM)
    // ============================================================
    // 1. Ánh sáng vàng/hồng chạy nhẹ quanh hũ.
    // 2. Một vài cánh hoa rơi xuống mặt bàn.
    // 3. Các cánh hoa tạo thành một đường cong.
    // 4. Đường cong biến thành timeline (DAY 01 ↓ DAY 07 ↓ DAY 30 ↓ DAY 50 ↓ DAY 100).
    // Mỗi mốc chứa một kỷ niệm.
    // Khi người dùng chọn một mốc:
    // - Cành hoa bay ra.
    // - Background chuyển nhẹ.
    // - Nội dung kỷ niệm xuất hiện.
    // Timeline mang cảm giác được tạo nên từ những cánh hoa.
    // ============================================================

    static CREAM_TIMELINE_DATA = [
      {
        day: 'DAY 01',
        date: '30.08.2026',
        time: '13:30 • Chủ Nhật',
        title: 'Khoảnh Khắc Bắt Đầu',
        subtitle: 'Lời đồng ý ngọt ngào nhất thế gian',
        story: [
          '13:30 một chiều thu đẹp nhất, khoảnh khắc em mỉm cười gật đầu...',
          'Cả thế giới xung quanh dường như dừng lại, chỉ còn nhịp đập rộn ràng của hai trái tim.',
          'Từ giây phút ấy, từng cánh hoa đậu biếc nở rộ, ta chính thức thuộc về nhau.'
        ],
        quote: '“Em là điều kỳ diệu nhất mà định mệnh đã mang đến cho chị.”',
        tag: 'Khởi Đầu Tình Yêu',
        photo: 'assets/images/confess1.png',
        photoCaption: 'Khoảnh khắc đầu tiên ta thuộc về nhau • 30.08.2026',
        petalSprite: 'assets/images/falling_branches/petal_1.png'
      },
      {
        day: 'DAY 07',
        date: '06.09.2026',
        time: 'Tuần thứ nhất bên nhau',
        title: 'Những Rung Động Đầu Tiên',
        subtitle: 'Tin nhắn thâu đêm & nụ cười nàng thơ',
        story: [
          'Bảy ngày đầu tiên trôi qua trong những cuộc trò chuyện kéo dài đến tận nửa đêm.',
          'Mỗi sáng thức dậy, lời chào ngày mới của em làm tan biến mọi âu lo mệt mỏi.',
          'Cảm giác hồi hộp ngóng chờ từng tin nhắn ngọt ngào và êm dịu khôn nguôi.'
        ],
        quote: '“Chỉ cần nhìn thấy nụ cười của em, cả một ngày dài bỗng hóa dịu dàng.”',
        tag: 'Tuần Đầu Ngọt Ngào',
        photo: 'assets/images/confess2.png',
        photoCaption: 'Nụ cười nàng thơ thắp sáng những ngày đầu • 06.09.2026',
        petalSprite: 'assets/images/falling_branches/petal_2.png'
      },
      {
        day: 'DAY 30',
        date: '30.09.2026',
        time: 'Kỷ niệm tròn 1 tháng (C1M)',
        title: 'Tròn Một Tháng Bên Nhau',
        subtitle: 'C1M • Đóa hoa đậu biếc rực rỡ nhất',
        story: [
          'Ba mươi ngày yêu thương đong đầy, từng kỷ niệm nhỏ đều được nâng niu.',
          'Hũ Radiance Cream lưu giữ từng giọt sương sớm và ánh nắng ấm áp của tháng đầu tiên.',
          'C1M — Cột mốc tròn 1 tháng, minh chứng cho một tình yêu chân thành và bền chặt.'
        ],
        quote: '“C1M • Cảm ơn em vì đã đến bên chị, biến những ngày bình thường thành phép màu.”',
        tag: 'Cột Mốc C1M',
        photo: 'assets/images/confess3.png',
        photoCaption: 'Kỷ niệm C1M • Tròn 1 tháng gắn bó đong đầy • 30.09.2026',
        petalSprite: 'assets/images/falling_branches/petal_3.png'
      },
      {
        day: 'DAY 50',
        date: '20.10.2026',
        time: 'Những ngày thu êm đềm',
        title: 'Thói Quen Dịu Dàng',
        subtitle: 'Yêu thương trở thành điều tự nhiên như hơi thở',
        story: [
          'Khi việc nhớ về nhau đã trở thành hơi thở tự nhiên mỗi ngày.',
          'Nhớ giọng nói ngọt ngào, nhớ từng cử chỉ đáng yêu và ánh mắt thơ ngây của em.',
          'Tình yêu lớn dần qua những sẻ chia mộc mạc và sự thấu hiểu bình yên.'
        ],
        quote: '“Hạnh phúc lớn nhất là khi biết luôn có một người đang nhớ và đợi mình.”',
        tag: 'Gắn Kết Bình Yên',
        photo: 'assets/images/sample1.jpg',
        photoCaption: 'Bình yên bên em qua từng tháng ngày • 20.10.2026',
        petalSprite: 'assets/images/falling_branches/petal_4.png'
      },
      {
        day: 'DAY 100',
        date: '08.12.2026',
        time: 'Hành trình tương lai',
        title: 'Trăm Ngày & Mãi Mãi',
        subtitle: 'Lời hứa cùng nhau đi qua năm tháng',
        story: [
          'Một trăm ngày không phải đích đến, mà là lời khẳng định vững chắc.',
          'Như dòng chảy vô tận của thời gian, cánh hoa tình yêu sẽ mãi xanh biếc và ngát hương.',
          'Chị muốn cùng em đi qua 1 năm, 5 năm và trọn vẹn cả cuộc đời phía trước.'
        ],
        quote: '“Mong rằng người đầu tiên em nghĩ đến mỗi sớm mai và người chúc em ngủ ngon mỗi đêm... mãi là chị.”',
        tag: 'Mãi Mãi Về Sau',
        photo: 'assets/images/sample2.jpg',
        photoCaption: 'Hành trình 100 ngày và ngàn ngày sau nữa • 08.12.2026',
        petalSprite: 'assets/images/falling_branches/petal_5.png'
      }
    ];

    triggerCreamTimelineChoreography(bottle, clientX, clientY) {
      if (!bottle || !this.container) return;

      // Chống kích hoạt đúp nếu timeline đang hiển thị
      if (this.activeSequences.has('cream') || document.getElementById('creamTimelineContainer') || document.getElementById('creamMilestoneModal')) {
        return;
      }
      this.activeSequences.add('cream');
      this.dismissTouchHint();

      const fRect = this.container.getBoundingClientRect();
      const targetImg = document.querySelector('.main-uncut-image') || this.container.querySelector('img');
      const iRect = targetImg ? targetImg.getBoundingClientRect() : fRect;

      const bounds = bottle.bounds || { minX: 0.27, maxX: 0.43, minY: 0.54, maxY: 0.86 };
      const bottleBox = {
        left: bounds.minX * iRect.width + (iRect.left - fRect.left),
        top: bounds.minY * iRect.height + (iRect.top - fRect.top),
        width: (bounds.maxX - bounds.minX) * iRect.width,
        height: (bounds.maxY - bounds.minY) * iRect.height
      };

      const objCenterX = fRect.left + bottleBox.left + bottleBox.width * 0.5;
      const touchX = clientX !== undefined ? clientX : objCenterX;
      const touchY = clientY !== undefined ? clientY : (fRect.top + bottleBox.top + bottleBox.height * 0.5);

      // Phản hồi xúc giác & âm thanh chạm
      if (this.options.enableHaptics && window.navigator && window.navigator.vibrate) {
        try { window.navigator.vibrate([24, 32, 24]); } catch (_) { }
      }
      playCrystalTouchTone();
      this.createTouchWaveVisual(touchX, touchY);

      // Tạo phần tử cắt hũ kem để rung nhẹ & phát ánh hào quang
      const oldShaker = this.container.querySelector('.cream-timeline-bottle');
      if (oldShaker) oldShaker.remove();

      const creamShaker = document.createElement('div');
      creamShaker.className = 'bottle-shaker-element cream-timeline-bottle bottle-shaking';
      creamShaker.style.left = `${bottleBox.left.toFixed(1)}px`;
      creamShaker.style.top = `${bottleBox.top.toFixed(1)}px`;
      creamShaker.style.width = `${bottleBox.width.toFixed(1)}px`;
      creamShaker.style.height = `${bottleBox.height.toFixed(1)}px`;

      const shakerCanvas = document.createElement('canvas');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      shakerCanvas.width = Math.max(1, Math.round(bottleBox.width * dpr));
      shakerCanvas.height = Math.max(1, Math.round(bottleBox.height * dpr));
      shakerCanvas.style.width = '100%';
      shakerCanvas.style.height = '100%';

      const sCtx = shakerCanvas.getContext('2d');
      sCtx.scale(dpr, dpr);

      if (targetImg && targetImg.complete && targetImg.naturalWidth > 0) {
        const sx = bounds.minX * targetImg.naturalWidth;
        const sy = bounds.minY * targetImg.naturalHeight;
        const sw = (bounds.maxX - bounds.minX) * targetImg.naturalWidth;
        const sh = (bounds.maxY - bounds.minY) * targetImg.naturalHeight;
        sCtx.drawImage(targetImg, sx, sy, sw, sh, 0, 0, bottleBox.width, bottleBox.height);
      }
      creamShaker.appendChild(shakerCanvas);

      // Hào quang vàng hồng quanh hũ kem
      const auraEl = document.createElement('div');
      auraEl.className = 'cream-bottle-aura active';
      creamShaker.appendChild(auraEl);

      this.container.appendChild(creamShaker);

      // Sau 460ms kết thúc rung chuyển sang tập trung phát sáng
      setTimeout(() => {
        creamShaker.classList.remove('bottle-shaking');
        creamShaker.classList.add('bottle-focused');
      }, 460);

      this.addTableCausticWave(bottleBox.left + bottleBox.width * 0.5, bottleBox.top + bottleBox.height * 0.95);

      // ------------------------------------------------------------
      // BƯỚC 1: ÁNH SÁNG VÀNG/HỒNG CHẠY NHẸ QUANH HŨ (80ms - 900ms)
      // ------------------------------------------------------------
      setTimeout(() => {
        this.runCreamGoldPinkOrbit(creamShaker, bottleBox);
      }, 80);

      // ------------------------------------------------------------
      // BƯỚC 2: MỘT VÀI CÁNH HOA RƠI XUỐNG MẶT BÀN (750ms - 1700ms)
      // ------------------------------------------------------------
      let fallenPetals = [];
      setTimeout(() => {
        fallenPetals = this.dropPetalsOntoTable(bottleBox);
      }, 750);

      // ------------------------------------------------------------
      // BƯỚC 3: CÁC CÁNH HOA TẠO THÀNH MỘT ĐƯỜNG CONG (1700ms - 2600ms)
      // ------------------------------------------------------------
      setTimeout(() => {
        this.alignPetalsIntoCurve(fallenPetals, bottleBox);
      }, 1700);

      // ------------------------------------------------------------
      // BƯỚC 4: ĐƯỜNG CONG BIẾN THÀNH TIMELINE (2600ms+)
      // ------------------------------------------------------------
      setTimeout(() => {
        this.bloomCurveIntoTimeline(bottleBox, fallenPetals);
      }, 2600);
    }

    // 1. Ánh sáng vàng/hồng chạy quanh hũ kem
    runCreamGoldPinkOrbit(creamShaker, bottleBox) {
      if (!creamShaker) return;
      playCreamOrbitTone();

      const orbitWrap = document.createElement('div');
      orbitWrap.className = 'cream-orbit-wrap';

      const w = bottleBox.width;
      const h = bottleBox.height;
      const rx = (w * 0.48).toFixed(1);
      const ry = (h * 0.46).toFixed(1);
      const cx = (w * 0.5).toFixed(1);
      const cy = (h * 0.5).toFixed(1);

      orbitWrap.innerHTML = `
        <svg class="cream-orbit-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
          <defs>
            <linearGradient id="creamOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffd700" stop-opacity="0.95" />
              <stop offset="30%" stop-color="#fb7185" stop-opacity="0.92" />
              <stop offset="70%" stop-color="#f472b6" stop-opacity="0.88" />
              <stop offset="100%" stop-color="#fde047" stop-opacity="0.95" />
            </linearGradient>
            <filter id="creamOrbitGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <ellipse class="cream-orbit-track" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" />
          <ellipse class="cream-orbit-beam" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" filter="url(#creamOrbitGlow)" />
        </svg>
        <div class="cream-orbit-star"></div>
      `;
      creamShaker.appendChild(orbitWrap);

      // Thả 6 hạt bụi sáng vàng/hồng lơ lửng quanh viền hũ
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          if (!creamShaker.parentElement) return;
          const spark = document.createElement('div');
          spark.className = 'cream-spark-particle';
          const angle = (i / 6) * Math.PI * 2;
          const rX = w * 0.46;
          const rY = h * 0.44;
          const sx = w * 0.5 + Math.cos(angle) * rX;
          const sy = h * 0.5 + Math.sin(angle) * rY;
          spark.style.left = `${sx.toFixed(1)}px`;
          spark.style.top = `${sy.toFixed(1)}px`;
          creamShaker.appendChild(spark);
          setTimeout(() => spark.remove(), 700);
        }, i * 110);
      }

      setTimeout(() => {
        if (orbitWrap.parentElement) orbitWrap.remove();
      }, 1600);
    }

    // 2. Một vài cánh hoa rơi xuống mặt bàn
    dropPetalsOntoTable(bottleBox) {
      if (!this.container) return [];
      playPetalFlutterSound();

      const fRect = this.container.getBoundingClientRect();
      const petals = [];
      const petalSprites = [
        'assets/images/falling_branches/petal_1.png',
        'assets/images/falling_branches/petal_2.png',
        'assets/images/falling_branches/petal_3.png',
        'assets/images/falling_branches/petal_4.png',
        'assets/images/falling_branches/petal_5.png',
        'assets/images/falling_branches/petal_6.png'
      ];

      // Tọa độ rơi phân bố tự nhiên trên mặt bàn phía trước hũ
      const tableTargets = [
        { relX: 0.16, relY: 0.77, rot: -18, scale: 0.85 },
        { relX: 0.33, relY: 0.82, rot: 15, scale: 0.90 },
        { relX: 0.50, relY: 0.76, rot: -8, scale: 0.95 },
        { relX: 0.67, relY: 0.81, rot: 22, scale: 0.88 },
        { relX: 0.84, relY: 0.78, rot: -12, scale: 0.84 },
        { relX: 0.25, relY: 0.86, rot: 32, scale: 0.75 },
        { relX: 0.75, relY: 0.85, rot: -28, scale: 0.72 }
      ];

      const originX = bottleBox.left + bottleBox.width * 0.48;
      const originY = bottleBox.top + bottleBox.height * 0.68;

      const layer = document.createElement('div');
      layer.id = 'creamFallingPetalsLayer';
      layer.className = 'cream-falling-petals-layer';
      this.container.appendChild(layer);

      tableTargets.forEach((target, i) => {
        const petalEl = document.createElement('div');
        petalEl.className = 'cream-table-petal falling';
        petalEl.dataset.targetIndex = i;

        const img = document.createElement('img');
        img.src = petalSprites[i % petalSprites.length];
        img.alt = 'Cánh hoa đậu biếc';
        img.className = 'cream-petal-img';
        petalEl.appendChild(img);

        petalEl.style.left = `${originX.toFixed(1)}px`;
        petalEl.style.top = `${originY.toFixed(1)}px`;
        petalEl.style.transform = `translate(-50%, -50%) scale(0.2) rotate(${(Math.random() * 60 - 30).toFixed(0)}deg)`;
        petalEl.style.opacity = '0';

        layer.appendChild(petalEl);
        petals.push({ el: petalEl, target });

        const delay = i * 65;
        setTimeout(() => {
          petalEl.style.opacity = '1';
          const destX = target.relX * fRect.width;
          const destY = target.relY * fRect.height;
          petalEl.style.transition = `left 0.85s cubic-bezier(0.2, 0.8, 0.25, 1), top 0.92s cubic-bezier(0.34, 1.2, 0.64, 1), transform 0.92s cubic-bezier(0.2, 0.8, 0.25, 1), opacity 0.5s ease`;
          petalEl.style.left = `${destX.toFixed(1)}px`;
          petalEl.style.top = `${destY.toFixed(1)}px`;
          petalEl.style.transform = `translate(-50%, -50%) scale(${target.scale}) rotate(${target.rot}deg)`;

          setTimeout(() => {
            petalEl.classList.remove('falling');
            petalEl.classList.add('landed-on-table');
            this.addTableCausticWave(destX, destY);
          }, 850);
        }, delay);
      });

      return petals;
    }

    // 3. Các cánh hoa tạo thành một đường cong
    alignPetalsIntoCurve(fallenPetals, bottleBox) {
      if (!this.container) return;
      playSwipeWindTone(0.8);

      const fRect = this.container.getBoundingClientRect();
      const isMobile = fRect.width < 768;

      // Tọa độ đường cong uốn lượn S-Curve
      const curveCoords = isMobile ? [
        { relX: 0.26, relY: 0.24, rot: -10 },
        { relX: 0.72, relY: 0.38, rot: 15 },
        { relX: 0.28, relY: 0.52, rot: -12 },
        { relX: 0.70, relY: 0.66, rot: 18 },
        { relX: 0.32, relY: 0.80, rot: -8 }
      ] : [
        { relX: 0.14, relY: 0.75, rot: -16 },
        { relX: 0.32, relY: 0.64, rot: 12 },
        { relX: 0.50, relY: 0.76, rot: -10 },
        { relX: 0.68, relY: 0.65, rot: 14 },
        { relX: 0.86, relY: 0.74, rot: -14 }
      ];

      if (fallenPetals && fallenPetals.length) {
        fallenPetals.forEach((p, idx) => {
          if (idx < curveCoords.length) {
            const coord = curveCoords[idx];
            const destX = coord.relX * fRect.width;
            const destY = coord.relY * fRect.height;
            p.el.style.transition = 'left 0.75s cubic-bezier(0.25, 1, 0.5, 1), top 0.75s cubic-bezier(0.25, 1, 0.5, 1), transform 0.75s ease';
            p.el.style.left = `${destX.toFixed(1)}px`;
            p.el.style.top = `${destY.toFixed(1)}px`;
            p.el.style.transform = `translate(-50%, -50%) scale(0.9) rotate(${coord.rot}deg)`;
            p.el.classList.add('aligned-in-curve');
          } else {
            p.el.style.transition = 'opacity 0.6s ease';
            p.el.style.opacity = '0.35';
          }
        });
      }

      // Vẽ đường cong SVG mềm mại phát sáng nối các cánh hoa
      let svgLayer = document.getElementById('creamPetalCurveSvgLayer');
      if (svgLayer) svgLayer.remove();

      svgLayer = document.createElement('div');
      svgLayer.id = 'creamPetalCurveSvgLayer';
      svgLayer.className = 'cream-petal-curve-svg-layer';

      let pathD = '';
      if (isMobile) {
        const p = curveCoords.map(c => ({ x: c.relX * fRect.width, y: c.relY * fRect.height }));
        pathD = `M ${p[0].x} ${p[0].y} C ${p[0].x + 120} ${p[0].y + 40}, ${p[1].x + 40} ${p[1].y - 60}, ${p[1].x} ${p[1].y} C ${p[1].x - 140} ${p[1].y + 60}, ${p[2].x - 60} ${p[2].y - 60}, ${p[2].x} ${p[2].y} C ${p[2].x + 140} ${p[2].y + 60}, ${p[3].x + 60} ${p[3].y - 60}, ${p[3].x} ${p[3].y} C ${p[3].x - 120} ${p[3].y + 60}, ${p[4].x + 20} ${p[4].y - 40}, ${p[4].x} ${p[4].y}`;
      } else {
        const p = curveCoords.map(c => ({ x: c.relX * fRect.width, y: c.relY * fRect.height }));
        pathD = `M ${p[0].x} ${p[0].y} Q ${p[0].x + 70} ${p[1].y - 30}, ${p[1].x} ${p[1].y} T ${p[2].x} ${p[2].y} T ${p[3].x} ${p[3].y} T ${p[4].x} ${p[4].y}`;
      }

      svgLayer.innerHTML = `
        <svg class="cream-curve-svg" width="${fRect.width}" height="${fRect.height}" viewBox="0 0 ${fRect.width} ${fRect.height}">
          <defs>
            <linearGradient id="curveTrackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ffd700" stop-opacity="0.9" />
              <stop offset="25%" stop-color="#fb7185" stop-opacity="0.9" />
              <stop offset="50%" stop-color="#c084fc" stop-opacity="0.85" />
              <stop offset="75%" stop-color="#38bdf8" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#ffd700" stop-opacity="0.9" />
            </linearGradient>
            <filter id="curvePathGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path class="curve-trail-glow" d="${pathD}" filter="url(#curvePathGlow)" />
          <path class="curve-trail-core" d="${pathD}" />
        </svg>
      `;
      this.container.appendChild(svgLayer);
    }

    // 4. Đường cong biến thành Dòng Thời Gian (Timeline)
    bloomCurveIntoTimeline(bottleBox, fallenPetals) {
      if (!this.container) return;
      playTimelineBloomTone();

      // Dọn dẹp layer cánh hoa tạm thời trên bàn
      const fallingLayer = document.getElementById('creamFallingPetalsLayer');
      if (fallingLayer) {
        fallingLayer.style.transition = 'opacity 0.6s ease';
        fallingLayer.style.opacity = '0';
        setTimeout(() => fallingLayer.remove(), 600);
      }
      const curveSvg = document.getElementById('creamPetalCurveSvgLayer');
      if (curveSvg) {
        curveSvg.style.transition = 'opacity 0.6s ease';
        curveSvg.style.opacity = '0';
        setTimeout(() => curveSvg.remove(), 600);
      }

      // Xóa timeline cũ nếu có
      const oldTimeline = document.getElementById('creamTimelineContainer');
      if (oldTimeline) oldTimeline.remove();

      const fRect = this.container.getBoundingClientRect();
      const isMobile = fRect.width < 768;
      const milestones = InteractionEngine.CREAM_TIMELINE_DATA;

      // Tạo Container chính của Dòng Thời Gian
      const timelineContainer = document.createElement('div');
      timelineContainer.id = 'creamTimelineContainer';
      timelineContainer.className = `cream-timeline-container ${isMobile ? 'layout-vertical' : 'layout-horizontal'}`;

      // Backdrop giảm sáng và chuyển sắc thái êm đềm
      const backdrop = document.createElement('div');
      backdrop.id = 'creamTimelineBackdrop';
      backdrop.className = 'cream-timeline-backdrop active';
      timelineContainer.appendChild(backdrop);

      // Header Dòng Thời Gian
      const headerEl = document.createElement('div');
      headerEl.className = 'cream-timeline-header';
      headerEl.innerHTML = `
        <div class="cream-timeline-header-inner">
          <div class="cream-tag-wrap">
            <span class="cream-header-petal-icon">🌸</span>
            <span class="cream-header-tag">CREAM = DÒNG THỜI GIAN</span>
            <span class="cream-header-petal-icon">✨</span>
          </div>
          <p class="cream-header-sub">Hành trình yêu thương của Cá Sudo ♡ Khây Ti kết tinh từ những cánh hoa</p>
          <div class="cream-timeline-instruction">
            <i class="fa-solid fa-hand-pointer"></i> Chạm vào từng mốc thời gian để mở cánh hoa kỷ niệm
          </div>
        </div>
        <button type="button" class="cream-timeline-exit-btn" id="creamTimelineExitBtn" title="Đóng Dòng Thời Gian" aria-label="Đóng">
          <i class="fa-solid fa-xmark"></i>
          <span>Đóng</span>
        </button>
      `;
      timelineContainer.appendChild(headerEl);

      // Wrapper cành hoa & các node mốc
      const trackWrap = document.createElement('div');
      trackWrap.className = 'cream-timeline-track-wrap';

      const svgD = isMobile
        ? "M 150 50 C 320 130, 320 210, 150 290 C -20 370, -20 450, 150 530"
        : "M 80 180 Q 220 90, 360 170 T 640 170 T 920 180";
      const svgViewBox = isMobile ? "0 0 300 600" : "0 0 1000 320";

      trackWrap.innerHTML = `
        <svg class="timeline-vine-svg" viewBox="${svgViewBox}" preserveAspectRatio="none">
          <defs>
            <linearGradient id="vineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffd700" stop-opacity="0.9" />
              <stop offset="25%" stop-color="#fb7185" stop-opacity="0.9" />
              <stop offset="50%" stop-color="#c084fc" stop-opacity="0.85" />
              <stop offset="75%" stop-color="#38bdf8" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#fde047" stop-opacity="0.95" />
            </linearGradient>
            <filter id="vineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path class="vine-path-glow" d="${svgD}" filter="url(#vineGlow)" />
          <path class="vine-path-core" d="${svgD}" />
        </svg>
      `;

      // 5 Nodes Milestone
      const nodesContainer = document.createElement('div');
      nodesContainer.className = 'cream-milestone-nodes-container';

      milestones.forEach((m, idx) => {
        const nodeBtn = document.createElement('button');
        nodeBtn.type = 'button';
        nodeBtn.className = `cream-milestone-node node-idx-${idx}`;
        nodeBtn.dataset.index = idx;
        nodeBtn.title = `${m.day}: ${m.title} (${m.date})`;
        nodeBtn.setAttribute('aria-label', `${m.day}: ${m.title}`);

        nodeBtn.innerHTML = `
          <div class="node-flower-rosette">
            <div class="rosette-petals-cluster">
              <img src="assets/images/falling_branches/petal_1.png" alt="" class="rosette-petal p-1" />
              <img src="assets/images/falling_branches/petal_2.png" alt="" class="rosette-petal p-2" />
              <img src="assets/images/falling_branches/petal_3.png" alt="" class="rosette-petal p-3" />
              <img src="assets/images/falling_branches/petal_4.png" alt="" class="rosette-petal p-4" />
            </div>
            <div class="rosette-center-pistil">
              <span class="pistil-gem"></span>
              <span class="pistil-pulse"></span>
            </div>
          </div>
          <div class="node-info-badge">
            <div class="node-day-pill">${m.day}</div>
            <div class="node-date-text">${m.date}</div>
            <div class="node-title-text">${m.title}</div>
            ${idx < milestones.length - 1 ? '<div class="node-arrow-down" title="Mốc tiếp theo">↓</div>' : ''}
          </div>
        `;

        nodeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectTimelineMilestone(m, nodeBtn, idx, milestones);
        });

        nodesContainer.appendChild(nodeBtn);
      });

      trackWrap.appendChild(nodesContainer);
      timelineContainer.appendChild(trackWrap);
      this.container.appendChild(timelineContainer);

      requestAnimationFrame(() => {
        timelineContainer.classList.add('active');
      });

      const exitBtn = timelineContainer.querySelector('#creamTimelineExitBtn');
      if (exitBtn) {
        exitBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.closeCreamTimeline();
        });
      }

      backdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        if (document.getElementById('creamMilestoneModal')) {
          this.closeMilestoneModal();
        } else {
          this.closeCreamTimeline();
        }
      });
    }

    // 5. Khi người dùng chọn một mốc: Cành hoa bay ra, background chuyển nhẹ, nội dung kỷ niệm xuất hiện
    selectTimelineMilestone(m, nodeEl, index, milestones) {
      if (!m || !this.container) return;
      playMilestoneSelectTone();

      const allNodes = this.container.querySelectorAll('.cream-milestone-node');
      allNodes.forEach(n => n.classList.remove('active-blooming'));
      if (nodeEl) nodeEl.classList.add('active-blooming');

      const fRect = this.container.getBoundingClientRect();
      const nodeRect = nodeEl ? nodeEl.getBoundingClientRect() : fRect;
      const nodeCenterX = nodeEl ? (nodeRect.left + nodeRect.width * 0.5) : (fRect.left + fRect.width * 0.5);
      const nodeCenterY = nodeEl ? (nodeRect.top + nodeRect.height * 0.5) : (fRect.top + fRect.height * 0.6);

      // CÀNH HOA BAY RA
      if (window.branchEngine) {
        window.branchEngine.launch({
          originX: nodeCenterX,
          originY: nodeCenterY,
          dir: index % 2 === 0 ? 1 : -1,
          branchIndex: index % 3,
          trajectory: index % 2 === 0 ? 'A' : 'C',
          allowPetalDetach: true
        });
      }

      // Bung cánh hoa bay lượn
      if (window.petalEngine) {
        window.petalEngine.toss({
          x: nodeCenterX,
          y: nodeCenterY,
          count: 8,
          force: 1.15,
          angle: -Math.PI * 0.5 + (Math.random() - 0.5) * 0.7,
          spread: 0.65
        });
      }

      // BACKGROUND CHUYỂN NHẸ
      const backdrop = document.getElementById('creamTimelineBackdrop');
      if (backdrop) {
        backdrop.classList.add('reading-milestone');
      }

      // NỘI DUNG KỶ NIỆM XUẤT HIỆN
      this.displayMilestoneMemoryModal(m, index, milestones);
    }

    // Hiển thị Card Kỷ Niệm của từng Cột Mốc
    displayMilestoneMemoryModal(m, index, milestones) {
      let modal = document.getElementById('creamMilestoneModal');

      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'creamMilestoneModal';
        modal.className = 'cream-milestone-modal';
        this.container.appendChild(modal);
      } else {
        modal.classList.add('crossfading');
      }

      const prevMilestone = index > 0 ? milestones[index - 1] : null;
      const nextMilestone = index < milestones.length - 1 ? milestones[index + 1] : null;

      const cardHtml = `
        <div class="cream-milestone-card" id="creamMilestoneCard">
          <div class="milestone-card-halo"></div>
          
          <div class="milestone-card-topbar">
            <div class="milestone-tag-pill">
              <span class="tag-icon">🌸</span>
              <span class="tag-text">CỘT MỐC THỜI GIAN • ${m.day}</span>
            </div>
            <button type="button" class="milestone-close-icon-btn" id="milestoneCardCloseBtn" title="Đóng kỷ niệm" aria-label="Đóng">
              <i class="fa-solid fa-xmark"></i> <span>Đóng</span>
            </button>
          </div>

          <div class="milestone-card-header">
            <h3 class="milestone-main-title">${m.title}</h3>
            <div class="milestone-time-sub">
              <i class="fa-regular fa-clock"></i> ${m.time} • ${m.date}
            </div>
          </div>

          <div class="milestone-photo-polaroid">
            <div class="polaroid-frame">
              <img src="${m.photo}" alt="${m.title}" class="polaroid-img" />
              <div class="polaroid-caption">${m.photoCaption}</div>
            </div>
          </div>

          <div class="milestone-floral-divider">
            <span class="divider-line"></span>
            <span class="divider-gem">✤ 🌸 ✤</span>
            <span class="divider-line"></span>
          </div>

          <div class="milestone-story-lines">
            <p class="story-line line-1">${m.story[0]}</p>
            <p class="story-line line-2">${m.story[1]}</p>
            <p class="story-line line-3">${m.story[2]}</p>
          </div>

          <div class="milestone-quote-box">
            <p class="quote-text">${m.quote}</p>
          </div>

          <div class="milestone-card-nav-footer">
            <button type="button" class="milestone-nav-btn prev-btn ${!prevMilestone ? 'disabled' : ''}" id="milestonePrevBtn" ${!prevMilestone ? 'disabled' : ''}>
              <i class="fa-solid fa-arrow-left"></i> ${prevMilestone ? prevMilestone.day : 'Đầu'}
            </button>
            <button type="button" class="milestone-back-timeline-btn" id="milestoneBackTimelineBtn">
              🌸 Dòng Thời Gian
            </button>
            <button type="button" class="milestone-nav-btn next-btn ${!nextMilestone ? 'disabled' : ''}" id="milestoneNextBtn" ${!nextMilestone ? 'disabled' : ''}>
              ${nextMilestone ? nextMilestone.day : 'Cuối'} <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      `;

      modal.innerHTML = cardHtml;

      requestAnimationFrame(() => {
        modal.classList.remove('crossfading');
        modal.classList.add('active');
        const card = modal.querySelector('#creamMilestoneCard');
        if (card) card.classList.add('revealed');
      });

      const closeBtn = modal.querySelector('#milestoneCardCloseBtn');
      const backTimelineBtn = modal.querySelector('#milestoneBackTimelineBtn');
      const prevBtn = modal.querySelector('#milestonePrevBtn');
      const nextBtn = modal.querySelector('#milestoneNextBtn');

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.closeMilestoneModal();
        });
      }

      if (backTimelineBtn) {
        backTimelineBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.closeMilestoneModal();
        });
      }

      if (prevBtn && prevMilestone) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetNode = this.container.querySelector(`.cream-milestone-node[data-index="${index - 1}"]`);
          this.selectTimelineMilestone(prevMilestone, targetNode, index - 1, milestones);
        });
      }

      if (nextBtn && nextMilestone) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetNode = this.container.querySelector(`.cream-milestone-node[data-index="${index + 1}"]`);
          this.selectTimelineMilestone(nextMilestone, targetNode, index + 1, milestones);
        });
      }

      const handleModalKey = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          this.closeMilestoneModal();
          document.removeEventListener('keydown', handleModalKey);
        } else if (e.key === 'ArrowLeft' && prevMilestone) {
          e.preventDefault();
          document.removeEventListener('keydown', handleModalKey);
          const targetNode = this.container.querySelector(`.cream-milestone-node[data-index="${index - 1}"]`);
          this.selectTimelineMilestone(prevMilestone, targetNode, index - 1, milestones);
        } else if (e.key === 'ArrowRight' && nextMilestone) {
          e.preventDefault();
          document.removeEventListener('keydown', handleModalKey);
          const targetNode = this.container.querySelector(`.cream-milestone-node[data-index="${index + 1}"]`);
          this.selectTimelineMilestone(nextMilestone, targetNode, index + 1, milestones);
        }
      };
      document.addEventListener('keydown', handleModalKey);
    }

    // Đóng Card Kỷ Niệm quay lại màn hình Dòng Thời Gian
    closeMilestoneModal() {
      const modal = document.getElementById('creamMilestoneModal');
      if (modal) {
        modal.classList.add('closing');
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 420);
      }
      const backdrop = document.getElementById('creamTimelineBackdrop');
      if (backdrop) {
        backdrop.classList.remove('reading-milestone');
      }
    }

    // Đóng hoàn toàn Dòng Thời Gian
    closeCreamTimeline() {
      this.closeMilestoneModal();

      const timelineContainer = document.getElementById('creamTimelineContainer');
      if (timelineContainer) {
        timelineContainer.classList.remove('active');
        timelineContainer.classList.add('closing');
        setTimeout(() => timelineContainer.remove(), 600);
      }

      const creamShaker = this.container.querySelector('.cream-timeline-bottle');
      if (creamShaker) {
        creamShaker.classList.add('shaker-fade-out');
        setTimeout(() => creamShaker.remove(), 600);
      }

      setTimeout(() => {
        this.activeSequences.delete('cream');
        if (window.discoveryEngine) {
          window.discoveryEngine.onSequenceClosed('cream');
        }
      }, 650);
    }

    // ============================================================
    // TONER = LỜI NHẮN (THIẾT KẾ CHỨC NĂNG DÀNH RIÊNG CHO CHAI HYDRATING TONER)
    // ============================================================
    // Quy trình tương tác tuần tự tinh xảo:
    // 1. Các giọt nước trên chai phát sáng (0ms - 600ms)
    // 2. Các hạt sáng bay lên (350ms - 1500ms)
    // 3. Một cành hoa xuất hiện (800ms)
    // 4. Cành hoa uốn lượn theo đường bay trajectory về trung tâm (950ms - 2900ms)
    // 5. Cuối trajectory, hiệu ứng biến thành một lá thư (2800ms - 3400ms)
    // 6. Lá thư xuất hiện ở trung tâm màn hình (3200ms+)
    // 
    // Nội dung thư có thể chỉnh sửa bằng dữ liệu JavaScript hoặc JSON.
    // Người dùng tự đóng lá thư bằng nút đóng.
    // ============================================================

    static TONER_LETTER_DATA = {
      salutation: "Gửi em,",
      paragraphs: [
        "Cảm ơn vì đã xuất hiện",
        "trong những ngày bình thường",
        "và khiến chúng trở nên",
        "đặc biệt hơn."
      ],
      closing: "Thương em,",
      sender: "Cá Sudo ♡ Khây Ti",
      date: "C1M • 2026",
      tag: "Hydrating Toner • Lời Nhắn Dành Cho Em"
    };

    triggerTonerMessageChoreography(bottle, clientX, clientY) {
      if (!bottle || !this.container) return;

      // Chống kích hoạt đúp nếu đang hiển thị lá thư
      if (this.activeSequences.has('toner') || document.getElementById('tonerMessageModal')) {
        return;
      }
      this.activeSequences.add('toner');
      this.dismissTouchHint();

      const fRect = this.container.getBoundingClientRect();
      const targetImg = document.querySelector('.main-uncut-image') || this.container.querySelector('img');
      const iRect = targetImg ? targetImg.getBoundingClientRect() : fRect;

      const bounds = bottle.bounds || { minX: 0.54, maxX: 0.66, minY: 0.31, maxY: 0.85 };
      const bottleBox = {
        left: bounds.minX * iRect.width + (iRect.left - fRect.left),
        top: bounds.minY * iRect.height + (iRect.top - fRect.top),
        width: (bounds.maxX - bounds.minX) * iRect.width,
        height: (bounds.maxY - bounds.minY) * iRect.height
      };

      const objCenterX = fRect.left + bottleBox.left + bottleBox.width * 0.5;
      const touchX = clientX !== undefined ? clientX : objCenterX;
      const touchY = clientY !== undefined ? clientY : (fRect.top + bottleBox.top + bottleBox.height * 0.45);

      // Phản hồi xúc giác & âm thanh giọt nước ban đầu
      if (this.options.enableHaptics && window.navigator && window.navigator.vibrate) {
        try { window.navigator.vibrate([18, 30, 18]); } catch (_) { }
      }
      if (this.options.enableAudio) {
        this.playDewdropGlowTone();
      }

      this.createTouchWaveVisual(touchX, touchY);
      this.addTableCausticWave(bottleBox.left + bottleBox.width * 0.5, bottleBox.top + bottleBox.height * 0.95);

      // ------------------------------------------------------------
      // BƯỚC 1: CÁC GIỌT NƯỚC TRÊN CHAI PHÁT SÁNG (0ms - 600ms)
      // ------------------------------------------------------------
      const oldShaker = this.container.querySelector('.toner-message-bottle');
      if (oldShaker) oldShaker.remove();

      const tonerShaker = document.createElement('div');
      tonerShaker.className = 'bottle-shaker-element toner-message-bottle bottle-focused';
      tonerShaker.style.left = `${bottleBox.left.toFixed(1)}px`;
      tonerShaker.style.top = `${bottleBox.top.toFixed(1)}px`;
      tonerShaker.style.width = `${bottleBox.width.toFixed(1)}px`;
      tonerShaker.style.height = `${bottleBox.height.toFixed(1)}px`;

      // Hào quang xanh ngọc sương nước bao bọc thân chai
      const auraEl = document.createElement('div');
      auraEl.className = 'toner-bottle-aura active';
      tonerShaker.appendChild(auraEl);

      // Vệt sáng lướt qua thân chai thủy tinh
      const sheenEl = document.createElement('div');
      sheenEl.className = 'toner-glass-sheen';
      tonerShaker.appendChild(sheenEl);

      // Tạo các giọt nước trong suốt phát sáng lung linh bám dọc thân chai
      this.createTonerWaterDrops(tonerShaker, bottleBox);

      this.container.appendChild(tonerShaker);

      // ------------------------------------------------------------
      // BƯỚC 2: CÁC HẠT SÁNG BAY LÊN (350ms - 1500ms)
      // ------------------------------------------------------------
      setTimeout(() => {
        if (this.options.enableAudio) {
          this.playFloatingParticlesTone();
        }
        this.spawnTonerRisingParticles(bottleBox);
      }, 350);

      // ------------------------------------------------------------
      // BƯỚC 3: MỘT CÀNH HOA XUẤT HIỆN (800ms)
      // ------------------------------------------------------------
      const branchOriginX = fRect.left + bottleBox.left + bottleBox.width * 0.52;
      const branchOriginY = fRect.top + bottleBox.top + bottleBox.height * 0.12;

      setTimeout(() => {
        this.spawnBranchEmergenceFlash(branchOriginX, branchOriginY);
      }, 780);

      // ------------------------------------------------------------
      // BƯỚC 4: CÀNH HOA UỐN LƯỢN THEO ĐƯỜNG BAY (TRAJECTORY) (950ms)
      // ------------------------------------------------------------
      setTimeout(() => {
        // Tọa độ trung tâm màn hình (đích đến của lá thư)
        const centerScreenX = fRect.left + fRect.width * 0.50;
        const centerScreenY = fRect.top + fRect.height * 0.46;

        const deltaX = centerScreenX - branchOriginX;
        const deltaY = centerScreenY - branchOriginY;

        // Quỹ đạo Spline uốn lượn hình sóng gió từ chai toner về trung tâm
        const tonerTrajectory = {
          id: 'TONER_TO_CENTER',
          name: 'Quỹ đạo cành hoa dẫn lối lời nhắn',
          baseDuration: 2200,
          points: [
            { x: 35, y: 40 },                                // P0: Tiếp tuyến phóng ban đầu
            { x: 0, y: 0 },                                  // P1: Điểm cành hoa xuất hiện (đỉnh chai toner)
            { x: 60, y: -90 },                               // P2: Vút lên cao sang phải đón luồng gió hạt sáng
            { x: -15, y: -130 },                             // P3: Uốn đỉnh vòm lượn cong mềm mại sang trái
            { x: deltaX * 0.58 + 25, y: deltaY * 0.45 - 25 },// P4: Đáy võng lượn hướng vào trung tâm
            { x: deltaX, y: deltaY },                        // P5: ĐÍCH ĐẾN CHÍNH XÁC TẠI TRUNG TÂM MÀN HÌNH
            { x: deltaX - 10, y: deltaY + 5 }                // P6: Tiếp tuyến hãm phanh êm ái
          ]
        };

        let transformStarted = false;

        // Bộ hẹn giờ an toàn đảm bảo lá thư xuất hiện đúng hẹn kể cả khi trình duyệt giảm FPS
        const safetyTimer = setTimeout(() => {
          if (!transformStarted) {
            transformStarted = true;
            this.triggerLetterTransformation(centerScreenX, centerScreenY, tonerShaker);
          }
        }, 2250);

        if (window.branchEngine) {
          window.branchEngine.launch({
            originX: branchOriginX,
            originY: branchOriginY,
            branchIndex: 0, // Cành hoa 1 xanh ngát đọng hoa đậu biếc tím biếc
            trajectory: tonerTrajectory,
            dir: 1,
            distScale: 1.0,
            duration: 2150,
            allowPetalDetach: true,
            onProgress: (progress, curX, curY) => {
              // Bụi sáng lấp lánh nối dài theo đường bay
              if (Math.random() < 0.4) {
                this.spawnFlightStardust(curX, curY);
              }

              // ------------------------------------------------------------
              // BƯỚC 5: CUỐI TRAJECTORY, HIỆU ỨNG BIẾN THÀNH MỘT LÁ THƯ
              // ------------------------------------------------------------
              if (progress >= 0.94 && !transformStarted) {
                transformStarted = true;
                clearTimeout(safetyTimer);
                this.triggerLetterTransformation(curX, curY, tonerShaker);
              }
            },
            onComplete: (endX, endY) => {
              if (!transformStarted) {
                transformStarted = true;
                clearTimeout(safetyTimer);
                this.triggerLetterTransformation(endX, endY, tonerShaker);
              }
            }
          });
        } else {
          // Fallback an toàn nếu chưa tải branchEngine
          setTimeout(() => {
            if (!transformStarted) {
              transformStarted = true;
              clearTimeout(safetyTimer);
              this.triggerLetterTransformation(centerScreenX, centerScreenY, tonerShaker);
            }
          }, 1800);
        }
      }, 950);
    }

    // 1. Tạo các giọt nước trên thân chai phát sáng lung linh
    createTonerWaterDrops(tonerShaker, bottleBox) {
      if (!tonerShaker) return;

      const dropConfigs = [
        { left: '38%', top: '22%', size: 9, delay: 0 },
        { left: '62%', top: '26%', size: 11, delay: 50 },
        { left: '26%', top: '35%', size: 8, delay: 90 },
        { left: '50%', top: '38%', size: 14, delay: 130 },
        { left: '72%', top: '44%', size: 10, delay: 170 },
        { left: '34%', top: '50%', size: 12, delay: 210 },
        { left: '58%', top: '56%', size: 13, delay: 250 },
        { left: '22%', top: '63%', size: 9, delay: 290 },
        { left: '46%', top: '68%', size: 15, delay: 330 },
        { left: '68%', top: '74%', size: 11, delay: 370 },
        { left: '36%', top: '80%', size: 10, delay: 410 },
        { left: '54%', top: '85%', size: 12, delay: 450 },
        { left: '42%', top: '16%', size: 7, delay: 60 },
        { left: '65%', top: '62%', size: 9, delay: 280 }
      ];

      dropConfigs.forEach((cfg) => {
        const drop = document.createElement('div');
        drop.className = 'toner-water-drop';
        drop.style.left = cfg.left;
        drop.style.top = cfg.top;
        drop.style.width = `${cfg.size}px`;
        drop.style.height = `${Math.round(cfg.size * 1.25)}px`;
        drop.style.animationDelay = `${cfg.delay}ms`;

        // Lớp phản chiếu ánh sáng và khúc xạ giọt sương thủy tinh
        const glint = document.createElement('span');
        glint.className = 'toner-drop-glint';
        drop.appendChild(glint);

        const refraction = document.createElement('span');
        refraction.className = 'toner-drop-refraction';
        drop.appendChild(refraction);

        tonerShaker.appendChild(drop);
      });
    }

    // 2. Tạo các hạt sáng bay lên từ thân chai toner
    spawnTonerRisingParticles(bottleBox) {
      if (!this.container) return;

      const count = 30;

      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          if (!this.activeSequences.has('toner')) return;

          const p = document.createElement('div');
          p.className = 'toner-rising-mote';

          // Xuất phát từ mặt chai hoặc vai chai toner
          const startRelX = 0.25 + Math.random() * 0.50;
          const startRelY = 0.20 + Math.random() * 0.70;
          const startX = bottleBox.left + bottleBox.width * startRelX;
          const startY = bottleBox.top + bottleBox.height * startRelY;

          const driftX = (Math.random() - 0.5) * 60;
          const riseDist = 120 + Math.random() * 220;
          const duration = 1400 + Math.random() * 800;
          const size = 4 + Math.random() * 6;

          p.style.left = `${startX.toFixed(1)}px`;
          p.style.top = `${startY.toFixed(1)}px`;
          p.style.width = `${size.toFixed(1)}px`;
          p.style.height = `${size.toFixed(1)}px`;
          p.style.setProperty('--drift-x', `${driftX.toFixed(1)}px`);
          p.style.setProperty('--rise-y', `-${riseDist.toFixed(1)}px`);
          p.style.animationDuration = `${duration}ms`;

          // Đốm sáng có ánh sao lấp lánh
          if (Math.random() < 0.35) {
            p.innerHTML = '<span class="mote-star">✦</span>';
          }

          this.container.appendChild(p);

          setTimeout(() => {
            if (p.parentElement) p.remove();
          }, duration + 50);
        }, i * 38);
      }
    }

    // 3. Vệt sáng bừng nở khi cành hoa xuất hiện
    spawnBranchEmergenceFlash(x, y) {
      if (!this.container) return;
      const fRect = this.container.getBoundingClientRect();
      const localX = x - fRect.left;
      const localY = y - fRect.top;

      const flash = document.createElement('div');
      flash.className = 'toner-branch-spawn-flash';
      flash.style.left = `${localX}px`;
      flash.style.top = `${localY}px`;
      this.container.appendChild(flash);

      setTimeout(() => flash.remove(), 900);
    }

    // 4. Bụi sáng lấp lánh nối dài theo đường bay của cành hoa
    spawnFlightStardust(x, y) {
      if (!this.container) return;
      const fRect = this.container.getBoundingClientRect();
      const localX = x - fRect.left;
      const localY = y - fRect.top;

      const spark = document.createElement('div');
      spark.className = 'toner-flight-stardust';
      spark.style.left = `${(localX + (Math.random() - 0.5) * 20).toFixed(1)}px`;
      spark.style.top = `${(localY + (Math.random() - 0.5) * 20).toFixed(1)}px`;
      this.container.appendChild(spark);

      setTimeout(() => spark.remove(), 750);
    }

    // 5. Cuối trajectory: Hiệu ứng biến đổi thành lá thư (Transformation Vortex)
    triggerLetterTransformation(centerX, centerY, tonerShaker) {
      if (document.getElementById('tonerMessageModal')) return;

      const fRect = this.container.getBoundingClientRect();
      const localX = centerX - fRect.left;
      const localY = centerY - fRect.top;

      // Giảm sáng nhẹ background để tôn vinh sự xuất hiện của lá thư
      this.dimBackgroundGently();

      if (this.options.enableAudio) {
        this.playLetterUnfoldTone();
      }

      // Vòng xoáy biến hình ánh sáng và cánh hoa (Transformation Vortex)
      const vortex = document.createElement('div');
      vortex.className = 'toner-transform-vortex';
      vortex.style.left = `${localX}px`;
      vortex.style.top = `${localY}px`;

      // 12 tia sáng hoa cúc / ngôi sao xoay tròn
      for (let s = 0; s < 12; s++) {
        const spark = document.createElement('div');
        spark.className = 'transform-vortex-spark';
        const angle = (s / 12) * Math.PI * 2;
        const dist = 45 + Math.random() * 45;
        spark.style.setProperty('--tx', `${(Math.cos(angle) * dist).toFixed(1)}px`);
        spark.style.setProperty('--ty', `${(Math.sin(angle) * dist).toFixed(1)}px`);
        vortex.appendChild(spark);
      }

      // Vòng cánh hoa đậu biếc bung xòe 3D
      const petalRing = document.createElement('div');
      petalRing.className = 'transform-petal-ring';
      for (let p = 0; p < 6; p++) {
        const petal = document.createElement('img');
        petal.src = `assets/images/falling_branches/petal_${(p % 3) + 1}.png`;
        petal.className = 'transform-ring-petal';
        const rot = p * 60;
        petal.style.setProperty('--rot', `${rot}deg`);
        petalRing.appendChild(petal);
      }
      vortex.appendChild(petalRing);

      this.container.appendChild(vortex);

      // Sau 420ms, hiển thị lá thư chính thức mở ra từ tâm điểm biến hình
      setTimeout(() => {
        this.displayTonerLetterModal(tonerShaker, { x: localX, y: localY });
      }, 420);

      setTimeout(() => {
        if (vortex.parentElement) vortex.remove();
      }, 1600);
    }

    // 6. Hiển thị lá thư ở trung tâm màn hình (Letter Modal)
    displayTonerLetterModal(tonerShaker) {
      const existing = document.getElementById('tonerMessageModal');
      if (existing) existing.remove();

      // Dữ liệu lá thư (ưu tiên lấy từ window.TONER_LETTER_DATA, fallback static data)
      const data = window.TONER_LETTER_DATA || InteractionEngine.TONER_LETTER_DATA;

      // Backdrop nền làm mờ dịu mắt
      let backdrop = document.getElementById('tonerMessageBackdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'tonerMessageBackdrop';
        backdrop.className = 'toner-message-backdrop';
        this.container.appendChild(backdrop);
      }
      requestAnimationFrame(() => backdrop.classList.add('active'));

      const modal = document.createElement('div');
      modal.className = 'toner-message-modal';
      modal.id = 'tonerMessageModal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'tonerLetterTitle');

      modal.innerHTML = `
        <div class="toner-letter-card" id="tonerLetterCard">
          <div class="toner-card-ambient-glow" aria-hidden="true"></div>
          
          <!-- Họa tiết hoa đậu biếc & huy hiệu niêm phong phong thư -->
          <div class="toner-letter-top-ornament" aria-hidden="true">
            <div class="toner-wax-seal">
              <span class="wax-seal-gem">❀</span>
            </div>
            <div class="toner-seal-ribbon"></div>
          </div>

          <div class="toner-letter-header">
            <span class="toner-tag-badge" id="tonerLetterTag">${data.tag || 'Hydrating Toner • Lời Nhắn Dành Cho Em'}</span>
            <span class="toner-date-stamp" id="tonerLetterDate">${data.date || '30.09.2026'}</span>
          </div>

          <div class="toner-letter-divider" aria-hidden="true">
            <span class="toner-divider-line"></span>
            <span class="toner-divider-flower">❦</span>
            <span class="toner-divider-line"></span>
          </div>

          <div class="toner-letter-inner-content">
            <h3 class="toner-letter-salutation" id="tonerLetterSalutation">${data.salutation || 'Gửi em,'}</h3>
            
            <div class="toner-letter-paragraphs" id="tonerLetterParagraphs">
              <!-- Render từng dòng câu chữ -->
            </div>

            <div class="toner-letter-signoff">
              <p class="toner-letter-closing" id="tonerLetterClosing">${data.closing || 'Thương em,'}</p>
              <p class="toner-letter-sender" id="tonerLetterSender">${data.sender || 'Cá Sudo ♡ Khây Ti'}</p>
            </div>
          </div>

          <div class="toner-letter-action-bar">
            <button type="button" class="toner-letter-close-btn" id="tonerLetterCloseBtn" aria-label="Đóng lá thư">
              <span class="btn-bracket">[</span>
              <span class="btn-text">Đóng</span>
              <span class="btn-bracket">]</span>
            </button>
          </div>
        </div>
      `;

      this.container.appendChild(modal);

      const card = modal.querySelector('#tonerLetterCard');
      const paragraphsEl = modal.querySelector('#tonerLetterParagraphs');
      const closeBtn = modal.querySelector('#tonerLetterCloseBtn');

      // Render nội dung các đoạn văn bản
      this.renderTonerLetterBody(paragraphsEl, data);

      requestAnimationFrame(() => {
        modal.classList.add('active');
        if (card) {
          card.classList.add('revealed');
        }
        if (closeBtn) {
          setTimeout(() => closeBtn.focus(), 2400);
        }
      });

      // ============================================================
      // NGƯỜI DÙNG TỰ ĐÓNG LÁ THƯ (KHÔNG TỰ ĐỘNG ĐÓNG)
      // ============================================================
      const closeLetter = () => {
        this.closeTonerLetterModal(modal, backdrop, tonerShaker);
      };

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeLetter();
        });
      }

      backdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLetter();
      });

      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          closeLetter();
        }
      };

      document.addEventListener('keydown', handleKeydown, { once: true });
    }

    // Render các dòng của lá thư mềm mại
    renderTonerLetterBody(containerEl, data) {
      if (!containerEl) return;
      containerEl.innerHTML = '';

      let lines = [];
      if (Array.isArray(data.paragraphs)) {
        lines = data.paragraphs;
      } else if (typeof data.paragraphs === 'string') {
        lines = data.paragraphs.split('\n');
      } else if (typeof data.message === 'string') {
        lines = data.message.split('\n');
      } else {
        lines = [
          "Cảm ơn vì đã xuất hiện",
          "trong những ngày bình thường",
          "và khiến chúng trở nên",
          "đặc biệt hơn."
        ];
      }

      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed === '') {
          const spacer = document.createElement('div');
          spacer.className = 'toner-line-spacer';
          containerEl.appendChild(spacer);
        } else {
          const p = document.createElement('p');
          p.className = `toner-letter-line toner-line-${idx + 1}`;
          p.textContent = trimmed;
          p.style.animationDelay = `${0.35 + idx * 0.22}s`;
          containerEl.appendChild(p);
        }
      });
    }

    // Đóng hoàn toàn lá thư và dọn dẹp trạng thái
    closeTonerLetterModal(modal, backdrop, tonerShaker) {
      if (!modal) return;

      modal.classList.add('closing');
      modal.classList.remove('active');

      if (backdrop) {
        backdrop.classList.remove('active');
        backdrop.classList.add('fading');
      }

      if (tonerShaker) {
        tonerShaker.classList.add('shaker-fade-out');
      }

      setTimeout(() => {
        modal.remove();
        if (backdrop) backdrop.remove();
        if (tonerShaker) tonerShaker.remove();
        this.activeSequences.delete('toner');
        if (window.discoveryEngine) {
          window.discoveryEngine.onSequenceClosed('toner');
        }
      }, 620);
    }

    // Cập nhật nội dung thư bằng JavaScript hoặc JSON (Runtime / Programmatic)
    setTonerMessage(dataOrJson) {
      try {
        let parsed = dataOrJson;
        if (typeof dataOrJson === 'string') {
          try {
            parsed = JSON.parse(dataOrJson);
          } catch (_) {
            parsed = { paragraphs: dataOrJson.split('\n') };
          }
        }

        if (parsed && typeof parsed === 'object') {
          if (typeof parsed.paragraphs === 'string') {
            parsed.paragraphs = parsed.paragraphs.split('\n');
          } else if (typeof parsed.message === 'string' && !parsed.paragraphs) {
            parsed.paragraphs = parsed.message.split('\n');
          }

          window.TONER_LETTER_DATA = Object.assign({}, window.TONER_LETTER_DATA || InteractionEngine.TONER_LETTER_DATA, parsed);

          // Cập nhật tức thời nếu lá thư đang mở trên màn hình
          const modal = document.getElementById('tonerMessageModal');
          if (modal) {
            const sal = modal.querySelector('#tonerLetterSalutation');
            if (sal && parsed.salutation) sal.textContent = parsed.salutation;

            const paragraphsEl = modal.querySelector('#tonerLetterParagraphs');
            if (paragraphsEl) this.renderTonerLetterBody(paragraphsEl, window.TONER_LETTER_DATA);

            const clo = modal.querySelector('#tonerLetterClosing');
            if (clo && parsed.closing) clo.textContent = parsed.closing;

            const sen = modal.querySelector('#tonerLetterSender');
            if (sen && parsed.sender) sen.textContent = parsed.sender;

            const tag = modal.querySelector('#tonerLetterTag');
            if (tag && parsed.tag) tag.textContent = parsed.tag;

            const date = modal.querySelector('#tonerLetterDate');
            if (date && parsed.date) date.textContent = parsed.date;
          }

          return true;
        }
      } catch (err) {
        console.error('Lỗi khi thiết lập nội dung lá thư Toner:', err);
      }
      return false;
    }

    getTonerMessage() {
      return JSON.parse(JSON.stringify(window.TONER_LETTER_DATA || InteractionEngine.TONER_LETTER_DATA));
    }

    // Âm thanh giọt sương phát sáng (Crystalline Dewdrop Arpeggio)
    playDewdropGlowTone() {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        // Gam hợp âm C major 7 / 9 trong trẻo như giọt sương: E6, G6, B6, D7, E7
        const freqs = [1318.51, 1567.98, 1975.53, 2349.32, 2637.02];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.045);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(freq, now + idx * 0.045);
          filter.Q.value = 8;

          gain.gain.setValueAtTime(0.0001, now + idx * 0.045);
          gain.gain.linearRampToValueAtTime(0.022, now + idx * 0.045 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.045 + 0.45);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.045);
          osc.stop(now + idx * 0.045 + 0.48);
        });
      } catch (_) { }
    }

    // Âm thanh hạt sáng bay lên bồng bềnh
    playFloatingParticlesTone() {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const freqs = [880.0, 1174.66, 1396.91, 1760.0]; // A5, D6, F6, A6
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.08, now + idx * 0.08 + 0.6);

          gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.018, now + idx * 0.08 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.7);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.75);
        });
      } catch (_) { }
    }

    // Âm thanh mở lá thư ấm áp & thi vị (F Major 9 Chord)
    playLetterUnfoldTone() {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        // Gam hợp âm F Major 9 ấm áp, thơ mộng và ngọt ngào (F4, A4, C5, E5, G5, A5)
        const freqs = [349.23, 440.0, 523.25, 659.25, 783.99, 880.0];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(2400, now + idx * 0.06);
          filter.frequency.exponentialRampToValueAtTime(750, now + idx * 0.06 + 1.2);

          gain.gain.setValueAtTime(0.0001, now + idx * 0.06);
          gain.gain.linearRampToValueAtTime(0.026 / (1 + idx * 0.15), now + idx * 0.06 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 1.4);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 1.45);
        });
      } catch (_) { }
    }

    // ============================================================
    // HIỆU ỨNG THỊ GIÁC: SÓNG NƯỚC, ĐỐM SÁNG & GỢN GIÓ
    // ============================================================
    // ============================================================
    // ESSENCE = HƯƠNG CỦA KỶ NIỆM (CHOREOGRAPHY CHO CHAI SOOTHING ESSENCE)
    // ============================================================
    // Khi người dùng chạm vào essence:
    // 1. Chai sáng nhẹ.
    // 2. Sương mỏng xuất hiện (không tạo hiệu ứng khói dày).
    // 3. Ribbon ánh sáng bay lên.
    // 4. Hạt sáng lấp lánh.
    // 5. Một số cánh hoa xuất hiện bên trong dòng hương.
    // 6. Dòng hương uốn lượn.
    // 7. Sau một khoảng thời gian, dòng hương tan dần.
    // Hiển thị: Butterfly Pea / “một chút dịu dàng còn vương lại trong không khí...”
    // ============================================================
    triggerEssenceMemoryChoreography(bottle, clientX, clientY) {
      if (!bottle || !this.container) return;

      // Chống kích hoạt đúp dồn dập
      if (this.activeSequences.has('essence')) return;
      this.activeSequences.add('essence');
      this.dismissTouchHint();

      const fRect = this.container.getBoundingClientRect();
      const targetImg = document.querySelector('.main-uncut-image') || this.container.querySelector('img');
      const iRect = targetImg ? targetImg.getBoundingClientRect() : fRect;

      const bounds = bottle.bounds || { minX: 0.675, maxX: 0.795, minY: 0.380, maxY: 0.865 };
      const bottleBox = {
        left: bounds.minX * iRect.width + (iRect.left - fRect.left),
        top: bounds.minY * iRect.height + (iRect.top - fRect.top),
        width: (bounds.maxX - bounds.minX) * iRect.width,
        height: (bounds.maxY - bounds.minY) * iRect.height
      };

      const objCenterX = fRect.left + bottleBox.left + bottleBox.width * 0.5;
      const touchX = clientX !== undefined ? clientX : objCenterX;
      const touchY = clientY !== undefined ? clientY : (fRect.top + bottleBox.top + bottleBox.height * 0.45);

      const nozzleRelX = bottle.nozzle ? bottle.nozzle.x : 0.729;
      const nozzleRelY = bottle.nozzle ? bottle.nozzle.y : 0.430;
      const nozzleScreenX = fRect.left + nozzleRelX * fRect.width;
      const nozzleScreenY = fRect.top + nozzleRelY * fRect.height;
      const nozzleLocalX = nozzleRelX * fRect.width;
      const nozzleLocalY = nozzleRelY * fRect.height;

      // ------------------------------------------------------------
      // BƯỚC 1: CHẠM & CHAI SÁNG NHẸ (0ms)
      // "1. Chai sáng nhẹ. Animation phải nhẹ, sang trọng và thơ mộng."
      // ------------------------------------------------------------
      if (this.options.enableHaptics && window.navigator && window.navigator.vibrate) {
        try { window.navigator.vibrate([10]); } catch (_) { }
      }

      if (this.options.enableAudio) {
        this.playMemoryScentTone();
      }

      // Gợn sóng chạm nhẹ tại điểm tiếp xúc ngón tay
      this.createTouchWaveVisual(touchX, touchY);

      // Gợn sóng phản chiếu trên mặt bàn đá hoa cương ngay dưới chân chai
      this.addTableCausticWave(bottleBox.left + bottleBox.width * 0.5, bottleBox.top + bottleBox.height * 0.95);

      // Xóa phần tử sáng cũ nếu có
      const oldGlow = this.container.querySelector('.essence-memory-bottle-glow');
      if (oldGlow) oldGlow.remove();

      // Tạo phần tử phát sáng nhẹ nhàng trên thân chai
      const essenceGlowEl = document.createElement('div');
      essenceGlowEl.className = 'essence-memory-bottle-glow active';
      essenceGlowEl.style.left = `${bottleBox.left.toFixed(1)}px`;
      essenceGlowEl.style.top = `${bottleBox.top.toFixed(1)}px`;
      essenceGlowEl.style.width = `${bottleBox.width.toFixed(1)}px`;
      essenceGlowEl.style.height = `${bottleBox.height.toFixed(1)}px`;

      // Hào quang vàng champagne & lam ngọc đậu biếc tỏa nhẹ quanh thân chai
      const auraEl = document.createElement('div');
      auraEl.className = 'essence-bottle-aura active';
      essenceGlowEl.appendChild(auraEl);

      // Vệt sáng ngọc trai lướt êm dịu lên cổ chai
      const sheenEl = document.createElement('div');
      sheenEl.className = 'essence-glass-sheen';
      essenceGlowEl.appendChild(sheenEl);

      this.container.appendChild(essenceGlowEl);

      // Thân chai lắng dần sau khi tỏa sáng và tan biến êm ái
      setTimeout(() => {
        essenceGlowEl.classList.add('dissolving');
        setTimeout(() => {
          if (essenceGlowEl.parentElement) essenceGlowEl.remove();
        }, 1200);
      }, 1600);

      // ------------------------------------------------------------
      // BƯỚC 2 - 7: SƯƠNG MỎNG XUẤT HIỆN, RIBBON ÁNH SÁNG BAY LÊN,
      // HẠT SÁNG LẤP LÁNH, CÁNH HOA BÊN TRONG DÒNG HƯƠNG, UỐN LƯỢN & TAN DẦN (120ms)
      // ------------------------------------------------------------
      setTimeout(() => {
        // Đốm sáng lóe nhẹ tại đầu vòi xịt
        this.createNozzleStarburst(nozzleScreenX, nozzleScreenY);

        if (window.scentEngine) {
          window.scentEngine.emitFromBottle(bottle, {
            showCard: false, // Thẻ sẽ xuất hiện ở GIAI ĐOẠN 8 với timing chuẩn
            intensity: 1.0,
            originX: nozzleLocalX,
            originY: nozzleLocalY,
            playAudio: false
          });
        }
      }, 120);

      // ------------------------------------------------------------
      // BƯỚC 8: HIỂN THỊ THẺ THI VỊ "BUTTERFLY PEA" (420ms)
      // "Butterfly Pea / một chút dịu dàng còn vương lại trong không khí..."
      // ------------------------------------------------------------
      setTimeout(() => {
        if (window.scentEngine && typeof window.scentEngine.showScentNoteCard === 'function') {
          window.scentEngine.showScentNoteCard(bottle, nozzleLocalX, nozzleLocalY);
        }

        // Mở khóa chuỗi tương tác cho lần chạm tiếp theo sau 1.2s
        setTimeout(() => {
          this.activeSequences.delete('essence');
          if (window.discoveryEngine) {
            window.discoveryEngine.onSequenceClosed('essence');
          }
        }, 800);
      }, 420);
    }

    // Âm thanh giọt hương kỷ niệm thanh khiết (528Hz Solfeggio & Quãng 8)
    playMemoryScentTone() {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        // Solfeggio 528Hz (Tần số bình yên & chữa lành) hòa âm 660Hz và quãng 8 1056Hz
        const freqs = [528.0, 660.0, 1056.0];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.04, now + idx * 0.04 + 0.55);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(freq * 1.15, now + idx * 0.04);
          filter.Q.value = 6;

          gain.gain.setValueAtTime(0.0001, now + idx * 0.04);
          gain.gain.linearRampToValueAtTime(0.016 / (1 + idx * 0.2), now + idx * 0.04 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.65);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.70);
        });
      } catch (_) { }
    }

    // Gợn sóng chạm nhẹ tại điểm tiếp xúc
    createTouchWaveVisual(clientX, clientY) {
      const fRect = this.container.getBoundingClientRect();
      const localX = clientX - fRect.left;
      const localY = clientY - fRect.top;

      const wave = document.createElement('div');
      wave.className = 'interaction-touch-wave';
      wave.style.left = `${localX}px`;
      wave.style.top = `${localY}px`;
      this.container.appendChild(wave);

      // Tạo thêm 3 đốm sáng nhỏ li ti tỏa ra
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'interaction-sparkle-dot';
        dot.style.left = `${localX}px`;
        dot.style.top = `${localY}px`;
        const angle = Math.random() * Math.PI * 2;
        const dist = 12 + Math.random() * 16;
        dot.style.setProperty('--dx', `${(Math.cos(angle) * dist).toFixed(1)}px`);
        dot.style.setProperty('--dy', `${(Math.sin(angle) * dist).toFixed(1)}px`);
        this.container.appendChild(dot);
        setTimeout(() => dot.remove(), 520);
      }

      setTimeout(() => wave.remove(), 560);
    }

    // Đốm sáng ngôi sao lấp lánh tại đầu vòi xịt
    createNozzleStarburst(screenX, screenY) {
      const fRect = this.container.getBoundingClientRect();
      const localX = screenX - fRect.left;
      const localY = screenY - fRect.top;

      const flash = document.createElement('div');
      flash.className = 'bottle-spray-flash';
      flash.style.left = `${localX}px`;
      flash.style.top = `${localY}px`;
      this.container.appendChild(flash);

      setTimeout(() => flash.remove(), 750);
    }

    // Thêm điểm gợn gió khi ngón tay đang kéo
    addWindTrailPoint(clientX, clientY, vx, vy) {
      const fRect = this.container.getBoundingClientRect();
      const x = clientX - fRect.left;
      const y = clientY - fRect.top;

      this.activeWindTrails.push({
        x,
        y,
        vx,
        vy,
        radius: 8 + Math.random() * 8,
        alpha: 0.38,
        life: 0,
        maxLife: 24
      });
    }

    // Tạo vệt gió vuốt (Wind Gust Ribbon) khi swipe kết thúc
    createWindGustVisual(startX, startY, endX, endY, angle, force) {
      const fRect = this.container.getBoundingClientRect();
      const p0 = { x: startX - fRect.left, y: startY - fRect.top };
      const p3 = { x: endX - fRect.left, y: endY - fRect.top };

      // Đường cong nhẹ theo hướng gió
      const midDist = Math.hypot(p3.x - p0.x, p3.y - p0.y) * 0.5;
      const perpAngle = angle + Math.PI * 0.5;
      const curveOffset = (Math.random() - 0.5) * 24;

      const p1 = {
        x: p0.x + Math.cos(angle) * (midDist * 0.6) + Math.cos(perpAngle) * curveOffset,
        y: p0.y + Math.sin(angle) * (midDist * 0.6) + Math.sin(perpAngle) * curveOffset
      };
      const p2 = {
        x: p0.x + Math.cos(angle) * (midDist * 1.4) + Math.cos(perpAngle) * (curveOffset * 0.5),
        y: p0.y + Math.sin(angle) * (midDist * 1.4) + Math.sin(perpAngle) * (curveOffset * 0.5)
      };

      this.activeWindTrails.push({
        isRibbon: true,
        p0,
        p1,
        p2,
        p3,
        force,
        alpha: 0.42,
        life: 0,
        maxLife: 32
      });
    }

    // Gợn sóng phản chiếu trên mặt bàn đá hoa cương
    addTableCausticWave(x, y) {
      this.activeRipples.push({
        x,
        y,
        r: 4,
        maxR: 35 + Math.random() * 25,
        alpha: 0.28,
        life: 0,
        maxLife: 38
      });
    }

    // ============================================================
    // VÒNG LẶP RENDER TRÊN OVERLAY CANVAS (60FPS HARDWARE ACCELERATED)
    // ============================================================
    startRenderLoop() {
      if (this.isRenderLoopActive) return;
      this.isRenderLoopActive = true;

      const render = () => {
        if (!this.overlayCanvas || !this.ctx) {
          this.isRenderLoopActive = false;
          return;
        }

        const w = this.overlayCanvas.width / this.dpr;
        const h = this.overlayCanvas.height / this.dpr;

        this.ctx.clearRect(0, 0, w, h);

        // 1. Vẽ các gợn sóng nước trên mặt bàn đá
        for (let i = this.activeRipples.length - 1; i >= 0; i--) {
          const rp = this.activeRipples[i];
          rp.life++;
          const progress = rp.life / rp.maxLife;
          rp.r += (rp.maxR - rp.r) * 0.12;
          const currentAlpha = rp.alpha * (1 - progress);

          this.ctx.beginPath();
          // Vẽ hình elip dẹt mô phỏng phối cảnh mặt bàn
          this.ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.38, 0, 0, Math.PI * 2);
          this.ctx.strokeStyle = `rgba(191, 219, 254, ${currentAlpha.toFixed(3)})`;
          this.ctx.lineWidth = 1.2 * (1 - progress);
          this.ctx.stroke();

          if (rp.life >= rp.maxLife) {
            this.activeRipples.splice(i, 1);
          }
        }

        // 2. Vẽ các vệt gió (Wind Trails) của cử chỉ vuốt
        for (let i = this.activeWindTrails.length - 1; i >= 0; i--) {
          const wt = this.activeWindTrails[i];
          wt.life++;
          const progress = wt.life / wt.maxLife;
          const currentAlpha = wt.alpha * Math.cos(progress * Math.PI * 0.5);

          if (wt.isRibbon) {
            // Vẽ dải lụa gió mỏng lướt qua không gian
            this.ctx.beginPath();
            this.ctx.moveTo(wt.p0.x, wt.p0.y);
            this.ctx.bezierCurveTo(wt.p1.x, wt.p1.y, wt.p2.x, wt.p2.y, wt.p3.x, wt.p3.y);
            this.ctx.strokeStyle = `rgba(224, 242, 254, ${currentAlpha.toFixed(3)})`;
            this.ctx.lineWidth = Math.max(0.8, (2.2 * wt.force) * (1 - progress));
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
          } else {
            // Vẽ các hạt bụi khí vi mô
            this.ctx.beginPath();
            this.ctx.arc(wt.x, wt.y, wt.radius * (1 - progress * 0.5), 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(186, 230, 253, ${(currentAlpha * 0.4).toFixed(3)})`;
            this.ctx.fill();
          }

          if (wt.life >= wt.maxLife) {
            this.activeWindTrails.splice(i, 1);
          }
        }

        requestAnimationFrame(render);
      };

      requestAnimationFrame(render);
    }

    // ============================================================
    // CÁC TƯƠNG TÁC NGOẠI VI (CANOPY, AMBIENT, HINT)
    // ============================================================
    handleCanopyTouch(element, clientX, clientY) {
      if (this.options.enableAudio) playCrystalTouchTone();
      this.createTouchWaveVisual(clientX, clientY);

      // Cành đung đưa nhẹ
      element.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.4, 1)';
      element.style.transform = 'scale(0.98) rotate(-1.8deg)';
      setTimeout(() => {
        element.style.transform = '';
      }, 420);

      // Tách cành hoa rơi xuống
      const dir = clientX > window.innerWidth * 0.5 ? 1 : -1;
      setTimeout(() => {
        if (window.branchEngine) {
          window.branchEngine.launch({
            originX: clientX,
            originY: clientY,
            dir: dir,
            allowPetalDetach: true
          });
        }
      }, 90);

      // Bung cánh hoa
      setTimeout(() => {
        if (window.petalEngine) {
          window.petalEngine.toss({
            x: clientX,
            y: clientY,
            count: 12,
            force: 1.35,
            spread: 0.65
          });
        }
      }, 180);

      // Kích hoạt phản chiếu 9 màn hình từ cành hoa gốc
      if (window.storyEngineInstance && typeof window.storyEngineInstance.startReflectionJourney === 'function') {
        window.storyEngineInstance.startReflectionJourney();
      } else if (window.storyTransitionEngine && typeof window.storyTransitionEngine.startReflectionJourney === 'function') {
        window.storyTransitionEngine.startReflectionJourney();
      }
    }

    handleAmbientTouch(clientX, clientY) {
      if (this.options.enableAudio) playCrystalTouchTone();
      this.createTouchWaveVisual(clientX, clientY);

      const fRect = this.container.getBoundingClientRect();
      const relY = (clientY - fRect.top) / fRect.height;

      // Nửa trên (Khu vực hoa): tung cánh hoa và tách cành
      if (relY <= 0.48) {
        const dir = clientX > window.innerWidth * 0.5 ? 1 : -1;
        setTimeout(() => {
          if (window.branchEngine) {
            window.branchEngine.launch({
              originX: clientX,
              originY: clientY,
              dir: dir,
              allowPetalDetach: true
            });
          }
        }, 90);

        setTimeout(() => {
          if (window.petalEngine) {
            window.petalEngine.toss({
              x: clientX,
              y: clientY,
              count: 5,
              force: 1.15
            });
          }
        }, 180);
      } else {
        // Nửa dưới (Mặt bàn, lụa): tung một nắm cánh hoa nhẹ
        if (window.petalEngine) {
          window.petalEngine.toss({
            x: clientX,
            y: clientY,
            count: 4,
            force: 1.05
          });
        }
        this.addTableCausticWave(clientX - fRect.left, clientY - fRect.top);
      }
    }

    dismissTouchHint() {
      const hint = document.getElementById('flowerTouchHint');
      if (hint) {
        hint.classList.add('fade-out');
        setTimeout(() => {
          if (hint.parentElement) hint.remove();
        }, 600);
      }
    }

    // ============================================================
    // LIP BALM = LỜI HẸN (THIẾT KẾ CHỨC NĂNG CẢM XÚC MẠNH NHẤT)
    // ============================================================
    // Khi người dùng chạm vào lip balm:
    // 1. Nắp vàng rung nhẹ.
    // 2. Một cánh hoa rơi xuống.
    // 3. Background chuyển sang slow motion.
    // 4. Ánh sáng xung quanh giảm nhẹ.
    // 5. Một cành hoa bay ngang màn hình.
    // 6. Các hiệu ứng xung quanh trở nên yên tĩnh.
    //
    // Sau đó hiển thị:
    // LỜI HẸN
    // "Không cần những lời
    // quá lớn lao.
    //
    // Chỉ cần ngày mai
    // chúng ta vẫn còn
    // muốn ở cạnh nhau."
    //
    // Người dùng tự đóng.
    // Khi đóng:
    // - Một cánh hoa cuối cùng bay qua màn hình.
    // - Background trở lại tốc độ bình thường.
    // ============================================================
    // BÔNG HOA GỐC = KHỞI ĐẦU HÀNH TRÌNH PHẢN CHIẾU 9 MÀN HÌNH
    // ============================================================
    triggerFlowerRootReflectionChoreography(bottle, clientX, clientY) {
      if (this.options.enableAudio) playCrystalTouchTone();
      const clickX = clientX !== undefined ? clientX : window.innerWidth * 0.5;
      const clickY = clientY !== undefined ? clientY : window.innerHeight * 0.22;
      this.createTouchWaveVisual(clickX, clickY);

      // Cành đung đưa nở rộ
      const canopy = document.getElementById('engineFloraCanopy') || document.getElementById('engineFloraLayer');
      if (canopy) {
        canopy.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.3, 1)';
        canopy.style.transform = 'scale(1.05) rotate(-1.5deg)';
        setTimeout(() => {
          canopy.style.transform = '';
        }, 500);
      }

      // Bung cánh hoa
      if (window.petalEngine) {
        window.petalEngine.toss({
          x: clickX,
          y: clickY,
          count: 16,
          force: 1.45,
          angle: -Math.PI * 0.5 + (Math.random() - 0.5) * 0.5,
          spread: 0.75
        });
      }

      // Kích hoạt phản chiếu 9 màn hình
      if (window.storyEngineInstance && typeof window.storyEngineInstance.startReflectionJourney === 'function') {
        window.storyEngineInstance.startReflectionJourney();
      } else if (window.storyTransitionEngine && typeof window.storyTransitionEngine.startReflectionJourney === 'function') {
        window.storyTransitionEngine.startReflectionJourney();
      }
    }

    triggerLipbalmPromiseChoreography(bottle, clientX, clientY) {
      if (!bottle || !this.container) return;

      // Chống kích hoạt đúp nếu đang hiển thị lời hẹn
      if (this.activeSequences.has('lipbalm') || document.getElementById('lipbalmPromiseModal')) {
        return;
      }
      this.activeSequences.add('lipbalm');
      this.dismissTouchHint();

      const fRect = this.container.getBoundingClientRect();
      const targetImg = document.querySelector('.main-uncut-image') || this.container.querySelector('img');
      const iRect = targetImg ? targetImg.getBoundingClientRect() : fRect;

      const bounds = bottle.bounds || { minX: 0.60, maxX: 0.74, minY: 0.71, maxY: 0.93 };
      const bottleBox = {
        left: bounds.minX * iRect.width + (iRect.left - fRect.left),
        top: bounds.minY * iRect.height + (iRect.top - fRect.top),
        width: (bounds.maxX - bounds.minX) * iRect.width,
        height: (bounds.maxY - bounds.minY) * iRect.height
      };

      const objCenterX = fRect.left + bottleBox.left + bottleBox.width * 0.5;
      const touchX = clientX !== undefined ? clientX : objCenterX;
      const touchY = clientY !== undefined ? clientY : (fRect.top + bottleBox.top + bottleBox.height * 0.45);

      // Gợn sóng chạm nhẹ tại điểm chạm
      this.createTouchWaveVisual(touchX, touchY);
      this.addTableCausticWave(bottleBox.left + bottleBox.width * 0.5, bottleBox.top + bottleBox.height * 0.95);

      // ------------------------------------------------------------
      // 1. NẮP VÀNG RUNG NHẸ (0ms)
      // ------------------------------------------------------------
      if (this.options.enableHaptics && window.navigator && window.navigator.vibrate) {
        try {
          window.navigator.vibrate([16, 28, 16]);
        } catch (_) { }
      }

      if (this.options.enableAudio) {
        this.playPromiseGoldChimeTone();
      }

      // Xóa phần tử shaker cũ nếu có
      const oldShaker = this.container.querySelector('.lipbalm-promise-bottle');
      if (oldShaker) oldShaker.remove();

      const lipbalmShaker = document.createElement('div');
      lipbalmShaker.className = 'bottle-shaker-element lipbalm-promise-bottle';
      lipbalmShaker.style.left = `${bottleBox.left.toFixed(1)}px`;
      lipbalmShaker.style.top = `${bottleBox.top.toFixed(1)}px`;
      lipbalmShaker.style.width = `${bottleBox.width.toFixed(1)}px`;
      lipbalmShaker.style.height = `${bottleBox.height.toFixed(1)}px`;

      // Canvas chụp hình sắc nét 100% của hũ son dưỡng
      const shakerCanvas = document.createElement('canvas');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      shakerCanvas.width = Math.max(1, Math.round(bottleBox.width * dpr));
      shakerCanvas.height = Math.max(1, Math.round(bottleBox.height * dpr));
      shakerCanvas.style.width = '100%';
      shakerCanvas.style.height = '100%';

      const sCtx = shakerCanvas.getContext('2d');
      sCtx.scale(dpr, dpr);

      if (targetImg && targetImg.complete && targetImg.naturalWidth > 0) {
        const sx = bounds.minX * targetImg.naturalWidth;
        const sy = bounds.minY * targetImg.naturalHeight;
        const sw = (bounds.maxX - bounds.minX) * targetImg.naturalWidth;
        const sh = (bounds.maxY - bounds.minY) * targetImg.naturalHeight;
        sCtx.drawImage(targetImg, sx, sy, sw, sh, 0, 0, bottleBox.width, bottleBox.height);
      }
      lipbalmShaker.appendChild(shakerCanvas);

      // Lớp NẮP VÀNG RUNG NHẸ độc lập (Gold Cap Micro-Tremor)
      const goldCapEl = document.createElement('div');
      goldCapEl.className = 'lipbalm-gold-cap-element cap-shaking';
      goldCapEl.innerHTML = `
        <div class="lipbalm-cap-specular-shimmer"></div>
        <div class="lipbalm-cap-gold-halo"></div>
      `;
      lipbalmShaker.appendChild(goldCapEl);

      // Hào quang vàng hồng champagne dịu ngọt
      const auraEl = document.createElement('div');
      auraEl.className = 'lipbalm-bottle-aura active';
      lipbalmShaker.appendChild(auraEl);

      this.container.appendChild(lipbalmShaker);

      // Sau 480ms nắp ngừng rung và chuyển sang trạng thái tỏa sáng êm dịu
      setTimeout(() => {
        if (goldCapEl) goldCapEl.classList.remove('cap-shaking');
        lipbalmShaker.classList.add('bottle-focused');
      }, 480);

      // ------------------------------------------------------------
      // 2. MỘT CÁNH HOA RƠI XUỐNG (280ms)
      // ------------------------------------------------------------
      const petalDropX = fRect.left + bottleBox.left + bottleBox.width * 0.46;
      const petalDropY = fRect.top + bottleBox.top - 70;

      setTimeout(() => {
        if (window.petalEngine && typeof window.petalEngine.dropSinglePetal === 'function') {
          window.petalEngine.dropSinglePetal({
            x: petalDropX,
            y: petalDropY,
            fallDistance: bottleBox.height + 95,
            duration: 4400
          });
        }
      }, 280);

      // ------------------------------------------------------------
      // 3. BACKGROUND CHUYỂN SANG SLOW MOTION (420ms)
      // ------------------------------------------------------------
      setTimeout(() => {
        if (window.bgEngineInstance && typeof window.bgEngineInstance.setSlowMotion === 'function') {
          window.bgEngineInstance.setSlowMotion(true, true);
        } else if (typeof window.setSlowMotion === 'function') {
          window.setSlowMotion(true, true);
        }
        this.container.classList.add('engine-slow-motion');
      }, 420);

      // ------------------------------------------------------------
      // 4. ÁNH SÁNG XUNG QUANH GIẢM NHẸ (580ms)
      // ------------------------------------------------------------
      setTimeout(() => {
        let dimBackdrop = document.getElementById('lipbalmCinematicDim');
        if (!dimBackdrop) {
          dimBackdrop = document.createElement('div');
          dimBackdrop.id = 'lipbalmCinematicDim';
          dimBackdrop.className = 'lipbalm-cinematic-dim';
          dimBackdrop.style.setProperty('--lipbalm-center-x', `${((bottleBox.left + bottleBox.width * 0.5) / fRect.width * 100).toFixed(1)}%`);
          dimBackdrop.style.setProperty('--lipbalm-center-y', `${((bottleBox.top + bottleBox.height * 0.5) / fRect.height * 100).toFixed(1)}%`);
          this.container.appendChild(dimBackdrop);
        }
        requestAnimationFrame(() => {
          dimBackdrop.classList.add('active');
        });
      }, 580);

      // ------------------------------------------------------------
      // 5. MỘT CÀNH HOA BAY NGANG MÀN HÌNH (900ms)
      // ------------------------------------------------------------
      setTimeout(() => {
        if (window.branchEngine && typeof window.branchEngine.launchHorizontalAcross === 'function') {
          window.branchEngine.launchHorizontalAcross({
            fromLeft: true,
            duration: 6200
          });
        } else if (window.branchEngine && typeof window.branchEngine.launch === 'function') {
          window.branchEngine.launch({
            originX: -80,
            originY: window.innerHeight * 0.38,
            dir: 1,
            branchIndex: 0,
            trajectory: 'C',
            duration: 5800,
            allowPetalDetach: true
          });
        }
      }, 900);

      // ------------------------------------------------------------
      // 6. CÁC HIỆU ỨNG XUNG QUANH TRỞ NÊN YÊN TĨNH (350ms)
      // ------------------------------------------------------------
      const restoreMusicVolume = this.duckBackgroundMusic(0.20, 1600);

      // ------------------------------------------------------------
      // HIỂN THỊ: LỜI HẸN (2100ms)
      // ------------------------------------------------------------
      setTimeout(() => {
        this.displayLipbalmPromiseContent(lipbalmShaker, restoreMusicVolume);
      }, 2100);
    }

    // Âm thanh chuông vàng pha lê ngân vang dịu ngọt
    playPromiseGoldChimeTone() {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        // Hợp âm E5 - G#5 - B5 - E6 ấm áp, thanh tao
        const freqs = [659.25, 830.61, 987.77, 1318.51];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);

          gain.gain.setValueAtTime(0.0001, now + idx * 0.04);
          gain.gain.linearRampToValueAtTime(0.016 / (idx + 1), now + idx * 0.04 + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 1.4);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 1.45);
        });
      } catch (_) { }
    }

    // Làm dịu âm lượng nhạc nền xuống thì thầm, sau đó trả lại bình thường
    duckBackgroundMusic(targetVol = 0.20, durationMs = 1500) {
      try {
        const audio = document.getElementById('bgMusic');
        if (!audio || audio.paused) return () => { };
        const initialVol = typeof audio.volume === 'number' ? audio.volume : 0.6;
        const startTime = performance.now();

        const step = () => {
          const elapsed = performance.now() - startTime;
          const p = Math.min(1, elapsed / durationMs);
          const ease = 1 - Math.pow(1 - p, 2);
          audio.volume = initialVol + (targetVol - initialVol) * ease;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);

        return () => {
          try {
            if (!audio || audio.paused) return;
            const restStart = performance.now();
            const currVol = audio.volume;
            const restStep = () => {
              const elapsed = performance.now() - restStart;
              const p = Math.min(1, elapsed / 1800);
              const ease = 1 - Math.pow(1 - p, 2);
              audio.volume = currVol + (initialVol - currVol) * ease;
              if (p < 1) requestAnimationFrame(restStep);
            };
            requestAnimationFrame(restStep);
          } catch (_) { }
        };
      } catch (_) {
        return () => { };
      }
    }

    // Hiển thị nội dung LỜI HẸN với thiết kế cảm xúc sâu sắc nhất
    displayLipbalmPromiseContent(lipbalmShaker, restoreMusicVolume) {
      const existing = document.getElementById('lipbalmPromiseModal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.className = 'lipbalm-promise-modal';
      modal.id = 'lipbalmPromiseModal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'promiseModalTitle');

      modal.innerHTML = `
        <div class="lipbalm-promise-card" id="lipbalmPromiseCard">
          <div class="promise-card-halo" aria-hidden="true"></div>

          <div class="promise-header-ornament" aria-hidden="true">
            <span class="promise-star-icon">✦</span>
            <span class="promise-diamond-icon">✧</span>
            <span class="promise-star-icon">✦</span>
          </div>

          <h2 class="promise-title" id="promiseModalTitle">LỜI HẸN</h2>

          <div class="promise-divider" aria-hidden="true">
            <span class="promise-divider-line"></span>
            <span class="promise-divider-gem">♡</span>
            <span class="promise-divider-line"></span>
          </div>

          <div class="promise-lines-container">
            <p class="promise-line promise-line-1">“Không cần những lời</p>
            <p class="promise-line promise-line-2">quá lớn lao.</p>
            <div class="promise-line-spacer" aria-hidden="true"></div>
            <p class="promise-line promise-line-3">Chỉ cần ngày mai</p>
            <p class="promise-line promise-line-4">chúng ta vẫn còn</p>
            <p class="promise-line promise-line-5">muốn ở cạnh nhau.”</p>
          </div>

          <div class="promise-lipbalm-tag">
            <span class="lipbalm-tag-dot"></span>
            <span class="lipbalm-tag-text">Lip Balm Nourish &amp; Glow • Lời Hẹn Tình Yêu</span>
          </div>

          <div class="promise-action-footer">
            <button type="button" class="promise-close-btn" id="lipbalmPromiseCloseBtn" aria-label="Đóng lời hẹn">
              <span class="promise-close-bracket">[</span>
              <span class="promise-close-text">Đóng</span>
              <span class="promise-close-bracket">]</span>
            </button>
          </div>
        </div>
      `;

      this.container.appendChild(modal);

      const card = modal.querySelector('#lipbalmPromiseCard');
      const closeBtn = modal.querySelector('#lipbalmPromiseCloseBtn');

      requestAnimationFrame(() => {
        modal.classList.add('active');
        if (card) {
          card.classList.add('revealed');
        }
        if (closeBtn) {
          setTimeout(() => closeBtn.focus(), 4600);
        }
      });

      // ------------------------------------------------------------
      // NGƯỜI DÙNG TỰ ĐÓNG
      // Khi đóng:
      // - Một cánh hoa cuối cùng bay qua màn hình.
      // - Background trở lại tốc độ bình thường.
      // ------------------------------------------------------------
      let isClosing = false;
      const closePromiseModal = () => {
        if (isClosing) return;
        isClosing = true;

        modal.classList.add('closing');
        modal.classList.remove('active');

        // 1. MỘT CÁNH HOA CUỐI CÙNG BAY QUA MÀN HÌNH
        if (window.petalEngine && typeof window.petalEngine.flySinglePetalAcross === 'function') {
          window.petalEngine.flySinglePetalAcross({
            startX: window.innerWidth * 0.38,
            startY: window.innerHeight * 0.46,
            duration: 4800
          });
        }

        // 2. BACKGROUND TRỞ LẠI TỐC ĐỘ BÌNH THƯỜNG
        if (window.bgEngineInstance && typeof window.bgEngineInstance.setSlowMotion === 'function') {
          window.bgEngineInstance.setSlowMotion(false);
        } else if (typeof window.setSlowMotion === 'function') {
          window.setSlowMotion(false);
        }
        this.container.classList.remove('engine-slow-motion');
        this.container.classList.remove('engine-quiet-mode');

        // Phục hồi âm lượng nhạc nền
        if (typeof restoreMusicVolume === 'function') {
          restoreMusicVolume();
        }

        // Làm mờ dần và xóa màn che cinematic dim
        const dimBackdrop = document.getElementById('lipbalmCinematicDim');
        if (dimBackdrop) {
          dimBackdrop.classList.remove('active');
        }

        if (lipbalmShaker) {
          lipbalmShaker.classList.add('shaker-fade-out');
        }

        setTimeout(() => {
          modal.remove();
          if (dimBackdrop) dimBackdrop.remove();
          if (lipbalmShaker) lipbalmShaker.remove();
          this.activeSequences.delete('lipbalm');
          if (window.discoveryEngine) {
            window.discoveryEngine.onSequenceClosed('lipbalm');
          }
        }, 650);

        document.removeEventListener('keydown', handleKeydown);
      };

      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          closePromiseModal();
        }
      };

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closePromiseModal();
        });
      }

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          e.stopPropagation();
          closePromiseModal();
        }
      });

      document.addEventListener('keydown', handleKeydown);
    }

    // --- API kích hoạt tương tác chương trình (Programmatic Trigger) ---
    trigger(bottleId) {
      if (bottleId === 'flower_vase') {
        const bottle = {
          id: 'flower_vase',
          brand: 'Butterfly Pea',
          name: 'Botanical Blossom',
          tag: 'Bình Hoa Đậu Biếc',
          nozzle: { x: 0.5, y: 0.22 },
          bounds: { minX: 0.28, maxX: 0.72, minY: 0.04, maxY: 0.38 }
        };
        const rect = this.container ? this.container.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
        this.triggerFlowerRootReflectionChoreography(bottle, rect.left + rect.width * 0.5, rect.top + rect.height * 0.22);
        return;
      }

      const bottles = window.fragranceBottles || [];
      const bottle = bottles.find((b) => b.id === bottleId);
      if (!bottle || !this.container) return;

      const fRect = this.container.getBoundingClientRect();
      const nozzleX = fRect.left + (bottle.nozzle ? bottle.nozzle.x : 0.5) * fRect.width;
      const nozzleY = fRect.top + (bottle.nozzle ? bottle.nozzle.y : 0.4) * fRect.height;
      this.triggerSequentialChoreography(bottle, nozzleX, nozzleY);
    }
  }

  // Gán lớp và Singleton toàn cục
  window.InteractionEngine = InteractionEngine;

  // Dữ liệu lá thư toàn cục có thể tùy biến qua JavaScript hoặc JSON
  window.TONER_LETTER_DATA = Object.assign({}, InteractionEngine.TONER_LETTER_DATA);

  // API hỗ trợ chỉnh sửa nội dung thư dạng chuỗi JSON hoặc Object
  window.setTonerMessage = function (dataOrJson) {
    if (window.interactionEngine && typeof window.interactionEngine.setTonerMessage === 'function') {
      return window.interactionEngine.setTonerMessage(dataOrJson);
    }
    try {
      let parsed = dataOrJson;
      if (typeof dataOrJson === 'string') {
        try { parsed = JSON.parse(dataOrJson); } catch (_) { parsed = { paragraphs: dataOrJson.split('\n') }; }
      }
      if (parsed && typeof parsed === 'object') {
        window.TONER_LETTER_DATA = Object.assign({}, window.TONER_LETTER_DATA, parsed);
        return true;
      }
    } catch (_) { }
    return false;
  };

  window.getTonerMessage = function () {
    if (window.interactionEngine && typeof window.interactionEngine.getTonerMessage === 'function') {
      return window.interactionEngine.getTonerMessage();
    }
    return JSON.parse(JSON.stringify(window.TONER_LETTER_DATA || InteractionEngine.TONER_LETTER_DATA));
  };

  window.resetTonerMessage = function () {
    window.TONER_LETTER_DATA = Object.assign({}, InteractionEngine.TONER_LETTER_DATA);
    if (window.interactionEngine && typeof window.interactionEngine.setTonerMessage === 'function') {
      window.interactionEngine.setTonerMessage(window.TONER_LETTER_DATA);
    }
    return window.getTonerMessage();
  };

  function initInteractionEngine() {
    if (!window.interactionEngine) {
      window.interactionEngine = new InteractionEngine();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractionEngine);
  } else {
    initInteractionEngine();
  }
})(window, document);
