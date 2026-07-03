import { rules } from "../data.js";
import { infoCard } from "../components/cards.js";
import { renderLayout } from "../components/layout.js";
import { byIndicatorCode, byMajorCode } from "../utils/catalog.js";
import { escapeHtml } from "../utils/escapeHtml.js";

export const renderAbout = () =>
  renderLayout(`
  <section class="section about-hero">
    <div class="container">
      <div class="hero-about-content">
        <h1>Tentang MajorMatch</h1>
        <p class="hero-desc">Aplikasi sistem pakar berbasis website yang membantu siswa menemukan rekomendasi jurusan kuliah berdasarkan minat dan kemampuan dengan menggunakan metode forward chaining.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container section-head">
      <div>
        <h2>Kenali MajorMatch</h2>
        <p>Kenali aplikasi dan cara penggunaannya.</p>
      </div>
    </div>
    <div class="container card-grid three about-grid">
      ${infoCard("<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 00-3-3.87'/><path d='M16 3.13a4 4 0 010 7.75'/></svg>", "Untuk Siapa?", "Siswa SMA/SMK/MA yang ingin mengenali pilihan jurusan kuliah sesuai minat.")}
      ${infoCard("<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 11.08V12a10 10 0 11-5.93-9.14'/><path d='M22 4L12 14.01l-3-3'/></svg>", "Manfaat", "Menampilkan rekomendasi jurusan, alasan, prospek karier, dan kampus terkait.")}
      ${infoCard("<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg>", "Cara Penggunaan", "Isi profil singkat, pilih pernyataan minat yang sesuai, lalu sistem akan menganalisis dan menampilkan rekomendasi jurusan.")}
    </div>
  </section>

  <section class="section">
    <div class="container section-head">
      <div>
        <h2>Logika Forward Chaining</h2>
        <p>Cara sistem mencocokkan fakta dan menghasilkan rekomendasi.</p>
      </div>
    </div>
    <div class="container card-grid three about-grid">
      <div class="card about-card">
        <div class="about-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
        <h3>Fakta Awal</h3>
        <p>Minat yang dipilih disimpan sebagai fakta dalam knowledge base.</p>
      </div>
      <div class="card about-card">
        <div class="about-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
        <h3>Pencocokan Rule</h3>
        <p>Kondisi IF dievaluasi, jika terpenuhi maka THEN dieksekusi dan kesimpulan dihasilkan.</p>
      </div>
      <div class="card about-card">
        <div class="about-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg></div>
        <h3>Kesimpulan</h3>
        <p>Berdasarkan aturan IF-THEN yang terpenuhi dalam knowledge base, sistem menghasilkan rekomendasi jurusan beserta alasannya.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container section-head">
      <div>
        <h2>Tabel Basis Aturan</h2>
        <p>Daftar lengkap rule IF-THEN yang tersedia dalam sistem.</p>
      </div>
    </div>
    <div class="container card table-card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
          <th>IF Minat Terpenuhi</th>
          <th>THEN Rekomendasi</th>
          <th>Alasan</th>
            </tr>
          </thead>
          <tbody>
            ${rules
              .map(
                (rule) => `
              <tr>
                <td><div class="chips">${rule.indicators.map((code) => `<span>${escapeHtml(byIndicatorCode[code].name)}</span>`).join("")}</div></td>
                <td><strong>${escapeHtml(byMajorCode[rule.major].name)}</strong></td>
                <td>${escapeHtml(rule.conclusion)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  </section>
`);
