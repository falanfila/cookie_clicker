var x = 0
var easterEggActive = false;

console.log("Congratulations! You've found the easter egg!")
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

function l() {
    if (easterEggActive) return; // Bir kez çalışsın
    easterEggActive = true;

    alert("Psst! There is an easter egg which can only be opened in a computer! A clue: try to open something from settings part. If you've found it, open the console!");

    // DevTools açıldığında tetikleme
    let devtoolsOpened = false;
    const threshold = 160; // Tarayıcı boyutu farkı eşiği

    const checkDevTools = function() {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if ((widthThreshold || heightThreshold) && !devtoolsOpened) {
            devtoolsOpened = true;
            x += 1000000;
            document.getElementById("score").textContent = x;
            alert("Your total cookie has expanded by 1.000.000!" + x);
        }
    };

    // Yarım saniyede bir kontrol
    setInterval(checkDevTools, 500);
}

// Butona bağla
document.getElementById("eggButton").onclick = l;
