/* Exam Key Club — admin.js */
const SUPABASE_URL = 'https://bkxtoawmopxbohubyqyp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_CFMMKakV7MHp6Xrb7pQbLQ_6YmviwKT';

const supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let ME = null, TAB = 'dash';

function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>'); }
function msg(text, kind){ const el = document.getElementById('adMsg') || document.getElementById('cMsg'); if (el){ el.textContent = text; el.className = 'msg ' + (kind || 'ok'); setTimeout(()=>{ el.className = 'msg'; }, 4000); } }

async function boot(){
  const { data } = await supa.auth.getSession();
  if (data && data.session){ ME = data.session.user; await checkAdmin(); }
  supa.auth.onAuthStateChange((_e, s) => {
    if (!s){ ME = null; document.getElementById('app').style.display = 'none'; document.getElementById('loginWrap').style.display = 'grid'; }
  });
}

async function checkAdmin(){
  const { data } = await supa.from('admin_users').select('user_id').eq('user_id', ME.id).maybeSingle();
  if (!data){
    msg('Ye account admin nahi hai. Admin panel access ke liye pehle admin banayein.', 'err');
    return;
  }
  document.getElementById('loginWrap').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  renderTabs();
  loadTab();
}

async function adminLogin(){
  const email = document.getElementById('adEmail').value.trim();
  const pass = document.getElementById('adPass').value;
  const { error } = await supa.auth.signInWithPassword({ email, password: pass });
  if (error){ msg(error.message, 'err'); return; }
  const { data } = await supa.auth.getSession();
  ME = data.session.user;
  await checkAdmin();
}

/* ---------- tabs ---------- */
const TABS = [
  ['dash', '📊 Dashboard'], ['courses', '📚 Courses'], ['tests', '📝 Tests'],
  ['payments', '💰 Payments'], ['students', '👥 Students'], ['settings', '⚙️ Settings']
];
function renderTabs(){
  document.getElementById('tabs').innerHTML = TABS.map(([k, l]) =>
    `<button class="tab ${TAB === k ? 'on' : ''}" onclick="TAB='${k}';renderTabs();loadTab()">${l}</button>`).join('');
}
function loadTab(){
  const c = document.getElementById('content');
  c.innerHTML = '<div class="card">Loading…</div>' + '<div class="msg" id="cMsg"></div>';
  ({ dash: loadDash, courses: loadCourses, tests: loadTests, payments: loadPayments, students: loadStudents, settings: loadSettings })[TAB]();
}

/* ---------- dashboard ---------- */
async function loadDash(){
  const [p, c, t, pay, tr] = await Promise.all([
    supa.from('profiles').select('id', { count: 'exact', head: true }),
    supa.from('courses').select('id', { count: 'exact', head: true }),
    supa.from('tests').select('id', { count: 'exact', head: true }),
    supa.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supa.from('test_results').select('id', { count: 'exact', head: true })
  ]);
  document.getElementById('content').innerHTML = `
    <div class="msg" id="cMsg"></div>
    <div class="grid">
      <div class="stat"><strong>${p.count || 0}</strong><span>Students</span></div>
      <div class="stat"><strong>${c.count || 0}</strong><span>Courses</span></div>
      <div class="stat"><strong>${t.count || 0}</strong><span>Tests</span></div>
      <div class="stat"><strong>${pay.count || 0}</strong><span>Pending Payments</span></div>
      <div class="stat"><strong>${tr.count || 0}</strong><span>Test Attempts</span></div>
    </div>
    <div class="card"><h3>Quick actions</h3>
      <button class="act blue" onclick="TAB='payments';renderTabs();loadTab()">💰 Pending payments dekhein</button>
      <button class="act blue" style="margin-left:8px" onclick="TAB='tests';renderTabs();loadTab()">📝 Naya test banayein</button>
      <button class="act blue" style="margin-left:8px" onclick="TAB='settings';renderTabs();loadTab()">⚙️ UPI ID set karein</button>
    </div>`;
}

