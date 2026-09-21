// SKILLSTRACK inline animation targeted at #word-canvas
(function(){
  const c = document.getElementById('word-canvas');
  if (!c) return;
  const x = c.getContext('2d');

  const text = "SKILLSTRACK";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function resize(){
    const rect = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));
    c.width = w; c.height = h;
    c.style.width = rect.width + 'px';
    c.style.height = rect.height + 'px';
    x.setTransform(dpr,0,0,dpr,0,0);
    targs = targets();
    initParts();
  }
  addEventListener('resize', resize);
  resize();


  function targets(){
    const dpr = window.devicePixelRatio || 1;
    const lw = c.width / dpr;
    const lh = c.height / dpr;
    const s = Math.min(220, Math.max(60, Math.floor(lw / 8)));
    x.font = `bold ${s}px Arial`;
    // use fixed letter spacing for the big-styled word
    const ls = Math.floor(s * 0.75);
    const totalW = ls * text.length;
    const off = (lw - totalW) / 2;
    const arr = [];
    for(let i=0;i<text.length;i++) arr.push({ ch: text[i], tx: off + i * ls, ty: lh / 2 });
    return arr;
  }

  let targs = targets();

  let parts = [];
  function initParts(){
    const dpr = window.devicePixelRatio || 1;
    const lw = c.width / dpr, lh = c.height / dpr;
    parts = [];
    for(let i=0;i<350;i++) parts.push({ x: Math.random()*lw, y: Math.random()*lh, vx: (Math.random()-.5), vy: (Math.random()-.5), ch: letters[(Math.random()*26)|0] });
  }
  initParts();

  let phase = 0, last = 0;
  function draw(ts){
    if(!last) last = ts;
    if(ts - last > 5000){ phase = 1 - phase; last = ts; targs = targets(); }

    // clear only the inline canvas so the page background remains visible
    x.clearRect(0,0,c.width,c.height);
    x.font = '20px monospace';
    x.textBaseline = 'middle';

    const dpr = window.devicePixelRatio || 1;
    const lw = c.width / dpr, lh = c.height / dpr;

    parts.forEach((p,i)=>{
      if(phase){
        const t = targs[i % targs.length];
        p.x += (t.tx - p.x) * 0.03;
        p.y += (t.ty - p.y) * 0.03;
        p.ch = t.ch;
        x.fillStyle = 'rgba(24,214,255,0.75)';
      } else {
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0 || p.x > lw) p.vx *= -1;
        if(p.y < 0 || p.y > lh) p.vy *= -1;
        if(Math.random() < 0.02) p.ch = letters[(Math.random()*26)|0];
        x.fillStyle = 'rgba(100,213,255,0.75)';
      }
      x.fillText(p.ch, p.x, p.y);
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);

  // role buttons navigation
  const learnerBtn = document.getElementById('learnerBtn');
  const lecturerBtn = document.getElementById('lecturerBtn');
  if(learnerBtn) learnerBtn.addEventListener('click', ()=> location.href = 'learner-portal.html');
  if(lecturerBtn) lecturerBtn.addEventListener('click', ()=> alert('Lecturer page not created'));

})();
 

// Background canvas animation (bg) — similar particle mash but preserves page background
(function(){
  const c = document.getElementById('bg');
  if(!c) return;
  const x = c.getContext('2d');

  function resize(){
    const rect = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));
    c.width = w; c.height = h;
    c.style.width = rect.width + 'px';
    c.style.height = rect.height + 'px';
    x.setTransform(dpr,0,0,dpr,0,0);
    targs = targets();
    initParts();
  }
  addEventListener('resize', resize);
  resize();

  const text = "SKILLSTRACK", letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function targets(){
    const dpr = window.devicePixelRatio || 1;
    const lw = c.width / dpr, lh = c.height / dpr;
    const s = Math.min(220, Math.max(80, Math.floor(lw / 6)));
    x.font = `bold ${s}px Arial`;
    const ls = Math.floor(s * 0.8);
    const totalW = ls * text.length;
    const off = (lw - totalW) / 2;
    const arr = [];
    for(let i=0;i<text.length;i++) arr.push({ ch: text[i], tx: off + i * ls, ty: lh/2 });
    return arr;
  }

  let targs = targets();
  let parts = [];
  function initParts(){
    const dpr = window.devicePixelRatio || 1;
    const lw = c.width / dpr, lh = c.height / dpr;
    parts = [];
    for(let i=0;i<350;i++) parts.push({ x: Math.random()*lw, y: Math.random()*lh, vx: (Math.random()-.5), vy: (Math.random()-.5), ch: letters[(Math.random()*26)|0] });
  }
  initParts();

  let phase = 0, last = 0;
  function draw(ts){
    if(!last) last = ts;
    if(ts - last > 5000){ phase = 1 - phase; last = ts; targs = targets(); }

    // preserve CSS background: clear instead of painting full-rect
    x.clearRect(0,0,c.width,c.height);
    x.font = '20px monospace';
    x.textBaseline = 'middle';

    const dpr = window.devicePixelRatio || 1;
    const lw = c.width / dpr, lh = c.height / dpr;

    parts.forEach((p,i)=>{
      if(phase){
        const t = targs[i % targs.length];
        p.x += (t.tx - p.x) * 0.03;
        p.y += (t.ty - p.y) * 0.03;
        p.ch = t.ch;
        x.fillStyle = 'rgba(24,214,255,0.75)';
      } else {
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0 || p.x > lw) p.vx *= -1;
        if(p.y < 0 || p.y > lh) p.vy *= -1;
        if(Math.random() < 0.02) p.ch = letters[(Math.random()*26)|0];
        x.fillStyle = 'rgba(100,213,255,0.75)';
      }
      x.fillText(p.ch, p.x, p.y);
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();

