// TypeScript

import { apiFetch } from "./apiClient";

async function testApiClient() {
  try {
    const result = await apiFetch("/api/health");
    // eslint-disable-next-line no-console
    console.log("API fetch succeeded:", result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("API fetch failed after failover attempts:", err);
  }
}

testApiClient();
