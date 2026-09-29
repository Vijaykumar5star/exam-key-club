/* Exam Key Club — app.js
   Auth (Supabase OTP + password), i18n (Hindi/English), profile, stats. */

const SUPABASE_URL = 'https://bkxtoawmopxbohubyqyp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_CFMMKakV7MHp6Xrb7pQbLQ_6YmviwKT'; // publishable key (public by design)
const SITE_URL = location.origin + location.pathname;

/* ---------------- i18n ---------------- */
const I18N = {
  hi: {
    search_ph: 'Courses, tests, PDFs search karein...',
    hero_title: 'Teacher Recruitment की तैयारी, एक ही जगह.',
    hero_sub: 'CGTET, CTET, शिक्षक भर्ती, Test Series, PDF Notes और structured courses के साथ अपनी तैयारी को व्यवस्थित करें।',
    hero_btn1: 'Courses देखें', hero_btn2: 'Free Mock Test',
    explore_h: 'Explore', view_all: 'View all →',
    cat_exam: 'Exam Prep', cat_bharti: 'Teacher Bharti', cat_updates: 'Updates',
    cat_mock: 'Mock Tests', cat_pdf: 'PDF Notes', cat_study: 'Study Material',
    cat_ca: 'Current Affairs', cat_daily: 'Daily', cat_video: 'Video Classes',
    cat_learn: 'Learn', cat_more: 'More', cat_explore: 'Explore',
    offers_h: 'Special Offers', view_details: 'View details →',
    deal_free: 'FREE<br>DEMO', deal_new: 'NEW<br>COURSE', deal_daily: 'DAILY<br>UPDATE',
    ban1_t: 'CGTET Mega Test Series', ban1_p: '100 Mock Tests • Detailed Solutions • Performance Analysis', ban1_b: 'Start Free Test',
    ban2_t: 'Teacher Recruitment 2026', ban2_p: 'Notes + Practice Sets + Previous Year Questions', ban2_b: 'Explore',
    ban3_t: 'Daily Current Affairs', ban3_p: 'Exam-focused daily questions and quick revision.', ban3_b: 'Read Now',
    popular_h: 'Popular Courses', see_all: 'See all →', buy: 'Buy Now',
    c1_t: 'CGTET Complete Preparation', c2_t: 'CTET Full Course', c3_t: 'Teacher Recruitment Master Pack',
    c4_t: 'TET Mega Test Series', c6_t: 'Daily Current Affairs Pack',
    progress_h: 'Your Progress', stat_tests: 'Tests Attempted', stat_score: 'Average Score',
    stat_rank: 'Overall Rank', stat_courses: 'Courses Active',
    nav_home: 'Home', nav_courses: 'Courses', nav_tests: 'Tests', nav_dl: 'Downloads', nav_profile: 'Profile',
    login: 'Login', logout: 'Logout', login_h: 'Login / Sign Up',
    login_intro: 'Email par 6-digit code bhejte hain — ya seedha magic link click karein.',
    tab_otp: 'Email OTP', tab_pass: 'Password',
    email: 'Email', name: 'Name', password: 'Password',
    send_otp: 'Code bhejein', verify_otp: 'Verify karein',
    otp_sent: 'Code email par bhej diya gaya. Spam folder bhi check karein.',
    otp_ph: '6-digit code',
    login_btn: 'Login', signup_btn: 'Sign Up', have_acct: 'Account hai? Login karein', no_acct: 'Naya user? Sign up karein',
    login_ok: 'Login ho gaya! Swagat hai 🎉', logged_out: 'Logout ho gaya.',
    profile_h: 'My Profile', my_courses: 'My Courses', my_tests: 'My Tests', edit_name: 'Save',
    save_ok: 'Save ho gaya.',
    buy_h: 'Course Purchase', buy_p: 'Payment gateway (Razorpay/UPI) agle phase mein jud raha hai. Tab tak course demo preview free hai.',
    test_h: 'Free Mock Test', test_p: 'Test engine agle phase mein aa raha hai — mock tests, results aur analysis ke saath.',
    test_start: 'Notify me',
    dl_h: 'Downloads', dl_p: 'Login ke baad aapke purchased PDFs yahan dikhenge. Abhi demo list:',
    dl_login: 'PDFs dekhne ke liye login karein.',
    notify_h: 'Notifications',
    all_h: 'All Categories',
    more_h: 'More',
    offer_h: 'Special Offers', offer_p: 'Jald hi naye offers aa rahe hain!',
    qr_h: 'Scan / Quick Access',
    err_generic: 'Kuch galat ho gaya — dobara koshish karein.',
    need_login: 'Iske liye pehle login karein.',
    open_login: 'Login karein'
  },
  en: {
    search_ph: 'Search courses, tests, PDFs...',
    hero_title: 'Teacher Recruitment preparation, all in one place.',
    hero_sub: 'Structure your preparation with CGTET, CTET, teacher recruitment, test series, PDF notes and structured courses.',
    hero_btn1: 'View Courses', hero_btn2: 'Free Mock Test',
    explore_h: 'Explore', view_all: 'View all →',
    cat_exam: 'Exam Prep', cat_bharti: 'Teacher Bharti', cat_updates: 'Updates',
    cat_mock: 'Mock Tests', cat_pdf: 'PDF Notes', cat_study: 'Study Material',
    cat_ca: 'Current Affairs', cat_daily: 'Daily', cat_video: 'Video Classes',
    cat_learn: 'Learn', cat_more: 'More', cat_explore: 'Explore',
    offers_h: 'Special Offers', view_details: 'View details →',
    deal_free: 'FREE<br>DEMO', deal_new: 'NEW<br>COURSE', deal_daily: 'DAILY<br>UPDATE',
    ban1_t: 'CGTET Mega Test Series', ban1_p: '100 Mock Tests • Detailed Solutions • Performance Analysis', ban1_b: 'Start Free Test',
    ban2_t: 'Teacher Recruitment 2026', ban2_p: 'Notes + Practice Sets + Previous Year Questions', ban2_b: 'Explore',
    ban3_t: 'Daily Current Affairs', ban3_p: 'Exam-focused daily questions and quick revision.', ban3_b: 'Read Now',
    popular_h: 'Popular Courses', see_all: 'See all →', buy: 'Buy Now',
    c1_t: 'CGTET Complete Preparation', c2_t: 'CTET Full Course', c3_t: 'Teacher Recruitment Master Pack',
    c4_t: 'TET Mega Test Series', c6_t: 'Daily Current Affairs Pack',
    progress_h: 'Your Progress', stat_tests: 'Tests Attempted', stat_score: 'Average Score',
    stat_rank: 'Overall Rank', stat_courses: 'Courses Active',
    nav_home: 'Home', nav_courses: 'Courses', nav_tests: 'Tests', nav_dl: 'Downloads', nav_profile: 'Profile',
    login: 'Login', logout: 'Logout', login_h: 'Login / Sign Up',
    login_intro: 'We will send a 6-digit code to your email — or just click the magic link.',
    tab_otp: 'Email OTP', tab_pass: 'Password',
    email: 'Email', name: 'Name', password: 'Password',
    send_otp: 'Send Code', verify_otp: 'Verify',
    otp_sent: 'Code sent to your email. Check the spam folder too.',
    otp_ph: '6-digit code',
    login_btn: 'Login', signup_btn: 'Sign Up', have_acct: 'Have an account? Login', no_acct: 'New here? Sign up',
    login_ok: 'Logged in! Welcome 🎉', logged_out: 'You have been logged out.',
    profile_h: 'My Profile', my_courses: 'My Courses', my_tests: 'My Tests', edit_name: 'Save',
    save_ok: 'Saved.',
    buy_h: 'Course Purchase', buy_p: 'The payment gateway (Razorpay/UPI) is coming in the next phase. Until then, enjoy the free demo preview.',
    test_h: 'Free Mock Test', test_p: 'The test engine is coming in the next phase — with mock tests, results and analysis.',
    test_start: 'Notify me',
    dl_h: 'Downloads', dl_p: 'Your purchased PDFs will appear here after login. Demo list for now:',
    dl_login: 'Please log in to view your PDFs.',
    notify_h: 'Notifications',
    all_h: 'All Categories',
    more_h: 'More',
    offer_h: 'Special Offers', offer_p: 'New offers are coming soon!',
    qr_h: 'Scan / Quick Access',
    err_generic: 'Something went wrong — please try again.',
    need_login: 'Please log in first.',
    open_login: 'Log in'
  }
};

