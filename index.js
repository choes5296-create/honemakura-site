const gate = document.getElementById("gate");
const bgm = document.getElementById("bgm");
const introLine = document.getElementById("introLine");

// 자막(6초)
const lines = [
  "「よくぞここまで来たな。(잘 찾아왔구나.)」",
  "「これまで通り。(여태까지처럼.)」",
  "「吾も待っておったのだ。(아버지도 기다리고 있었단다.)」",
];

let i = 0;
let timer = null;

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
  introLine.classList.remove("out");
  introLine.classList.add("in");

  typeLine(text, 28);

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

// ======================
// ✅ BGM: 첫 제스처에서만 시작
// ======================
function setBgmDefaults() {
  bgm.loop = true;
  bgm.volume = 0.7;
  bgm.preload = "auto";
}

setBgmDefaults();

let bgmStarted = false;

async function startBgmFromGesture() {
  if (bgmStarted) return true;

  try {
    setBgmDefaults();
    bgm.load(); // ✅ 일부 브라우저에서 도움됨

    if (!Number.isFinite(bgm.currentTime)) bgm.currentTime = 0;

    await bgm.play();
    bgmStarted = true;
    sessionStorage.setItem("bgmAllowed", "1");
    return true;
  } catch (e) {
    // 재생 실패해도 플래그는 남겨둠(다음 페이지에서도 재시도 가능)
    sessionStorage.setItem("bgmAllowed", "1");
    return false;
  }
}


gate.addEventListener("click", async (e) => {
  e.preventDefault();


  if (!bgmStarted) {
    await startBgmFromGesture();

    return;
  }

  // 두 번째 클릭부터 이동
  location.href = "honemakura.html";
});
