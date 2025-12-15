var x = 0

const alan = document.getElementById("mesajAlani");

function p() {
    document.getElementById("demo").innerHTML
    =
    x = 0;
}

function d() {
    document.getElementById("demo").innerHTML
    =
    x++;
}

document.getElementById("eggButton").onclick = function () {
    alert("🎉 Easter Egg Found! Try to click the cookie");

    this.remove();     // buton yok olur
    x += 1000000;      // x artar (arka planda)
};

document.getElementById("randBtn").onclick = function () {
    var randomIncrease = Math.floor(Math.random() * 50) + 1;
    x += randomIncrease;
};
