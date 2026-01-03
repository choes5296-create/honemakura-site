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

gate.addEventListener("click", async () => {
  if (entered) return;
  entered = true;

  sessionStorage.setItem("bgmAllowed", "1");

  try {
    bgm.volume = 0.7;
    bgm.currentTime = 0;
    await bgm.play(); // ✅ 클릭 제스처로 보장
  } catch (e) {
    // 실패해도 상세에서 클릭 1번으로 켜지게 되어 있음
  }

  // ✅ "브금이 안 들리고 바로 넘어감" 방지: 조금 더 여유
  setTimeout(() => {
    location.href = "honemakura.html";
  }, 900);
}, { once: true });
