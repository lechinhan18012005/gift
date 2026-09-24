/**
 * GIFT FOR THOA - MÓN QUÀ TRUNG THU NGỌT NGÀO
 * Chức năng:
 * 1. Particle System Morphing: Trái tim hồng chuyển động nhịp đập & biến hóa thành chữ "Thoa 💕"
 * 2. Canvas Starfield & Moon Dust nền trời đêm
 * 3. Hiệu ứng chuyển động 3D Card cho hình ảnh của Thoa
 * 4. Hiệu ứng Typewriter lời chúc Trung Thu
 * 5. Bắn pháo hoa tim & Nhạc nền lãng mạn
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initHeartMorphCanvas();
  initPhoto3DInteraction();
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
  const numStars = Math.min(130, Math.floor((width * height) / 8000));

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
    if (Math.random() < 0.02 && meteors.length < 2) {
      meteors.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.4),
        len: Math.random() * 80 + 40,
        speed: Math.random() * 6 + 6,
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
   2. HẠT TRÁI TIM HỒNG CHUYỂN ĐỘNG & BIẾN HÓA RA CHỮ "THOA"
   ========================================================================= */
let toggleParticleShapeGlobal = null;

function initHeartMorphCanvas() {
  const canvas = document.getElementById('heart-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const NUM_PARTICLES = window.innerWidth < 768 ? 500 : 750;
  const particles = [];
  let currentTargetMode = 'heart'; // 'heart' hoặc 'thoa'
  let heartTargets = [];
  let thoaTargets = [];

  // Tạo điểm tọa độ Trái Tim
  function generateHeartPoints(count) {
    const points = [];
    const scale = Math.min(width, height) * 0.018; // Kích thước trái tim
    const cx = width / 2;
    const cy = height * 0.38; // Đặt vị trí hài hòa

    for (let i = 0; i < count; i++) {
      // Công thức trái tim
      const t = Math.PI * 2 * (i / count);
      // Phương trình tham số hình trái tim
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      // Thêm một chút độ dày bên trong lòng trái tim
      const fillFactor = Math.sqrt(Math.random()) * 0.95 + 0.05;
      points.push({
        x: cx + x * scale * fillFactor,
        y: cy + y * scale * fillFactor,
        originX: x * scale,
        originY: y * scale,
        fillFactor: fillFactor
      });
    }
    return points;
  }

  // Tạo điểm tọa độ chữ "Thoa 💕"
  function generateTextPoints(count) {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 800;
    offCanvas.height = 300;
    const offCtx = offCanvas.getContext('2d');

    const fontSize = width < 768 ? 95 : 130;
    offCtx.font = `bold ${fontSize}px "Dancing Script", "Pacifico", cursive, sans-serif`;
    offCtx.fillStyle = '#ffffff';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText('Thoa 💕', offCanvas.width / 2, offCanvas.height / 2);

    const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    const validPixels = [];
    const step = 4; // Lấy mẫu pixel

    for (let y = 0; y < offCanvas.height; y += step) {
      for (let x = 0; x < offCanvas.width; x += step) {
        const index = (y * offCanvas.width + x) * 4;
        if (imgData.data[index + 3] > 128) {
          validPixels.push({
            x: x - offCanvas.width / 2,
            y: y - offCanvas.height / 2
          });
        }
      }
    }

    const points = [];
    const cx = width / 2;
    const cy = height * 0.38;

    for (let i = 0; i < count; i++) {
      if (validPixels.length > 0) {
        const pixel = validPixels[i % validPixels.length];
        points.push({
          x: cx + pixel.x + (Math.random() - 0.5) * 4,
          y: cy + pixel.y + (Math.random() - 0.5) * 4
        });
      } else {
        points.push({ x: cx, y: cy });
      }
    }
    return points;
  }

  function recomputeTargets() {
    heartTargets = generateHeartPoints(NUM_PARTICLES);
    thoaTargets = generateTextPoints(NUM_PARTICLES);
  }
  recomputeTargets();

  // Khởi tạo các hạt
  const colors = [
    '#ff6b9d', '#ff758c', '#ff8e8e', '#ffb6c1', '#ff9ff3', '#feca57', '#ffffff'
  ];

  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      targetX: heartTargets[i].x,
      targetY: heartTargets[i].y,
      size: Math.random() * 2.6 + 1.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.5,
      pulsePhase: Math.random() * Math.PI * 2,
      index: i
    });
  }

  // Tương tác chuột
  let mouse = { x: -1000, y: -1000, radius: 80 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });
  window.addEventListener('touchend', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Chuyển dáng giữa Trái Tim và Chữ Thoa
  function toggleParticleShape() {
    currentTargetMode = currentTargetMode === 'heart' ? 'thoa' : 'heart';
    const targets = currentTargetMode === 'heart' ? heartTargets : thoaTargets;
    
    // Thêm hiệu ứng bùng nhẹ khi đổi hình
    particles.forEach((p, idx) => {
      p.targetX = targets[idx].x;
      p.targetY = targets[idx].y;
      p.vx += (Math.random() - 0.5) * 8;
      p.vy += (Math.random() - 0.5) * 8;
    });

    const morphBtn = document.getElementById('morph-toggle');
    if (morphBtn) {
      const textSpan = morphBtn.querySelector('.btn-text');
      if (textSpan) {
        textSpan.innerText = currentTargetMode === 'heart' ? 'Xem chữ Thoa' : 'Xem Trái Tim';
      }
    }
  }
  toggleParticleShapeGlobal = toggleParticleShape;

  const morphBtn = document.getElementById('morph-toggle');
  if (morphBtn) {
    morphBtn.addEventListener('click', toggleParticleShape);
  }

  // Tự động chuyển đổi sau mỗi 7.5 giây để luôn sinh động
  let autoMorphInterval = setInterval(toggleParticleShape, 7500);

  // Nhịp đập phập phồng của trái tim (heartbeat)
  let beatTimer = 0;

  function render() {
    ctx.clearRect(0, 0, width, height);

    beatTimer += 0.05;
    // Nhịp đập kiểu thump-thump
    const pulseScale = currentTargetMode === 'heart' 
      ? 1 + Math.pow(Math.sin(beatTimer * 2), 6) * 0.12 + Math.pow(Math.sin(beatTimer * 2 + 0.3), 8) * 0.06
      : 1 + Math.sin(beatTimer * 1.5) * 0.02;

    const cx = width / 2;
    const cy = height * 0.38;

    particles.forEach((p) => {
      // Tính vị trí đích có áp dụng nhịp đập phập phồng
      const dxOrigin = p.targetX - cx;
      const dyOrigin = p.targetY - cy;
      const pulsedTargetX = cx + dxOrigin * pulseScale;
      const pulsedTargetY = cy + dyOrigin * pulseScale;

      // Di chuyển mượt mà về đích (Spring physics)
      const dx = pulsedTargetX - p.x;
      const dy = pulsedTargetY - p.y;
      p.vx = p.vx * 0.88 + dx * 0.035;
      p.vy = p.vy * 0.88 + dy * 0.035;

      // Đẩy khi chuột/ngón tay lại gần
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

      // Vẽ hạt phát sáng
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(render);
  }
  render();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    recomputeTargets();
    const targets = currentTargetMode === 'heart' ? heartTargets : thoaTargets;
    particles.forEach((p, idx) => {
      p.targetX = targets[idx].x;
      p.targetY = targets[idx].y;
    });
  });
}

