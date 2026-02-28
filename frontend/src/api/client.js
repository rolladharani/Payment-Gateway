// import axios from "axios";

// const client = axios.create({
//   baseURL: "http://localhost:8000/api/v1",
// });

// export const setAuthHeaders = (key, secret) => {
//   client.defaults.headers.common["X-Api-Key"] = key;
//   client.defaults.headers.common["X-Api-Secret"] = secret;
// };

// export default client;
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

// set headers
export const setAuthHeaders = (key, secret) => {
  api.defaults.headers.common["X-Api-Key"] = key;
  api.defaults.headers.common["X-Api-Secret"] = secret;
};

// restore headers after refresh
const apiKey = localStorage.getItem("apiKey");
const apiSecret = localStorage.getItem("apiSecret");

if (apiKey && apiSecret) {
  setAuthHeaders(apiKey, apiSecret);
}

export default api;
