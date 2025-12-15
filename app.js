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
    alert("🎉 Easter Egg Found!");

    this.remove();     // buton yok olur
    x += 1000000;      // x artar (arka planda)
};

