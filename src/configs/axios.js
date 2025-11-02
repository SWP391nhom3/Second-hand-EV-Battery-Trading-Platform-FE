// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://localhost:8080",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;
import axios from "axios";

// Use environment variable for API URL, fallback to default
const apiBaseURL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:8080";

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
