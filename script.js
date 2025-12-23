console.log("SCRIPT OK");
const text = "Toi đã chuẩn bị chút bất ngờ nhỏ cho e,\n sẵn sàng đón nhận nó chưa nào ><";
const typingEl = document.getElementById("typing-text");

let index = 0;

function typeEffect() {
  if (index < text.length) {
    typingEl.innerHTML += text[index] === "\n" ? "<br>" : text[index];
    index++;
    setTimeout(typeEffect, 50);
  }
}

setTimeout(typeEffect, 1000);

const firecanvas = document.getElementById("fireworks");
const firectx = firecanvas.getContext("2d");

firecanvas.width = window.innerWidth;
firecanvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  firecanvas.width = window.innerWidth;
  firecanvas.height = window.innerHeight;
});

let particles = [];

function createFirework() {
  const x = Math.random() * firecanvas.width;
  const y = Math.random() * firecanvas.height * 0.5;

  for (let i = 0; i < 200; i++) {
    particles.push({
      x,
      y,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 4 + 1,
      radius: 5,
      alpha: 1,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`
    });
  }
}

function animate() {
  firectx.clearRect(0, 0, firecanvas.width, firecanvas.height);

  particles.forEach((p, i) => {
    p.x += Math.cos(p.angle) * p.speed;
    p.y += Math.sin(p.angle) * p.speed;
    p.alpha -= 0.01;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
    } else {
      firectx.fillStyle = p.color;
      firectx.globalAlpha = p.alpha;
      firectx.shadowBlur = 18;
      firectx.shadowColor = p.color;
      firectx.globalcompositeOperation = "lighter";
      firectx.beginPath();
      firectx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      firectx.fill();
      firectx.restore();
    }
  });
  
  firectx.globalAlpha = 1;
  requestAnimationFrame(animate);
}

setInterval(createFirework, 1200);
animate();
console.log("FIREWORKS RUNNING");

const heartcanvas = document.getElementById("heartcanvas");
const heartctx = heartcanvas.getContext("2d");

function resizecanvas() {
  heartcanvas.width = window.innerWidth;
  heartcanvas.height = window.innerHeight;
}
resizecanvas();
window.addEventListener("resize", resizecanvas);

let hearts = [];

function createHearts(x, y) {
  for (let i = 0; i < 12; i++) {
    hearts.push({
      x,
      y,
      size: Math.random() * 10 + 10,
      speedX: (Math.random() - 0.5) * 4,
      speedY: Math.random() * -4 - 1,
      alpha: 1
    });
  }
}

function drawHeart(x, y, size, alpha) {
  heartctx.save();
  heartctx.translate(x, y);
  heartctx.scale(size / 20, size / 20);
  heartctx.globalAlpha = alpha;
  heartctx.fillStyle = "pink";
  heartctx.beginPath();
  heartctx.moveTo(0, 0);
  heartctx.bezierCurveTo(-10, -10, -20, 10, 0, 20);
  heartctx.bezierCurveTo(20, 10, 10, -10, 0, 0);
  heartctx.fill();
  heartctx.restore();
}

function animateHearts() {
  heartctx.clearRect(0, 0, heartcanvas.width, heartcanvas.height);

  hearts.forEach((h, i) => {
    h.x += h.speedX;
    h.y += h.speedY;
    h.alpha -= 0.02;

    drawHeart(h.x, h.y, h.size, h.alpha);

    if (h.alpha <= 0) hearts.splice(i, 1);
  });

  requestAnimationFrame(animateHearts);
}
animateHearts();

// CLICK + TAP
window.addEventListener("click", (e) => {
  createHearts(e.clientX, e.clientY);
});

window.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  createHearts(t.clientX, t.clientY);
});
const beginBtn = document.getElementById("beginBtn");
const card = document.getElementById("giftCard");

beginBtn.addEventListener("click", () => {
  card.classList.add("no-transform");
  card.classList.add("exit-card");
  card.classList.add("transform-panel");

  document.documentElement.style.setProperty(
    "--bg-color",
    "#ffd6e7"
  );

  // sang Page 2 sau 
  setTimeout(() => {
    window.location.href = "page2.html";
  }, 1000);
});