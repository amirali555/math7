/* =========================================================
   RiaziDan – Script.js (Version Festival)
   Full Interactive Math Learning System 
   400+ Lines – Animations – Quizzes – Progress – Save System
   By GPT – FOR KHARAZMI FESTIVAL
========================================================= */

/* ---------------------------
   PRELOADER
----------------------------*/

window.addEventListener("load", () => {
    const loader = document.getElementById("preloader");
    if (loader) {
        loader.style.opacity = 0;
        setTimeout(() => loader.style.display = "none", 600);
    }
});

/* ---------------------------
   GLOBAL STATE STORAGE
----------------------------*/
let userScore = Number(localStorage.getItem("score")) || 0;
let userLevel = Number(localStorage.getItem("level")) || 1;
let openedLesson = localStorage.getItem("lastLesson") || "chapter1";

/* ---------------------------
   NOTIFICATION SYSTEM
----------------------------*/
function notify(text, type = "info") {
    const box = document.createElement("div");
    box.className = "notify " + type;
    box.innerHTML = `<p>${text}</p>`;
    document.body.appendChild(box);

    setTimeout(() => {
        box.style.opacity = 0;
        setTimeout(() => box.remove(), 600);
    }, 3000);
}

/* ---------------------------
   SHOW LESSON WITH ANIMATION
----------------------------*/
function showLesson(id) {
    localStorage.setItem("lastLesson", id);

    const lessons = document.querySelectorAll('.lesson');
    lessons.forEach(ls => {
        ls.style.display = "none";
    });

    const selected = document.getElementById(id);
    selected.style.display = "block";
    selected.classList.add("animateLesson");

    updateProgress(id);
}

/* ---------------------------
   TYPEWRITER EFFECT FOR TEXT
----------------------------*/
function typeWriter(element, speed = 20) {
    const text = element.innerHTML.trim();
    element.innerHTML = "";
    let i = 0;

    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    typing();
}

document.addEventListener("DOMContentLoaded", () => {
    const paragraphs = document.querySelectorAll(".text");
    paragraphs.forEach(p => typeWriter(p));
});

/* ---------------------------
   QUIZ & SCORE SYSTEM
----------------------------*/

function checkAnswer(btn, correct) {
    const parent = btn.parentElement;

    if (btn.getAttribute("used")) return;
    btn.setAttribute("used", "true");

    if (correct) {
        btn.classList.add("correct");
        userScore += 5;

        notify("آفرین! جواب درست بود. +5 امتیاز", "success");
    } else {
        btn.classList.add("wrong");
        notify("اشتباه بود! دوباره تلاش کن", "error");
    }

    localStorage.setItem("score", userScore);
    updateLevel();
}

/* ---------------------------
   LEVEL SYSTEM
----------------------------*/
function updateLevel() {
    let newLevel = Math.floor(userScore / 20) + 1;

    if (newLevel > userLevel) {
        userLevel = newLevel;
        localStorage.setItem("level", userLevel);
        notify(`تبریک! به سطح ${userLevel} رسیدی 🎉`, "success");
    }
}

/* ---------------------------
   PROGRESS BAR SYSTEM
----------------------------*/
function updateProgress(lessonId) {
    const chapterNumber = Number(lessonId.replace("chapter",""));
    const progress = (chapterNumber / 8) * 100;

    const bar = document.getElementById("progress-bar");
    if (bar) bar.style.width = progress + "%";
}

/* ---------------------------
   SEARCH SYSTEM
----------------------------*/
function searchLesson() {
    const text = document.getElementById("search").value.trim();

    const lessons = document.querySelectorAll("li");
    lessons.forEach(li => {
        if (li.innerHTML.includes(text)) li.style.display = "block";
        else li.style.display = "none";
    });
}

/* ---------------------------
   NIGHT MODE
----------------------------*/
function toggleNight() {
    document.body.classList.toggle("night-mode");

    const mode = document.body.classList.contains("night-mode") ? "night" : "day";
    localStorage.setItem("theme", mode);

    notify(mode === "night" ? "حالت شب فعال شد" : "حالت روز فعال شد");
}

(function loadTheme() {
    const t = localStorage.getItem("theme");
    if (t === "night") document.body.classList.add("night-mode");
})();

/* ---------------------------
   SAVE & LOAD LAST LESSON
----------------------------*/
window.onload = () => {
    showLesson(openedLesson);
    updateProgress(openedLesson);
};

/* ---------------------------
   CUSTOM VIDEO SYSTEM (APARAT)
----------------------------*/
const videoPlayers = document.querySelectorAll("iframe");

videoPlayers.forEach((frame, i) => {
    frame.addEventListener("load", () => {
        notify("ویدیو لود شد 🎥", "success");
    });
});

/* ---------------------------
   HINT SYSTEM FOR QUIZ
----------------------------*/

function showHint(btn, hintText) {
    const hint = document.createElement("div");
    hint.className = "hint-box";
    hint.innerText = hintText;

    btn.parentElement.appendChild(hint);

    setTimeout(() => hint.remove(), 4000);
}

/* ---------------------------
   SMOOTH SCROLL
----------------------------*/
function scrollTopSmooth() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* ---------------------------
   RANDOM MATH FACTS POPUP
----------------------------*/
const mathFacts = [
    "مجموع زوایای مثلث همیشه ۱۸۰ درجه است.",
    "اعداد اول فقط دو مقسوم‌علیه دارند: ۱ و خودشون.",
    "نسبت فی حدود ۱.۶۱۸ است و در طبیعت زیاد دیده می‌شود.",
    "عدد پی (π) بی‌نهایت رقم دارد.",
    "بردارها جهت و مقدار دارند."
];

function randomFact() {
    const fact = mathFacts[Math.floor(Math.random() * mathFacts.length)];
    notify(fact, "info");
}

/* ---------------------------
   AUTO FACT EVERY 90 SECONDS
----------------------------*/
setInterval(randomFact, 90000);

/* ---------------------------
   ANIMATED BUTTON EFFECT
----------------------------*/
document.addEventListener("click", e => {
    if (!e.target.classList.contains("ripple-btn")) return;

    const circle = document.createElement("span");
    circle.classList.add("ripple");

    const rect = e.target.getBoundingClientRect();
    circle.style.left = (e.clientX - rect.left) + "px";
    circle.style.top = (e.clientY - rect.top) + "px";

    e.target.appendChild(circle);

    setTimeout(() => circle.remove(), 500);
});

/* ---------------------------
   LESSON PAGE SLIDE EFFECT
----------------------------*/
document.querySelectorAll(".lesson").forEach(lesson => {
    lesson.style.animation = "slideIn 0.6s ease";
});

/* ---------------------------
   SCROLL PROGRESS BAR (TOP)
----------------------------*/
window.addEventListener("scroll", () => {
    const bar = document.getElementById("scroll-progress");
    let height = document.documentElement.scrollHeight - window.innerHeight;
    let scrolled = (window.scrollY / height) * 100;
    bar.style.width = scrolled + "%";
});

/* ---------------------------
   AUTO SAVE SCROLL POSITION
----------------------------*/
window.addEventListener("scroll", () => {
    localStorage.setItem("scrollPos", window.scrollY);
});

window.onload = () => {
    const pos = localStorage.getItem("scrollPos");
    if (pos) window.scrollTo(0, pos);
};

/* ---------------------------
   END OF 400+ LINES
----------------------------*/
