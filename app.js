var x = 0;
var z = "Baker Apprentice";
var y = localStorage.getItem('oldY')
let cost1 = 100
let playerName = localStorage.getItem("playerName");
let sound = document.getElementById("clickSound");

y = y ? Number(y) : 0;

const REDIS_URL = "https://pleased-stinkbug-52622.upstash.io";
const REDIS_TOKEN = "Ac2OAAIncDI0ZGVkODYxN2RkOGI0NmUyYTY0MGJlNGZlNjc0ZGUwN3AyNTI2MjI";

const intervalId = setInterval(() => {
  x += y
  document.getElementById("demo").innerHTML = x
  rutbeKontrol();
  localStorage.setItem("cookieScore", x);
}, 1000)

uploadcps()
x = Number(localStorage.getItem("cookieScore")) || 0;
document.getElementById("demo").innerHTML = x;

function buy1() {
  if (x >= cost1){
    x -= cost1
    uploadY(1)
    uploadcps()
    document.getElementById("demo").innerHTML = x;
  } else {
        alert("Not enough cookies!");
    }
}

function buy100() {
  if (x >= 1000){
    x -= 1000
    uploadY(100)
    uploadcps()
    document.getElementById("demo").innerHTML = x;
  } else {
        alert("Not enough cookies!");
    }
}

function buy400() {
  if (x >= 10000){
    x -= 10000
    uploadY(400)
    uploadcps()
    document.getElementById("demo").innerHTML = x;
  } else {
        alert("Not enough cookies!");
    }
}

function buy800() {
  if (x >= 100000){
    x -= 100000
    uploadY(800)
    uploadcps()
    document.getElementById("demo").innerHTML = x;
  } else {
        alert("Not enough cookies!");
    }
}

function buy16000() {
  if (x >= 1000000){
    x -= 1000000
    uploadY(16000)
    uploadcps()
    document.getElementById("demo").innerHTML = x;
  } else {
        alert("Not enough cookies!");
    }
}

function buy32000() {
  if (x >= 10000000){
    x -= 10000000
    uploadY(32000)
    uploadcps()
    document.getElementById("demo").innerHTML = x;
  } else {
        alert("Not enough cookies!");
    }
}

function buy64000() {
  if (x >= 100000000){
    x -= 100000000
    uploadY(64000)
    uploadcps()
    document.getElementById("demo").innerHTML = x;
  } else {
        alert("Not enough cookies!");
    }
}

function buy128000() {
  if (x >= 1000000000){
    x -= 1000000000
    uploadY(128000)
    uploadcps()
    document.getElementById("demo").innerHTML = x;
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

if (!playerName) {
    playerName = prompt("Welcome! What is your name for the leaderboard?");
    if (!playerName) playerName = "Anonymous Baker";
    localStorage.setItem("playerName", playerName);
}

function cu() {
    let oldName = localStorage.getItem("playerName");
    
    let newName = prompt("Hello again! Let's change that username!");
    
    if (newName && newName !== oldName) {

        localStorage.setItem("playerName", newName);
        playerName = newName;
        
        saveScoreGlobal(oldName); 
        alert("Username changed to " + newName + "!");
    }
}

async function saveScoreGlobal(nameToRemove = null) {
    const currentName = localStorage.getItem("playerName") || "Anonymous Baker";
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

function d() { // Normal Cookie
    x += 1;
  sound.play()
    document.getElementById("demo").innerHTML = x;
    localStorage.setItem("cookieScore", x);
    rutbeKontrol();

    if (x % 10 === 0) {
        saveScoreGlobal();
    }
}

document.getElementById("randBtn").onclick = function () { // Fortune Cookie
    var randomIncrease = Math.floor(Math.random() * 101) + (-50);
    x += randomIncrease;
  sound.play()
    document.getElementById("demo").innerHTML = x;
    localStorage.setItem("cookieScore", x);
    rutbeKontrol();
    saveScoreGlobal();
};

function p() { // Reset
    if(confirm("Do you want to reset everything?")) {
        x = 0;
        document.getElementById("demo").innerHTML = x;
        localStorage.setItem("cookieScore", x);
        rutbeKontrol();
        saveScoreGlobal();
    }
}

function u() { // User Manual
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
