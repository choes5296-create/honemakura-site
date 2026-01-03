const gate = document.getElementById("gate");
const bgm = document.getElementById("bgm");
const introLine = document.getElementById("introLine");

const lines = [
  "「よくぞここまで来たな。」",
  "「この俺様が、そなたと共にある。」",
  "「故にそなたは、恐れるものなど何もない。」"
];

let lineIndex = 0;
let charIndex = 0;
let typingTimer = null;
let entered = false;

function typeLine(text){
  clearInterval(typingTimer);
  introLine.textContent = "";
  introLine.classList.add("in");
  introLine.classList.remove("out");
  charIndex = 0;

  typingTimer = setInterval(() => {
    introLine.textContent += text[charIndex];
    charIndex++;
    if (charIndex >= text.length) {
      clearInterval(typingTimer);

      // 6초 후 사라짐
      setTimeout(() => {
        introLine.classList.remove("in");
        introLine.classList.add("out");
      }, 4000);
    }
  }, 70); // 타이핑 속도
}

function loopLines(){
  typeLine(lines[lineIndex]);
  lineIndex = (lineIndex + 1) % lines.length;

  setTimeout(loopLines, 6000);
}

loopLines();

/* ===== 클릭 → 브금 + 이동 ===== */
gate.addEventListener("click", async () => {
  if (entered) return;
  entered = true;

  try {
    bgm.volume = 0.7;
    await bgm.play();
    sessionStorage.setItem("bgmAllowed", "1");
  } catch(e){
    sessionStorage.setItem("bgmAllowed", "1");
  }

  setTimeout(() => {
    location.href = "honemakura.html";
  }, 300);
}, { once:true });

