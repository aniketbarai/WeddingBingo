const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// Development keeps the convenient local backend. Production uses the same origin
// by default, which works with a reverse proxy; set VITE_API_BASE_URL when the API
// is hosted separately (for example, on Render).
const BASE_URL = configuredBaseUrl || (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);

export default BASE_URL.replace(/\/$/, "");
