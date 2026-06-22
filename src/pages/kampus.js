import { campuses } from "../data.js";
import { renderLayout } from "../components/layout.js";

export const renderCampuses = () =>
  renderLayout(`
  <section class="section">
    <div class="container section-head">
      <div>
        <h1>Daftar kampus</h1>
        <p>Referensi kampus untuk jurusan yang tersedia.</p>
      </div>
    </div>
    <div class="container card-grid three">
      ${campuses
        .map(
          (campus) => `
        <article class="card campus-card">
          <div class="mc-head">
            <h3 class="mc-title">${campus.name}</h3>
          </div>
          <div class="mc-meta">
            <div class="mc-meta-line">
              <svg class="mc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              <span>${campus.city}, ${campus.province}</span>
            </div>
            <div class="mc-meta-line">
              <svg class="mc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6"/></svg>
              <span>${campus.type === "PTN" ? "Perguruan Tinggi Negeri" : "Perguruan Tinggi Swasta"}</span>
            </div>
          </div>
          <a class="mc-link" href="${campus.website}" target="_blank" rel="noopener">Website Kampus</a>
        </article>
      `,
        )
        .join("")}
    </div>
  </section>
`);
