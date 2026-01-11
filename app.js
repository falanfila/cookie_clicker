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

if (x >= 0 && x < 170) {
    document.getElementById.innerHTML = 'Baker Apprentice'
}

if (x >= 170 && x < 350) {
    document.getElementById("degree").innerHTML = 'Baker'
}

if (x >= 350 && x < 600) {
    document.getElementById("degree").innerHTML = 'Cookie Fabricator'
}
