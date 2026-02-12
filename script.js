document.addEventListener("DOMContentLoaded", () => {
    
    // --- LOGIN ELEMENTE ---
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    // --- SETTINGS ELEMENTE ---
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

        if (username === "Louisa" && password === "IchLiebeDich") {
            window.location.href = "https://andrinlv.github.io/valentinesday/";
        } else {
            alert("Benutzername oder Passwort ist falsch.");
        }
    });

    // 2. SETTINGS FENSTER ÖFFNEN / SCHLIESSEN
    settingsBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("hidden"); // Zur Sicherheit
        modalOverlay.classList.add("show");
    });

    closeSettingsBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("show");
        // Kleiner Timeout damit die Animation zu Ende spielt bevor wir hidden setzen (optional)
    });

    // Schließen wenn man nebendran klickt
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove("show");
        }
    });

    // 3. LIGHT MODE / DARK MODE SCHALTER
    themeToggle.addEventListener("change", () => {
        if (themeToggle.checked) {
            document.body.classList.add("light-mode");
        } else {
            document.body.classList.remove("light-mode");
        }
    });

    // 4. VIDEO EIN / AUS SCHALTER
    videoToggle.addEventListener("change", () => {
        if (videoToggle.checked) {
            // Video einschalten
            bgVideo.style.display = "block";
            bgVideo.play();
        } else {
            // Video ausschalten
            bgVideo.pause();
            bgVideo.style.display = "none"; 
            // Wenn Video weg ist, greift die background-color vom Body (definiert im CSS)
        }
    });
});