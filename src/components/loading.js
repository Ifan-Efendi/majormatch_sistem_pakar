import { escapeHtml } from "../utils/escapeHtml.js";

export const showLoading = (title = "Menganalisis jawaban") => {
  document.querySelector("#loadingOverlay")?.remove();
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div class="loading-overlay" id="loadingOverlay" role="status" aria-live="polite">
      <div class="loading-card">
        <div class="loader-ring" aria-hidden="true">
          <span>M</span>
        </div>
        <strong>${escapeHtml(title)}</strong>
      </div>
    </div>
  `,
  );
};

export const hideLoading = () => {
  document.querySelector("#loadingOverlay")?.remove();
};
