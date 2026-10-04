/**
 * ============================================================
 * BUTTERFLY PEA BRANCH ENGINE (ĐỘNG CƠ CÀNH HOA ĐẬU BIẾC)
 * ============================================================
 * 
 * Hệ thống mô phỏng cành hoa Đậu Biếc tự nhiên (Botanical Aerodynamics):
 * 1. Object hoàn chỉnh: Thân (stem) + Lá (leaves) + Hoa (flower) + Nụ hoa (buds)
 *    Không tách chúng thành các particle độc lập trong chuyển động chính.
 * 2. Kích hoạt & Tách khỏi background với xung lực quang học mượt mà.
 * 3. Đa dạng Quỹ đạo bay (Trajectories A, B, C, D) xây dựng bằng Catmull-Rom Spline
 *    và Bézier mượt mà, tiếp tuyến C¹ liên tục:
 *    - Trajectory A: ↗ → cong → ↘ (Vút lên phải → uốn đỉnh vòm → lướt là đà hạ cánh)
 *    - Trajectory B: ↓ → ↘ → ↗ (Rơi buông nhẹ → chao võng chéo → lộng gió bốc vút cao)
 *    - Trajectory C: → → ↘ → ↗ → → (Trôi ngang → lượn dốc uốn → ngóc đầu bay lên → trôi lơ lửng)
 *    - Trajectory D: ↙ → ↘ → ↗ → ↖ (Chao chếch trái → lượn võng phải → cuộn vút cao → xoáy ngược trái)
 * 4. Chuyển động vật lý tinh xảo:
 *    - Uốn lượn (Stem flex theo độ cong quỹ đạo)
 *    - Nghiêng trái / phải (3D roll banking theo góc ngoặt)
 *    - Xoay nhẹ (Tangent heading yaw + chao lắc con lắc)
 *    - Quán tính vật lý (Inertia: tăng tốc ban đầu, giảm tốc cuối đường)
 *    - Secondary motion:
 *        + Lá rung nhẹ theo luồng gió (Leaf micro-flutter)
 *        + Hoa rung nhẹ cánh hoa nhung mượt (Blossom velvety tremor)
 *        + Nụ hoa dao động nhịp nhàng theo quán tính thân
 *    - Một số cánh hoa có thể tách khỏi cành giữa chặng bay (Detached petals)
 *    - Motion blur nhẹ khi tốc độ cao, trở lại sắc nét khi chậm dần
 *    - Chậm lại ở cuối trajectory, mờ dần và biến mất êm đềm
 * 5. Cảm giác chuyển động gợi liên tưởng tới sự nhẹ nhàng của cánh bướm đón gió
 *    (TUYỆT ĐỐI KHÔNG SỬ DỤNG HÌNH ẢNH CON BƯỚM).
 * ============================================================
 */