let lang = localStorage.getItem('ekc_lang') || 'hi';
function t(k){ return (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k; }
function applyI18n(){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.getElementById('langBtn').textContent = lang === 'hi' ? 'English' : 'हिंदी';
}
function toggleLang(){
  lang = lang === 'hi' ? 'en' : 'hi';
  localStorage.setItem('ekc_lang', lang);
  localStorage.setItem('ekc_lang_touched', '1');
  applyI18n();
  if (window.supa && currentUser) {
    supa.from('profiles').update({ preferred_language: lang }).eq('id', currentUser.id).then(()=>{});
  }
  renderAuthArea();
  // re-render open modal if it's dynamic
  if (modalBack.classList.contains('show') && currentModal) openModal(currentModal);
}

/* ---------------- Supabase + Auth ---------------- */
let supa = null, currentUser = null, currentModal = null;
let loginMode = 'otp';      // otp | pass
let passTab = 'login';       // login | signup

async function initSupabase(){
  supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data } = await supa.auth.getSession();
  setUser(data && data.session ? data.session.user : null);
  supa.auth.onAuthStateChange((_e, session) => {
    setUser(session ? session.user : null);
  });
}

function setUser(u){
  const firstTime = !currentUser && !!u;
  currentUser = u;
  renderAuthArea();
  if (u) loadStats();
  else resetStats();
  if (firstTime && modalBack.classList.contains('show') && (currentModal === 'login')) {
    showMsg('loginMsg', t('login_ok'), 'ok');
    setTimeout(closeModal, 1200);
  }
}

