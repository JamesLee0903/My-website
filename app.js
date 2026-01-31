/* ================= DOM ================= */
const revealBtn = document.getElementById("toggleBtn");
const about = document.querySelector(".about-card");
const chat = document.querySelector(".chatbox");

const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");

/* ================= Reveal / Undo ================= */
let expanded = false;
let hasReplied = false;

function showPanels() {
  about.classList.add("show");
  chat.classList.add("show");

  revealBtn.textContent = "Undo";
  revealBtn.style.background =
    "linear-gradient(135deg,#ff9fbf,#ffcf6e)";
  expanded = true;
}

function hidePanels() {
  about.classList.remove("show");
  chat.classList.remove("show");

  revealBtn.textContent = "Reveal More";
  revealBtn.style.background =
    "linear-gradient(135deg,#8bbcff,#f5a8d0)";

  messages.innerHTML = "";
  hasReplied = false;
  expanded = false;
}

revealBtn.onclick = () => {
  expanded ? hidePanels() : showPanels();
};

/* ================= Chat ================= */
function typeText(text, callback) {
  let i = 0;
  const p = document.createElement("p");
  p.className = "message";
  messages.appendChild(p);

  const timer = setInterval(() => {
    p.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(timer);
      callback && callback();
    }
  }, 30);
}

function showGameButtons() {
  const box = document.createElement("div");
  box.className = "game-actions";

  box.innerHTML = `
    <button class="glass-btn small" id="playGame">遊玩</button>
    <button class="glass-btn small" id="skipGame">先不了</button>
  `;
  messages.appendChild(box);

  document.getElementById("playGame").onclick = () => {
    window.open("https://www.crazygames.com", "_blank");
  };

  document.getElementById("skipGame").onclick = () => {
    typeText("沒關係，想玩時都還可以再找我喔 😊");
  };
}

sendBtn.onclick = () => {
  if (!input.value.trim()) return;
  input.value = "";

  if (!hasReplied) {
    hasReplied = true;
    typeText(
      "你好～劼晉目前是個武陵高中學生，正朝成為 NV 或 AMD 員工的目標邁進。\n你想玩些小遊戲嗎？",
      showGameButtons
    );
  }
};

/* ================= Stars ================= */
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

const STAR_COUNT = window.innerWidth < 768 ? 30 : 60;
const stars = [];

class Star {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.r = 2 + Math.random() * 1.5;
  }

  update(mx, my) {
    const dx = this.x - mx;
    const dy = this.y - my;
    const dist = Math.hypot(dx, dy);
    if (dist < 120) {
      this.vx += dx / dist * 0.05;
      this.vy += dy / dist * 0.05;
    }
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 215, 120, 0.6)";
    ctx.fill();
  }
}

for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());

let mx = -9999, my = -9999;
window.onmousemove = e => {
  mx = e.clientX;
  my = e.clientY;
};

function animate() {
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < stars.length; i++) {
    const s1 = stars[i];
    s1.update(mx, my);
    s1.draw();

    for (let j = i + 1; j < stars.length; j++) {
      const s2 = stars[j];
      const dx = s1.x - s2.x;
      const dy = s1.y - s2.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 140) {
        ctx.strokeStyle = `rgba(255, 215, 120, ${1 - dist / 140})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}
animate();
