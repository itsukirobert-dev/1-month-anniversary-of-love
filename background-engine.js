/**
 * ============================================================
 * BUTTERFLY PEA MEMORY GARDEN — BACKGROUND ENGINE
 * Hệ Thống Động Lực Không Gian Mỹ Phẩm Cao Cấp Sống Động
 * 
 * Các hiện tượng vật lý & quang học được mô phỏng:
 * 1. Cành hoa đung đưa nhẹ như có gió (Harmonic Wind & Spring Physics)
 * 2. Lá nghiêng qua lại độc lập, so le (Desynchronized Foliage Tilt)
 * 3. Hoa rung rất nhẹ từng thớ cánh (Micro-tremor Petal Flutter)
 * 4. Vải lụa hồng chuyển động nhỏ hữu cơ (Liquid Silk Wave Displacement)
 * 5. Ánh sáng trên chai mỹ phẩm thay đổi rất chậm (Slow Specular Highlights & Gold Luster)
 * 6. Reflection trên mặt bàn chuyển động nhẹ (Marble Table Caustics & Reflection Ripples)
 * 7. Một số hạt bụi sáng lơ lửng trong không gian 3D (Cinematic Atmospheric Dust Motes)
 * 8. Parallax rất nhẹ giữa Foreground, Midground và Background (2.5D Depth Engine)
 * ============================================================
 */

