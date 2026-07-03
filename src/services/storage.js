const historyKey = "majormatch-history";
const profileKey = "majormatch-profile";
const currentResultKey = "majormatch-current-result";

const safeJsonParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

export const getHistory = () => {
  const data = safeJsonParse(localStorage.getItem(historyKey), []);
  return Array.isArray(data) ? data : [];
};

export const saveHistory = (entry) => {
  const nextHistory = [entry, ...getHistory()].slice(0, 25);
  localStorage.setItem(historyKey, JSON.stringify(nextHistory));
};

export const deleteHistory = (id) => {
  const next = getHistory().filter((item) => item.id !== id);
  localStorage.setItem(historyKey, JSON.stringify(next));
};

export const getProfile = () =>
  safeJsonParse(sessionStorage.getItem(profileKey), null);

export const saveProfile = (profile) => {
  sessionStorage.setItem(profileKey, JSON.stringify(profile));
};

export const getCurrentResult = () =>
  safeJsonParse(sessionStorage.getItem(currentResultKey), null);

export const saveCurrentResult = (entry) => {
  sessionStorage.setItem(currentResultKey, JSON.stringify(entry));
};

export const clearTestSession = () => {
  sessionStorage.removeItem(profileKey);
  sessionStorage.removeItem(currentResultKey);
};
