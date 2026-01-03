// ====== 공통 유틸 ======
function onReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else fn();
}

// ====== 1) index: 초반 글귀 연출 + 클릭 이동 ======
const introLines = [
  "「よくぞここまで来たな。(잘 찾아왔구나.)」",
  "「この俺様が、ここにある。俺様が、そなたと共にある。(이 내가 있다. 이 내가 여기에 있다.)」",
  "「故にそなたは、いかなる生においても恐れるものなど何もない。(그러니 너는, 그 어떤 생에서도 두려워할 것 따위는 없다.)」"
];

function runIntroQuotes() {
  const lineEl = document.getElementById("line");
  if (!lineEl) return;

  let idx = 0;

  // 10초 한 줄: fade in/out (in 1.6s -> hold -> out 1.6s)
  const FADE = 1600;
  const TOTAL = 10000;
  const HOLD = TOTAL - FADE * 2;

  const show = (text) => {
    lineEl.textContent = text;
    lineEl.classList.remove("out");
    // 강제로 리플로우(연속 토글 안정화)
    void lineEl.offsetHeight;
    lineEl.classList.add("in");

    setTimeout(() => {
      lineEl.classList.remove("in");
      lineEl.classList.add("out");
    }, FADE + HOLD);
  };

  // 초기 상태
  lineEl.classList.add("out");
  show(introLines[idx]);

  setInterval(() => {
    idx = (idx + 1) % introLines.length;
    show(introLines[idx]);
  }, TOTAL);
}

function wireGateEnter() {
  const gate = document.getElementById("gate");
  if (!gate) return;

  let moved = false;

  const go = () => {
    if (moved) return;
    moved = true;

    // "사용자 제스처로 들어왔다" 플래그 -> 상세에서 BGM 재생 시도
    sessionStorage.setItem("fromGate", "1");

    location.href = "honemakura.html";
  };

  gate.addEventListener("click", go);
  gate.addEventListener("touchstart", go, { passive: true });

  gate.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  });
}

// ====== 2) 상세: BGM + 아코디언 + 진명 버튼 ======
async function tryPlayBgm() {
  const bgm = document.getElementById("bgm");
  const btn = document.getElementById("bgmBtn");
  if (!bgm) return;

  bgm.volume = 0.7;

  // gate에서 넘어온 경우만 자동시도(아무 진입에서나 자동재생 시도하면 브라우저가 더 빡셈)
  const fromGate = sessionStorage.getItem("fromGate") === "1";
  if (fromGate) sessionStorage.removeItem("fromGate");

  const showButton = () => {
    if (!btn) return;
    btn.hidden = false;
    btn.addEventListener("click", async () => {
      try {
        await bgm.play();
        btn.hidden = true;
      } catch (_) {}
    }, { once: true });
  };

  if (!fromGate) {
    showButton(); // 직접 접근하면 수동재생 버튼만
    return;
  }

  try {
    await bgm.play();
    if (btn) btn.hidden = true;
  } catch (_) {
    showButton();
  }
}

function wireAccordion() {
  const accs = document.querySelectorAll("[data-acc]");
  if (!accs.length) return;

  accs.forEach((sec) => {
    const head = sec.querySelector(".accHead");
    if (!head) return;

    head.addEventListener("click", () => {
      const isOpen = sec.classList.contains("open");

      // 한 번에 하나만 열고 싶으면 아래 주석 해제
      accs.forEach(a => a.classList.remove("open"));

      if (!isOpen) sec.classList.add("open");
    });
  });
}

function wireTrueName() {
  const btn = document.getElementById("trueNameBtn");
  const box = document.getElementById("revealBox");
  const dim = document.getElementById("dim");
  if (!btn || !box) return;

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

    // 번쩍 연출 (CSS는 .dim.show)
    if (dim) {
      dim.classList.add("show");
      setTimeout(() => dim.classList.remove("show"), 250);
    }

    if (count === 31) {
      box.insertAdjacentHTML("beforeend", `<p class="revealLine">${finalLine}</p>`);
      btn.textContent = "…접혔다.";
      btn.disabled = true;
      return;
    }

    if (count === 10) {
      box.insertAdjacentHTML("beforeend", `<p class="revealLine">${line10}</p>`);
      btn.textContent = "다시 열어본다.";
      return;
    }

    const phaseIndex = (count < 10) ? (count - 1) : (count - 11);
    const idx = phaseIndex % linesA.length;

    box.insertAdjacentHTML("beforeend", `<p class="revealLine">${linesA[idx]}</p>`);
    btn.textContent = (count < 10) ? "진명을 열어본다." : "다시 열어본다.";
  });
}

onReady(() => {
  runIntroQuotes();
  wireGateEnter();

  wireAccordion();
  wireTrueName();
  tryPlayBgm();
});
