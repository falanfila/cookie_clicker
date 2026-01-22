onst form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.onsubmit = async (e) => {
    e.preventDefault(); // Sayfanın 404'e gitmesini engeller
    status.innerText = "Sending...";

    const formData = new FormData(form);
    
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        status.style.color = "green";
        status.innerText = "Thanks! Your message has been sent.";
        form.reset(); // Formu temizler
      } else {
        status.style.color = "red";
        status.innerText = "Oops! There was a problem.";
      }
    } catch (error) {
      status.style.color = "red";
      status.innerText = "Oops! Connection error.";
    }
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
