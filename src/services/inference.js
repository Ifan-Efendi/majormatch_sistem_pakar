import { rules } from "../data.js";
import { byMajorCode } from "../utils/catalog.js";

export const evaluate = (selectedCodes) => {
  const selected = new Set(selectedCodes);
  const THRESHOLD = 3; // minimal 3 dari 4 indikator terpenuhi
  const fulfilledRules = rules
    .map((rule) => {
      const matched = rule.indicators.filter((code) => selected.has(code));
      const score = matched.length / rule.indicators.length;
      const fulfilled = matched.length >= THRESHOLD;

      return {
        ...rule,
        matched,
        score,
        fulfilled,
        majorData: byMajorCode[rule.major],
      };
    })
    .filter((rule) => rule.fulfilled)
    .sort((a, b) => b.score - a.score);

  const byMajor = fulfilledRules.reduce((result, rule) => {
    const current = result.get(rule.major) || {
      major: rule.major,
      majorData: byMajorCode[rule.major],
      matched: [],
      rules: [],
      bestScore: 0,
    };

    current.rules.push({
      code: rule.code,
      name: rule.name,
      conclusion: rule.conclusion,
      indicators: rule.indicators,
    });
    current.matched = [...new Set([...current.matched, ...rule.matched])];
    if (rule.score > current.bestScore) current.bestScore = rule.score;
    result.set(rule.major, current);

    return result;
  }, new Map());

  return [...byMajor.values()].sort((a, b) => b.bestScore - a.bestScore);
};
