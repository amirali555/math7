/* script.js
 * آموزش کامل پایه ششم، رندر دینامیک، تست‌ها، امتیاز و ذخیره
 */

const STORAGE = "math6_progress_v1";

/* ---------- داده‌های درس (هر درس شامل بخش‌ها، مثال‌ها و تمرین‌ها) ---------- */
const lessons = [
  {
    id:"numbers",
    title:"اعداد و مقایسه‌ها",
    sections:[
      {title:"تعریف و نمایش", text:"اعداد طبیعی: 0,1,2,3... — عدد را می‌توان روی محور اعداد نشان داد. بزرگی: عددی که در محور سمت راست‌تر باشد بزرگ‌تر است."},
      {title:"مقایسه اعداد", text:"برای مقایسه اعداد، ابتدا تعداد رقم‌ها را مقایسه کن. اگر تعداد رقم برابر بود از چپ به راست مقایسۀ رقم‌ها انجام می‌شود."},
      {title:"نکات مهم", text:"اگر عددها یک‌سان نیستند ولی تعداد رقم‌ها برابر است به ترتیب از سمت چپ رقم‌ها را مقایسه کن."}
    ],
    examples:[
      {text:"مثال: کدام بزرگ‌تر است؟  204 یا  198؟ — چون 3 رقم هر دو را داریم، مقایسه از چپ: 2>1 پس 204 بزرگ‌تر است."},
      {text:"مثال: کدام بزرگ‌تر است؟  1500 یا 999؟ — چون 1500 چهار رقمی و 999 سه رقمی، 1500 بزرگ‌تر است."}
    ],
    exercises:[
      {type:"mcq", q:"کدام عدد بزرگ‌تر است؟", options:["307","371","299"], a:"371"},
      {type:"input", q:"حاصل مقایسه: بزرگ‌تر را بنویس (بین 123 و 132):", a:"132"}
    ]
  },

  {
    id:"fractions",
    title:"کسرها و مقایسهٔ کسرها",
    sections:[
      {title:"تعریف کسر", text:"کسر از دو بخش تشکیل می‌شود: صورت (بالا) و مخرج (پایین). کسر نشان‌دهندۀ چند قسمت از کل است."},
      {title:"برابر کردن مخرج", text:"برای مقایسهٔ دو کسر، آن‌ها را هم‌مخرج کن یا به عدد ده‌دهی تبدیل کن."},
      {title:"ساده کردن", text:"کسر را با تقسیم صورت و مخرج بر بیشترین مقسوم علیه مشترک ساده کن."}
    ],
    examples:[
      {text:"مثال: مقایسه 3/4 و 2/3 — هم‌مخرج کنیم: 3/4 = 9/12 , 2/3 = 8/12 → پس 3/4 بزرگ‌تر است."},
      {text:"مثال: ساده کردن 6/8 → تقسیم بر 2 → 3/4."}
    ],
    exercises:[
      {type:"mcq", q:"کدام بزرگ‌تر است؟", options:["2/5","3/7","1/2"], a:"1/2"},
      {type:"input", q:"ساده کن: 8/12 =", a:"2/3"}
    ]
  },

  {
    id:"decimals",
    title:"اعشار و تبدیل کسر به اعشار",
    sections:[
      {title:"تعریف", text:"عدد اعشاری شامل بخش صحیح و بخش اعشاری است: مثال 3.25 — بخش صحیح 3 و بخش اعشاری 25."},
      {title:"تبدیل کسر به اعشار", text:"برای تبدیل کسر با مخرج 10,100,1000 به اعشار، صورت را در جای مناسب بنویس."},
      {title:"مقایسه اعشار", text:"برای مقایسه طول بخش اعشاری را هم‌میزان کن یا با تبدیل به عدد مناسب مقایسه کن."}
    ],
    examples:[
      {text:"مثال: 0.3 = 3/10 ، 0.25 = 25/100 = 1/4."},
      {text:"مثال: مقایسه 0.45 و 0.450 → مساوی هستند."}
    ],
    exercises:[
      {type:"mcq", q:"کدام برابر است با 0.75؟", options:["3/4","2/5","7/10"], a:"3/4"},
      {type:"input", q:"تبدیل کن: 1/5 = ?", a:"0.2"}
    ]
  },

  {
    id:"ratio",
    title:"نسبت و تناسب",
    sections:[
      {title:"نسبت چیست؟", text:"نسبت a به b یعنی a/b. اگر a:b = c:d آن‌گاه تناسب برقرار است."},
      {title:"حل مسائل تناسب", text:"اگر x در نسبت a:b = c:d پنهان است، آن را با ضرب متقاطع پیدا کن: a×d = b×c."},
      {title:"کاربردها", text:"نسبت در تقسیم مخارج، نقاشی مقیاسی و سرعت میانگین کاربرد دارد."}
    ],
    examples:[
      {text:"مثال: 2:x = 4:6 → 2×6 = 4×x → 12 = 4x → x = 3."},
      {text:"مثال: نسبت 3:5 یعنی برای هر 3 عدد از اولی، 5 تا از دومی باید باشد."}
    ],
    exercises:[
      {type:"mcq", q:"در نسبت 3:x = 6:8 ، x = ?", options:["4","5","6"], a:"4"},
      {type:"input", q:"اگر نسبت 2:3 = x:9 ، x = ?", a:"6"}
    ]
  },

  {
    id:"geometry",
    title:"هندسهٔ پایه (زاویه‌ها و مساحت)",
    sections:[
      {title:"زاویه‌ها", text:"زاویهٔ باز، بسته، قائمه (90°)، تند (<90°) و باز (>90°). جمع زاویه‌های مثلث = 180°."},
      {title:"مساحت", text:"مساحت مربع = a²، مستطیل = a×b، مثلث = (قاعده×ارتفاع)/2."},
      {title:"محیط", text:"محیط = جمع طول اضلاع."}
    ],
    examples:[
      {text:"مثال: اگر دو زاویهٔ مثلث 70° و 50° باشند، زاویهٔ سوم = 180 − (70+50) = 60°."},
      {text:"مثال: مساحت مستطیل با طول 5 و عرض 3 = 15."}
    ],
    exercises:[
      {type:"mcq", q:"مجموع زوایای مثلث چقدر است؟", options:["90","180","360"], a:"180"},
      {type:"input", q:"مساحت مربع ضلع 4 = ?", a:"16"}
    ]
  },

  {
    id:"algebra",
    title:"مقدمات جبر (عبارات و معادلهٔ ساده)",
    sections:[
      {title:"عبارات جبری", text:"عبارت جبری شامل عدد، متغیر (مثلاً x) و عملگرهاست: 2x + 5."},
      {title:"حل معادلهٔ ساده", text:"برای حل معادله x + a = b می‌توان x = b − a محاسبه کرد."},
      {title:"قاعده‌ها", text:"همواره عملیات‌های مخالف را اجرا کن تا مجهول تنها بماند."}
    ],
    examples:[
      {text:"مثال: 2x + 3 = 11 → 2x = 8 → x = 4."},
      {text:"مثال: x/3 = 5 → x = 15."}
    ],
    exercises:[
      {type:"mcq", q:"اگر 2x = 10 ، x = ?", options:["4","5","6"], a:"5"},
      {type:"input", q:"حل کن: x + 7 = 12 ، x = ?", a:"5"}
    ]
  },

  {
    id:"statistics",
    title:"آمار و احتمال پایه",
    sections:[
      {title:"میانگین", text:"میانگین = مجموع داده‌ها ÷ تعداد داده‌ها."},
      {title:"میانه و نما", text:"میانه عدد وسط در ترتیب داده‌ها، نما پرتکرارترین عدد است."},
      {title:"احتمال ساده", text:"احتمال پیشامد = favorable / possible."}
    ],
    examples:[
      {text:"مثال: داده‌ها 2,3,5 → میانگین = (2+3+5)/3 = 10/3."},
      {text:"مثال: احتمال آوردن شیر در سکه = 1/2."}
    ],
    exercises:[
      {type:"mcq", q:"میانگین 2 و 4 و 6 =", options:["4","3","6"], a:"4"},
      {type:"input", q:"احتمال آوردن عدد 3 در تاس 6 وجهی = ?", a:"1/6"}
    ]
  }
];

