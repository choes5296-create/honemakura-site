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

  // 10초 중 후반부에 서서히 사라지게
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

  try {
    bgm.volume = 0.7;
    await bgm.play(); // ✅ 첫 클릭에서만 확실히 됨
    sessionStorage.setItem("bgmAllowed", "1");
  } catch (e) {
    // 여기서 실패해도 이동은 하되, 상세에서 다시 “클릭 한번”으로 켜지게 해둠
    sessionStorage.setItem("bgmAllowed", "1");
  }

  setTimeout(() => {
    location.href = "honemakura.html";
  }, 250);
}, { once: true });
