/* =========================================================
   MATTEUS OLIVEIRA DE MELO — PORTFOLIO
   script.js
   ========================================================= */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. PRELOADER ---------- */
  (function preloader() {
    const preloaderEl = document.getElementById('preloader');
    const progressEl = document.getElementById('preloaderProgress');
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 18;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          preloaderEl.classList.add('loaded');
          document.body.style.overflow = '';
          initAfterLoad();
        }, 300);
      }
      progressEl.style.width = progress + '%';
    }, 150);

    document.body.style.overflow = 'hidden';
  })();

  /* ---------- 2. CUSTOM CURSOR ---------- */
  (function customCursor() {
    const dot = document.getElementById('cursorDot');
    const outline = document.getElementById('cursorOutline');
    if (!dot || !outline || window.matchMedia('(max-width: 900px)').matches) return;

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateOutline() {
      outlineX += (mouseX - outlineX) * 0.18;
      outlineY += (mouseY - outlineY) * 0.18;
      outline.style.left = outlineX + 'px';
      outline.style.top = outlineY + 'px';
      requestAnimationFrame(animateOutline);
    }
    animateOutline();

    const hoverTargets = 'a, button, input, textarea, [data-tilt]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) outline.classList.add('hovered');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) outline.classList.remove('hovered');
    });

    document.addEventListener('mouseleave', () => { dot.classList.add('hidden'); outline.classList.add('hidden'); });
    document.addEventListener('mouseenter', () => { dot.classList.remove('hidden'); outline.classList.remove('hidden'); });
  })();

  /* ---------- 3. PARTICLES BACKGROUND ---------- */
  (function particles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 18000));

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.radius = Math.random() * 1.6 + 0.4;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 224, 255, 0.5)';
        ctx.fill();
      }
    }

    for (let i = 0; i < count; i++) particlesArray.push(new Particle());

    function connect() {
      const maxDist = 130;
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 224, 255, ${0.12 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach(p => { p.update(); p.draw(); });
      connect();
      requestAnimationFrame(animate);
    }

    if (!reduceMotion) animate();
  })();

  /* ---------- 4. NAVBAR: scroll state, mobile toggle, scrollspy ---------- */
  (function navbar() {
    const navbarEl = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section[id]');

    window.addEventListener('scroll', () => {
      navbarEl.classList.toggle('scrolled', window.scrollY > 40);
    });

    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    links.forEach(link => link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }));

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach(link => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => spyObserver.observe(section));
  })();

  /* ---------- 5. SMOOTH ANCHOR SCROLL WITH OFFSET ---------- */
  (function smoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId.length <= 1) return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  })();

  /* ---------- 6. SCROLL PROGRESS BAR ---------- */
  (function scrollProgress() {
    const bar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    });
  })();

  /* ---------- 7. BACK TO TOP ---------- */
  (function backToTop() {
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  })();

  /* ---------- 8. HERO PHOTO FALLBACK ---------- */
  (function heroPhotoFallback() {
    const img = document.getElementById('heroPhoto');
    if (!img) return;
    img.addEventListener('error', () => { img.style.display = 'none'; });
  })();

  /* ---------- 9. TYPING EFFECT ---------- */
  (function typingEffect() {
    const el = document.getElementById('typingText');
    if (!el) return;
    const phrases = ['Analista de Data Center', 'Infraestrutura de Redes', 'Desenvolvedor Web', 'Suporte Técnico'];
    let phraseIndex = 0, charIndex = 0, deleting = false;

    function tick() {
      const current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          return setTimeout(tick, 1800);
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 40 : 85);
    }
    tick();
  })();

  /* ---------- 10. SCROLL REVEAL ---------- */
  (function scrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('active'), i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  })();

  /* ---------- 11. PARALLAX ORBS ---------- */
  (function parallax() {
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (!parallaxEls.length) return;

    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX - window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2);
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax);
        el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax);
        el.style.marginTop = (scrollY * speed * 0.4) + 'px';
      });
    });
  })();

  /* ---------- 12. HOVER 3D TILT ---------- */
  (function tilt3D() {
    const tiltEls = document.querySelectorAll('[data-tilt]');
    if (window.matchMedia('(max-width: 900px)').matches) return;

    tiltEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        el.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  })();

  /* ---------- 13. ANIMATED COUNTERS ---------- */
  (function counters() {
    const counterEls = document.querySelectorAll('.stat-number');
    if (!counterEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const startTime = performance.now();

        function update(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => observer.observe(el));
  })();

  /* ---------- 14. ANIMATED SKILL BARS ---------- */
  (function skillBars() {
    const bars = document.querySelectorAll('.skill-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 100);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    bars.forEach(bar => observer.observe(bar));
  })();

  /* ---------- 15. CONTACT FORM (client-side) ---------- */
  (function contactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        feedback.style.color = '#ff6b6b';
        feedback.textContent = 'Por favor, preencha todos os campos obrigatórios.';
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const submitText = document.getElementById('submitText');
      const originalHTML = submitText.innerHTML;

      submitText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
      submitBtn.disabled = true;

      setTimeout(() => {
        feedback.style.color = '#00e0ff';
        feedback.textContent = `Obrigado, ${name.split(' ')[0]}! Sua mensagem foi registrada. Em breve entrarei em contato.`;
        submitText.innerHTML = originalHTML;
        submitBtn.disabled = false;
        form.reset();
      }, 1200);

      /* NOTA: este formulário é apenas front-end. Para envio real de e-mails,
         integre com um serviço como Formspree, EmailJS ou um back-end próprio. */
    });
  })();

  /* ---------- 16. Runs once preloader finishes ---------- */
  function initAfterLoad() {
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('active'));
  }

});

