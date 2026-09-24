/**
 * GIFT FOR THOA - MÓN QUÀ TRUNG THU NGỌT NGÀO
 * Khắc phục hoàn toàn:
 * 1. Chữ Thoa trên Mobile hiển thị sắc nét, không bị co cụm thành 1 đốm
 * 2. Header trên Mobile thoáng đãng, không bị mặt trăng / lồng đèn / nút nhạc che chữ
 * 3. Hỗ trợ font loading & fallback vector an toàn trên mọi thiết bị di động
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initHeartMorphCanvas();
  initPhotoInteractions();
  initTypewriter();
  initMusicPlayer();
  initInteractiveBursts();
});

/* =========================================================================
   1. CANVAS NỀN: SAO TRỜI, ĐOM ĐÓM & VẨY ÁNH TRĂNG
   ========================================================================= */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const stars = [];
  const numStars = Math.min(100, Math.floor((width * height) / 9500));

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.3 ? '#ffeaa7' : '#ffb6c1'
    });
  }

  // Sao băng ngẫu nhiên
  let meteors = [];
  function spawnMeteor() {
    if (Math.random() < 0.016 && meteors.length < 2) {
      meteors.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.35),
        len: Math.random() * 70 + 40,
        speed: Math.random() * 5 + 6,
        alpha: 1
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      star.alpha += star.speed;
      const opacity = (Math.sin(star.alpha) + 1) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = opacity * 0.85;
      ctx.shadowBlur = 8;
      ctx.shadowColor = star.color;
      ctx.fill();
      ctx.restore();
    });

    spawnMeteor();
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      ctx.save();
      ctx.strokeStyle = `rgba(255, 234, 167, ${m.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.len, m.y + m.len * 0.6);
      ctx.stroke();
      ctx.restore();

      m.x += m.speed;
      m.y += m.speed * 0.6;
      m.alpha -= 0.015;

      if (m.alpha <= 0) meteors.splice(i, 1);
    }

    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* =========================================================================
   2. SÂN KHẤU HẠT: TRÁI TIM HỒNG CHUYỂN ĐỘNG & BIẾN THÀNH CHỮ "THOA"
   ========================================================================= */
function initHeartMorphCanvas() {
  const canvas = document.getElementById('heart-canvas');
  const wrapper = document.getElementById('heartCanvasWrapper');
  if (!canvas || !wrapper) return;
  const ctx = canvas.getContext('2d');

  let width = 360;
  let height = 280;

  function updateDimensions() {
    const rect = wrapper.getBoundingClientRect();
    width = Math.max(rect.width || 0, window.innerWidth - 32, 300);
    height = Math.max(rect.height || 0, 260);
    canvas.width = width;
    canvas.height = height;
  }
  updateDimensions();

  const isMobile = window.innerWidth < 768;
  const NUM_PARTICLES = isMobile ? 480 : 680;
  const particles = [];
  let currentTargetMode = 'heart'; // 'heart' hoặc 'thoa'
  let heartTargets = [];
  let thoaTargets = [];

  // 1. Tạo điểm Trái Tim chuẩn xác ở giữa canvas
  function generateHeartPoints(count) {
    const points = [];
    const scale = Math.min(width, height) * (isMobile ? 0.038 : 0.046);
    const cx = width / 2;
    const cy = height * 0.48;

    for (let i = 0; i < count; i++) {
      const t = Math.PI * 2 * (i / count);
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      const fillFactor = Math.sqrt(Math.random()) * 0.95 + 0.05;
      points.push({
        x: cx + x * scale * fillFactor,
        y: cy + y * scale * fillFactor
      });
    }
    return points;
  }

  // 2. Tạo điểm chữ "Thoa" kết hợp hình trái tim - Đảm bảo hoạt động 100% trên Mobile
  function generateTextPoints(count) {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d');

    // Hàm quét pixel từ canvas
    function scanPixels(useFont) {
      offCtx.clearRect(0, 0, width, height);
      offCtx.fillStyle = '#ffffff';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';

      const fontSize = isMobile ? Math.min(62, width * 0.16) : Math.min(90, width * 0.18);
      offCtx.font = `bold ${fontSize}px ${useFont}`;

      // Vẽ chữ "Thoa" lùi nhẹ sang trái một chút để chừa chỗ cho trái tim
      const textX = width / 2 - (isMobile ? 22 : 32);
      const textY = height * 0.48;
      offCtx.fillText('Thoa', textX, textY);

      // Vẽ hình trái tim mini kế bên chữ Thoa (bằng Path toán học, không dùng emoji tránh lỗi Android)
      const hx = width / 2 + (isMobile ? 48 : 72);
      const hy = height * 0.44;
      const hr = isMobile ? 12 : 18;

      offCtx.beginPath();
      offCtx.moveTo(hx, hy);
      offCtx.bezierCurveTo(hx, hy - hr, hx - hr * 1.3, hy - hr, hx - hr * 1.3, hy);
      offCtx.bezierCurveTo(hx - hr * 1.3, hy + hr * 0.6, hx, hy + hr * 1.3, hx, hy + hr * 1.6);
      offCtx.bezierCurveTo(hx, hy + hr * 1.3, hx + hr * 1.3, hy + hr * 0.6, hx + hr * 1.3, hy);
      offCtx.bezierCurveTo(hx + hr * 1.3, hy - hr, hx, hy - hr, hx, hy);
      offCtx.fill();

      // Quét điểm sáng
      const imgData = offCtx.getImageData(0, 0, width, height);
      const valid = [];
      const step = isMobile ? 3 : 4;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4;
          if (imgData.data[idx + 3] > 80) { // Nhận diện pixel vẽ
            valid.push({ x, y });
          }
        }
      }
      return valid;
    }

    // Thử lần 1 với Pacifico / Dancing Script
    let validPixels = scanPixels('"Pacifico", "Dancing Script", cursive, sans-serif');

    // Nếu mobile chưa load kịp font Google Fonts, fallback sang font hệ thống chuẩn
    if (validPixels.length < 80) {
      validPixels = scanPixels('"Segoe UI", Arial, sans-serif');
    }

    // Nếu vẫn nhỏ hơn 40 (trường hợp cực hiếm), fallback sang hình phân tán đối xứng quanh chữ Thoa
    const points = [];
    if (validPixels.length > 0) {
      for (let i = 0; i < count; i++) {
        const p = validPixels[i % validPixels.length];
        points.push({
          x: p.x + (Math.random() - 0.5) * 3,
          y: p.y + (Math.random() - 0.5) * 3
        });
      }
    } else {
      // Fallback an toàn: không bao giờ để dồn thành 1 đốm
      const heartFb = generateHeartPoints(count);
      return heartFb;
    }
    return points;
  }

  function recomputeTargets() {
    updateDimensions();
    heartTargets = generateHeartPoints(NUM_PARTICLES);
    thoaTargets = generateTextPoints(NUM_PARTICLES);
  }
  recomputeTargets();

  // Khởi tạo các hạt
  const colors = ['#ff6b9d', '#ff758c', '#ff8e8e', '#ffb6c1', '#ff9ff3', '#feca57', '#ffffff'];

  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      targetX: heartTargets[i].x,
      targetY: heartTargets[i].y,
      size: Math.random() * 2.2 + 1.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.4 + 0.6
    });
  }

  function applyTargets() {
    const targets = currentTargetMode === 'heart' ? heartTargets : thoaTargets;
    particles.forEach((p, idx) => {
      if (targets[idx]) {
        p.targetX = targets[idx].x;
        p.targetY = targets[idx].y;
      }
    });
  }

  // Chờ khi font chữ load xong thì cập nhật lại chữ Thoa cho đẹp nhất
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      recomputeTargets();
      applyTargets();
    });
  }
  window.addEventListener('load', () => {
    setTimeout(() => {
      recomputeTargets();
      applyTargets();
    }, 250);
  });

  // Tương tác chuột & chạm cảm ứng trên canvas
  let mouse = { x: -1000, y: -1000, radius: 55 };

  function handlePointerMove(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = clientX - rect.left;
    mouse.y = clientY - rect.top;
  }

  canvas.addEventListener('mousemove', (e) => handlePointerMove(e.clientX, e.clientY));
  canvas.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  canvas.addEventListener('touchend', () => { mouse.x = -1000; mouse.y = -1000; });

  // Đổi dáng hạt Trái Tim <-> Chữ Thoa
  function toggleParticleShape() {
    currentTargetMode = currentTargetMode === 'heart' ? 'thoa' : 'heart';
    const targets = currentTargetMode === 'heart' ? heartTargets : thoaTargets;

    particles.forEach((p, idx) => {
      if (targets[idx]) {
        p.targetX = targets[idx].x;
        p.targetY = targets[idx].y;
      }
      p.vx += (Math.random() - 0.5) * 8;
      p.vy += (Math.random() - 0.5) * 8;
    });

    const morphBtn = document.getElementById('morph-toggle');
    if (morphBtn) {
      const label = morphBtn.querySelector('.btn-label');
      const icon = morphBtn.querySelector('.btn-icon');
      if (currentTargetMode === 'thoa') {
        label.innerText = 'Đang hiện: Chữ Thoa';
        icon.innerText = '✨';
      } else {
        label.innerText = 'Đang hiện: Trái Tim';
        icon.innerText = '💖';
      }
    }
  }

  // Nút đổi dáng hạt
  const morphBtn = document.getElementById('morph-toggle');
  if (morphBtn) {
    morphBtn.addEventListener('click', toggleParticleShape);
  }

  // Nút tung sao hồng / bùng nổ hạt
  const scatterBtn = document.getElementById('scatter-btn');
  if (scatterBtn) {
    scatterBtn.addEventListener('click', () => {
      particles.forEach(p => {
        p.vx += (Math.random() - 0.5) * 20;
        p.vy += (Math.random() - 0.5) * 20;
      });
      createHeartBurst(window.innerWidth / 2, window.innerHeight * 0.35, 14);
    });
  }

  // Tự động chuyển đổi sau mỗi 7 giây
  setInterval(toggleParticleShape, 7000);

  // Hiệu ứng phập phồng (Heartbeat pulse)
  let beatTimer = 0;

  function render() {
    ctx.clearRect(0, 0, width, height);

    beatTimer += 0.055;
    const pulseScale = currentTargetMode === 'heart'
      ? 1 + Math.pow(Math.sin(beatTimer * 2.2), 6) * 0.12 + Math.pow(Math.sin(beatTimer * 2.2 + 0.3), 8) * 0.06
      : 1 + Math.sin(beatTimer * 1.5) * 0.025;

    const cx = width / 2;
    const cy = height * 0.48;

    particles.forEach((p) => {
      const dxOrigin = p.targetX - cx;
      const dyOrigin = p.targetY - cy;
      const pulsedTargetX = cx + dxOrigin * pulseScale;
      const pulsedTargetY = cy + dyOrigin * pulseScale;

      const dx = pulsedTargetX - p.x;
      const dy = pulsedTargetY - p.y;
      p.vx = p.vx * 0.86 + dx * 0.045;
      p.vy = p.vy * 0.86 + dy * 0.045;

      // Phản hồi với con trỏ chuột / ngón tay
      const distMouseX = p.x - mouse.x;
      const distMouseY = p.y - mouse.y;
      const distMouse = Math.sqrt(distMouseX * distMouseX + distMouseY * distMouseY);
      if (distMouse < mouse.radius) {
        const force = (1 - distMouse / mouse.radius) * 7;
        const angle = Math.atan2(distMouseY, distMouseX);
        p.vx += Math.cos(angle) * force;
        p.vy += Math.sin(angle) * force;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Vẽ hạt sáng
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 9;
      ctx.shadowColor = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(render);
  }
  render();

  window.addEventListener('resize', () => {
    recomputeTargets();
    applyTargets();
  });
}

/* =========================================================================
   3. CÁC HIỆU ỨNG CHUYỂN ĐỘNG & TƯƠNG TÁC CHO ẢNH THOA
   ========================================================================= */
function initPhotoInteractions() {
  const wrapper = document.getElementById('cardWrapper');
  const card = document.getElementById('card3d');
  const danceBtn = document.getElementById('dance-btn');
  const heartBurstBtn = document.getElementById('heart-burst-btn');
  if (!card) return;

  // 1. Tương tác 3D tilt theo con trỏ chuột (trên máy tính)
  if (wrapper && window.innerWidth >= 768) {
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = -(y / (rect.height / 2)) * 12;
      const rotY = (x / (rect.width / 2)) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  }

  // 2. Kích hoạt hiệu ứng nhún nhảy dễ thương (Jelly Dance)
  function triggerDance() {
    card.classList.remove('dance-active');
    void card.offsetWidth; // Force reflow
    card.classList.add('dance-active');

    const rect = card.getBoundingClientRect();
    createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);

    setTimeout(() => {
      card.classList.remove('dance-active');
    }, 1000);
  }

  if (danceBtn) {
    danceBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerDance();
    });
  }

  if (heartBurstBtn) {
    heartBurstBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = card.getBoundingClientRect();
      createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 3, 18);
    });
  }

  // Chạm hoặc nhấp trực tiếp vào ảnh: vừa nhún nhảy vừa bắn tim
  card.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    triggerDance();
  });
}

/* =========================================================================
   4. HIỆU ỨNG TYPEWRITER LỜI CHÚC TRUNG THU
   ========================================================================= */
function initTypewriter() {
  const container = document.getElementById('typewriter');
  const replayBtn = document.getElementById('btn-replay');
  if (!container) return;

  const message = 
`Gửi Thoa thân yêu,

