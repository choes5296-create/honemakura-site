// ===== 브금 =====
const bgm = document.getElementById("bgm");

async function tryPlayBgm() {
  if (!bgm) return false;
  try {
    bgm.volume = 0.7;
    await bgm.play();
    return true;
  } catch (e) {
    return false;
  }
}

// 로드 직후 시도(인덱스에서 언락했으면 여기서 바로 될 때가 많음)
(async () => {
  const allowed = sessionStorage.getItem("bgmAllowed") === "1";
  if (allowed) {
    const ok = await tryPlayBgm();
    if (!ok) {
      // 막혔으면: 첫 사용자 제스처에서 재생
      window.addEventListener("pointerdown", () => tryPlayBgm(), { once: true });
      window.addEventListener("keydown", () => tryPlayBgm(), { once: true });
    }
  } else {
    // 플래그가 없으면 무조건 첫 제스처에서
    window.addEventListener("pointerdown", () => tryPlayBgm(), { once: true });
    window.addEventListener("keydown", () => tryPlayBgm(), { once: true });
  }
})();

// ===== 상단 문구 10초마다 =====
const lineEl = document.getElementById("line");
const topLines = [
  "「よくぞここまで来たな。」",
  "「この俺様が、そなたと共にある。」",
  "「故にそなたは、恐れるものなど何もない。」"
];
let topIdx = 0;

function setTopLine() {
  if (!lineEl) return;
  lineEl.textContent = topLines[topIdx];
  topIdx = (topIdx + 1) % topLines.length;
}
setTopLine();
setInterval(setTopLine, 10000);

// ===== 아코디언 =====
document.querySelectorAll("[data-acc]").forEach((sec) => {
  const head = sec.querySelector(".accHead");
  if (!head) return;
  head.addEventListener("click", () => sec.classList.toggle("open"));
});

// ===== 진명 모달: 자동으로 사라짐 =====
const btn = document.getElementById("trueNameBtn");
const dim = document.getElementById("dim");
const modal = document.getElementById("modal");
const modalLine = document.getElementById("modalLine");

let autoCloseTimer = null;

function openModal(text) {
  if (!dim || !modal || !modalLine) return;

  modalLine.textContent = text;

  dim.classList.add("show");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");

  clearTimeout(autoCloseTimer);
  autoCloseTimer = setTimeout(() => closeModal(), 2200);
}

function closeModal() {
  if (!dim || !modal) return;
  dim.classList.remove("show");
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

dim?.addEventListener("click", closeModal);

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

    if (count === 31) {
      openModal(finalLine);
      btn.textContent = "…접혔다.";
      btn.disabled = true;
      return;
    }

    if (count === 10) {
      openModal(line10);
      btn.textContent = "다시 열어본다.";
      return;
    }

    const phaseIndex = (count < 10) ? (count - 1) : (count - 11);
    const idx = ((phaseIndex % linesA.length) + linesA.length) % linesA.length;

    openModal(linesA[idx]);
    btn.textContent = (count < 10) ? "진명을 열어본다." : "다시 열어본다.";
  });
}
