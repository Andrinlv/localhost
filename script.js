document.addEventListener("DOMContentLoaded", () => {
    
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    loginForm.addEventListener("submit", (e) => {
        // Verhindert das Neuladen der Seite
        e.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

        // Login Logik
        if (username === "test" && password === "1234") {
            // Weiterleitung
            window.location.href = "https://andrinlv.github.io/valentinesday/";
        } else {
            // Fehlermeldung
            alert("Benutzername oder Passwort ist falsch.");
        }
    });
});