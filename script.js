console.log("JavaScript is working!");

const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const buttonArea = document.getElementById("buttonArea");

const question = document.getElementById("question");
const subtitle = document.querySelector(".subtitle");
const hint = document.getElementById("hint");

const successScreen = document.getElementById("successScreen");
const celebration = document.getElementById("celebration");

let hasEscaped = false;
let lastEscapeTime = 0;

function moveNoButton(pointerX, pointerY) {
    const now = Date.now();

    if (now - lastEscapeTime < 180) return;
    lastEscapeTime = now;

    if (!hasEscaped) {
        const rect = noButton.getBoundingClientRect();

        noButton.style.position = "fixed";
        noButton.style.left = `${rect.left}px`;
        noButton.style.top = `${rect.top}px`;

        hasEscaped = true;
    }

    const width = noButton.offsetWidth;
    const height = noButton.offsetHeight;
    const margin = 12;

    const maxX = Math.max(margin, window.innerWidth - width - margin);
    const maxY = Math.max(margin, window.innerHeight - height - margin);

    const currentX = parseFloat(noButton.style.left) || 0;
    const currentY = parseFloat(noButton.style.top) || 0;

    let newX = currentX;
    let newY = currentY;

    for (let i = 0; i < 20; i++) {
        const x = margin + Math.random() * Math.max(0, maxX - margin);
        const y = margin + Math.random() * Math.max(0, maxY - margin);

        const distance = Math.hypot(
            x + width / 2 - pointerX,
            y + height / 2 - pointerY
        );

        const oldDistance = Math.hypot(
            currentX + width / 2 - pointerX,
            currentY + height / 2 - pointerY
        );

        newX = x;
        newY = y;

        if (distance > 130 || distance > oldDistance + 70) break;
    }

    noButton.style.left = `${newX}px`;
    noButton.style.top = `${newY}px`;

    hint.textContent = "Hehe. Try catching it. 👀";
}

document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;

    const rect = noButton.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.hypot(
        event.clientX - centerX,
        event.clientY - centerY
    );

    const threshold = hasEscaped ? 85 : 95;

    if (distance < threshold) {
        moveNoButton(event.clientX, event.clientY);
    }
});

noButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    moveNoButton(event.clientX, event.clientY);
});

noButton.addEventListener("click", (event) => {
    event.preventDefault();

    moveNoButton(
        event.clientX || window.innerWidth / 2,
        event.clientY || window.innerHeight / 2
    );
});

yesButton.addEventListener("click", () => {
    question.hidden = true;
    subtitle.hidden = true;
    buttonArea.hidden = true;
    hint.hidden = true;
    noButton.hidden = true;

    successScreen.hidden = false;

    launchCelebration();
});

function launchCelebration() {
    const hearts = ["💗", "💕", "💖", "💘", "❤️", "🌸"];

    for (let i = 0; i < 35; i++) {
        setTimeout(() => {
            const heart = document.createElement("span");

            heart.className = "heart";
            heart.textContent =
                hearts[Math.floor(Math.random() * hearts.length)];

            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.fontSize = `${18 + Math.random() * 22}px`;

            heart.style.setProperty(
                "--duration",
                `${2.5 + Math.random() * 2}s`
            );

            celebration.appendChild(heart);

            setTimeout(() => heart.remove(), 5000);
        }, i * 80);
    }
}

window.addEventListener("resize", () => {
    if (!hasEscaped) return;

    const margin = 12;

    const maxX = Math.max(
        margin,
        window.innerWidth - noButton.offsetWidth - margin
    );

    const maxY = Math.max(
        margin,
        window.innerHeight - noButton.offsetHeight - margin
    );

    const x = parseFloat(noButton.style.left) || 0;
    const y = parseFloat(noButton.style.top) || 0;

    noButton.style.left = `${Math.min(x, maxX)}px`;
    noButton.style.top = `${Math.min(y, maxY)}px`;
});