function renderAuthArea(){
  const area = document.getElementById('authArea');
  if (currentUser){
    const initial = (currentUser.email || '?').charAt(0).toUpperCase();
    area.innerHTML = `<button class="avatar" onclick="requireLoginOr('profile')">${initial}</button>`;
  } else {
    area.innerHTML = `<button class="loginBtn" onclick="openModal('login')">${t('login')}</button>`;
  }
}

function resetStats(){
  document.getElementById('statTests').textContent = '0';
  document.getElementById('statScore').textContent = '—';
  document.getElementById('statRank').textContent = '—';
  document.getElementById('statCourses').textContent = '0';
}

async function loadStats(){
  try {
    const { count } = await supa.from('enrollments').select('id', { count: 'exact', head: true }).eq('user_id', currentUser.id);
    document.getElementById('statCourses').textContent = count || 0;
    const s = await supa.rpc('get_my_stats');
    if (s.data){
      document.getElementById('statTests').textContent = s.data.tests_done || 0;
      document.getElementById('statScore').textContent = (s.data.avg_score != null) ? s.data.avg_score + '%' : '—';
      document.getElementById('statRank').textContent = (s.data.my_rank != null) ? '#' + s.data.my_rank : '—';
    }
  } catch(e) { /* tables may not exist yet */ }
}

/* login guards */
function requireLoginOr(modalType){
  if (!currentUser){ openModal('login', { after: modalType }); return; }
  openModal(modalType);
}

/* ---------------- OTP login ---------------- */
async function sendOtp(){
  const email = document.getElementById('loginEmail').value.trim();
  if (!email || email.indexOf('@') < 0){ showMsg('loginMsg', t('err_generic'), 'err'); return; }
  setBusy('otpSendBtn', true);
  let { error } = await supa.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, emailRedirectTo: SITE_URL }
  });
  if (error && (error.status === 422 || (error.message || '').toLowerCase().includes('redirect'))){
    // retry without redirect (allowlist not configured yet)
    const r2 = await supa.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    error = r2.error;
  }
  setBusy('otpSendBtn', false);
  if (error){ showMsg('loginMsg', error.message, 'err'); return; }
  document.getElementById('otpStep').style.display = 'block';
  showMsg('loginMsg', t('otp_sent'), 'ok');
}

async function verifyOtpCode(){
  const email = document.getElementById('loginEmail').value.trim();
  const token = document.getElementById('otpInput').value.trim();
  if (!token){ showMsg('loginMsg', t('err_generic'), 'err'); return; }
  setBusy('otpVerifyBtn', true);
  const { error } = await supa.auth.verifyOtp({ email, token, type: 'email' });
  setBusy('otpVerifyBtn', false);
  if (error){ showMsg('loginMsg', error.message, 'err'); return; }
  // setUser() fires via onAuthStateChange
}

