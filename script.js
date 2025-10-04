(function () {
  const stage = document.getElementById('stage');

  const COLORS = ['#FF5A7A','#FF6B99','#FF8AB8','#E83E8C','#FF2D55','#FF7A00','#FF4D6D'];

  function createHeartSVG(color) {
    return `
      <svg viewBox="0 0 32 29" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" d="M23.6 0C21.2 0 19.1 1.3 17.9 3.1 16.7 1.3 14.6 0 12.2 0 7.4 0 4 4.1 4 8.8c0 6.1 11.8 12.7 12 12.8.2.1.4.1.6 0 .2-.1 12-6.7 12-12.8C28 4.1 24.6 0 19.8 0z"/>
      </svg>`;
  }

  function spawnHeart(x, y, options = {}) {
    const heart = document.createElement('div');
    heart.className = 'heart';

    const size = (options.size ?? (28 + Math.random() * 28)).toFixed(1) + 'px';
    heart.style.setProperty('--size', size);

    const rot = (Math.random() * 60 - 30).toFixed(1) + 'deg';
    heart.style.setProperty('--rot', rot);

    const duration = (1200 + Math.random() * 1400) | 0;
    heart.style.setProperty('--duration', duration + 'ms');
    heart.style.setProperty('--pop-duration', Math.max(140, Math.min(360, duration * 0.18)) + 'ms');

    const color = options.color ?? COLORS[(Math.random()*COLORS.length)|0];
    heart.innerHTML = createHeartSVG(color);

    const rect = stage.getBoundingClientRect();
    const left = x - rect.left;
    const top  = y - rect.top;
    heart.style.left = left + 'px';
    heart.style.top  = top + 'px';
    heart.style.transform = 'translate(-50%, -50%)';

    stage.appendChild(heart);

    heart.addEventListener('animationend', (e) => {
      if (e.animationName === 'floatUp') heart.remove();
    }, { once: true });
  }

  function handlePointer(e) {
    let clientX, clientY;
    if (e.touches && e.touches.length) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const burst = 5 + (Math.random()*4|0);
    for (let i=0;i<burst;i++){
      const jitterX = (Math.random()*40 - 20);
      const jitterY = (Math.random()*24 - 12);
      setTimeout(()=> {
        spawnHeart(clientX + jitterX, clientY + jitterY);
      }, i * 40);
    }
  }

  stage.addEventListener('click', handlePointer);
  stage.addEventListener('touchstart', handlePointer, {passive:true});

  window.addEventListener('keydown', (ev) => {
    if (ev.code === 'Space') {
      const rect = stage.getBoundingClientRect();
      spawnHeart(rect.left + rect.width/2, rect.top + rect.height/2);
      ev.preventDefault();
    }
  });
})();
