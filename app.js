// --- DEĞİŞKENLER ---
var x = 0;
var y = 0;
var z = "Baker Apprentice";
let playerName = localStorage.getItem("playerName");

// Sayfa yüklenir yüklenmez verileri çek ve ekrana bas
x = Number(localStorage.getItem("cookieScore")) || 0;
document.getElementById("demo").innerHTML = x;

// RÜTBE KONTROLÜ (Açılışta çalışması için)
function rutbeKontrol() {
    if (x >= 0 && x < 700) {
        z = "Baker Apprentice";
    } else if (x >= 700 && x < 1500) {
        z = "Baker";
    } else if (x >= 1500 && x < 3000) {
        z = "Cookie Fabricator";
    } else if (x >= 3000 && x < 5000) {
        z = "Master Chef";
    } else if (x >= 5000 && x < 10000) {
        z = "Cookie Rich";
    } else if (x >= 10000 && x < 20000) {
        z = "Cookie Emperor";
    } else if (x >= 20000) {
        z = "Cookie God";
    }
    document.getElementById("degree").innerHTML = z;
}
rutbeKontrol(); // İlk açılışta rütbeyi göster

// --- KULLANICI ADI SORGUSU ---
if (!playerName) {
    playerName = prompt("Welcome! What is your name for the leaderboard?");
    if (playerName) {
        localStorage.setItem("playerName", playerName);
    } else {
        playerName = "Anonymous Baker";
        localStorage.setItem("playerName", playerName);
    }
}

// --- PYTHON LEADERBOARD GÖNDERİMİ ---
async function sendScoreToLeaderboard() {
    const name = localStorage.getItem("playerName");
    const currentScore = x;

    try {
        await fetch('/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, score: currentScore })
        });
        console.log("Sunucuya gönderildi!");
    } catch (err) {
        console.error("Liderlik tablosu hatası:", err);
    }
}

// --- ANA KOMUTLAR (TIKLAMA) ---

// Normal Kurabiye (d fonksiyonu)
function d() {
    x += 1;
    document.getElementById("demo").innerHTML = x;
    localStorage.setItem("cookieScore", x);
    rutbeKontrol();

    // Her 10 tıkta bir sessizce gönder
    if (x % 10 === 0) {
        sendScoreToLeaderboard();
    }
}

// Şans Kurabiyesi (Random)
document.getElementById("randBtn").onclick = function () {
    var randomIncrease = Math.floor(Math.random() * 50) + 1;
    x += randomIncrease;
    document.getElementById("demo").innerHTML = x;
    document.getElementById("randplus").innerHTML = randomIncrease;
    localStorage.setItem("cookieScore", x);
    rutbeKontrol();
    sendScoreToLeaderboard(); // Hemen gönder
};

// Resetleme
function p() {
    if(confirm("Do you want to reset everything?")) {
        x = 0;
        document.getElementById("demo").innerHTML = x;
        localStorage.setItem("cookieScore", x);
        rutbeKontrol();
        sendScoreToLeaderboard();
    }
}

// Manual
function u() {
    alert("The chocolate cookie gives you 1. The fortune cookie gives you 1-50 random. Good luck!");
}

// Karanlık Mod
function temayiDegistir() {
    const body = document.body;
    const buton = document.getElementById("temaButon");
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
        buton.innerHTML = "☀️ Light Mode";
    } else {
        buton.innerHTML = "🌙 Dark Mode";
    }
}

// Upstash bilgilerini buraya doğrudan yazıyoruz
const REDIS_URL = "https://pleased-stinkbug-52622.upstash.io";
const REDIS_TOKEN = "Afa2AAIncDJhZmRhZGVkYzcyOTU0NmVjOThjZTc5OTlhNzFjZTYwZThhNTI2MjI";

// Skor Kaydetme (Global)
async function saveScoreGlobal(name, score) {
    // Önce mevcut listeyi çek
    const response = await fetch(`${REDIS_URL}/get/leaderboard`, {
        headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
    });
    const result = await response.json();
    let data = result.result ? JSON.parse(result.result) : [];

    // Yeni skoru ekle/güncelle
    data = data.filter(item => item.name !== name);
    data.push({ name: name, score: parseInt(score) });
    data.sort((a, b) => b.score - a.score);
    data = data.slice(0, 10);

    // Veritabanına geri gönder
    await fetch(`${REDIS_URL}/set/leaderboard`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
        body: JSON.stringify(data)
    });
    
    console.log("Skor başarıyla dünyaya yayıldı!");
}

// Skorları Getirme
async function getLeaderboardGlobal() {
    const response = await fetch(`${REDIS_URL}/get/leaderboard`, {
        headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
    });
    const result = await response.json();
    return result.result ? JSON.parse(result.result) : [];
}
