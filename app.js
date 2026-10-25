/* ═══════════════════════════════════════════════════════
   SkillLink — Interactive Logic
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Element References ──────────────────────────────
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const langBtn = document.getElementById('lang-btn');
  const langDropdown = document.getElementById('lang-dropdown');
  const langOptions = document.querySelectorAll('.lang-option');

  const btnFindWork = document.getElementById('btn-find-work');
  const btnHireWorkers = document.getElementById('btn-hire-workers');

  const modalOverlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const modalRoleBadge = document.getElementById('modal-role-badge');
  const modalRoleText = document.getElementById('modal-role-text');
  const roleIcon = document.getElementById('role-icon');
  const roleSwitchBtn = document.getElementById('role-switch-btn');
  const roleSwitchLabel = document.getElementById('role-switch-label');

  const tabSignin = document.getElementById('tab-signin');
  const tabSignup = document.getElementById('tab-signup');
  const formSignin = document.getElementById('form-signin');
  const formSignup = document.getElementById('form-signup');
  const tabIndicator = document.querySelector('.tab-indicator');

  const linkToSignup = document.getElementById('link-to-signup');
  const linkToSignin = document.getElementById('link-to-signin');

  const fieldWorkerSkill = document.getElementById('field-worker-skill');
  const fieldEmployerType = document.getElementById('field-employer-type');

  const togglePasswordSignin = document.getElementById('toggle-password-signin');
  const signinPassword = document.getElementById('signin-password');

  const hiwToggleWorker = document.getElementById('hiw-toggle-worker');
  const hiwToggleEmployer = document.getElementById('hiw-toggle-employer');
  const hiwStepsWorker = document.getElementById('hiw-steps-worker');
  const hiwStepsEmployer = document.getElementById('hiw-steps-employer');
  const hiwToggle = document.getElementById('hiw-toggle');

  let currentRole = 'worker'; // 'worker' | 'employer'

  // ── Navbar Scroll ───────────────────────────────────
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = window.scrollY;
  });

  // ── Hamburger Menu ─────────────────────────────────
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ── Language Selector ───────────────────────────────
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle('open');
  });

  langOptions.forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.dataset.lang;
      langBtn.querySelector('span').textContent = lang;
      langOptions.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      langDropdown.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
      langDropdown.classList.remove('open');
    }
  });

  // ── Modal Open / Close ──────────────────────────────
  function openModal(role) {
    currentRole = role;
    updateRoleUI();
    switchTab('signin');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  btnFindWork.addEventListener('click', () => openModal('worker'));
  btnHireWorkers.addEventListener('click', () => openModal('employer'));
  modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // ── Role Switching ──────────────────────────────────
  function updateRoleUI() {
    if (currentRole === 'worker') {
      modalRoleBadge.className = 'modal-role-badge worker';
      modalRoleText.textContent = 'Worker Portal';
      roleSwitchLabel.textContent = 'Employer';
      roleIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7h-9M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>`;
      fieldWorkerSkill.classList.remove('hidden');
      fieldEmployerType.classList.add('hidden');
    } else {
      modalRoleBadge.className = 'modal-role-badge employer';
      modalRoleText.textContent = 'Employer Portal';
      roleSwitchLabel.textContent = 'Worker';
      roleIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
      fieldWorkerSkill.classList.add('hidden');
      fieldEmployerType.classList.remove('hidden');
    }
  }

  roleSwitchBtn.addEventListener('click', () => {
    currentRole = currentRole === 'worker' ? 'employer' : 'worker';
    updateRoleUI();
  });

  // ── Tab Switching ───────────────────────────────────
  function switchTab(tab) {
    if (tab === 'signin') {
      tabSignin.classList.add('active');
      tabSignup.classList.remove('active');
      formSignin.classList.remove('hidden');
      formSignup.classList.add('hidden');
      tabIndicator.style.left = '4px';
    } else {
      tabSignup.classList.add('active');
      tabSignin.classList.remove('active');
      formSignup.classList.remove('hidden');
      formSignin.classList.add('hidden');
      tabIndicator.style.left = '50%';
    }
  }

  tabSignin.addEventListener('click', () => switchTab('signin'));
  tabSignup.addEventListener('click', () => switchTab('signup'));
  linkToSignup.addEventListener('click', () => switchTab('signup'));
  linkToSignin.addEventListener('click', () => switchTab('signin'));

  // ── Password Toggle ─────────────────────────────────
  togglePasswordSignin.addEventListener('click', () => {
    const isPassword = signinPassword.type === 'password';
    signinPassword.type = isPassword ? 'text' : 'password';
    togglePasswordSignin.innerHTML = isPassword
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  });

  // ── Form Submission Prevention ──────────────────────
  formSignin.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-signin-submit');
    btn.innerHTML = `<svg class="spinner" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></circle></svg> Signing In...`;
    setTimeout(() => {
      btn.innerHTML = `Sign In <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    }, 2000);
  });

  formSignup.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-signup-submit');
    btn.innerHTML = `<svg class="spinner" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></circle></svg> Sending OTP...`;
    setTimeout(() => {
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg> OTP Sent! Check your phone`;
      btn.style.background = 'linear-gradient(135deg, #059669, #10B981)';
      setTimeout(() => {
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07"/><path d="M3.59 1.59l2 2M1 5l3.59-3.41"/><path d="M14 2a7 7 0 0 1 7 7"/><path d="M14 6a3 3 0 0 1 3 3"/></svg> Send OTP & Register`;
        btn.style.background = '';
      }, 2500);
    }, 2000);
  });

  // ── How It Works Toggle ─────────────────────────────
  hiwToggleWorker.addEventListener('click', () => {
    hiwToggleWorker.classList.add('active');
    hiwToggleEmployer.classList.remove('active');
    hiwStepsWorker.classList.remove('hidden');
    hiwStepsEmployer.classList.add('hidden');
    hiwToggle.dataset.active = 'worker';
  });

  hiwToggleEmployer.addEventListener('click', () => {
    hiwToggleEmployer.classList.add('active');
    hiwToggleWorker.classList.remove('active');
    hiwStepsEmployer.classList.remove('hidden');
    hiwStepsWorker.classList.add('hidden');
    hiwToggle.dataset.active = 'employer';
  });

  // ── Stats Counter Animation ─────────────────────────
  function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart

      const current = Math.floor(eased * target);
      element.textContent = current.toLocaleString('en-IN');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString('en-IN');
      }
    }

    requestAnimationFrame(update);
  }

  // ── Scroll Reveal & Counter Trigger ─────────────────
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  let statsAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger stats animation
        if (entry.target.closest('.stats') && !statsAnimated) {
          statsAnimated = true;
          document.querySelectorAll('.stat-number[data-target]').forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            animateCounter(el, target);
          });
        }
      }
    });
  }, observerOptions);

  // Observe sections
  document.querySelectorAll('.stat-card, .cat-card, .hiw-step, .trust-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // Also observe the stats section itself
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    statsSection.classList.add('reveal');
    observer.observe(statsSection);
  }

  // ── Smooth scroll for nav links ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});
