/* script.js
   - دروس از منابع معتبر گردآوری شده (خلاصه)
   - تمرین‌ها و تست‌ها تعاملی و امتیازدهی
   - ذخیره در localStorage
*/

const STORAGE_KEY = "math7_riazi_progress_v1";

const lessons = [
  {
    id: "strategy",
    title: "راهبردهای حل مسئله",
    summary: `
      <p><strong>مراحل حل مسئله</strong> — ۱) فهم مسئله؛ ۲) طرح نقشه؛ ۳) اجرا؛ ۴) بررسی نتیجه.</p>
      <p><strong>تکنیک‌ها:</strong> رسم شکل، جدول‌سازی، حدس و بررسی، تبدیل به معادله، ساده‌سازی مراحل، تست با عدد نمونه.</p>
      <p><strong>نمونه:</strong> در یک کلاس ۴۰ نفر است؛ ۱۲ نفر فوتبالیست‌اند. چند نفر فوتبالیست نیستند؟ → ۴۰ − ۱۲ = ۲۸.</p>
    `,
    examples: [
      "مثال: اگر 3 بسته هرکدام 4 مداد داشته باشد، تعداد مدادها = 3 × 4 = 12.",
      "مثال: برای تقسیم مساوی 15 سیب بین 5 نفر: 15 ÷ 5 = 3 هر نفر."
    ],
    exercises: [
      { type: "input", q: "کدام روش برای مسئلهٔ «تقسیم مساوی» مناسب است؟", a: "تقسیم, تقسیم کردن" },
      { type: "mcq", q: "برای مسئلهٔ «چند برابر؟» کدام روش مناسب است؟", options: ["تقسیم","نسبت","ضرب"], a: "ضرب" }
    ]
  },
  {
    id: "integers",
    title: "اعداد صحیح (مثبت و منفی)",
    summary: `
      <p>اعداد صحیح شامل اعداد مثبت، صفر و اعداد منفی هستند. برای مقایسه، هر عددی که در محور اعداد به سمت راست باشد بزرگ‌تر است.</p>
      <p>قاعده‌ها: جمع هم‌علامت → جمع قدر مطلق‌ها با همان علامت. جمع مخالف علامت → تفریق قدر مطلق‌ها، علامت عدد بزرگ‌تر حفظ می‌شود.</p>
    `,
    examples: [
      "مثال: (+3) + (+5) = +8",
      "مثال: (-4) + (-6) = -10",
      "مثال: (+7) + (-3) = +4",
      "مثال: (-9) + (+2) = -7"
    ],
    exercises: [
      { type: "input", q: "حاصل ۷ − ۱۲ ؟", a: "-5" },
      { type: "mcq", q: "کدام درست است؟", options: ["-2 > -5","-5 > -2","-5 = -2"], a: "-2 > -5" }
    ]
  },
  {
    id: "add_sub",
    title: "جمع و تفریق",
    summary: `
      <p>جمع و تفریق اعداد صحیح را با قواعد علامت‌ها انجام دهید. همچنین تفریق را می‌توان به صورت جمع با عدد مخالف نوشت: a - b = a + (-b).</p>
    `,
    examples: [
      "مثال: 5 - 8 = 5 + (-8) = -3",
      "مثال: (-4) - (-2) = -4 + 2 = -2"
    ],
    exercises: [
      { type: "mcq", q: "حاصل 3 + (-7) ؟", options: ["4","-4","10"], a: "-4" },
      { type: "input", q: "حاصل (-6) - 4 = ؟", a: "-10" }
    ]
  },
  {
    id: "mul_div",
    title: "ضرب و تقسیم (قواعد علامت)",
    summary: `
      <p>در ضرب و تقسیم: علامت‌ها طبق قانون زیر هستند: (+)×(+) = (+), (+)×(-) = (-), (-)×(-) = (+). همین قانون برای تقسیم هم صدق می‌کند.</p>
    `,
    examples: [
      "مثال: 3 × (-4) = -12",
      "مثال: (-6) ÷ (-2) = 3"
    ],
    exercises: [
      { type: "mcq", q: "حاصل 3 × -5 ؟", options: ["15","-15","-8"], a: "-15" },
      { type: "input", q: "حاصل (-12) ÷ (-3) = ؟", a: "4" }
    ]
  }
];

