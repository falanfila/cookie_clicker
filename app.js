// ------- VARIABLES -------
var x = 0; 
var y = 0; 
var z = "Baker Apprentice";
let formatX = x.toLocaleString('en-US');
let cost1 = 100;
let sound = document.getElementById("clickSound");

// Giriş yapan kullanıcının ID'si, adı ve misafir durumu
let userId = null;
let playerName = "Anonymous Baker";
let isGuest = false;

// ----- UPSTASH TOKEN AND URL -------
const REDIS_URL = "https://pleased-stinkbug-52622.upstash.io";
const REDIS_TOKEN = "Ac2OAAIncDI0ZGVkODYxN2RkOGI0NmUyYTY0MGJlNGZlNjc0ZGUwN3AyNTI2MjI";

// ---- SUPABASE CONFIG ----
const SUPABASE_URL = "https://zceiodqcfxfnxjsldbep.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_3Ki5-y5uL8pY0s--_FE43A_ifD5J8Pl";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---- AUTH BUTONLARI (REGISTER, LOGIN, GUEST, LOGOUT) ----

// REGISTER (YENİ HESAP)
document.getElementById("btnRegister").onclick = async () => {
    const username = document.getElementById("authUsername").value.trim();
    const errorEl = document.getElementById("authError");

    if(!username) return errorEl.innerText = "Please enter a username!";
    errorEl.innerText = "Checking username...";

    try {
        let { data } = await supabaseClient
            .from('cookie_saves')
            .select('*')
            .eq('player_name', username)
            .maybeSingle();

        if (data) return errorEl.innerText = "Username already taken! Try Login.";

        const { data: newPlayer, error: insertError } = await supabaseClient
            .from('cookie_saves')
            .insert([{ player_name: username, cookies: 0, cps: 0 }])
            .select()
            .single();

        if (insertError) throw insertError;

        isGuest = false;
        userId = newPlayer.id;
        playerName = newPlayer.player_name;
        x = 0;
        y = 0;

        localStorage.setItem("cookie_username", playerName);
        localStorage.removeItem("is_guest"); // Misafir modunu temizle
        document.getElementById("authContainer").style.display = "none";
        initGame();

    } catch (err) {
        console.error("Register error:", err);
        errorEl.innerText = "Could not create account!";
    }
};

// LOGIN (MEVCUT HESAP)
document.getElementById("btnLogin").onclick = async () => {
    const username = document.getElementById("authUsername").value.trim();
    const errorEl = document.getElementById("authError");

    if(!username) return errorEl.innerText = "Please enter a username!";
    errorEl.innerText = "Loading...";

    try {
        let { data, error } = await supabaseClient
            .from('cookie_saves')
            .select('*')
            .eq('player_name', username)
            .maybeSingle();

        if (error) throw error;
        if (!data) return errorEl.innerText = "User not found! Please Register first.";

        isGuest = false;
        userId = data.id;
        playerName = data.player_name;
        x = data.cookies || 0;
        y = data.cps || 0;

        localStorage.setItem("cookie_username", playerName);
        localStorage.removeItem("is_guest"); // Misafir modunu temizle
        document.getElementById("authContainer").style.display = "none";
        initGame();

    } catch (err) {
        console.error("Login error:", err);
        errorEl.innerText = "Could not connect to database!";
    }
};

// GUEST (MİSAFİR GİRİŞİ - localStorage İLE KAYIT)
document.getElementById("btnGuest").onclick = () => {
    isGuest = true;
    userId = null;

    // Daha önceden tanımlanmış misafir adı varsa onu kullan, yoksa yenisini oluştur
    let savedGuestName = localStorage.getItem("guest_player_name");
    if (!savedGuestName) {
        savedGuestName = "Anonymous Baker";
        localStorage.setItem("guest_player_name", savedGuestName);
    }
    playerName = savedGuestName;

    // LocalStorage üzerindeki misafir kurabiyelerini yükle
    x = parseInt(localStorage.getItem("guest_cookies")) || 0;
    y = parseInt(localStorage.getItem("guest_cps")) || 0;

    localStorage.setItem("is_guest", "true");
    localStorage.removeItem("cookie_username"); // Kayıtlı kullanıcı oturumunu temizle

    document.getElementById("authContainer").style.display = "none";
    initGame();
};

// LOGOUT (ÇIKIŞ YAPMA)
document.getElementById("btnLogout").onclick = async () => {
    if(confirm("Are you sure you want to logout?")) {
        if(gameInterval) clearInterval(gameInterval);
        
        // Giriş durumlarını temizle
        localStorage.removeItem("cookie_username");
        localStorage.removeItem("is_guest");
        
        isGuest = false;
        userId = null;
        playerName = "Anonymous Baker";
        
        const authContainer = document.getElementById("authContainer");
        if (authContainer) {
            authContainer.style.display = "flex";
        }
    }
};

// ---- OYUN BAŞLANGIÇ VE UI FONKSİYONLARI ----

let gameInterval = null; 

async function initGame() {
    if(gameInterval) clearInterval(gameInterval);

    if (!isGuest) {
        await loadGameFromSupabase();
    }
    
    updateUI();
    
    // Her saniye çalışan ana döngü
    gameInterval = setInterval(() => {
        x += y;
        updateUI();
        rutbeKontrol();
        saveGame();
    }, 1000);
}

function updateUI() {
    formatX = x.toLocaleString('en-US');
    document.getElementById("demo").innerHTML = formatX;
    document.getElementById("cps").innerHTML = y;
    if(document.getElementById("degree")) document.getElementById("degree").innerHTML = z;
}

