/* فایل اصلی عملکرد برنامه
   - داده‌های درس‌ها در lessonData
   - رندر پویا در صفحه
   - مدیریت تمرین، امتیاز، نشان‌ها با localStorage
*/

const lessonData = [
  {
    id: "moadel",
    title: "معادله و نامعادله",
    summary: "معادله یعنی عبارتی که دو طرف آن با هم مساوی‌اند. حل معادله یعنی پیدا کردن مقدار مجهول که تساوی برقرار شود.",
    examples: [
      "مثال: 2x + 3 = 11 → 2x = 8 → x = 4",
      "مثال: 3(x - 2) = 9 → x - 2 = 3 → x = 5"
    ],
    exercises: [
      {type:"input", q:"2x + 5 = 13، x = ؟", a:"4"},
      {type:"mcq", q:"معادله 3x = 12، مقدار x چند است؟", options:["2","3","4","6"], a:"4"}
    ]
  },
  {
    id: "adad",
    title: "اعداد صحیح و گویا",
    summary: "اعداد صحیح: {...,-2,-1,0,1,2,...} اعداد گویا: کسری که صورت و مخرج عدد صحیح دارند.",
    examples: ["مثال: −3 + 5 = 2","مثال: 3/4 یک عدد گویاست"],
    exercises: [
      {type:"input", q:"-7 + 10 = ؟", a:"3"},
      {type:"mcq", q:"کدام عدد گویا نیست؟", options:["1/3","√2","-5","4/7"], a:"√2"}
    ]
  },
  {
    id: "hendese",
    title: "هندسه: زاویه‌ها و مثلث‌ها",
    summary: "مجموع زوایای هر مثلث 180 درجه است. انواع مثلث براساس زوایا و اضلاع تقسیم می‌شوند.",
    examples: ["مثال: اگر دو زاویه 70 و 50 باشند، زاویه سوم = 60"],
    exercises: [
      {type:"input", q:"زاویه‌های مثلث: 65 و 45، زاویه سوم؟", a:"70"},
      {type:"mcq", q:"مجموع زوایای مثلث چقدر است؟", options:["90","180","360","270"], a:"180"}
    ]
  },
  // می‌تونی درس‌های بیشتری اینجا اضافه کنی
];

/* ---------- وضعیت و ذخیره ---------- */
const STORAGE_KEY = "math7_progress_v1";
let state = {
  score: 0,
  level: 1,
  completed: {}, // {lessonId: true}
  badges: {}, // badgeId: true
  streak: 0
};

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){
    try{ Object.assign(state, JSON.parse(raw)); }
    catch(e){ console.warn("خطا در بارگذاری پیشرفت"); }
  }
}

function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

/* ---------- رندر لیست درس‌ها ---------- */
const lessonsListEl = document.getElementById("lessonsList");
const lessonTitle = document.getElementById("lessonTitle");
const lessonSummary = document.getElementById("lessonSummary");
const examplesEl = document.getElementById("examples");
const exerciseArea = document.getElementById("exerciseArea");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const badgesContainer = document.getElementById("badgesContainer");
const timerEl = document.getElementById("timer");

let currentLesson = null;
let currentExerciseIndex = 0;
let questionStart = null;
let questionTimerInterval = null;

function init(){
  loadState();
  renderLessonList();
  updateUI();
  // پیش‌فرض درس اول
  openLesson(lessonData[0].id);
  attachButtons();
}
function renderLessonList(){
  lessonsListEl.innerHTML = "";
  lessonData.forEach(lesson=>{
    const el = document.createElement("div");
    el.className = "lesson-item" + (state.completed[lesson.id] ? " completed" : "");
    el.innerText = lesson.title;
    el.onclick = ()=> openLesson(lesson.id);
    el.id = "lesson_"+lesson.id;
    lessonsListEl.appendChild(el);
  });
}
function openLesson(id){
  const lesson = lessonData.find(l=>l.id===id);
  if(!lesson) return;
  currentLesson = lesson;
  currentExerciseIndex = 0;
  lessonTitle.innerText = lesson.title;
  lessonSummary.innerHTML = `<p>${lesson.summary}</p>`;
  examplesEl.innerHTML = "<h4>مثال‌ها</h4>";
  lesson.examples.forEach(ex=>{
    const p = document.createElement("p"); p.innerText = ex; examplesEl.appendChild(p);
  });
  exerciseArea.innerHTML = "";
  renderExerciseIntro();
  highlightActiveLesson();
  resetTimerDisplay();
}
function highlightActiveLesson(){
  lessonData.forEach(l=>{
    const el = document.getElementById("lesson_"+l.id);
    if(el) el.classList.toggle("active", l.id===currentLesson.id);
  });
}

