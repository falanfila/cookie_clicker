var x = 0
var y = 0

const alan = document.getElementById("mesajAlani");

function p() {
    x = 0;
    document.getElementById("demo").innerHTML = x;
}

function d() {
    x+= 1;
    document.getElementById("demo").innerHTML = x;
}

document.getElementById("eggButton").onclick = function () {
    alert("🎉 Easter Egg Found! Here's your reward!");
    this.remove();     // buton yok olur
    x += 1000000;// x artar (arka planda)
    document.getElementById("demo").innerHTML = x;
};

document.getElementById("randBtn").onclick = function () {
    var randomIncrease = Math.floor(Math.random() * 50) + 1;
    x += randomIncrease;
    let y = randomIncrease
    document.getElementById("demo").innerHTML = x;
    document.getElementById("randplus").innerHTML = y;
};
