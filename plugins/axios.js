import axios from "axios";

export default defineNuxtPlugin(() => {
  const domain = 'https://economia.awesomeapi.com.br/json/last/';

  let api = axios.create({
    baseURL: domain,
    headers: {
      common: {
        Authorization: `Bearer`
      }
    }
  });

  api.interceptors.response.use(function (response) {
    return response.data;
  }, function (error) {
    return Promise.reject(error);
  });

  return {
    provide: {
      api: api
    }
  }
})
