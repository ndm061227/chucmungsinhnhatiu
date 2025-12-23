const grid = document.getElementById("calendarGrid");

let dayCounter = 1;
let originalCells = [];

/* ================== HIỆN LỊCH ĐỦ HÀNG (7 Ô / HÀNG) ================== */
function showDays() {
  const totalCells = Math.ceil(31 / 7) * 7; // đủ hàng

  function addCell() {
    if (dayCounter > totalCells) {
      showHeaderDate();
      highlightHeart();
      setTimeout(showDecorations, 100);
      return;
    }

    const cell = document.createElement("div");
    cell.className = "day-cell";

    if (dayCounter <= 31) {
      if (dayCounter === 23) {
        cell.classList.add("heart");
        cell.innerHTML = `
          <svg viewBox="0 0 100 90" class="heart-svg">
            <path d="M50 80C10 50,10 20,40 20
              C50 20,50 35,50 35
              C50 35,50 20,60 20
              C90 20,90 50,50 80"
              fill="none"
              stroke="#e41b40ff"
              stroke-width="10"
            />
          </svg>
          <span>23</span>
        `;
      } else {
        cell.innerHTML = `<span>${dayCounter}</span>`;
      }
    } else {
      cell.innerHTML = `<span></span>`;
    }

    grid.appendChild(cell);
    setTimeout(() => cell.classList.add("show"), 20);

    dayCounter++;
    setTimeout(addCell, 70);
  }

  addCell();
}

/* ================== HEADER ================== */
function showHeaderDate() {
  const header = document.getElementById("calendarHeader");
  header.classList.remove("hidden");
  header.classList.add("show");
}

/* ================== TIM → HIỆU ỨNG ================== */
function highlightHeart() {
  const cell = document.querySelector(".day-cell.heart");
  if (!cell) return;

  setTimeout(() => {
    cell.classList.add("pulse");

    setTimeout(() => {
      cell.classList.remove("pulse");

      saveOriginalState();

      // bắt đầu nhảy
      setTimeout(() => {
        jumpAllDaysFast(5000);
        jumpHeaderSequential(5000);
      }, 500);

    }, 1200);
  }, 500);
}

/* ================== LƯU TRẠNG THÁI GỐC ================== */
function saveOriginalState() {
  originalCells = [];
  document.querySelectorAll(".day-cell span").forEach(span => {
    originalCells.push(span.textContent);
  });
}

/* ================== RESTORE LƯỚI NGÀY ================== */
function restoreOriginalCells() {
  document.querySelectorAll(".day-cell span").forEach((span, i) => {
    span.textContent = originalCells[i];
  });
}

/* ================== NHẢY NGÀY (ĐỒNG LOẠT ~3s) ================== */
function jumpAllDaysFast(duration) {
  const spans = [...document.querySelectorAll(".day-cell:not(.heart) span")];
  let numbers = spans.map(s => (s.textContent ? +s.textContent : 0));

  const interval = 35;
  const steps = duration / interval;
  let count = 0;

  const timer = setInterval(() => {
    count++;

    spans.forEach((span, i) => {
      numbers[i]++;
      if (numbers[i] > 31) numbers[i] = 1;

      span.textContent = numbers[i];
      span.parentElement.classList.remove("jump");
      void span.offsetWidth;
      span.parentElement.classList.add("jump");
    });

    if (count >= steps) {
      clearInterval(timer);
      restoreOriginalCells();
    }
  }, interval);
}

/* == NHẢY HEADER THEO THÁNG → NĂM == */
function jumpHeaderSequential(duration) {
  const dayEl = document.querySelector(".calendar-header .day");
  const monthEl = document.querySelector(".calendar-header .month");
  const yearEl = document.querySelector(".calendar-header .year");

  const startYear = 2007;
  const endYear = 2025;

  let month = 12;
  let year = startYear;

  const totalMonths = (endYear - startYear) * 12;
  const interval = duration / totalMonths;

  const timer = setInterval(() => {
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }

    monthEl.textContent = String(month).padStart(2, "0");
    yearEl.textContent = year;

    monthEl.classList.remove("jump");
    yearEl.classList.remove("jump");
    void monthEl.offsetWidth;
    void yearEl.offsetWidth;
    monthEl.classList.add("jump");
    yearEl.classList.add("jump");

    if (year === endYear && month === 12) {
      clearInterval(timer);
      setTimeout(endFocusEffect, 200);
    }
  }, interval);
}

