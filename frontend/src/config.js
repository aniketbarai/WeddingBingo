const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://weddingbingo.onrender.com/api";

export default BASE_URL;