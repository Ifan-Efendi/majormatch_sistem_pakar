import { byIndicatorCode, getCampusesForMajor } from "../utils/catalog.js";

export const infoCard = (icon, title, body) => `
  <div class="card about-card">
    <div class="about-icon">${icon}</div>
    <h3>${title}</h3>
    <p>${body}</p>
  </div>
`;

export const majorCard = (major) => {
  const campusCount = getCampusesForMajor(major.code).length;
  const careerShort = major.careers.split(",").slice(0, 3).join(",");
  return `
    <article class="card listing-card major-card">
      <div class="mc-head">
        <h3 class="mc-title">${major.name}</h3>
      </div>
      <p class="mc-desc">${major.description}</p>
      <div class="mc-meta">
        <div class="mc-meta-line">
          <svg class="mc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6"/></svg>
          <span>${campusCount} kampus tersedia</span>
        </div>
        <div class="mc-meta-line">
          <svg class="mc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
          <span>${careerShort}</span>
        </div>
      </div>
      <a class="mc-link" href="#jurusan-${major.code}">Lihat Detail</a>
    </article>
  `;
};

export const resultCard = (result, selectedFacts = "") => `
  <article class="card result-card">
    <div class="result-section">
      <span class="result-kicker">Jurusan terpilih</span>
      <strong class="result-major-name">${result.majorData.name}</strong>
    </div>
    ${selectedFacts}
    <div class="result-section">
      <div class="mini-label">Minat yang mendukung</div>
      <div class="chips result-chips">${result.matched
        .map((code) => `<span>${byIndicatorCode[code]?.name || code}</span>`)
        .join("")}</div>
    </div>
    <div class="result-section">
      <div class="mini-label">Prospek karier</div>
      <div class="reason">${result.majorData.careers}</div>
    </div>
    <div class="result-section">
      <div class="mini-label">Kampus terkait</div>
      <div class="chips result-chips">${getCampusesForMajor(result.major)
        .slice(0, 4)
        .map((campus) => `<span>${campus.name}</span>`)
        .join("")}</div>
    </div>
  </article>
`;

export const campusCard = (campus) => {
  const typeLabel = campus.type === "PTN" ? "Perguruan Tinggi Negeri" : "Perguruan Tinggi Swasta";
  return `
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
          <span>${typeLabel}</span>
        </div>
      </div>
      <a class="mc-link" href="${campus.website}" target="_blank" rel="noopener">Website Kampus</a>
    </article>
  `;
};
