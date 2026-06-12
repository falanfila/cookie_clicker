// ------- VARIABLES -------
var x = 0; // Kurabiye sayısı
var y = 0; // CPS (Saniyede gelen kurabiye)
var z = "Baker Apprentice";
let formatX = x.toLocaleString('en-US');
let cost1 = 100;
let playerName = localStorage.getItem("playerName");
let sound = document.getElementById("clickSound");

// ----- UPSTASH TOKEN AND URL -------
const REDIS_URL = "https://pleased-stinkbug-52622.upstash.io";
const REDIS_TOKEN = "Ac2OAAIncDI0ZGVkODYxN2RkOGI0NmUyYTY0MGJlNGZlNjc0ZGUwN3AyNTI2MjI";

// ---- SUPABASE CONFIG ----
const SUPABASE_URL = "https://zceiodqcfxfnxjsldbep.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_3Ki5-y5uL8pY0s--_FE43A_ifD5J8Pl";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Oyunun başında ismi kontrol et ve Supabase'den verileri yükle
async function initGame() {
    if (!playerName) {
        playerName = prompt("Welcome! What is your name for the leaderboard?");
        if (!playerName) playerName = "Anonymous Baker";
        localStorage.setItem("playerName", playerName);
    }

    // Supabase'den bu oyuncunun daha önceki kaydını çekiyoruz
    await loadGameFromSupabase();

    // Veriler yüklendikten sonra UI güncelle ve döngüyü başlat
    updateUI();
    
    // Her saniye kurabiye ekleyen döngü
    setInterval(() => {
        x += y;
        updateUI();
        rutbeKontrol();
        // Her saniye hem ilerlemeyi hem de liderlik tablosunu kaydet
        saveGameToSupabase();
        saveScoreGlobal();
    }, 1000);
}

// UI Güncelleme Fonksiyonu (Tekrar eden kodları engellemek için)
function updateUI() {
    formatX = x.toLocaleString('en-US');
    document.getElementById("demo").innerHTML = formatX;
    document.getElementById("cps").innerHTML = y;
}

// ---- SUPABASE VERİ KAYDETME VE YÜKLEME ----

async function saveGameToSupabase() {
    if (!playerName) return;

    // upsert komutu: Eğer bu isimde kayıt varsa günceller, yoksa yeni satır açar
    const { error } = await supabaseClient
        .from('cookie_saves')
        .upsert({ 
            player_name: playerName, 
            cookies: parseInt(x), 
            cps: y 
        });

    if (error) console.error("Supabase kaydetme hatası:", error);
}

async function loadGameFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('cookie_saves')
            .select('*')
            .eq('player_name', playerName)
            .single();

        if (data) {
            x = data.cookies || 0;
            y = data.cps || 0;
            console.log("Veriler Supabase'den başarıyla yüklendi!");
        } else {
            console.log("Yeni oyuncu, Supabase'de kayıt bulunamadı.");
        }
    } catch (err) {
        console.error("Supabase yükleme hatası:", err);
    }
}

// ---- SATIN ALMA FONKSİYONLARI ----

function buyItem(cost, cpsIncrease) {
    if (x >= cost) {
        x -= cost;
        y += cpsIncrease;
        updateUI();
        saveGameToSupabase();
        saveScoreGlobal();
    } else {
        alert("Not enough cookies!");
    }
}

// Eski uzun fonksiyonlar yerine yukarıdaki tek bir fonksiyonu çağırıyoruz:
function buy1()      { buyItem(cost1, 1); }
function buy100()    { buyItem(1000, 100); }
function buy400()    { buyItem(10000, 400); }
function buy800()    { buyItem(100000, 800); }
function buy16000()  { buyItem(600000, 16000); }
function buy32000()  { buyItem(10000000, 32000); }
function buy64000()  { buyItem(100000000, 64000); }
function buy128000() { buyItem(1000000000, 128000); }


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

function cu() {
    let oldName = localStorage.getItem("playerName");
    let newName = prompt("Hello again! Let's change that username!");
    
    if (newName && newName !== oldName) {
        localStorage.setItem("playerName", newName);
        playerName = newName;
        saveScoreGlobal(oldName); 
        saveGameToSupabase(); // Yeni isimle Supabase'e de kaydet
        alert("Username changed to " + newName + "!");
    }
}

// ---- REDIS UPSTASH LEADERBOARD ----
async function saveScoreGlobal(nameToRemove = null) {
    const currentName = playerName || "Anonymous Baker";
    const score = parseInt(x);
    const url = REDIS_URL;
    const token = REDIS_TOKEN;

    try {
        const getRes = await fetch(`${url}/get/leaderboard`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const getResult = await getRes.json();
        let data = getResult.result ? JSON.parse(getResult.result) : [];

        if (nameToRemove) {
            data = data.filter(item => item.name !== nameToRemove);
        }
        
        data = data.filter(item => item.name !== currentName);
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

function d() { // Normal Tıklama
    x += 1;
    if (sound) sound.play();
    updateUI();
    rutbeKontrol();

    if (x % 10 === 0) {
        saveGameToSupabase();
        saveScoreGlobal();
    }
}

document.getElementById("randBtn").onclick = function () { // Fortune Cookie
    var randomIncrease = Math.floor(Math.random() * 101) + (-50);
    x += randomIncrease;
    if (sound) sound.play();
    updateUI();
    rutbeKontrol();
    saveGameToSupabase();
    saveScoreGlobal();
};

function p() { // Reset
    if(confirm("Do you want to reset everything?")) {
        x = 0;
        y = 0;
        updateUI();
        rutbeKontrol();
        saveGameToSupabase();
        saveScoreGlobal();
    }
}

function u() { // Kullanım Kılavuzu
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
    saveGameToSupabase();
    saveScoreGlobal();
};

// HER ŞEYİ BAŞLATAN TETİKLEYİCİ
initGame();
