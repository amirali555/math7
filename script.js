/* script.js
   ریاضی هفتم — فصل 1 تا 5
   - بارگذاری متن هر فصل (متن طولانی)
   - نمایش ویدیوهای آپارات
   - آزمون کوتاه برای هر فصل
   - امتیاز و ذخیره در localStorage
   - انیمیشن ساده و تایپ‌رایتر
   - مناسب نمایش در موبایل و WebViewer (MIT App Inventor)
*/

/* ---------- حالت/حافظه ---------- */
const STORAGE_KEY = "riazi7_state_v1";
let state = {
  score: 0,
  level: 1,
  progress: {},   // { ch1: true, ch1_q1: true, ... }
  lastPage: "home"
};

/* ---------- داده‌های فصل‌ها و آزمون ---------- */
/* هر فصل شامل: id, title, longText (HTML string), videos (array iframe src), quiz (array) */
const chapters = [
  {
    id: "f1",
    title: "فصل 1 — راهبردهای حل مسئله و عددها",
    longText: generateLongText1(), // تابع پایین تعریف شده
    videos: [
      // نمونه‌های embed آپارات — در صورت نیاز شناسه را با ویدیوی واقعی جایگزین کن
      "https://www.aparat.com/video/video/embed/videohash/H8F4K/vt/frame",
      "https://www.aparat.com/video/video/embed/videohash/d2K8X/vt/frame"
    ],
    quiz: [
      { id: "f1_q1", q: "جمله بعدی دنباله 4,9,14,19 چیست؟", options: ["22","24","26"], a: "24" },
      { id: "f1_q2", q: "کدام عدد بزرگتر است؟ 307 ، 371 ، 299", options: ["307","371","299"], a: "371" }
    ]
  },
  {
    id: "f2",
    title: "فصل 2 — عددهای صحیح",
    longText: generateLongText2(),
    videos: [
      "https://www.aparat.com/video/video/embed/videohash/X9QeT/vt/frame",
      "https://www.aparat.com/video/video/embed/videohash/placeholder1/vt/frame"
    ],
    quiz: [
      { id: "f2_q1", q: "حاصل -4 + 9 چند است؟", options: ["5","-5"], a: "5" },
      { id: "f2_q2", q: "مجموع -7 و -3 ؟", options: ["-10","4"], a: "-10" }
    ]
  },
  {
    id: "f3",
    title: "فصل 3 — جبر و معادله",
    longText: generateLongText3(),
    videos: [
      "https://www.aparat.com/video/video/embed/videohash/Y3RkP/vt/frame"
    ],
    quiz: [
      { id: "f3_q1", q: "حل کن: x + 7 = 12 → x = ?", options: ["5","3"], a: "5" },
      { id: "f3_q2", q: "2x = 10 → x = ?", options: ["5","4"], a: "5" }
    ]
  },
  {
    id: "f4",
    title: "فصل 4 — نسبت، تناسب و درصد",
    longText: generateLongText4(),
    videos: [
      "https://www.aparat.com/video/video/embed/videohash/placeholder5/vt/frame"
    ],
    quiz: [
      { id: "f4_q1", q: "20% از 200 چند است؟", options: ["20","40","60"], a: "40" },
      { id: "f4_q2", q: "اگر 2:x = 4:6 , x = ?", options: ["3","4"], a: "3" }
    ]
  },
  {
    id: "f5",
    title: "فصل 5 — آمار و نمایش داده‌ها",
    longText: generateLongText5(),
    videos: [
      "https://www.aparat.com/video/video/embed/videohash/placeholder7/vt/frame"
    ],
    quiz: [
      { id: "f5_q1", q: "میانگین 2,4,6 چیست؟", options: ["4","3"], a: "4" },
      { id: "f5_q2", q: "اگر داده ها 2,3,3,4 → نما چیست؟", options: ["3","2"], a: "3" }
    ]
  }
];

/* ---------- بارگذاری اولیه ---------- */
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  renderInitialPages();
  attachGlobalHandlers();
  // اگر صفحه آخر بازشده وجود داره نمایش بده
  openPage(state.lastPage || "home");
  updateScoreUI();
});

