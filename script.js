/**
 * GIFT FOR THOA - MÓN QUÀ TRUNG THU NGỌT NGÀO
 * Khắc phục hoàn toàn:
 * 1. Chữ Thoa trên Mobile hiển thị sắc nét, không bị co cụm thành 1 đốm
 * 2. Header trên Mobile thoáng đãng, không bị mặt trăng / lồng đèn / nút nhạc che chữ
 * 3. Hỗ trợ font loading & fallback vector an toàn trên mọi thiết bị di động
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
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
