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
// ✅ BGM 제스처 재생 (안정판)
// ======================

function setBgmDefaults() {
  bgm.loop = true;
  bgm.volume = 0.7;
  bgm.preload = "auto";
}

setBgmDefaults();

// "이미 허용됨"이면 페이지 들어오자마자 시도 (단, 브라우저가 막을 수도 있어서 실패해도 무시)
(async () => {
  if (sessionStorage.getItem("bgmAllowed") === "1") {
    try {
      await bgm.play();
    } catch (e) {
      // 막혀도 괜찮음. 다음 제스처 때 다시 켜짐.
    }
  }
})();

// 최초 제스처에서만 브금 켜기
let bgmStarted = false;

async function startBgmFromGesture() {
  if (bgmStarted) return true;

  try {
    setBgmDefaults();
    // currentTime NaN/undefined 방지
    if (!Number.isFinite(bgm.currentTime)) bgm.currentTime = 0;

    await bgm.play();
    bgmStarted = true;
    sessionStorage.setItem("bgmAllowed", "1");
    return true;
  } catch (e) {
    // 그래도 "허용 플래그"는 세팅해서 다음 페이지에서 재시도하게 만들 수 있음
    sessionStorage.setItem("bgmAllowed", "1");
    return false;
  }
}

// ✅ “입장 클릭”이 아니어도, 화면을 처음 건드리는 순간 브금 켜지게(18초 체류 대비)
function armFirstGestureBgm() {
  const handler = async () => {
    await startBgmFromGesture();
    window.removeEventListener("pointerdown", handler);
    window.removeEventListener("touchstart", handler);
    window.removeEventListener("keydown", handler);
  };

  window.addEventListener("pointerdown", handler, { passive: true });
  window.addEventListener("touchstart", handler, { passive: true });
  window.addEventListener("keydown", handler);
}

armFirstGestureBgm();


// ======================
// ✅ Gate 클릭: 브금 재생 보장 후 이동
// ======================
gate.addEventListener("click", async () => {
  if (entered) return;
  entered = true;

  await startBgmFromGesture();

  // 재생 시작 여유 후 이동
  setTimeout(() => {
    location.href = "honemakura.html";
  }, 450);
}, { once: true });
