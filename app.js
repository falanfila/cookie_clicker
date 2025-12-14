var x = 0
import Math

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
    alert("Psst! There is an easter egg which can only be opened in a computer! A clue: try to open something from settings part. If you've found it, click the console!")
    
    const eskiLog = console.log;

// console.log'u override et
console.log = function(...args) {
    eskiLog.apply(console, args); // önce normal log
    x += 1000000;                  // x'i 1.000.000 arttır
    alert("Your total cookie has expanded by 1.000.000!");
};

// Test
console.log("Congratulations! You've found the easter egg!"); 
}
