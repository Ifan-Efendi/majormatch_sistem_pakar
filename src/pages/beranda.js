import { campuses, majors } from "../data.js";
import { renderLayout } from "../components/layout.js";
import { campusCard, majorCard } from "../components/cards.js";

export const renderHome = () =>
  renderLayout(`
  <section class="hero assessment-hero">
    <div class="container hero-grid assessment-grid">
      <div class="hero-copy">
        <h1>Temukan jurusan yang sesuai dengan minatmu.</h1>
        <p class="lead">Ikuti test singkat untuk melihat jurusan terpilih, alasan rekomendasi, prospek, dan kampus terkait.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#test">Mulai Test</a>
          <a class="btn btn-outline" href="#jurusan">Lihat Jurusan</a>
        </div>
      </div>

      <div class="report-preview" aria-label="Preview hasil rekomendasi">
        <div class="phone-frame">
          <div class="phone-top">
            <span></span>
            <strong>MajorMatch</strong>
          </div>
          <div class="phone-screen">
            <div class="preview-result">
              <span class="preview-kicker">Jurusan terpilih</span>
              <strong class="preview-major">Teknik Informatika</strong>
              <div class="preview-reason">Fokus pada algoritma, pemrograman, rekayasa perangkat lunak, dan sistem komputasi.</div>
            </div>
            <div class="preview-section">
              <span class="preview-label">Minat yang mendukung</span>
              <div class="preview-chips">
                <span>Suka logika</span>
                <span>Tertarik teknologi</span>
                <span>Suka pemrograman</span>
              </div>
            </div>
            <div class="preview-section">
              <span class="preview-label">Prospek karier</span>
              <div class="preview-reason">Software engineer, backend developer, mobile developer.</div>
            </div>
            <div class="preview-section">
              <span class="preview-label">Kampus terkait</span>
              <div class="preview-chips">
                <span>ITB</span>
                <span>UI</span>
                <span>UGM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container section-head">
      <div>
          <h2 class="home-section-title">PILIHAN JURUSAN</h2>
        <p>Beberapa pilihan jurusan yang dapat kamu eksplorasi.</p>
      </div>
      <a href="#jurusan">Lihat semua</a>
    </div>
    <div class="container card-grid three">
      ${majors.slice(0, 4).map(majorCard).join("")}
    </div>
  </section>

  <section class="section soft">
    <div class="container section-head">
      <div>
          <h2 class="home-section-title">DAFTAR KAMPUS</h2>
        <p>Beberapa kampus yang tersedia di MajorMatch.</p>
      </div>
      <a href="#kampus">Lihat semua</a>
    </div>
    <div class="container card-grid three">
      ${campuses.slice(0, 3).map(campusCard).join("")}
    </div>
  </section>
`);
