import { API_BASE_URL } from "./constants";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export async function fetchWithAuth(url, options = {}) {
  const mergedOptions = {
    ...options,
    credentials: 'same-origin', // Needed for HTTP-Only Cookies
  };

  let response = await fetch(url, mergedOptions);

  const isUnauthorized = response.status === 401 || response.status === 403 ||
    (response.redirected && response.url.toLowerCase().includes('/login'));

  if (isUnauthorized) {
    if (isRefreshing) {
      await new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      });

      let retryResponse = await fetch(url, mergedOptions);

      return retryResponse;
    }

    // Lock next request
    isRefreshing = true;

    try {
      const refreshResponse = await fetch(`${API_BASE_URL.AUTH}/refresh-token`, {
        method: 'GET',
        credentials: 'same-origin'
      });

      if (!refreshResponse.ok) {
        throw new Error('Refresh token gagal atau expired');
      }

      isRefreshing = false;
      processQueue(null);

      response = await fetch(url, mergedOptions);
    } catch (error) {
      isRefreshing = false;
      processQueue(error);

      return Promise.reject(error);
    }
  }

  return response;
}