/* ---------------- Password login / signup ---------------- */
async function passwordSubmit(){
  const email = document.getElementById('passEmail').value.trim();
  const pass = document.getElementById('passPass').value;
  const btnId = passTab === 'login' ? 'passLoginBtn' : 'passSignupBtn';
  if (!email || !pass || pass.length < 6){ showMsg('loginMsg', t('err_generic'), 'err'); return; }
  setBusy(btnId, true);
  let result;
  if (passTab === 'login'){
    result = await supa.auth.signInWithPassword({ email, password: pass });
  } else {
    const name = document.getElementById('passName').value.trim() || email.split('@')[0];
    result = await supa.auth.signUp({ email, password: pass, options: { data: { full_name: name }, emailRedirectTo: SITE_URL } });
  }
  setBusy(btnId, false);
  if (result.error){ showMsg('loginMsg', result.error.message, 'err'); return; }
  if (result.data && result.data.session === null && result.data.user){
    showMsg('loginMsg', t('otp_sent'), 'ok');
  }
}

async function doLogout(){
  await supa.auth.signOut();
  showMsg('loginMsg', t('logged_out'), 'ok');
  resetStats();
}

/* ---------------- Profile ---------------- */
async function saveName(){
  const name = document.getElementById('nameInput').value.trim();
  if (!name) return;
  setBusy('saveNameBtn', true);
  const { error } = await supa.from('profiles').update({ full_name: name, updated_at: new Date().toISOString() }).eq('id', currentUser.id);
  setBusy('saveNameBtn', false);
  showMsg('loginMsg', error ? t('err_generic') : t('save_ok'), error ? 'err' : 'ok');
}

/* ---------------- Modals ---------------- */
const modalBack = document.getElementById('modalBack');
const modal = document.getElementById('modal');

function head(title){ return `<button class="close" onclick="closeModal()">×</button><h3>${title}</h3>`; }
function msgBox(){ return `<div class="msg" id="loginMsg"></div>`; }

function openModal(type, opts){
  currentModal = type;
  let content;
  if (type === 'profile') {
    profileModalHtml().then(html => {
      modal.innerHTML = html + msgBox();
      modalBack.classList.add('show');
    });
    return;
  }
  else if (type === 'login') content = loginModalHtml();
  else if (type === 'buy') content = `${head(t('buy_h'))}<p>${t('buy_p')}</p>${msgBox()}`;
  else if (type === 'test') content = `${head(t('test_h'))}<p>${t('test_p')}</p><button class="wideBtn" onclick="closeModal()">${t('test_start')}</button>`;
  else if (type === 'downloads') content = downloadsModalHtml();
  else if (type === 'notify') content = `${head(t('notify_h'))}<div class="notice">📢 CG Teacher Recruitment 2026 — update available.</div><div class="notice">📝 New mock test added.</div><div class="notice">🎓 New class added to your course.</div>`;
  else if (type === 'all') content = `${head(t('all_h'))}<p>CGTET • CTET • Teacher Recruitment • Test Series • PDF Notes • Current Affairs • Video Classes</p>`;
  else if (type === 'more') content = `${head(t('more_h'))}<div class="profileRow">🏆 Leaderboard</div><div class="profileRow">🎁 Refer & Earn</div><div class="profileRow">💬 Support</div>`;
  else if (type === 'offer') content = `${head(t('offer_h'))}<p>${t('offer_p')}</p>`;
  else if (type === 'qr') content = `${head(t('qr_h'))}<div style="height:180px;width:180px;margin:20px auto;background:repeating-conic-gradient(#111 0 25%,#fff 0 50%) 0/24px 24px;border:12px solid #fff;box-shadow:0 0 0 1px #ddd"></div>`;
  else content = `${head('Exam Key Club')}<p>—</p>`;
  modal.innerHTML = content + msgBox();
  modalBack.classList.add('show');
}