Đêm nay ánh trăng rằm tháng Tám sáng tỏ và tròn đầy nhất trên bầu trời... Nhưng có một điều chắc chắn là: nụ cười và sự dịu dàng của Thoa còn rạng ngời và ấm áp hơn cả ánh trăng ấy.

Nhân dịp Tết Trung Thu, chúc Thoa luôn giữ trọn nét hồn nhiên, đáng yêu và nụ cười rạng rỡ trên môi. Mong mọi muộn phiền đều tan biến, chỉ còn lại những điều ngọt ngào như chiếc bánh dẻo bánh nướng, bình yên và thật nhiều hạnh phúc bên những người bạn thương yêu.

Cảm ơn Thoa vì đã luôn mang đến nguồn năng lượng dễ thương và tích cực! 🥮🌕✨`;

  let timerId = null;

  function startTyping() {
    if (timerId) clearInterval(timerId);
    container.innerHTML = '<span class="typewriter-cursor"></span>';
    let index = 0;

    timerId = setInterval(() => {
      if (index < message.length) {
        const textSoFar = message.slice(0, index + 1);
        container.innerHTML = escapeHtml(textSoFar) + '<span class="typewriter-cursor"></span>';
        index++;
      } else {
        clearInterval(timerId);
        setTimeout(() => {
          const cursor = container.querySelector('.typewriter-cursor');
          if (cursor) cursor.remove();
        }, 3000);
      }
    }, 40);
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  setTimeout(startTyping, 600);

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      startTyping();
      createHeartBurst(window.innerWidth / 2, window.innerHeight * 0.7, 12);
    });
  }
}

/* =========================================================================
   5. BẮN PHÁO HOA TIM & TƯƠNG TÁC CHẠM
   ========================================================================= */
function createHeartBurst(x, y, count = 10) {
  const emojis = ['💖', '💕', '✨', '🌸', '🥮', '🐇', '💗', '⭐'];
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];

    const xOffset = (Math.random() - 0.5) * 150 + 'px';
    const rot = (Math.random() - 0.5) * 90 + 'deg';
    heart.style.setProperty('--x-offset', xOffset);
    heart.style.setProperty('--rot', rot);

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1400);
  }
}

function initInteractiveBursts() {
  const fireworksBtn = document.getElementById('btn-fireworks');
  if (fireworksBtn) {
    fireworksBtn.addEventListener('click', () => {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          const rx = window.innerWidth * (0.2 + Math.random() * 0.6);
          const ry = window.innerHeight * (0.2 + Math.random() * 0.35);
          createHeartBurst(rx, ry, 18);
        }, i * 320);
      }
    });
  }

  // Nhấp chuột hoặc chạm bất kỳ để thả tim nhẹ
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.id === 'heart-canvas') return;
    createHeartBurst(e.clientX, e.clientY, 4);
  });
}

/* =========================================================================
   6. BẬT / TẮT ÂM NHẠC NỀN
   ========================================================================= */
function initMusicPlayer() {
  const musicBtn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-audio');
  if (!musicBtn || !audio) return;

  let isPlaying = false;

  musicBtn.addEventListener('click', () => {
    if (!isPlaying) {
      audio.volume = 0.5;
      audio.play().then(() => {
        isPlaying = true;
        updateBtnState(true);
      }).catch(() => {
        isPlaying = true;
        updateBtnState(true);
      });
    } else {
      audio.pause();
      isPlaying = false;
      updateBtnState(false);
    }
  });

  function updateBtnState(playing) {
    const textSpan = musicBtn.querySelector('.btn-text');
    const iconSpan = musicBtn.querySelector('.icon');
    if (playing) {
      musicBtn.classList.add('active');
      if (textSpan) textSpan.innerText = 'Tắt nhạc';
      if (iconSpan) iconSpan.innerText = '🎶';
    } else {
      musicBtn.classList.remove('active');
      if (textSpan) textSpan.innerText = 'Bật nhạc';
      if (iconSpan) iconSpan.innerText = '🎵';
    }
  }

  const playOnce = () => {
    document.removeEventListener('click', playOnce);
    if (!isPlaying) {
      audio.volume = 0.4;
      audio.play().then(() => {
        isPlaying = true;
        updateBtnState(true);
      }).catch(() => {});
    }
  };
  document.addEventListener('click', playOnce, { once: true });
}
