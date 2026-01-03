var x = 0
var y = 0

x = Number(localStorage.getItem("cookieScore")) || 0;
document.getElementById("demo").innerHTML = x;

const alan = document.getElementById("mesajAlani");

function p() {
    x = 0;
    y = 0;
    document.getElementById("demo").innerHTML = x;
}

function d() {
    x+= 1;
    document.getElementById("demo").innerHTML = x;
    localStorage.setItem("cookieScore", x);
}

function u() {
    alert("This is the user manual. The chocolate cookie gives you 1 cookie. The fortune cookie gives you random amount of cookies between 1 and 50. You have ranks depending on your cookie amount. Good luck!")
}
    
document.getElementById("eggButton").onclick = function () {
    alert("🎉 Easter Egg Found! Here's your reward!");
    this.remove();
    x += 1000000;
    document.getElementById("demo").innerHTML = x;
    localStorage.setItem("cookieScore", x);
};

document.getElementById("randBtn").onclick = function () {
    var randomIncrease = Math.floor(Math.random() * 50) + 1;
    x += randomIncrease;
    let y = randomIncrease
    document.getElementById("demo").innerHTML = x;
    document.getElementById("randplus").innerHTML = y;
    if (y === 1) {
    alert("How unlucky you are! Here's a reward for solace!");
    }
    localStorage.setItem("cookieScore", x);
};

function unvanKontrol() {
    let yeniUnvan = "";
    let yazielementi = document.getElementById("unvan-yazisi");

    // Random puan geldiği için aralıkları büyüttük
    if (x < 1000) {
        yeniUnvan = "Baker apprentice";
    } else if (x < 10000) {
        yeniUnvan = "Cookie master";
    } else if (x < 50000) {
        yeniUnvan = "Factory manager";
    } else if (x < 250000) {
        yeniUnvan = "Cookie billionaire";
    } else if (x < 1000000) {
        yeniUnvan = "Cookie emperor";
    } else {
        yeniUnvan = "Cookie God";
    }

    // Unvan değiştiğinde görsel bildirim ver
    if (yazielementi.innerText !== yeniUnvan) {
        yazielementi.innerText = yeniUnvan;
        unvanDegistiEfekti(); // Aşağıdaki görsel efekti çağırır
    }
}

function unvanDegistiEfekti() {
    // Tarayıcı başlığını güncelle (M4 Mac'teki sekmede görünür)
    document.title = "NEW RANK!";
    
    // 2 saniye sonra başlığı eski haline getir
    setTimeout(() => {
        document.title = "Cookie Clicker";
    }, 2000);

    // İstersen burada bir alert verebilirsin (ama oyun akışını böler)
    // Onun yerine ekranda bir konfeti patlatmak çok daha profesyonel olur!
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
