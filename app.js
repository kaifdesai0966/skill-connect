/* ═══════════════════════════════════════════════════════
   Skill Connect — Single-File App State Machine
   Global state: isLoggedIn | userRole | language
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════════
  //  GLOBAL STATE
  // ═══════════════════════════════════════════════════
  const appState = {
    isLoggedIn: false,       // false → landing, true → dashboard
    userRole: 'worker',      // 'worker' | 'employer'
    language: 'EN',          // 'EN' | 'HI'
    location: 'Bengaluru, 560001',
    activeCategory: null,    // category id when listings drawer is open
    searchQuery: '',
    userName: '',
  };

  const landingView = document.getElementById('landing-view');
  const dashboardView = document.getElementById('dashboard-view');


  // ═══════════════════════════════════════════════════
  //  MASTER RENDER — swaps entire view
  // ═══════════════════════════════════════════════════
  function render() {
    if (appState.isLoggedIn) {
      landingView.classList.add('hidden');
      dashboardView.classList.remove('hidden');
      document.body.style.overflow = '';

      // Inject dashboard HTML then boot its logic
      dashboardView.innerHTML = buildDashboardHTML();
      bootDashboard();
    } else {
      dashboardView.classList.add('hidden');
      dashboardView.innerHTML = '';
      landingView.classList.remove('hidden');
      document.body.style.overflow = '';
      bootLanding();
    }
  }


  // ═══════════════════════════════════════════════════
  //  LOGIN TRIGGER (called by both forms on success)
  // ═══════════════════════════════════════════════════
  function login(role, name) {
    appState.isLoggedIn = true;
    appState.userRole = role;
    appState.userName = name || (role === 'worker' ? 'Worker' : 'Employer');
    appState.activeCategory = null;
    appState.searchQuery = '';
    render();
  }

  function logout() {
    appState.isLoggedIn = false;
    appState.activeCategory = null;
    // Note: User's selected language persists seamlessly!
    render();
  }


  // ═══════════════════════════════════════════════════
  //  DATA — categories + sample listings
  // ═══════════════════════════════════════════════════
  const CATEGORIES = [
    { id: 'plumber', icon: '🔧', en: { title: 'Plumber', desc: 'Pipe & tap repairs' }, hi: { title: 'प्लंबर', desc: 'पाइप और नल की मरम्मत' }, count: 14 },
    { id: 'electrician', icon: '⚡', en: { title: 'Electrician', desc: 'Wiring, fans & switchboards' }, hi: { title: 'इलेक्ट्रीशियन', desc: 'वायरिंग, पंखे और स्विचबोर्ड' }, count: 22 },
    { id: 'carpenter', icon: '🪚', en: { title: 'Carpenter', desc: 'Furniture & woodwork' }, hi: { title: 'बढ़ई (कारपेंटर)', desc: 'फर्नीचर और लकड़ी का काम' }, count: 9 },
    { id: 'mason', icon: '🧱', en: { title: 'Mason / Construction', desc: 'Brickwork, plastering & tiling' }, hi: { title: 'राजमिस्त्री', desc: 'ईंट, प्लास्टर और टाइल का काम' }, count: 31 },
    { id: 'painter', icon: '🖌️', en: { title: 'Painter', desc: 'Wall painting & whitewashing' }, hi: { title: 'पेंटर', desc: 'दीवार पेंटिंग और सफेदी' }, count: 11 },
    { id: 'domestic', icon: '🏠', en: { title: 'Domestic Help / Cleaner', desc: 'Cleaning & household tasks' }, hi: { title: 'घरेलू सहायक', desc: 'सफाई और घरेलू काम' }, count: 27 },
    { id: 'loader', icon: '📦', en: { title: 'Loader / Helper', desc: 'Shifting, loading & general labor' }, hi: { title: 'मजदूर / हेल्पर', desc: 'सामान उठाना, लोडिंग और मजदूरी' }, count: 18 },
    { id: 'driver', icon: '🚗', en: { title: 'Driver / Delivery', desc: 'Local transport & driving' }, hi: { title: 'ड्राइवर', desc: 'स्थानीय परिवहन और ड्राइविंग' }, count: 16 },
  ];

  const JOBS = {
    plumber: [
      { enTitle: 'Bathroom Leakage Fix', hiTitle: 'बाथरूम लीकेज ठीक करना', employer: 'Rahul Sharma', dist: 1.2, wage: 650 },
      { enTitle: 'New Pipe Installation', hiTitle: 'नई पाइप लगाना', employer: 'Priya Builders', dist: 2.5, wage: 800 },
      { enTitle: 'Tap Replacement Work', hiTitle: 'नल बदलने का काम', employer: 'Anil Kumar', dist: 0.8, wage: 500 },
    ],
    electrician: [
      { enTitle: 'Home Rewiring Project', hiTitle: 'घर की रिवायरिंग', employer: 'Sharma Const.', dist: 3.1, wage: 900 },
      { enTitle: 'Ceiling Fan Installation', hiTitle: 'छत पंखा लगाना', employer: 'Meena Devi', dist: 1.4, wage: 600 },
      { enTitle: 'Switchboard Repair', hiTitle: 'स्विचबोर्ड मरम्मत', employer: 'Star Enterprises', dist: 0.6, wage: 550 },
    ],
    carpenter: [
      { enTitle: 'Kitchen Cabinet Fitting', hiTitle: 'किचन कैबिनेट लगाना', employer: 'Kapoor Interiors', dist: 2.0, wage: 1100 },
      { enTitle: 'Door Frame Repair', hiTitle: 'दरवाजे का फ्रेम ठीक करना', employer: 'Ramesh Gupta', dist: 1.7, wage: 700 },
      { enTitle: 'Wardrobe Assembly', hiTitle: 'वार्डरोब जोड़ना', employer: 'Deepa Home Decor', dist: 4.2, wage: 850 },
    ],
    mason: [
      { enTitle: 'Room Extension Work', hiTitle: 'कमरे का विस्तार कार्य', employer: 'BuildRight Co.', dist: 5.0, wage: 1200 },
      { enTitle: 'Floor Tiling – 3BHK', hiTitle: '3BHK में फर्श टाइलिंग', employer: 'Suresh Developers', dist: 3.3, wage: 1000 },
      { enTitle: 'Plaster & Finish Work', hiTitle: 'प्लास्टर और फिनिश काम', employer: 'Raja Constructions', dist: 2.1, wage: 900 },
    ],
    painter: [
      { enTitle: '2BHK Painting (Interior)', hiTitle: '2BHK अंदरूनी पेंटिंग', employer: 'Vikram Singh', dist: 1.9, wage: 800 },
      { enTitle: 'Exterior Whitewashing', hiTitle: 'बाहरी सफेदी', employer: 'City Homes Pvt.', dist: 3.8, wage: 1000 },
      { enTitle: 'POP Ceiling Painting', hiTitle: 'POP छत की पेंटिंग', employer: 'Anand Nair', dist: 2.6, wage: 750 },
    ],
    domestic: [
      { enTitle: 'Daily House Cleaning', hiTitle: 'रोज घर की सफाई', employer: 'Mrs. Lakshmi', dist: 0.4, wage: 450 },
      { enTitle: 'Utensil Washing + Swab', hiTitle: 'बर्तन और पोंछा', employer: 'Patel Family', dist: 0.9, wage: 500 },
      { enTitle: 'Full-Day Home Help', hiTitle: 'पूरे दिन का घरेलू काम', employer: 'Sharma Household', dist: 1.1, wage: 600 },
    ],
    loader: [
      { enTitle: 'Office Shifting Help', hiTitle: 'ऑफिस शिफ्टिंग हेल्पर', employer: 'Quick Movers', dist: 4.5, wage: 700 },
      { enTitle: 'Warehouse Loading', hiTitle: 'गोदाम लोडिंग', employer: 'ABC Logistics', dist: 6.0, wage: 650 },
      { enTitle: 'Shop Goods Unloading', hiTitle: 'दुकान में सामान उतारना', employer: 'Ravi Traders', dist: 1.3, wage: 600 },
    ],
    driver: [
      { enTitle: 'School Van Driver', hiTitle: 'स्कूल वैन ड्राइवर', employer: 'Bright Minds School', dist: 2.2, wage: 1000 },
      { enTitle: 'Delivery Executive', hiTitle: 'डिलीवरी ड्राइवर', employer: 'FastShip Pvt Ltd', dist: 0.0, wage: 800 },
      { enTitle: 'Commercial Driver (LCV)', hiTitle: 'कमर्शियल ड्राइवर', employer: 'Sharma Cargo', dist: 7.1, wage: 1200 },
    ],
  };

  const WORKERS = {
    plumber: [
      { enName: 'Ramesh Kumar', hiName: 'रमेश कुमार', exp: 6, rate: 650, rating: 4.8, initials: 'RK', verified: true },
      { enName: 'Shankar Yadav', hiName: 'शंकर यादव', exp: 3, rate: 550, rating: 4.3, initials: 'SY', verified: true },
      { enName: 'Dinesh Patel', hiName: 'दिनेश पटेल', exp: 9, rate: 800, rating: 4.9, initials: 'DP', verified: false },
    ],
    electrician: [
      { enName: 'Suresh Nair', hiName: 'सुरेश नायर', exp: 8, rate: 900, rating: 4.7, initials: 'SN', verified: true },
      { enName: 'Vinod Sharma', hiName: 'विनोद शर्मा', exp: 4, rate: 700, rating: 4.1, initials: 'VS', verified: true },
      { enName: 'Ajay Mishra', hiName: 'अजय मिश्रा', exp: 12, rate: 1100, rating: 4.9, initials: 'AM', verified: true },
    ],
    carpenter: [
      { enName: 'Mohan Das', hiName: 'मोहन दास', exp: 14, rate: 1000, rating: 4.8, initials: 'MD', verified: true },
      { enName: 'Raju Singh', hiName: 'राजू सिंह', exp: 5, rate: 750, rating: 4.2, initials: 'RS', verified: false },
      { enName: 'Prakash Joshi', hiName: 'प्रकाश जोशी', exp: 10, rate: 950, rating: 4.6, initials: 'PJ', verified: true },
    ],
    mason: [
      { enName: 'Bhola Paswan', hiName: 'भोला पासवान', exp: 18, rate: 1100, rating: 4.7, initials: 'BP', verified: true },
      { enName: 'Ganesh Meena', hiName: 'गणेश मीना', exp: 7, rate: 850, rating: 4.3, initials: 'GM', verified: true },
      { enName: 'Lal Bahadur', hiName: 'लाल बहादुर', exp: 22, rate: 1300, rating: 5.0, initials: 'LB', verified: true },
    ],
    painter: [
      { enName: 'Arjun Rawat', hiName: 'अर्जुन रावत', exp: 5, rate: 750, rating: 4.4, initials: 'AR', verified: true },
      { enName: 'Sanjay Verma', hiName: 'संजय वर्मा', exp: 11, rate: 900, rating: 4.8, initials: 'SV', verified: true },
      { enName: 'Dev Rathore', hiName: 'देव राठौर', exp: 3, rate: 650, rating: 4.0, initials: 'DR', verified: false },
    ],
    domestic: [
      { enName: 'Savita Devi', hiName: 'सविता देवी', exp: 4, rate: 450, rating: 4.6, initials: 'SD', verified: true },
      { enName: 'Kamla Bai', hiName: 'कमला बाई', exp: 9, rate: 550, rating: 4.9, initials: 'KB', verified: true },
      { enName: 'Meena Kumari', hiName: 'मीना कुमारी', exp: 2, rate: 400, rating: 4.1, initials: 'MK', verified: false },
    ],
    loader: [
      { enName: 'Santosh Bind', hiName: 'संतोष बिंद', exp: 3, rate: 600, rating: 4.2, initials: 'SB', verified: false },
      { enName: 'Chotu Lal', hiName: 'छोटू लाल', exp: 6, rate: 650, rating: 4.5, initials: 'CL', verified: true },
      { enName: 'Ramprasad Sahu', hiName: 'रामप्रसाद साहू', exp: 10, rate: 700, rating: 4.7, initials: 'RS', verified: true },
    ],
    driver: [
      { enName: 'Mahendra Singh', hiName: 'महेंद्र सिंह', exp: 12, rate: 1000, rating: 4.8, initials: 'MS', verified: true },
      { enName: 'Ashok Tiwari', hiName: 'अशोक तिवारी', exp: 7, rate: 850, rating: 4.5, initials: 'AT', verified: true },
      { enName: 'Deepak Rao', hiName: 'दीपक राव', exp: 4, rate: 800, rating: 4.0, initials: 'DR', verified: false },
    ],
  };


  // ═══════════════════════════════════════════════════
  //  BILINGUAL TRANSLATION DICTIONARY (EN & HI)
  // ═══════════════════════════════════════════════════
  const T = {
    EN: {
      brandName: 'Skill Connect',
      brandTagline: 'WORK CONNECTED.',
      navHome: 'Home',
      navFindJobs: 'Find Jobs',
      navFindWorkers: 'Find Workers',
      btnSignin: 'Sign In',
      btnGetStarted: 'Get Started',
      heroCategory: 'LOCAL JOB & SKILL MATCHING PORTAL',
      titleLine1: 'Real Skills.',
      titleLine2: 'Local Jobs.',
      titleLine3: 'A Brighter Future.',
      heroSubtitle: 'Connects unskilled and semi-skilled workers with nearby job opportunities. Find work, hire talent, and build a stronger community.',
      heroBtnFindJobs: 'Find Jobs',
      heroBtnFindWorkers: 'Find Workers',
      heroLocation: 'Nearby opportunities. Real people. Local impact.',
      heroQuote: 'Skilled Hands<br>Build Stronger<br>Communities',

      // Modal
      roleWorker: 'Worker',
      roleEmployer: 'Employer',
      tabSignin: 'Log In',
      tabSignup: 'Sign Up / Register',
      signinRoleWorker: 'Worker Portal',
      signinRoleEmployer: 'Employer Portal',
      labelEmail: 'Email ID',
      phEmail: 'name@example.com',
      errEmail: 'Please enter a valid email address',
      labelPassword: 'Password',
      phPassword: 'Enter your password',
      forgotPassword: 'Forgot Password?',
      magicLink: 'Sign in with Magic Link',
      btnSigninSubmit: 'Log In',
      signinFooterPrompt: "Don't have an account?",
      linkToSignup: 'Create one now',

      signupRoleWorker: 'Registering as Worker',
      signupRoleEmployer: 'Registering as Employer',
      labelNameWorker: 'Full Name',
      labelNameEmployer: 'Full Name / Business Name',
      phNameWorker: 'Enter your full name',
      phNameEmployer: 'Enter your name or business name',
      labelCreatePassword: 'Create Password',
      phCreatePassword: 'Min. 6 characters',
      labelLocationWorker: 'City / Pincode',
      labelLocationEmployer: 'Location / Site Address',
      phLocationWorker: 'Enter area name or 6-digit pincode',
      phLocationEmployer: 'Enter site address or pincode',

      labelSkill: 'Primary Skill / Work Type',
      skillDefault: 'Select your primary skill',
      skillMasonry: 'Masonry',
      skillPlumbing: 'Plumbing',
      skillCarpentry: 'Carpentry',
      skillPainting: 'Painting',
      skillElectrical: 'Electrical Work',
      skillConstruction: 'Construction',
      skillDomestic: 'Domestic Help',

      labelWage: 'Daily Wage Expectation (₹)',
      wageOptional: 'Optional',

      labelEmployerType: 'Employer Type',
      empTypeDefault: 'Select employer type',
      empTypeIndividual: 'Individual / Household',
      empTypeContractor: 'Contractor',
      empTypeBusiness: 'Business Owner',

      btnSignupWorker: 'Register as Worker',
      btnSignupEmployer: 'Register as Employer',
      signupFooterPrompt: 'Already have an account?',
      linkToSignin: 'Sign in here',

      // Feedback & Status
      loggingIn: 'Logging In...',
      welcomeBack: 'Welcome back!',
      creatingAccount: 'Creating account...',
      accountCreated: 'Account Created!',
      resetSent: 'Reset link sent to your email!',
      magicSent: 'Magic link sent! Check your inbox',
      enterEmailFirst: 'Enter your email above first',

      // Dashboard
      sectionTitle: 'Select a Work Category',
      sectionSubtitle: 'Browse verified daily-wage opportunities and skilled professionals near you.',
      searchPH: 'Search categories…',
      roleBadgeWorker: 'Worker',
      roleBadgeEmp: 'Employer',
      logout: 'Logout',
      backBtn: '← Back to All Categories',
      emptyState: 'No categories match your search.',
      locTitle: 'Edit Location',
      locSave: 'Save Location',
      locPH: 'City name or pincode…',
      jobsAvail: (n) => `${n} Jobs Available`,
      jobsNear: (n) => `${n} ${n === 1 ? 'job' : 'jobs'} available near you`,
      workersAvail: (n) => `${n} Workers Available`,
      workersNear: (n) => `${n} ${n === 1 ? 'worker' : 'workers'} available near you`,
      applyBtn: 'Apply / Call Now',
      hireBtn: 'Hire / Contact',
      dist: (km) => km > 0 ? `${km} km away` : 'Nearby',
      rate: (a) => `₹${a}/day`,
      exp: (y) => `${y} yrs exp.`,
      verified: 'Verified',
      daily: 'Daily Wage',
      listJobsSuffix: ' Jobs',
      listWorkerSuffix: ' Workers',
    },
    HI: {
      brandName: 'स्किल कनेक्ट',
      brandTagline: 'वर्क कनेक्टेड।',
      navHome: 'होम',
      navFindJobs: 'काम खोजें',
      navFindWorkers: 'कारीगर खोजें',
      btnSignin: 'साइन इन',
      btnGetStarted: 'शुरू करें',
      heroCategory: 'स्थानीय रोजगार और कौशल मिलान पोर्टल',
      titleLine1: 'असली कौशल।',
      titleLine2: 'स्थानीय काम।',
      titleLine3: 'एक उज्जवल भविष्य।',
      heroSubtitle: 'अकुशल और अर्ध-कुशल कामगारों को नजदीकी रोजगार के अवसरों से जोड़ता है। काम खोजें, कारीगर नियुक्त करें और एक मजबूत समुदाय बनाएं।',
      heroBtnFindJobs: 'काम खोजें →',
      heroBtnFindWorkers: 'कारीगर खोजें →',
      heroLocation: '📍 आस-पास के अवसर। असली लोग। स्थानीय प्रभाव।',
      heroQuote: 'कुशल हाथ<br>मजबूत समुदाय<br>बनाते हैं',

      // Modal
      roleWorker: 'कारीगर',
      roleEmployer: 'नियोक्ता',
      tabSignin: 'लॉग इन',
      tabSignup: 'साइन अप / पंजीकरण',
      signinRoleWorker: 'कारीगर पोर्टल',
      signinRoleEmployer: 'नियोक्ता पोर्टल',
      labelEmail: 'ईमेल आईडी',
      phEmail: 'name@example.com',
      errEmail: 'कृपया एक वैध ईमेल पता दर्ज करें',
      labelPassword: 'पासवर्ड',
      phPassword: 'अपना पासवर्ड दर्ज करें',
      forgotPassword: 'पासवर्ड भूल गए?',
      magicLink: 'मैजिक लिंक से साइन इन करें',
      btnSigninSubmit: 'लॉग इन करें',
      signinFooterPrompt: 'खाता नहीं है?',
      linkToSignup: 'नया खाता बनाएं',

      signupRoleWorker: 'कारीगर के रूप में पंजीकरण',
      signupRoleEmployer: 'नियोक्ता के रूप में पंजीकरण',
      labelNameWorker: 'पूरा नाम',
      labelNameEmployer: 'पूरा नाम / व्यापार का नाम',
      phNameWorker: 'अपना पूरा नाम दर्ज करें',
      phNameEmployer: 'अपना नाम या व्यापार का नाम दर्ज करें',
      labelCreatePassword: 'पासवर्ड बनाएं',
      phCreatePassword: 'न्यूनतम 6 अक्षर',
      labelLocationWorker: 'शहर / पिनकोड',
      labelLocationEmployer: 'स्थान / कार्यस्थल का पता',
      phLocationWorker: 'क्षेत्र का नाम या 6-अंकों का पिनकोड दर्ज करें',
      phLocationEmployer: 'कार्यस्थल का पता या पिनकोड दर्ज करें',

      labelSkill: 'मुख्य कौशल / काम का प्रकार',
      skillDefault: 'अपना मुख्य कौशल चुनें',
      skillMasonry: 'राजमिस्त्री',
      skillPlumbing: 'प्लंबर',
      skillCarpentry: 'बढ़ई (कारपेंटर)',
      skillPainting: 'पेंटर',
      skillElectrical: 'इलेक्ट्रीशियन',
      skillConstruction: 'निर्माण कार्य',
      skillDomestic: 'घरेलू सहायक',

      labelWage: 'दैनिक मजदूरी अपेक्षा (₹)',
      wageOptional: 'वैकल्पिक',

      labelEmployerType: 'नियोक्ता का प्रकार',
      empTypeDefault: 'नियोक्ता प्रकार चुनें',
      empTypeIndividual: 'व्यक्तिगत / घरेलू',
      empTypeContractor: 'ठेकेदार',
      empTypeBusiness: 'व्यवसायी',

      btnSignupWorker: 'कारीगर के रूप में पंजीकरण करें',
      btnSignupEmployer: 'नियोक्ता के रूप में पंजीकरण करें',
      signupFooterPrompt: 'पहले से खाता है?',
      linkToSignin: 'यहाँ साइन इन करें',

      // Feedback & Status
      loggingIn: 'लॉग इन हो रहा है...',
      welcomeBack: 'स्वागत है!',
      creatingAccount: 'खाता बन रहा है...',
      accountCreated: 'खाता सफलतापूर्वक बन गया!',
      resetSent: 'रीसेट लिंक आपकी ईमेल पर भेजा गया!',
      magicSent: 'मैजिक लिंक भेज दिया गया! इनबॉक्स चेक करें',
      enterEmailFirst: 'पहले ऊपर अपना ईमेल दर्ज करें',

      // Dashboard
      sectionTitle: 'काम की श्रेणी चुनें',
      sectionSubtitle: 'अपने पास उपलब्ध दैनिक वेतन के काम और कुशल कारीगर खोजें।',
      searchPH: 'श्रेणी खोजें…',
      roleBadgeWorker: 'कारीगर',
      roleBadgeEmp: 'नियोक्ता',
      logout: 'लॉग आउट',
      backBtn: '← सभी श्रेणियों पर वापस जाएं',
      emptyState: 'आपकी खोज से कोई श्रेणी मेल नहीं खाती।',
      locTitle: 'स्थान बदलें',
      locSave: 'स्थान सहेजें',
      locPH: 'शहर का नाम या पिनकोड…',
      jobsAvail: (n) => `${n} काम उपलब्ध`,
      jobsNear: (n) => `आपके पास ${n} काम उपलब्ध`,
      workersAvail: (n) => `${n} कारीगर उपलब्ध`,
      workersNear: (n) => `आपके पास ${n} कारीगर उपलब्ध`,
      applyBtn: 'अप्लाई करें / अभी कॉल करें',
      hireBtn: 'हायर करें / संपर्क करें',
      dist: (km) => km > 0 ? `${km} किमी दूर` : 'पास में',
      rate: (a) => `₹${a}/दिन`,
      exp: (y) => `${y} साल अनुभव`,
      verified: 'सत्यापित',
      daily: 'दैनिक मजदूरी',
      listJobsSuffix: ' के काम',
      listWorkerSuffix: ' कारीगर',
    },
  };

  function t(key, ...args) {
    const fn = T[appState.language][key];
    return typeof fn === 'function' ? fn(...args) : fn;
  }

  // ═══════════════════════════════════════════════════
  //  BUILD DASHBOARD HTML SHELL
  // ═══════════════════════════════════════════════════
  function buildDashboardHTML() {
    const lang = appState.language;
    const isWorker = appState.userRole === 'worker';
    const initials = appState.userName.slice(0, 2).toUpperCase() || (isWorker ? 'WK' : 'EM');

    return `
      <!-- ── DASHBOARD NAVBAR ── -->
      <nav class="db-nav" id="db-nav">
        <div class="db-nav-inner">

          <!-- Brand -->
          <a href="#" class="brand db-brand" id="db-brand-logo">
            <div class="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M2 18h20v2H2zM4 18v-3a8 8 0 0 1 16 0v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 3v4M7 7l2 2M17 7l-2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="11" r="2" fill="currentColor"/>
              </svg>
            </div>
            <div class="brand-text">
              <span class="brand-name db-brand-name">${lang === 'EN' ? 'SKILL CONNECT' : 'स्किल कनेक्ट'}</span>
              <span class="brand-tagline" id="db-tagline">${T[lang].brandTagline}</span>
            </div>
          </a>

          <!-- Location pill -->
          <button class="db-loc-pill" id="db-loc-pill">
            <span>&#128205;</span>
            <span id="db-loc-text">${appState.location}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>

          <!-- Right controls -->
          <div class="db-nav-right">

            <!-- Language Toggle -->
            <div class="db-lang" id="db-lang">
              <button class="db-lang-btn${lang === 'EN' ? ' active' : ''}" id="db-lang-en">English</button>
              <button class="db-lang-btn${lang === 'HI' ? ' active' : ''}" id="db-lang-hi">&#2361;&#2367;&#2306;&#2342;&#2368;</button>
              <div class="db-lang-slider" id="db-lang-slider"></div>
            </div>

            <!-- Role badge -->
            <div class="db-role-badge${isWorker ? '' : ' employer'}" id="db-role-badge">
              <span class="db-role-dot"></span>
              <span id="db-role-text">${isWorker ? T[lang].roleBadgeWorker : T[lang].roleBadgeEmp}</span>
            </div>

            <!-- Avatar + Logout -->
            <div class="db-profile">
              <div class="db-avatar">${initials}</div>
              <button class="db-logout-btn" id="db-logout-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span id="db-logout-label">${T[lang].logout}</span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      <!-- Location edit modal -->
      <div class="db-loc-overlay hidden" id="db-loc-overlay">
        <div class="db-loc-modal">
          <button class="db-loc-close" id="db-loc-close">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <h3 id="db-loc-title">${T[lang].locTitle}</h3>
          <input type="text" id="db-loc-input" value="${appState.location}" placeholder="${T[lang].locPH}" />
          <button class="db-loc-save" id="db-loc-save"><span id="db-loc-save-label">${T[lang].locSave}</span></button>
        </div>
      </div>

      <!-- ── MAIN CONTENT ── -->
      <main class="db-main">
        <div class="db-ambient">
          <div class="db-glow db-glow-1"></div>
          <div class="db-glow db-glow-2"></div>
        </div>

        <!-- CATEGORIES VIEW -->
        <section class="db-section" id="db-cat-section">
          <div class="db-inner">
            <div class="db-sec-header">
              <h2 class="db-sec-title" id="db-sec-title">${T[lang].sectionTitle}</h2>
              <p class="db-sec-sub" id="db-sec-sub">${T[lang].sectionSubtitle}</p>
            </div>

            <div class="db-search-wrap">
              <div class="db-search">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" id="db-search-input" class="db-search-input" placeholder="${T[lang].searchPH}" autocomplete="off"/>
                <button class="db-search-clear hidden" id="db-search-clear">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <div class="db-cat-grid" id="db-cat-grid"></div>
            <div class="db-empty hidden" id="db-empty"><p id="db-empty-text">${T[lang].emptyState}</p></div>
          </div>
        </section>

        <!-- LISTINGS VIEW -->
        <section class="db-section hidden" id="db-list-section">
          <div class="db-inner">
            <button class="db-back-btn" id="db-back-btn">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span id="db-back-label">${T[lang].backBtn}</span>
            </button>
            <div class="db-list-header">
              <div class="db-list-cat-icon" id="db-list-cat-icon"></div>
              <div>
                <h2 class="db-list-title" id="db-list-title"></h2>
                <p class="db-list-sub" id="db-list-sub"></p>
              </div>
            </div>
            <div class="db-listings-grid" id="db-listings-grid"></div>
          </div>
        </section>

      </main>
    `;
  }


  // ═══════════════════════════════════════════════════
  //  BOOT DASHBOARD — wire all events after inject
  // ═══════════════════════════════════════════════════
  function bootDashboard() {
    const D = (id) => document.getElementById(id);

    // ── Navbar scroll
    const dbNav = D('db-nav');
    window.addEventListener('scroll', onDashScroll);
    function onDashScroll() { dbNav.classList.toggle('db-nav-scrolled', window.scrollY > 10); }

    // ── Language toggle
    const langEnBtn = D('db-lang-en');
    const langHiBtn = D('db-lang-hi');
    const langSlider = D('db-lang-slider');

    function positionLangSlider() {
      if (appState.language === 'EN') {
        langSlider.style.width = langEnBtn.offsetWidth + 'px';
        langSlider.style.left = langEnBtn.offsetLeft + 'px';
        langEnBtn.classList.add('active');
        langHiBtn.classList.remove('active');
      } else {
        langSlider.style.width = langHiBtn.offsetWidth + 'px';
        langSlider.style.left = langHiBtn.offsetLeft + 'px';
        langHiBtn.classList.add('active');
        langEnBtn.classList.remove('active');
      }
    }

    setTimeout(positionLangSlider, 60);

    langEnBtn.addEventListener('click', () => {
      if (appState.language === 'EN') return;
      appState.language = 'EN';
      refreshDashboardText();
      positionLangSlider();
    });

    langHiBtn.addEventListener('click', () => {
      if (appState.language === 'HI') return;
      appState.language = 'HI';
      refreshDashboardText();
      positionLangSlider();
    });

    // ── Logout
    D('db-logout-btn').addEventListener('click', () => {
      window.removeEventListener('scroll', onDashScroll);
      logout();
    });

    // ── Location pill
    const locOverlay = D('db-loc-overlay');
    D('db-loc-pill').addEventListener('click', () => { locOverlay.classList.remove('hidden'); D('db-loc-input').focus(); });
    D('db-loc-close').addEventListener('click', () => locOverlay.classList.add('hidden'));
    locOverlay.addEventListener('click', (e) => { if (e.target === locOverlay) locOverlay.classList.add('hidden'); });
    D('db-loc-save').addEventListener('click', () => {
      const v = D('db-loc-input').value.trim();
      if (v) { appState.location = v; D('db-loc-text').textContent = v; }
      locOverlay.classList.add('hidden');
    });
    D('db-loc-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') D('db-loc-save').click();
      if (e.key === 'Escape') locOverlay.classList.add('hidden');
    });

    // ── Back button
    D('db-back-btn').addEventListener('click', closeListing);

    // ── Search
    const searchInput = D('db-search-input');
    const searchClear = D('db-search-clear');
    searchInput.addEventListener('input', () => {
      appState.searchQuery = searchInput.value.trim();
      searchClear.classList.toggle('hidden', !appState.searchQuery);
      renderCategories();
    });
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      appState.searchQuery = '';
      searchClear.classList.add('hidden');
      searchInput.focus();
      renderCategories();
    });

    // ── Initial render
    renderCategories();
    document.body.classList.toggle('lang-hi', appState.language === 'HI');
    document.getElementById('html-root').setAttribute('lang', appState.language === 'HI' ? 'hi' : 'en');
  }

  // ── Re-translate all static text without full re-render
  function refreshDashboardText() {
    const lang = appState.language;
    const isWorker = appState.userRole === 'worker';

    document.body.classList.toggle('lang-hi', lang === 'HI');
    document.getElementById('html-root').setAttribute('lang', lang === 'HI' ? 'hi' : 'en');

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    const dbBrandName = document.querySelector('.db-brand-name');
    if (dbBrandName) dbBrandName.textContent = lang === 'EN' ? 'SKILL CONNECT' : 'स्किल कनेक्ट';
    set('db-tagline', T[lang].brandTagline);

    set('db-sec-title', T[lang].sectionTitle);
    set('db-sec-sub', T[lang].sectionSubtitle);
    set('db-empty-text', T[lang].emptyState);
    set('db-back-label', T[lang].backBtn);
    set('db-logout-label', T[lang].logout);
    set('db-role-text', isWorker ? T[lang].roleBadgeWorker : T[lang].roleBadgeEmp);
    set('db-loc-title', T[lang].locTitle);
    set('db-loc-save-label', T[lang].locSave);

    const si = document.getElementById('db-search-input');
    if (si) si.placeholder = T[lang].searchPH;
    const li = document.getElementById('db-loc-input');
    if (li) li.placeholder = T[lang].locPH;

    // Re-render grids in new language
    if (appState.activeCategory) {
      renderListing(appState.activeCategory);
    } else {
      renderCategories();
    }
  }

  // ── Render category grid
  function renderCategories() {
    const grid = document.getElementById('db-cat-grid');
    const empty = document.getElementById('db-empty');
    if (!grid) return;

    const lang = appState.language;
    const query = appState.searchQuery.toLowerCase();

    const filtered = CATEGORIES.filter(cat => {
      if (!query) return true;
      return cat.en.title.toLowerCase().includes(query) || cat.en.desc.toLowerCase().includes(query)
        || cat.hi.title.includes(query) || cat.hi.desc.includes(query);
    });

    if (!filtered.length) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');

    grid.innerHTML = filtered.map((cat, i) => {
      const title = lang === 'EN' ? cat.en.title : cat.hi.title;
      const desc = lang === 'EN' ? cat.en.desc : cat.hi.desc;
      const badge = t('jobsAvail', cat.count);
      return `
        <button class="db-cat-card" data-id="${cat.id}" style="animation-delay:${i * 0.05}s">
          <div class="db-cat-icon">${cat.icon}</div>
          <div class="db-cat-body">
            <div class="db-cat-title">${title}</div>
            <div class="db-cat-desc">${desc}</div>
            <div class="db-cat-badge"><span class="db-badge-dot"></span>${badge}</div>
          </div>
        </button>
      `;
    }).join('');

    grid.querySelectorAll('.db-cat-card').forEach(card => {
      card.addEventListener('click', () => openListing(card.dataset.id));
    });
  }

  // ── Open listings drawer
  function openListing(catId) {
    appState.activeCategory = catId;
    document.getElementById('db-cat-section').classList.add('hidden');
    const listSec = document.getElementById('db-list-section');
    listSec.classList.remove('hidden');
    listSec.classList.add('db-fadein');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderListing(catId);
  }

  function closeListing() {
    appState.activeCategory = null;
    document.getElementById('db-list-section').classList.add('hidden');
    document.getElementById('db-cat-section').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Render listing cards
  function renderListing(catId) {
    const lang = appState.language;
    const isWorker = appState.userRole === 'worker';
    const cat = CATEGORIES.find(c => c.id === catId);

    document.getElementById('db-list-cat-icon').textContent = cat.icon;
    const catTitle = lang === 'EN' ? cat.en.title : cat.hi.title;

    if (isWorker) {
      const jobs = JOBS[catId] || [];
      document.getElementById('db-list-title').textContent = catTitle + T[lang].listJobsSuffix;
      document.getElementById('db-list-sub').textContent = t('jobsNear', jobs.length);
      document.getElementById('db-listings-grid').innerHTML = jobs.map((job, i) => jobCard(job, i)).join('');
    } else {
      const workers = WORKERS[catId] || [];
      document.getElementById('db-list-title').textContent = catTitle + T[lang].listWorkerSuffix;
      document.getElementById('db-list-sub').textContent = t('workersNear', workers.length);
      document.getElementById('db-listings-grid').innerHTML = workers.map((w, i) => workerCard(w, i)).join('');
    }
  }

  // ── Job card HTML
  function jobCard(job, idx) {
    const lang = appState.language;
    const title = lang === 'EN' ? job.enTitle : job.hiTitle;
    const ctaBtn = T[lang].applyBtn;
    return `
      <div class="db-listing-card" style="animation-delay:${idx * 0.07}s">
        <div class="db-lc-header">
          <div>
            <div class="db-lc-title">${title}</div>
            <div class="db-lc-sub">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              ${job.employer}
            </div>
          </div>
          <div class="db-wage-badge">${t('rate', job.wage)}</div>
        </div>
        <div class="db-lc-meta">
          <span class="db-meta-pill">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${t('dist', job.dist)}
          </span>
          <span class="db-meta-pill">${T[lang].daily}</span>
        </div>
        <button class="db-cta-btn" onclick="this.disabled=true;this.textContent='${lang === 'EN' ? 'Connecting...' : 'जोड़ा जा रहा है...'}'">${ctaBtn}</button>
      </div>
    `;
  }

  // ── Worker card HTML
  function workerCard(w, idx) {
    const lang = appState.language;
    const name = lang === 'EN' ? w.enName : w.hiName;
    const ctaBtn = T[lang].hireBtn;
    const stars = Array.from({ length: 5 }, (_, i) =>
      `<span style="color:${i < Math.floor(w.rating) ? '#FBBF24' : 'rgba(255,255,255,0.15)'}">&#9733;</span>`
    ).join('');
    const verBadge = w.verified
      ? `<span class="db-verified"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>${T[lang].verified}</span>`
      : '';
    return `
      <div class="db-listing-card" style="animation-delay:${idx * 0.07}s">
        <div class="db-worker-top">
          <div class="db-worker-av">${w.initials}</div>
          <div class="db-worker-info">
            <div class="db-lc-title">${name}</div>
            <div class="db-lc-sub">${t('exp', w.exp)}</div>
          </div>
          <div class="db-wage-badge">${t('rate', w.rate)}</div>
        </div>
        <div class="db-lc-meta">
          <div class="db-stars">${stars} <span style="color:var(--text-gray);font-size:.77rem">&nbsp;${w.rating}</span></div>
          ${verBadge}
        </div>
        <button class="db-cta-btn" onclick="this.disabled=true;this.textContent='${lang === 'EN' ? 'Connecting...' : 'जोड़ा जा रहा है...'}'">${ctaBtn}</button>
      </div>
    `;
  }


  // ═══════════════════════════════════════════════════
  //  BOOT LANDING PAGE
  // ═══════════════════════════════════════════════════
  function bootLanding() {
    let currentRole = 'worker';
    let currentTab = 'signin';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const roleBtnW = document.getElementById('role-btn-worker');
    const roleBtnE = document.getElementById('role-btn-employer');
    const roleSlider = document.getElementById('role-toggle-slider');
    const tabSignin = document.getElementById('tab-signin');
    const tabSignup = document.getElementById('tab-signup');
    const formSignin = document.getElementById('form-signin');
    const formSignup = document.getElementById('form-signup');
    const tabInd = document.querySelector('.tab-indicator');
    const linkToSignup = document.getElementById('link-to-signup');
    const linkToSignin = document.getElementById('link-to-signin');
    const workerFields = document.getElementById('worker-fields');
    const empFields = document.getElementById('employer-fields');

    const signinEmail = document.getElementById('signin-email');
    const signupEmail = document.getElementById('signup-email');
    const signinPwd = document.getElementById('signin-password');
    const signupPwd = document.getElementById('signup-password');

    // ── Apply Landing & Modal Language
    function applyLandingLanguage() {
      const lang = appState.language;
      const t = T[lang];
      const isW = currentRole === 'worker';

      document.body.classList.toggle('lang-hi', lang === 'HI');
      document.getElementById('html-root').setAttribute('lang', lang === 'HI' ? 'hi' : 'en');

      // Brand
      const bName = document.getElementById('brand-name');
      if (bName) bName.textContent = lang === 'EN' ? 'SKILL CONNECT' : 'स्किल कनेक्ट';
      const bTagline = document.getElementById('brand-tagline');
      if (bTagline) bTagline.textContent = t.brandTagline;

      // Nav
      const nHome = document.getElementById('nav-home');
      if (nHome) nHome.textContent = t.navHome;
      const nFindJobs = document.getElementById('nav-find-jobs');
      if (nFindJobs) nFindJobs.textContent = t.navFindJobs;
      const nFindWorkers = document.getElementById('nav-find-workers');
      if (nFindWorkers) nFindWorkers.textContent = t.navFindWorkers;
      const bSignin = document.getElementById('btn-signin');
      if (bSignin) bSignin.textContent = t.btnSignin;
      const bStarted = document.getElementById('btn-get-started');
      if (bStarted) bStarted.textContent = t.btnGetStarted;

      // Hero
      const hCat = document.getElementById('hero-category');
      if (hCat) hCat.textContent = t.heroCategory;
      const t1 = document.getElementById('title-line-1');
      if (t1) t1.textContent = t.titleLine1;
      const t2 = document.getElementById('title-line-2');
      if (t2) t2.textContent = t.titleLine2;
      const t3 = document.getElementById('title-line-3');
      if (t3) t3.textContent = t.titleLine3;
      const hSub = document.getElementById('hero-subtitle');
      if (hSub) hSub.textContent = t.heroSubtitle;
      const bFJobsText = document.getElementById('btn-find-jobs-text');
      if (bFJobsText) bFJobsText.textContent = t.heroBtnFindJobs;
      const bFWorkersText = document.getElementById('btn-find-workers-text');
      if (bFWorkersText) bFWorkersText.textContent = t.heroBtnFindWorkers;
      const hLoc = document.getElementById('hero-location-text');
      if (hLoc) hLoc.textContent = t.heroLocation;
      const hQuote = document.getElementById('hero-quote-text');
      if (hQuote) hQuote.innerHTML = t.heroQuote;

      // Modal role buttons & tabs
      const rW = document.getElementById('role-text-worker');
      if (rW) rW.textContent = t.roleWorker;
      const rE = document.getElementById('role-text-employer');
      if (rE) rE.textContent = t.roleEmployer;
      const tSigninEl = document.getElementById('tab-signin');
      if (tSigninEl) tSigninEl.textContent = t.tabSignin;
      const tSignupEl = document.getElementById('tab-signup');
      if (tSignupEl) tSignupEl.textContent = t.tabSignup;

      // Sign In Form
      const sRoleLbl = document.getElementById('signin-role-label');
      if (sRoleLbl) sRoleLbl.textContent = isW ? t.signinRoleWorker : t.signinRoleEmployer;

      const lSigninEmail = document.getElementById('label-signin-email');
      if (lSigninEmail) lSigninEmail.textContent = t.labelEmail;
      const inSigninEmail = document.getElementById('signin-email');
      if (inSigninEmail) inSigninEmail.placeholder = t.phEmail;
      const errSigninEmail = document.getElementById('signin-email-error');
      if (errSigninEmail) errSigninEmail.textContent = t.errEmail;

      const lSigninPwd = document.getElementById('label-signin-password');
      if (lSigninPwd) lSigninPwd.textContent = t.labelPassword;
      const inSigninPwd = document.getElementById('signin-password');
      if (inSigninPwd) inSigninPwd.placeholder = t.phPassword;

      const bFP = document.getElementById('btn-forgot-password');
      if (bFP) bFP.textContent = t.forgotPassword;
      const bML = document.getElementById('btn-magic-link');
      if (bML) bML.textContent = t.magicLink;

      const bSigninSubText = document.getElementById('btn-signin-submit-text');
      if (bSigninSubText) bSigninSubText.textContent = t.btnSigninSubmit;

      const sFootPrompt = document.getElementById('signin-footer-prompt');
      if (sFootPrompt) sFootPrompt.textContent = t.signinFooterPrompt;
      const lSignup = document.getElementById('link-to-signup');
      if (lSignup) lSignup.textContent = t.linkToSignup;

      // Sign Up Form
      const suRoleLbl = document.getElementById('signup-role-label');
      if (suRoleLbl) suRoleLbl.textContent = isW ? t.signupRoleWorker : t.signupRoleEmployer;

      const suNameLbl = document.getElementById('signup-name-label');
      if (suNameLbl) suNameLbl.textContent = isW ? t.labelNameWorker : t.labelNameEmployer;
      const suNameIn = document.getElementById('signup-name');
      if (suNameIn) suNameIn.placeholder = isW ? t.phNameWorker : t.phNameEmployer;

      const lSignupEmail = document.getElementById('label-signup-email');
      if (lSignupEmail) lSignupEmail.textContent = t.labelEmail;
      const inSignupEmail = document.getElementById('signup-email');
      if (inSignupEmail) inSignupEmail.placeholder = t.phEmail;
      const errSignupEmail = document.getElementById('signup-email-error');
      if (errSignupEmail) errSignupEmail.textContent = t.errEmail;

      const lSignupPwd = document.getElementById('label-signup-password');
      if (lSignupPwd) lSignupPwd.textContent = t.labelCreatePassword;
      const inSignupPwd = document.getElementById('signup-password');
      if (inSignupPwd) inSignupPwd.placeholder = t.phCreatePassword;

      const suLocLbl = document.getElementById('signup-location-label');
      if (suLocLbl) suLocLbl.textContent = isW ? t.labelLocationWorker : t.labelLocationEmployer;
      const suLocIn = document.getElementById('signup-location');
      if (suLocIn) suLocIn.placeholder = isW ? t.phLocationWorker : t.phLocationEmployer;

      const lSkill = document.getElementById('label-signup-skill');
      if (lSkill) lSkill.textContent = t.labelSkill;
      const oSkillDef = document.getElementById('opt-skill-default');
      if (oSkillDef) oSkillDef.textContent = t.skillDefault;
      const oSkillMas = document.getElementById('opt-skill-masonry');
      if (oSkillMas) oSkillMas.textContent = t.skillMasonry;
      const oSkillPlu = document.getElementById('opt-skill-plumbing');
      if (oSkillPlu) oSkillPlu.textContent = t.skillPlumbing;
      const oSkillCar = document.getElementById('opt-skill-carpentry');
      if (oSkillCar) oSkillCar.textContent = t.skillCarpentry;
      const oSkillPai = document.getElementById('opt-skill-painting');
      if (oSkillPai) oSkillPai.textContent = t.skillPainting;
      const oSkillEle = document.getElementById('opt-skill-electrical');
      if (oSkillEle) oSkillEle.textContent = t.skillElectrical;
      const oSkillCon = document.getElementById('opt-skill-construction');
      if (oSkillCon) oSkillCon.textContent = t.skillConstruction;
      const oSkillDom = document.getElementById('opt-skill-domestic');
      if (oSkillDom) oSkillDom.textContent = t.skillDomestic;

      const lWage = document.getElementById('label-signup-wage');
      if (lWage && lWage.childNodes[0]) lWage.childNodes[0].textContent = t.labelWage + ' ';
      const lWageOpt = document.getElementById('label-signup-wage-opt');
      if (lWageOpt) lWageOpt.textContent = t.wageOptional;

      const lEmpType = document.getElementById('label-signup-employer-type');
      if (lEmpType) lEmpType.textContent = t.labelEmployerType;
      const oEmpDef = document.getElementById('opt-emp-default');
      if (oEmpDef) oEmpDef.textContent = t.empTypeDefault;
      const oEmpInd = document.getElementById('opt-emp-individual');
      if (oEmpInd) oEmpInd.textContent = t.empTypeIndividual;
      const oEmpCon = document.getElementById('opt-emp-contractor');
      if (oEmpCon) oEmpCon.textContent = t.empTypeContractor;
      const oEmpBus = document.getElementById('opt-emp-business');
      if (oEmpBus) oEmpBus.textContent = t.empTypeBusiness;

      const suSubText = document.getElementById('btn-signup-submit-text');
      if (suSubText) suSubText.textContent = isW ? t.btnSignupWorker : t.btnSignupEmployer;

      const suFootPrompt = document.getElementById('signup-footer-prompt');
      if (suFootPrompt) suFootPrompt.textContent = t.signupFooterPrompt;
      const lSignin = document.getElementById('link-to-signin');
      if (lSignin) lSignin.textContent = t.linkToSignin;
    }

    // ── Language Toggle on Landing Page
    const landingLangEn = document.getElementById('landing-lang-en');
    const landingLangHi = document.getElementById('landing-lang-hi');
    const landingSlider = document.getElementById('landing-lang-slider');

    function positionLandingSlider() {
      if (!landingSlider || !landingLangEn || !landingLangHi) return;
      if (appState.language === 'EN') {
        landingSlider.style.width = landingLangEn.offsetWidth + 'px';
        landingSlider.style.left = landingLangEn.offsetLeft + 'px';
        landingLangEn.classList.add('active');
        landingLangHi.classList.remove('active');
      } else {
        landingSlider.style.width = landingLangHi.offsetWidth + 'px';
        landingSlider.style.left = landingLangHi.offsetLeft + 'px';
        landingLangHi.classList.add('active');
        landingLangEn.classList.remove('active');
      }
    }

    if (landingLangEn && landingLangHi) {
      landingLangEn.addEventListener('click', () => {
        if (appState.language === 'EN') return;
        appState.language = 'EN';
        applyLandingLanguage();
        positionLandingSlider();
      });
      landingLangHi.addEventListener('click', () => {
        if (appState.language === 'HI') return;
        appState.language = 'HI';
        applyLandingLanguage();
        positionLandingSlider();
      });
      setTimeout(positionLandingSlider, 60);
    }

    // Initialize text on boot
    applyLandingLanguage();

    // Navbar scroll
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // Hamburger
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }));

    // Email validation
    function validateEmail(inputEl, errorId) {
      const val = inputEl.value.trim();
      const err = document.getElementById(errorId);
      const grp = inputEl.closest('.input-group');
      if (val && !emailRegex.test(val)) { grp.classList.add('error'); err.classList.add('visible'); return false; }
      grp.classList.remove('error'); err.classList.remove('visible'); return true;
    }
    function clearErrors() {
      document.querySelectorAll('.input-group.error').forEach(g => g.classList.remove('error'));
      document.querySelectorAll('.input-error.visible').forEach(e => e.classList.remove('visible'));
    }

    signinEmail.addEventListener('blur', () => validateEmail(signinEmail, 'signin-email-error'));
    signinEmail.addEventListener('input', () => { if (signinEmail.closest('.input-group').classList.contains('error')) validateEmail(signinEmail, 'signin-email-error'); });
    signupEmail.addEventListener('blur', () => validateEmail(signupEmail, 'signup-email-error'));
    signupEmail.addEventListener('input', () => { if (signupEmail.closest('.input-group').classList.contains('error')) validateEmail(signupEmail, 'signup-email-error'); });

    // Modal
    function openModal(role, tab = 'signin') {
      currentRole = role;
      updateRoleUI();
      switchTab(tab);
      clearErrors();
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      formSignin.reset(); formSignup.reset(); clearErrors();
    }

    // Modal triggers
    document.getElementById('btn-signin').addEventListener('click', (e) => { e.preventDefault(); openModal('worker', 'signin'); });
    document.getElementById('btn-get-started').addEventListener('click', (e) => { e.preventDefault(); openModal('worker', 'signup'); });
    document.getElementById('btn-find-jobs').addEventListener('click', (e) => { e.preventDefault(); openModal('worker', 'signin'); });
    document.getElementById('btn-find-workers').addEventListener('click', (e) => { e.preventDefault(); openModal('employer', 'signin'); });
    document.getElementById('nav-find-jobs').addEventListener('click', (e) => { e.preventDefault(); openModal('worker', 'signin'); });
    document.getElementById('nav-find-workers').addEventListener('click', (e) => { e.preventDefault(); openModal('employer', 'signin'); });
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal(); });

    // Role UI
    function updateRoleUI() {
      const isW = currentRole === 'worker';
      const t = T[appState.language];

      roleBtnW.classList.toggle('active', isW);
      roleBtnE.classList.toggle('active', !isW);
      roleSlider.classList.toggle('employer', !isW);

      const signinRoleInd = document.getElementById('signin-role-indicator');
      const signinRoleLbl = document.getElementById('signin-role-label');
      const signupRoleInd = document.getElementById('signup-role-indicator');
      const signupRoleLbl = document.getElementById('signup-role-label');
      const signupNameLbl = document.getElementById('signup-name-label');
      const signupLocLbl = document.getElementById('signup-location-label');

      signinRoleInd.classList.toggle('employer', !isW);
      signinRoleLbl.textContent = isW ? t.signinRoleWorker : t.signinRoleEmployer;
      signupRoleInd.classList.toggle('employer', !isW);
      signupRoleLbl.textContent = isW ? t.signupRoleWorker : t.signupRoleEmployer;

      workerFields.classList.toggle('hidden', !isW);
      empFields.classList.toggle('hidden', isW);

      signupNameLbl.textContent = isW ? t.labelNameWorker : t.labelNameEmployer;
      signupLocLbl.textContent = isW ? t.labelLocationWorker : t.labelLocationEmployer;
      document.getElementById('signup-name').placeholder = isW ? t.phNameWorker : t.phNameEmployer;
      document.getElementById('signup-location').placeholder = isW ? t.phLocationWorker : t.phLocationEmployer;

      updateSignupBtn();
    }

    function updateSignupBtn() {
      const isW = currentRole === 'worker';
      const t = T[appState.language];
      const lbl = isW ? t.btnSignupWorker : t.btnSignupEmployer;
      const btnSignupSub = document.getElementById('btn-signup-submit');
      btnSignupSub.innerHTML = `<span id="btn-signup-submit-text">${lbl}</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    }

    roleBtnW.addEventListener('click', () => { if (currentRole !== 'worker') { currentRole = 'worker'; updateRoleUI(); } });
    roleBtnE.addEventListener('click', () => { if (currentRole !== 'employer') { currentRole = 'employer'; updateRoleUI(); } });

    // Tab switching
    function switchTab(tab) {
      currentTab = tab;
      clearErrors();
      const isSignin = tab === 'signin';
      tabSignin.classList.toggle('active', isSignin);
      tabSignup.classList.toggle('active', !isSignin);
      formSignin.classList.toggle('hidden', !isSignin);
      formSignup.classList.toggle('hidden', isSignin);
      tabInd.style.left = isSignin ? '4px' : '50%';
    }
    tabSignin.addEventListener('click', () => switchTab('signin'));
    tabSignup.addEventListener('click', () => switchTab('signup'));
    linkToSignup.addEventListener('click', () => switchTab('signup'));
    linkToSignin.addEventListener('click', () => switchTab('signin'));

    // Password toggles
    function setupPwdToggle(btn, input) {
      btn.addEventListener('click', () => {
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = show
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
      });
    }
    setupPwdToggle(document.getElementById('toggle-password-signin'), signinPwd);
    setupPwdToggle(document.getElementById('toggle-password-signup'), signupPwd);

    // Spinner HTML
    const spinner = `<svg class="spinner" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></circle></svg>`;
    const successIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>`;

    // ── SIGN IN SUBMIT → triggers login()
    formSignin.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = T[appState.language];
      if (!validateEmail(signinEmail, 'signin-email-error') || !signinEmail.value.trim()) {
        signinEmail.closest('.input-group').classList.add('error');
        document.getElementById('signin-email-error').classList.add('visible');
        return signinEmail.focus();
      }
      const btn = document.getElementById('btn-signin-submit');
      btn.classList.add('loading');
      btn.innerHTML = `${spinner} ${t.loggingIn}`;

      setTimeout(() => {
        btn.classList.remove('loading');
        btn.classList.add('success');
        btn.innerHTML = `${successIcon} ${t.welcomeBack}`;
        btn.style.background = 'linear-gradient(135deg,#059669,#10B981)';

        setTimeout(() => {
          closeModal();
          login(currentRole, signinEmail.value.split('@')[0]);
        }, 900);
      }, 1400);
    });

    // ── SIGN UP SUBMIT → triggers login()
    formSignup.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = T[appState.language];
      if (!validateEmail(signupEmail, 'signup-email-error') || !signupEmail.value.trim()) {
        signupEmail.closest('.input-group').classList.add('error');
        document.getElementById('signup-email-error').classList.add('visible');
        return signupEmail.focus();
      }
      const btn = document.getElementById('btn-signup-submit');
      btn.classList.add('loading');
      btn.innerHTML = `${spinner} ${t.creatingAccount}`;

      setTimeout(() => {
        btn.classList.remove('loading');
        btn.classList.add('success');
        btn.innerHTML = `${successIcon} ${t.accountCreated}`;
        btn.style.background = 'linear-gradient(135deg,#059669,#10B981)';

        setTimeout(() => {
          closeModal();
          const nameInput = document.getElementById('signup-name');
          login(currentRole, nameInput ? nameInput.value.trim() : '');
        }, 900);
      }, 1400);
    });

    // Forgot password / magic link
    const btnFP = document.getElementById('btn-forgot-password');
    const btnML = document.getElementById('btn-magic-link');
    function flashBtn(btn, successMsg, originalMsg) {
      const t = T[appState.language];
      const email = signinEmail.value.trim();
      if (email && emailRegex.test(email)) { btn.textContent = successMsg; btn.style.color = '#10B981'; }
      else { btn.textContent = t.enterEmailFirst; btn.style.color = '#EF4444'; signinEmail.focus(); }
      setTimeout(() => { btn.textContent = originalMsg; btn.style.color = ''; }, 2500);
    }
    btnFP.addEventListener('click', () => flashBtn(btnFP, T[appState.language].resetSent, T[appState.language].forgotPassword));
    btnML.addEventListener('click', () => flashBtn(btnML, T[appState.language].magicSent, T[appState.language].magicLink));
  }


  // ═══════════════════════════════════════════════════
  //  INIT
  // ═══════════════════════════════════════════════════
  render(); // boots landing page (isLoggedIn = false)

});
