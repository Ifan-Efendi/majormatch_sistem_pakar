import { majors, rules } from "../data.js";
import { majorCard } from "../components/cards.js";
import { renderLayout } from "../components/layout.js";
import { setRoute } from "../services/router.js";
import { byMajorCode, getCampusesForMajor } from "../utils/catalog.js";

export const renderMajors = () =>
  renderLayout(`
  <section class="section">
    <div class="container section-head">
      <div>
        <h1>Daftar jurusan</h1>
        <p>Pilih jurusan untuk melihat detail dan kampus terkait.</p>
      </div>
    </div>
    <div class="container card-grid three">
      ${majors.map(majorCard).join("")}
    </div>
  </section>
`);

export const renderMajorDetail = (majorCode) => {
  const major = byMajorCode[majorCode];
  if (!major) {
    setRoute("jurusan");
    return;
  }

  const relatedRules = rules.filter((rule) => rule.major === majorCode);
  const relatedCampuses = getCampusesForMajor(majorCode);

  renderLayout(`
    <section class="section">
      <div class="container">
        <article class="card result-card">
          <div class="result-section">
            <span class="result-kicker">Detail Jurusan</span>
            <strong class="result-major-name">${major.name}</strong>
            <div class="reason">${major.description}</div>
          </div>
          <div class="result-section">
            <div class="mini-label">Prospek karier</div>
            <div class="reason">${major.careers}</div>
          </div>
          <div class="result-section">
            <div class="mini-label">Kampus terkait</div>
            <div class="chips result-chips">${relatedCampuses
              .slice(0, 4)
              .map((campus) => `<span>${campus.name}</span>`)
              .join("")}</div>
          </div>
        </article>
      </div>
    </section>
  `);
};