// ---- VERİ KAYDETME (SUPABASE VEYA LOCALSTORAGE) ----

function saveGame() {
    if (isGuest) {
        // Misafir verilerini localStorage'a kaydet
        localStorage.setItem("guest_cookies", parseInt(x));
        localStorage.setItem("guest_cps", parseInt(y));
    } else {
        // Kayıtlı kullanıcı verilerini Supabase ve Redis'e kaydet
        saveGameToSupabase();
        saveScoreGlobal();
    }
}

async function saveGameToSupabase() {
    if (isGuest || !userId || userId.length !== 36) return; 

    const { error } = await supabaseClient
        .from('cookie_saves')
        .upsert({ 
            id: userId, 
            player_name: playerName,
            cookies: parseInt(x), 
            cps: y 
        });

    if (error) console.error("Save error:", error);
}

async function loadGameFromSupabase() {
    if (isGuest || !userId || userId.length !== 36) return; 
    try {
        const { data } = await supabaseClient
            .from('cookie_saves')
            .select('*')
            .eq('id', userId)
            .single();

        if (data) {
            x = data.cookies || 0;
            y = data.cps || 0;
            console.log("Data loaded from cloud!");
        }
    } catch (err) {
        console.error("Load error:", err);
    }
}

// ---- MAĞAZA (SHOP) FONKSİYONLARI ----

function buyItem(cost, cpsIncrease) {
    if (x >= cost) {
        x -= cost;
        y += cpsIncrease;
        updateUI();
        saveGame();
    } else {
        alert("Not enough cookies!");
    }
}

function buy1()      { buyItem(cost1, 10); }
function buy100()    { buyItem(1000, 200); }
function buy400()    { buyItem(10000, 600); }
function buy800()    { buyItem(100000, 1000); }
function buy16000()  { buyItem(600000, 20000); }
function buy32000()  { buyItem(1000000, 45000); }
function buy64000()  { buyItem(10000000, 75000); }
function buy128000() { buyItem(100000000, 150000); }

function rutbeKontrol() {
    if (x >= 0 && x < 150000) z = "Baker Apprentice";
    else if (x >= 150000 && x < 800000) z = "Baker";
    else if (x >= 800000 && x < 2000000) z = "Cookie Fabricator";
    else if (x >= 2000000 && x < 5000000) z = "Master Chef";
    else if (x >= 5000000 && x < 10000000) z = "Cookie Rich";
    else if (x >= 10000000 && x < 25000000) z = "Cookie Emperor";
    else if (x >= 25000000 && x < 100000000) z = "Cookieworld Ruler";
    else if (x >= 100000000) z = "Cookie God";
}

// ---- REDIS UPSTASH SKOR TABLOSU (MİSAFİR ENGELİ EKLENDİ) ----

async function saveScoreGlobal(nameToRemove = null) {
    // Misafir hesabıysa liderlik tablosuna kesinlikle erişim sağlama
    if (isGuest) {
        alert("Guests cannot participate in the global leaderboard! Please create an account.");
        return;
    }

    if (!playerName || !userId || userId.length !== 36) return;
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
        
        data = data.filter(item => item.name !== playerName);
        data.push({ name: playerName, score: score });
        data.sort((a, b) => b.score - a.score);
        data = data.slice(0, 10);

        await fetch(`${url}/set/leaderboard`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(data)
        });
    } catch (err) {
        console.error("Leaderboard error:", err);
    }
}

// ---- OYUN İÇİ AKSİYONLAR VE BUTONLAR ----

function d() { 
    x += 1;
    if (sound) sound.play();
    updateUI();
    rutbeKontrol();
    if (x % 10 === 0) {
        saveGame();
    }
}

document.getElementById("randBtn").onclick = function () { 
    var randomIncrease = Math.floor(Math.random() * 101) + (-50);
    x += randomIncrease;
    if (sound) sound.play();
    updateUI();
    rutbeKontrol();
    saveGame();
};

function p() { 
    if(confirm("Do you want to reset everything?")) {
        x = 0;
        y = 0;
        updateUI();
        rutbeKontrol();
        saveGame();
    }
}

function u() { 
    alert("The chocolate cookie gives you 1. The fortune cookie gives you between -50 and 50 random. Good luck!");
}

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

window.onbeforeunload = function() {
    saveGame();
};

// ---- OTOMATİK OTURUM KONTROLÜ (SAYFA YENİLENİNCE ÇIKIŞ YAPMAZ) ----

async function checkActiveSession() {
    const savedUsername = localStorage.getItem("cookie_username");
    const savedGuest = localStorage.getItem("is_guest");

    // 1. Kayıtlı kullanıcı oturumu varsa
    if (savedUsername) {
        let { data } = await supabaseClient
            .from('cookie_saves')
            .select('*')
            .eq('player_name', savedUsername)
            .maybeSingle();

        if (data) {
            isGuest = false;
            userId = data.id;
            playerName = data.player_name;
            
            document.getElementById("authContainer").style.display = "none";
            initGame();
            return;
        }
    } 
    // 2. Misafir oturumu varsa (Sayfa yenilense bile misafir kalır)
    else if (savedGuest === "true") {
        isGuest = true;
        userId = null;
        playerName = localStorage.getItem("guest_player_name") || "Guest_Player";
        x = parseInt(localStorage.getItem("guest_cookies")) || 0;
        y = parseInt(localStorage.getItem("guest_cps")) || 0;

        document.getElementById("authContainer").style.display = "none";
        initGame();
        return;
    }
    
    // Aktif oturum yoksa paneli aç
    document.getElementById("authContainer").style.display = "flex";
}

checkActiveSession();
