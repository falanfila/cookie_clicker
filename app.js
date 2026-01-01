var x = 0
var y = 0

x = Number(localStorage.getItem("cookieScore")) || 0;
document.getElementById("demo").innerHTML = x;

const alan = document.getElementById("mesajAlani");

function p() {
    x = 0;
    document.getElementById("demo").innerHTML = x;
}

function d() {
    x+= 1;
    document.getElementById("demo").innerHTML = x;
    localStorage.setItem("cookieScore", x);
}

function u() {
    alert("This is the user manual. The chocolate cookie gives you 1 cookie. The fortune cookie gives you random amount of cookies between 1 and 50. Also, there's an easter egg. You'll get your reward if you find it")
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
