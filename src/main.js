import "./styles.css";
import { campuses, indicators, majors, rules } from "./data.js";

const app = document.querySelector("#app");
const historyKey = "majormatch-history";
const profileKey = "majormatch-profile";
const minimumSelectedInterests = 4;

const groups = indicators.reduce((result, indicator) => {
  result[indicator.group] = result[indicator.group] || [];
  result[indicator.group].push(indicator);
  return result;
}, {});

const byMajorCode = Object.fromEntries(
  majors.map((major) => [major.code, major]),
);
const byIndicatorCode = Object.fromEntries(
  indicators.map((indicator) => [indicator.code, indicator]),
);

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getHistory = () => JSON.parse(localStorage.getItem(historyKey) || "[]");
const saveHistory = (entry) => {
  const nextHistory = [entry, ...getHistory()].slice(0, 25);
  localStorage.setItem(historyKey, JSON.stringify(nextHistory));
};

const getProfile = () =>
  JSON.parse(sessionStorage.getItem(profileKey) || "null");
const saveProfile = (profile) => {
  sessionStorage.setItem(profileKey, JSON.stringify(profile));
};

const getCampusesForMajor = (majorCode) =>
  campuses.filter((campus) => campus.majors.includes(majorCode));

const evaluate = (selectedCodes) => {
  const selected = new Set(selectedCodes);
  const fulfilledRules = rules
    .map((rule) => {
      const matched = rule.indicators.filter((code) => selected.has(code));
      const fulfilled = matched.length === rule.indicators.length;

      return {
        ...rule,
        matched,
        fulfilled,
        majorData: byMajorCode[rule.major],
      };
    })
    .filter((rule) => rule.fulfilled);

  const byMajor = fulfilledRules.reduce((result, rule) => {
    const current =
      result.get(rule.major) ||
      {
        major: rule.major,
        majorData: byMajorCode[rule.major],
        matched: [],
        rules: [],
      };

    current.rules.push({
      code: rule.code,
      name: rule.name,
      conclusion: rule.conclusion,
      indicators: rule.indicators,
    });
    current.matched = [...new Set([...current.matched, ...rule.matched])];
    result.set(rule.major, current);

    return result;
  }, new Map());

  return [...byMajor.values()];
};

const setRoute = (route) => {
  window.location.hash = route;
};

const activeRoute = () => window.location.hash.replace("#", "") || "home";
const isActiveNav = (route) =>
  activeRoute() === route ||
  (route === "jurusan" && activeRoute().startsWith("jurusan-"));
const navLink = (route, label) =>
  `<a class="nav-link ${isActiveNav(route) ? "active" : ""}" href="#${route}">${label}</a>`;

