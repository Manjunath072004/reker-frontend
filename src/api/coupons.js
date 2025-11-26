// src/api/coupons.js
import axios from "axios";

const API = "http://localhost:8000/api/coupons";

export const verifyCoupon = async (code, token) => {
  return axios.post(
    `${API}/verify/`,
    { code },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const applyCoupon = async (data, token) => {
  return axios.post(`${API}/apply/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const listCoupons = async (token) => {
  return axios.get(`${API}/list/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
