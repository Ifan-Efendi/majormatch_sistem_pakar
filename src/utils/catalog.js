import { campuses, indicators, majors } from "../data.js";

export const groups = indicators.reduce((result, indicator) => {
  result[indicator.group] = result[indicator.group] || [];
  result[indicator.group].push(indicator);
  return result;
}, {});

export const byMajorCode = Object.fromEntries(
  majors.map((major) => [major.code, major]),
);

export const byIndicatorCode = Object.fromEntries(
  indicators.map((indicator) => [indicator.code, indicator]),
);

export const getCampusesForMajor = (majorCode) =>
  campuses.filter((campus) => campus.majors.includes(majorCode));