/* ---------- وضعیت برنامه ---------- */
let state = { score:0, completed:{}, badges:{} };
function loadState(){
  try{ const raw = localStorage.getItem(STORAGE); if(raw) state = JSON.parse(raw); }
  catch(e){ console.warn("load error", e); }
}
function saveState(){ localStorage.setItem(STORAGE, JSON.stringify(state)); updateUI(); }

/* ---------- رندر لیست درس‌ها ---------- */
const lessonListEl = document.getElementById("lessonList");
const lessonTitleEl = document.getElementById("lessonTitle");
const lessonSectionsEl = document.getElementById("lessonSections");
const examplesEl = document.getElementById("examples");
const exercisesEl = document.getElementById("exercises");
const scoreEl = document.getElementById("score");
const progressEl = document.getElementById("progress");
const badgesEl = document.getElementById("badges");
const quizArea = document.getElementById("quizArea");
const timerEl = document.getElementById("timer");

let current = null;
let qIndex = 0;
let qStart = 0;
let qTimer = null;

function init(){
  loadState();
  renderLessonList();
  attachSearch();
  updateUI();
  // باز کردن اولین درس
  openLesson(lessons[0].id);
  attachButtons();
}

/* render list */
function renderLessonList(filter=""){
  lessonListEl.innerHTML = "";
  lessons.forEach(l=>{
    if(filter && !(l.title+ " " + (l.sections.map(s=>s.title).join(" "))).toLowerCase().includes(filter.toLowerCase())) return;
    const d = document.createElement("div");
    d.className = "item";
    d.id = "li_"+l.id;
    d.innerHTML = `<div class="lesson-title">${l.title}</div>`;
    d.onclick = ()=> openLesson(l.id);
    if(state.completed[l.id]) d.classList.add("done");
    lessonListEl.appendChild(d);
  });
}