/* ---------- ذخیره/بارگذاری state ---------- */
function loadState(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) {
      const parsed = JSON.parse(raw);
      state = Object.assign(state, parsed);
    }
  } catch(e) {
    console.warn("loadState error", e);
  }
}
function saveState(){
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch(e){
    console.warn("saveState error", e);
  }
}

/* ---------- رندر صفحات ابتدایی ---------- */
function renderInitialPages(){
  // پر کردن متن هر فصل در المان های موجود در HTML (فایل index.html)
  chapters.forEach(ch => {
    const el = document.getElementById(ch.id);
    if(el){
      // ساختار: عنوان، متن طولانی، ویدیوها، دکمه نمایش متن/تایپ
      el.innerHTML = `
        <h2>${escapeHtml(ch.title)}</h2>
        <div class="lead" id="${ch.id}_lead"></div>
        <div class="videos" id="${ch.id}_videos"></div>
        <div class="examples" id="${ch.id}_examples"></div>
        <div class="quizBox" id="${ch.id}_quiz"></div>
      `;
      // متن را تایپ‌کن نمایش می‌دهیم
      typeWriter(document.getElementById(ch.id + "_lead"), ch.longText, 3);
      // ویدیوها
      const vwrap = document.getElementById(ch.id + "_videos");
      if(vwrap){
        ch.videos.forEach(src => {
          const ifr = document.createElement("iframe");
          ifr.src = src;
          ifr.setAttribute("allowfullscreen", "");
          ifr.loading = "lazy";
          vwrap.appendChild(ifr);
        });
      }
      // مثال‌ها و آزمون را رندر می‌کنیم
      const exEl = document.getElementById(ch.id + "_examples");
      if(exEl){
        exEl.innerHTML = `<h3>مثال‌ها</h3><p>مثال‌های حل‌شده و نکات کاربردی در هر بخش.</p>`;
      }
      renderQuizForChapter(ch);
    }
  });
}

/* ---------- رندر آزمون فصل ---------- */
function renderQuizForChapter(ch){
  const qEl = document.getElementById(ch.id + "_quiz");
  if(!qEl) return;
  qEl.innerHTML = `<h3>تمرین‌ها و آزمون‌های فصل</h3>`;
  ch.quiz.forEach(q=>{
    const qbox = document.createElement("div");
    qbox.className = "quizQ";
    qbox.innerHTML = `<p>${escapeHtml(q.q)}</p>`;
    const optsDiv = document.createElement("div");
    optsDiv.className = "qOptions";
    q.options.forEach(opt=>{
      const btn = document.createElement("button");
      btn.className = "qBtn";
      btn.innerText = opt;
      btn.onclick = ()=> handleAnswer(btn, ch.id, q.id, q.a);
      optsDiv.appendChild(btn);
    });
    qbox.appendChild(optsDiv);
    qEl.appendChild(qbox);
  });
}

/* ---------- کنترل پاسخ‌ها ---------- */
function handleAnswer(btn, chapterId, qid, correct){
  // جلوگیری از دوبار زدن
  const parent = btn.parentElement;
  Array.from(parent.querySelectorAll("button")).forEach(b => b.disabled = true);
  const chosen = btn.innerText.trim();
  if(chosen === correct){
    btn.classList.add("correct");
    state.score += 10;
    notify("پاسخ درست! +10 امتیاز", "ok");
  } else {
    btn.classList.add("wrong");
    state.score = Math.max(0, state.score - 3);
    notify("پاسخ نادرست. −3 امتیاز", "err");
    // نمایش گزینه درست
    Array.from(parent.querySelectorAll("button")).forEach(b => {
      if(b.innerText.trim() === correct) b.classList.add("correct");
    });
  }
  // ثبت پیشرفت
  state.progress[chapterId + "_" + qid] = true;
  saveProgress();
  updateScoreUI();
}

/* ---------- ذخیره پیشرفت ---------- */
function saveProgress(){
  saveState();
}

