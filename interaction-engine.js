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
    // HIỆU ỨNG THỊ GIÁC: SÓNG NƯỚC, ĐỐM SÁNG & GỢN GIÓ
    // ============================================================
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
            count: 6,
            force: 1.25,
            spread: 0.55
          });
        }
      }, 180);
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

    // --- API kích hoạt tương tác chương trình (Programmatic Trigger) ---
    trigger(bottleId) {
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
