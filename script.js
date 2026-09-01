const canvas = document.getElementById('bg');

if (canvas) {
  const ctx = canvas.getContext('2d');
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const word = 'SKILLSTRACK';
  let particles = [];
  let targets = [];
  let scatterMode = true;
  let lastToggle = 0;

  function setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildTargets();
    buildParticles();
  }

  function buildTargets() {
    const size = Math.min(window.innerWidth * 0.08, 110);
    ctx.font = `700 ${size}px Jaro, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const metrics = ctx.measureText(word);
    const spacing = metrics.width / (word.length - 1 || 1);
    const centerX = window.innerWidth / 2;
    const startY = window.innerHeight * 0.52;

    targets = Array.from(word).map((char, index) => ({
      char,
      x: centerX + (index - (word.length - 1) / 2) * spacing,
      y: startY,
    }));
  }

  function buildParticles() {
    const count = Math.max(180, Math.min(420, Math.floor(window.innerWidth / 4)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1.8,
      vy: (Math.random() - 0.5) * 1.8,
      char: letters[Math.floor(Math.random() * letters.length)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const fontSize = Math.min(window.innerWidth * 0.03, 24);
    ctx.font = `600 ${fontSize}px monospace`;

    particles.forEach((particle, index) => {
      const target = targets[index % targets.length];

      if (scatterMode) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

        if (Math.random() < 0.08) {
          particle.char = letters[Math.floor(Math.random() * letters.length)];
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(particle.char, particle.x, particle.y);
      } else {
        particle.x += (target.x - particle.x) * 0.05;
        particle.y += (target.y - particle.y) * 0.05;
        particle.char = target.char;

        ctx.fillStyle = 'rgba(107, 202, 255, 0.95)';
        ctx.fillText(particle.char, particle.x, particle.y);
      }
    });
  }

  function animate(timestamp) {
    if (timestamp - lastToggle > 5000) {
      scatterMode = !scatterMode;
      lastToggle = timestamp;
    }

    draw();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    setupCanvas();
  });

  setupCanvas();
  requestAnimationFrame(animate);
}

