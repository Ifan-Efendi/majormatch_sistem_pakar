import "./styles.css";
import { bindMobileMenu, closeMobileMenu } from "./components/layout.js";
import { activeRoute, setRoute } from "./services/router.js";
import { renderHome } from "./pages/beranda.js";
import { renderAbout } from "./pages/tentang.js";
import { renderCampuses } from "./pages/kampus.js";
import { renderHistory, bindHistoryButtons } from "./pages/riwayat.js";
import { renderMajors, renderMajorDetail } from "./pages/jurusan.js";
import { renderResult } from "./pages/hasil.js";
import {
  renderInterestTest,
  renderTest,
  renderTestGuide,
  renderTestLoading,
} from "./pages/test.js";

const render = () => {
  const route = activeRoute();

  closeMobileMenu();

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
  bindMobileMenu();
};

window.addEventListener("hashchange", render);
render();
