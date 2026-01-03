const gate = document.getElementById("gate");
const bgm = document.getElementById("bgm");
const introLine = document.getElementById("introLine");

const lines = [
  "「よくぞここまで来たな。(잘 찾아왔구나.)」",
  "「この俺様が、ここにある。俺様が、そなたと共にある。(이 내가 있다. 이 내가 여기에 있다.)」",
  "「故にそなたは、いかなる生においても恐れるものなど何もない。(그러니 너는, 그 어떤 생에서도 두려울 것 따위는 없다.)」"
];

let i = 0;
let timer = null;
let entered = false;

// ===== 인트로 라인(10초) =====
function showLine(text) {
  introLine.textContent = text;

  introLine.classList.remove("out");
  introLine.classList.add("in");

  setTimeout(() => {
    introLine.classList.remove("in");
    introLine.classList.add("out");
  }, 8000);
}

function loopLines() {
  clearInterval(timer);
  showLine(lines[i]);
  i = (i + 1) % lines.length;

  timer = setInterval(() => {
    showLine(lines[i]);
    i = (i + 1) % lines.length;
  }, 10000);
}
loopLines();

// ===== 브금: "첫 제스처"에서만 가능 =====
async function startBgmOnce() {
  try {
    bgm.volume = 0.7;
    await bgm.play();
    sessionStorage.setItem("bgmAllowed", "1");
  } catch (e) {
    // 막혀도 플래그는 남겨서 상세에서 다시 시도하게
    sessionStorage.setItem("bgmAllowed", "1");
  }
}

// pointerdown이 click보다 먼저 들어와서 재생 성공률이 더 높음
gate.addEventListener("pointerdown", () => {
  if (entered) return;
  startBgmOnce();
}, { once: true });

// ===== "아무데나 한번 클릭하면 상세로" =====
gate.addEventListener("click", () => {
  if (entered) return;
  entered = true;

  setTimeout(() => {
    location.href = "honemakura.html";
  }, 250);
}, { once: true });
