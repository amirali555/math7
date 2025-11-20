// ذخیره و بارگذاری وضعیت
const KEY = "riazidan_f1_state_v1";
let state = { score: 0, completed: {} };
function loadState(){ try{ const r = localStorage.getItem(KEY); if(r) state = JSON.parse(r); } catch(e){} updateUI(); }
function saveState(){ localStorage.setItem(KEY, JSON.stringify(state)); updateUI(); }

// نمایش و ناوبری بین تکه‌ها
const tabs = Array.from(document.querySelectorAll(".toc-btn"));
tabs.forEach(t=>{
  t.addEventListener("click", ()=> {
    tabs.forEach(x=>x.classList.remove("active"));
    t.classList.add("active");
    const step = t.dataset.step;
    document.querySelectorAll(".step").forEach(s=>s.classList.remove("active"));
    document.getElementById(step).classList.add("active");
  });
});

// بارگذاری اولیه
loadState();

// UI update
function updateUI(){
  document.getElementById("score").innerText = state.score || 0;
  const total = 6; // تعداد بخش‌ها یا درس‌ها (قابل افزایش)
  const done = Object.keys(state.completed).length;
  const pct = Math.round((done/total)*100);
  document.getElementById("progressPercent").innerText = pct + "%";
}

// ----- تمرین‌ها (input) -----
function checkExercise(inputId, correct){
  const el = document.getElementById(inputId);
  const fb = document.getElementById("fb-"+inputId);
  const val = (el.value+"").trim();
  if(val === "") { fb.innerText = "لطفاً جواب را وارد کن"; fb.style.color = "#c00"; return; }
  // عددی یا رشته‌ای مقایسه می‌کنیم (معمولاً عدد)
  const isNum = !isNaN(Number(correct));
  let ok = false;
  if(isNum) ok = Number(val) === Number(correct);
  else ok = val.replace(/\s+/g,"").toLowerCase() === (""+correct).replace(/\s+/g,"").toLowerCase();
  if(ok){
    fb.innerText = "✅ درست شد! +10 امتیاز";
    fb.style.color = "#0a0";
    state.score = (state.score||0) + 10;
    state.completed[inputId] = true;
    saveState();
  } else {
    fb.innerText = "❌ نادرست، دوباره تلاش کن";
    fb.style.color = "#c00";
    state.score = Math.max(0, (state.score||0) - 3);
    saveState();
  }
}

// map short wrappers for HTML buttons
window.checkExercise = (id, correct) => checkExercise(id, correct);

// ----- آزمون کوتاه (MCQ) -----
function answerQuiz(qid, correct, btnEl){
  // highlight
  const parent = btnEl.parentElement;
  Array.from(parent.children).forEach(b=>b.disabled = true);
  if(typeof correct === "number" || typeof correct === "string"){
    // correct is value passed
  }
  const chosen = Number(btnEl.innerText.replace(/[^0-9]/g,'')) || btnEl.innerText;
  const ok = chosen == correct;
  if(ok){
    btnEl.style.background = "#16a34a"; // green
    state.score = (state.score||0) + 10;
    state.completed["q"+qid] = true;
  } else {
    btnEl.style.background = "#dc2626"; // red
    // highlight correct button
    Array.from(parent.children).forEach(b=>{
      if((Number(b.innerText.replace(/[^0-9]/g,'')) || b.innerText) == correct){
        b.style.background = "#16a34a";
      }
    });
    state.score = Math.max(0, (state.score||0) - 3);
  }
  saveState();
  document.getElementById("quizResult").innerText = "امتیاز فعلی: " + state.score;
}
window.answerQuiz = (q,c,b) => answerQuiz(q,c,b);

// reset quiz
function resetQuiz(){ document.getElementById("quizResult").innerText = ""; /* optionally enable buttons */ }

// utility: expose functions for HTML inline usage (already attached)
window.resetQuiz = resetQuiz;

// save on unload
window.addEventListener("beforeunload", ()=> saveState());
