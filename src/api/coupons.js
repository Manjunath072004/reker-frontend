import axios from "axios";

const API = "http://localhost:8000/api/coupons";

// Verify coupon (optional, if needed)
export const verifyCoupon = async (code, token) => {
  return axios.post(
    `${API}/verify/`,
    { code },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Apply coupon
export const applyCoupon = async (data, token) => {
  return axios.post(`${API}/apply/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// List all coupons
export const listCoupons = async (token) => {
  return axios.get(`${API}/list/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Create a new coupon
export const createCoupon = async (data, token) => {
  return axios.post(`${API}/create/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
