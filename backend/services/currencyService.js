const cache = new Map();
const FALLBACK = { USD: 1, AUD: 1.5, EUR: 0.85, GBP: 0.75, CAD: 1.38, SGD: 1.28, AED: 3.67 };
export const SUPPORTED_INTERNATIONAL = ['USD','AUD','EUR','GBP','CAD','SGD','AED'];
export async function getUsdRates(codes = SUPPORTED_INTERNATIONAL) {
  const wanted = codes.filter(c => SUPPORTED_INTERNATIONAL.includes(c));
  const key = wanted.join(','); const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.rates;
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    const rates = { USD: 1, ...Object.fromEntries(wanted.filter(c => c !== 'USD').map(c => [c, Number(data?.rates?.[c]) || FALLBACK[c]])) };
    cache.set(key, { expiresAt: Date.now() + 60 * 60 * 1000, rates });
    return rates;
  } catch {
    return Object.fromEntries(wanted.map(c => [c, FALLBACK[c] ?? 1]));
  }
}
