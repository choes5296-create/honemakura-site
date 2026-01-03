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

// ✅ 상태: 처음 클릭은 '브금 시작', 그 다음 클릭은 '입장'
let readyToEnter = false;

function showLine(text) {
  introLine.textContent = text;

  introLine.classList.remove("out");
  introLine.classList.add("in");

 setTimeout(() => {
  introLine.classList.remove("in");
  introLine.classList.add("out");
}, 4500); // 6초 중 마지막 1.5초 페이드아웃
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

// ✅ (선택) 이전에 허용 받은 적 있으면 로드 직후 재생 시도(될 수도/안될 수도 있음)
(async () => {
  if (sessionStorage.getItem("bgmAllowed") === "1") {
    try {
      bgm.volume = 0.7;
      await bgm.play();
      readyToEnter = true; // 이미 재생 성공이면 바로 입장 가능 상태
    } catch (e) {
      // 막히면 첫 클릭에서 시작
    }
  }
})();

gate.addEventListener("pointerdown", async () => {
  // 이미 브금 켜졌으면 즉시 입장
  if (readyToEnter) {
    location.href = "honemakura.html";
    return;
  }

  // 첫 클릭: 브금 켜기
  try {
    bgm.volume = 0.7;
    await bgm.play();
    sessionStorage.setItem("bgmAllowed", "1");
    readyToEnter = true;

    introLine.textContent = "（もう一度触れて、入れ。）";
    introLine.classList.add("in");
  } catch (e) {
  
  }
}, { passive: false });