/* ---------- تایپ‌رایتر (نمایش متن بلند به صورت تدریجی) ---------- */
function typeWriter(container, htmlString, speed = 2){
  // اگر container متن HTML می‌گیرد، ما متن خام را به پاراگراف‌ها تبدیل می‌کنیم
  const tmp = document.createElement("div");
  tmp.innerHTML = htmlString;
  const nodes = Array.from(tmp.childNodes);
  container.innerHTML = "";
  let idx = 0;

  function showNext(){
    if(idx >= nodes.length) return;
    const node = nodes[idx];
    const wrapper = document.createElement("div");
    wrapper.className = "tw-block";
    if(node.nodeType === 3){ // textNode
      wrapper.innerText = node.textContent;
      container.appendChild(wrapper);
      idx++;
      setTimeout(showNext, 20 * speed);
    } else {
      wrapper.innerHTML = node.outerHTML;
      container.appendChild(wrapper);
      idx++;
      setTimeout(showNext, 30 * speed);
    }
  }
  showNext();
}

/* ---------- نمایش/تغییر صفحات ---------- */
function openPage(pageId){
  // صفحات: home, videos, lessons, quiz
  document.querySelectorAll(".page").forEach(p => p.classList.remove("show"));
  const el = document.getElementById(pageId);
  if(el) el.classList.add("show");
  state.lastPage = pageId;
  saveState();
}

/* ---------- نمایش/پنهان کردن متن کلیک شده در لیست درس‌ها ---------- */
function toggleText(pId){
  const p = document.getElementById(pId);
  if(!p) return;
  if(p.classList.contains("hidden")){
    p.classList.remove("hidden");
    // اگر متن هنوز خالیه، مقدارش را از chapters بارگذاری کن
    if(p.innerHTML.trim() === ""){
      const ch = chapters.find(c => c.id === pId);
      if(ch) p.innerHTML = ch.longText;
    }
    // اسکرول نرم به آن
    p.scrollIntoView({behavior: "smooth", block: "center"});
  } else {
    p.classList.add("hidden");
  }
}

/* ---------- شروع آزمون کلی (صفحه quiz) ---------- */
function startQuiz(){
  // آزمون: سؤالات منتخب از هر فصل (یکی از هر فصل)
  const qbox = document.getElementById("quizBox");
  qbox.innerHTML = "<h3>آزمون ترکیبی کوتاه</h3>";
  const selection = [];
  chapters.forEach(ch => {
    if(ch.quiz && ch.quiz.length) selection.push(ch.quiz[0]); // اولین سؤال فصل
  });
  selection.forEach((q, idx) => {
    const div = document.createElement("div");
    div.className = "quizQ";
    div.innerHTML = `<p><b>سؤال ${idx+1}:</b> ${escapeHtml(q.q)}</p>`;
    const opts = document.createElement("div");
    opts.className = "qOptions";
    q.options.forEach(opt => {
      const b = document.createElement("button");
      b.className = "qBtn";
      b.innerText = opt;
      b.onclick = () => {
        handleAnswer(b, "exam", q.id, q.a);
        // بعد از پاسخ، غیرفعال کردن بقیه پرسش‌ها؟ نه، اجازه ادامه
      };
      opts.appendChild(b);
    });
    div.appendChild(opts);
    qbox.appendChild(div);
  });
  openPage("quiz");
}

/* ---------- نمایش امتیاز در UI ---------- */
function updateScoreUI(){
  const sEl = document.getElementById("score");
  if(sEl) sEl.innerText = state.score;
  // level update: هر 50 امتیاز یک level
  const newLevel = Math.floor(state.score / 50) + 1;
  if(newLevel !== state.level){
    state.level = newLevel;
    notify("تبریک! سطح شما " + state.level + " شد.", "ok");
  }
  saveState();
}

/* ---------- پیامک/اعلان ساده ---------- */
function notify(text, type = "info"){
  // type: ok, err, info
  const div = document.createElement("div");
  div.className = "site-notify " + type;
  div.innerText = text;
  document.body.appendChild(div);
  div.style.opacity = "1";
  setTimeout(()=> { div.style.opacity = "0"; setTimeout(()=> div.remove(), 600); }, 2500);
}

/* ---------- ابزارها ---------- */
function escapeHtml(s){
  if(!s) return "";
  return s;
}

