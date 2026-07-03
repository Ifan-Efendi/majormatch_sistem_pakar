import { campuses } from "../data.js";
import { campusCard } from "../components/cards.js";
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
      ${campuses.map(campusCard).join("")}
    </div>
  </section>
`);
