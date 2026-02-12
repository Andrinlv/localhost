document.addEventListener("DOMContentLoaded", () => {
    
    // --- ELEMENTE HOLEN ---
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    const settingsBtn = document.querySelector(".settings-button");
    const modalOverlay = document.getElementById("settings-modal");
    const closeSettingsBtn = document.getElementById("close-settings");
    const themeToggle = document.getElementById("theme-toggle");
    const videoToggle = document.getElementById("video-toggle");
    const bgVideo = document.getElementById("bg-video");

    // 1. LOGIN LOGIK
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === "test" && password === "1234") {
            window.location.href = "https://andrinlv.github.io/valentinesday/";
        } else {
            alert("Benutzername oder Passwort ist falsch.");
        }
    });

    // 2. SETTINGS FENSTER (Öffnen/Schließen)
    settingsBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("hidden");
        modalOverlay.classList.add("show");
    });

    const closeMenu = () => {
        modalOverlay.classList.remove("show");
        // Optional: Nach der Animation die Klasse 'hidden' hinzufügen (via Timeout)
    };

    closeSettingsBtn.addEventListener("click", closeMenu);

    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            closeMenu();
        }
    });

    // 3. LIGHT MODE TOGGLE
    themeToggle.addEventListener("change", () => {
        if (themeToggle.checked) {
            document.body.classList.add("light-mode");
        } else {
            document.body.classList.remove("light-mode");
        }
    });

    // 4. VIDEO PAUSE/PLAY TOGGLE
    videoToggle.addEventListener("change", () => {
        if (videoToggle.checked) {
            // Schalter an -> Video spielt
            bgVideo.play();
        } else {
            // Schalter aus -> Video PAUSIERT (Standbild)
            bgVideo.pause();
        }
    });
});