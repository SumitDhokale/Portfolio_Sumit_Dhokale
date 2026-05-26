/* ============================================================
   SUMIT AJAY DHOKALE — PORTFOLIO JAVASCRIPT
   Features: Loader, Cursor, Particles, Typed Text, Scroll
   Reveal, Nav, Project Filter, Counter, Form, Tilt, Back-to-Top
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────
   1. LOADER
───────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  // Hide loader after 2s (gives progress bar time to fill)
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
      // Trigger initial reveal animations once loaded
      revealOnScroll();
    }, 2000);
  });
  // Prevent scroll during load
  document.body.style.overflow = 'hidden';
})();


/* ─────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  // Move dot instantly
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Smooth ring lag
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Enlarge ring on interactive elements
  const hoverTargets = 'a, button, [data-tilt], .filter-btn, .skill-tag, .project-btn';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) ring.classList.add('hovering');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) ring.classList.remove('hovering');
  });
})();


/* ─────────────────────────────────────────
   3. PARTICLE CANVAS
───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT  = 70;
  const COLOR  = '0, 245, 255';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particle class
  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x     = Math.random() * W;
      this.y     = init ? Math.random() * H : H + 10;
      this.size  = Math.random() * 1.5 + 0.3;
      this.speedY= Math.random() * 0.4 + 0.1;
      this.speedX= (Math.random() - 0.5) * 0.2;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.pulse += 0.02;
      if (this.y < -10) this.reset();
    }
    draw() {
      const a = this.alpha + Math.sin(this.pulse) * 0.15;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR}, ${Math.max(0, a)})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${COLOR}, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ─────────────────────────────────────────
   4. TYPED TEXT ANIMATION
───────────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById('typed-role');
  if (!el) return;

  const roles = [
    'Computer Science Engineer',
    'Cloud & AI Enthusiast',
    'Machine Learning Developer',
    'Full Stack Learner'
  ];

  let roleIdx = 0, charIdx = 0, deleting = false, paused = false;

  function tick() {
    const current = roles[roleIdx];

    if (!deleting && !paused) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; }, 2200);
        return;
      }
    } else if (deleting && !paused) {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
      }
    }

    const delay = deleting ? 55 : 90;
    setTimeout(tick, delay);
  }
  tick();
})();


/* ─────────────────────────────────────────
   5. NAVBAR: SCROLL STATE + ACTIVE LINK
───────────────────────────────────────── */
(function initNavbar() {
  const nav   = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled state
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    // Active link
    let current = '';
    sections.forEach(s => {
      const top    = s.offsetTop - 120;
      const bottom = top + s.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) current = s.id;
    });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ─────────────────────────────────────────
   6. HAMBURGER MENU
───────────────────────────────────────── */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });
  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();


/* ─────────────────────────────────────────
   7. SCROLL REVEAL
───────────────────────────────────────── */
function revealOnScroll() {
  const items = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  items.forEach(el => observer.observe(el));
}
// Also call directly on DOMContentLoaded in case loader fires late
document.addEventListener('DOMContentLoaded', revealOnScroll);


