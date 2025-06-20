// TypeScript

const PRIMARY_API = import.meta.env.VITE_API_URL;
const FALLBACK_API = import.meta.env.VITE_GITHUB_PAGES_URL;
const MAX_RETRIES = Number(import.meta.env.VITE_MAX_RETRIES) || 3;
const REQUEST_TIMEOUT = Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 10000;

function timeoutPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms)),
  ]);
}

export async function apiFetch(
  path: string,
  options?: RequestInit,
  retries = MAX_RETRIES
): Promise<any> {
  let lastError: any;
  const endpoints = [PRIMARY_API, FALLBACK_API].filter(Boolean);

  for (let i = 0; i < endpoints.length; i++) {
    const url = endpoints[i] + path;
    try {
      const res = await timeoutPromise(fetch(url, options), REQUEST_TIMEOUT);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastError = err;
      if (i === endpoints.length - 1 && retries > 1) {
        // Retry the whole sequence
        return apiFetch(path, options, retries - 1);
      }
    }
  }
  throw lastError;
}
