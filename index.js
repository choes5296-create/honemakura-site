const gate = document.getElementById("gate");
const bgm = document.getElementById("bgm");
const introLine = document.getElementById("introLine");

// 자막(6초)
const lines = [
  "「よくぞここまで来たな。(잘 찾아왔구나.)」",
  "「この俺様が、ここにある。俺様が、そなたと共にある。(이 내가 있다. 이 내가 여기에 있다.)」",
  "「故にそなたは、いかなる生においても恐れるものなど何もない。(그러니 너는, 그 어떤 생에서도 두려울 것 따위는 없다.)」"
];

let i = 0;
let timer = null;
let entered = false;

// ---- (자막: 타이핑 효과용) ----
let typingTimer = null;

function typeLine(text, speed = 28) {
  clearInterval(typingTimer);
  introLine.textContent = "";
  let k = 0;

  typingTimer = setInterval(() => {
    introLine.textContent += text[k];
    k++;
    if (k >= text.length) clearInterval(typingTimer);
  }, speed);
}

function showLine(text) {
  // 페이드 인/아웃 유지(원하면 빼도 됨)
  introLine.classList.remove("out");
  introLine.classList.add("in");

  // 타이핑
  typeLine(text, 28);

  // 6초 중 후반부에 사라지게 (예: 4.8초부터)
  setTimeout(() => {
    introLine.classList.remove("in");
    introLine.classList.add("out");
  }, 4800);
}

function loopLines() {
  clearInterval(timer);

  showLine(lines[i]);
  i = (i + 1) % lines.length;

  timer = setInterval(() => {
    showLine(lines[i]);
    i = (i + 1) % lines.length;
  }, 6000);
}

loopLines();

// ---- 브금: 첫 클릭 제스처 안에서 "재생 먼저" ----
async function startBgmFromGesture() {
  try {
    bgm.volume = 0.7;
    // iOS/일부 브라우저 대비
    bgm.currentTime = bgm.currentTime || 0;
    await bgm.play();
    sessionStorage.setItem("bgmAllowed", "1");
    return true;
  } catch (e) {
    sessionStorage.setItem("bgmAllowed", "1");
    return false;
  }
}

gate.addEventListener("click", async () => {
  if (entered) return;
  entered = true;

  // ✅ “클릭 이벤트 안에서” play()를 먼저 보장
  await startBgmFromGesture();

  // ✅ 재생 시작될 시간을 조금 주고 이동 (이게 핵심)
  setTimeout(() => {
    location.href = "honemakura.html";
  }, 450);
}, { once: true });
