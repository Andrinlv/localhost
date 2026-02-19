document.addEventListener("DOMContentLoaded", () => {

    // --- HILFSFUNKTION FÜR SYSTEM-LOGS ---
    function writeLog(actionMessage) {
        const logs = JSON.parse(localStorage.getItem("app_logs")) || [];
        // Neuen Log ganz oben in die Liste einfügen
        logs.unshift({
            message: actionMessage,
            timestamp: new Date().getTime() // Speichert die aktuelle Zeit auf die Millisekunde genau
        });
        // Speichern (wir behalten nur die letzten 50, damit der Speicher nicht platzt)
        localStorage.setItem("app_logs", JSON.stringify(logs.slice(0, 50)));
    }

    // --- ELEMENTE ---
    const loginBox = document.getElementById("login-box");
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const submitBtn = document.getElementById("submit-btn");

    const settingsBtn = document.querySelector(".settings-button");
    const modalOverlay = document.getElementById("settings-modal");
    const closeSettingsBtn = document.getElementById("close-settings");
    const themeToggle = document.getElementById("theme-toggle");
    const videoToggle = document.getElementById("video-toggle");
    const bgVideo = document.getElementById("bg-video");

    const badges = document.querySelectorAll('.glass-badge');

    // --- 1. HAPTIK & BADGE LOGIK (MOBILE) ---
    badges.forEach(badge => {
        badge.addEventListener('click', function (e) {
            // Verhindern, dass Klicks durchschlagen
            e.stopPropagation();

            // Vibration auslösen (nur wenn Browser unterstützt)
            if (navigator.vibrate) {
                navigator.vibrate(40); // 40ms Vibration
            }

            // Auf Mobile: Klasse toggeln für Anzeige
            // Wir entfernen die 'active' Klasse von allen anderen Badges zuerst
            badges.forEach(b => {
                if (b !== this) b.classList.remove('active');
            });

            this.classList.toggle('active');
        });
    });

    // Klick irgendwo anders hin schließt die Badges wieder
    document.addEventListener('click', () => {
        badges.forEach(b => b.classList.remove('active'));
    });

    // --- 2. KONTROLLZENTRUM LOGIK (LOGIN & REGISTRIERUNG) ---
    const authForm = document.getElementById("auth-form");
    const formTitle = document.getElementById("form-title");
    const targetLinkGroup = document.getElementById("target-link-group");
    const targetLinkInput = document.getElementById("target-link");
    const toggleAuthModeBtn = document.getElementById("toggle-auth-mode");
    const modeText = document.getElementById("mode-text");

    let isLoginMode = true; // Speichert, in welchem Modus wir uns befinden

    // Initialisiere die "Datenbank" (localStorage) mit einem Standard-Benutzer, falls sie leer ist
    if (!localStorage.getItem("app_users")) {
        const defaultUsers = {
            "Valentinesday": { password: "14.02.2026", redirect: "https://andrinlv.github.io/valentinesday/" }
        };
        localStorage.setItem("app_users", JSON.stringify(defaultUsers));
    }

    // Wechsel zwischen Login und Registrierung
    toggleAuthModeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode; // Modus umkehren

        if (isLoginMode) {
            formTitle.innerText = "Zugang";
            targetLinkGroup.classList.add("hidden");
            submitBtn.querySelector(".btn-text").innerText = "Login";
            modeText.innerText = "Neuen Bereich anlegen?";
            toggleAuthModeBtn.innerText = "Registrieren";
            targetLinkInput.removeAttribute("required");
        } else {
            formTitle.innerText = "Neuen Zugang erstellen";
            targetLinkGroup.classList.remove("hidden");
            submitBtn.querySelector(".btn-text").innerText = "Speichern";
            modeText.innerText = "Bereits einen Zugang?";
            toggleAuthModeBtn.innerText = "Zum Login";
            targetLinkInput.setAttribute("required", "true");
        }
    });

    // Formular absenden (Login oder Registrierung verarbeiten)
    authForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Aktuelle Benutzer aus dem Notizbuch (localStorage) holen
        const users = JSON.parse(localStorage.getItem("app_users"));

        const originalBtnText = submitBtn.querySelector(".btn-text").innerText;
        submitBtn.querySelector(".btn-text").innerText = isLoginMode ? "Prüfung..." : "Speichere...";

        setTimeout(() => {
            if (isLoginMode) {
                // --- LOGIN LOGIK ---
                if (users[username] && users[username].password === password) {
                    submitBtn.style.backgroundColor = "#4CAF50";
                    submitBtn.querySelector(".btn-text").innerText = "Erfolg!";
                    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);

                    users[username].lastLogin = new Date().getTime(); // Speichert die Login-Zeit
                    localStorage.setItem("app_users", JSON.stringify(users));
                    writeLog(`Login: ${username} hat sich angemeldet.`);

                    if (username === "Admin") {
                        sessionStorage.setItem("admin_logged_in", "true");
                        sessionStorage.setItem("cureent_user", username);
                        setTimeout(() => {
                            window.location.href = "dashboard.html"; // zum Dashboard
                        }, 500);
                    } else {
                        // Weiterleitung zum gespeicherten Link des Users
                        setTimeout(() => {
                            window.location.href = users[username].redirect;
                        }, 500);
                    }
                } else {
                    triggerError(originalBtnText);
                }
            } else {
                // --- REGISTRIERUNGS LOGIK ---
                if (users[username]) {
                    alert("Diesen Benutzernamen gibt es bereits!");
                    triggerError(originalBtnText);
                } else {
                    // Neuen Benutzer zum Objekt hinzufügen
                    users[username] = {
                        password: password,
                        redirect: targetLinkInput.value
                    };

                    // Aktualisiertes Objekt wieder im localStorage speichern
                    localStorage.setItem("app_users", JSON.stringify(users));

                    writeLog(`System: Neuer Zugang für ${username} erstellt.`);

                    alert(`Zugang für ${username} erfolgreich erstellt! Du kannst dich jetzt einloggen.`);

                    // Formular zurücksetzen und in den Login-Modus wechseln
                    authForm.reset();
                    toggleAuthModeBtn.click();
                }
            }
        }, 600);
    });

    function triggerError(originalText) {
        // Die gleiche Shake-Funktion wie zuvor
        loginBox.classList.remove("shake-horizontal");
        void loginBox.offsetWidth;
        loginBox.classList.add("shake-horizontal");

        usernameInput.style.borderColor = "#ff5252";
        passwordInput.style.borderColor = "#ff5252";

        submitBtn.querySelector(".btn-text").innerText = originalText;

        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

        setTimeout(() => {
            loginBox.classList.remove("shake-horizontal");
            usernameInput.style.borderColor = "";
            passwordInput.style.borderColor = "";
        }, 2000);
    }

    // --- 3. SETTINGS MODAL ---
    function openModal() {
        modalOverlay.classList.remove("hidden");
        modalOverlay.classList.add("show");
        if (navigator.vibrate) navigator.vibrate(20);
    }

    function closeModal() {
        modalOverlay.classList.remove("show");
        setTimeout(() => {
            // modalOverlay.classList.add("hidden"); // Optional
        }, 300);
    }

    settingsBtn.addEventListener("click", openModal);
    closeSettingsBtn.addEventListener("click", closeModal);

    // Modal schließen beim Klick auf Hintergrund
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // --- 4. THEME & VIDEO TOGGLE ---
    themeToggle.addEventListener("change", () => {
        document.body.classList.toggle("light-mode");
        if (navigator.vibrate) navigator.vibrate(20); // Feedback beim Switch
    });

    videoToggle.addEventListener("change", () => {
        if (videoToggle.checked) {
            bgVideo.style.display = "block";
            bgVideo.play();
        } else {
            bgVideo.pause();
            bgVideo.style.display = "none";
        }
        if (navigator.vibrate) navigator.vibrate(20);
    });
});