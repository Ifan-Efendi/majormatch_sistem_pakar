import { renderLayout } from "../components/layout.js";
import { hideLoading, showLoading } from "../components/loading.js";
import { evaluate } from "../services/inference.js";
import { activeRoute, setRoute } from "../services/router.js";
import {
  clearTestSession,
  getCurrentResult,
  getProfile,
  saveCurrentResult,
  saveHistory,
  saveProfile,
} from "../services/storage.js";
import { groups } from "../utils/catalog.js";

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

export const renderTest = () => {
  clearTestSession();

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
              <input name="name" type="text" placeholder="Nama kamu" required>
            </label>
            <label>Jenjang
              <select name="level" required>
                <option value="">Pilih jenjang</option>
                <option>SMA</option>
                <option>SMK</option>
                <option>MA</option>
              </select>
            </label>
            <label>Asal kota
              <input name="city" type="text" placeholder="Contoh: Bandung" required>
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

export const renderInterestTest = () => {
  const profile = getProfile();

  if (!profile) {
    setRoute("test");
    return;
  }

  const currentResult = getCurrentResult();
  const previousSelected = new Set(currentResult?.selected || []);

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
                    <input type="checkbox" name="indicators" value="${indicator.code}" ${previousSelected.has(indicator.code) ? "checked" : ""}>
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
            <button class="btn btn-dark" type="submit">Kirim Jawaban</button>
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

export const renderTestLoading = () => {
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

export const renderTestGuide = () => {
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

    if (entry.results.length > 0) {
      saveHistory(entry);
    }
    saveCurrentResult(entry);
    hideLoading();
    setRoute("hasil");
  }, 3000);
};