function loginModalHtml(){
  const otpStep = `
    <div class="tabs">
      <button class="tab ${loginMode==='otp'?'on':''}" onclick="switchLoginMode('otp')">${t('tab_otp')}</button>
      <button class="tab ${loginMode==='pass'?'on':''}" onclick="switchLoginMode('pass')">${t('tab_pass')}</button>
    </div>`;
  const otp = `
    <div class="field"><label>${t('email')}</label><input type="email" id="loginEmail" placeholder="you@example.com"></div>
    <button class="wideBtn" id="otpSendBtn" onclick="sendOtp()">${t('send_otp')}</button>
    <div id="otpStep" style="display:none">
      <div class="field" style="margin-top:16px"><label>${t('otp_ph')}</label><input id="otpInput" inputmode="numeric" maxlength="6" placeholder="••••••"></div>
      <button class="wideBtn" id="otpVerifyBtn" onclick="verifyOtpCode()">${t('verify_otp')}</button>
    </div>
    <p style="font-size:13px;color:#6d7482;margin-top:12px">${t('login_intro')}</p>`;
  const pass = `
    <div class="field"><label>${t('email')}</label><input type="email" id="passEmail" placeholder="you@example.com"></div>
    ${passTab==='signup' ? `<div class="field"><label>${t('name')}</label><input id="passName" placeholder="Vijay Kumar"></div>` : ''}
    <div class="field"><label>${t('password')}</label><input type="password" id="passPass" placeholder="••••••••"></div>
    ${passTab==='login'
      ? `<button class="wideBtn" id="passLoginBtn" onclick="passwordSubmit()">${t('login_btn')}</button>
         <button class="smallLink" style="display:block;margin:10px auto" onclick="switchPassTab('signup')">${t('no_acct')}</button>`
      : `<button class="wideBtn" id="passSignupBtn" onclick="passwordSubmit()">${t('signup_btn')}</button>
         <button class="smallLink" style="display:block;margin:10px auto" onclick="switchPassTab('login')">${t('have_acct')}</button>`}`;
  return head(t('login_h')) + otpStep + (loginMode==='otp' ? otp : pass);
}

function switchLoginMode(m){ loginMode = m; openModal('login'); }
function switchPassTab(tb){ passTab = tb; openModal('login'); }

async function profileModalHtml(){
  const email = currentUser ? currentUser.email : '';
  let name = email ? email.split('@')[0] : '';
  let courseCount = 0;
  if (currentUser && supa){
    let { data } = await supa.from('profiles').select('full_name, preferred_language').eq('id', currentUser.id).maybeSingle();
    if (!data){
      // create own profile row if missing (policy allows insert)
      const ins = await supa.from('profiles').insert({ id: currentUser.id, full_name: name, preferred_language: lang });
      if (!ins.error) data = { full_name: name };
    }
    if (data && data.full_name) name = data.full_name;
    if (data && data.preferred_language && data.preferred_language !== lang && !localStorage.getItem('ekc_lang_touched')){
      lang = data.preferred_language; applyI18n();
    }
    const c = await supa.from('enrollments').select('id', { count: 'exact', head: true }).eq('user_id', currentUser.id);
    if (c.count) courseCount = c.count;
  }
  return `${head(t('profile_h'))}
    <div class="profileRow"><div class="avatar">${name.charAt(0).toUpperCase()}</div><div><b>${name}</b><br><small>${email}</small></div></div>
    <div class="field" style="margin:16px 0 4px"><label>${t('name')}</label><input id="nameInput" value="${name.replace(/"/g,'"')}"></div>
    <button class="ghostBtn" id="saveNameBtn" onclick="saveName()">${t('edit_name')}</button>
    <div class="profileRow">📚 ${t('my_courses')} <span style="margin-left:auto">${courseCount}</span></div>
    <div class="profileRow">📝 ${t('my_tests')} <span style="margin-left:auto">0</span></div>
    <button class="wideBtn" style="background:#eef2fa;color:#b42318" onclick="doLogout()">${t('logout')}</button>`;
}

function downloadsModalHtml(){
  if (!currentUser){
    return `${head(t('dl_h'))}<p>${t('dl_login')}</p><button class="wideBtn" onclick="closeModal();openModal('login')">${t('open_login')}</button>`;
  }
  return `${head(t('dl_h'))}<p>${t('dl_p')}</p><div class="notice">📄 CDP Complete Notes.pdf</div><div class="notice">📄 CGTET Practice Set 01.pdf</div>`;
}

function closeModal(){ modalBack.classList.remove('show'); currentModal = null; }

function showMsg(id, text, kind){
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'msg ' + (kind || 'ok');
}
function setBusy(id, busy){
  const el = document.getElementById(id);
  if (el){ el.disabled = busy; el.style.opacity = busy ? .6 : 1; }
}
function openBuy(){ openModal('buy'); }

