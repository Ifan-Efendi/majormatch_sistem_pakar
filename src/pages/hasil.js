import { rules } from "../data.js";
import { resultCard } from "../components/cards.js";
import { renderLayout } from "../components/layout.js";
import { getCurrentResult, getHistory } from "../services/storage.js";
import { byIndicatorCode, byMajorCode } from "../utils/catalog.js";
import { escapeHtml } from "../utils/escapeHtml.js";

const isValidResult = (result) =>
  result &&
  typeof result === "object" &&
  typeof result.name === "string" &&
  typeof result.level === "string" &&
  Array.isArray(result.selected) &&
  Array.isArray(result.results);

export const renderResult = () => {
  const raw = getCurrentResult() || getHistory()[0];
  const result = isValidResult(raw) ? raw : null;

  if (!result) {
    renderLayout(`
      <section class="section empty-state">
        <div class="container card">
          <h1>Belum ada hasil Test</h1>
          <p>Mulai Test dulu untuk mendapatkan rekomendasi jurusan.</p>
          <a class="btn btn-dark" href="#test">Mulai Test</a>
        </div>
      </section>
    `);
    return;
  }

  const resultRules = result.results
    .filter((item) => item.major && byMajorCode[item.major])
    .map((item) => ({
    ...item,
    ruleData: rules.find((rule) => rule.code === item.code),
    rules:
      item.rules ||
      (item.code
        ? [
            {
              code: item.code,
              name:
                item.name ||
                rules.find((rule) => rule.code === item.code)?.name ||
                "Pola minat terpilih",
              conclusion: item.conclusion,
              indicators: item.matched || [],
            },
          ]
        : []),
    majorData: byMajorCode[item.major],
  }));
  const selectedFactsBlock = (className = "") => `
    <div class="selected-facts ${className}">
      <div class="mini-label">Minat yang kamu pilih</div>
      <div class="chips result-chips">${result.selected.map((code) => `<span>${escapeHtml(byIndicatorCode[code]?.name || code)}</span>`).join("")}</div>
    </div>
  `;

  const totalMajors = resultRules.length;
  const orderNote = totalMajors > 1
    ? `<p class="result-order-note">Ditemukan <strong>${totalMajors} jurusan</strong> yang sesuai dengan minatmu. Jurusan ditampilkan berdasarkan tingkat kesesuaian &mdash; <strong>jurusan paling atas adalah yang paling sesuai</strong> dengan pola minat yang kamu pilih.</p>`
    : totalMajors === 1
      ? `<p class="result-order-note">Berdasarkan minat yang kamu pilih, ditemukan <strong>1 jurusan</strong> yang paling sesuai.</p>`
      : "";

  renderLayout(`
    <section class="section">
      <div class="container">
        <div class="card result-header">
          <div>
            <div class="mini-label">Hasil rekomendasi ditujukan kepada</div>
            <strong class="result-user-name">${escapeHtml(result.name)}</strong>
            <div class="result-meta">
              <span>${escapeHtml(result.level)}</span>
              ${result.city ? `<span>${escapeHtml(result.city)}</span>` : ""}
              <span>${result.selected.length} Minat Dipilih</span>
            </div>
            ${orderNote}
          </div>
          <a class="btn btn-dark" href="#test">Test Lagi</a>
        </div>
      </div>
      <div class="container result-grid">
        ${
          resultRules
            .map((item, index) =>
              resultCard(
                item,
                index === 0 ? selectedFactsBlock("selected-facts-inline") : "",
                index,
                totalMajors,
              ),
            )
            .join("") ||
          `
          <div class="card empty-state">
            <h2>Belum ada jurusan terpilih</h2>
            <p>Minat yang dipilih belum memenuhi pola rekomendasi. Silakan kembali dan pilih beberapa minat tambahan yang memang sesuai dengan dirimu.</p>
            <a class="btn btn-dark" href="#test-minat">Pilih Minat Tambahan</a>
          </div>
          ${selectedFactsBlock("card")}
        `
        }
      </div>
    </section>
  `);
};
