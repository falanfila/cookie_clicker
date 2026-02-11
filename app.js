// --- DEĞİŞKENLER ---
var x = 0;
var z = "Baker Apprentice";
let playerName = localStorage.getItem("playerName");

// Upstash Bilgileri (Senin ekran görüntünden aldığım kesin anahtarlar)
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

// --- GLOBAL SKOR KAYDETME (ARADAKİ PYTHON'U SİLDİK) ---
async function saveScoreGlobal() {
    const name = localStorage.getItem("playerName");
    const score = x;

    try {
        // 1. Mevcut listeyi veritabanından çek
        const response = await fetch(`${REDIS_URL}/get/leaderboard`, {
            headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
        });
        const result = await response.json();
        let data = result.result ? JSON.parse(result.result) : [];

        // 2. Listeyi güncelle
        data = data.filter(item => item.name !== name);
        data.push({ name: name, score: parseInt(score) });
        data.sort((a, b) => b.score - a.score);
        data = data.slice(0, 10);

        // 3. Veritabanına geri gönder (Kalıcı kayıt)
        await fetch(`${REDIS_URL}/set/leaderboard`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
            body: JSON.stringify(data)
        });
        console.log("Global skor başarıyla kaydedildi! Arya artık görebilir.");
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

    // Her 10 tıkta bir buluta gönder
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
    saveScoreGlobal(); // Hemen buluta gönder
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

// ... Diğer fonksiyonların (tema değiştir vb.) aynı kalabilir ...
