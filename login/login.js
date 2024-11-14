const loginForm = document.getElementById("loginForm");
const loginApiUrl = "https://6734deec5995834c8a912dcd.mockapi.io/login-register";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch(`${loginApiUrl}?username=${username}&password=${password}`);
    const users = await response.json();
    if (users.length > 0) {
      const user = users[0];
      localStorage.setItem("userId", user.id);
      localStorage.setItem("username", user.username);
      window.location.href = "../movies/index.html";
    } else {
      document.getElementById("loginMessage").textContent = "Invalid credentials.";
    }
  } catch (error) {
    document.getElementById("loginMessage").textContent = "Login failed. Try again.";
  }
});
