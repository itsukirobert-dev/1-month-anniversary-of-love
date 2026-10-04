/**
 * ============================================================
 * BUTTERFLY PEA SCENT ENGINE (ĐỘNG CƠ MÙI HƯƠNG THỊ GIÁC)
 * ============================================================
 * 
 * Hệ thống mô phỏng "MÙI HƯƠNG" bằng hiệu ứng ánh sáng & sương:
 * "Một mùi hương vô hình được nhìn thấy bằng ánh sáng."
 * 
 * SOOTHING ESSENCE: ESSENCE = HƯƠNG CỦA KỶ NIỆM
 * 
 * NGUYÊN LÝ THỊ GIÁC & QUANG HỌC:
 * 1. Không dùng khói thuốc, không khói dày, không xám đục.
 * 2. Ribbon ánh sáng (Laminar Light Ribbon): Các dải lụa quang học uốn lượn
 *    mềm mại theo đường cong khí động học, biểu thị luồng tinh dầu khuếch tán.
 * 3. Sương cực mỏng (Ultra-thin Ethereal Mist): Hạt sương siêu mịn với opacity
 *    rất thấp (0.045 - 0.075), tỏa nhẹ làm mát dịu không gian, không khói dày.
 * 4. Glow xanh/trắng (Cyan/White Luminescence): Ánh hào quang ngọc bích hòa
 *    sắc đậu biếc tinh khôi, sáng trong trẻo mà không gắt.
 * 5. Hạt sáng nhỏ & Tinh vân (Micro-Sparkles & Stardust): Các phân tử hương
 *    thơm lấp lánh như bụi sao lững lờ trôi theo luồng đối lưu.
 * 6. Cánh hoa nhỏ trong dòng hương (Miniature Petals in Scent Stream):
 *    Một vài cánh hoa đậu biếc nhỏ nhắn (16px - 24px) xuất hiện tự nhiên
 *    bên trong dòng hương, bay lượn và xoay lật 3D theo đường cong của ánh sáng.
 * 7. Vận tốc chậm, tan dần êm ái trong không khí (5.5 - 7 giây).
 * 8. Thẻ thi vị:
 *    Butterfly Pea
 *    “một chút dịu dàng
 *    còn vương lại
 *    trong không khí...”
 * ============================================================
 */