/* ---------- courses ---------- */
async function loadCourses(){
  const { data: courses } = await supa.from('courses').select('*').order('id');
  document.getElementById('content').innerHTML = `
    <div class="msg" id="cMsg"></div>
    <div class="card"><h3>Naya course add karein</h3>
      <div class="f2">
        <div class="field"><label>Title</label><input id="ncTitle" placeholder="Course ka naam"></div>
        <div class="field"><label>Price (₹)</label><input id="ncPrice" type="number" value="499"></div>
      </div>
      <div class="field"><label>Description</label><input id="ncDesc" placeholder="Chhota description"></div>
      <button class="wideBtn" onclick="addCourse()">Add Course</button>
    </div>
    <div class="card"><h3>Courses</h3>
      <table><tr><th>ID</th><th>Title</th><th>Price ₹</th><th>Published</th><th></th></tr>
      ${(courses || []).map(c => `
        <tr>
          <td>${c.id}</td>
          <td><input id="ct-${c.id}" value="${esc(c.title)}"></td>
          <td><input id="cp-${c.id}" type="number" value="${c.price}" style="width:90px"></td>
          <td><button class="pill ${c.published ? 'ok' : 'warn'}" onclick="toggleCourse(${c.id}, ${!c.published})">${c.published ? 'LIVE' : 'DRAFT'}</button></td>
          <td>
            <button class="act blue" onclick="saveCourse(${c.id})">Save</button>
            <button class="act bad" onclick="delCourse(${c.id})">✕</button>
          </td>
        </tr>`).join('')}
      </table></div>`;
}

async function addCourse(){
  const title = document.getElementById('ncTitle').value.trim();
  const price = +document.getElementById('ncPrice').value || 0;
  const description = document.getElementById('ncDesc').value.trim();
  if (!title){ msg('Title zaroori hai', 'err'); return; }
  const { error } = await supa.from('courses').insert({ title, price, description, published: true });
  msg(error ? error.message : 'Course add ho gaya!', error ? 'err' : 'ok');
  if (!error) loadCourses();
}
async function saveCourse(id){
  const title = document.getElementById('ct-' + id).value;
  const price = +document.getElementById('cp-' + id).value;
  const { error } = await supa.from('courses').update({ title, price }).eq('id', id);
  msg(error ? error.message : 'Save ho gaya!', error ? 'err' : 'ok');
}
async function toggleCourse(id, pub){
  const { error } = await supa.from('courses').update({ published: pub }).eq('id', id);
  msg(error ? error.message : (pub ? 'Publish ho gaya' : 'Draft ho gaya'), error ? 'err' : 'ok');
  loadCourses();
}
async function delCourse(id){
  if (!confirm('Course delete karein? Uske lessons/questions bhi delete honge.')) return;
  const { error } = await supa.from('courses').delete().eq('id', id);
  msg(error ? error.message : 'Delete ho gaya', error ? 'err' : 'ok');
  loadCourses();
}

/* ---------- tests ---------- */
async function loadTests(){
  const { data: tests } = await supa.from('tests').select('*').order('id');
  document.getElementById('content').innerHTML = `
    <div class="msg" id="cMsg"></div>
    <div class="card"><h3>Naya test banayein</h3>
      <div class="f2">
        <div class="field"><label>Test title</label><input id="ntTitle" placeholder="e.g. CGTET Mock Test 1"></div>
        <div class="field"><label>Duration (minutes)</label><input id="ntDur" type="number" value="10"></div>
      </div>
      <div class="f2">
        <div class="field"><label>Category</label><input id="ntCat" placeholder="CGTET / CTET / ..."></div>
        <div class="field"><label>Description</label><input id="ntDesc" placeholder="Optional"></div>
      </div>
      <button class="wideBtn" onclick="addTest()">Create Test</button>
    </div>
    <div class="card"><h3>Tests</h3>
      <table><tr><th>ID</th><th>Title</th><th>Category</th><th>Min</th><th>Published</th><th></th></tr>
      ${(tests || []).map(ts => `
        <tr>
          <td>${ts.id}</td>
          <td><b>${esc(ts.title)}</b><br><small style="color:var(--muted)"><a href="#" onclick="TAB='questions';QID=${ts.id};loadQuestions();return false" style="color:var(--blue)">Questions manage karein →</a></small></td>
          <td>${esc(ts.category || '')}</td>
          <td>${ts.duration_minutes}</td>
          <td><button class="pill ${ts.published ? 'ok' : 'warn'}" onclick="toggleTest(${ts.id}, ${!ts.published})">${ts.published ? 'LIVE' : 'DRAFT'}</button></td>
          <td><button class="act bad" onclick="delTest(${ts.id})">✕</button></td>
        </tr>`).join('')}
      </table></div>`;
}

