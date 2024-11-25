import axios from "axios";

const baseDomain = process.env.VUE_APP_API_URL;
const baseURL = `${baseDomain}/json/last/`;

const instance = axios.create({
  baseURL,
  timeout: 15000
});

instance.interceptors.request.use(
  config => {
    config.headers = {
      'Accept': 'application/json',
    }
    return config;
  },
  error => {
    Promise.reject(error)
  }
);

instance.interceptors.response.use((response) => {
  return response
}, function (error) {
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

  }
  return Promise.reject(error);
});

export default instance;