/* ---------- state ---------- */
let state = {
  score: 0,
  completed: {}, // lessonId:true
  badges: {}
};

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw) {
    try{ Object.assign(state, JSON.parse(raw)); }
    catch(e){ console.warn("خطا در بارگذاری پیشرفت"); }
  }
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

/* ---------- render lesson list ---------- */
const lessonListEl = document.getElementById("lessonList");
const lessonTitleEl = document.getElementById("lessonTitle");
const lessonSummaryEl = document.getElementById("lessonSummary");
const examplesEl = document.getElementById("examples");
const exerciseArea = document.getElementById("exerciseArea");
const scoreEl = document.getElementById("score");
const progressPercentEl = document.getElementById("progressPercent");
const badgesContainer = document.getElementById("badgesContainer");
const timerEl = document.getElementById("timer");

let currentLesson = null;
let currentExerciseIndex = 0;
let questionStart = 0;
let questionTimerInterval = null;

function init(){
  loadState();
  renderLessonList();
  updateUI();
  // باز کردن اولین درس پیش‌فرض
  openLesson(lessons[0].id);
  attachButtons();
}
function renderLessonList(){
  lessonListEl.innerHTML = "";
  lessons.forEach(l=>{
    const d = document.createElement("div");
    d.className = "lesson-item";
    if(state.completed[l.id]) d.classList.add("done");
    d.innerText = l.title;
    d.onclick = ()=> openLesson(l.id);
    d.id = "li_"+l.id;
    lessonListEl.appendChild(d);
  });
}

/* ---------- open lesson ---------- */
function openLesson(id){
  const L = lessons.find(x=>x.id===id);
  if(!L) return;
  currentLesson = L;
  currentExerciseIndex = 0;
  highlightActive();
  lessonTitleEl.innerText = L.title;
  lessonSummaryEl.innerHTML = L.summary;

  examplesEl.innerHTML = "<h4>مثال‌ها</h4>";
  L.examples.forEach(e=>{
    const p = document.createElement("p"); p.innerText = e; examplesEl.appendChild(p);
  });

  exerciseArea.innerHTML = `<h4>تمرین‌ها</h4><p>برای شروع آزمون دکمهٔ «شروع آزمون درس» را بزن.</p>`;
  resetTimer();
}

/* ---------- quiz flow ---------- */
document.getElementById("startQuizBtn").onclick = startQuiz;
document.getElementById("nextLessonBtn").onclick = ()=>{
  const idx = lessons.findIndex(l=>l.id===currentLesson.id);
  const next = lessons[idx+1] || lessons[0];
  openLesson(next.id);
};

function startQuiz(){
  currentExerciseIndex = 0;
  state.streak = 0;
  saveState();
  nextQuestion();
}

function nextQuestion(){
  clearInterval(questionTimerInterval);
  const exList = currentLesson.exercises;
  if(currentExerciseIndex >= exList.length){
    finishLesson(currentLesson.id);
    exerciseArea.innerHTML = `<h3>درس کامل شد ✅</h3><p>امتیاز فعلی: ${state.score}</p>`;
    updateUI();
    return;
  }
  const ex = exList[currentExerciseIndex];
  exerciseArea.innerHTML = `<h4>سوال ${currentExerciseIndex+1}:</h4><p>${ex.q}</p>`;
  // start timer for question
  questionStart = Date.now();
  startTimer(60);

  if(ex.type === "input"){
    const input = document.createElement("input"); input.type="text"; input.id="answerInput"; input.placeholder="جواب را بنویس";
    const btn = document.createElement("button"); btn.className="btn"; btn.innerText="ارسال";
    btn.onclick = ()=> checkInputAnswer(ex, input.value, btn);
    exerciseArea.appendChild(input); exerciseArea.appendChild(btn);
  } else if(ex.type === "mcq"){
    ex.options.forEach(opt=>{
      const div = document.createElement("div"); div.className="option"; div.innerText = opt;
      div.onclick = ()=> checkMCQAnswer(ex, opt, div);
      exerciseArea.appendChild(div);
    });
  }
}