async function addTest(){
  const title = document.getElementById('ntTitle').value.trim();
  const duration_minutes = +document.getElementById('ntDur').value || 10;
  const category = document.getElementById('ntCat').value.trim();
  const description = document.getElementById('ntDesc').value.trim();
  if (!title){ msg('Title zaroori hai', 'err'); return; }
  const { error } = await supa.from('tests').insert({ title, duration_minutes, category, description, published: false });
  msg(error ? error.message : 'Test ban gaya! Ab questions add karein.', error ? 'err' : 'ok');
  if (!error) loadTests();
}
async function toggleTest(id, pub){
  const { error } = await supa.from('tests').update({ published: pub }).eq('id', id);
  msg(error ? error.message : (pub ? 'Publish ho gaya' : 'Draft ho gaya'), error ? 'err' : 'ok');
  loadTests();
}
async function delTest(id){
  if (!confirm('Test delete karein? Uske questions bhi delete honge.')) return;
  const { error } = await supa.from('tests').delete().eq('id', id);
  msg(error ? error.message : 'Delete ho gaya', error ? 'err' : 'ok');
  loadTests();
}

/* ---------- questions ---------- */
let QID = null;
async function loadQuestions(){
  renderTabsOnly();
  const { data: test } = await supa.from('tests').select('*').eq('id', QID).single();
  const { data: qs } = await supa.from('test_questions').select('*').eq('test_id', QID).order('sort_order').order('id');
  document.getElementById('content').innerHTML = `
    <div class="msg" id="cMsg"></div>
    <div class="card"><h3>➕ Naya question — ${esc(test.title)}</h3>
      <div class="field"><label>प्रश्न (Question)</label><textarea id="qQ" rows="2" placeholder="Question yahan likhein"></textarea></div>
      <div class="f2">
        <div class="field"><label>Option A</label><input id="qA"></div>
        <div class="field"><label>Option B</label><input id="qB"></div>
        <div class="field"><label>Option C</label><input id="qC"></div>
        <div class="field"><label>Option D</label><input id="qD"></div>
      </div>
      <div class="f2">
        <div class="field"><label>Sahi jawab</label><select id="qCor"><option>A</option><option>B</option><option>C</option><option>D</option></select></div>
        <div class="field"><label>Explanation (optional)</label><input id="qExp"></div>
      </div>
      <button class="wideBtn" onclick="addQuestion()">Add Question</button>
    </div>
    <div class="card"><h3>Questions (${(qs || []).length})</h3>
      ${(qs || []).map((q, i) => `
        <div style="padding:10px 0;border-bottom:1px solid var(--border)">
          <b>Q${i + 1}.</b> ${esc(q.question)} <span class="pill ok" style="margin-left:6px">Ans: ${q.correct_answer}</span>
          <button class="act bad" style="float:right" onclick="delQuestion(${q.id})">✕</button>
        </div>`).join('') || '<p>Koi question nahi.</p>'}
    </div>`;
}
function renderTabsOnly(){ document.getElementById('tabs').innerHTML = TABS.map(([k, l]) =>
  `<button class="tab ${k === 'tests' ? 'on' : ''}" onclick="TAB='${k}';renderTabs();loadTab()">${l}</button>`).join(''); }

async function addQuestion(){
  const question = document.getElementById('qQ').value.trim();
  const option_a = document.getElementById('qA').value.trim();
  const option_b = document.getElementById('qB').value.trim();
  const option_c = document.getElementById('qC').value.trim();
  const option_d = document.getElementById('qD').value.trim();
  const correct_answer = document.getElementById('qCor').value;
  const explanation = document.getElementById('qExp').value.trim();
  if (!question || !option_a || !option_b || !option_c || !option_d){ msg('Sabhi options aur question zaroori hain', 'err'); return; }
  const { count } = await supa.from('test_questions').select('id', { count: 'exact', head: true }).eq('test_id', QID);
  const { error } = await supa.from('test_questions').insert({ test_id: QID, question, option_a, option_b, option_c, option_d, correct_answer, explanation, sort_order: count || 0 });
  msg(error ? error.message : 'Question add ho gaya!', error ? 'err' : 'ok');
  if (!error) loadQuestions();
}
async function delQuestion(id){
  const { error } = await supa.from('test_questions').delete().eq('id', id);
  msg(error ? error.message : 'Delete ho gaya', error ? 'err' : 'ok');
  loadQuestions();
}