const showLoading = (title = "Menganalisis jawaban") => {
  document.querySelector("#loadingOverlay")?.remove();
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div class="loading-overlay" id="loadingOverlay" role="status" aria-live="polite">
      <div class="loading-card">
        <div class="loader-ring" aria-hidden="true">
          <span>M</span>
        </div>
        <strong>${title}</strong>
      </div>
    </div>
  `,
  );
};

const hideLoading = () => {
  document.querySelector("#loadingOverlay")?.remove();
};

const renderLayout = (content) => {
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

const statCard = (value, label) => `
  <div class="stat-card">
    <strong>${value}</strong>
    <span>${label}</span>
  </div>
`;

const indicatorStatements = {
  I01: {
    statement: "Saya memiliki ketertarikan pada matematika.",
    detail: "Saya nyaman menggunakan hitungan, rumus, dan pola numerik.",
  },
  I02: {
    statement: "Saya mampu berpikir secara logis dan runtut.",
    detail: "Saya terbiasa menganalisis masalah secara teratur.",
  },
  I03: {
    statement: "Saya memiliki ketertarikan pada teknologi.",
    detail:
      "Saya ingin memahami aplikasi, sistem digital, dan perkembangan teknologi.",
  },
  I04: {
    statement: "Saya tertarik mempelajari pemrograman.",
    detail: "Saya ingin membuat aplikasi, website, atau solusi berbasis kode.",
  },
  I05: {
    statement: "Saya tertarik menganalisis data.",
    detail: "Saya nyaman membaca pola dari angka, grafik, dan informasi.",
  },
  I06: {
    statement: "Saya memiliki ketertarikan pada bidang bisnis.",
    detail:
      "Saya ingin memahami strategi usaha, pemasaran, dan pengelolaan organisasi.",
  },
  I07: {
    statement: "Saya teliti dalam melakukan perhitungan.",
    detail: "Saya terbiasa cermat saat mengolah angka atau dokumen.",
  },
  I08: {
    statement: "Saya nyaman bekerja dengan angka.",
    detail: "Saya tertarik pada data kuantitatif dan laporan numerik.",
  },
  I09: {
    statement: "Saya mampu menghasilkan ide yang kreatif.",
    detail: "Saya senang menemukan gagasan baru dan solusi yang berbeda.",
  },
  I10: {
    statement: "Saya memiliki ketertarikan pada desain visual.",
    detail:
      "Saya tertarik pada ilustrasi, tata letak, warna, dan visual branding.",
  },
  I11: {
    statement: "Saya memiliki kemampuan komunikasi yang baik.",
    detail: "Saya nyaman menyampaikan ide dan berinteraksi dengan orang lain.",
  },
  I12: {
    statement: "Saya percaya diri saat berbicara di depan orang lain.",
    detail: "Saya nyaman melakukan presentasi, public speaking, atau diskusi.",
  },
  I13: {
    statement: "Saya memiliki kepedulian untuk membantu orang lain.",
    detail:
      "Saya peka terhadap kebutuhan orang lain dan ingin memberi dukungan.",
  },
  I14: {
    statement: "Saya tertarik memahami perilaku manusia.",
    detail: "Saya ingin memahami pola pikir, emosi, dan kebiasaan manusia.",
  },
  I15: {
    statement: "Saya tertarik memecahkan masalah.",
    detail: "Saya tertantang mencari solusi dari persoalan yang rumit.",
  },
  I16: {
    statement: "Saya nyaman bekerja dalam tim.",
    detail: "Saya dapat berkolaborasi untuk mencapai tujuan bersama.",
  },
  I17: {
    statement: "Saya memiliki ketertarikan pada perencanaan.",
    detail: "Saya tertarik menyusun strategi, jadwal, dan tahapan kerja.",
  },
  I18: {
    statement: "Saya tertarik mengelola kegiatan organisasi.",
    detail: "Saya senang mengatur agenda, kegiatan, dan kerja kelompok.",
  },
  I19: {
    statement: "Saya tertarik melakukan riset.",
    detail: "Saya senang menggali informasi dan membandingkan referensi.",
  },
  I20: {
    statement: "Saya nyaman dengan pekerjaan yang terstruktur.",
    detail: "Saya menyukai aturan kerja yang rapi dan sistematis.",
  },
  I21: {
    statement: "Saya tertarik pada biologi dan kesehatan.",
    detail:
      "Saya ingin mempelajari tubuh manusia, makhluk hidup, dan kesehatan.",
  },
  I22: {
    statement: "Saya memiliki kepedulian terhadap perawatan pasien.",
    detail: "Saya peduli terhadap keselamatan dan kenyamanan orang lain.",
  },
  I23: {
    statement: "Saya tertarik pada kimia dan kegiatan laboratorium.",
    detail:
      "Saya ingin memahami eksperimen, obat, bahan, dan prosedur laboratorium.",
  },
  I24: {
    statement: "Saya tertarik pada hukum dan keadilan.",
    detail: "Saya peduli pada aturan, argumen, hak, dan penyelesaian konflik.",
  },
  I25: {
    statement: "Saya memiliki ketertarikan pada kegiatan menulis.",
    detail:
      "Saya senang menyusun gagasan, cerita, artikel, atau dokumen tertulis.",
  },
  I26: {
    statement: "Saya tertarik mempelajari bahasa asing.",
    detail: "Saya ingin memahami bahasa, budaya, dan komunikasi lintas negara.",
  },
  I27: {
    statement: "Saya tertarik pada kegiatan mengajar.",
    detail: "Saya senang menjelaskan materi dan membantu orang lain belajar.",
  },
  I28: {
    statement: "Saya tertarik memahami mesin dan alat.",
    detail:
      "Saya ingin mengetahui cara kerja mesin, alat produksi, dan sistem mekanik.",
  },
  I29: {
    statement: "Saya memiliki ketertarikan pada bangunan dan ruang.",
    detail: "Saya tertarik pada desain bangunan, tata ruang, dan konstruksi.",
  },
  I30: {
    statement: "Saya memiliki kepedulian terhadap lingkungan.",
    detail:
      "Saya tertarik pada isu alam, keberlanjutan, dan pengelolaan lingkungan.",
  },
  I31: {
    statement: "Saya tertarik pada ekonomi dan keuangan.",
    detail:
      "Saya ingin memahami uang, pasar, investasi, dan keputusan ekonomi.",
  },
  I32: {
    statement: "Saya tertarik pada media kreatif.",
    detail:
      "Saya senang membuat konten, foto, video, audio, atau karya digital.",
  },
  I33: {
    statement: "Saya tertarik pada pertanian dan pangan.",
    detail:
      "Saya peduli pada produksi pangan, agribisnis, dan sumber daya hayati.",
  },
  I34: {
    statement: "Saya memiliki kepedulian terhadap isu sosial.",
    detail:
      "Saya tertarik pada masyarakat, kebijakan publik, dan perubahan sosial.",
  },
  I35: {
    statement: "Saya tertarik pada peta dan wilayah.",
    detail:
      "Saya ingin memahami wilayah, kota, transportasi, dan data spasial.",
  },
  I36: {
    statement: "Saya tertarik pada keamanan digital.",
    detail:
      "Saya ingin memahami jaringan, perlindungan data, dan risiko siber.",
  },
};

const getIndicatorStatement = (indicator) =>
  indicatorStatements[indicator.code] || {
    statement: indicator.name,
    detail: indicator.description,
  };

const renderHome = () =>
  renderLayout(`
  <section class="hero assessment-hero">
    <div class="container hero-grid assessment-grid">
      <div class="hero-copy">
        <h1>Temukan jurusan yang sesuai dengan minatmu.</h1>
        <p class="lead">Ikuti test singkat untuk melihat jurusan terpilih, alasan rekomendasi, prospek, dan kampus terkait.</p>
        <div class="hero-actions">
          <a class="btn btn-dark" href="#test">Mulai Test</a>
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
            <div class="preview-card main-result">
              <span>Jurusan terpilih</span>
              <h2>Teknik Informatika</h2>
              <b class="preview-rule">Berdasarkan pola minat</b>
            </div>
            <div class="preview-card">
              <span>Minat yang mendukung</span>
              <div class="preview-tags">
                <b>Logika</b>
                <b>Teknologi</b>
                <b>Problem solving</b>
              </div>
            </div>
            <div class="preview-card campus-preview">
              <span>Kampus terkait</span>
              <strong>UI</strong>
              <strong>ITB</strong>
              <strong>UGM</strong>
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
    <div class="container card-grid four">
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

const infoCard = (number, title, body) => `
  <div class="card info">
    <span class="number">${number}</span>
    <h3>${title}</h3>
    <p>${body}</p>
  </div>
`;

const majorCard = (major) => {
  const campusList = getCampusesForMajor(major.code).slice(0, 3);
  return `
    <article class="card listing-card major-card">
      <h3>${major.name}</h3>
      <p>${major.description}</p>
      <div class="mini-label">Rekomendasi kampus:</div>
      <div class="chips">
        ${campusList.map((campus) => `<span>${campus.name}</span>`).join("") || "<small>Belum ada data kampus.</small>"}
      </div>
      <a class="text-link" href="#jurusan-${major.code}">Lihat Detail</a>
    </article>
  `;
};

const renderTest = () => {
  const profile = getProfile() || {};

  renderLayout(`
    <section class="section test-page">
      <div class="container test-hero">
        <div>
          <h1>Mulai Test</h1>
          <p>Isi data singkat sebelum masuk ke test minat.</p>
        </div>
      </div>
      <form class="container assessment-form profile-only" id="profileForm">
        <section class="card form-card profile-card">
          <div class="profile-fields">
            <label>Nama
              <input name="name" type="text" placeholder="Nama kamu" value="${escapeHtml(profile.name || "")}" required>
            </label>
            <label>Jenjang
              <select name="level" required>
                <option value="">Pilih jenjang</option>
                <option ${profile.level === "SMA" ? "selected" : ""}>SMA</option>
                <option ${profile.level === "SMK" ? "selected" : ""}>SMK</option>
                <option ${profile.level === "MA" ? "selected" : ""}>MA</option>
              </select>
            </label>
            <label>Asal kota
              <input name="city" type="text" placeholder="Contoh: Bandung" value="${escapeHtml(profile.city || "")}" required>
            </label>
          </div>
        </section>
        <div class="form-actions profile-actions">
          <button class="btn btn-dark" type="submit">Lanjut ke Test</button>
        </div>
      </form>
    </section>
  `);

  document
    .querySelector("#profileForm")
    .addEventListener("submit", handleProfileSubmit);
};

const renderInterestTest = () => {
  const profile = getProfile();

  if (!profile) {
    setRoute("test");
    return;
  }

  renderLayout(`
    <section class="section test-page">
      <form class="container assessment-form interest-only" id="testForm">
        <section class="card test-card assessment-card">
          <div class="test-intro">
            <div>
              <h2>Masukkan minat yang sesuai dengan dirimu</h2>
              <p>Pilih pernyataan yang paling menggambarkan minat dan kemampuanmu.</p>
            </div>
            <div class="selection-pill">
              <strong id="selectedCount">0</strong>
              <span>dipilih</span>
            </div>
          </div>
          ${Object.entries(groups)
            .map(
              ([group, items]) => `
            <div class="indicator-group assessment-group">
              <div class="indicator-group-head">
                <h3>${group}</h3>
                <span>${items.length} pernyataan</span>
              </div>
              <div class="question-list">
                ${items
                  .map((indicator) => {
                    const statement = getIndicatorStatement(indicator);
                    return `
                  <label class="indicator-option fact-option">
                    <input type="checkbox" name="indicators" value="${indicator.code}">
                    <span class="fact-copy">
                      <strong>${statement.statement}</strong>
                      <small>${statement.detail}</small>
                    </span>
                  </label>
                `;
                  })
                  .join("")}
              </div>
            </div>
          `,
            )
            .join("")}
          <div class="form-actions">
            <button class="btn btn-dark" type="submit">Lihat Hasil Test</button>
          </div>
        </section>
      </form>
    </section>
  `);

  document
    .querySelector("#testForm")
    .addEventListener("submit", handleTestSubmit);
  bindSelectedCount();
};

const handleProfileSubmit = (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);

  saveProfile({
    name: form.get("name"),
    level: form.get("level"),
    city: form.get("city"),
  });

  setRoute("test-loading");
};