function renderExerciseIntro(){
  exerciseArea.innerHTML = `
    <h3>تمرین‌ها</h3>
    <p>تعداد تمرین‌ها: ${currentLesson.exercises.length}</p>
    <p>وقتی آماده‌ای «شروع تمرین» را بزن.</p>
  `;
}

/* ---------- اجرای تمرین ---------- */
document.getElementById("startQuizBtn").onclick = startQuiz;
document.getElementById("nextLessonBtn").onclick = ()=>{
  // باز کردن درس بعدی
  const idx = lessonData.findIndex(l=>l.id===currentLesson.id);
  const next = lessonData[idx+1] || lessonData[0];
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
  if(currentExerciseIndex >= currentLesson.exercises.length){
    // تمام شد
    completeLesson(currentLesson.id);
    exerciseArea.innerHTML = `<h3>تبریک! این درس تمام شد.</h3><p>امتیاز فعلی: ${state.score}</p>`;
    updateUI();
    return;
  }

  const ex = currentLesson.exercises[currentExerciseIndex];
  exerciseArea.innerHTML = "";
  const qEl = document.createElement("div");
  qEl.innerHTML = `<h4>سوال ${currentExerciseIndex+1}:</h4><p>${ex.q}</p>`;
  exerciseArea.appendChild(qEl);

  // زمان‌بندی
  questionStart = Date.now();
  startTimer(60); // حداکثر 60 ثانیه نمایش

  if(ex.type === "input"){
    const input = document.createElement("input"); input.type="text"; input.id="answerInput";
    input.placeholder = "جواب را بنویس";
    const btn = document.createElement("button"); btn.className="btn"; btn.innerText="ارسال";
    btn.onclick = ()=> checkAnswerInput(ex, input.value);
    exerciseArea.appendChild(input); exerciseArea.appendChild(btn);
  } else if(ex.type === "mcq"){
    ex.options.forEach(opt=>{
      const op = document.createElement("div");
      op.className = "option";
      op.innerText = opt;
      op.onclick = ()=> checkAnswerMCQ(ex, opt, op);
      exerciseArea.appendChild(op);
    });
  }
}

function checkAnswerInput(ex, userAnswer){
  const correct = (userAnswer+"").trim();
  const isCorrect = correct == ex.a; // مقایسه غیر سخت‌گیرانه
  handleAnswerResult(isCorrect);
}

function checkAnswerMCQ(ex, opt, el){
  // نشان‌گذاری گزینه
  if(opt === ex.a){
    el.classList.add("correct");
    handleAnswerResult(true);
  } else {
    el.classList.add("wrong");
    // علامت گزینه درست
    Array.from(document.getElementsByClassName("option")).forEach(o=>{
      if(o.innerText === ex.a) o.classList.add("correct");
    });
    handleAnswerResult(false);
  }
}

