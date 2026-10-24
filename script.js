"use strict";

// ==================================================
// CONFIGURATION
// ==================================================

// Replace this with the email address activated in FormSubmit.
const OWNER_EMAIL = "atharvaingale12@gmail.com";

// FormSubmit AJAX endpoint.
const FORM_ENDPOINT =
    `https://formsubmit.co/ajax/${OWNER_EMAIL}`;

// Maximum time to wait for the email service.
const REQUEST_TIMEOUT = 15000;


// ==================================================
// ELEMENTS
// ==================================================

const questionScreen = document.getElementById("questionScreen");
const successScreen = document.getElementById("successScreen");

const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");

const question = document.getElementById("question");
const subtitle = document.querySelector(".subtitle");
const hint = document.getElementById("hint");

const eyebrow = document.getElementById("eyebrow");
const topDecoration = document.querySelector(".top-decoration");
const illustration = document.querySelector(".illustration");

const instaForm = document.getElementById("instaForm");
const instagramInput = document.getElementById("instagram");
const submitButton = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");

const celebration = document.getElementById("celebration");


// ==================================================
// RUNAWAY NO BUTTON
// ==================================================

let noButtonEscaped = false;
let lastEscapeTime = 0;

function moveNoButton(pointerX, pointerY) {
    const now = Date.now();

    if (now - lastEscapeTime < 180) {
        return;
    }

    lastEscapeTime = now;

    if (!noButtonEscaped) {
        const rect = noButton.getBoundingClientRect();

        noButton.style.position = "fixed";
        noButton.style.left = `${rect.left}px`;
        noButton.style.top = `${rect.top}px`;

        noButtonEscaped = true;
    }

    const width = noButton.offsetWidth;
    const height = noButton.offsetHeight;
    const margin = 12;

    const maxX = Math.max(
        margin,
        window.innerWidth - width - margin
    );

    const maxY = Math.max(
        margin,
        window.innerHeight - height - margin
    );

    const currentX = parseFloat(noButton.style.left) || 0;
    const currentY = parseFloat(noButton.style.top) || 0;

    let newX = currentX;
    let newY = currentY;

    for (let i = 0; i < 25; i++) {
        const x =
            margin + Math.random() * Math.max(0, maxX - margin);

        const y =
            margin + Math.random() * Math.max(0, maxY - margin);

        const distance = Math.hypot(
            x + width / 2 - pointerX,
            y + height / 2 - pointerY
        );

        newX = x;
        newY = y;

        if (distance > 150) {
            break;
        }
    }

    noButton.style.left = `${newX}px`;
    noButton.style.top = `${newY}px`;

    hint.textContent = "Hehe. Try catching it. 👀";
}

document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") {
        return;
    }

    if (questionScreen.hidden) {
        return;
    }

    const rect = noButton.getBoundingClientRect();

    const distance = Math.hypot(
        event.clientX - (rect.left + rect.width / 2),
        event.clientY - (rect.top + rect.height / 2)
    );

    if (distance < (noButtonEscaped ? 85 : 95)) {
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

window.addEventListener("resize", () => {
    if (!noButtonEscaped) {
        return;
    }

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


// ==================================================
// YES BUTTON
// ==================================================

yesButton.addEventListener("click", () => {
    // Hide the entire question screen.
    questionScreen.hidden = true;

    // Hide its decorations.
    eyebrow.hidden = true;
    topDecoration.hidden = true;
    illustration.hidden = true;

    // Reveal the success screen.
    successScreen.hidden = false;

    // Start the celebration.
    launchCelebration();

    // Focus the username field after the transition.
    setTimeout(() => {
        instagramInput.focus({ preventScroll: true });
    }, 600);
});


// ==================================================
// HEART CELEBRATION
// ==================================================

function launchCelebration() {
    const hearts = ["💗", "💕", "💖", "💘", "❤️", "🌸"];

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement("span");

            heart.className = "heart";

            heart.textContent =
                hearts[Math.floor(Math.random() * hearts.length)];

            heart.style.left = `${Math.random() * 100}vw`;

            heart.style.fontSize =
                `${18 + Math.random() * 22}px`;

            heart.style.setProperty(
                "--duration",
                `${2.5 + Math.random() * 2}s`
            );

            celebration.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 5000);

        }, i * 70);
    }
}


// ==================================================
// INSTAGRAM VALIDATION
// ==================================================

function getValidatedUsername(value) {
    let username = value.trim();

    // Remove a single leading @ if present.
    if (username.startsWith("@")) {
        username = username.slice(1);
    }

    // Instagram usernames contain letters, numbers,
    // periods and underscores.
    const validUsername = /^[A-Za-z0-9._]{1,30}$/;

    if (!validUsername.test(username)) {
        throw new Error(
            "Please enter a valid Instagram username."
        );
    }

    if (username.startsWith(".") || username.endsWith(".")) {
        throw new Error(
            "Your username cannot start or end with a period."
        );
    }

    if (username.includes("..")) {
        throw new Error(
            "Your username cannot contain consecutive periods."
        );
    }

    return username;
}


// ==================================================
// EMAIL SUBMISSION
// ==================================================

instaForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Validate before sending.
    let username;

    try {
        username = getValidatedUsername(instagramInput.value);
    } catch (error) {
        formMessage.textContent = error.message;
        formMessage.className = "form-message error";
        return;
    }

    // Prevent duplicate submissions.
    if (submitButton.disabled) {
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending... 💌";

    formMessage.textContent = "";
    formMessage.className = "form-message";

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, REQUEST_TIMEOUT);

    try {
        const payload = {
            email: OWNER_EMAIL,
            _subject: "💗 Someone said YES to your pani puri date!",
            _template: "table",
            _captcha: "true",
            "Instagram Username": `@${username}`
        };

        const response = await fetch(FORM_ENDPOINT, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },

            body: JSON.stringify(payload),

            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const result = await response.json().catch(() => null);

        if (!response.ok || !result || result.success !== "true") {
            throw new Error(
                result?.message ||
                "The email service could not accept the submission."
            );
        }

        // Replace the form only after the service accepts it.
        instaForm.innerHTML = `
            <div class="form-message success">
                <h3>Got my Gift (Your ID 💗) </h3>
                <p>
                    Now let's plan that pani puri date. 🌸
                </p>
            </div>
        `;

    } catch (error) {
        clearTimeout(timeoutId);

        console.error("Form submission error:", error);

        submitButton.disabled = false;
        submitButton.textContent = "Try again 💌";

        formMessage.className = "form-message error";

        if (error.name === "AbortError") {
            formMessage.textContent =
                "The request timed out. Check your connection and try again.";
        } else {
            formMessage.textContent =
                "We couldn't send your username. Please try again in a moment.";
        }

    }
});