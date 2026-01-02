const lines = [
  "「よくぞここまで来たな。(잘 찾아왔구나.)」",
  "「この俺様が、ここにある。俺様が、そなたと共にある。(이 내가 있다. 이 내가 여기에 있다.)」",
  "「故にそなたは、いかなる生においても恐れるものなど何もない。(그러니 너는, 그 어떤 생에서도 두려워할 것 따위는 없다.)」"
];

const lineEl = document.getElementById("line");

let index = 0;
let timer = null;

function typeLine(text) {
  clearInterval(timer);
  lineEl.textContent = "";
  let i = 0;

  timer = setInterval(() => {
    lineEl.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, 30);
}

function nextLine() {
  typeLine(lines[index]);
  index = (index + 1) % lines.length;
}

nextLine();
setInterval(nextLine, 5200);


const btn = document.getElementById("trueNameBtn");
const box = document.getElementById("revealBox");
const dim = document.getElementById("dim");

if (btn && box) {
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

    if (dim) {
      dim.classList.add("on");
      setTimeout(() => dim.classList.remove("on"), 250);
    }

    if (count === 31) {
      box.innerHTML += `<p class="revealLine">${finalLine}</p>`;
      btn.textContent = "…접혔다.";
      btn.disabled = true;
      return;
    }

    if (count === 10) {
      box.innerHTML += `<p class="revealLine">${line10}</p>`;
      btn.textContent = "다시 열어본다.";
      return;
    }

    const phaseIndex = (count < 10) ? (count - 1) : (count - 11);
    const idx = phaseIndex % linesA.length;

    box.innerHTML += `<p class="revealLine">${linesA[idx]}</p>`;

    if (count < 10) btn.textContent = "진명을 열어본다.";
    else btn.textContent = "다시 열어본다.";
  });
}

