/**
 * GIFT FOR THOA - MÓN QUÀ TRUNG THU NGỌT NGÀO
 * Cập nhật:
 * 1. Sân khấu canvas độc lập cho Trái Tim & Chữ Thoa, không bị che khuất
 * 2. Tối ưu Responsive chuẩn chỉnh trên điện thoại & máy tính bảng
 * 3. Bổ sung đa dạng hiệu ứng chuyển động cho ảnh của Thoa (nhún nhảy, vệt sáng, aura pulse, tai thỏ)
 * 4. Hiệu ứng tương tác cảm ứng nhạy bén trên Mobile
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
  const numStars = Math.min(110, Math.floor((width * height) / 9000));

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
    if (Math.random() < 0.018 && meteors.length < 2) {
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

    // Vẽ sao lấp lánh
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

    // Vẽ sao băng
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

  let width, height;
  function updateDimensions() {
    const rect = wrapper.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }
  updateDimensions();

  const isMobile = window.innerWidth < 768;
  const NUM_PARTICLES = isMobile ? 480 : 700;
  const particles = [];
  let currentTargetMode = 'heart'; // 'heart' hoặc 'thoa'
  let heartTargets = [];
  let thoaTargets = [];

  // 1. Tạo điểm tọa độ Trái Tim chuẩn xác ở giữa canvas
  function generateHeartPoints(count) {
    const points = [];
    const scale = Math.min(width, height) * (isMobile ? 0.038 : 0.046);
    const cx = width / 2;
    const cy = height * 0.48; // Canh giữa hoàn hảo

    for (let i = 0; i < count; i++) {
      const t = Math.PI * 2 * (i / count);
      // Phương trình toán học hình trái tim
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

  // 2. Tạo điểm tọa độ chữ "Thoa 💕" sắc nét, rõ ràng
  function generateTextPoints(count) {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d');

    const fontSize = isMobile ? Math.min(65, width * 0.16) : Math.min(95, width * 0.18);
    offCtx.font = `bold ${fontSize}px "Pacifico", "Dancing Script", cursive, sans-serif`;
    offCtx.fillStyle = '#ffffff';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText('Thoa 💕', width / 2, height * 0.48);

    const imgData = offCtx.getImageData(0, 0, width, height);
    const validPixels = [];
    const step = isMobile ? 3 : 4;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        if (imgData.data[index + 3] > 120) {
          validPixels.push({ x, y });
        }
      }
    }

    const points = [];
    for (let i = 0; i < count; i++) {
      if (validPixels.length > 0) {
        const pixel = validPixels[i % validPixels.length];
        points.push({
          x: pixel.x + (Math.random() - 0.5) * 3,
          y: pixel.y + (Math.random() - 0.5) * 3
        });
      } else {
        points.push({ x: width / 2, y: height / 2 });
      }
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

  // Tương tác chuột & chạm cảm ứng trên canvas
  let mouse = { x: -1000, y: -1000, radius: 60 };

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
      p.targetX = targets[idx].x;
      p.targetY = targets[idx].y;
      p.vx += (Math.random() - 0.5) * 10;
      p.vy += (Math.random() - 0.5) * 10;
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
        p.vx += (Math.random() - 0.5) * 22;
        p.vy += (Math.random() - 0.5) * 22;
      });
      createHeartBurst(window.innerWidth / 2, window.innerHeight * 0.35, 15);
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
      : 1 + Math.sin(beatTimer * 1.5) * 0.03;

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
        const force = (1 - distMouse / mouse.radius) * 8;
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
    const targets = currentTargetMode === 'heart' ? heartTargets : thoaTargets;
    particles.forEach((p, idx) => {
      p.targetX = targets[idx].x;
      p.targetY = targets[idx].y;
    });
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

    // Bắn tim và sao xung quanh ảnh
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
      createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 3, 20);
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

  // Tương tác lần đầu để phát nhạc nếu được phép
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