function checkInputAnswer(ex, val, btn){
  const user = (val+"").trim();
  const correct = (ex.a+"").trim();
  const isCorrect = user == correct;
  handleResult(isCorrect);
}

function checkMCQAnswer(ex, opt, el){
  if(opt === ex.a){
    el.classList.add("correct");
    handleResult(true);
  } else {
    el.classList.add("wrong");
    // highlight correct
    Array.from(document.querySelectorAll(".option")).forEach(o=>{
      if(o.innerText === ex.a) o.classList.add("correct");
    });
    handleResult(false);
  }
}

function handleResult(isCorrect){
  clearInterval(questionTimerInterval);
  const elapsed = (Date.now() - questionStart)/1000;
  let delta = isCorrect ? 10 : -3;
  if(isCorrect && elapsed < 10) delta += 5;
  state.score = Math.max(0, state.score + delta);
  if(isCorrect) state.streak = (state.streak||0) + 1; else state.streak = 0;

  // badge for streak 5
  if(state.streak === 5) state.badges["streak5"] = true;

  // move to next
  currentExerciseIndex++;
  if(currentExerciseIndex >= currentLesson.exercises.length) state.completed[currentLesson.id] = true;

  saveState();
  updateUI();

  const fb = document.createElement("div"); fb.style.marginTop="10px";
  fb.innerHTML = isCorrect ? `✅ درست! (${delta>0? '+'+delta: delta})` : `❌ غلط! (${delta})`;
  exerciseArea.appendChild(fb);

  setTimeout(()=> nextQuestion(), 1000);
}

/* ---------- finish lesson ---------- */
function finishLesson(id){
  state.completed[id] = true;
  saveState();
  renderLessonList();
}

/* ---------- timer ---------- */
function startTimer(seconds){
  let rem = seconds;
  timerEl.innerText = formatTime(rem);
  questionTimerInterval = setInterval(()=>{
    rem--;
    timerEl.innerText = formatTime(rem);
    if(rem <= 0){
      clearInterval(questionTimerInterval);
      handleResult(false);
    }
  },1000);
}
function resetTimer(){ clearInterval(questionTimerInterval); timerEl.innerText = "۰۰:۰۰"; }
function formatTime(s){ if(s<0)s=0; const mm=Math.floor(s/60); const ss=s%60; return `${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`; }

/* ---------- UI updates ---------- */
function updateUI(){
  scoreEl.innerText = state.score;
  // progress %
  const total = lessons.length;
  const done = Object.keys(state.completed).length;
  const pct = Math.round((done/total)*100);
  progressPercentEl.innerText = pct + "%";
  renderBadges();
  renderLessonList();
}
function renderBadges(){
  badgesContainer.innerHTML = "";
  for(const k in state.badges){
    if(state.badges[k]){
      const b = document.createElement("div"); b.className="badge"; b.innerText = badgeLabel(k);
      badgesContainer.appendChild(b);
    }
  }
}
function badgeLabel(id){ if(id==="streak5") return "۵ پاسخ درست متوالی"; return id; }
function highlightActive(){
  lessons.forEach(l=>{
    const el = document.getElementById("li_"+l.id);
    if(el) el.classList.toggle("active", currentLesson && currentLesson.id===l.id);
  });
}

/* ---------- export / reset ---------- */
function attachButtons(){
  document.getElementById("resetBtn").onclick = ()=>{
    if(confirm("آیا مطمئنی می‌خواهی همهٔ پیشرفت پاک شود؟")){
      localStorage.removeItem(STORAGE_KEY);
      state = {score:0,completed:{},badges:{}};
      saveState(); updateUI(); openLesson(lessons[0].id);
    }
  };
  document.getElementById("exportBtn").onclick = ()=>{
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "progress_math7.json"; a.click();
    URL.revokeObjectURL(url);
  };
}

/* ---------- init ---------- */
init();
