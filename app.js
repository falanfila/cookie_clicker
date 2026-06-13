// ------- VARIABLES -------
var x = 0; 
var y = 0; 
var z = "Baker Apprentice";
let formatX = x.toLocaleString('en-US');
let cost1 = 100;
let sound = document.getElementById("clickSound");

// Giriş yapan kullanıcının ID'si ve adı burada tutulacak
let userId = null;
let playerName = "Anonymous Baker";

// ----- UPSTASH TOKEN AND URL -------
const REDIS_URL = "https://pleased-stinkbug-52622.upstash.io";
const REDIS_TOKEN = "Ac2OAAIncDI0ZGVkODYxN2RkOGI0NmUyYTY0MGJlNGZlNjc0ZGUwN3AyNTI2MjI";

// ---- SUPABASE CONFIG ----
const SUPABASE_URL = "https://zceiodqcfxfnxjsldbep.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_3Ki5-y5uL8pY0s--_FE43A_ifD5J8Pl";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---- GİRİŞ, KAYIT VE ÇIKIŞ OLAYLARI (AUTH) ----

document.getElementById("btnRegister").onclick = async () => {
    const username = document.getElementById("authUsername").value.trim();
    const password = document.getElementById("authPassword").value;
    const errorEl = document.getElementById("authError");

    if(!username || !password) return errorEl.innerText = "Fill all fields!";

    const fakeEmail = `${username.toLowerCase()}@kurabiye.com`;

    const { data, error } = await supabaseClient.auth.signUp({
        email: fakeEmail,
        password: password,
        options: { data: { display_name: username } }
    });

    if (error) {
        errorEl.innerText = error.message;
    } else {
        alert("Account created! Now you can Login.");
    }
};

document.getElementById("btnLogin").onclick = async () => {
    const username = document.getElementById("authUsername").value.trim();
    const password = document.getElementById("authPassword").value;
    const errorEl = document.getElementById("authError");

    if(!username || !password) return errorEl.innerText = "Fill all fields!";

    const fakeEmail = `${username.toLowerCase()}@kurabiye.com`;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: fakeEmail,
        password: password
    });

    if (error) {
        errorEl.innerText = error.message;
    } else {
        document.getElementById("authContainer").style.display = "none";
        userId = data.user.id;
        playerName = data.user.user_metadata.display_name || username;
        
        if(document.getElementById("degree")) document.getElementById("degree").innerHTML = playerName;

        initGame();
    }
};

// YENİ DÜZENLENEN LOGOUT: ARTIK SKORLARI ASLA SIFIRLAMIYOR!
document.getElementById("btnLogout").onclick = async () => {
    if(confirm("Are you sure?")) {
        try {
            // 1. Önce arkadaki otomatik kaydetme döngüsünü durduruyoruz (Buluta 0 yazmasın diye)
            if(gameInterval) clearInterval(gameInterval);
            
            // 2. Supabase oturumunu kapatıyoruz
            await supabaseClient.auth.signOut(); 
            
            // 3. Kullanıcı kimlik bilgilerini temizliyoruz (Ama x ve y kurabiyelerine dokunmuyoruz!)
            userId = null;
            playerName = "Anonymous Baker";
            
            // 4. Giriş ekranını güvenli bir şekilde geri getiriyoruz
            const authContainer = document.getElementById("authContainer");
            if (authContainer) {
                authContainer.style.display = "flex";
            }
        } catch (err) {
            console.error("Çıkış yapılırken bir hata oluştu:", err);
        }
    }
};

// ---- OYUN BAŞLANGIÇ VE UI FONKSİYONLARI ----

let gameInterval = null; 

async function initGame() {
    // Üst üste binme olmasın diye eski döngü varsa temizle
    if(gameInterval) clearInterval(gameInterval);

    await loadGameFromSupabase();
    updateUI();
    
    // Her saniye çalışan ana döngü
    gameInterval = setInterval(() => {
        // Güvenlik Duvarı: Geçerli bir kullanıcı yoksa veya ID hatalıysa hiçbir şey yapma
        if (!userId || userId.length !== 36) return; 
        
        x += y;
        updateUI();
        rutbeKontrol();
        saveGameToSupabase();
        saveScoreGlobal();
    }, 1000);
}

function updateUI() {
    formatX = x.toLocaleString('en-US');
    document.getElementById("demo").innerHTML = formatX;
    document.getElementById("cps").innerHTML = y;
}

// ---- SUPABASE VERİ YÖNETİMİ ----

async function saveGameToSupabase() {
    // KESİN ÇÖZÜM: ID boşsa veya 36 karakterli standart UUID formatında değilse durdur!
    if (!userId || userId.length !== 36) return; 

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
    // KESİN ÇÖZÜM: ID boşsa veya 36 karakterli standart UUID formatında değilse durdur!
    if (!userId || userId.length !== 36) return; 
    try {
        const { data, error } = await supabaseClient
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
        saveGameToSupabase();
        saveScoreGlobal();
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
    if (x >= 0 && x < 700) z = "Baker Apprentice";
    else if (x >= 700 && x < 1500) z = "Baker";
    else if (x >= 1500 && x < 3000) z = "Cookie Fabricator";
    else if (x >= 3000 && x < 5000) z = "Master Chef";
    else if (x >= 5000 && x < 10000) z = "Cookie Rich";
    else if (x >= 10000 && x < 20000) z = "Cookie Emperor";
    else if (x >= 20000) z = "Cookie God";
    
    let degreeEl = document.getElementById("degree");
    if(degreeEl) degreeEl.innerHTML = z;
}

// ---- REDIS UPSTASH SKOR TABLOSU ----

async function saveScoreGlobal(nameToRemove = null) {
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
        saveGameToSupabase();
        saveScoreGlobal();
    }
}

document.getElementById("randBtn").onclick = function () { 
    var randomIncrease = Math.floor(Math.random() * 101) + (-50);
    x += randomIncrease;
    if (sound) sound.play();
    updateUI();
    rutbeKontrol();
    saveGameToSupabase();
    saveScoreGlobal();
};

function p() { 
    if(confirm("Do you want to reset everything?")) {
        x = 0;
        y = 0;
        updateUI();
        rutbeKontrol();
        saveGameToSupabase();
        saveScoreGlobal();
    }
}

function u() { 
    alert("The chocolate cookie gives you 1. The fortune cookie gives you 1-50 random. Good luck!");
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
    saveGameToSupabase();
    saveScoreGlobal();
};

// ---- OTOMATİK OTURUM KONTROLÜ VE BAŞLATICI ----

async function checkActiveSession() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();

    if (user && !error) {
        document.getElementById("authContainer").style.display = "none";
        userId = user.id;
        playerName = user.user_metadata.display_name || user.email.split('@')[0];
        
        if(document.getElementById("degree")) document.getElementById("degree").innerHTML = playerName;
        
        initGame();
    } else {
        document.getElementById("authContainer").style.display = "flex";
        console.log("Please sign in");
    }
}

// BÜTÜN SİSTEMİ ÇALIŞTIRAN ANA TETİKLEYİCİ
checkActiveSession();
