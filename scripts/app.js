// Register service worker and handle registration form
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch((err) => console.warn("SW register failed", err));
  });
}

// Theme handling (dark / light) using Tailwind's class strategy
const themeToggle = () => {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  const setIcon = () => {
    btn.textContent = document.documentElement.classList.contains("dark")
      ? "☀️"
      : "🌙";
  };
  btn.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", "" + (isDark ? "dark" : "light"));
    setIcon();
  });
  const saved = localStorage.getItem("theme");
  if (
    saved === "dark" ||
    (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
  )
    document.documentElement.classList.add("dark");
  setIcon();
};
themeToggle();

// PWA install prompt handling
let deferredPrompt = null;
const installBtn = document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) {
    installBtn.classList.remove("hidden");
    installBtn.addEventListener("click", async () => {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        showToast(
          choice.outcome === "accepted"
            ? "Install accepted"
            : "Install dismissed",
        );
      } catch (err) {
        console.warn("Install prompt error", err);
      }
      deferredPrompt = null;
      if (installBtn) installBtn.classList.add("hidden");
    });
  }
});

window.addEventListener("appinstalled", () => {
  showToast("HikooPay installed");
  deferredPrompt = null;
  if (installBtn) installBtn.classList.add("hidden");
});

const form = document.getElementById("registerForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    // Basic client-side validation
    if (!payload.fullname || !payload.email || !payload.phone)
      return showToast("Please fill required fields");
    // Save a minimal profile in localStorage (placeholder for real backend)
    const users = JSON.parse(localStorage.getItem("hikoo_users") || "[]");
    users.push({ id: Date.now(), ...payload });
    localStorage.setItem("hikoo_users", JSON.stringify(users));
    showToast(
      "Account created — welcome " + (payload.fullname.split(" ")[0] || ""),
    );
    form.reset();
  });
}

// Login form handling
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(loginForm);
    const { loginId, password } = Object.fromEntries(data.entries());
    const users = JSON.parse(localStorage.getItem("hikoo_users") || "[]");
    const user = users.find(
      (u) =>
        (u.email === loginId || u.phone === loginId) && u.password === password,
    );
    if (!user) return showToast("Invalid credentials");
    localStorage.setItem(
      "hikoo_current",
      JSON.stringify({ id: user.id, name: user.fullname }),
    );
    showToast("Welcome back, " + (user.fullname.split(" ")[0] || user.email));
    // Redirect placeholder (could go to dashboard)
    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  });
}

function showToast(text) {
  let t = document.createElement("div");
  t.className = "toast";
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(() => {
    t.remove();
  }, 3500);
}