const renderTestLoading = () => {
  const profile = getProfile();

  if (!profile) {
    setRoute("test");
    return;
  }

  renderLayout(`
    <section class="test-loading-page">
      <div class="test-loader">
        <div class="loader-mark">M</div>
        <div class="loader-track">
          <span></span>
        </div>
        <p>Test sedang disiapkan...</p>
      </div>
    </section>
  `);

  window.setTimeout(() => {
    if (activeRoute() === "test-loading") {
      setRoute("test-panduan");
    }
  }, 1100);
};

const renderTestGuide = () => {
  const profile = getProfile();

  if (!profile) {
    setRoute("test");
    return;
  }

  renderLayout(`
    <section class="test-guide-page">
      <div class="guide-shell">
        <div class="guide-illustration" aria-hidden="true">
          <div class="guide-paper">
            <span></span>
            <span></span>
            <span class="active"></span>
            <strong></strong>
          </div>
        </div>
        <span class="mini-kicker">Panduan Test</span>
        <h1>Tentukan sesuai dengan minatmu</h1>
        <div class="guide-list">
          <p><span>1</span> Centang pernyataan yang sesuai dengan dirimu.</p>
          <p><span>2</span> Sistem akan menganalisis jawaban Anda dan memberikan rekomendasi jurusan terbaik.</p>
        </div>
        <a class="btn btn-dark guide-start" href="#test-minat">Mulai Test</a>
      </div>
    </section>
  `);
};

