// ===== 브금: 인덱스에서 한번 재생 허용 받으면 상세에서도 이어서 재생 시도 =====
const bgm = document.getElementById("bgm");
async function tryPlayBgm() {
  try {
    bgm.volume = 0.7;
    await bgm.play();
    return true;
  } catch (e) {
    return false;
  }
}

(async () => {
  if (sessionStorage.getItem("bgmAllowed") === "1") {
    const ok = await tryPlayBgm();
    if (!ok) {
      // 정책으로 막히면: 상세에서 “첫 클릭”에서 재생
      window.addEventListener("click", () => tryPlayBgm(), { once: true });
    }
  } else {
    // 혹시 플래그가 없더라도: 클릭하면 재생되게
    window.addEventListener("click", () => tryPlayBgm(), { once: true });
  }
})();

// ===== 상단 문구(초반 글귀) 10초마다 교체 =====
const lineEl = document.getElementById("line");
const topLines = [
  "「よくぞここまで来たな。」",
  "「この俺様が、そなたと共にある。」",
  "「故にそなたは、恐れるものなど何もない。」"
];
let topIdx = 0;
function setTopLine() {
  lineEl.textContent = topLines[topIdx];
  topIdx = (topIdx + 1) % topLines.length;
}
setTopLine();
setInterval(setTopLine, 10000);

// ===== 아코디언 =====
document.querySelectorAll("[data-acc]").forEach((sec) => {
  const head = sec.querySelector(".accHead");
  if (!head) return;

  head.addEventListener("click", () => {
    sec.classList.toggle("open");
  });
});

// ===== 진명 모달 =====
const btn = document.getElementById("trueNameBtn");
const dim = document.getElementById("dim");
const modal = document.getElementById("modal");
const modalLine = document.getElementById("modalLine");

function openModal() {
  dim.classList.add("show");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  dim.classList.remove("show");
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

dim?.addEventListener("click", closeModal);
modal?.addEventListener("click", closeModal);

if (btn && modalLine) {
  let count = 0;

  const linesA = [
    "「我が儘な愛し子よ。そなたがそれに触れてみるであろうことは、既に分かっていた。」",
    "「今はまだ、その時ではない。」",
    "「ならぬ、我が儘な愛し子よ。」"
  ];

  const line10 = "「まったく、この我が儘めが。」";
  const finalLine = "「完全な静けさ… そなたが、我をそう呼んでくれたな。」";

  btn.addEventListener("click", () => {
    count += 1;
    openModal();

    if (count === 31) {
      modalLine.textContent = finalLine;
      btn.textContent = "…접혔다.";
      btn.disabled = true;
      return;
    }

    if (count === 10) {
      modalLine.textContent = line10;
      btn.textContent = "다시 열어본다.";
      return;
    }

    const phaseIndex = (count < 10) ? (count - 1) : (count - 11);
    const idx = ((phaseIndex % linesA.length) + linesA.length) % linesA.length;

    modalLine.textContent = linesA[idx];
    btn.textContent = (count < 10) ? "진명을 열어본다." : "다시 열어본다.";
  });
}
