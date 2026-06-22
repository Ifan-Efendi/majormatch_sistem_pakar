export const setRoute = (route) => {
  window.location.hash = route;
};

export const activeRoute = () => window.location.hash.replace("#", "") || "home";