/* ---------- payments ---------- */
async function loadPayments(){
  const { data: pays } = await supa.from('payments').select('*, courses(title), profiles(full_name)').order('id', { ascending: false });
  document.getElementById('content').innerHTML = `
    <div class="msg" id="cMsg"></div>
    <div class="card"><h3>Payments</h3>
      <table><tr><th>ID</th><th>Student</th><th>Course</th><th>₹</th><th>Txn ID</th><th>Status</th><th></th></tr>
      ${(pays || []).map(p => `
        <tr>
          <td>${p.id}</td>
          <td>${esc(p.profiles ? p.profiles.full_name : '?')}<br><small style="color:var(--muted)">${esc((p.user_id || '').slice(0, 8))}</small></td>
          <td>${esc(p.courses ? p.courses.title : '#' + p.course_id)}</td>
          <td>${p.amount}</td>
          <td style="font-family:monospace;font-size:12px">${esc(p.payment_id)}</td>
          <td><span class="pill ${p.status === 'approved' ? 'ok' : p.status === 'rejected' ? 'bad' : 'warn'}">${esc(p.status || 'pending')}</span></td>
          <td>${p.status === 'pending' ? `
            <button class="act ok" onclick="approvePayment(${p.id}, '${esc(p.user_id)}', ${p.course_id})">✓ Approve</button>
            <button class="act bad" onclick="rejectPayment(${p.id})">✕</button>` : ''}
          </td>
        </tr>`).join('') || '<p>Koi payment nahi.</p>'}
      </table></div>`;
}

async function approvePayment(id, userId, courseId){
  const { error: e1 } = await supa.from('payments').update({ status: 'approved', paid_at: new Date().toISOString() }).eq('id', id);
  if (e1){ msg(e1.message, 'err'); return; }
  const { error: e2 } = await supa.from('enrollments').insert({ user_id: userId, course_id: courseId });
  msg(e2 ? 'Payment approved, par enrollment error: ' + e2.message : 'Approve ho gaya — student ko course access mil gaya!', e2 ? 'err' : 'ok');
  loadPayments();
}
async function rejectPayment(id){
  const { error } = await supa.from('payments').update({ status: 'rejected' }).eq('id', id);
  msg(error ? error.message : 'Reject kar diya', error ? 'err' : 'ok');
  loadPayments();
}

/* ---------- students ---------- */
async function loadStudents(){
  const { data: students } = await supa.from('profiles').select('*').order('created_at', { ascending: false });
  const { data: enrolls } = await supa.from('enrollments').select('user_id, courses(title)');
  const byUser = {};
  (enrolls || []).forEach(e => { (byUser[e.user_id] = byUser[e.user_id] || []).push(e.courses ? e.courses.title : '#' + e.course_id); });
  document.getElementById('content').innerHTML = `
    <div class="msg" id="cMsg"></div>
    <div class="card"><h3>Students (${(students || []).length})</h3>
      <table><tr><th>Name</th><th>Role</th><th>Joined</th><th>Courses</th></tr>
      ${(students || []).map(s => `
        <tr>
          <td><b>${esc(s.full_name || '—')}</b><br><small style="color:var(--muted)">${esc((s.id || '').slice(0, 8))}</small></td>
          <td><span class="pill ${s.role === 'admin' ? 'blue' : ''}">${esc(s.role || 'student')}</span></td>
          <td>${new Date(s.created_at).toLocaleDateString('hi-IN')}</td>
          <td>${(byUser[s.id] || []).join(', ') || '—'}</td>
        </tr>`).join('')}
      </table></div>`;
}

/* ---------- settings ---------- */
async function loadSettings(){
  const { data } = await supa.from('app_settings').select('value').eq('key', 'upi_id').maybeSingle();
  const cur = data ? data.value : '';
  document.getElementById('content').innerHTML = `
    <div class="msg" id="cMsg"></div>
    <div class="card"><h3>⚙️ Payment settings</h3>
      <div class="field"><label>UPI ID (payments is ID par aayenge)</label><input id="upiInput" value="${esc(cur)}" placeholder="e.g. examkeyclub@upi"></div>
      <button class="wideBtn" onclick="saveUpi()">Save</button>
      <p style="font-size:13px;color:var(--muted);margin-top:10px">Yahi ID students ko payment ke waqt QR ke saath dikhega. Isse badalne par naye payments naye ID par aayenge.</p>
    </div>`;
}
async function saveUpi(){
  const value = document.getElementById('upiInput').value.trim();
  if (!value){ msg('UPI ID daalein', 'err'); return; }
  const { error } = await supa.from('app_settings').upsert({ key: 'upi_id', value });
  msg(error ? error.message : 'UPI ID save ho gaya!', error ? 'err' : 'ok');
}

boot();