/* ---------- اتصال handler های ساده ---------- */
function attachGlobalHandlers(){
  // دکمه های منو در HTML بصورت inline هستند؛ اینجا فقط رویداد جستجو را تنظیم می‌کنیم اگر وجود داشته باشد
  const search = document.getElementById("search");
  if(search){
    search.addEventListener("input", (e)=>{
      const q = e.target.value.trim().toLowerCase();
      // پنهان/نمایش موارد درس در صفحه lessons
      chapters.forEach(ch=>{
        const elTitle = document.querySelector(`#${ch.id}`) || null;
        if(elTitle){
          const show = (ch.title + " " + ch.longText).toLowerCase().includes(q);
          elTitle.style.display = show ? "block" : "none";
        }
      });
    });
  }
  // preloader hide (in case not removed)
  const p = document.getElementById("preloader");
  if(p) setTimeout(()=> p.style.display = "none", 800);
}

/* ---------- توابع تولید متن طولانی برای هر فصل ---------- */
/* این توابع متن‌های آموزشی مفصل تولید می‌کنند (می‌توانی آنها را ویرایش کنی) */

function generateLongText1(){
  // متن فصل 1 — حدود 80-120 خط (تقسیم به پاراگراف‌ها)
  let s = "";
  s += "<p>این فصل درباره شناخت اعداد، ارزش مکانی، ترتیب و الگوهای عددی است. هدف این فصل این است که دانش‌آموز با نحوه خواندن و نوشتن عددهای بزرگ آشنا شده و بتواند الگوها را تشخیص دهد.</p>";
  s += "<p>۱) ارزش مکانی: در عدد ۵۲۴۸ هر رقم یک ارزش دارد: ۸ یکان، ۴ دهگان، ۲ صدگان، ۵ هزارگان. برای جمع و تفریق اعداد چندرقمی از روش ستونی استفاده کنید.</p>";
  s += "<p>۲) تبدیل کلمه به عدد: خواندن اعداد بزرگ نیاز به تمرین دارد. مثال: ۱۲۳۴ = هزار و دویست و سی و چهار.</p>";
  s += "<p>۳) مقایسه اعداد: ابتدا تعداد ارقام را مقایسه کنید. اگر برابر بود از چپ به راست ارقام را مقایسه کنید.</p>";
  s += "<p>۴) الگوهای عددی: اگر اختلاف بین جمله ها ثابت باشد الگوی حسابی است، اگر نسبت بین جمله‌ها ثابت باشد الگوی هندسی است.</p>";
  s += "<p>۵) مسائل کاربردی: کاربرد الگوها و عددها در مسائل روزمره، مانند الگوهای رشد، تقسیم منابع و برنامه‌ریزی.</p>";
  s += "<p>تمرین‌های متنوع و مثال‌های حل‌شده در ادامه آورده شده است که با حل آن‌ها مهارتت افزایش می‌یابد.</p>";
  // چند پاراگراف بیشتر برای طولانی‌تر شدن
  for(let i=0;i<12;i++){
    s += `<p>نکته ${i+1}: تمرین پیوسته و بررسی اشکال رایج. مثال آموزشی: برای تعیین جمله نهم دنباله 2,5,8,... از تفاوت ثابت استفاده کنید.</p>`;
  }
  s += "<p>در پایان این فصل یک آزمون کوتاه وجود دارد که می‌توانید بعد از مطالعه کامل آن را انجام دهید.</p>";
  return s;
}

function generateLongText2(){
  let s = "";
  s += "<p>اعداد صحیح شامل اعداد مثبت، صفر و اعداد منفی هستند. در بسیاری از مسائل روزمره نظیر اختلاف دما و حساب بانکی از اعداد منفی استفاده می‌شود.</p>";
  s += "<p>قاعده‌های جمع و تفریق: جمع اعداد هم‌علامت به معنی جمع قدر مطلق‌ها با حفظ علامت؛ جمع مخالف علامت به معنی تفریق قدر مطلق‌ها و نگه‌داشتن علامت عدد بزرگ‌تر.</p>";
  s += "<p>مثال کاربردی: اگر دما در شب −5°C و صبح +3°C باشد، تغییر دما چقدر است؟</p>";
  for(let i=0;i<10;i++){
    s += `<p>تمرین کاربردی ${i+1}: حل مسأله با استفاده از محور اعداد و نمایش نتیجه مرحله‌به‌مرحله.</p>`;
  }
  s += "<p>در پایان تمرین‌های ترکیبی و مثال‌های واقعی برای تثبیت یادگیری آمده است.</p>";
  return s;
}

