import { renderLayout } from "../components/layout.js";
import { setRoute } from "../services/router.js";
import { deleteHistory, getHistory, saveCurrentResult } from "../services/storage.js";
import { byMajorCode } from "../utils/catalog.js";
import { escapeHtml } from "../utils/escapeHtml.js";

export const renderHistory = () => {
  const history = getHistory();
  renderLayout(`
    <section class="section">
      <div class="container section-head">
        <div>
          <h1>Riwayat Test</h1>
          <p>Lihat kembali hasil sebelumnya dan bandingkan perubahan minatmu.</p>
        </div>
      </div>
      <div class="container">
        ${
          history.length
            ? `<div class="card table-card">
                <div class="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>Jenjang &amp; Asal</th>
                        <th>Jurusan Terpilih</th>
                        <th>Waktu</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${history.map(historyRow).join("")}
                    </tbody>
                  </table>
                </div>
              </div>`
            : `
          <div class="card empty-state">
            <h2>Belum ada riwayat</h2>
            <a class="btn btn-dark" href="#test">Mulai Test</a>
          </div>
        `
        }
      </div>
    </section>
  `);
};

const historyRow = (entry) => {
  const topResult = entry.results[0];
  const major = topResult ? byMajorCode[topResult.major] : null;
  const date = new Date(entry.date);
  const dateStr = date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const initials = entry.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return `
    <tr>
      <td>
        <div class="history-name-cell">
          <div class="history-avatar"><span>${initials}</span></div>
          <strong>${escapeHtml(entry.name)}</strong>
        </div>
      </td>
      <td>${escapeHtml(entry.level)}${entry.city ? ` &middot; ${escapeHtml(entry.city)}` : ""}</td>
      <td><strong>${major ? major.name : "Belum ada hasil"}</strong></td>
      <td>${dateStr}</td>
      <td>
        <div class="history-action-cell">
          <button class="btn btn-dark btn-sm" data-history-id="${entry.id}">Buka Hasil</button>
          <button class="btn btn-delete btn-sm" data-delete-id="${entry.id}">Hapus</button>
        </div>
      </td>
    </tr>
  `;
};

export const bindHistoryButtons = () => {
  document.querySelectorAll("[data-history-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = getHistory().find(
        (item) => item.id === button.dataset.historyId,
      );
      if (entry) {
        saveCurrentResult(entry);
        setRoute("hasil");
      }
    });
  });

  document.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", () => {
      if (confirm("Hapus riwayat test ini?")) {
        deleteHistory(button.dataset.deleteId);
        renderHistory();
        bindHistoryButtons();
      }
    });
  });
};
