document.addEventListener("DOMContentLoaded", () => {
    
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
        badge.addEventListener('click', function(e) {
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

    // --- 2. LOGIN LOGIK MIT ANIMATION ---
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const username = usernameInput.value;
        const password = passwordInput.value;
        
        // Button Loading State
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = "Prüfung...";
        submitBtn.style.opacity = "0.8";

        // Simulierter Delay für Realismus
        setTimeout(() => {
            if (username === "Louisa" && password === "07102005") {
                // Erfolg: Weiterleitung
                submitBtn.style.backgroundColor = "#4CAF50"; // Grün
                submitBtn.innerHTML = "Erfolg!";
                if (navigator.vibrate) navigator.vibrate([50, 50, 50]); // Erfolgsvibration
                
                setTimeout(() => {
                    window.location.href = "https://andrinlv.github.io/valentinesday/";
                }, 500);
            } else {
                // Fehler: Shake Animation & Reset
                triggerShake();
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.opacity = "1";
                
                // Fehler Vibration (Lang - Kurz - Lang)
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]); 
            }
        }, 600); // 600ms warten
    });

    function triggerShake() {
        // Entfernen und neu hinzufügen der Klasse, um Animation neu zu starten
        loginBox.classList.remove("shake-horizontal");
        // Force Reflow (Hack damit der Browser merkt dass die Klasse weg war)
        void loginBox.offsetWidth; 
        loginBox.classList.add("shake-horizontal");
        
        // Input rot markieren
        usernameInput.style.borderColor = "#ff5252";
        passwordInput.style.borderColor = "#ff5252";

        // Nach 2 sekunden Rot entfernen
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