function handleAnswerResult(isCorrect){
  clearInterval(questionTimerInterval);
  const elapsed = (Date.now() - questionStart)/1000; // ثانیه
  let delta = isCorrect ? 10 : -3;
  if(isCorrect && elapsed < 10) delta += 5; // جایزه پاسخ سریع
  state.score = Math.max(0, state.score + delta);
  if(isCorrect) state.streak = (state.streak || 0) + 1;
  else state.streak = 0;

  // جایزه برای 5 پاسخ درست متوالی
  if(state.streak === 5){
    state.badges["streak5"] = true;
  }

  // علامت درس تمام شده وقتی همه سوالات حل شده
  currentExerciseIndex++;
  if(currentExerciseIndex >= currentLesson.exercises.length){
    state.completed[currentLesson.id] = true;
  }

  saveState();
  updateUI();

  // نمایش بازخورد کوتاه
  const msg = isCorrect ? `✅ درست! (${delta>0? '+'+delta: delta})` : `❌ غلط! (${delta})`;
  const fb = document.createElement("div"); fb.style.marginTop = "10px"; fb.innerHTML = `<strong>${msg}</strong>`;
  exerciseArea.appendChild(fb);

  // بعد از 1.2 ثانیه سوال بعدی
  setTimeout(()=> nextQuestion(), 1200);
}

/* ---------- درس کامل شد ---------- */
function completeLesson(id){
  state.completed[id] = true;
  // سطح (level) بر اساس تعداد درس‌های کامل
  const done = Object.keys(state.completed).length;
  state.level = 1 + Math.floor(done / 2);
  // نشان تمام کردن چند درس
  if(done >= 3) state.badges["multi3"] = true;
  saveState();
  renderLessonList();
}

/* ---------- تایمر ---------- */
function startTimer(seconds){
  let rem = seconds;
  timerEl.innerText = formatTime(rem);
  questionTimerInterval = setInterval(()=>{
    rem--;
    timerEl.innerText = formatTime(rem);
    if(rem <= 0){
      clearInterval(questionTimerInterval);
      // خودکار نمره منفی و رفتن سوال بعدی
      handleAnswerResult(false);
    }
  }, 1000);
}
function resetTimerDisplay(){ timerEl.innerText = "۰۰:۰۰"; }
function formatTime(s){
  if(s < 0) s = 0;
  const mm = Math.floor(s/60); const ss = s%60;
  return `${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
}

/* ---------- UI و بروزرسانی ---------- */
function updateUI(){
  scoreEl.innerText = state.score;
  levelEl.innerText = state.level;
  // progress
  const total = lessonData.length;
  const done = Object.keys(state.completed).length;
  const pct = Math.round((done/total)*100);
  progressFill.style.width = pct + "%";
  progressText.innerText = pct + "%";

  renderBadges();
  renderLessonList();
}

function renderBadges(){
  badgesContainer.innerHTML = "";
  for(const [k,v] of Object.entries(state.badges)){
    if(v){
      const b = document.createElement("div"); b.className="badge"; b.innerText = badgeLabel(k);
      badgesContainer.appendChild(b);
    }
  }
}
function badgeLabel(id){
  if(id==="streak5") return "۵ پاسخ درست متوالی";
  if(id==="multi3") return "۳ درس کامل";
  return id;
}

/* ---------- دکمه‌ها و امکانات اضافی ---------- */
function attachButtons(){
  document.getElementById("resetProgressBtn").onclick = ()=>{
    if(confirm("آیا مطمئنی می‌خواهی همهٔ پیشرفت پاک شود؟")){
      localStorage.removeItem(STORAGE_KEY);
      state = {score:0,level:1,completed:{},badges:{},streak:0};
      saveState(); updateUI(); openLesson(lessonData[0].id);
    }
  };

  document.getElementById("exportBtn").onclick = ()=>{
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "math7_progress.json"; a.click();
    URL.revokeObjectURL(url);
  };

  document.getElementById("importBtn").onclick = ()=>{
    document.getElementById("importFile").click();
  };
  document.getElementById("importFile").onchange = (e)=>{
    const f = e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = ev=>{
      try{
        const parsed = JSON.parse(ev.target.result);
        // اعتبارسنجی مختصر
        if(typeof parsed.score !== "undefined"){
          state = parsed; saveState(); updateUI();
          alert("پیشرفت با موفقیت بارگذاری شد.");
        } else alert("پرونده نامعتبر است.");
      } catch(err){ alert("خطا در خواندن فایل."); }
    };
    reader.readAsText(f);
  };
}

/* ---------- شروع ---------- */
init();