/* search */
function attachSearch(){
  const s = document.getElementById("search");
  s.addEventListener("input", ()=> renderLessonList(s.value));
}

/* open lesson */
function openLesson(id){
  const L = lessons.find(x=>x.id===id);
  if(!L) return;
  current = L; qIndex = 0;
  // highlight
  document.querySelectorAll("#lessonList .item").forEach(el=>el.classList.toggle("active", el.id === "li_"+id));
  lessonTitleEl.innerText = L.title;
  // sections
  lessonSectionsEl.innerHTML = "";
  L.sections.forEach(sec=>{
    const s = document.createElement("div"); s.className = "section";
    s.innerHTML = `<h4>${sec.title}</h4><div>${sec.text}</div>`;
    lessonSectionsEl.appendChild(s);
  });
  // examples
  examplesEl.innerHTML = "<h4>مثال‌ها</h4>";
  L.examples.forEach(ex=>{ const p=document.createElement("p"); p.innerText = ex.text; examplesEl.appendChild(p); });
  // exercises
  renderExercises(L);
  // reset quiz area
  quizArea.innerHTML = `برای شروع آزمون درس روی «شروع آزمون درس» بزن.`;
  resetTimer();
  updateUI();
}

/* render exercises */
function renderExercises(L){
  exercisesEl.innerHTML = "<h4>تمرین‌ها</h4>";
  L.exercises.forEach((ex, i)=>{
    if(ex.type === "mcq"){
      const box = document.createElement("div"); box.className = "exercise";
      box.innerHTML = `<p>${ex.q}</p>`;
      ex.options.forEach(opt=>{
        const o = document.createElement("div"); o.className = "option"; o.innerText = opt;
        o.onclick = ()=> handleMCQ(ex, opt, o);
        box.appendChild(o);
      });
      exercisesEl.appendChild(box);
    } else if(ex.type === "input"){
      const box = document.createElement("div"); box.className = "exercise";
      box.innerHTML = `<p>${ex.q}</p><input id="inp_${current.id}_${i}" placeholder="جواب را بنویس"><button class="small" onclick="handleInput('${current.id}', ${i})">ارسال</button><div id="fb_${current.id}_${i}" class="feedback"></div>`;
      exercisesEl.appendChild(box);
    }
  });
}

/* handle mcq */
function handleMCQ(ex, optElText, el){
  // disable options
  const parent = el.parentElement;
  Array.from(parent.querySelectorAll(".option")).forEach(o=>o.style.pointerEvents="none");
  if(optElText === ex.a){
    el.classList.add("correct");
    applyScore(true);
  } else {
    el.classList.add("wrong");
    // mark correct
    Array.from(parent.querySelectorAll(".option")).forEach(o=>{ if(o.innerText===ex.a) o.classList.add("correct"); });
    applyScore(false);
  }
}

/* handle input */
function handleInput(lessonId, exIndex){
  const el = document.getElementById(`inp_${lessonId}_${exIndex}`);
  const fb = document.getElementById(`fb_${lessonId}_${exIndex}`);
  const val = (el.value+"").trim();
  const ex = lessons.find(l=>l.id===lessonId).exercises[exIndex];
  if(val === ""){
    fb.innerText = "جواب را وارد کن.";
    fb.style.color = "#c00"; return;
  }
  const numeric = !isNaN(Number(ex.a));
  let ok = false;
  if(numeric) ok = Number(val) === Number(ex.a);
  else ok = val.replace(/\s+/g,"").toLowerCase() === (""+ex.a).replace(/\s+/g,"").toLowerCase();
  if(ok){
    fb.innerText = "✅ درست — +10 امتیاز"; fb.style.color = "#0a0";
    applyScore(true);
    state.completed[`inp_${lessonId}_${exIndex}`] = true;
    saveState();
  } else {
    fb.innerText = "❌ نادرست — −3 امتیاز"; fb.style.color = "#c00";
    applyScore(false);
  }
}

/* scoring */
function applyScore(isCorrect){
  const now = Date.now();
  let delta = isCorrect ? 10 : -3;
  // quick-reply bonus handled where needed (for quiz flow)
  state.score = Math.max(0, (state.score||0) + delta);
  // streak badge
  if(isCorrect) state.streak = (state.streak||0) + 1; else state.streak = 0;
  if(state.streak === 5) state.badges["streak5"] = true;
  saveState();
  updateUI();
}

