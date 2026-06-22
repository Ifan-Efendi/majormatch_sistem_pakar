import { activeRoute } from "../services/router.js";

const app = document.querySelector("#app");

const isActiveNav = (route) =>
  activeRoute() === route ||
  (route === "jurusan" && activeRoute().startsWith("jurusan-"));

const navLink = (route, label) =>
  `<a class="nav-link ${isActiveNav(route) ? "active" : ""}" href="#${route}">${label}</a>`;

export const renderLayout = (content) => {
  const hideChrome = activeRoute().startsWith("test");

  app.innerHTML = `
    ${
      hideChrome
        ? ""
        : `
      <header class="site-header">
        <div class="container nav-wrap">
          <a class="brand" href="#home">MajorMatch</a>
          <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav class="nav-menu" id="navMenu">
            ${navLink("home", "Beranda")}
            ${navLink("jurusan", "Daftar Jurusan")}
            ${navLink("kampus", "Daftar Kampus")}
            ${navLink("riwayat", "Riwayat")}
            ${navLink("tentang", "Tentang")}
          </nav>
          <a class="btn btn-dark" href="#test">Mulai Test</a>
        </div>
      </header>
    `
    }
    <main class="page-shell ${hideChrome ? "focus-shell" : ""}">${content}</main>
    ${
      hideChrome
        ? ""
        : `
      <footer class="footer">
        <div class="container footer-grid compact">
          <div class="footer-info">
            <div class="brand footer-brand">MajorMatch</div>
            <p>Rekomendasi jurusan berbasis minat dan aturan sistem pakar.</p>
          </div>
          <div class="footer-copy">&copy; 2026 MajorMatch. All rights reserved.</div>
        </div>
      </footer>
    `
    }
  `;
};

export const closeMobileMenu = () => {
  const navMenu = document.querySelector("#navMenu");
  const navToggle = document.querySelector("#navToggle");
  if (navMenu && navToggle) {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  }
};

export const bindMobileMenu = () => {
  const navToggle = document.querySelector("#navToggle");
  const navMenu = document.querySelector("#navMenu");
  const navLinks = document.querySelectorAll(".nav-link, .nav-wrap > .btn");

  if (!navToggle || !navMenu) return;

  const closeMenu = () => {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
};
