// src/api/merchants.js
import axios from "axios";

const API = "http://localhost:8000/api/merchants";

export const createMerchant = async (data, token) => {
  return axios.post(`${API}/create/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// export const getMerchantProfile = async (token) => {
//   return axios.get(`${API}/profile/`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

export const getMerchantProfile = async (token) => {
  return axios.get(`${API}/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const listMerchants = async (token) => {
  return axios.get(`${API}/list/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
