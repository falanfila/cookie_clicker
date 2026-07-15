const coin = document.getElementById('coin');
const flipBtn = document.getElementById('flip-btn');
const result = document.getElementById('result');
let heads = 0
let tails = 0

flipBtn.addEventListener('click', () => {
    // Animasyon sırasında butona tekrar basılmasını engelliyoruz
    flipBtn.disabled = true;
    result.textContent = "Coin's flipping...";

    // 0 veya 1 üreterek Yazı mı Tura mı olacağını belirliyoruz
    const isHeads = Math.random() < 0.5;

    // Rastgele dönüş tur sayısı (5 ile 9 tur arası)
    const randomSpins = Math.floor(Math.random() * 5) + 5;

    // Yazı için tam tur (360'ın katı), Tura için ekstra 180 derece dönüş ekliyoruz
    const extraRotation = isHeads ? 0 : 180;
    const finalDegree = (randomSpins * 360) + extraRotation;

    // CSS transition yardımıyla dönme animasyonunu başlatıyoruz
    coin.style.transform = `rotateY(${finalDegree}deg)`;

    // CSS'teki transition süresi (3 saniye) bittiğinde sonucu göster
    setTimeout(() => {
        if (isHeads) {
            result.textContent = "Tails!";
            tails += 1
            document.getElementById("tails").innerHTML = tails;
        } else {
            result.textContent = "Heads!";
            heads += 1
            document.getElementById("heads").innerHTML = heads;
        }
        // Butonu tekrar aktif hale getiriyoruz
        flipBtn.disabled = false;
    }, 3000);
});