function generateLongText3(){
  let s = "";
  s += "<p>جبر و معادله: در این فصل با مفهوم متغیر و نحوهٔ تبدیل مسائل به معادله آشنا می‌شویم. متغیرها نمادهایی هستند که مقدار ناشناخته را نشان می‌دهند و با حل معادله مقدار آن‌ها پیدا می‌شود.</p>";
  s += "<p>روش حل معادلات خطی ساده: برای حل معادله‌های نوع ax + b = c از عملیات معکوس استفاده می‌کنیم تا x تنها شود.</p>";
  for(let i=0;i<10;i++){
    s += `<p>مثال ${i+1}: حل معادله‌های ساده، مسائل کلمه‌ای با معرفی متغیر و بررسی صحت جواب با جایگذاری.</p>`;
  }
  s += "<p>نکات: همواره معادله را چک کنید و جواب را جایگزین کنید تا از درستی آن اطمینان یابید.</p>";
  return s;
}

function generateLongText4(){
  let s = "";
  s += "<p>نسبت و درصد: نسبت بیانگر مقایسهٔ دو مقدار است و تناسب یعنی برقراری تساوی بین دو نسبت. درصد بخش مهمی از مسائل مالی مثل تخفیف و سود است.</p>";
  s += "<p>مثال: تخفیف 20% روی 25000 تومان چگونه محاسبه می‌شود؟</p>";
  for(let i=0;i<10;i++){
    s += `<p>تمرین ${i+1}: تبدیل درصد به کسر و برعکس، حل مسائل تخفیف، سود و درصد افزایشی و کاهشی.</p>`;
  }
  s += "<p>تکنیک‌ها: ضرب متقاطع برای حل تناسب و روش تبدیل درصد به اعشار برای محاسبات سریع.</p>";
  return s;
}

function generateLongText5(){
  let s = "";
  s += "<p>آمار و نمایش داده‌ها: این فصل شامل جمع‌آوری داده، نمایش داده‌ها با نمودار ستونی، محاسبهٔ میانگین، میانه و نما است.</p>";
  s += "<p>مثال: تحلیل نمرات یک کلاس و نمایش آن‌ها بر روی نمودار ستونی و بدست آوردن میانگین و میانه.</p>";
  for(let i=0;i<10;i++){
    s += `<p>فعالیت ${i+1}: جمع‌آوری 10 داده ساده، رسم نمودار و تحلیل نتایج با محاسبه شاخص‌های مرکزی.</p>`;
  }
  s += "<p>این فصل مناسب تمرین پروژه‌ای و جمع‌آوری داده‌های واقعی برای گزارش جشنواره است.</p>";
  return s;
}

/* ---------- ابزار کمکی: پاک کردن localStorage (در صورت نیاز) ---------- */
function hardReset(){
  if(!confirm("آیا می‌خواهید همهٔ داده‌های محلی پاک شوند؟")) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

/* ---------- گوشه‌نشین: نمایش پیشرفت و load ---------- */
function updateProgressBar(){
  const bar = document.getElementById("progress-bar");
  if(!bar) return;
  const total = chapters.length;
  let done = 0;
  chapters.forEach(ch => { if(state.progress[ch.id]) done++; });
  const pct = Math.round((done / total) * 100);
  bar.style.width = pct + "%";
}

/* ---------- فراخوانی پس از هر تغییر وضعیت ---------- */
function updateUI(){
  const scoreEl = document.getElementById("score");
  if(scoreEl) scoreEl.innerText = state.score;
  updateProgressBar();
  saveState();
}

/* ---------- نمایش پیغام ساده ---------- */
function simpleToast(text){
  const t = document.createElement("div");
  t.className = "simple-toast";
  t.innerText = text;
  document.body.appendChild(t);
  setTimeout(()=> t.style.opacity = 0, 2000);
  setTimeout(()=> t.remove(), 2400);
}

/* ---------- expose functions برای HTML inline ---------- */
window.openPage = openPage;
window.toggleText = toggleText;
window.startQuiz = startQuiz;
window.hardReset = hardReset;

/* ---------- یکبار اجرا برای UI اولیه ---------- */
(function init(){
  // وضعیت اولیه UI
  updateUI();
  // renderInitialPages() اجرا شده وقتی DOMContentLoaded فراخوانی شد
})();
