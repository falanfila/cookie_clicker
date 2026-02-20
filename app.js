// --- DEĞİŞKENLER ---
var x = 0;
var z = "Baker Apprentice";
var y = localStorage.getItem('oldY')
let cost1 = 100
let playerName = localStorage.getItem("playerName");

y = y ? Number(y) : 0;

// Upstash Bilgileri (20:29'da sıfırladığın en yeni anahtar)
const REDIS_URL = "https://pleased-stinkbug-52622.upstash.io";
const REDIS_TOKEN = "Ac2OAAIncDI0ZGVkODYxN2RkOGI0NmUyYTY0MGJlNGZlNjc0ZGUwN3AyNTI2MjI";
const intervalId = setInterval(() => {
  x += y
  document.getElementById("demo").innerHTML = x
  rutbeKontrol();
  localStorage.setItem("cookieScore", x);
}, 1000)

// Sayfa yüklenir yüklenmez verileri çek ve ekrana bas
uploadcps()
x = Number(localStorage.getItem("cookieScore")) || 0;
document.getElementById("demo").innerHTML = x;

function buy1() {
  if (x >= cost1){
    x -= cost1
    uploadY(1)
    uploadcps()
  } else {
        alert("Not enough cookies!");
    }
}

function uploadY(newY) {
    y += newY;
    localStorage.setItem('oldY', y);
}

function uploadcps() {
  document.getElementById("cps").innerHTML = y
}

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

function cu() {
    // Önce eski ismi bir kenara not alalım
    let oldName = localStorage.getItem("playerName");
    
    let newName = prompt("Hello again! Let's change that username!");
    
    if (newName && newName !== oldName) {
        // Yeni ismi kaydet
        localStorage.setItem("playerName", newName);
        playerName = newName; // Global değişkeni de güncelle
        
        // Şimdi veritabanından eski ismi sildirmek için skor gönderelim
        // Fonksiyona eski ismi "temizle" diye gönderiyoruz
        saveScoreGlobal(oldName); 
        alert("Username changed to " + newName + "!");
    }
}

// --- GLOBAL SKOR KAYDETME ---
async function saveScoreGlobal(nameToRemove = null) {
    const currentName = localStorage.getItem("playerName") || "Anonymous Baker";
    const score = parseInt(x);

    // Üstteki global değişkenleri kullanıyoruz (Kodun daha temiz olur)
    const url = REDIS_URL;
    const token = REDIS_TOKEN;

    try {
        const getRes = await fetch(`${url}/get/leaderboard`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const getResult = await getRes.json();
        let data = getResult.result ? JSON.parse(getResult.result) : [];

        // --- DÜZELTME BURADA ---
        // 1. Eğer bir isim değiştirildiyse (nameToRemove varsa), onu listeden at
        if (nameToRemove) {
            data = data.filter(item => item.name !== nameToRemove);
        }
        
        // 2. Şu anki ismi zaten her zaman filtreliyoruz (puan güncellemesi için)
        data = data.filter(item => item.name !== currentName);
        
        // 3. Yeni ismi ve puanı ekle
        data.push({ name: currentName, score: score });
        
        data.sort((a, b) => b.score - a.score);
        data = data.slice(0, 10);

        await fetch(`${url}/set/leaderboard`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        console.log("Skor tablosu güncellendi!");
    } catch (err) {
        console.error("Hata:", err);
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
    var randomIncrease = Math.floor(Math.random() * 101) + (-50);
    x += randomIncrease;
    document.getElementById("demo").innerHTML = x;
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
