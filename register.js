const registerForm = document.getElementById("registerForm");
const registerApiUrl = "https://6734deec5995834c8a912dcd.mockapi.io/login-register";

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;

  try {
    const response = await fetch(registerApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    alert("Registration successful! You can now log in.");
    window.location.href = "./login/index.html";
  } catch (error) {
    document.getElementById("registerMessage").textContent = "Registration failed. Try again.";
  }
});
