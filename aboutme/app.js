const form = document.getElementById("contact-form");
  form.onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("submit-btn");
    const status = document.getElementById("status");
    btn.disabled = true;
    status.innerText = "Sending...";

    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      status.innerText = "Message sent successfully!";
      form.reset();
    } else {
      status.innerText = "Error! Please try again.";
    }
    btn.disabled = false;
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
