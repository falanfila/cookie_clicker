// --- DEĞİŞKENLER ---
var x = 0;
var z = "Baker Apprentice";
let playerName = localStorage.getItem("playerName");

// Upstash Bilgileri
const REDIS_URL = "https://pleased-stinkbug-52622.upstash.io";
const REDIS_TOKEN = "Ac20AAIncDJhZmRhZGVkYzcyOTU0NmVjOThjZTc5OTlhNzFjZTYwZThhNTI2MjI=";

// Sayfa yüklenir yüklenmez verileri çek ve ekrana bas
x = Number(localStorage.getItem("cookieScore")) || 0;
document.getElementById("demo").innerHTML = x;

function rutbeKontrol() {
    if (x >= 0 && x < 700) z = "Baker Apprentice";
    else if (x >= 700 && x < 1500) z = "Baker";
    else if (x >= 1500 && x < 3000) z = "Cookie Fabricator";
    else if (x >= 3000 && x < 5000) z = "Master Chef";
    else if (x >= 5000 && x < 10000) z = "Cookie Rich";
    else if (x >= 10000 && x < 20000) z = "Cookie Emperor";
    else if (x >= 20000) z = "Cookie God";
    
    document.getElementById("degree").innerHTML = z;
}
rutbeKontrol();

// --- KULLANICI ADI SORGUSU ---
if (!playerName) {
    playerName = prompt("Welcome! What is your name for the leaderboard?");
    if (!playerName) playerName = "Anonymous Baker";
    localStorage.setItem("playerName", playerName);
}

// --- GLOBAL SKOR KAYDETME ---
async function saveScoreGlobal() {
    const name = localStorage.getItem("playerName");
    const score = x;

    try {
        const response = await fetch(`${REDIS_URL}/get/leaderboard`, {
            headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
        });
        const result = await response.json();
        let data = result.result ? JSON.parse(result.result) : [];

        data = data.filter(item => item.name !== name);
        data.push({ name: name, score: parseInt(score) });
        data.sort((a, b) => b.score - a.score);
        data = data.slice(0, 10);

        await fetch(`${REDIS_URL}/set/leaderboard`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
            body: JSON.stringify(data)
        });
        console.log("Global skor başarıyla kaydedildi!");
    } catch (err) {
        console.error("Bağlantı hatası:", err);
    }
}

// --- TIKLAMA KOMUTLARI ---

function d() { // Normal Kurabiye
    x += 1;
    document.getElementById("demo").innerHTML = x;
    localStorage.setItem("cookieScore", x);
    rutbeKontrol();

    if (x % 10 === 0) {
        saveScoreGlobal();
    }
}

document.getElementById("randBtn").onclick = function () { // Şans Kurabiyesi
    var randomIncrease = Math.floor(Math.random() * 50) + 1;
    x += randomIncrease;
    document.getElementById("demo").innerHTML = x;
    document.getElementById("randplus").innerHTML = randomIncrease;
    localStorage.setItem("cookieScore", x);
    rutbeKontrol();
    saveScoreGlobal();
};

function p() { // Resetleme
    if(confirm("Do you want to reset everything?")) {
        x = 0;
        document.getElementById("demo").innerHTML = x;
        localStorage.setItem("cookieScore", x);
        rutbeKontrol();
        saveScoreGlobal();
    }
}

// --- KURTARILAN FONKSİYONLAR ---

function u() { // Manual / Yardım
    alert("The chocolate cookie gives you 1. The fortune cookie gives you 1-50 random. Good luck!");
}

function temayiDegistir() { // Dark Mode
    const body = document.body;
    const buton = document.getElementById("temaButon");
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
        buton.innerHTML = "☀️ Light Mode";
    } else {
        buton.innerHTML = "🌙 Dark Mode";
    }
}

window.onbeforeunload = function() {
    saveScoreGlobal();
};
