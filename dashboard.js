/* ═══════════════════════════════════════════════════════
   Skill Connect— Dashboard Logic
   Bilingual (EN / HI), Category Cards, Listings Drawer
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════════
  //  APP STATE
  // ═══════════════════════════════════════════════════
  const state = {
    language: 'EN',           // 'EN' | 'HI'
    role: 'worker',       // 'worker' | 'employer'
    location: 'Bengaluru, 560001',
    activeCategory: null,     // category id when drawer is open
    searchQuery: '',
  };

  // ── Detect role from URL param (e.g. dashboard.html?role=employer)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('role') === 'employer') state.role = 'employer';


  // ═══════════════════════════════════════════════════
  //  TRANSLATION DICTIONARY
  // ═══════════════════════════════════════════════════
  const T = {
    EN: {
      brandName: 'Skill Connect',
      brandTagline: 'WORK CONNECTED.',
      locationLabel: state.location,
      sectionTitle: 'Select a Work Category',
      sectionSubtitle: 'Browse verified daily-wage opportunities and skilled professionals near you.',
      searchPlaceholder: 'Search categories…',
      roleBadgeWorker: 'Worker',
      roleBadgeEmployer: 'Employer',
      logout: 'Logout',
      backBtn: '← Back to All Categories',
      emptyState: 'No categories match your search.',
      locModalTitle: 'Edit Location',
      locSaveLabel: 'Save Location',
      locPlaceholder: 'City name or pincode…',
      jobsAvailable: (n) => `${n} Jobs Available`,
      jobsNearYou: (name, n) => `${n} ${n === 1 ? 'job' : 'jobs'} available near you`,
      workersAvailable: (n) => `${n} Workers Available`,
      workersNearYou: (name, n) => `${n} ${n === 1 ? 'worker' : 'workers'} available near you`,
      applyBtn: 'Apply / Call Now',
      hireBtn: 'Hire / Contact',
      distLabel: (km) => `${km} km away`,
      dailyRate: (amt) => `₹${amt}/day`,
      expLabel: (y) => `${y} yrs exp.`,
    },
    HI: {
      brandName: 'स्किल कनेक्ट',
      brandTagline: 'वर्क कनेक्टेड.',
      locationLabel: state.location,
      sectionTitle: 'काम की श्रेणी चुनें',
      sectionSubtitle: 'अपने पास उपलब्ध दैनिक वेतन के काम और कुशल कारीगर खोजें।',
      searchPlaceholder: 'श्रेणी खोजें…',
      roleBadgeWorker: 'मजदूर',
      roleBadgeEmployer: 'नियोक्ता',
      logout: 'लॉग आउट',
      backBtn: '← सभी श्रेणियों पर वापस जाएं',
      emptyState: 'आपकी खोज से कोई श्रेणी मेल नहीं खाती।',
      locModalTitle: 'स्थान बदलें',
      locSaveLabel: 'स्थान सहेजें',
      locPlaceholder: 'शहर का नाम या पिनकोड…',
      jobsAvailable: (n) => `${n} काम उपलब्ध`,
      jobsNearYou: (name, n) => `आपके पास ${n} काम उपलब्ध`,
      workersAvailable: (n) => `${n} कारीगर उपलब्ध`,
      workersNearYou: (name, n) => `आपके पास ${n} कारीगर उपलब्ध`,
      applyBtn: 'अप्लाई करें / अभी कॉल करें',
      hireBtn: 'हायर करें / संपर्क करें',
      distLabel: (km) => `${km} किमी दूर`,
      dailyRate: (amt) => `₹${amt}/दिन`,
      expLabel: (y) => `${y} साल अनुभव`,
    },
  };


  // ═══════════════════════════════════════════════════
  //  CATEGORIES DATA
  // ═══════════════════════════════════════════════════
  const CATEGORIES = [
    {
      id: 'plumber',
      icon: '🔧',
      en: { title: 'Plumber', desc: 'Pipe & tap repairs' },
      hi: { title: 'प्लंबर', desc: 'पाइप और नल की मरम्मत' },
      count: 14,
    },
    {
      id: 'electrician',
      icon: '⚡',
      en: { title: 'Electrician', desc: 'Wiring, fans & switchboards' },
      hi: { title: 'इलेक्ट्रीशियन', desc: 'वायरिंग, पंखे और स्विचबोर्ड' },
      count: 22,
    },
    {
      id: 'carpenter',
      icon: '🪚',
      en: { title: 'Carpenter', desc: 'Furniture & woodwork' },
      hi: { title: 'बढ़ई (कारपेंटर)', desc: 'फर्नीचर और लकड़ी का काम' },
      count: 9,
    },
    {
      id: 'mason',
      icon: '🧱',
      en: { title: 'Mason / Construction', desc: 'Brickwork, plastering & tiling' },
      hi: { title: 'राजमिस्त्री', desc: 'ईंट, प्लास्टर और टाइल का काम' },
      count: 31,
    },
    {
      id: 'painter',
      icon: '🖌️',
      en: { title: 'Painter', desc: 'Wall painting & whitewashing' },
      hi: { title: 'पेंटर', desc: 'दीवार पेंटिंग और सफेदी' },
      count: 11,
    },
    {
      id: 'domestic',
      icon: '🏠',
      en: { title: 'Domestic Help / Cleaner', desc: 'Cleaning & household tasks' },
      hi: { title: 'घरेलू सहायक', desc: 'सफाई और घरेलू काम' },
      count: 27,
    },
    {
      id: 'loader',
      icon: '📦',
      en: { title: 'Loader / Helper', desc: 'Shifting, loading & general labor' },
      hi: { title: 'मजदूर / हेल्पर', desc: 'सामान उठाना, लोडिंग और सामान्य मजदूरी' },
      count: 18,
    },
    {
      id: 'driver',
      icon: '🚗',
      en: { title: 'Driver / Delivery', desc: 'Local transport & commercial driving' },
      hi: { title: 'ड्राइवर', desc: 'स्थानीय परिवहन और कमर्शियल ड्राइविंग' },
      count: 16,
    },
  ];


  // ═══════════════════════════════════════════════════
  //  SAMPLE LISTINGS DATA
  // ═══════════════════════════════════════════════════
  const JOBS = {
    plumber: [
      { id: 'j1', enTitle: 'Bathroom Leakage Fix', hiTitle: 'बाथरूम लीकेज ठीक करना', employer: 'Rahul Sharma', dist: 1.2, wage: 650 },
      { id: 'j2', enTitle: 'New Pipe Installation', hiTitle: 'नई पाइप लगाना', employer: 'Priya Builders', dist: 2.5, wage: 800 },
      { id: 'j3', enTitle: 'Tap Replacement Work', hiTitle: 'नल बदलने का काम', employer: 'Anil Kumar', dist: 0.8, wage: 500 },
    ],
    electrician: [
      { id: 'j1', enTitle: 'Home Rewiring Project', hiTitle: 'घर की रिवायरिंग', employer: 'Sharma Construction', dist: 3.1, wage: 900 },
      { id: 'j2', enTitle: 'Ceiling Fan Installation', hiTitle: 'छत पंखा लगाना', employer: 'Meena Devi', dist: 1.4, wage: 600 },
      { id: 'j3', enTitle: 'Switchboard Repair', hiTitle: 'स्विचबोर्ड मरम्मत', employer: 'Star Enterprises', dist: 0.6, wage: 550 },
    ],
    carpenter: [
      { id: 'j1', enTitle: 'Kitchen Cabinet Fitting', hiTitle: 'किचन कैबिनेट लगाना', employer: 'Kapoor Interiors', dist: 2.0, wage: 1100 },
      { id: 'j2', enTitle: 'Door Frame Repair', hiTitle: 'दरवाजे का फ्रेम ठीक करना', employer: 'Ramesh Gupta', dist: 1.7, wage: 700 },
      { id: 'j3', enTitle: 'Wardrobe Assembly', hiTitle: 'वार्डरोब जोड़ना', employer: 'Deepa Home Decor', dist: 4.2, wage: 850 },
    ],
    mason: [
      { id: 'j1', enTitle: 'Room Extension Work', hiTitle: 'कमरे का विस्तार कार्य', employer: 'BuildRight Co.', dist: 5.0, wage: 1200 },
      { id: 'j2', enTitle: 'Floor Tiling – 3BHK', hiTitle: '3BHK में फर्श टाइलिंग', employer: 'Suresh Developers', dist: 3.3, wage: 1000 },
      { id: 'j3', enTitle: 'Plaster & Finish Work', hiTitle: 'प्लास्टर और फिनिश काम', employer: 'Raja Constructions', dist: 2.1, wage: 900 },
    ],
    painter: [
      { id: 'j1', enTitle: '2BHK Painting (Interior)', hiTitle: '2BHK अंदरूनी पेंटिंग', employer: 'Vikram Singh', dist: 1.9, wage: 800 },
      { id: 'j2', enTitle: 'Exterior Whitewashing', hiTitle: 'बाहरी सफेदी', employer: 'City Homes Pvt Ltd', dist: 3.8, wage: 1000 },
      { id: 'j3', enTitle: 'POP Ceiling Painting', hiTitle: 'POP छत की पेंटिंग', employer: 'Anand Nair', dist: 2.6, wage: 750 },
    ],
    domestic: [
      { id: 'j1', enTitle: 'Daily House Cleaning', hiTitle: 'रोज घर की सफाई', employer: 'Mrs. Lakshmi', dist: 0.4, wage: 450 },
      { id: 'j2', enTitle: 'Utensil Washing + Swab', hiTitle: 'बर्तन और पोंछा', employer: 'Patel Family', dist: 0.9, wage: 500 },
      { id: 'j3', enTitle: 'Full-Day Home Help', hiTitle: 'पूरे दिन का घरेलू काम', employer: 'Sharma Household', dist: 1.1, wage: 600 },
    ],
    loader: [
      { id: 'j1', enTitle: 'Office Shifting Help', hiTitle: 'ऑफिस शिफ्टिंग हेल्पर', employer: 'Quick Movers', dist: 4.5, wage: 700 },
      { id: 'j2', enTitle: 'Warehouse Loading', hiTitle: 'गोदाम लोडिंग', employer: 'ABC Logistics', dist: 6.0, wage: 650 },
      { id: 'j3', enTitle: 'Shop Goods Unloading', hiTitle: 'दुकान में सामान उतारना', employer: 'Ravi Traders', dist: 1.3, wage: 600 },
    ],
    driver: [
      { id: 'j1', enTitle: 'School Van Driver', hiTitle: 'स्कूल वैन ड्राइवर', employer: 'Bright Minds School', dist: 2.2, wage: 1000 },
      { id: 'j2', enTitle: 'Delivery Executive', hiTitle: 'डिलीवरी ड्राइवर', employer: 'FastShip Pvt Ltd', dist: 0.0, wage: 800 },
      { id: 'j3', enTitle: 'Commercial Driver (LCV)', hiTitle: 'कमर्शियल ड्राइवर', employer: 'Sharma Cargo', dist: 7.1, wage: 1200 },
    ],
  };

  const WORKERS = {
    plumber: [
      { id: 'w1', enName: 'Ramesh Kumar', hiName: 'रमेश कुमार', exp: 6, rate: 650, rating: 4.8, initials: 'RK', verified: true },
      { id: 'w2', enName: 'Shankar Yadav', hiName: 'शंकर यादव', exp: 3, rate: 550, rating: 4.3, initials: 'SY', verified: true },
      { id: 'w3', enName: 'Dinesh Patel', hiName: 'दिनेश पटेल', exp: 9, rate: 800, rating: 4.9, initials: 'DP', verified: false },
    ],
    electrician: [
      { id: 'w1', enName: 'Suresh Nair', hiName: 'सुरेश नायर', exp: 8, rate: 900, rating: 4.7, initials: 'SN', verified: true },
      { id: 'w2', enName: 'Vinod Sharma', hiName: 'विनोद शर्मा', exp: 4, rate: 700, rating: 4.1, initials: 'VS', verified: true },
      { id: 'w3', enName: 'Ajay Mishra', hiName: 'अजय मिश्रा', exp: 12, rate: 1100, rating: 4.9, initials: 'AM', verified: true },
    ],
    carpenter: [
      { id: 'w1', enName: 'Mohan Das', hiName: 'मोहन दास', exp: 14, rate: 1000, rating: 4.8, initials: 'MD', verified: true },
      { id: 'w2', enName: 'Raju Singh', hiName: 'राजू सिंह', exp: 5, rate: 750, rating: 4.2, initials: 'RS', verified: false },
      { id: 'w3', enName: 'Prakash Joshi', hiName: 'प्रकाश जोशी', exp: 10, rate: 950, rating: 4.6, initials: 'PJ', verified: true },
    ],
    mason: [
      { id: 'w1', enName: 'Bhola Paswan', hiName: 'भोला पासवान', exp: 18, rate: 1100, rating: 4.7, initials: 'BP', verified: true },
      { id: 'w2', enName: 'Ganesh Meena', hiName: 'गणेश मीना', exp: 7, rate: 850, rating: 4.3, initials: 'GM', verified: true },
      { id: 'w3', enName: 'Lal Bahadur', hiName: 'लाल बहादुर', exp: 22, rate: 1300, rating: 5.0, initials: 'LB', verified: true },
    ],
    painter: [
      { id: 'w1', enName: 'Arjun Rawat', hiName: 'अर्जुन रावत', exp: 5, rate: 750, rating: 4.4, initials: 'AR', verified: true },
      { id: 'w2', enName: 'Sanjay Verma', hiName: 'संजय वर्मा', exp: 11, rate: 900, rating: 4.8, initials: 'SV', verified: true },
      { id: 'w3', enName: 'Dev Rathore', hiName: 'देव राठौर', exp: 3, rate: 650, rating: 4.0, initials: 'DR', verified: false },
    ],
    domestic: [
      { id: 'w1', enName: 'Savita Devi', hiName: 'सविता देवी', exp: 4, rate: 450, rating: 4.6, initials: 'SD', verified: true },
      { id: 'w2', enName: 'Kamla Bai', hiName: 'कमला बाई', exp: 9, rate: 550, rating: 4.9, initials: 'KB', verified: true },
      { id: 'w3', enName: 'Meena Kumari', hiName: 'मीना कुमारी', exp: 2, rate: 400, rating: 4.1, initials: 'MK', verified: false },
    ],
    loader: [
      { id: 'w1', enName: 'Santosh Bind', hiName: 'संतोष बिंद', exp: 3, rate: 600, rating: 4.2, initials: 'SB', verified: false },
      { id: 'w2', enName: 'Chotu Lal', hiName: 'छोटू लाल', exp: 6, rate: 650, rating: 4.5, initials: 'CL', verified: true },
      { id: 'w3', enName: 'Ramprasad Sahu', hiName: 'रामप्रसाद साहू', exp: 10, rate: 700, rating: 4.7, initials: 'RS', verified: true },
    ],
    driver: [
      { id: 'w1', enName: 'Mahendra Singh', hiName: 'महेंद्र सिंह', exp: 12, rate: 1000, rating: 4.8, initials: 'MS', verified: true },
      { id: 'w2', enName: 'Ashok Tiwari', hiName: 'अशोक तिवारी', exp: 7, rate: 850, rating: 4.5, initials: 'AT', verified: true },
      { id: 'w3', enName: 'Deepak Rao', hiName: 'दीपक राव', exp: 4, rate: 800, rating: 4.0, initials: 'DR', verified: false },
    ],
  };


  // ═══════════════════════════════════════════════════
  //  DOM REFS
  // ═══════════════════════════════════════════════════
  const $ = (id) => document.getElementById(id);

  const navbar = $('dash-navbar');
  const langEnBtn = $('lang-en');
  const langHiBtn = $('lang-hi');
  const langSlider = $('lang-slider');
  const roleBadge = $('role-badge');
  const roleBadgeText = $('role-badge-text');
  const logoutBtn = $('btn-logout');
  const logoutLabel = $('logout-label');
  const locationPill = $('location-pill');
  const locationText = $('location-text');
  const brandTagline = $('brand-tagline');
  const categoryGrid = $('category-grid');
  const categoriesSection = $('categories-section');
  const listingsSection = $('listings-section');
  const sectionTitle = $('section-title');
  const sectionSubtitle = $('section-subtitle');
  const searchInput = $('category-search');
  const searchClear = $('search-clear');
  const emptyState = $('empty-state');
  const emptyStateText = $('empty-state-text');
  const btnBack = $('btn-back');
  const backLabel = $('back-label');
  const listingsGrid = $('listings-grid');
  const listingsTitle = $('listings-title');
  const listingsSubtitle = $('listings-subtitle');
  const listingsCatIcon = $('listings-cat-icon');

  // Location modal
  const locModalOverlay = $('location-modal-overlay');
  const locModalClose = $('loc-modal-close');
  const locModalTitle = $('loc-modal-title');
  const locationInput = $('location-input');
  const btnLocSave = $('btn-loc-save');
  const locSaveLabel = $('loc-save-label');


  // ═══════════════════════════════════════════════════
  //  LANGUAGE ENGINE — apply all translations
  // ═══════════════════════════════════════════════════
  function applyLanguage() {
    const lang = state.language;
    const t = T[lang];

    // Body class for font family
    document.body.classList.toggle('lang-hi', lang === 'HI');
    document.getElementById('html-root').setAttribute('lang', lang === 'HI' ? 'hi' : 'en');

    const brandNameEl = document.querySelector('.dash-brand-name');
    if (brandNameEl) brandNameEl.textContent = lang === 'EN' ? 'SKILL CONNECT' : 'स्किल कनेक्ट';
    brandTagline.textContent = t.brandTagline;
    sectionTitle.textContent = t.sectionTitle;
    sectionSubtitle.textContent = t.sectionSubtitle;
    searchInput.placeholder = t.searchPlaceholder;
    emptyStateText.textContent = t.emptyState;
    backLabel.textContent = t.backBtn;
    logoutLabel.textContent = t.logout;
    locModalTitle.textContent = t.locModalTitle;
    locSaveLabel.textContent = t.locSaveLabel;
    locationInput.placeholder = t.locPlaceholder;

    // Role badge
    roleBadgeText.textContent = state.role === 'worker'
      ? t.roleBadgeWorker
      : t.roleBadgeEmployer;

    // Location text (preserve current location string, just update label)
    locationText.textContent = state.location;

    // Re-render category cards if visible
    renderCategoryGrid();

    // Re-render listings if drawer is open
    if (state.activeCategory) {
      renderListings(state.activeCategory);
    }
  }


  // ═══════════════════════════════════════════════════
  //  LANGUAGE TOGGLE
  // ═══════════════════════════════════════════════════
  function setLanguage(lang) {
    state.language = lang;

    // Animate slider
    if (lang === 'EN') {
      langSlider.style.left = '3px';
      langSlider.style.width = langEnBtn.offsetWidth + 'px';
      langEnBtn.classList.add('active');
      langHiBtn.classList.remove('active');
    } else {
      langSlider.style.left = (langEnBtn.offsetWidth + 3) + 'px';
      langSlider.style.width = langHiBtn.offsetWidth + 'px';
      langHiBtn.classList.add('active');
      langEnBtn.classList.remove('active');
    }

    applyLanguage();
  }

  // Init slider size on load
  function initLangSlider() {
    langSlider.style.width = langEnBtn.offsetWidth + 'px';
    langSlider.style.left = '3px';
  }

  langEnBtn.addEventListener('click', () => setLanguage('EN'));
  langHiBtn.addEventListener('click', () => setLanguage('HI'));


  // ═══════════════════════════════════════════════════
  //  ROLE BADGE & STYLING
  // ═══════════════════════════════════════════════════
  function applyRoleUI() {
    if (state.role === 'employer') {
      roleBadge.classList.add('employer');
    } else {
      roleBadge.classList.remove('employer');
    }
  }


  // ═══════════════════════════════════════════════════
  //  NAVBAR SCROLL
  // ═══════════════════════════════════════════════════
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });


  // ═══════════════════════════════════════════════════
  //  LOCATION PILL + MODAL
  // ═══════════════════════════════════════════════════
  function openLocModal() {
    locationInput.value = state.location;
    locModalOverlay.classList.add('active');
    setTimeout(() => locationInput.focus(), 150);
  }

  function closeLocModal() {
    locModalOverlay.classList.remove('active');
  }

  function saveLocation() {
    const val = locationInput.value.trim();
    if (!val) return;
    state.location = val;
    locationText.textContent = val;
    closeLocModal();
  }

  locationPill.addEventListener('click', openLocModal);
  locModalClose.addEventListener('click', closeLocModal);
  locModalOverlay.addEventListener('click', (e) => {
    if (e.target === locModalOverlay) closeLocModal();
  });
  btnLocSave.addEventListener('click', saveLocation);
  locationInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveLocation();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && locModalOverlay.classList.contains('active')) closeLocModal();
  });


  // ═══════════════════════════════════════════════════
  //  LOGOUT
  // ═══════════════════════════════════════════════════
  logoutBtn.addEventListener('click', () => {
    logoutBtn.style.opacity = '0.5';
    logoutBtn.style.pointerEvents = 'none';
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 600);
  });


  // ═══════════════════════════════════════════════════
  //  HELPERS — Stars renderer
  // ═══════════════════════════════════════════════════
  function renderStars(rating) {
    const full = Math.floor(rating);
    const empty = 5 - full;
    let html = '<span class="stars">';
    for (let i = 0; i < full; i++) html += '<span class="star-filled">★</span>';
    for (let i = 0; i < empty; i++) html += '<span class="star-empty">★</span>';
    html += '</span>';
    return html;
  }


  // ═══════════════════════════════════════════════════
  //  CATEGORY GRID RENDER
  // ═══════════════════════════════════════════════════
  function renderCategoryGrid() {
    const lang = state.language;
    const query = state.searchQuery.toLowerCase().trim();

    const filtered = CATEGORIES.filter(cat => {
      if (!query) return true;
      const enMatch = cat.en.title.toLowerCase().includes(query) || cat.en.desc.toLowerCase().includes(query);
      const hiMatch = cat.hi.title.includes(query) || cat.hi.desc.includes(query);
      return enMatch || hiMatch;
    });

    if (filtered.length === 0) {
      categoryGrid.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    categoryGrid.innerHTML = filtered.map((cat, idx) => {
      const title = lang === 'EN' ? cat.en.title : cat.hi.title;
      const desc = lang === 'EN' ? cat.en.desc : cat.hi.desc;
      const badge = lang === 'EN'
        ? T.EN.jobsAvailable(cat.count)
        : T.HI.jobsAvailable(cat.count);

      return `
        <button
          class="cat-card"
          data-id="${cat.id}"
          aria-label="${title}"
          style="animation-delay:${idx * 0.05}s"
        >
          <div class="cat-icon-wrap" aria-hidden="true">${cat.icon}</div>
          <div class="cat-card-body">
            <div class="cat-title">${title}</div>
            <div class="cat-desc">${desc}</div>
            <div class="cat-badge">
              <span class="cat-badge-dot"></span>
              ${badge}
            </div>
          </div>
        </button>
      `;
    }).join('');

    // Attach click handlers
    categoryGrid.querySelectorAll('.cat-card').forEach(card => {
      card.addEventListener('click', () => {
        openListings(card.dataset.id);
      });
    });
  }


  // ═══════════════════════════════════════════════════
  //  LISTINGS DRAWER — open
  // ═══════════════════════════════════════════════════
  function openListings(catId) {
    state.activeCategory = catId;
    categoriesSection.classList.add('hidden');
    listingsSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderListings(catId);
  }

  function closeListings() {
    state.activeCategory = null;
    listingsSection.classList.add('hidden');
    categoriesSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  btnBack.addEventListener('click', closeListings);


  // ═══════════════════════════════════════════════════
  //  LISTINGS RENDER
  // ═══════════════════════════════════════════════════
  function renderListings(catId) {
    const lang = state.language;
    const t = T[lang];
    const cat = CATEGORIES.find(c => c.id === catId);

    // Update header
    listingsCatIcon.textContent = cat.icon;
    const catTitle = lang === 'EN' ? cat.en.title : cat.hi.title;

    if (state.role === 'worker') {
      const jobs = JOBS[catId] || [];
      listingsTitle.textContent = catTitle + (lang === 'EN' ? ' Jobs' : ' के काम');
      listingsSubtitle.textContent = t.jobsNearYou(catTitle, jobs.length);
      listingsGrid.innerHTML = jobs.map((job, idx) => renderJobCard(job, t, idx)).join('');
    } else {
      const workers = WORKERS[catId] || [];
      listingsTitle.textContent = catTitle + (lang === 'EN' ? ' Workers' : ' कारीगर');
      listingsSubtitle.textContent = t.workersNearYou(catTitle, workers.length);
      listingsGrid.innerHTML = workers.map((w, idx) => renderWorkerCard(w, t, idx)).join('');
    }
  }

  function renderJobCard(job, t, idx) {
    const lang = state.language;
    const title = lang === 'EN' ? job.enTitle : job.hiTitle;
    const distStr = job.dist > 0 ? t.distLabel(job.dist) : (lang === 'EN' ? 'Nearby' : 'पास में');

    return `
      <div class="listing-card" style="animation-delay:${idx * 0.07}s">
        <div class="listing-card-header">
          <div>
            <div class="listing-job-title">${title}</div>
            <div class="listing-employer">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:4px;">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              ${job.employer}
            </div>
          </div>
          <div class="listing-wage-badge">${t.dailyRate(job.wage)}</div>
        </div>

        <div class="listing-meta">
          <span class="meta-pill">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            ${distStr}
          </span>
          <span class="meta-pill">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
            ${lang === 'EN' ? 'Daily Wage' : 'दैनिक मजदूरी'}
          </span>
        </div>

        <button class="btn-listing-cta" onclick="this.textContent = '${lang === 'EN' ? 'Connecting...' : 'जोड़ा जा रहा है...'}" >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.42 2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 7.13 7.13l.96-1.34a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          ${t.applyBtn}
        </button>
      </div>
    `;
  }

  function renderWorkerCard(worker, t, idx) {
    const lang = state.language;
    const name = lang === 'EN' ? worker.enName : worker.hiName;
    const expStr = t.expLabel(worker.exp);
    const rateStr = t.dailyRate(worker.rate);
    const verifiedHTML = worker.verified
      ? `<span class="verified-badge">
           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
             <polyline points="20 6 9 17 4 12"/>
           </svg>
           ${lang === 'EN' ? 'Verified' : 'सत्यापित'}
         </span>`
      : '';

    return `
      <div class="listing-card" style="animation-delay:${idx * 0.07}s">
        <div class="worker-card-top">
          <div class="worker-avatar">${worker.initials}</div>
          <div class="worker-info">
            <div class="worker-name">${name}</div>
            <div class="worker-exp">${expStr}</div>
          </div>
          <div class="listing-wage-badge">${rateStr}</div>
        </div>

        <div class="listing-meta">
          <div class="worker-rating">
            ${renderStars(worker.rating)}
            <span style="color:var(--text-gray);font-size:0.78rem;">&nbsp;${worker.rating}</span>
          </div>
          ${verifiedHTML}
        </div>

        <button class="btn-listing-cta" onclick="this.textContent = '${lang === 'EN' ? 'Connecting...' : 'जोड़ा जा रहा है...'}" >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.42 2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 7.13 7.13l.96-1.34a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          ${t.hireBtn}
        </button>
      </div>
    `;
  }


  // ═══════════════════════════════════════════════════
  //  SEARCH BAR
  // ═══════════════════════════════════════════════════
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    state.searchQuery = q;
    searchClear.classList.toggle('hidden', q.length === 0);
    renderCategoryGrid();
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    searchClear.classList.add('hidden');
    searchInput.focus();
    renderCategoryGrid();
  });


  // ═══════════════════════════════════════════════════
  //  INIT
  // ═══════════════════════════════════════════════════
  function init() {
    applyRoleUI();
    renderCategoryGrid();
    applyLanguage();

    // Init lang slider width after fonts load
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(initLangSlider);
    } else {
      setTimeout(initLangSlider, 300);
    }
  }

  init();

});