/* ---------- QUIZ flow ---------- */
document.getElementById("startQuiz").addEventListener("click", startQuiz);
document.getElementById("nextLesson").addEventListener("click", ()=>{
  const idx = lessons.findIndex(l=>l.id===current.id);
  const next = lessons[idx+1] || lessons[0];
  openLesson(next.id);
});

function startQuiz(){
  if(!current) return;
  qIndex = 0; state.streak = 0; saveState();
  nextQuestion();
}

function nextQuestion(){
  clearInterval(qTimer);
  const list = current.exercises;
  if(qIndex >= list.length){
    quizArea.innerHTML = `<p>آزمون درس تمام شد. امتیاز: ${state.score}</p>`;
    saveState(); updateUI(); return;
  }
  const ex = list[qIndex];
  quizArea.innerHTML = `<p><strong>سؤال ${qIndex+1}:</strong> ${ex.q}</p>`;
  qStart = Date.now();
  startTimer(60);
  if(ex.type === "mcq"){
    const container = document.createElement("div");
    ex.options.forEach(opt=>{
      const b = document.createElement("button"); b.className="btn small"; b.style.display="block"; b.style.width="100%"; b.style.marginTop="8px";
      b.innerText = opt; b.onclick = ()=> { handleQuizAnswer(ex, opt, b); };
      container.appendChild(b);
    });
    quizArea.appendChild(container);
  } else {
    const input = document.createElement("input"); input.id="quizInp"; input.placeholder="پاسخ";
    const send = document.createElement("button"); send.className="btn small"; send.innerText="ارسال"; send.onclick = ()=> { handleQuizAnswer(ex, document.getElementById("quizInp").value, send); };
    quizArea.appendChild(input); quizArea.appendChild(send);
  }
}

function handleQuizAnswer(ex, answer, buttonEl){
  clearInterval(qTimer);
  const elapsed = (Date.now() - qStart)/1000;
  const correct = (""+ex.a).toString();
  let ok = (""+answer).toString() === correct;
  if(ok){
    if(elapsed < 10) state.score += 15; else state.score += 10;
    state.streak = (state.streak||0) + 1;
  } else {
    state.score = Math.max(0, state.score - 3);
    state.streak = 0;
  }
  if(state.streak === 5) state.badges["streak5"] = true;
  saveState(); updateUI();
  // feedback
  const fb = document.createElement("div"); fb.style.marginTop="8px"; fb.innerText = ok ? "✅ درست!" : `❌ غلط! جواب درست: ${ex.a}`;
  quizArea.appendChild(fb);
  qIndex++;
  setTimeout(()=> nextQuestion(), 1100);
}

/* timer */
function startTimer(sec){
  let rem = sec;
  timerEl.innerText = formatTime(rem);
  qTimer = setInterval(()=>{
    rem--; timerEl.innerText = formatTime(rem);
    if(rem <= 0){ clearInterval(qTimer); // auto wrong
      quizArea.innerHTML += `<div style="color:#c00;margin-top:8px">زمان تمام شد — پاسخ نادرست ثبت شد</div>`;
      state.score = Math.max(0, state.score - 3); state.streak = 0; saveState(); updateUI();
      qIndex++; setTimeout(()=> nextQuestion(), 1000);
    }
  },1000);
}
function resetTimer(){ clearInterval(qTimer); timerEl.innerText = "۰۰:۰۰"; }
function formatTime(s){ if(s<0) s=0; const mm = Math.floor(s/60); const ss = s%60; return `${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`; }

/* UI updates */
function updateUI(){
  scoreEl.innerText = state.score || 0;
  const done = Object.keys(state.completed).length;
  const pct = Math.round((done / (lessons.length*2)) * 100);
  progressEl.innerText = pct + "%";
  // badges
  badgesEl.innerHTML = "";
  for(const k in state.badges){ if(state.badges[k]){ const b = document.createElement("div"); b.className="badge"; b.innerText = badgeName(k); badgesEl.appendChild(b); } }
}

function badgeName(id){
  if(id==="streak5") return "۵ پاسخ درست متوالی";
  return id;
}

/* attach export/reset */
function attachButtons(){
  document.getElementById("exportBtn").onclick = ()=>{
    const data = JSON.stringify(state,null,2);
    const blob = new Blob([data], {type:"application/json"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download="math6_progress.json"; a.click();
    URL.revokeObjectURL(a.href);
  };
  document.getElementById("resetBtn").onclick = ()=>{
    if(confirm("آیا پیشرفت پاک شود؟")){ localStorage.removeItem(STORAGE); state={score:0,completed:{},badges:{}}; saveState(); renderLessonList(); openLesson(lessons[0].id); }
  };
}

/* init */
init();
