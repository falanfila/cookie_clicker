var x = 0
var y = 0
var z = "Baker Apprentice"

x = Number(localStorage.getItem("cookieScore")) || 0;
document.getElementById("demo").innerHTML = x;
document.getElementById("degree").innerHTML = z;
rutbeKontrol();

const alan = document.getElementById("mesajAlani");

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
        z = "Cookie Riche";
    } else if (x >= 10000 && x < 20000) {
        z = "Cookie Emperor";
    } else if (x >= 20000) {
        z = "Cookie God";
    }
    document.getElementById("degree").innerHTML = z;
}

function p() {
    x = 0;
    y = 0;
    document.getElementById("demo").innerHTML = x;
    localStorage.setItem("cookieScore", x);
    rutbeKontrol();
}

function d() {
    x+= 1;
    document.getElementById("demo").innerHTML = x;
    localStorage.setItem("cookieScore", x);
    rutbeKontrol();
}

function u() {
    alert("This is the user manual. The chocolate cookie gives you 1 cookie. The fortune cookie gives you random amount of cookies between 1 and 50. You have ranks depending on your cookie amount. Good luck!")
}

document.getElementById("randBtn").onclick = function () {
    var randomIncrease = Math.floor(Math.random() * 50) + 1;
    x += randomIncrease;
    let y = randomIncrease
    document.getElementById("demo").innerHTML = x;
    document.getElementById("randplus").innerHTML = y;
    localStorage.setItem("cookieScore", x);
    rutbeKontrol();
};

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