const bindSelectedCount = () => {
  const testForm = document.querySelector("#testForm");
  if (!testForm) return;

  const targets = ["#selectedCount"]
    .map((selector) => document.querySelector(selector))
    .filter(Boolean);

  const syncCount = () => {
    const count = testForm.querySelectorAll(
      'input[name="indicators"]:checked',
    ).length;
    targets.forEach((target) => {
      target.textContent = count;
    });
  };

  testForm.addEventListener("change", (event) => {
    if (event.target instanceof HTMLInputElement) {
      syncCount();
    }
  });

  syncCount();
};

const handleTestSubmit = (event) => {
  event.preventDefault();
  const testForm = event.currentTarget;
  const form = new FormData(testForm);
  const profile = getProfile();
  const selected = form.getAll("indicators");

  if (!profile) {
    alert("Isi profil singkat terlebih dahulu.");
    setRoute("test");
    return;
  }

  if (selected.length < minimumSelectedInterests) {
    alert(
      `Silakan pilih minimal ${minimumSelectedInterests} pernyataan yang sesuai dengan dirimu.`,
    );
    return;
  }

  const submitButton = testForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Memproses...";
  showLoading();

  window.setTimeout(() => {
    const results = evaluate(selected);
    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      name: profile.name,
      level: profile.level,
      city: profile.city,
      selected,
      results: results.map(({ major, matched, rules }) => ({
        major,
        matched,
        rules,
      })),
    };

    saveHistory(entry);
    sessionStorage.setItem("majormatch-current-result", JSON.stringify(entry));
    hideLoading();
    setRoute("hasil");
  }, 3000);
};

