const CORRECT_PASSWORD = "23122007";
const input = document.getElementById("passwordInput");
const btn = document.getElementById("openBtn");
const hint = document.getElementById("hint");

const panel = document.getElementById("passwordPanel");
const loadingPanel = document.getElementById("loadingPanel");
const progressFill = document.getElementById("progressFill");
const loadingText = document.getElementById("loadingText");

const nextBtn = document.getElementById("nextBtn");

btn.addEventListener("click", () => {
  if (input.value === CORRECT_PASSWORD) {
    hint.textContent = "Đúng rồi 💖";
    hint.classList.remove("blink");

    // 1s sau panel mờ dần rồi biến mất
    setTimeout(() => {
      panel.classList.add("fade-out");

      setTimeout(() => {
        panel.style.display = "none";
        loadingPanel.classList.remove("hidden");
        startLoading();
      }, 800);

    }, 1000);

  } else {
    hint.textContent = "Sai mật khẩu rồi 😿";
  }
});
const canvas = document.getElementById("heartRain");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
window.addEventListener("resize", resize);

let hearts = [];

function createHeart() {
  hearts.push({
    x: Math.random() * canvas.width,
    y: -20,
    size: Math.random() * 12 + 16,
    speed: Math.random() * 1 + 0.5
  });
}

function drawHeart(x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 20, size / 20);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-10, -10, -20, 10, 0, 20);
  ctx.bezierCurveTo(20, 10, 10, -10, 0, 0);
  ctx.closePath();

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1 / (size / 20); 
  ctx.stroke();

  ctx.fillStyle = "rgba(255,80,120,0.8)";
  ctx.fill();  

  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  hearts.forEach((h, i) => {
    if (h.wind) {
      h.x -= 6;
    } else {
      h.y += h.speed;
    }
    drawHeart(h.x, h.y, h.size);

    if (h.y > canvas.height + 30 || h.x < -50) {
      hearts.splice(i, 1);
    }
  });

  requestAnimationFrame(draw);
}

setInterval(createHeart, 300);
draw();

let percent = 0;

function startLoading() {
  const interval = setInterval(() => {
    percent++;
    progressFill.style.width = percent + "%";

    // đổi màu tim theo mốc
    if (percent === 1) document.querySelector(".h0").classList.add("active");
    if (percent === 50) document.querySelector(".h50").classList.add("active");
    if (percent === 100) {
  document.querySelector(".h100").classList.add("active");
  loadingText.textContent = "LOVE LOADED 💖";
  nextBtn.classList.remove("hidden");
  clearInterval(interval);
}
  }, 40); // tốc độ chạy
}

nextBtn.addEventListener("click", () => {
  nextBtn.style.display = "none";

  document.body.classList.add("to-purple");

  // panel bay sang trái
  loadingPanel.classList.add("wind-left");

  // tim bay từ phải qua trái
  hearts.forEach(h => {
    h.speed = 0;
    h.wind = true;
  });

  setTimeout(() => {
    window.location.href = "page3.html";
  }, 1200);
});