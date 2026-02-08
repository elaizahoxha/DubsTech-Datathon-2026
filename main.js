/* TYPEWRITER */
const words = [
    "Where unhealthy air is most concentrated in the U.S.",
    "How air quality differs across regions and counties.",
    "What PM2.5, ozone, and NO₂ exposure look like nationwide."
  ];
  
  const text = document.getElementById("type-text");
  let i = 0, j = 0, deleting = false;
  
  function loop() {
    const word = words[i];
  
    text.textContent = deleting
      ? word.slice(0, --j)
      : word.slice(0, ++j);
  
    if (!deleting && j === word.length) {
      setTimeout(() => (deleting = true), 1400);
    }
    if (deleting && j === 0) {
      deleting = false;
      i = (i + 1) % words.length;
    }
  
    setTimeout(loop, deleting ? 40 : 70);
  }
  loop();
  
  /* HERO “CLEAR THE HAZE” INTERACTION */
  const hero = document.querySelector(".hero");
  const clearTrigger = document.querySelector(".clear-trigger");
  
  clearTrigger.addEventListener("mouseenter", () => {
    hero.classList.add("is-cleared");
  });
  
  clearTrigger.addEventListener("mouseleave", () => {
    hero.classList.remove("is-cleared");
  });
  
  /* PARTICLES (glowy, faster, more alive) */
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  
  let w, h, dpr;
  
  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  
  resize();
  window.addEventListener("resize", resize);
  
  const rand = (min, max) => Math.random() * (max - min) + min;
  
  const particleCount = 150;
  const particles = Array.from({ length: particleCount }, () => ({
    x: rand(0, window.innerWidth),
    y: rand(0, window.innerHeight),
    r: rand(0.8, 2.4),
    dx: rand(-0.55, 0.85),
    dy: rand(-0.35, 0.65),
    a: rand(0.08, 0.28)
  }));
  
  function wrap(p) {
    const pad = 40;
    if (p.x < -pad) p.x = window.innerWidth + pad;
    if (p.x > window.innerWidth + pad) p.x = -pad;
    if (p.y < -pad) p.y = window.innerHeight + pad;
    if (p.y > window.innerHeight + pad) p.y = -pad;
  }
  
  function drawConnections() {
    // Soft “wisps” between close particles
    const maxDist = 95;
    ctx.lineWidth = 1;
  
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const p1 = particles[a];
        const p2 = particles[b];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
  
        if (dist < maxDist) {
          const t = 1 - dist / maxDist;
          ctx.globalAlpha = 0.08 * t;
  
          // teal-ish wisp
          ctx.strokeStyle = "rgba(94,242,194,0.55)";
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  
    // Slight additive glow
    ctx.globalCompositeOperation = "lighter";
  
    // Connections first (subtle)
    drawConnections();
  
    // Particles
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      wrap(p);
  
      // Glow
      ctx.shadowBlur = 18;
      ctx.shadowColor = "rgba(94,242,194,0.45)";
  
      ctx.globalAlpha = p.a;
  
      ctx.fillStyle = "rgba(94,242,194,0.65)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
  
      // Tiny highlight
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(122,167,255,0.35)";
      ctx.globalAlpha = Math.min(0.22, p.a + 0.08);
      ctx.fillStyle = "rgba(122,167,255,0.55)";
      ctx.beginPath();
      ctx.arc(p.x + 0.8, p.y - 0.6, Math.max(0.6, p.r - 1.1), 0, Math.PI * 2);
      ctx.fill();
    });
  
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = "source-over";
  
    requestAnimationFrame(animate);
  }
  
  animate();