/* == TRANG TRÍ == */
function showDecorations() {
  document.querySelectorAll(".corner").forEach(svg => {
    svg.style.animation = "drawLine 1.5s ease forwards";
    svg.style.opacity = "1";
  });
}

/* == START == */
setTimeout(showDays, 500);

function showTitleLine() {
  const title = document.getElementById("titleLine");
  const letters = [...title.querySelectorAll("span:not(.space)")];

  title.classList.add("show");

  letters.forEach((span, i) => {
    span.style.animationDelay = `${i * 0.12}s`;
  });

  setTimeout(() => {
    title.classList.add("animate");
  }, 400);
}

function endFocusEffect() {
  const header = document.getElementById("calendarHeader");
  const heartCell = document.querySelector(".day-cell.heart");
  const heartNumber = heartCell?.querySelector("span");

  // header zoom + rung
  header.classList.add("zoom-end");

  // số 23 zoom + rung
  heartNumber.classList.add("zoom-end");

  // viền ô 23 zoom nhẹ
  heartCell.classList.add("zoom-border");

  // cleanup class
  setTimeout(() => {
  header.classList.remove("zoom-end");
  heartNumber.classList.remove("zoom-end");
  heartCell.classList.remove("zoom-border");

  enableHeartClick(); // 
}, 700);
showTitleLine();
}

/* == CHỜ CLICK TRÁI TIM == */
function enableHeartClick() {
  const heartCell = document.querySelector(".day-cell.heart");
  const heartSVG = heartCell.querySelector("svg");

  // rung liên tục
  heartCell.classList.add("heart-attention");

  heartCell.addEventListener("click", onHeartClick, { once: true });
}

function catDisappear() {
  const cat = document.querySelector(".cat");
  if (!cat) return;

  cat.classList.add("cat-disappear");

  // optional: remove hẳn khỏi DOM
  setTimeout(() => {
    cat.parentElement?.remove();
  }, 900);
}

/* == CLICK TRÁI TIM == */
function onHeartClick() {
  const heartCell = document.querySelector(".day-cell.heart");
  const heartSVG = heartCell.querySelector("svg");

  heartCell.classList.remove("heart-attention");

  const rect = heartSVG.getBoundingClientRect();

  // wrapper để rơi
  const wrapper = document.createElement("div");
  wrapper.className = "falling-heart-wrapper heart-fall";

  wrapper.style.left = rect.left + "px";
  wrapper.style.top = rect.top + "px";
  wrapper.style.width = rect.width + "px";
  wrapper.style.height = rect.height + "px";

  const clone = heartSVG.cloneNode(true);
  clone.style.width = "100%";
  clone.style.height = "100%";

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  const targetX = window.innerWidth / 2 - rect.width / 2;
  const targetY = window.innerHeight - rect.height - 30;

  wrapper.style.setProperty("--tx", `${targetX - rect.left}px`);
  wrapper.style.setProperty("--ty", `${targetY - rect.top}px`);

  // ẩn tim gốc
  heartSVG.style.opacity = "0";

  // sau khi tim rơi xong → gió thổi
  setTimeout(startWindScene, 2000);

  setTimeout(() => {
    catDisappear(); 
  document.getElementById("titleLine")
    ?.classList.add("fade-out");
}, 1800);
}

/* == GIÓ THỔI SCENE == */
function startWindScene() {
  document.body.classList.add("wind-bg");

  // thổi lịch
  document.querySelector(".calendar-wrapper")
    .classList.add("wind-blow");

  // thổi 4 góc
  document.querySelectorAll(".corner").forEach(el => {
    el.classList.add("wind-blow");
  });
  setTimeout(() => {
    window.location.href = "page4.html";
  }, 1800); // = thời gian windBlow
}

function startBackgroundConfetti() {
  const spawn = () => {
    const el = document.createElement("div");
    el.classList.add("confetti-bg");

    if (Math.random() > 0.5) {
      el.classList.add("ribbon");
    } else {
      el.classList.add("star");
    }

    el.style.left = Math.random() * window.innerWidth + "px";
    el.style.animationDuration = 6 + Math.random() * 4 + "s";
    el.style.transform = `rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(el);

    setTimeout(() => el.remove(), 10000);
  };

  // tạo liên tục
  setInterval(spawn, 100);
}

startBackgroundConfetti();