/* ---------------- Page helpers ---------------- */
function scrollToId(id){ const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
function filterCourses(){
  const q = document.getElementById('search').value.toLowerCase();
  document.querySelectorAll('.course').forEach(c => c.style.display = (c.innerText + c.dataset.tags).toLowerCase().includes(q) ? 'block' : 'none');
}
function selectCategory(cat){
  document.getElementById('search').value = cat;
  filterCourses();
  scrollToId('courses');
}

/* carousel */
let slide = 0;
setInterval(() => {
  const bs = [...document.querySelectorAll('.banner')], ds = [...document.querySelectorAll('.dot')];
  if (!bs.length) return;
  slide = (slide + 1) % bs.length;
  bs.forEach((b, i) => b.classList.toggle('active', i === slide));
  ds.forEach((d, i) => d.classList.toggle('on', i === slide));
}, 4500);

/* ---------------- Boot ---------------- */
applyI18n();
initSupabase();

/* =========================================================
   TEST ENGINE + PAYMENTS (phase 2)
   ========================================================= */
const T2 = {
  hi: {
    tests_h: 'Mock Tests', no_tests: 'Abhi koi test publish nahi hua. Jald hi aa rahe hain!',
    start: 'Start', mins: 'min', qs: 'Qs',
    submit: 'Submit Test', confirm_submit: 'Test submit karein? Aap jawab badal nahi payenge.',
    next_q: 'Next', prev_q: 'Prev', palette: 'Question Palette',
    time_left: 'Time', auto_sub: 'Samay khatam — test auto-submit ho gaya.',
    result_h: 'Test Result', correct: 'Sahi', wrong: 'Galat', skipped: 'Chhode',
    review: 'Halo — Review', back_home: 'Home par wapas',
    pay_h: 'Course Purchase', pay_amount: 'Amount', pay_steps: 'Payment kaise karein:',
    s1: '1. Neeche QR scan karein ya UPI ID par payment bhejein', s2: '2. Payment ke baad UPI transaction/UTR ID copy karein',
    s3: '3. Wahi ID neeche daal kar submit karein — admin verify karke access dega',
    txn_ph: 'UPI Transaction / UTR ID', pay_submit: 'Payment Submit karein',
    pay_ok: 'Payment submit ho gaya! Verify hone ke baad course access mil jayega.',
    pay_err: 'Transaction ID daalna zaroori hai.', upi_missing: 'UPI ID admin panel mein set nahi hui hai.',
    login_first: 'Pehle login karein.', q: 'प्रश्न', your_ans: 'Aapka jawab', right_ans: 'Sahi jawab'
  },
  en: {
    tests_h: 'Mock Tests', no_tests: 'No tests published yet. Coming soon!',
    start: 'Start', mins: 'min', qs: 'Qs',
    submit: 'Submit Test', confirm_submit: 'Submit the test? You cannot change answers after this.',
    next_q: 'Next', prev_q: 'Prev', palette: 'Question Palette',
    time_left: 'Time', auto_sub: 'Time is up — the test was auto-submitted.',
    result_h: 'Test Result', correct: 'Correct', wrong: 'Wrong', skipped: 'Skipped',
    review: 'Review', back_home: 'Back to Home',
    pay_h: 'Course Purchase', pay_amount: 'Amount', pay_steps: 'How to pay:',
    s1: '1. Scan the QR below or pay to the UPI ID shown', s2: '2. After paying, copy the UPI transaction/UTR ID',
    s3: '3. Enter that ID below and submit — the admin will verify and grant access',
    txn_ph: 'UPI Transaction / UTR ID', pay_submit: 'Submit Payment',
    pay_ok: 'Payment submitted! You will get course access once verified.',
    pay_err: 'Transaction ID is required.', upi_missing: 'UPI ID is not set in the admin panel.',
    login_first: 'Please log in first.', q: 'Question', your_ans: 'Your answer', right_ans: 'Correct answer'
  }
};
function tt(k){ return (T2[lang] && T2[lang][k]) || T2.en[k] || k; }

/* ---------------- Tests list ---------------- */
async function openTestsModal(){
  if (!currentUser){ openModal('login'); return; }
  currentModal = 'tests';
  modal.innerHTML = head(tt('tests_h')) + '<div class="notice">Loading…</div>';
  modalBack.classList.add('show');
  const { data: tests, error } = await supa.from('tests')
    .select('id,title,description,category,duration_minutes')
    .eq('published', true).order('id');
  let rows = '';
  if (!error && tests && tests.length){
    rows = tests.map(ts => `
      <div class="testRow" onclick="startTest(${ts.id})">
        <div><b>${ts.title}</b><small>${ts.category || ''} • ${ts.duration_minutes} ${tt('mins')}</small></div>
        <span class="testGo">${tt('start')} →</span>
      </div>`).join('');
  } else {
    rows = `<div class="notice">${tt('no_tests')}</div>`;
  }
  modal.innerHTML = head(tt('tests_h')) + rows;
}

/* ---------------- Test player ---------------- */
let TEST = null;

async function startTest(testId){
  const { data: test } = await supa.from('tests').select('*').eq('id', testId).single();
  const { data: questions } = await supa.from('test_questions').select('*')
    .eq('test_id', testId).order('sort_order').order('id');
  if (!test || !questions || !questions.length) return;
  TEST = {
    test, questions,
    answers: Array(questions.length).fill(null),
    idx: 0,
    endsAt: Date.now() + test.duration_minutes * 60000,
    submitted: false
  };
  closeModal();
  renderPlayer();
  TEST.timer = setInterval(tickTimer, 1000);
}

function tickTimer(){
  if (!TEST || TEST.submitted) return;
  const left = TEST.endsAt - Date.now();
  const el = document.getElementById('pTimer');
  if (left <= 0){
    el.textContent = '00:00';
    finishTest(true);
    return;
  }
  const m = String(Math.floor(left / 60000)).padStart(2, '0');
  const s = String(Math.floor((left % 60000) / 1000)).padStart(2, '0');
  el.textContent = m + ':' + s;
  el.className = 'pTimer' + (left < 60000 ? ' low' : '');
}

function renderPlayer(){
  const q = TEST.questions[TEST.idx];
  const opts = ['A', 'B', 'C', 'D'].map(L => `
    <div class="opt ${TEST.answers[TEST.idx] === L ? 'sel' : ''}" onclick="pickAns('${L}')">
      <span class="key">${L}</span><span>${q['option_' + L.toLowerCase()]}</span>
    </div>`).join('');
  const chips = TEST.questions.map((_, i) =>
    `<div class="palChip ${TEST.answers[i] ? 'ans' : ''} ${i === TEST.idx ? 'cur' : ''}" onclick="goQ(${i})">${i + 1}</div>`).join('');
  document.getElementById('playerBack').innerHTML = `
    <div class="pTop">
      <button class="close" style="background:rgba(255,255,255,.15);color:#fff" onclick="if(confirm('Test chhod dein?')){closePlayer()}">×</button>
      <b>${TEST.test.title}</b>
      <span class="pTimer" id="pTimer">--:--</span>
    </div>
    <div class="pBody">
      <div class="qNum">${tt('q')} ${TEST.idx + 1} / ${TEST.questions.length}</div>
      <div class="qText">${q.question}</div>
      ${opts}
      <div class="palWrap" id="palWrap">
        <div class="qNum">${tt('palette')}</div>
        <div class="pal">${chips}</div>
      </div>
    </div>
    <div class="pFoot">
      <button style="background:#f1f5ff;color:#54637c" onclick="prevQ()" ${TEST.idx === 0 ? 'disabled' : ''}>← ${tt('prev_q')}</button>
      <button style="background:#eef4ff;color:var(--blue)" onclick="togglePal()">${tt('palette')}</button>
      ${TEST.idx === TEST.questions.length - 1
        ? `<button style="background:var(--blue);color:#fff" onclick="finishTest(false)">${tt('submit')} ✓</button>`
        : `<button style="background:var(--blue);color:#fff" onclick="nextQ()">${tt('next_q')} →</button>`}
    </div>`;
  tickTimer();
}

function pickAns(L){
  TEST.answers[TEST.idx] = L;
  renderPlayer();
}
function goQ(i){ TEST.idx = i; renderPlayer(); }
function nextQ(){ if (TEST.idx < TEST.questions.length - 1){ TEST.idx++; renderPlayer(); } }
function prevQ(){ if (TEST.idx > 0){ TEST.idx--; renderPlayer(); } }
function togglePal(){ document.getElementById('palWrap').classList.toggle('show'); }

function closePlayer(){
  if (TEST && TEST.timer) clearInterval(TEST.timer);
  TEST = null;
  document.getElementById('playerBack').classList.remove('show');
  document.getElementById('playerBack').innerHTML = '';
}

async function finishTest(auto){
  if (!TEST || TEST.submitted) return;
  if (!auto && !confirm(tt('confirm_submit'))) return;
  TEST.submitted = true;
  clearInterval(TEST.timer);
  let score = 0;
  const details = TEST.questions.map((q, i) => {
    const ok = TEST.answers[i] === q.correct_answer;
    if (ok) score++;
    return { q: q.question, given: TEST.answers[i], correct: q.correct_answer, explanation: q.explanation };
  });
  const { error } = await supa.from('test_results').insert({
    user_id: currentUser.id,
    test_id: TEST.test.id,
    score, total_questions: TEST.questions.length,
    details, submitted_at: new Date().toISOString()
  });
  const total = TEST.questions.length;
  const pct = Math.round(score / total * 100);
  const wrongCount = TEST.answers.filter((a, i) => a && a !== TEST.questions[i].correct_answer).length;
  const skippedCount = TEST.answers.filter(a => !a).length;
  const test = TEST.test;
  document.getElementById('playerBack').innerHTML = `
    <div class="pTop"><b>${test.title}</b><span class="pTimer">${pct}%</span></div>
    <div class="pBody">
      ${auto ? `<div class="msg err" style="display:block">${tt('auto_sub')}</div>` : ''}
      <div class="rBig">${score} / ${total}</div>
      <div class="rGrid">
        <div class="rCell"><strong>${score}</strong><span>${tt('correct')} ✓</span></div>
        <div class="rCell"><strong>${wrongCount}</strong><span>${tt('wrong')} ✗</span></div>
        <div class="rCell"><strong>${skippedCount}</strong><span>${tt('skipped')} –</span></div>
      </div>
      <h3>${tt('review')}</h3>
      ${details.map((d, i) => `
        <div class="revQ">
          <div class="qNum">${tt('q')} ${i + 1}</div>
          <div style="font-weight:700;margin:4px 0">${d.q}</div>
          <div>${tt('your_ans')}: <span class="${d.given === d.correct ? 'okA' : 'badA'}">${d.given || '—'}</span></div>
          <div>${tt('right_ans')}: <span class="okA">${d.correct}</span></div>
          ${d.explanation ? `<div style="font-size:13px;color:#6d7482;margin-top:6px">💡 ${d.explanation}</div>` : ''}
        </div>`).join('')}
      <button class="wideBtn" onclick="closePlayer();loadStats()">${tt('back_home')}</button>
    </div>`;
  if (error) console.warn('result save failed', error);
  loadStats();
}

/* ---------------- Payments (UPI + admin approval) ---------------- */
let UPI_ID = null;

async function loadSettings(){
  try {
    const { data } = await supa.from('app_settings').select('value').eq('key', 'upi_id').maybeSingle();
    if (data && data.value) UPI_ID = data.value;
  } catch(e) {}
}

function openBuy(courseId, courseTitle, price){
  if (!currentUser){ openModal('login'); return; }
  currentModal = 'buy';
  const qr = UPI_ID
    ? `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent('upi://pay?pa=' + UPI_ID + '&pn=Exam Key Club&am=' + price + '&cu=INR')}`
    : '';
  modal.innerHTML = `${head(tt('pay_h'))}
    <div class="profileRow"><div class="avatar">📘</div><div><b>${courseTitle}</b><br><small>Exam Key Club</small></div>
      <span class="price" style="margin-left:auto;font-size:22px">₹${price}</span></div>
    ${UPI_ID
      ? `<p><b>${tt('pay_steps')}</b></p>
         <p style="font-size:14px">${tt('s1')}<br>${tt('s2')}<br>${tt('s3')}</p>
         <div class="upiBox">
           <div style="font-weight:900;color:var(--blue);font-size:16px;word-break:break-all">${UPI_ID}</div>
           ${qr ? `<img src="${qr}" alt="UPI QR" width="170" height="170">` : ''}
         </div>
         <div class="field"><label>${tt('txn_ph')}</label><input id="txnInput" placeholder="e.g. 4123XXXXXX12345"></div>
         <button class="wideBtn" onclick="submitPayment(${courseId}, ${price})">${tt('pay_submit')}</button>`
      : `<div class="notice">${tt('upi_missing')}</div>`}
    ${msgBox()}`;
  modalBack.classList.add('show');
}

async function submitPayment(courseId, price){
  const txn = document.getElementById('txnInput').value.trim();
  if (!txn){ showMsg('loginMsg', tt('pay_err'), 'err'); return; }
  setBusy(undefined, false);
  const { error } = await supa.from('payments').insert({
    user_id: currentUser.id,
    course_id: courseId,
    amount: price,
    payment_id: txn,
    status: 'pending'
  });
  if (error){ showMsg('loginMsg', error.message, 'err'); return; }
  showMsg('loginMsg', tt('pay_ok'), 'ok');
  setTimeout(closeModal, 1800);
}

/* load settings on boot */
loadSettings();