(function (window, document) {
  'use strict';

  // --- 1. DANH MỤC CÁC MẪU CÀNH HOA ĐẬU BIẾC THẬT (PHOTOREALISTIC SPRITES) ---
  // Mỗi cành là một thực thể hoàn chỉnh gồm: thân, các lá chét xanh, hoa đậu biếc và nụ hoa.
  const BRANCH_SPRITES = [
    {
      id: 'branch-1',
      src: 'assets/images/falling_branches/branch_1.png',
      width: 406,
      height: 277,
      aspect: 406 / 277,
      anchorX: 0.22,
      anchorY: 0.52,
      // Tọa độ tương đối của bộ phận hoa, lá và nụ trên cành
      flowerRelX: 0.73,
      flowerRelY: 0.38,
      leafRelX: 0.31,
      leafRelY: 0.52,
      budRelX: 0.88,
      budRelY: 0.28,
      name: 'Nhánh vươn ngang xanh ngát đọng hoa tím biếc'
    },
    {
      id: 'branch-2',
      src: 'assets/images/falling_branches/branch_2.png',
      width: 279,
      height: 369,
      aspect: 279 / 369,
      anchorX: 0.42,
      anchorY: 0.24,
      flowerRelX: 0.40,
      flowerRelY: 0.57,
      leafRelX: 0.44,
      leafRelY: 0.64,
      budRelX: 0.28,
      budRelY: 0.82,
      name: 'Nhánh buông lơi dáng ngọc với nụ hoa chúm chím'
    },
    {
      id: 'branch-3',
      src: 'assets/images/falling_branches/branch_3.png',
      width: 281,
      height: 261,
      aspect: 281 / 261,
      anchorX: 0.55,
      anchorY: 0.75,
      flowerRelX: 0.34,
      flowerRelY: 0.43,
      leafRelX: 0.73,
      leafRelY: 0.46,
      budRelX: 0.18,
      budRelY: 0.32,
      name: 'Nhánh vòm đón nắng mai mang hoa cánh thắm'
    }
  ];

  // Các cánh hoa đậu biếc nhỏ có thể tách rời khỏi cành khi bay nhanh
  const DETACHABLE_PETALS = [
    { src: 'assets/images/falling_branches/petal_1.png', w: 192, h: 200, scale: 0.16 },
    { src: 'assets/images/falling_branches/petal_2.png', w: 203, h: 209, scale: 0.15 },
    { src: 'assets/images/falling_branches/petal_3.png', w: 201, h: 148, scale: 0.17 },
    { src: 'assets/images/falling_branches/petal_4.png', w: 159, h: 120, scale: 0.18 },
    { src: 'assets/images/falling_branches/petal_5.png', w: 84, h: 130, scale: 0.20 },
    { src: 'assets/images/falling_branches/petal_6.png', w: 115, h: 82, scale: 0.19 }
  ];

  // Tiền tải (preload) toàn bộ hình ảnh vào bộ nhớ RAM
  BRANCH_SPRITES.forEach(item => {
    const img = new Image();
    img.src = item.src;
  });
  DETACHABLE_PETALS.forEach(item => {
    const img = new Image();
    img.src = item.src;
  });

  // --- 2. HỆ THỐNG QUỸ ĐẠO TOÁN HỌC (SPLINE & BÉZIER TRAJECTORIES) ---
  // Mỗi quỹ đạo là chuỗi điểm kiểm soát của Catmull-Rom Spline kết hợp tiếp tuyến C¹
  const TRAJECTORY_PRESETS = [
    {
      id: 'A',
      name: 'Trajectory A',
      symbol: '↗ → cong → ↘',
      detail: 'Vút lên phải → uốn đỉnh vòm mềm mại → lướt là đà hạ cánh chéo xuống',
      baseDuration: 4500, // ms
      points: [
        { x: -80, y: 70 },    // P0: điểm dẫn hướng tiếp tuyến phóng ban đầu
        { x: 0, y: 0 },     // P1: điểm xuất phát (gốc cành tách ra)
        { x: 140, y: -130 },  // P2: [↗] Vút nhanh lên cao sang phải
        { x: 280, y: -170 },  // P3: [cong] Đỉnh vòm cong mềm mại của làn gió
        { x: 420, y: -70 },   // P4: [cong → ↘] Lượn qua sườn dốc
        { x: 550, y: 110 },   // P5: [↘] Lướt là đà chao xuống sang phải
        { x: 650, y: 230 },   // P6: [↘] Chậm dần trôi êm ả
        { x: 720, y: 310 }    // P7: điểm dẫn hướng tiếp tuyến kết thúc
      ]
    },
    {
      id: 'B',
      name: 'Trajectory B',
      symbol: '↓ → ↘ → ↗',
      detail: 'Rơi buông nhẹ xuống → chao võng chéo → lộng gió bốc vút cao',
      baseDuration: 4700,
      points: [
        { x: 0, y: -80 },   // P0
        { x: 0, y: 0 },     // P1: điểm xuất phát
        { x: 25, y: 120 },   // P2: [↓] Rơi buông thẳng xuống nhẹ nhàng
        { x: 150, y: 210 },   // P3: [↘] Chao võng chéo xuống đón luồng gió
        { x: 300, y: 100 },   // P4: [↘ → ↗] Lướt qua đáy võng, đón lực nâng
        { x: 450, y: -90 },   // P5: [↗] Lộng gió bốc vút cao chéo lên trời
        { x: 550, y: -220 },  // P6: [↗] Giảm tốc treo lơ lửng trên cao
        { x: 620, y: -310 }   // P7
      ]
    },
    {
      id: 'C',
      name: 'Trajectory C',
      symbol: '→ → ↘ → ↗ → →',
      detail: 'Trôi ngang bồng bềnh → lượn dốc uốn → ngóc đầu bay lên → san phẳng trôi lơ lửng',
      baseDuration: 4900,
      points: [
        { x: -80, y: 0 },     // P0
        { x: 0, y: 0 },     // P1: điểm xuất phát
        { x: 120, y: 10 },    // P2: [→] Trôi ngang ban đầu bồng bềnh
        { x: 230, y: 110 },   // P3: [↘] Lượn dốc uốn xuống
        { x: 340, y: 185 },   // P4: [↘] Đáy trũng của sóng gió
        { x: 460, y: 90 },    // P5: [↗] Ngóc đầu uốn lượn bay lên
        { x: 580, y: 70 },    // P6: [→] San phẳng theo phương ngang
        { x: 690, y: 75 },    // P7: [→] Lững lờ trôi chậm dần rồi biến mất
        { x: 770, y: 78 }     // P8
      ]
    },
    {
      id: 'D',
      name: 'Trajectory D',
      symbol: '↙ → ↘ → ↗ → ↖',
      detail: 'Chao chếch xuống trái → võng sang phải → cuộn vút lên cao → xoáy nhẹ ngược trái',
      baseDuration: 5200,
      points: [
        { x: 60, y: -70 },   // P0
        { x: 0, y: 0 },     // P1: điểm xuất phát
        { x: -120, y: 110 },   // P2: [↙] Chao chếch xuống sang trái
        { x: 30, y: 200 },   // P3: [↘] Đáy võng ngoặt sang phải
        { x: 240, y: 25 },    // P4: [↗] Cuộn vút lên cao sang phải
        { x: 170, y: -145 },  // P5: [↖] Đỉnh vòm bẻ lái ngược về trái
        { x: 50, y: -220 },  // P6: [↖] Vòng xoáy êm dịu, giảm tốc trên cao
        { x: -40, y: -270 }   // P7
      ]
    }
  ];

  // --- 3. TOÁN HỌC CATMULL-ROM SPLINE TÍNH TỌA ĐỘ & ĐẠO HÀM VẬN TỐC / GIA TỐC ---
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

    // Tọa độ vị trí x, y
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

    // Đạo hàm bậc 1: vector vận tốc (dx/du, dy/du)
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

    // Đạo hàm bậc 2: vector gia tốc (d²x/du², d²y/du²) dùng tính độ cong uốn cành
    const d2x = 0.5 * (
      2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) +
      6 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t
    ) * (numSegments * numSegments);

    const d2y = 0.5 * (
      2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) +
      6 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t
    ) * (numSegments * numSegments);

    // Độ cong đại số κ (Curvature)
    const speedSq = dx * dx + dy * dy;
    const curvature = speedSq > 0.0001 ? (dx * d2y - dy * d2x) / Math.pow(speedSq, 1.5) : 0;

    return { x, y, dx, dy, curvature };
  }

  // --- 4. HÀM QUÁN TÍNH & GIẢM TỐC VẬT LÝ (INERTIA & TERMINAL CUSHION DEACCELERATION) ---
  // Tiến trình thời gian vật lý: Ban đầu gia tốc mượt mà, sau đó lướt nhanh theo gió,
  // và ở 30% chặng cuối thì lực cản không khí hãm phanh lại chậm dần (terminal glide).
  function computeInertialProgress(progress) {
    const t = Math.max(0, Math.min(1, progress));
    // Sử dụng đường cong Bézier vật lý kết hợp S-Curve không đối xứng
    // Cho phép cành hoa có độ trễ quán tính lúc đầu và phanh êm ái lúc cuối
    if (t < 0.28) {
      // Giai đoạn tăng tốc (Acceleration phase: ease-in quad)
      const p = t / 0.28;
      return 0.22 * Math.pow(p, 1.7);
    } else if (t < 0.72) {
      // Giai đoạn lộng gió bay nhanh (Cruising phase: linear-smooth)
      const p = (t - 0.28) / (0.72 - 0.28);
      return 0.22 + 0.54 * p;
    } else {
      // Giai đoạn hãm phanh do sức cản không khí & trôi êm đềm (Deceleration cushion)
      const p = (t - 0.72) / (1 - 0.72);
      // Ease-out cubic mềm mại
      const easeOut = 1 - Math.pow(1 - p, 2.8);
      return 0.76 + 0.24 * easeOut;
    }
  }

  // --- 5. ÂM THANH GIÓ CUỐN CÀNH HOA THOẢNG BAY (WEB AUDIO API) ---
  function playWindFlightSound(intensity = 1.0) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Tiếng gió lụa xào xạc dịu êm
      const bufferSize = Math.floor(ctx.sampleRate * 0.75);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastVal = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastVal = (lastVal + 0.035 * white) / 1.035;
        data[i] = lastVal * 1.8;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.22);
      filter.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.75);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.042 * intensity, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.75);

      noiseNode.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseNode.start();
      noiseNode.stop(ctx.currentTime + 0.76);
    } catch (_) { }
  }

  // ============================================================
  // LỚP CHÍNH: BRANCH ENGINE (HỆ THỐNG ĐIỀU KHIỂN CÀNH HOA ĐẬU BIẾC)
  // ============================================================
  class BranchEngine {
    constructor() {
      this.activeBranches = [];
      this.activePetals = [];
      this.activeSparkles = [];
      this.isLoopRunning = false;
      this.lastTrajectoryIndex = -1;
      this.selectedTrajectoryCode = 'RANDOM'; // Mặc định tự chọn ngẫu nhiên

      this.initLayers();
      this.initCanopyHooks();
      this.initUIControls();
    }

    // --- Khởi tạo tầng chứa DOM cho cành hoa ---
    initLayers() {
      let layer = document.getElementById('flowerBranchLayer');
      if (!layer) {
        layer = document.createElement('div');
        layer.id = 'flowerBranchLayer';
        layer.className = 'flower-branch-layer';
        layer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(layer);
      }
      this.layer = layer;
    }

    // --- Lắng nghe các cành hoa có sẵn trên background canopy để tách ra mượt mà ---
    initCanopyHooks() {
      const canopyBranchIds = ['branchLeft', 'branchRight', 'branchTop'];
      canopyBranchIds.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (!el) return;

        // Cho phép click trực tiếp vào các cành trên background
        el.style.pointerEvents = 'auto';
        el.style.cursor = 'pointer';
        el.setAttribute('title', 'Chạm để đón cành hoa đậu biếc bay...');

        const handleCanopyClick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          this.triggerFromCanopy(id);
        };

        el.addEventListener('click', handleCanopyClick);
        el.addEventListener('touchstart', handleCanopyClick, { passive: false });
      });
    }

    // --- Tạo bảng điều khiển quỹ đạo đẹp mắt cho người dùng trải nghiệm ---
    initUIControls() {
      // Kiểm tra xem đã có bảng điều khiển chưa
      if (document.getElementById('branchEngineControls')) return;

      const controls = document.createElement('div');
      controls.id = 'branchEngineControls';
      controls.className = 'branch-engine-controls';
      controls.setAttribute('role', 'toolbar');
      controls.setAttribute('aria-label', 'Bảng điều khiển Quỹ đạo Cành Hoa Đậu Biếc');

      controls.innerHTML = `
        <div class="branch-engine-badge" title="Động cơ vật lý Cành Hoa Đậu Biếc">
          <span class="engine-icon">🌿</span>
          <span class="engine-title">Branch Engine</span>
        </div>
        <div class="branch-traj-buttons">
          <button type="button" class="branch-traj-btn" data-traj="A" title="${TRAJECTORY_PRESETS[0].detail}">
            <span class="branch-traj-code">Quỹ đạo A</span>
            <span class="branch-traj-symbol">↗ cong ↘</span>
          </button>
          <button type="button" class="branch-traj-btn" data-traj="B" title="${TRAJECTORY_PRESETS[1].detail}">
            <span class="branch-traj-code">Quỹ đạo B</span>
            <span class="branch-traj-symbol">↓ ↘ ↗</span>
          </button>
          <button type="button" class="branch-traj-btn" data-traj="C" title="${TRAJECTORY_PRESETS[2].detail}">
            <span class="branch-traj-code">Quỹ đạo C</span>
            <span class="branch-traj-symbol">→ ↘ ↗ →</span>
          </button>
          <button type="button" class="branch-traj-btn" data-traj="D" title="${TRAJECTORY_PRESETS[3].detail}">
            <span class="branch-traj-code">Quỹ đạo D</span>
            <span class="branch-traj-symbol">↙ ↘ ↗ ↖</span>
          </button>
          <button type="button" class="branch-traj-btn btn-random active" data-traj="RANDOM" title="Ngẫu nhiên chọn quỹ đạo tự nhiên">
            <span class="branch-traj-code">🎲 Tự Chọn</span>
          </button>
        </div>
        <button type="button" class="branch-controls-toggle" id="branchControlsToggle" title="Thu nhỏ / Mở rộng" aria-label="Thu nhỏ thanh điều khiển">
          <i class="fa-solid fa-chevron-down"></i>
        </button>
      `;

      document.body.appendChild(controls);

      // Xử lý sự kiện click trên các nút quỹ đạo
      const buttons = controls.querySelectorAll('.branch-traj-btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const trajCode = btn.getAttribute('data-traj');
          this.selectedTrajectoryCode = trajCode;

          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          // Tự động kích hoạt 1 cành hoa bay theo quỹ đạo đã chọn để người dùng chiêm ngưỡng
          this.launchSelectedOrRandom();
        });
      });

      // Nút thu nhỏ/mở rộng
      const toggleBtn = controls.querySelector('#branchControlsToggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          controls.classList.toggle('is-collapsed');
          const isCollapsed = controls.classList.contains('is-collapsed');
          toggleBtn.innerHTML = isCollapsed ? '<i class="fa-solid fa-chevron-up"></i>' : '<i class="fa-solid fa-chevron-down"></i>';
        });
      }
    }

    // --- Kích hoạt cành hoa từ thanh điều khiển ---
    launchSelectedOrRandom() {
      // Vị trí xuất phát ngẫu nhiên từ vòm hoa của khung cảnh
      const livingFrame = document.getElementById('livingFrame');
      let startX = window.innerWidth * 0.48;
      let startY = window.innerHeight * 0.28;

      if (livingFrame) {
        const rect = livingFrame.getBoundingClientRect();
        startX = rect.left + rect.width * (0.35 + Math.random() * 0.3);
        startY = rect.top + rect.height * (0.12 + Math.random() * 0.2);
      }

      const forcedTraj = this.selectedTrajectoryCode === 'RANDOM' ? null : this.selectedTrajectoryCode;
      this.launch({
        originX: startX,
        originY: startY,
        trajectory: forcedTraj,
        dir: Math.random() < 0.5 ? -1 : 1
      });
    }

    // --- Kích hoạt tách cành trực tiếp từ cành background canopy ---
    triggerFromCanopy(canopyElementId) {
      const el = document.getElementById(canopyElementId);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const originX = rect.left + rect.width * 0.5;
      const originY = rect.top + rect.height * 0.5;

      // Hướng bay phù hợp với vị trí cành trên màn hình
      let dir = 1;
      let branchSpriteIdx = 0;
      let preferredTraj = 'A';

      if (canopyElementId === 'branchLeft') {
        dir = 1; // Bay từ trái sang phải vào giữa phòng
        branchSpriteIdx = 0;
        preferredTraj = Math.random() < 0.5 ? 'A' : 'C';
      } else if (canopyElementId === 'branchRight') {
        dir = -1; // Bay từ phải sang trái
        branchSpriteIdx = 1;
        preferredTraj = Math.random() < 0.5 ? 'B' : 'D';
      } else { // branchTop
        dir = Math.random() < 0.5 ? 1 : -1;
        branchSpriteIdx = 2;
        preferredTraj = Math.random() < 0.5 ? 'B' : 'A';
      }

      // Sử dụng quỹ đạo người dùng đã chọn nếu không phải RANDOM
      const trajChoice = this.selectedTrajectoryCode === 'RANDOM' ? preferredTraj : this.selectedTrajectoryCode;

      // 1. Hiệu ứng cành gốc trên background canopy tách ra
      el.classList.add('branch-detaching');

      // 2. Phóng cành hoa bay tự do
      this.launch({
        originX: originX,
        originY: originY,
        dir: dir,
        branchIndex: branchSpriteIdx,
        trajectory: trajChoice,
        allowPetalDetach: true
      });

      // 3. Tái sinh một cành hoa mới tươi mát trên vòm canopy sau 1.8s
      setTimeout(() => {
        el.classList.remove('branch-detaching');
        el.classList.add('branch-regrowing');
        setTimeout(() => {
          el.classList.remove('branch-regrowing');
        }, 2600);
      }, 1800);
    }

    // --- Đốm sáng nắng lấp lánh (Sparkle) tại điểm tách cành ---
    spawnSparkle(x, y) {
      const el = document.createElement('div');
      el.className = 'branch-detachment-sparkle';
      el.innerHTML = `
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M 16 0 Q 16 16 32 16 Q 16 16 16 32 Q 16 16 0 16 Q 16 16 16 0 Z" fill="#fffbeb"/>
          <circle cx="16" cy="16" r="3.2" fill="#ffffff"/>
        </svg>
      `;
      this.layer.appendChild(el);

      this.activeSparkles.push({
        el,
        x: x - 12,
        y: y - 12,
        life: 0,
        maxLife: 36 + Math.random() * 18,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        rot: Math.random() * 360
      });

      this.ensurePhysicsLoop();
    }

    // --- Tách cánh hoa rơi tự do giữa đường bay (Detached Petals) ---
    spawnDetachedPetal(originX, originY, baseVx, baseVy) {
      const pIdx = Math.floor(Math.random() * DETACHABLE_PETALS.length);
      const pCfg = DETACHABLE_PETALS[pIdx];

      const el = document.createElement('div');
      el.className = 'branch-detached-petal';
      const pWidth = Math.round(pCfg.w * pCfg.scale * (window.innerWidth < 768 ? 0.8 : 1));
      const pHeight = Math.round(pCfg.h * pCfg.scale * (window.innerWidth < 768 ? 0.8 : 1));
      el.style.width = pWidth + 'px';
      el.style.height = pHeight + 'px';

      const img = document.createElement('img');
      img.src = pCfg.src;
      img.alt = 'Cánh hoa đậu biếc tách nhẹ';
      el.appendChild(img);
      this.layer.appendChild(el);

      // Vận tốc tách: kế thừa quán tính cành + lực đẩy khí động học tản ra ngoài
      const outwardImpulseX = (Math.random() - 0.5) * 1.4;
      const outwardImpulseY = -0.6 - Math.random() * 0.9;

      this.activePetals.push({
        el,
        x: originX,
        y: originY,
        vx: baseVx * 0.75 + outwardImpulseX,
        vy: baseVy * 0.75 + outwardImpulseY,
        gravity: 0.05 + Math.random() * 0.03,
        drag: 0.965,
        rotZ: Math.random() * 360,
        rotZSpeed: (Math.random() - 0.5) * 4.5,
        rotX: Math.random() * 360,
        rotXSpeed: (Math.random() - 0.5) * 5.2,
        rotY: Math.random() * 360,
        rotYSpeed: (Math.random() - 0.5) * 5.8,
        swayPhase: Math.random() * Math.PI * 2,
        life: 0,
        maxLife: 160 + Math.random() * 80
      });

      this.ensurePhysicsLoop();
    }

    // --- Chọn quỹ đạo ngẫu nhiên không lặp lại ---
    pickTrajectory(forcedCode = null) {
      if (forcedCode) {
        if (typeof forcedCode === 'object' && Array.isArray(forcedCode.points)) return forcedCode;
        const found = TRAJECTORY_PRESETS.find(t => t.id === String(forcedCode).toUpperCase());
        if (found) return found;
      }

      const available = [0, 1, 2, 3].filter(idx => idx !== this.lastTrajectoryIndex);
      const choice = available[Math.floor(Math.random() * available.length)];
      this.lastTrajectoryIndex = choice;
      return TRAJECTORY_PRESETS[choice];
    }

    // --- Kích hoạt cành hoa bay ngang màn hình chậm rãi & êm dịu (Dành cho Lời Hẹn) ---
    launchHorizontalAcross(options = {}) {
      const isMobile = window.innerWidth < 768;
      const fromLeft = options.fromLeft !== false;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      // Xuất phát từ rìa trái (hoặc rìa phải nếu fromLeft: false)
      const originX = fromLeft ? -100 : (screenW + 100);
      const originY = options.originY !== undefined ? options.originY : (screenH * (0.32 + Math.random() * 0.12));
      const totalSpan = screenW + 260;

      // Quỹ đạo trôi ngang xuyên suốt màn hình với nhịp võng lượn sóng êm ái
      const horizTraj = {
        id: 'HORIZONTAL_ACROSS',
        name: 'Quỹ đạo bay ngang màn hình',
        symbol: '─── 🌸 ───',
        detail: 'Cành hoa lướt bay ngang qua toàn bộ màn hình',
        baseDuration: options.duration || (isMobile ? 5400 : 6200),
        points: [
          { x: -140, y: 0 },
          { x: 0, y: 0 },
          { x: totalSpan * 0.22, y: -26 },
          { x: totalSpan * 0.48, y: 22 },
          { x: totalSpan * 0.74, y: -18 },
          { x: totalSpan * 1.02, y: 16 },
          { x: totalSpan * 1.20, y: 24 }
        ]
      };

      return this.launch({
        originX: originX,
        originY: originY,
        dir: fromLeft ? 1 : -1,
        branchIndex: options.branchIndex !== undefined ? options.branchIndex : 0,
        trajectory: horizTraj,
        distScale: 1.0,
        duration: horizTraj.baseDuration,
        allowPetalDetach: true
      });
    }

    // ============================================================
    // PHƯƠNG THỨC KÍCH HOẠT CHÍNH: LAUNCH CÀNH HOA HOÀN CHỈNH
    // ============================================================
    launch(options = {}) {
      playWindFlightSound(1.0);

      const isMobile = window.innerWidth < 768;

      // 1. Vị trí xuất phát
      const originX = options.originX !== undefined ? options.originX : window.innerWidth * 0.5;
      const originY = options.originY !== undefined ? options.originY : window.innerHeight * 0.25;

      // 2. Chọn cấu hình cành hoa (Cành + Lá + Hoa + Nụ hoa là MỘT OBJECT DUY NHẤT)
      const bIdx = typeof options.branchIndex === 'number'
        ? options.branchIndex % BRANCH_SPRITES.length
        : Math.floor(Math.random() * BRANCH_SPRITES.length);
      const bCfg = BRANCH_SPRITES[bIdx];

      // Kích thước cành hoa tỉ lệ thực tế
      const sizeScale = isMobile ? 0.68 : 0.88;
      const bWidth = Math.round(bCfg.width * sizeScale);
      const bHeight = Math.round(bCfg.height * sizeScale);

      // 3. Chọn Quỹ đạo bay (A, B, C, D hoặc tùy biến)
      const trajPreset = this.pickTrajectory(options.trajectory || (this.selectedTrajectoryCode === 'RANDOM' ? null : this.selectedTrajectoryCode));

      // 4. Hướng bay (dir: +1 sang phải, -1 đối xứng sang trái)
      let dir = 1;
      if (options.dir !== undefined && options.dir !== 0) {
        dir = options.dir < 0 ? -1 : 1;
      } else if (originX > window.innerWidth * 0.58) {
        dir = -1; // Xuất phát bên phải -> lượn hướng vào trung tâm/trái
      } else if (originX < window.innerWidth * 0.42) {
        dir = 1;  // Xuất phát bên trái -> lượn hướng sang phải
      } else {
        dir = Math.random() < 0.5 ? -1 : 1;
      }

      // Hệ số khoảng cách theo độ phân giải màn hình
      const distScale = options.distScale !== undefined
        ? options.distScale
        : (isMobile ? (0.75 + Math.random() * 0.1) : (1.05 + Math.random() * 0.15));

      // 5. Tạo cấu trúc DOM hoàn chỉnh (Unified Hierarchical Object)
      const branchItem = document.createElement('div');
      branchItem.className = 'branch-engine-item';
      branchItem.style.width = bWidth + 'px';
      branchItem.style.height = bHeight + 'px';
      branchItem.setAttribute('data-trajectory', trajPreset.id);

      // Lớp wrapper điều khiển Motion Blur & Bóng mờ
      const blurWrapper = document.createElement('div');
      blurWrapper.className = 'branch-blur-wrapper';

      // Khung xương uốn cong (Stem Flex Rig)
      const stemFlex = document.createElement('div');
      stemFlex.className = 'branch-stem-flex';

      // Thân cành composite chứa toàn bộ: thân + lá + hoa + nụ
      const compositeBody = document.createElement('div');
      compositeBody.className = 'branch-composite-body';

      // Ảnh cành hoa gốc
      const baseImg = document.createElement('img');
      baseImg.src = bCfg.src;
      baseImg.className = 'branch-base-img';
      baseImg.alt = 'Cành hoa đậu biếc uốn lượn';

      // Vùng lá rung nhẹ (Secondary motion overlay cho lá chét)
      const leafFlutter = document.createElement('div');
      leafFlutter.className = 'branch-leaf-flutter-zone';
      leafFlutter.style.left = `${bCfg.leafRelX * 100 - 15}%`;
      leafFlutter.style.top = `${bCfg.leafRelY * 100 - 15}%`;
      leafFlutter.style.width = '32%';
      leafFlutter.style.height = '32%';

      // Vùng hoa rung nhẹ (Secondary motion overlay cho hoa đậu biếc)
      const blossomFlutter = document.createElement('div');
      blossomFlutter.className = 'branch-blossom-flutter-zone';
      blossomFlutter.style.left = `${bCfg.flowerRelX * 100 - 14}%`;
      blossomFlutter.style.top = `${bCfg.flowerRelY * 100 - 14}%`;
      blossomFlutter.style.width = '28%';
      blossomFlutter.style.height = '28%';

      // Vùng nụ hoa (Flower bud node)
      const budNode = document.createElement('div');
      budNode.className = 'branch-bud-node';
      budNode.style.left = `${bCfg.budRelX * 100 - 8}%`;
      budNode.style.top = `${bCfg.budRelY * 100 - 8}%`;
      budNode.style.width = '16%';
      budNode.style.height = '16%';

      // Lắp ráp phân cấp đối tượng hoàn chỉnh
      compositeBody.appendChild(baseImg);
      compositeBody.appendChild(leafFlutter);
      compositeBody.appendChild(blossomFlutter);
      compositeBody.appendChild(budNode);
      stemFlex.appendChild(compositeBody);
      blurWrapper.appendChild(stemFlex);
      branchItem.appendChild(blurWrapper);
      this.layer.appendChild(branchItem);

      // 6. Hiệu ứng ánh sáng lấp lánh khi cành tách khỏi background
      for (let s = 0; s < 4; s++) {
        this.spawnSparkle(originX + (Math.random() - 0.5) * 24, originY + (Math.random() - 0.5) * 24);
      }

      // 7. Tạo đối tượng dữ liệu vật lý của cành hoa
      const durationMs = options.duration !== undefined
        ? options.duration
        : trajPreset.baseDuration * (0.94 + Math.random() * 0.12);
      const branchObj = {
        el: branchItem,
        blurWrapper: blurWrapper,
        stemFlex: stemFlex,
        leafFlutter: leafFlutter,
        blossomFlutter: blossomFlutter,
        budNode: budNode,
        cfg: bCfg,
        trajectory: trajPreset,
        originX: originX,
        originY: originY,
        dir: dir,
        distScale: distScale,
        width: bWidth,
        height: bHeight,
        startTime: performance.now(),
        duration: durationMs,
        // Quán tính góc quay và uốn lượn
        baseScale: (0.92 + Math.random() * 0.12) * (isMobile ? 0.88 : 1.0),
        baseRot: (Math.random() - 0.5) * 14,
        currentTiltZ: 0,
        currentSkew: 0,
        currentRollY: 0,
        currentPitchX: 0,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.038 + Math.random() * 0.015,
        // Cánh hoa tách giữa đường
        allowPetalDetach: options.allowPetalDetach !== false,
        petalsDetachedCount: 0,
        maxDetachablePetals: Math.random() < 0.65 ? 2 : 1,
        petalDetachThreshold1: 0.36 + Math.random() * 0.12,
        petalDetachThreshold2: 0.58 + Math.random() * 0.10,
        // Vận tốc trước đó để tính gia tốc quán tính
        prevX: originX,
        prevY: originY,
        vx: 0,
        vy: 0,
        onProgress: options.onProgress,
        onComplete: options.onComplete
      };

      this.activeBranches.push(branchObj);
      this.ensurePhysicsLoop();

      return branchObj;
    }

    // --- Đảm bảo vòng lặp RequestAnimationFrame luôn chạy khi có đối tượng chuyển động ---
    ensurePhysicsLoop() {
      if (!this.isLoopRunning && (this.activeBranches.length > 0 || this.activePetals.length > 0 || this.activeSparkles.length > 0)) {
        this.isLoopRunning = true;
        requestAnimationFrame((ts) => this.updateLoop(ts));
      }
    }

    // ============================================================
    // VÒNG LẶP VẬT LÝ KHÍ ĐỘNG HỌC (60FPS AERODYNAMIC LOOP)
    // ============================================================
    updateLoop(timestamp) {
      const now = timestamp || performance.now();

      // 1. CẬP NHẬT ĐỐM SÁNG LẤP LÁNH KHI TÁCH CÀNH (SPARKLES)
      for (let i = this.activeSparkles.length - 1; i >= 0; i--) {
        const sp = this.activeSparkles[i];
        sp.life++;
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.rot += 2.2;

        const progress = sp.life / sp.maxLife;
        const scale = Math.sin(progress * Math.PI) * 1.3;
        const alpha = Math.sin(progress * Math.PI);

        sp.el.style.transform = `translate3d(${sp.x.toFixed(1)}px, ${sp.y.toFixed(1)}px, 0) scale(${scale.toFixed(2)}) rotate(${sp.rot.toFixed(1)}deg)`;
        sp.el.style.opacity = alpha.toFixed(3);

        if (sp.life >= sp.maxLife) {
          sp.el.remove();
          this.activeSparkles.splice(i, 1);
        }
      }

      // 2. CẬP NHẬT CÁNH HOA TÁCH RỜI BAY TỰ DO (DETACHED PETALS)
      for (let i = this.activePetals.length - 1; i >= 0; i--) {
        const p = this.activePetals[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;

        p.rotZ += p.rotZSpeed;
        p.rotX += p.rotXSpeed;
        p.rotY += p.rotYSpeed;
        p.swayPhase += 0.05;

        // Trôi dạt lắc lư theo gió nhẹ
        const swayX = Math.sin(p.swayPhase) * 0.8;
        const progress = p.life / p.maxLife;

        let alpha = 1;
        if (progress > 0.7) {
          alpha = 1 - (progress - 0.7) / 0.3;
        }

        p.el.style.transform = `translate3d(${(p.x + swayX).toFixed(1)}px, ${p.y.toFixed(1)}px, 0) rotateZ(${p.rotZ.toFixed(1)}deg) rotateY(${p.rotY.toFixed(1)}deg) rotateX(${p.rotX.toFixed(1)}deg)`;
        p.el.style.opacity = Math.max(0, Math.min(1, alpha)).toFixed(3);

        if (p.life >= p.maxLife) {
          p.el.remove();
          this.activePetals.splice(i, 1);
        }
      }

      // 3. CẬP NHẬT CHÍNH: CÀNH HOA HOÀN CHỈNH (UNIFIED FLOWER BRANCH OBJECT)
      for (let i = this.activeBranches.length - 1; i >= 0; i--) {
        const br = this.activeBranches[i];
        const elapsed = now - br.startTime;
        const rawProgress = Math.min(1, Math.max(0, elapsed / br.duration));

        // Áp dụng quán tính vật lý (Inertia & Deceleration Cushion)
        const u = computeInertialProgress(rawProgress);

        // Lấy tọa độ và đạo hàm vận tốc/độ cong từ Spline
        const sample = sampleCatmullRomSpline(br.trajectory.points, u);

        // Vị trí không gian thực tế
        const curX = br.originX + sample.x * br.dir * br.distScale;
        const curY = br.originY + sample.y * br.distScale;

        // Vận tốc tức thời
        br.vx = (curX - br.prevX);
        br.vy = (curY - br.prevY);
        br.prevX = curX;
        br.prevY = curY;
        const speed = Math.sqrt(br.vx * br.vx + br.vy * br.vy);

        // Góc tiếp tuyến của đường bay (Tangent Heading)
        const headingRad = Math.atan2(sample.dy, sample.dx * br.dir);
        const headingDeg = headingRad * (180 / Math.PI);

        // Chu kỳ nhịp đập bồng bềnh tựa cánh bướm đón gió (Airy Buoyancy Oscillation - tuyệt đối không dùng hình ảnh bướm)
        br.swayPhase += br.swaySpeed;
        const floatSway = Math.sin(br.swayPhase);
        const floatBank = Math.cos(br.swayPhase * 0.9);

        // (a) Xoay nhẹ (Yaw Z) bám tiếp tuyến quỹ đạo kết hợp quán tính
        const targetTiltZ = br.baseRot + headingDeg * 0.44 + floatSway * 7.5;
        br.currentTiltZ += (targetTiltZ - br.currentTiltZ) * 0.15;

        // (b) Nghiêng trái/phải 3D (Roll Y banking vào cua)
        // Khi cua ngoặt, độ cong κ đẩy cành hoa nghiêng mình theo khí động học
        const curveBank = Math.max(-36, Math.min(36, sample.curvature * 3400 * br.dir));
        const targetRollY = curveBank + floatBank * 18;
        br.currentRollY += (targetRollY - br.currentRollY) * 0.12;

        // (c) Nghiêng gật gù 3D (Pitch X theo hướng chúc xuống hay bốc lên)
        const targetPitchX = Math.max(-24, Math.min(24, -sample.dy * 0.04));
        br.currentPitchX += (targetPitchX - br.currentPitchX) * 0.14;

        // (d) Uốn lượn của thân cây (Stem Flex theo lực cản gió và gia tốc)
        const targetSkew = -Math.sin(headingRad) * 8.5 * br.dir + floatSway * 3.8;
        br.currentSkew += (targetSkew - br.currentSkew) * 0.12;
        const stemScaleY = 1 - Math.abs(br.currentSkew) * 0.007;

        // (e) Secondary Motion: Lá rung nhẹ (Leaf micro-flutter)
        // Khi bay nhanh lá rung tần số cao hơn và nhấp nhô sống động
        const leafFreq = now * 0.045 + i;
        const leafAmp = 1.6 + Math.min(3.2, speed * 0.28);
        const leafRot = Math.sin(leafFreq) * leafAmp;
        br.leafFlutter.style.transform = `rotate(${leafRot.toFixed(2)}deg) scale(${(1 + Math.sin(leafFreq * 0.8) * 0.04).toFixed(3)})`;

        // (f) Secondary Motion: Hoa rung nhẹ cánh hoa nhung mượt (Blossom velvety tremor)
        const blossomFreq = now * 0.028 + i;
        const blossomAmp = 1.0 + Math.min(2.4, speed * 0.20);
        const blossomRot = Math.cos(blossomFreq) * blossomAmp;
        br.blossomFlutter.style.transform = `rotate(${blossomRot.toFixed(2)}deg) skewX(${(blossomRot * 0.5).toFixed(2)}deg)`;

        // (g) Secondary Motion: Nụ hoa dao động nhịp nhàng
        const budFreq = now * 0.035 + i;
        const budRot = Math.sin(budFreq) * (1.2 + speed * 0.15);
        br.budNode.style.transform = `rotate(${budRot.toFixed(2)}deg)`;

        // (h) Một số cánh hoa tách khỏi cành giữa đường bay (Detached petals)
        if (br.allowPetalDetach && br.petalsDetachedCount < br.maxDetachablePetals) {
          const shouldDetach1 = br.petalsDetachedCount === 0 && u >= br.petalDetachThreshold1;
          const shouldDetach2 = br.petalsDetachedCount === 1 && u >= br.petalDetachThreshold2;

          if (shouldDetach1 || shouldDetach2) {
            br.petalsDetachedCount++;

            // Tính vị trí thế giới chính xác của hoa trên cành
            const flLocalX = (br.cfg.flowerRelX - 0.5) * br.width * br.dir;
            const flLocalY = (br.cfg.flowerRelY - 0.5) * br.height;
            const rad = br.currentTiltZ * (Math.PI / 180);
            const cosR = Math.cos(rad);
            const sinR = Math.sin(rad);

            const flWorldX = curX + (flLocalX * cosR - flLocalY * sinR);
            const flWorldY = curY + (flLocalX * sinR + flLocalY * cosR);

            this.spawnDetachedPetal(flWorldX, flWorldY, br.vx, br.vy);
          }
        }

        // (i) Motion blur nhẹ khi tốc độ cao, trở lại sắc nét khi chậm lại ở cuối
        let blurAmount = 0;
        if (speed > 4.2) {
          blurAmount = Math.min(3.4, (speed - 4.2) * 0.32);
        }
        if (blurAmount > 0.15) {
          br.blurWrapper.style.filter = `blur(${blurAmount.toFixed(2)}px) drop-shadow(0 16px 28px rgba(15, 23, 42, 0.32)) drop-shadow(0 4px 10px rgba(30, 58, 138, 0.18))`;
        } else {
          br.blurWrapper.style.filter = `drop-shadow(0 16px 28px rgba(15, 23, 42, 0.32)) drop-shadow(0 4px 10px rgba(30, 58, 138, 0.18))`;
        }

        // (j) Độ trong suốt: Hiện êm dịu lúc xuất phát, ổn định trên không trung, mờ dần cuối đường
        let alpha = 1.0;
        if (rawProgress < 0.08) {
          alpha = Math.sin((rawProgress / 0.08) * Math.PI * 0.5);
        } else if (rawProgress > 0.78) {
          alpha = Math.max(0, 1 - (rawProgress - 0.78) / 0.22);
        }

        // Kích thước co giãn nhịp nhàng
        const breathe = 0.97 + 0.07 * Math.sin(rawProgress * Math.PI);
        const finalScale = br.baseScale * breathe;

        // Áp dụng biến đổi ma trận 3D lên đối tượng cành hoa duy nhất
        const posX = curX - br.width * 0.5;
        const posY = curY - br.height * 0.5;

        br.el.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0) scale(${finalScale.toFixed(3)}) rotateZ(${br.currentTiltZ.toFixed(1)}deg) rotateY(${br.currentRollY.toFixed(1)}deg) rotateX(${br.currentPitchX.toFixed(1)}deg)`;
        br.stemFlex.style.transform = `skewX(${br.currentSkew.toFixed(1)}deg) scaleY(${stemScaleY.toFixed(3)})`;
        br.el.style.opacity = alpha.toFixed(3);

        // Kích hoạt callback tiến độ bay
        if (typeof br.onProgress === 'function') {
          try {
            br.onProgress(rawProgress, curX, curY, br);
          } catch (_) {}
        }

        // Kết thúc hành trình: Xóa khỏi DOM sạch sẽ
        if (rawProgress >= 1.0) {
          if (typeof br.onComplete === 'function') {
            try {
              br.onComplete(curX, curY, br);
            } catch (_) {}
          }
          br.el.remove();
          this.activeBranches.splice(i, 1);
        }
      }

      // Tiếp tục vòng lặp nếu còn phần tử hoạt động
      if (this.activeBranches.length > 0 || this.activePetals.length > 0 || this.activeSparkles.length > 0) {
        requestAnimationFrame((ts) => this.updateLoop(ts));
      } else {
        this.isLoopRunning = false;
      }
    }

    // --- Xóa sạch mọi cành hoa đang bay ---
    clear() {
      this.activeBranches.forEach(b => b.el.remove());
      this.activePetals.forEach(p => p.el.remove());
      this.activeSparkles.forEach(s => s.el.remove());
      this.activeBranches = [];
      this.activePetals = [];
      this.activeSparkles = [];
      this.isLoopRunning = false;
    }

    // --- Danh sách các Preset quỹ đạo hiện có ---
    getTrajectories() {
      return TRAJECTORY_PRESETS;
    }
  }

  // Khởi tạo Singleton toàn cục trên window
  window.BranchEngine = BranchEngine;

  function initBranchEngine() {
    if (!window.branchEngine) {
      window.branchEngine = new BranchEngine();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBranchEngine);
  } else {
    initBranchEngine();
  }

})(window, document);
