// --- DEĞİŞKENLER ---
var x = 0;
var y = 0;
var z = "Baker Apprentice";
let playerName = localStorage.getItem("playerName");

// Sayfa yüklendiğinde skoru ve rütbeyi getir
x = Number(localStorage.getItem("cookieScore")) || 0;
document.getElementById("demo").innerHTML = x;
rutbeKontrol();

// --- KULLANICI ADI KONTROLÜ ---
// Eğer isim yoksa sor, varsa hatırla
if (!playerName) {
    playerName = prompt("Welcome! What is your name for the leaderboard?");
    if (playerName) {
        localStorage.setItem("playerName", playerName);
    } else {
        playerName = "Anonymous Baker";
        localStorage.setItem("playerName", playerName);
    }
}

// --- PYTHON LEADERBOARD BAĞLANTISI ---
async function sendScoreToLeaderboard() {
    const name = localStorage.getItem("playerName");
    const currentScore = x;

    try {
        // Vercel üzerindeki Python API'sine veriyi gönderiyoruz
        await fetch('/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, score: currentScore })
        });
        console.log("Score updated on server!");
    } catch (err) {
        console.error("Leaderboard connection error:", err);
    }
}

// --- RÜTBE SİSTEMİ ---
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

// --- BUTON FONKSİYONLARI ---

// Normal Kurabiye Tıklama
function d() {
    x += 1;
    document.getElementById("demo").innerHTML = x;
    localStorage.setItem("cookieScore", x);
    rutbeKontrol();

    // Her 10 tıkta bir sunucuya gönder (Sistemi yormamak için)
    if (x % 10 === 0) {
        sendScoreToLeaderboard();
    }
}

// Random Kurabiye Tıklama
document.getElementById("randBtn").onclick = function () {
    var randomIncrease = Math.floor(Math.random() * 50) + 1;
    x += randomIncrease;
    document
