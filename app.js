/* ═══════════════════════════════════════════════════════
   KAAM — Interactive Modal & State Management
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ═══ STATE ═══════════════════════════════════════════
  let currentRole = 'worker'; // 'worker' | 'employer'
  let currentTab = 'signin';  // 'signin' | 'signup'

  // ═══ ELEMENT REFERENCES ══════════════════════════════
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  // Nav buttons that open the modal
  const btnSignin = document.getElementById('btn-signin');
  const btnGetStarted = document.getElementById('btn-get-started');
  const navFindJobs = document.getElementById('nav-find-jobs');
  const navFindWorkers = document.getElementById('nav-find-workers');

  // Hero CTA buttons
  const btnFindJobs = document.getElementById('btn-find-jobs');
  const btnFindWorkers = document.getElementById('btn-find-workers');

  // Modal elements
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');

  // Role toggle
  const roleBtnWorker = document.getElementById('role-btn-worker');
  const roleBtnEmployer = document.getElementById('role-btn-employer');
  const roleToggleSlider = document.getElementById('role-toggle-slider');

  // Tab elements
  const tabSignin = document.getElementById('tab-signin');
  const tabSignup = document.getElementById('tab-signup');
  const formSignin = document.getElementById('form-signin');
  const formSignup = document.getElementById('form-signup');
  const tabIndicator = document.querySelector('.tab-indicator');

  // Form link switchers
  const linkToSignup = document.getElementById('link-to-signup');
  const linkToSignin = document.getElementById('link-to-signin');

  // Role-specific fields
  const workerFields = document.getElementById('worker-fields');
  const employerFields = document.getElementById('employer-fields');

  // Role indicators in forms
  const signinRoleIndicator = document.getElementById('signin-role-indicator');
  const signinRoleLabel = document.getElementById('signin-role-label');
  const signupRoleIndicator = document.getElementById('signup-role-indicator');
  const signupRoleLabel = document.getElementById('signup-role-label');

  // Sign up adaptive labels
  const signupNameLabel = document.getElementById('signup-name-label');
  const signupLocationLabel = document.getElementById('signup-location-label');
  const btnSignupSubmit = document.getElementById('btn-signup-submit');

  // Password toggle
  const togglePasswordSignin = document.getElementById('toggle-password-signin');
  const signinPassword = document.getElementById('signin-password');


  // ═══ NAVBAR SCROLL ═══════════════════════════════════
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  // ═══ HAMBURGER MENU ═════════════════════════════════
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });


  // ═══ MODAL OPEN / CLOSE ═════════════════════════════
  function openModal(role, tab = 'signin') {
    currentRole = role;
    currentTab = tab;
    updateRoleUI();
    switchTab(tab);
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    resetForms();
  }

  function resetForms() {
    // Reset all form inputs
    formSignin.reset();
    formSignup.reset();
    // Reset submit buttons
    const signinBtn = document.getElementById('btn-signin-submit');
    signinBtn.classList.remove('loading', 'success');
    signinBtn.innerHTML = `Log In <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

    const signupBtn = document.getElementById('btn-signup-submit');
    signupBtn.classList.remove('loading', 'success');
    updateSignupButton();
  }

  // ── Button Click → Modal Triggers ──
  // "Find Jobs" buttons → Worker Portal
  btnFindJobs.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('worker', 'signin');
  });

  navFindJobs.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('worker', 'signin');
  });

  // "Find Workers" buttons → Employer Portal
  btnFindWorkers.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('employer', 'signin');
  });

  navFindWorkers.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('employer', 'signin');
  });

  // "Sign In" → Worker Portal (default), Sign In tab
  btnSignin.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('worker', 'signin');
  });

  // "Get Started" → Worker Portal (default), Sign Up tab
  btnGetStarted.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('worker', 'signup');
  });

  // Close modal
  modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });


  // ═══ ROLE SWITCHING ═════════════════════════════════
  function updateRoleUI() {
    // Toggle slider position
    if (currentRole === 'worker') {
      roleBtnWorker.classList.add('active');
      roleBtnEmployer.classList.remove('active');
      roleToggleSlider.classList.remove('employer');

      // Worker role indicators
      signinRoleIndicator.classList.remove('employer');
      signinRoleLabel.textContent = 'Worker Portal';
      signupRoleIndicator.classList.remove('employer');
      signupRoleLabel.textContent = 'Registering as Worker';

      // Show/hide fields
      workerFields.classList.remove('hidden');
      employerFields.classList.add('hidden');

      // Labels
      signupNameLabel.textContent = 'Full Name';
      signupLocationLabel.textContent = 'City / Pincode';
      document.getElementById('signup-name').placeholder = 'Enter your full name';
      document.getElementById('signup-location').placeholder = 'Enter area name or 6-digit pincode';

    } else {
      roleBtnEmployer.classList.add('active');
      roleBtnWorker.classList.remove('active');
      roleToggleSlider.classList.add('employer');

      // Employer role indicators
      signinRoleIndicator.classList.add('employer');
      signinRoleLabel.textContent = 'Employer Portal';
      signupRoleIndicator.classList.add('employer');
      signupRoleLabel.textContent = 'Registering as Employer';

      // Show/hide fields
      workerFields.classList.add('hidden');
      employerFields.classList.remove('hidden');

      // Labels
      signupNameLabel.textContent = 'Full Name / Business Name';
      signupLocationLabel.textContent = 'Location / Site Address';
      document.getElementById('signup-name').placeholder = 'Enter your name or business name';
      document.getElementById('signup-location').placeholder = 'Enter site address or pincode';
    }

    updateSignupButton();
  }

  function updateSignupButton() {
    const label = currentRole === 'worker' ? 'Register as Worker' : 'Register as Employer';
    btnSignupSubmit.innerHTML = `${label} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  }

  roleBtnWorker.addEventListener('click', () => {
    if (currentRole !== 'worker') {
      currentRole = 'worker';
      updateRoleUI();
    }
  });

  roleBtnEmployer.addEventListener('click', () => {
    if (currentRole !== 'employer') {
      currentRole = 'employer';
      updateRoleUI();
    }
  });


  // ═══ TAB SWITCHING ═══════════════════════════════════
  function switchTab(tab) {
    currentTab = tab;
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


  // ═══ PASSWORD TOGGLE ════════════════════════════════
  togglePasswordSignin.addEventListener('click', () => {
    const isPassword = signinPassword.type === 'password';
    signinPassword.type = isPassword ? 'text' : 'password';
    togglePasswordSignin.innerHTML = isPassword
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  });


  // ═══ FORM SUBMISSIONS ═══════════════════════════════
  // Spinner SVG for loading states
  const spinnerSVG = `<svg class="spinner" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></circle></svg>`;

  // Sign In form
  formSignin.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-signin-submit');
    btn.classList.add('loading');
    btn.innerHTML = `${spinnerSVG} Logging In...`;

    setTimeout(() => {
      btn.classList.remove('loading');
      btn.classList.add('success');
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg> Welcome back!`;
      btn.style.background = 'linear-gradient(135deg, #059669, #10B981)';

      setTimeout(() => {
        btn.classList.remove('success');
        btn.innerHTML = `Log In <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        btn.style.background = '';
      }, 2500);
    }, 1800);
  });

  // Sign Up form
  formSignup.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-signup-submit');
    btn.classList.add('loading');
    btn.innerHTML = `${spinnerSVG} Sending OTP...`;

    setTimeout(() => {
      btn.classList.remove('loading');
      btn.classList.add('success');
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg> OTP Sent! Check your phone`;
      btn.style.background = 'linear-gradient(135deg, #059669, #10B981)';

      setTimeout(() => {
        btn.classList.remove('success');
        updateSignupButton();
        btn.style.background = '';
      }, 2500);
    }, 1800);
  });


  // ═══ OTP LOGIN & FORGOT PASSWORD (Placeholder) ═════
  const btnForgotPassword = document.getElementById('btn-forgot-password');
  const btnOtpLogin = document.getElementById('btn-otp-login');

  btnForgotPassword.addEventListener('click', () => {
    // Could open a sub-flow; for now, provide feedback
    btnForgotPassword.textContent = 'OTP sent to your number!';
    btnForgotPassword.style.color = '#10B981';
    setTimeout(() => {
      btnForgotPassword.textContent = 'Forgot Password?';
      btnForgotPassword.style.color = '';
    }, 2000);
  });

  btnOtpLogin.addEventListener('click', () => {
    btnOtpLogin.textContent = 'OTP sent! Enter it as PIN above';
    btnOtpLogin.style.color = '#10B981';
    setTimeout(() => {
      btnOtpLogin.textContent = 'Log in with OTP instead';
      btnOtpLogin.style.color = '';
    }, 2000);
  });

});