(function (window, document) {
  'use strict';

  // --- Bộ tạo số ngẫu nhiên mượt mà (Smooth 1D/2D Perlin-Style Noise) ---
  class ProceduralNoise {
    constructor(seed = 12345) {
      this.seed = seed;
      this.p = new Uint8Array(512);
      const perm = [
        151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142,
        8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117,
        35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
        134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41,
        55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89,
        18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226,
        250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182,
        189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43,
        172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97,
        228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239,
        107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
      ];
      for (let i = 0; i < 256; i++) {
        this.p[i] = perm[i];
        this.p[256 + i] = perm[i];
      }
    }

    fade(t) {
      return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
      return a + t * (b - a);
    }

    grad(hash, x) {
      return (hash & 1) === 0 ? x : -x;
    }

    noise1D(x) {
      const X = Math.floor(x) & 255;
      x -= Math.floor(x);
      const u = this.fade(x);
      return this.lerp(u, this.grad(this.p[X], x), this.grad(this.p[X + 1], x - 1)) * 2;
    }
  }

  // ============================================================
  // BACKGROUND ENGINE CLASS
  // ============================================================
  class BackgroundEngine {
    constructor(options = {}) {
      this.container = options.container || document.getElementById('livingFrame');
      if (!this.container) {
        console.warn('BackgroundEngine: Container #livingFrame not found.');
        return;
      }

      this.noise = new ProceduralNoise(98765);
      this.isRunning = false;
      this.startTime = performance.now();
      this.lastTime = this.startTime;
      this.rafId = null;

      // DOM Elements
      this.initDOMElements();

      // Canvases
      this.initCanvases();

      // Particles & Physics Systems
      this.initDustParticles();
      this.initWindSystem();
      this.initParallaxSystem();

      // Bindings
      this.onResize = this.onResize.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);
      this.onVisibilityChange = this.onVisibilityChange.bind(this);
      this.loop = this.loop.bind(this);

      // Listeners
      window.addEventListener('resize', this.onResize);
      this.container.addEventListener('mousemove', this.onMouseMove);
      this.container.addEventListener('mouseleave', this.onMouseLeave);
      document.addEventListener('visibilitychange', this.onVisibilityChange);

      if (window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver(() => this.onResize());
        this.resizeObserver.observe(this.container);
      }

      this.onResize();
    }

    // --- Khởi tạo các phần tử DOM ---
    initDOMElements() {
      // Các tầng động lực học
      this.layerBackdrop = this.container.querySelector('.engine-layer-backdrop');
      this.layerTable = this.container.querySelector('.engine-layer-table');
      this.layerSilk = this.container.querySelector('.engine-layer-silk');
      this.silkInner = this.container.querySelector('.engine-silk-inner');
      this.silkSheen = this.container.querySelector('.engine-silk-satin-sheen');
      this.layerFlora = this.container.querySelector('.engine-layer-flora');
      this.floraCanopy = this.container.querySelector('.engine-flora-canopy');

      // Các cành hoa đung đưa
      this.branchLeft = document.getElementById('branchLeft');
      this.branchRight = document.getElementById('branchRight');
      this.branchTop = document.getElementById('branchTop');

      // Các bông hoa rung cánh
      this.blossom1 = document.getElementById('blossomHead1');
      this.blossom2 = document.getElementById('blossomHead2');

      // SVG filters
      this.silkTurbulence = document.getElementById('silkTurbulence');
      this.floraTurbulence = document.getElementById('floraTurbulence');
    }

    // --- Khởi tạo Canvases ---
    initCanvases() {
      // 1. Specular Highlights Canvas (Chai mỹ phẩm & nắp vàng champagne)
      this.specularCanvas = document.getElementById('engineSpecularCanvas');
      if (this.specularCanvas) {
        this.specularCtx = this.specularCanvas.getContext('2d');
      }

      // 2. Table Reflection Canvas (Gợn sóng phản chiếu mặt bàn đá hoa cương)
      this.tableReflectionCanvas = document.getElementById('engineTableReflectionCanvas');
      if (this.tableReflectionCanvas) {
        this.tableReflectionCtx = this.tableReflectionCanvas.getContext('2d');
      }

      // 3. Dust Motes Canvas (Hạt bụi sáng lơ lửng 3D)
      this.dustCanvas = document.getElementById('dustCanvas');
      if (this.dustCanvas) {
        this.dustCtx = this.dustCanvas.getContext('2d');
      }

      this.width = 0;
      this.height = 0;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    }

    // --- Hệ thống gió tự nhiên bất quy tắc (Desynchronized Wind Engine) ---
    initWindSystem() {
      this.wind = {
        base: 0,
        gust: 0,
        current: 0,
        target: 0,
        swayLeftAngle: 0,
        swayRightAngle: 0,
        swayTopAngle: 0
      };
    }

    // --- Hệ thống Parallax & Camera thở nhẹ (2.5D Living Depth Engine) ---
    initParallaxSystem() {
      this.parallax = {
        mouseTargetX: 0,
        mouseTargetY: 0,
        currentX: 0,
        currentY: 0,
        ambientX: 0,
        ambientY: 0,
        lerpFactor: 0.036
      };
    }

    // --- Khởi tạo 3D Dust Particles (Hạt bụi nắng hữu cơ) ---
    initDustParticles() {
      this.particles = [];
      const count = 38;

      const colors = [
        { r: 255, g: 246, b: 220, name: 'champagne' }, // Vàng champagne lấp lánh
        { r: 255, g: 236, b: 195, name: 'amber' },     // Hổ phách ấm áp dịu dàng
        { r: 255, g: 228, b: 238, name: 'rose' },      // Phớt hồng cánh lụa
        { r: 245, g: 250, b: 255, name: 'crystal' }    // Ánh sáng pha lê trong suốt
      ];

      for (let i = 0; i < count; i++) {
        const depthZ = Math.random(); // 0: sâu thẳm, 1: sát thấu kính camera
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Tỷ lệ kích thước và độ mờ theo độ sâu 3D (Depth-of-field)
        let radius, baseAlpha;
        if (depthZ > 0.72) {
          // Tiền cảnh: hạt bokeh to mềm mại
          radius = 2.4 + Math.random() * 2.2;
          baseAlpha = 0.15 + Math.random() * 0.35;
        } else if (depthZ > 0.35) {
          // Trung cảnh: hạt sáng rõ nét bắt nắng
          radius = 1.2 + Math.random() * 1.2;
          baseAlpha = 0.35 + Math.random() * 0.55;
        } else {
          // Hậu cảnh: bụi li ti mờ ảo
          radius = 0.6 + Math.random() * 0.7;
          baseAlpha = 0.12 + Math.random() * 0.28;
        }

        this.particles.push({
          x: Math.random() * 1000,
          y: Math.random() * 700,
          z: depthZ,
          radius: radius,
          baseAlpha: baseAlpha,
          speedY: -(0.12 + (1 - depthZ * 0.5) * 0.22),
          swaySpeed: 0.006 + Math.random() * 0.012,
          swayAmp: 0.3 + depthZ * 0.6,
          swayPhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.012 + Math.random() * 0.024,
          twinklePhase: Math.random() * Math.PI * 2,
          brownianSeed: Math.random() * 1000,
          color: color
        });
      }
    }

    // --- Điều chỉnh kích thước canvas chính xác ---
    onResize() {
      const rect = this.container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;

      this.width = w;
      this.height = h;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      const setupCanvas = (cvs, ctx) => {
        if (!cvs || !ctx) return;
        cvs.width = Math.round(w * this.dpr);
        cvs.height = Math.round(h * this.dpr);
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      };

      setupCanvas(this.specularCanvas, this.specularCtx);
      setupCanvas(this.tableReflectionCanvas, this.tableReflectionCtx);
      setupCanvas(this.dustCanvas, this.dustCtx);

      // Định vị lại các hạt bụi theo kích thước mới
      this.particles.forEach(p => {
        if (p.x > w) p.x = Math.random() * w;
        if (p.y > h) p.y = Math.random() * h;
      });
    }

    // --- Tương tác chuột mượt mà (Mouse Parallax) ---
    onMouseMove(e) {
      const rect = this.container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1; // [-1, 1]
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1; // [-1, 1]

      this.parallax.mouseTargetX = normX;
      this.parallax.mouseTargetY = normY;
    }

    onMouseLeave() {
      this.parallax.mouseTargetX = 0;
      this.parallax.mouseTargetY = 0;
    }

    // --- Tự động dừng khi ẩn tab để tiết kiệm năng lượng ---
    onVisibilityChange() {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    }

    // --- Bắt đầu & Dừng Engine ---
    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.lastTime = performance.now();
      this.rafId = requestAnimationFrame(this.loop);
    }

    stop() {
      this.isRunning = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    // ============================================================
    // MAIN RENDER LOOP (60FPS HỮU CƠ SIÊU MƯỢT)
    // ============================================================
    loop(currentTime) {
      if (!this.isRunning) return;

      const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
      this.lastTime = currentTime;
      const t = (currentTime - this.startTime) / 1000;

      // 1. Cập nhật hệ thống gió hữu cơ
      this.updateWind(t, dt);

      // 2. Cập nhật hệ thống Parallax 2.5D
      this.updateParallax(t);

      // 3. Cập nhật chuyển động cành hoa & tán lá
      this.updateFlora(t, dt);

      // 4. Cập nhật chuyển động sóng lụa hồng
      this.updateSilk(t);

      // 5. Vẽ ánh sáng Specular trên chai lọ & nắp vàng
      this.renderSpecular(t);

      // 6. Vẽ phản chiếu trên mặt bàn đá hoa cương
      this.renderTableReflection(t);

      // 7. Vẽ hạt bụi sáng lơ lửng 3D
      this.renderDust(t, dt);

      this.rafId = requestAnimationFrame(this.loop);
    }

    // ============================================================
    // 1. WIND SYSTEM UPDATE (Gió vô chu kỳ, biến hóa khôn lường)
    // ============================================================
    updateWind(t, dt) {
      // Tổ hợp sóng điều hòa phi tỉ số (incommensurate irrational frequencies)
      // => Không bao giờ lặp lại chu kỳ cố định!
      const w1 = Math.sin(t * 0.31);
      const w2 = Math.sin(t * 0.73 + 1.25);
      const w3 = Math.sin(t * 1.39 + 2.80);
      const noiseTerm = this.noise.noise1D(t * 0.14);

      this.wind.base = (w1 * 0.54 + w2 * 0.26 + w3 * 0.12 + noiseTerm * 0.08);

      // Luồng gió thoảng (Gust): xuất hiện êm ả mỗi 18-25s, tồn tại trong 4-5s rồi êm dịu trở lại
      const gPhase = Math.sin(t * 0.12) * Math.sin(t * 0.068 + 0.95);
      this.wind.gust = Math.max(0, gPhase * gPhase) * 1.2;

      this.wind.current = this.wind.base + this.wind.gust;
    }

    // ============================================================
    // 2. PARALLAX & CAMERA BREATH (2.5D Living Depth)
    // ============================================================
    updateParallax(t) {
      const p = this.parallax;

      // Nhịp thở tự thân của camera (Lissajous figure-8) khi không di chuột
      p.ambientX = Math.sin(t * 0.16) * 3.5;
      p.ambientY = Math.cos(t * 0.12) * 2.2;

      // Làm mượt chuyển động chuột bằng Lerp đàn hồi
      p.currentX += (p.mouseTargetX - p.currentX) * p.lerpFactor;
      p.currentY += (p.mouseTargetY - p.currentY) * p.lerpFactor;

      const px = p.currentX * 12 + p.ambientX;
      const py = p.currentY * 8 + p.ambientY;

      // Áp dụng độ sâu Parallax theo từng tầng:
      // Tầng 1: Hậu cảnh (xa nhất) di chuyển ngược chiều cực nhẹ
      if (this.layerBackdrop) {
        this.layerBackdrop.style.transform = `translate3d(${(-px * 0.22).toFixed(2)}px, ${(-py * 0.18).toFixed(2)}px, 0)`;
      }

      // Tầng 2: Mặt bàn đá (trung cảnh)
      if (this.layerTable) {
        this.layerTable.style.transform = `translate3d(${(px * 0.38).toFixed(2)}px, ${(py * 0.24).toFixed(2)}px, 0)`;
      }

      // Tầng 3: Tán hoa đậu biếc (trọng tâm nổi)
      if (this.layerFlora) {
        // Tọa độ parallax của hoa được kết hợp vào transform của tán hoa bên dưới
      }

      // Tầng 4: Vải lụa hồng (tiền cảnh sát thấu kính, parallax mạnh nhất)
      if (this.layerSilk) {
        this.layerSilk.style.transform = `translate3d(${(px * 1.22).toFixed(2)}px, ${(py * 0.78).toFixed(2)}px, 0)`;
      }
    }

    // ============================================================
    // 3. FLORA DYNAMICS (Cành đung đưa, lá nghiêng, hoa rung nhẹ)
    // ============================================================
    updateFlora(t, dt) {
      const px = this.parallax.currentX * 12 + this.parallax.ambientX;
      const py = this.parallax.currentY * 8 + this.parallax.ambientY;

      // A. Đung đưa tổng thể của tán hoa (Anchored at vase rim x: 48%, y: 50%)
      const canopyRot = (this.wind.current * 1.15).toFixed(3); // ~ 1.1 độ tối đa, cực mềm
      const canopyX = (px * 0.75 + this.wind.current * 2.6).toFixed(2);
      const canopyY = (py * 0.50 + Math.abs(this.wind.current) * -0.5).toFixed(2);

      if (this.floraCanopy) {
        this.floraCanopy.style.transform = `translate3d(${canopyX}px, ${canopyY}px, 0) rotate(${canopyRot}deg)`;
      }

      // B. Cành hoa vươn bên trái (Độ trễ pha tự nhiên: đón gió trước)
      if (this.branchLeft) {
        const leftWind = Math.sin((t - 0.35) * 0.34) * 0.6 + this.wind.gust * 0.75;
        const bRotLeft = (leftWind * 1.75).toFixed(2);
        this.branchLeft.style.transform = `rotate(${bRotLeft}deg)`;
      }

      // C. Cành hoa vươn bên phải (Độ trễ pha: gió truyền qua bó hoa sau 0.8s)
      if (this.branchRight) {
        const rightWind = Math.sin((t - 1.15) * 0.31 + 1.4) * 0.55 + this.wind.gust * 0.65;
        const bRotRight = (rightWind * 1.55).toFixed(2);
        this.branchRight.style.transform = `rotate(${bRotRight}deg)`;
      }

      // D. Cành hoa đỉnh vòm vươn cao
      if (this.branchTop) {
        const topWind = Math.sin(t * 0.44 + 2.1) * 1.1 + this.wind.gust * 0.45;
        const topY = Math.sin(t * 0.38) * 1.4;
        this.branchTop.style.transform = `translate3d(0, ${topY.toFixed(2)}px, 0) rotate(${topWind.toFixed(2)}deg)`;
      }

      // E. Hoa rung rất nhẹ từng thớ cánh (Micro-tremor trên hoa chính)
      if (this.blossom1) {
        const tremorAmp = 0.35 + 0.45 * this.wind.gust;
        const tx = (Math.sin(t * 4.6 + 1.2) * tremorAmp).toFixed(2);
        const ty = (Math.cos(t * 3.8 + 2.1) * (tremorAmp * 0.7)).toFixed(2);
        this.blossom1.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }

      if (this.blossom2) {
        const tremorAmp2 = 0.28 + 0.40 * this.wind.gust;
        const tx2 = (Math.sin(t * 5.1 + 3.7) * tremorAmp2).toFixed(2);
        const ty2 = (Math.cos(t * 4.3 + 0.8) * (tremorAmp2 * 0.7)).toFixed(2);
        this.blossom2.style.transform = `translate3d(${tx2}px, ${ty2}px, 0)`;
      }

      // F. Điều biến bộ lọc gió SVG (SVG Turbulence breeze displacement)
      if (this.floraTurbulence) {
        const bfX = (0.013 + 0.002 * Math.sin(t * 0.22)).toFixed(4);
        const bfY = (0.009 + 0.0015 * Math.cos(t * 0.17)).toFixed(4);
        this.floraTurbulence.setAttribute('baseFrequency', `${bfX} ${bfY}`);
      }
    }

    // ============================================================
    // 4. SILK FABRIC MOTION (Vải lụa hồng chuyển động hữu cơ)
    // ============================================================
    updateSilk(t) {
      // A. Sóng uốn lượn chậm rãi của các nếp lụa
      if (this.silkInner) {
        const sx = (Math.sin(t * 0.19) * 1.8).toFixed(2);
        const sy = (Math.cos(t * 0.15) * 1.2).toFixed(2);
        const sScale = (1.0 + Math.sin(t * 0.13) * 0.004).toFixed(4);
        this.silkInner.style.transform = `translate3d(${sx}px, ${sy}px, 0) scale(${sScale})`;
      }

      // B. Vệt sáng satin mềm mại trôi lướt dọc theo sống nếp lụa
      if (this.silkSheen) {
        const sheenX = (Math.sin(t * 0.16) * 12).toFixed(1);
        const sheenY = (Math.cos(t * 0.13) * 7).toFixed(1);
        const sheenOpacity = (0.65 + 0.35 * Math.sin(t * 0.18)).toFixed(3);
        this.silkSheen.style.transform = `translate3d(${sheenX}px, ${sheenY}px, 0)`;
        this.silkSheen.style.opacity = sheenOpacity;
      }

      // C. Điều biến bộ lọc sóng lụa hữu cơ (Liquid Silk Wave)
      if (this.silkTurbulence) {
        const sBfX = (0.0068 + 0.0012 * Math.sin(t * 0.16)).toFixed(4);
        const sBfY = (0.0108 + 0.0016 * Math.cos(t * 0.12)).toFixed(4);
        this.silkTurbulence.setAttribute('baseFrequency', `${sBfX} ${sBfY}`);
      }
    }

    // ============================================================
    // 5. SPECULAR HIGHLIGHTS ON COSMETICS (Ánh sáng trên chai đổi chậm)
    // ============================================================
    renderSpecular(t) {
      if (!this.specularCtx || this.width === 0 || this.height === 0) return;
      const ctx = this.specularCtx;
      const w = this.width;
      const h = this.height;

      ctx.clearRect(0, 0, w, h);

      // --- 1. REJUVENATING SERUM (Chai serum nắp hút giọt bên trái) ---
      // Vệt sáng dọc thân chai thủy tinh & ánh vàng nắp dropper
      const serumAlpha = 0.32 + 0.28 * Math.sin(t * 0.22);
      const serumLeftX = w * 0.182;
      const serumTopY = h * 0.44;
      const serumH = h * 0.11;

      // Vệt sáng thân chai
      const serumGrad = ctx.createLinearGradient(serumLeftX, serumTopY, serumLeftX, serumTopY + serumH);
      serumGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      serumGrad.addColorStop(0.5, `rgba(255, 245, 248, ${(serumAlpha * 0.85).toFixed(3)})`);
      serumGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = serumGrad;
      ctx.fillRect(serumLeftX - 1.5, serumTopY, 4, serumH);

      // Ánh vàng nắp dropper
      const dropperGlint = ctx.createRadialGradient(w * 0.213, h * 0.446, 1, w * 0.213, h * 0.446, 11);
      dropperGlint.addColorStop(0, `rgba(255, 248, 220, ${(serumAlpha * 0.9).toFixed(3)})`);
      dropperGlint.addColorStop(0.6, `rgba(255, 220, 150, ${(serumAlpha * 0.4).toFixed(3)})`);
      dropperGlint.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = dropperGlint;
      ctx.beginPath();
      ctx.arc(w * 0.213, h * 0.446, 11, 0, Math.PI * 2);
      ctx.fill();

      // --- 2. RADIANCE CREAM (Hũ kem nắp gương vàng champagne) ---
      // Vệt lướt kim loại xoay tròn theo vành nắp tròn
      const creamAlpha = 0.35 + 0.32 * Math.sin(t * 0.17 + 1.2);
      const creamCx = w * 0.352;
      const creamCy = h * 0.445;
      const creamR = w * 0.062;
      const creamSweepAngle = -0.55 + 0.65 * Math.sin(t * 0.16);

      ctx.save();
      ctx.translate(creamCx, creamCy);
      ctx.rotate(creamSweepAngle);
      const creamLidGrad = ctx.createLinearGradient(-creamR, 0, creamR, 0);
      creamLidGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      creamLidGrad.addColorStop(0.5, `rgba(255, 250, 230, ${(creamAlpha * 0.95).toFixed(3)})`);
      creamLidGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = creamLidGrad;
      ctx.fillRect(-creamR, -2, creamR * 2, 4.5);
      ctx.restore();

      // --- 3. HYDRATING TONER (Chai toner cao nắp vàng hồng) ---
      // Vệt sáng thân chai hình trụ dài & viền nắp
      const tonerAlpha = 0.30 + 0.28 * Math.sin(t * 0.19 + 2.4);
      const tonerX = w * 0.638;
      const tonerY = h * 0.41;
      const tonerH = h * 0.14;

      const tonerGrad = ctx.createLinearGradient(tonerX, tonerY, tonerX, tonerY + tonerH);
      tonerGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      tonerGrad.addColorStop(0.45, `rgba(255, 250, 245, ${(tonerAlpha * 0.9).toFixed(3)})`);
      tonerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = tonerGrad;
      ctx.fillRect(tonerX - 2, tonerY, 4.5, tonerH);

      // Điểm sáng nắp toner
      const tonerCapGlint = ctx.createRadialGradient(w * 0.614, h * 0.380, 1, w * 0.614, h * 0.380, 14);
      tonerCapGlint.addColorStop(0, `rgba(255, 252, 235, ${(tonerAlpha * 0.85).toFixed(3)})`);
      tonerCapGlint.addColorStop(0.5, `rgba(255, 230, 175, ${(tonerAlpha * 0.35).toFixed(3)})`);
      tonerCapGlint.addColorStop(1, 'rgba(255, 220, 140, 0)');
      ctx.fillStyle = tonerCapGlint;
      ctx.beginPath();
      ctx.arc(w * 0.614, h * 0.380, 14, 0, Math.PI * 2);
      ctx.fill();

      // --- 4. SOOTHING ESSENCE (Chai vòi xịt vàng champagne) ---
      // Ngôi sao 4 cánh lấp lánh nhẹ tại đầu vòi xịt
      const essenceAlpha = 0.28 + 0.30 * Math.sin(t * 0.25 + 3.6);
      const starCx = w * 0.748;
      const starCy = h * 0.452;
      const starSize = 5 + 3 * Math.sin(t * 0.25 + 3.6);

      ctx.save();
      ctx.translate(starCx, starCy);
      ctx.rotate(t * 0.12);

      ctx.fillStyle = `rgba(255, 255, 245, ${(essenceAlpha * 0.9).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(0, -starSize);
      ctx.quadraticCurveTo(0, 0, starSize, 0);
      ctx.quadraticCurveTo(0, 0, 0, starSize);
      ctx.quadraticCurveTo(0, 0, -starSize, 0);
      ctx.quadraticCurveTo(0, 0, 0, -starSize);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${(essenceAlpha).toFixed(3)})`;
      ctx.fill();
      ctx.restore();

      // --- 5. LIP BALM (Hũ sáp dưỡng & tuýp son) ---
      const balmAlpha = 0.25 + 0.25 * Math.sin(t * 0.20 + 4.8);
      const balmGlint = ctx.createRadialGradient(w * 0.680, h * 0.585, 1, w * 0.680, h * 0.585, 9);
      balmGlint.addColorStop(0, `rgba(255, 250, 225, ${(balmAlpha * 0.8).toFixed(3)})`);
      balmGlint.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = balmGlint;
      ctx.beginPath();
      ctx.arc(w * 0.680, h * 0.585, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    // ============================================================
    // 6. TABLE REFLECTION & CAUSTICS (Phản chiếu mặt bàn đá chuyển động)
    // ============================================================
    renderTableReflection(t) {
      if (!this.tableReflectionCtx || this.width === 0 || this.height === 0) return;
      const ctx = this.tableReflectionCtx;
      const w = this.width;
      const h = this.height;

      ctx.clearRect(0, 0, w, h);

      // Chỉ vẽ trong nửa dưới mặt bàn (từ y: 52% đến đáy)
      const tableTopY = h * 0.52;

      // 1. Vùng bóng sắc hoa đậu biếc màu xanh hoàng gia (Royal Blue Caustic Pool)
      const blueAlpha = 0.08 + 0.05 * Math.sin(t * 0.34);
      const bluePoolX = w * 0.48 + Math.sin(t * 0.25) * 6;
      const bluePoolY = h * 0.64;
      const blueGrad = ctx.createRadialGradient(bluePoolX, bluePoolY, 10, bluePoolX, bluePoolY, w * 0.16);
      blueGrad.addColorStop(0, `rgba(37, 99, 235, ${(blueAlpha * 1.2).toFixed(3)})`);
      blueGrad.addColorStop(0.5, `rgba(59, 130, 246, ${(blueAlpha * 0.5).toFixed(3)})`);
      blueGrad.addColorStop(1, 'rgba(30, 58, 138, 0)');
      ctx.fillStyle = blueGrad;
      ctx.beginPath();
      ctx.ellipse(bluePoolX, bluePoolY, w * 0.16, h * 0.065, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Vùng bóng hồng phấn dịu ngọt dưới hũ kem & chai serum
      const roseAlpha = 0.07 + 0.04 * Math.sin(t * 0.28 + 1.5);
      const rosePoolX = w * 0.32 + Math.cos(t * 0.20) * 5;
      const rosePoolY = h * 0.65;
      const roseGrad = ctx.createRadialGradient(rosePoolX, rosePoolY, 8, rosePoolX, rosePoolY, w * 0.14);
      roseGrad.addColorStop(0, `rgba(244, 114, 182, ${(roseAlpha * 1.1).toFixed(3)})`);
      roseGrad.addColorStop(0.5, `rgba(251, 207, 232, ${(roseAlpha * 0.4).toFixed(3)})`);
      roseGrad.addColorStop(1, 'rgba(244, 114, 182, 0)');
      ctx.fillStyle = roseGrad;
      ctx.beginPath();
      ctx.ellipse(rosePoolX, rosePoolY, w * 0.14, h * 0.055, 0, 0, Math.PI * 2);
      ctx.fill();

      // 3. Các gợn khúc xạ ánh sáng mờ ảo dọc vân đá hoa cương
      const causticShift = Math.sin(t * 0.22) * 14;
      const causticY = h * 0.72 + Math.cos(t * 0.18) * 4;
      const cGrad = ctx.createLinearGradient(w * 0.1 + causticShift, causticY, w * 0.85 + causticShift, causticY);
      cGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      cGrad.addColorStop(0.3, 'rgba(255, 250, 240, 0.045)');
      cGrad.addColorStop(0.5, 'rgba(255, 240, 210, 0.075)');
      cGrad.addColorStop(0.7, 'rgba(255, 250, 240, 0.045)');
      cGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.ellipse(w * 0.5 + causticShift * 0.5, causticY, w * 0.38, 5.5, -0.04, 0, Math.PI * 2);
      ctx.fill();
    }

    // ============================================================
    // 7. CINEMATIC 3D DUST MOTES (Bụi sáng lơ lửng trong nắng)
    // ============================================================
    renderDust(t, dt) {
      if (!this.dustCtx || this.width === 0 || this.height === 0) return;
      const ctx = this.dustCtx;
      const w = this.width;
      const h = this.height;

      ctx.clearRect(0, 0, w, h);

      // Vùng chùm nắng sớm: góc trên bên trái chiếu xiên xuống
      const sunBeamCenterX = w * 0.28;
      const sunBeamCenterY = h * 0.24;

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        // 1. Di chuyển bay lên (Thermal Updraft)
        p.y += p.speedY;

        // 2. Chuyển động lượn ngang kết hợp luồng gió tự nhiên
        p.swayPhase += p.swaySpeed;
        const windDrift = this.wind.current * 0.35 * (0.6 + p.z * 0.8);
        p.x += Math.sin(p.swayPhase) * p.swayAmp + windDrift;

        // 3. Vòng lặp biên giới mượt mà
        if (p.y < -15) {
          p.y = h + 15;
          p.x = Math.random() * w;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        // 4. Nhấp nháy quang học (Optical Twinkle)
        p.twinklePhase += p.twinkleSpeed;
        const twinkle = 0.65 + 0.35 * Math.sin(p.twinklePhase);

        // 5. Tăng cường độ sáng khi đi vào luồng nắng chiếu qua cửa sổ
        const distToSunbeam = Math.hypot(p.x - sunBeamCenterX, p.y - sunBeamCenterY);
        const sunBoost = Math.max(0, 1 - distToSunbeam / (w * 0.45)) * 0.45;

        const currentAlpha = Math.min(1.0, p.baseAlpha * twinkle + sunBoost);

        // Tọa độ áp dụng Parallax theo độ sâu z
        const pParallaxX = p.x + (this.parallax.currentX * 14 + this.parallax.ambientX) * (p.z * 1.4);
        const pParallaxY = p.y + (this.parallax.currentY * 9 + this.parallax.ambientY) * (p.z * 1.4);

        // 6. Vẽ vầng hào quang mềm mại (Soft Bokeh Halo)
        ctx.beginPath();
        ctx.arc(pParallaxX, pParallaxY, p.radius * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${(currentAlpha * 0.26).toFixed(3)})`;
        ctx.fill();

        // 7. Vẽ tâm sáng lấp lánh (Sparkling Core)
        ctx.beginPath();
        ctx.arc(pParallaxX, pParallaxY, p.radius * 0.65, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(currentAlpha * 0.88).toFixed(3)})`;
        ctx.fill();
      }
    }
  }

  // Khởi tạo và gán toàn cục khi DOM sẵn sàng
  window.BackgroundEngine = BackgroundEngine;

  document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo Background Engine
    const livingFrameEl = document.getElementById('livingFrame');
    if (livingFrameEl) {
      window.bgEngineInstance = new BackgroundEngine({
        container: livingFrameEl
      });
      window.bgEngineInstance.start();
    }
  });

})(window, document);