/* =========================================================================
   3. HIỆU ỨNG CHUYỂN ĐỘNG & 3D TILT CHO ẢNH THOA
   ========================================================================= */
function initPhoto3DInteraction() {
  const wrapper = document.getElementById('cardWrapper');
  const card = document.getElementById('card3d');
  if (!wrapper || !card) return;

  // Hiệu ứng tương tác 3D tilt theo con trỏ chuột
  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 14;
    const rotY = (x / (rect.width / 2)) * 14;

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03, 1.03, 1.03)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });

  // Khi click vào khung ảnh của Thoa: Bắn tim tung tóe!
  wrapper.addEventListener('click', (e) => {
    createHeartBurst(e.clientX, e.clientY, 16);
    // Nháy hiệu ứng viền ảnh
    card.style.boxShadow = '0 0 60px rgba(255, 107, 157, 0.9)';
    setTimeout(() => {
      card.style.boxShadow = '';
    }, 600);
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
        // Sau khi gõ xong, cho phép con trỏ nhấp nháy thêm một lúc
        setTimeout(() => {
          const cursor = container.querySelector('.typewriter-cursor');
          if (cursor) cursor.remove();
        }, 3000);
      }
    }, 45); // Tốc độ gõ chữ vừa vặn, cảm xúc
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Bắt đầu gõ sau một khoảng delay nhẹ để trang web xuất hiện mượt mà
  setTimeout(startTyping, 800);

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      startTyping();
      createHeartBurst(window.innerWidth / 2, window.innerHeight * 0.7, 12);
    });
  }
}

/* =========================================================================
   5. HIỆU ỨNG TƯƠNG TÁC: BẮN PHÁO HOA TIM & CLICK TẠO TIM
   ========================================================================= */
function createHeartBurst(x, y, count = 10) {
  const emojis = ['💖', '💕', '✨', '🌸', '🥮', '🐇', '💗', '⭐'];
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];

    const xOffset = (Math.random() - 0.5) * 160 + 'px';
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
    fireworksBtn.addEventListener('click', (e) => {
      // Bắn 3 đợt pháo hoa tim liên tiếp
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          const rx = window.innerWidth * (0.2 + Math.random() * 0.6);
          const ry = window.innerHeight * (0.2 + Math.random() * 0.4);
          createHeartBurst(rx, ry, 20);
        }, i * 350);
      }
    });
  }

  // Nhấp chuột bất kỳ trên nền cũng thả tim nhẹ nhàng
  document.addEventListener('click', (e) => {
    // Không bắn nếu bấm trúng button
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    createHeartBurst(e.clientX, e.clientY, 5);
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

  // Web Audio Synth Melody phòng hờ khi trình duyệt chặn link nhạc online
  let synthInterval = null;
  function playSweetTone() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23]; // C, E, G, C5, A, F
      let noteIndex = 0;

      synthInterval = setInterval(() => {
        if (!isPlaying) {
          clearInterval(synthInterval);
          return;
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[noteIndex % notes.length], ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
        noteIndex++;
      }, 700);
    } catch (e) {
      console.log('Audio Context not started yet');
    }
  }

  musicBtn.addEventListener('click', () => {
    if (!isPlaying) {
      audio.volume = 0.5;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlaying = true;
            updateBtnState(true);
          })
          .catch(() => {
            // Nếu nguồn mp3 ngoài bị chặn, chạy giai điệu tự sinh êm ái
            isPlaying = true;
            playSweetTone();
            updateBtnState(true);
          });
      }
    } else {
      audio.pause();
      if (synthInterval) clearInterval(synthInterval);
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

  // Tự động gợi ý phát nhạc khi người dùng tương tác lần đầu
  const playOnce = () => {
    document.removeEventListener('click', playOnce);
    if (!isPlaying) {
      audio.volume = 0.4;
      audio.play().then(() => {
        isPlaying = true;
        updateBtnState(true);
      }).catch(() => {
        // Trình duyệt có thể yêu cầu click đúng nút
      });
    }
  };
  document.addEventListener('click', playOnce, { once: true });
}