(function (window, document) {
  'use strict';

  // --- 1. TIỀN TẢI CÁNH HOA ĐẬU BIẾC CHO DÒNG HƯƠNG (PETAL SPRITES) ---
  const PETAL_SOURCES = [
    'assets/images/falling_branches/petal_1.png',
    'assets/images/falling_branches/petal_2.png',
    'assets/images/falling_branches/petal_3.png',
    'assets/images/falling_branches/petal_4.png'
  ];

  const preloadedPetalImages = [];
  PETAL_SOURCES.forEach(src => {
    const img = new Image();
    img.src = src;
    preloadedPetalImages.push(img);
  });

  // --- 2. ÂM THANH GIỌT HƯƠNG THANH THOÁT (WEB AUDIO API) ---
  function playEtherealScentTone() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // 1. Tiếng thở của làn sương (Pink Noise qua Bandpass Filter)
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.11;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(3200, now);
      noiseFilter.Q.setValueAtTime(1.8, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.024, now + 0.05);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.45);

      // 2. Nốt nhạc Solfeggio 528Hz (Tần số bình yên & chữa lành tình yêu)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now);
      osc.frequency.exponentialRampToValueAtTime(1056, now + 0.35); // Vút lên quãng 8 nhẹ như giọt sương

      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.exponentialRampToValueAtTime(0.015, now + 0.03);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.50);
    } catch (e) {
      // Bỏ qua nếu trình duyệt chặn autoplay audio
    }
  }

  // --- 3. TOÁN HỌC QUỸ ĐẠO CONG (CUBIC BÉZIER & CATMULL-ROM) ---
  function cubicBezierPoint(p0, p1, p2, p3, t) {
    const oneMinusT = 1 - t;
    const oneMinusT2 = oneMinusT * oneMinusT;
    const oneMinusT3 = oneMinusT2 * oneMinusT;
    const t2 = t * t;
    const t3 = t2 * t;

    return {
      x: oneMinusT3 * p0.x + 3 * oneMinusT2 * t * p1.x + 3 * oneMinusT * t2 * p2.x + t3 * p3.x,
      y: oneMinusT3 * p0.y + 3 * oneMinusT2 * t * p1.y + 3 * oneMinusT * t2 * p2.y + t3 * p3.y
    };
  }

  function cubicBezierTangent(p0, p1, p2, p3, t) {
    const oneMinusT = 1 - t;
    const oneMinusT2 = oneMinusT * oneMinusT;
    const t2 = t * t;

    const dx = 3 * oneMinusT2 * (p1.x - p0.x) + 6 * oneMinusT * t * (p2.x - p1.x) + 3 * t2 * (p3.x - p2.x);
    const dy = 3 * oneMinusT2 * (p1.y - p0.y) + 6 * oneMinusT * t * (p2.y - p1.y) + 3 * t2 * (p3.y - p2.y);
    const len = Math.hypot(dx, dy) || 1;
    return { dx: dx / len, dy: dy / len, normalX: -dy / len, normalY: dx / len };
  }

  /**
   * ============================================================
   * LỚP ĐIỀU HÀNH SCENT ENGINE (SCENT ENGINE CONTROLLER)
   * ============================================================
   */
  class ScentEngine {
    constructor(options = {}) {
      this.options = Object.assign({
        canvasId: 'scentEngineCanvas',
        containerId: 'livingFrame',
        textContainerId: 'fragranceTextContainer',
        autoResize: true
      }, options);

      this.canvas = null;
      this.ctx = null;
      this.width = 0;
      this.height = 0;
      this.dpr = window.devicePixelRatio || 1;

      this.livingFrame = null;
      this.textContainer = null;

      this.activePlumes = [];
      this.isRenderLoopActive = false;
      this.activeScentCards = new Map();

      this.init();
    }

    init() {
      this.livingFrame = document.getElementById(this.options.containerId) || document.querySelector('.living-frame');
      this.textContainer = document.getElementById(this.options.textContainerId) || document.querySelector('.fragrance-text-container');

      // Tìm hoặc tạo canvas dành riêng cho Scent Engine
      this.canvas = document.getElementById('scentEngineCanvas') || document.getElementById(this.options.canvasId);
      if (!this.canvas && this.livingFrame) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'scentEngineCanvas';
        this.canvas.className = 'scent-engine-canvas';
        this.livingFrame.appendChild(this.canvas);
      }

      if (this.canvas) {
        this.canvas.classList.add('scent-engine-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();

        if (this.options.autoResize) {
          window.addEventListener('resize', () => this.resize(), { passive: true });
          if (window.ResizeObserver && this.livingFrame) {
            const ro = new ResizeObserver(() => this.resize());
            ro.observe(this.livingFrame);
          }
        }
      }
    }

    resize() {
      if (!this.canvas || !this.livingFrame) return;
      const rect = this.livingFrame.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      this.width = rect.width;
      this.height = rect.height;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);

      if (this.ctx) {
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      }
    }

    /**
     * Kích hoạt làn hương thơm từ một chai mỹ phẩm
     * @param {Object} bottle - Thông tin chai mỹ phẩm (id, name, nozzle, ribbonColor, sprayAngle...)
     * @param {Object} options - Tùy chọn mở rộng
     */
    emitFromBottle(bottle, options = {}) {
      if (!bottle) return;
      this.resize();

      const nozzleRelX = (bottle.nozzle && typeof bottle.nozzle.x === 'number') ? bottle.nozzle.x : 0.5;
      const nozzleRelY = (bottle.nozzle && typeof bottle.nozzle.y === 'number') ? bottle.nozzle.y : 0.5;

      const originX = (typeof options.originX === 'number') ? options.originX : nozzleRelX * this.width;
      const originY = (typeof options.originY === 'number') ? options.originY : nozzleRelY * this.height;
      const sprayAngle = (typeof bottle.sprayAngle === 'number') ? bottle.sprayAngle : 0;

      const color = bottle.ribbonColor || { r: 125, g: 211, b: 252 };

      // Phát âm thanh thanh thoát nếu được phép
      if (options.playAudio !== false) {
        playEtherealScentTone();
      }

      // Tạo đốm sáng flash ngay vòi xịt
      this.createNozzleFlash(originX, originY);

      // Hiển thị thẻ chữ thi vị "Butterfly Pea / một chút dịu dàng..."
      if (options.showCard) {
        this.showScentNoteCard(bottle, originX, originY);
      }

      // Khởi tạo thực thể chùm hương (Scent Plume)
      this.createScentPlume({
        originX,
        originY,
        sprayAngle,
        color,
        bottle,
        intensity: options.intensity || 1.0
      });
    }

    /**
     * Tạo đốm sáng hào quang vi mô ngay miệng vòi xịt
     */
    createNozzleFlash(x, y) {
      if (!this.livingFrame) return;
      const flashEl = document.createElement('div');
      flashEl.className = 'scent-nozzle-aura';
      flashEl.style.left = `${x.toFixed(1)}px`;
      flashEl.style.top = `${y.toFixed(1)}px`;
      this.livingFrame.appendChild(flashEl);

      setTimeout(() => {
        if (flashEl.parentElement) {
          flashEl.remove();
        }
      }, 760);
    }

    /**
     * Khởi tạo một chùm hương hoàn chỉnh:
     * - Vòng sóng aura
     * - Các dải lụa Ribbon uốn lượn
     * - Sương cực mỏng (không tạo hiệu ứng khói dày)
     * - Hạt sáng & stardust lấp lánh
     * - Cánh hoa nhỏ bay bên trong dòng hương
     * - Dòng hương uốn lượn và tan dần
     */
    createScentPlume(config) {
      const { originX, originY, sprayAngle, color, bottle } = config;

      // Giới hạn số chùm hương đồng thời để tối ưu hiệu năng
      if (this.activePlumes.length >= 4) {
        const oldest = this.activePlumes[0];
        oldest.maxLife = Math.min(oldest.maxLife, oldest.life + 28);
      }

      // Nhận diện SOOTHING ESSENCE hoặc các vị trí ở nửa phải khung tranh
      const isEssence = (bottle && bottle.id === 'essence') || originX > this.width * 0.65;
      const plumeHeight = Math.min(340, this.height * 0.48);
      // Với chai essence bên phải, uốn lượn nhẹ về phía tâm không gian mở bên trái (driftDir = -1)
      const driftDir = isEssence ? -1 : (sprayAngle !== 0 ? Math.sign(sprayAngle) : (Math.random() > 0.5 ? 1 : -1));

      // 1. Quỹ đạo Bézier trung tâm (Central Streamline) uốn lượn nhẹ nhàng
      const p0 = { x: originX, y: originY };
      const p1 = {
        x: originX + (isEssence ? -22 : sprayAngle * 45) + (Math.random() - 0.5) * 8,
        y: originY - plumeHeight * 0.28
      };
      const p2 = {
        x: originX + (isEssence ? -62 : (sprayAngle * 95 + driftDir * (35 + Math.random() * 25))),
        y: originY - plumeHeight * 0.66
      };
      const p3 = {
        x: originX + (isEssence ? -98 : (sprayAngle * 135 + driftDir * (60 + Math.random() * 40))),
        y: originY - plumeHeight * 1.05
      };

      // 2. Vòng sóng aura vi mô quanh miệng chai
      const auraRings = [
        { x: originX, y: originY, startR: 2, maxR: 28, baseAlpha: 0.35, life: 0, maxLife: 42 },
        { x: originX, y: originY, startR: 1, maxR: 44, baseAlpha: 0.22, life: -8, maxLife: 56 }
      ];

      // 3. Ribbon ánh sáng uốn lượn (2 dải chính + 1 sợi filament trung tâm)
      const ribbons = [
        // Ribbon chính: Mềm mại, lan tỏa sắc xanh ngọc đậu biếc tinh khôi
        {
          id: 'main-ribbon',
          p0, p1, p2, p3,
          color: color || { r: 125, g: 211, b: 252 },
          maxWidth: 22,
          baseAlpha: 0.20, // Opacity thấp đúng tiêu chuẩn sang trọng
          waveFreq: 0.022,
          waveAmp: 9.5,
          twistFreq: 0.026,
          twistPhase: 0,
          life: 0,
          maxLife: 360, // Chuyển động chậm (~6 giây)
          detachDelay: 52
        },
        // Ribbon phụ: Dịu dàng, đan xen sắc tím lavender đậu biếc hoàng hôn
        {
          id: 'whisper-ribbon',
          p0,
          p1: { x: p1.x - driftDir * 14, y: p1.y + 10 },
          p2: { x: p2.x - driftDir * 20, y: p2.y },
          p3: { x: p3.x - driftDir * 28, y: p3.y - 12 },
          color: { r: 199, g: 210, b: 254 }, // Xanh tím Lavender đậu biếc
          maxWidth: 16,
          baseAlpha: 0.15, // Rất mỏng nhẹ
          waveFreq: 0.028,
          waveAmp: 7.5,
          twistFreq: 0.032,
          twistPhase: 1.8,
          life: 0,
          maxLife: 350,
          detachDelay: 62
        },
        // Sợi filament phát sáng lõi (Luminous Core Thread)
        {
          id: 'core-filament',
          p0, p1, p2, p3,
          color: { r: 255, g: 255, b: 255 }, // Trắng ngọc tinh khiết
          maxWidth: 2.2,
          baseAlpha: 0.38,
          waveFreq: 0.024,
          waveAmp: 5,
          twistFreq: 0.038,
          twistPhase: 0.5,
          life: 0,
          maxLife: 370,
          detachDelay: 45
        }
      ];

      // 4. Sương cực mỏng (Ultra-thin Ethereal Mist)
      // TUYỆT ĐỐI KHÔNG DÙNG KHÓI DÀY, KHÔNG XÁM ĐỤC, TRONG TRẺO NHƯ SƯƠNG SỚM
      const mistParticles = [];
      const mistCount = 22;
      for (let i = 0; i < mistCount; i++) {
        const spread = (Math.random() - 0.5) * 1.6 + (isEssence ? -0.35 : sprayAngle * 2.0);
        const initialSpeed = 1.2 + Math.random() * 1.6; // Tốc độ ban đầu chậm rãi
        mistParticles.push({
          x: originX + (Math.random() - 0.5) * 8,
          y: originY - Math.random() * 4,
          vx: spread * 0.65,
          vy: -initialSpeed,
          drag: 0.984, // Hãm không khí cao, biến thành luồng sương bồng bềnh
          driftY: -(0.20 + Math.random() * 0.30),
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.018 + Math.random() * 0.02,
          swayAmp: 0.4 + Math.random() * 0.5,
          radius: 7 + Math.random() * 5,
          maxRadius: 32 + Math.random() * 15,
          baseAlpha: 0.045 + Math.random() * 0.030, // CỰC KỲ MỎNG NHẸ (0.045 - 0.075)
          life: 0,
          maxLife: 290 + Math.random() * 60, // Bay lơ lửng lâu
          color: { r: 224, g: 242, b: 254 } // Lam ngọc trắng sương mai
        });
      }

      // 5. Hạt sáng nhỏ & Tinh vân (Micro-Sparkles & Stardust)
      const sparkles = [];
      const sparkleCount = 36;
      for (let i = 0; i < sparkleCount; i++) {
        const isDiamond = Math.random() > 0.60; // Một số hạt có tia sáng 4 cánh
        sparkles.push({
          x: originX + (Math.random() - 0.5) * 12,
          y: originY - Math.random() * 6,
          vx: (Math.random() - 0.5) * 1.3 + (isEssence ? -0.3 : sprayAngle * 1.2),
          vy: -(1.1 + Math.random() * 2.1),
          drag: 0.980,
          driftY: -(0.18 + Math.random() * 0.35),
          rot: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 3.2,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.045 + Math.random() * 0.045,
          size: 1.4 + Math.random() * 1.8,
          isDiamond,
          baseAlpha: 0.38 + Math.random() * 0.42,
          life: 0,
          maxLife: 280 + Math.random() * 70
        });
      }

      // 6. Một vài cánh hoa nhỏ xuất hiện bên trong dòng hương (Miniature Petals in Scent Stream)
      // Xuất hiện tự nhiên, trôi bồng bềnh theo đúng đường cong của dòng hương
      const petals = [];
      const petalCount = 3; // 3 cánh hoa nhỏ nhắn, tinh tế
      for (let i = 0; i < petalCount; i++) {
        const spriteIndex = i % preloadedPetalImages.length;
        const sprite = preloadedPetalImages[spriteIndex];
        const launchDelay = 22 + i * 32; // Xuất hiện lần lượt trong dòng hương (22, 54, 86 frames)
        const petalWidth = 18 + Math.random() * 6; // Kích thước thanh tú 18px - 24px
        const aspect = 1.0;

        petals.push({
          sprite,
          width: petalWidth,
          height: petalWidth * aspect,
          p0, p1, p2, p3,
          launchDelay,
          life: 0,
          maxLife: 280 + i * 20,
          s: 0, // Vị trí tham số dọc theo đường cong (0 -> 1)
          speed: 0.0035 - i * 0.0003, // Bay êm dịu
          lateralOffset: (Math.random() - 0.5) * 12,
          lateralFreq: 0.028 + Math.random() * 0.02,
          lateralPhase: Math.random() * Math.PI * 2,
          rotZ: Math.random() * 360,
          rotSpeedZ: (Math.random() - 0.5) * 1.6,
          flipX: Math.random() * Math.PI,
          flipSpeedX: 0.022 + Math.random() * 0.018,
          flipY: Math.random() * Math.PI,
          flipSpeedY: 0.016 + Math.random() * 0.016,
          baseAlpha: 0.75 // Độ trong suốt nhẹ nhàng
        });
      }

      const plume = {
        id: Date.now() + Math.random(),
        p0, p1, p2, p3,
        color,
        auraRings,
        ribbons,
        mistParticles,
        sparkles,
        petals,
        life: 0,
        maxLife: 370
      };

      this.activePlumes.push(plume);

      if (!this.isRenderLoopActive) {
        this.isRenderLoopActive = true;
        requestAnimationFrame((time) => this.render(time));
      }
    }

    /**
     * Vòng lặp vẽ đồ họa Canvas tối ưu 60fps
     */
    render() {
      if (!this.ctx || this.width === 0 || this.height === 0) {
        if (this.activePlumes.length > 0) {
          requestAnimationFrame((t) => this.render(t));
        } else {
          this.isRenderLoopActive = false;
        }
        return;
      }

      this.ctx.clearRect(0, 0, this.width, this.height);

      let totalLivingElements = 0;

      for (let b = this.activePlumes.length - 1; b >= 0; b--) {
        const plume = this.activePlumes[b];
        plume.life++;

        // ------------------------------------------------------------
        // A. VẼ VÒNG SÓNG AURA MIỆNG VÒI XỊT
        // ------------------------------------------------------------
        for (let i = plume.auraRings.length - 1; i >= 0; i--) {
          const ring = plume.auraRings[i];
          ring.life++;
          if (ring.life < 0) continue;
          if (ring.life >= ring.maxLife) {
            plume.auraRings.splice(i, 1);
            continue;
          }
          totalLivingElements++;

          const prog = ring.life / ring.maxLife;
          const currentR = ring.startR + (ring.maxR - ring.startR) * Math.sqrt(prog);
          const alpha = ring.baseAlpha * (1 - prog);

          this.ctx.save();
          this.ctx.globalCompositeOperation = 'screen';
          this.ctx.beginPath();
          this.ctx.ellipse(ring.x, ring.y, currentR, currentR * 0.44, 0, 0, Math.PI * 2);
          this.ctx.lineWidth = 1.3;
          this.ctx.strokeStyle = `rgba(224, 242, 254, ${alpha.toFixed(3)})`;
          this.ctx.shadowColor = 'rgba(186, 230, 253, 0.8)';
          this.ctx.shadowBlur = 6;
          this.ctx.stroke();
          this.ctx.restore();
        }

        // ------------------------------------------------------------
        // B. VẼ DẢI LỤA RIBBON ÁNH SÁNG UỐN LƯỢN (LAMINAR LIGHT RIBBON)
        // ------------------------------------------------------------
        for (let r = 0; r < plume.ribbons.length; r++) {
          const ribbon = plume.ribbons[r];
          ribbon.life++;
          if (ribbon.life >= ribbon.maxLife) continue;
          totalLivingElements++;

          const progress = ribbon.life / ribbon.maxLife;

          // Đầu ribbon vươn lên mượt mà theo đường cong Bézier
          const headProgress = Math.min(1.0, progress / 0.35);

          // Đuôi ribbon tách khỏi vòi xịt sau một khoảng thời gian
          let tailProgress = 0;
          if (ribbon.life > ribbon.detachDelay) {
            tailProgress = Math.min(1.0, (ribbon.life - ribbon.detachDelay) / (ribbon.maxLife - ribbon.detachDelay));
          }

          if (headProgress <= tailProgress + 0.01) continue;

          // Tính toán Opacity: Hiện êm dịu, giữ đều và tan dần trong không khí
          let ribbonAlpha = 1.0;
          if (progress < 0.14) {
            ribbonAlpha = progress / 0.14;
          } else if (progress > 0.45) {
            // Tan dần mềm mại (Cosine fade-out)
            const fadeProg = (progress - 0.45) / 0.55;
            ribbonAlpha = Math.cos(fadeProg * Math.PI * 0.5);
          }
          ribbonAlpha *= ribbon.baseAlpha;
          if (ribbonAlpha <= 0.004) continue;

          // Chia đường cong thành 32 phân đoạn mượt mà
          const steps = 32;
          const spinePts = [];
          const leftPts = [];
          const rightPts = [];

          for (let s = 0; s <= steps; s++) {
            const segT = tailProgress + (s / steps) * (headProgress - tailProgress);
            const pt = cubicBezierPoint(ribbon.p0, ribbon.p1, ribbon.p2, ribbon.p3, segT);
            const tangent = cubicBezierTangent(ribbon.p0, ribbon.p1, ribbon.p2, ribbon.p3, segT);

            const distAlong = segT * 300;
            // Sóng uốn lượn hữu cơ nhịp nhàng
            const wave = Math.sin(distAlong * ribbon.waveFreq + ribbon.life * 0.026) * ribbon.waveAmp;
            pt.x += tangent.normalX * wave;
            pt.y += tangent.normalY * wave;

            // Biên dạng độ rộng ribbon: hẹp ở gốc & ngọn, nở nhẹ ở giữa như dải lụa
            const localU = s / steps;
            const widthEnvelope = Math.sin(localU * Math.PI);
            const twist = Math.sin(distAlong * ribbon.twistFreq + ribbon.twistPhase + ribbon.life * 0.022);
            const currentW = Math.max(1.4, ribbon.maxWidth * widthEnvelope * (0.35 + 0.65 * Math.abs(twist)));

            spinePts.push(pt);
            leftPts.push({
              x: pt.x + tangent.normalX * (currentW * 0.5),
              y: pt.y + tangent.normalY * (currentW * 0.5)
            });
            rightPts.push({
              x: pt.x - tangent.normalX * (currentW * 0.5),
              y: pt.y - tangent.normalY * (currentW * 0.5)
            });
          }

          if (spinePts.length < 2) continue;

          this.ctx.save();
          this.ctx.globalCompositeOperation = 'screen';

          // Gradient màu dọc theo chiều dài ribbon
          const headPt = spinePts[spinePts.length - 1];
          const tailPt = spinePts[0];
          const grad = this.ctx.createLinearGradient(tailPt.x, tailPt.y, headPt.x, headPt.y);
          const col = ribbon.color;

          grad.addColorStop(0, `rgba(255, 255, 255, ${(ribbonAlpha * 0.65).toFixed(3)})`);
          grad.addColorStop(0.28, `rgba(${col.r}, ${col.g}, ${col.b}, ${(ribbonAlpha * 0.45).toFixed(3)})`);
          grad.addColorStop(0.70, `rgba(186, 230, 253, ${(ribbonAlpha * 0.25).toFixed(3)})`);
          grad.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);

          // Vẽ bề mặt dải lụa quang học dạng quadric curve
          this.ctx.beginPath();
          this.ctx.moveTo(leftPts[0].x, leftPts[0].y);
          for (let k = 1; k < leftPts.length - 1; k++) {
            const midX = (leftPts[k].x + leftPts[k + 1].x) * 0.5;
            const midY = (leftPts[k].y + leftPts[k + 1].y) * 0.5;
            this.ctx.quadraticCurveTo(leftPts[k].x, leftPts[k].y, midX, midY);
          }
          this.ctx.lineTo(leftPts[leftPts.length - 1].x, leftPts[leftPts.length - 1].y);
          this.ctx.lineTo(rightPts[rightPts.length - 1].x, rightPts[rightPts.length - 1].y);
          for (let k = rightPts.length - 2; k > 0; k--) {
            const midX = (rightPts[k].x + rightPts[k - 1].x) * 0.5;
            const midY = (rightPts[k].y + rightPts[k - 1].y) * 0.5;
            this.ctx.quadraticCurveTo(rightPts[k].x, rightPts[k].y, midX, midY);
          }
          this.ctx.lineTo(rightPts[0].x, rightPts[0].y);
          this.ctx.closePath();

          this.ctx.fillStyle = grad;
          this.ctx.shadowColor = `rgba(${col.r}, ${col.g}, ${col.b}, 0.5)`;
          this.ctx.shadowBlur = 10;
          this.ctx.fill();

          // Sống sáng tơ ngọc ở trung tâm ribbon
          this.ctx.beginPath();
          this.ctx.moveTo(spinePts[0].x, spinePts[0].y);
          for (let k = 1; k < spinePts.length - 1; k++) {
            const midX = (spinePts[k].x + spinePts[k + 1].x) * 0.5;
            const midY = (spinePts[k].y + spinePts[k + 1].y) * 0.5;
            this.ctx.quadraticCurveTo(spinePts[k].x, spinePts[k].y, midX, midY);
          }
          this.ctx.lineTo(spinePts[spinePts.length - 1].x, spinePts[spinePts.length - 1].y);
          this.ctx.lineWidth = Math.max(0.8, ribbon.maxWidth * 0.10);
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${(ribbonAlpha * 0.70).toFixed(3)})`;
          this.ctx.shadowColor = '#ffffff';
          this.ctx.shadowBlur = 4;
          this.ctx.stroke();

          this.ctx.restore();
        }

        // ------------------------------------------------------------
        // C. VẼ SƯƠNG CỰC MỎNG (ULTRA-THIN ETHEREAL MIST)
        // Tuyệt đối không tạo khói dày, hạt siêu mịn trong suốt
        // ------------------------------------------------------------
        for (let i = plume.mistParticles.length - 1; i >= 0; i--) {
          const p = plume.mistParticles[i];
          p.life++;
          if (p.life >= p.maxLife) {
            plume.mistParticles.splice(i, 1);
            continue;
          }
          totalLivingElements++;

          p.vy *= p.drag;
          p.vx *= p.drag;
          p.y += p.vy + p.driftY;
          p.swayPhase += p.swaySpeed;
          p.x += p.vx + Math.sin(p.swayPhase) * p.swayAmp;

          const prog = p.life / p.maxLife;
          const rad = p.radius + (p.maxRadius - p.radius) * Math.sqrt(prog);

          // Opacity hình chuông: Tăng êm, giảm mờ tan vào không khí
          let alpha = p.baseAlpha * Math.sin(prog * Math.PI);
          if (alpha <= 0.003) continue;

          const mg = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
          mg.addColorStop(0, `rgba(255, 255, 255, ${(alpha * 0.55).toFixed(3)})`);
          mg.addColorStop(0.35, `rgba(224, 242, 254, ${(alpha * 0.30).toFixed(3)})`);
          mg.addColorStop(0.70, `rgba(186, 230, 253, ${(alpha * 0.10).toFixed(3)})`);
          mg.addColorStop(1, 'rgba(147, 197, 253, 0)');

          this.ctx.save();
          this.ctx.globalCompositeOperation = 'screen';
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
          this.ctx.fillStyle = mg;
          this.ctx.fill();
          this.ctx.restore();
        }

        // ------------------------------------------------------------
        // D. VẼ HẠT SÁNG NHỎ & TINH VÂN (MICRO-SPARKLES & STARDUST)
        // ------------------------------------------------------------
        for (let i = plume.sparkles.length - 1; i >= 0; i--) {
          const sp = plume.sparkles[i];
          sp.life++;
          if (sp.life >= sp.maxLife) {
            plume.sparkles.splice(i, 1);
            continue;
          }
          totalLivingElements++;

          sp.vy *= sp.drag;
          sp.vx *= sp.drag;
          sp.y += sp.vy + sp.driftY;
          sp.x += sp.vx + Math.sin(sp.twinklePhase) * 0.25;
          sp.rot += sp.rotSpeed;
          sp.twinklePhase += sp.twinkleSpeed;

          const prog = sp.life / sp.maxLife;
          const alpha = sp.baseAlpha * Math.sin(prog * Math.PI) * (0.6 + 0.4 * Math.sin(sp.twinklePhase));
          if (alpha <= 0.008) continue;

          this.ctx.save();
          this.ctx.globalCompositeOperation = 'screen';
          this.ctx.translate(sp.x, sp.y);
          this.ctx.rotate((sp.rot * Math.PI) / 180);

          if (sp.isDiamond) {
            // Đốm sao 4 cánh lấp lánh nhẹ
            const arm = sp.size * 2.2;
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${(alpha * 0.95).toFixed(3)})`;
            this.ctx.lineWidth = 1.0;
            this.ctx.beginPath();
            this.ctx.moveTo(-arm, 0);
            this.ctx.lineTo(arm, 0);
            this.ctx.moveTo(0, -arm);
            this.ctx.lineTo(0, arm);
            this.ctx.stroke();

            // Nhụy sáng tròn ở giữa
            this.ctx.beginPath();
            this.ctx.arc(0, 0, sp.size * 0.8, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(224, 242, 254, ${(alpha * 0.9).toFixed(3)})`;
            this.ctx.shadowColor = '#38bdf8';
            this.ctx.shadowBlur = 6;
            this.ctx.fill();
          } else {
            // Hạt sáng tròn lung linh
            const sg = this.ctx.createRadialGradient(0, 0, 0, 0, 0, sp.size * 1.8);
            sg.addColorStop(0, `rgba(255, 255, 255, ${(alpha * 0.95).toFixed(3)})`);
            sg.addColorStop(0.4, `rgba(186, 230, 253, ${(alpha * 0.60).toFixed(3)})`);
            sg.addColorStop(1, 'rgba(147, 197, 253, 0)');

            this.ctx.beginPath();
            this.ctx.arc(0, 0, sp.size * 1.8, 0, Math.PI * 2);
            this.ctx.fillStyle = sg;
            this.ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
            this.ctx.shadowBlur = 5;
            this.ctx.fill();
          }

          this.ctx.restore();
        }

        // ------------------------------------------------------------
        // E. VẼ CÁNH HOA NHỎ BAY BÊN TRONG DÒNG HƯƠNG (PETALS IN SCENT STREAM)
        // Cánh hoa đậu biếc nhỏ nhắn, trôi bồng bềnh và xoay lật 3D theo đường cong ánh sáng
        // ------------------------------------------------------------
        for (let pIdx = 0; pIdx < plume.petals.length; pIdx++) {
          const petal = plume.petals[pIdx];
          petal.life++;

          // Chờ đến thời điểm xuất hiện tự nhiên bên trong dòng hương
          if (petal.life < petal.launchDelay) continue;
          if (petal.life >= petal.maxLife) continue;
          totalLivingElements++;

          const flightLife = petal.life - petal.launchDelay;
          const flightMaxLife = petal.maxLife - petal.launchDelay;
          const rawProgress = flightLife / flightMaxLife;

          // Tiến trình di chuyển dọc theo đường cong Bézier của dòng hương
          petal.s = Math.min(1.0, petal.s + petal.speed);

          // Tọa độ trên đường cong Bézier
          const curvePt = cubicBezierPoint(petal.p0, petal.p1, petal.p2, petal.p3, petal.s);
          const tangent = cubicBezierTangent(petal.p0, petal.p1, petal.p2, petal.p3, petal.s);

          // Độ chao đảo ngang dòng hương (Sway across scent stream)
          petal.lateralPhase += petal.lateralFreq;
          const lateralDisplacement = Math.sin(petal.lateralPhase) * petal.lateralOffset;

          // Nhịp sóng uốn lượn hòa cùng ribbon ánh sáng
          const ribbonWave = Math.sin((petal.s * 300) * 0.022 + plume.life * 0.026) * 8;

          const posX = curvePt.x + tangent.normalX * (lateralDisplacement + ribbonWave);
          const posY = curvePt.y + tangent.normalY * (lateralDisplacement + ribbonWave);

          // Xoay lật 3D nhẹ nhàng (3D Tumbling in scent breeze)
          petal.rotZ += petal.rotSpeedZ;
          petal.flipX += petal.flipSpeedX;
          petal.flipY += petal.flipSpeedY;

          const scaleX = Math.cos(petal.flipX) * 0.88;
          const scaleY = Math.cos(petal.flipY) * 0.88;

          // Opacity xuất hiện mềm mại rồi tan dần
          let petalAlpha = 1.0;
          if (rawProgress < 0.12) {
            petalAlpha = rawProgress / 0.12;
          } else if (rawProgress > 0.65) {
            petalAlpha = 1 - (rawProgress - 0.65) / 0.35;
          }
          petalAlpha *= petal.baseAlpha;
          if (petalAlpha <= 0.005) continue;

          // Vẽ cánh hoa bằng Canvas
          const safeScaleX = Math.max(0.06, Math.abs(scaleX)) * Math.sign(scaleX || 1);
          const safeScaleY = Math.max(0.06, Math.abs(scaleY)) * Math.sign(scaleY || 1);

          if (petal.sprite && petal.sprite.complete && petal.sprite.naturalWidth > 0) {
            this.ctx.save();
            this.ctx.translate(posX, posY);
            this.ctx.rotate((petal.rotZ * Math.PI) / 180);
            this.ctx.scale(safeScaleX, safeScaleY);
            this.ctx.globalAlpha = petalAlpha;

            // Hào quang xanh ngọc đậu biếc quanh cánh hoa
            this.ctx.shadowColor = 'rgba(186, 230, 253, 0.75)';
            this.ctx.shadowBlur = 8;

            const drawW = petal.width;
            const drawH = petal.height;
            this.ctx.drawImage(petal.sprite, -drawW * 0.5, -drawH * 0.5, drawW, drawH);

            this.ctx.restore();
          } else {
            // Dự phòng mỹ thuật: Vẽ cánh hoa đậu biếc nghệ thuật bằng Vector Path
            this.ctx.save();
            this.ctx.translate(posX, posY);
            this.ctx.rotate((petal.rotZ * Math.PI) / 180);
            this.ctx.scale(safeScaleX, safeScaleY);
            this.ctx.globalAlpha = petalAlpha * 0.88;
            this.ctx.shadowColor = 'rgba(147, 197, 253, 0.8)';
            this.ctx.shadowBlur = 6;

            const pw = petal.width * 0.5;
            const ph = petal.height * 0.5;
            const pg = this.ctx.createLinearGradient(-pw, -ph, pw, ph);
            pg.addColorStop(0, 'rgba(186, 230, 253, 0.95)');
            pg.addColorStop(0.5, 'rgba(96, 165, 250, 0.85)');
            pg.addColorStop(1, 'rgba(59, 130, 246, 0.7)');

            this.ctx.beginPath();
            this.ctx.moveTo(0, -ph);
            this.ctx.bezierCurveTo(pw, -ph * 0.6, pw * 0.8, ph * 0.6, 0, ph);
            this.ctx.bezierCurveTo(-pw * 0.8, ph * 0.6, -pw, -ph * 0.6, 0, -ph);
            this.ctx.fillStyle = pg;
            this.ctx.fill();
            this.ctx.restore();
          }
        }

        // Kiểm tra xem chùm hương đã tan hết chưa
        const hasRibbonAlive = plume.ribbons.some(r => r.life < r.maxLife);
        const hasPetalsAlive = plume.petals.some(p => p.life < p.maxLife);
        if (!hasRibbonAlive && !hasPetalsAlive && plume.mistParticles.length === 0 && plume.sparkles.length === 0 && plume.auraRings.length === 0) {
          this.activePlumes.splice(b, 1);
        }
      }

      if (totalLivingElements > 0 && this.activePlumes.length > 0) {
        requestAnimationFrame((t) => this.render(t));
      } else {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.isRenderLoopActive = false;
      }
    }

    /**
     * Hiển thị thẻ chữ thi vị bay bổng của dòng hương:
     * Butterfly Pea
     * "một chút dịu dàng
     * còn vương lại
     * trong không khí..."
     */
    showScentNoteCard(bottle, nozzleX, nozzleY) {
      if (!this.textContainer || !bottle) return;

      const bottleId = bottle.id || 'scent-note';

      // Chai SERUM kích hoạt ký ức đặc biệt không dùng thẻ note tạm thời
      if (bottleId === 'serum') {
        if (window.interactionEngine && typeof window.interactionEngine.trigger === 'function') {
          window.interactionEngine.trigger('serum');
        }
        return;
      }

      // Hũ RADIANCE CREAM: CREAM = DÒNG THỜI GIAN
      if (bottleId === 'cream') {
        if (window.interactionEngine && typeof window.interactionEngine.trigger === 'function') {
          window.interactionEngine.trigger('cream');
        }
        return;
      }

      // Chai HYDRATING TONER: TONER = LỜI NHẮN
      if (bottleId === 'toner') {
        if (window.interactionEngine && typeof window.interactionEngine.trigger === 'function') {
          window.interactionEngine.trigger('toner');
        }
        return;
      }

      // Xóa thẻ cũ của chai này nếu đang có
      const existing = this.activeScentCards.get(bottleId);
      if (existing && existing.parentElement) {
        existing.classList.remove('active');
        existing.classList.add('dissolving');
        setTimeout(() => existing.remove(), 700);
      }

      const card = document.createElement('div');
      card.className = 'scent-note-card';
      card.setAttribute('data-bottle-id', bottleId);

      // Tọa độ thẻ: Đặt ngay phía trên vòi xịt, tự động căn chỉnh không tràn mép
      const clampedX = Math.max(130, Math.min(this.width - 130, nozzleX - 35));
      const clampedY = Math.max(75, nozzleY - 70);

      card.style.left = `${clampedX.toFixed(1)}px`;
      card.style.top = `${clampedY.toFixed(1)}px`;

      const brandTitle = bottle.brand || 'Butterfly Pea';
      const productName = (bottleId === 'essence') ? 'SOOTHING ESSENCE' : (bottle.name || 'Hương Hoa Đậu Biếc');
      const productTag = (bottleId === 'essence') ? 'HƯƠNG CỦA KỶ NIỆM' : (bottle.tag || 'Tinh Chất Dưỡng Nàng Thơ');

      card.innerHTML = `
        <div class="scent-card-header">
          <span class="scent-card-gem">✦</span>
          <span class="scent-card-brand">${brandTitle}</span>
          <span class="scent-card-gem">✦</span>
        </div>
        <div class="scent-card-tag">
          <span class="scent-tag-dot"></span>
          <span>${productName} • ${productTag}</span>
        </div>
        <div class="scent-card-poem">
          <p class="scent-poem-line line-1">“một chút dịu dàng</p>
          <p class="scent-poem-line line-2">còn vương lại</p>
          <p class="scent-poem-line line-3">trong không khí...”</p>
        </div>
        <div class="scent-card-actions">
          <button type="button" class="scent-action-btn close-btn" title="Đóng thẻ hương" aria-label="Đóng">
            <i class="fa-solid fa-xmark"></i> <span class="btn-text">Đóng</span>
          </button>
        </div>
      `;

      this.textContainer.appendChild(card);
      this.activeScentCards.set(bottleId, card);

      // Animation xuất hiện mượt mà
      requestAnimationFrame(() => {
        card.classList.add('active');
      });

      // Hàm đóng thẻ mềm mại do người dùng tự quyết định
      const dissolveCard = () => {
        if (!card.parentElement) return;
        card.classList.remove('active');
        card.classList.add('dissolving');
        setTimeout(() => {
          if (card.parentElement) {
            card.remove();
          }
          if (this.activeScentCards.get(bottleId) === card) {
            this.activeScentCards.delete(bottleId);
          }
        }, 800);
      };

      // Nút [ Đóng ]
      const closeBtn = card.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          dissolveCard();
        });
      }
    }

    /**
     * Kích hoạt làn hương tại tọa độ bất kỳ
     * @param {number} x - Tọa độ X trên livingFrame
     * @param {number} y - Tọa độ Y trên livingFrame
     * @param {Object} options - Tùy chọn (color, sprayAngle, showCard...)
     */
    emit(x, y, options = {}) {
      this.resize();
      const originX = typeof x === 'number' ? x : this.width * 0.5;
      const originY = typeof y === 'number' ? y : this.height * 0.5;
      const sprayAngle = typeof options.sprayAngle === 'number' ? options.sprayAngle : (Math.random() - 0.5) * 0.15;
      const color = options.color || { r: 125, g: 211, b: 252 };

      playEtherealScentTone();
      this.createNozzleFlash(originX, originY);

      if (options.showCard) {
        const bottleMock = options.bottle || {
          id: 'custom-scent',
          brand: options.brand || 'Butterfly Pea',
          name: options.name || 'Dòng Hương Tinh Khôi',
          tag: options.tag || 'Hương Của Kỷ Niệm'
        };
        this.showScentNoteCard(bottleMock, originX, originY);
      }

      this.createScentPlume({
        originX,
        originY,
        sprayAngle,
        color,
        intensity: options.intensity || 1.0
      });
    }

    /**
     * Tự động tỏa hương ngẫu nhiên theo không khí căn phòng (Ambient Scent)
     */
    emitAmbient(bottles = []) {
      if (this.activePlumes.length >= 2) return;
      if (bottles && bottles.length > 0) {
        const valid = bottles.filter(b => b.id !== 'flower_vase');
        if (valid.length > 0) {
          const randomBottle = valid[Math.floor(Math.random() * valid.length)];
          this.emitFromBottle(randomBottle, { showCard: false, intensity: 0.85 });
          return;
        }
      }
      this.emit(this.width * (0.3 + Math.random() * 0.4), this.height * (0.4 + Math.random() * 0.3), {
        showCard: false
      });
    }

    /**
     * Dọn dẹp tài nguyên
     */
    destroy() {
      this.activePlumes = [];
      this.isRenderLoopActive = false;
      this.activeScentCards.forEach(c => c && c.remove());
      this.activeScentCards.clear();
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }
    }
  }

  // Gán toàn cục
  window.ScentEngine = ScentEngine;

  // Khởi tạo instance mặc định ngay khi sẵn sàng
  if (!window.scentEngine) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (!window.scentEngine) {
          window.scentEngine = new ScentEngine();
        }
      });
    } else {
      window.scentEngine = new ScentEngine();
    }
  }

})(window, document);
