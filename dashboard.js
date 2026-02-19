document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. ZUGANGSWÄCHTER ---
    if (!sessionStorage.getItem("admin_logged_in")) {
        window.location.href = "index.html";
        return; 
    }
    document.getElementById("admin-name").innerText = sessionStorage.getItem("current_user");

    // --- HILFSFUNKTION: LOG SCHREIBEN ---
    function writeAdminLog(actionMessage) {
        const logs = JSON.parse(localStorage.getItem("app_logs")) || [];
        logs.unshift({ message: actionMessage, timestamp: new Date().getTime() });
        localStorage.setItem("app_logs", JSON.stringify(logs.slice(0, 50)));
        renderLogs(); // Liste sofort aktualisieren
    }

    // --- 2. NAVIGATION (Sidebar klicks) ---
    const navLinks = document.querySelectorAll('.nav-links li a:not(.logout)');
    const sections = document.querySelectorAll('.view-section');

    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Aktiven Menüpunkt optisch hervorheben
            document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
            link.parentElement.classList.add('active');

            // Alle Sektionen verstecken und nur die gewählte anzeigen
            sections.forEach(sec => sec.classList.remove('active'));
            sections[index].classList.add('active');

            // Wenn auf "Logs" geklickt wird, Logs neu laden
            if (index === 2) renderLogs();
        });
    });

    // --- 3. DATEN ANZEIGEN & SORTIEREN ---
    let currentSort = 'az'; // Standard-Sortierung

    function renderUsers() {
        const users = JSON.parse(localStorage.getItem("app_users")) || {};
        const userNames = Object.keys(users);
        
        // Zähler für die Übersicht
        document.getElementById("user-count").innerText = userNames.length;
        
        // --- Sortier-Logik ---
        let sortedNames = [...userNames];
        if (currentSort === 'az') {
            // Alphabetisch sortieren
            sortedNames.sort((a, b) => a.localeCompare(b));
        } else if (currentSort === 'time') {
            // Nach Login sortieren (höchste Zahl = neuster Login zuerst)
            sortedNames.sort((a, b) => {
                const timeA = users[a].lastLogin || 0; // 0, falls noch nie eingeloggt
                const timeB = users[b].lastLogin || 0;
                return timeB - timeA;
            });
        }

        const fullList = document.getElementById("full-user-list");
        const overviewList = document.getElementById("user-list-container");
        fullList.innerHTML = "";
        overviewList.innerHTML = "";

        sortedNames.forEach(name => {
            // Zeit formatieren
            let lastOnlineText = "Noch nie eingeloggt";
            if (users[name].lastLogin) {
                const date = new Date(users[name].lastLogin);
                lastOnlineText = `Zuletzt: ${date.toLocaleDateString('de-DE')} - ${date.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})} Uhr`;
            }

            const htmlContent = `
                <div class="user-info">
                    <strong>${name}</strong> 
                    <span style="color: #aaa; font-size: 0.8rem;">${lastOnlineText}</span>
                </div>
            `;

            // Für die Übersicht (ohne Löschen Button)
            const liOverview = document.createElement("li");
            liOverview.innerHTML = htmlContent;
            overviewList.appendChild(liOverview);

            // Für die Detailansicht (mit Löschen Button)
            const liFull = document.createElement("li");
            const contentDiv = document.createElement("div");
            contentDiv.className = "user-item-content";
            contentDiv.innerHTML = htmlContent;

            if (name !== "Admin") {
                const deleteBtn = document.createElement("button");
                deleteBtn.innerText = "Löschen";
                deleteBtn.className = "delete-btn";
                deleteBtn.addEventListener("click", () => deleteUser(name));
                contentDiv.appendChild(deleteBtn);
            } else {
                contentDiv.innerHTML += `<span class="system-badge">System</span>`;
            }

            liFull.appendChild(contentDiv);
            fullList.appendChild(liFull);
        });
    }

    // Sortier-Buttons Event Listener
    document.getElementById("sort-az").addEventListener("click", (e) => {
        currentSort = 'az';
        e.target.classList.add('active');
        document.getElementById("sort-time").classList.remove('active');
        renderUsers();
    });

    document.getElementById("sort-time").addEventListener("click", (e) => {
        currentSort = 'time';
        e.target.classList.add('active');
        document.getElementById("sort-az").classList.remove('active');
        renderUsers();
    });

    // Löschen Funktion (mit Log!)
    function deleteUser(usernameToDelete) {
        if (confirm(`Zugang "${usernameToDelete}" dauerhaft löschen?`)) {
            const users = JSON.parse(localStorage.getItem("app_users")) || {};
            delete users[usernameToDelete];
            localStorage.setItem("app_users", JSON.stringify(users));
            
            writeAdminLog(`Gelöscht: Admin hat den Zugang für ${usernameToDelete} entfernt.`);
            renderUsers();
        }
    }

    // --- 4. LOGS ANZEIGEN ---
    function renderLogs() {
        const logs = JSON.parse(localStorage.getItem("app_logs")) || [];
        const logContainer = document.getElementById("log-list-container");
        logContainer.innerHTML = "";

        if (logs.length === 0) {
            logContainer.innerHTML = "<li>Keine System-Ereignisse gefunden.</li>";
            return;
        }

        logs.forEach(log => {
            const date = new Date(log.timestamp);
            const timeString = `${date.toLocaleDateString('de-DE')} ${date.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit', second:'2-digit'})}`;
            
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="log-time">[${timeString}]</span>
                <span class="log-message">${log.message}</span>
            `;
            logContainer.appendChild(li);
        });
    }

    // Beim Start alles zeichnen
    renderUsers();
    renderLogs();

    // --- LOGOUT ---
    document.getElementById("logout-btn").addEventListener("click", (e) => {
        e.preventDefault();
        writeAdminLog("Logout: Admin hat das Dashboard verlassen.");
        sessionStorage.removeItem("admin_logged_in");
        sessionStorage.removeItem("current_user");
        setTimeout(() => window.location.href = "index.html", 300); // Kurze Pause, damit der Log speichert
    });
});