/* ─────────────────────────────────────────
   8. ANIMATED COUNTERS
───────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.ach-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      observer.unobserve(e.target);
      const el      = e.target;
      const target  = parseFloat(el.dataset.count);
      const decimal = el.dataset.decimal || '';   // e.g. ".09" for CGPA
      const suffix  = '';
      const duration= 1800;
      const start   = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quart
        const eased    = 1 - Math.pow(1 - progress, 4);
        const val      = eased * target;

        if (decimal) {
          el.textContent = Math.floor(val) + (progress === 1 ? decimal : '');
        } else {
          el.textContent = Math.round(val);
        }

        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* ─────────────────────────────────────────
   9. ABOUT SECTION STAT COUNTERS
───────────────────────────────────────── */
(function initAboutStats() {
  const stats = document.querySelectorAll('.stat-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      observer.unobserve(e.target);
      const el     = e.target;
      const num    = el.querySelector('.stat-number');
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur    = 1600;
      const start  = performance.now();

      function update(now) {
        const t = Math.min((now - start) / dur, 1);
        const v = 1 - Math.pow(1 - t, 4);
        const val = v * target;

        if (Number.isInteger(target)) {
          num.textContent = Math.round(val) + suffix;
        } else {
          num.textContent = val.toFixed(2) + suffix;
        }
        if (t < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }, { threshold: 0.5 });
  stats.forEach(s => observer.observe(s));
})();


/* ─────────────────────────────────────────
   10. PROJECT FILTER
───────────────────────────────────────── */
(function initFilter() {
  const buttons  = document.querySelectorAll('.filter-btn');
  const cards    = document.querySelectorAll('.project-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const cats = card.dataset.category || '';
        if (filter === 'all' || cats.includes(filter)) {
          card.classList.remove('hidden');
          // Re-animate
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();


/* ─────────────────────────────────────────
   11. CARD TILT EFFECT
───────────────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll(
    '.project-card, .exp-card, .timeline-card, .skill-category-card'
  );

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -6;
      const tiltY  = dx *  6;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ─────────────────────────────────────────
   12. CONTACT FORM (mailto fallback)
───────────────────────────────────────── */
(function initForm() {
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim() || 'Portfolio Contact';
    const message = form.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      note.style.color = '#ff6b6b';
      note.textContent = 'Please fill in all required fields.';
      return;
    }

    // Open mailto (works offline, no backend needed)
    const body = `Name: ${name}%0AEmail: ${email}%0A%0A${message}`;
    window.open(
      `mailto:dhokalesumit0110@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`
    );

    note.style.color = 'var(--accent-cyan)';
    note.textContent = '✓ Message ready — your mail client should open.';
    form.reset();
    setTimeout(() => { note.textContent = ''; }, 6000);
  });
})();


/* ─────────────────────────────────────────
   13. BACK TO TOP
───────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ─────────────────────────────────────────
   14. HERO PARALLAX (subtle mouse parallax)
───────────────────────────────────────── */
(function initHeroParallax() {
  const imgWrap = document.querySelector('.hero-image-wrap');
  const heroContent = document.querySelector('.hero-content');
  if (!imgWrap) return;

  let rafId;
  document.addEventListener('mousemove', (e) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      imgWrap.style.transform = `translate(${dx * 12}px, ${dy * 8}px)`;
      if (heroContent) {
        heroContent.style.transform = `translate(${dx * -5}px, ${dy * -3}px)`;
      }
    });
  });
})();


/* ─────────────────────────────────────────
   15. SMOOTH ANCHOR SCROLL (enhanced)
───────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─────────────────────────────────────────
   16. SKILL TAG STAGGER ANIMATION
───────────────────────────────────────── */
(function initSkillStagger() {
  const cards = document.querySelectorAll('.skill-category-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const tags = e.target.querySelectorAll('.skill-tag');
      tags.forEach((tag, i) => {
        setTimeout(() => {
          tag.style.opacity = '1';
          tag.style.transform = 'translateY(0)';
        }, i * 60);
      });
      observer.unobserve(e.target);
    });
  }, { threshold: 0.3 });

  // Set initial hidden state
  cards.forEach(card => {
    card.querySelectorAll('.skill-tag').forEach(tag => {
      tag.style.opacity = '0';
      tag.style.transform = 'translateY(10px)';
      tag.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    });
    observer.observe(card);
  });
})();


/* ─────────────────────────────────────────
   17. SECTION TITLE HIGHLIGHT EFFECT
───────────────────────────────────────── */
(function initTitleEffect() {
  const titles = document.querySelectorAll('.section-title');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.backgroundImage =
          'linear-gradient(135deg, #f0f0ff 0%, #a0a0ff 100%)';
        e.target.style.webkitBackgroundClip = 'text';
        e.target.style.webkitTextFillColor  = 'transparent';
        e.target.style.backgroundClip = 'text';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  titles.forEach(t => observer.observe(t));
})();