const renderResult = () => {
  const result =
    JSON.parse(sessionStorage.getItem("majormatch-current-result") || "null") ||
    getHistory()[0];

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

  const resultRules = result.results.map((item) => ({
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
      <h2>Minat yang kamu pilih</h2>
      <div class="chips">${result.selected.map((code) => `<span>${byIndicatorCode[code]?.name || code}</span>`).join("")}</div>
    </div>
  `;

  renderLayout(`
    <section class="section">
      <div class="container section-head">
        <div class="result-heading result-summary-card">
          <h2 class="result-summary-title">Rekomendasi untuk</h2>
          <strong class="result-user-name">${escapeHtml(result.name)}</strong>
          <div class="result-meta">
            <span>${escapeHtml(result.level)}</span>
            ${result.city ? `<span>${escapeHtml(result.city)}</span>` : ""}
            <span>${result.selected.length} minat dipilih</span>
          </div>
        </div>
        <a class="btn btn-dark" href="#test">Test Lagi</a>
      </div>
      <div class="container result-grid">
        ${
          resultRules
            .map((item, index) =>
              resultCard(
                item,
                index === 0 ? selectedFactsBlock("selected-facts-inline") : "",
              ),
            )
            .join("") ||
          `
          <div class="card empty-state">
            <h2>Belum ada jurusan terpilih</h2>
            <p>Minat yang dipilih belum memenuhi pola rekomendasi. Silakan kembali dan pilih beberapa minat tambahan yang memang sesuai dengan dirimu.</p>
            <a class="btn btn-dark" href="#test">Pilih Minat Tambahan</a>
          </div>
          ${selectedFactsBlock("card")}
        `
        }
      </div>
    </section>
  `);
};

const resultCard = (result, selectedFacts = "") => `
  <article class="card result-card">
    <div class="result-panel result-main">
      <h2 class="result-summary-title">Jurusan terpilih</h2>
      <strong class="result-major-name">${result.majorData.name}</strong>
      ${selectedFacts}
      <span class="rule-badge">Berdasarkan pola minat: ${result.rules
        .map((rule) => rule.name)
        .join(", ")}</span>
    </div>
    <div class="result-panel">
      <div class="mini-label">Minat yang mendukung</div>
      <div class="chips">${result.matched
        .map((code) => `<span>${byIndicatorCode[code]?.name || code}</span>`)
        .join("")}</div>
    </div>
    <div class="result-panel">
      <div class="mini-label">Alasan rekomendasi</div>
      <p>${result.majorData.description}</p>
      ${result.rules
        .map((rule) => `<div class="reason">${rule.conclusion}</div>`)
        .join("")}
    </div>
    <div class="result-panel">
      <div class="mini-label">Prospek karier</div>
      <p>${result.majorData.careers}</p>
    </div>
    <div class="result-panel">
      <div class="mini-label">Kampus terkait</div>
      <div class="chips">${getCampusesForMajor(result.major)
        .slice(0, 4)
        .map((campus) => `<span>${campus.name}</span>`)
        .join("")}</div>
    </div>
  </article>
`;

const renderMajors = () =>
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

const renderMajorDetail = (majorCode) => {
  const major = byMajorCode[majorCode];
  if (!major) {
    setRoute("jurusan");
    return;
  }

  const relatedRules = rules.filter((rule) => rule.major === majorCode);
  const relatedCampuses = getCampusesForMajor(majorCode);

  renderLayout(`
    <section class="section">
      <div class="container detail-layout single">
        <article class="detail-main">
          <span class="eyebrow">Detail Jurusan</span>
          <h1>${major.name}</h1>
          <p class="lead">${major.description}</p>
          <div class="detail-block">
            <h2>Prospek karier</h2>
            <p>${major.careers}</p>
          </div>
          <div class="detail-block">
            <h2>Pola minat</h2>
            <div class="rule-stack">
              ${relatedRules.map(ruleSummary).join("")}
            </div>
          </div>
          <div class="detail-block">
            <h2>Kampus terkait</h2>
            <div class="card-grid two">
              ${relatedCampuses.map(campusCard).join("")}
            </div>
          </div>
        </article>
      </div>
    </section>
  `);
};

const campusCard = (campus) => `
  <article class="card campus listing-card">
    <span class="tag">${campus.type}</span>
    <h3>${campus.name}</h3>
    <p>${campus.city}, ${campus.province}</p>
    <a class="text-link" href="${campus.website}" target="_blank" rel="noopener">Website Kampus</a>
  </article>
`;

const renderCampuses = () =>
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
        <article class="card campus listing-card">
          <span class="tag">${campus.type}</span>
          <h3>${campus.name}</h3>
          <p>${campus.city}, ${campus.province}</p>
          <div class="mini-label">Jurusan terkait:</div>
          <div class="chips">${campus.majors
            .slice(0, 5)
            .map((code) => `<span>${byMajorCode[code].name}</span>`)
            .join("")}</div>
          <a class="text-link" href="${campus.website}" target="_blank" rel="noopener">Website Kampus</a>
        </article>
      `,
        )
        .join("")}
    </div>
  </section>
`);

const ruleSummary = (rule) => `
  <div class="rule-summary">
    <strong>${rule.name}</strong>
    <div class="chips">${rule.indicators.map((code) => `<span>${byIndicatorCode[code].name}</span>`).join("")}</div>
  </div>
`;

const usageStepCard = (number, title, body) => `
  <article class="card info">
    <span class="number">${number}</span>
    <h3>${title}</h3>
    <p>${body}</p>
  </article>
`;

const ifThenRuleCard = (rule) => `
  <article class="card">
    <span class="eyebrow">Rule ${rule.code}</span>
    <h3>IF ${rule.indicators.map((code) => byIndicatorCode[code].name).join(", ")}</h3>
    <p>THEN rekomendasikan <strong>${byMajorCode[rule.major].name}</strong>.</p>
    <div class="reason">${rule.conclusion}</div>
  </article>
`;

const renderAbout = () =>
  renderLayout(`
  <section class="section">
    <div class="container section-head">
      <div>
        <h1>Tentang MajorMatch</h1>
        <p>Aplikasi sistem pakar sederhana untuk rekomendasi jurusan.</p>
      </div>
    </div>
    <div class="container card-grid three about-grid">
      ${infoCard("1", "Untuk siapa?", "Siswa yang ingin mengenali pilihan jurusan kuliah.")}
      ${infoCard("2", "Manfaat", "Menampilkan rekomendasi, alasan, prospek, dan kampus terkait.")}
      ${infoCard("3", "Cara pakai", "Isi profil, pilih minat, lalu lihat hasil rekomendasi.")}
    </div>
  </section>

  <section class="section soft">
    <div class="container section-head">
      <div>
        <h2>Cara penggunaan</h2>
        <p>Alur penggunaan aplikasi.</p>
      </div>
    </div>
    <div class="container card-grid four">
      ${usageStepCard("1", "Buka Test", "Isi nama, jenjang, dan asal kota.")}
      ${usageStepCard("2", "Pilih minat", "Centang indikator yang sesuai dengan dirimu.")}
      ${usageStepCard("3", "Cek rule", "Sistem mencari rule IF-THEN yang seluruh faktanya terpenuhi.")}
      ${usageStepCard("4", "Lihat hasil", "Baca rule terpenuhi, rekomendasi, alasan, prospek, dan kampus terkait.")}
    </div>
  </section>

  <section class="section soft">
    <div class="container section-head">
      <div>
        <h2>Logika Forward Chaining</h2>
        <p>Sistem mencocokkan fakta dari jawaban pengguna dengan aturan IF-THEN.</p>
      </div>
    </div>
    <div class="container card-grid three">
      <article class="card">
        <h3>1. Fakta awal</h3>
        <p>Fakta awal berasal dari indikator minat yang dipilih.</p>
      </article>
      <article class="card">
        <h3>2. Pencocokan rule</h3>
        <p>Fakta dibandingkan dengan rule pada basis pengetahuan.</p>
      </article>
      <article class="card">
        <h3>3. Kesimpulan</h3>
        <p>Jika semua IF pada rule terpenuhi, sistem menampilkan THEN sebagai rekomendasi.</p>
      </article>
    </div>
  </section>

  <section class="section">
    <div class="container section-head">
      <div>
        <h2>Aturan IF-THEN</h2>
        <p>Contoh rule yang digunakan sistem.</p>
      </div>
    </div>
    <div class="container card-grid three">
      ${rules.slice(0, 6).map(ifThenRuleCard).join("")}
    </div>
  </section>

  <section class="section soft">
    <div class="container section-head">
      <div>
        <h2>Tabel basis aturan</h2>
        <p>Daftar rule IF-THEN yang tersedia.</p>
      </div>
    </div>
    <div class="container card table-card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
          <th>Nama Rule</th>
          <th>IF Minat Terpenuhi</th>
          <th>THEN Rekomendasi</th>
          <th>Penjelasan</th>
            </tr>
          </thead>
          <tbody>
            ${rules
              .map(
                (rule) => `
              <tr>
                <td>${rule.name}</td>
                <td><div class="chips">${rule.indicators.map((code) => `<span>${byIndicatorCode[code].name}</span>`).join("")}</div></td>
                <td><strong>${byMajorCode[rule.major].name}</strong></td>
                <td>${rule.conclusion}</td>
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

const renderHistory = () => {
  const history = getHistory();
  renderLayout(`
    <section class="section">
      <div class="container section-head">
        <div>
          <h1>Riwayat Test</h1>
          <p>Lihat kembali hasil sebelumnya dan bandingkan perubahan minatmu.</p>
        </div>
        <button class="btn btn-outline" id="clearHistory" ${history.length ? "" : "disabled"}>Hapus Riwayat</button>
      </div>
      <div class="container history-list">
        ${
          history.length
            ? history.map(historyCard).join("")
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

  document.querySelector("#clearHistory")?.addEventListener("click", () => {
    if (confirm("Hapus semua riwayat Test?")) {
      localStorage.removeItem(historyKey);
      renderHistory();
    }
  });
};

const historyCard = (entry) => {
  const topResult = entry.results[0];
  const major = topResult ? byMajorCode[topResult.major] : null;
  return `
    <article class="card history-card">
      <div>
        <strong>${escapeHtml(entry.name)}</strong>
        <p>${new Date(entry.date).toLocaleString("id-ID")} - ${escapeHtml(entry.level)}${entry.city ? ` - ${escapeHtml(entry.city)}` : ""}</p>
      </div>
      <div>
        <span class="score small">${topResult ? "Jurusan terpilih" : "Belum ada jurusan"}</span>
        <h3>${major ? major.name : "Belum ada hasil"}</h3>
      </div>
      <button class="btn btn-outline" data-history-id="${entry.id}">Buka Hasil</button>
    </article>
  `;
};

const bindHistoryButtons = () => {
  document.querySelectorAll("[data-history-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = getHistory().find(
        (item) => item.id === button.dataset.historyId,
      );
      if (entry) {
        sessionStorage.setItem(
          "majormatch-current-result",
          JSON.stringify(entry),
        );
        setRoute("hasil");
      }
    });
  });
};

const render = () => {
  const route = activeRoute();

  // Close mobile menu immediately when navigating
  const navMenu = document.querySelector("#navMenu");
  const navToggle = document.querySelector("#navToggle");
  if (navMenu && navToggle) {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (route === "home") renderHome();
  else if (route === "test") renderTest();
  else if (route === "test-loading") renderTestLoading();
  else if (route === "test-panduan") renderTestGuide();
  else if (route === "test-minat") renderInterestTest();
  else if (route === "hasil") renderResult();
  else if (route === "jurusan") renderMajors();
  else if (route.startsWith("jurusan-"))
    renderMajorDetail(route.replace("jurusan-", ""));
  else if (route === "kampus") renderCampuses();
  else if (route === "tentang") renderAbout();
  else if (route === "riwayat") {
    renderHistory();
    bindHistoryButtons();
  } else {
    setRoute("home");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });

  // Setup mobile menu toggle
  const navToggle2 = document.querySelector("#navToggle");
  const navMenu2 = document.querySelector("#navMenu");
  const navLinks = document.querySelectorAll(".nav-link, .nav-wrap > .btn");

  if (navToggle2 && navMenu2) {
    const closeMenu = () => {
      navMenu2.classList.remove("active");
      navToggle2.classList.remove("active");
      navToggle2.setAttribute("aria-expanded", "false");
    };

    navToggle2.addEventListener("click", () => {
      const isOpen = navMenu2.classList.toggle("active");
      navToggle2.classList.toggle("active", isOpen);
      navToggle2.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when a link is clicked
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }
};

window.addEventListener("hashchange", render);
render();
