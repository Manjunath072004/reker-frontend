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


// Generate QR for coupon
export const generateCouponQR = async (couponId, token) => {
  return axios.post(
    `${API}/qr/${couponId}/`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

//  Scan QR coupon
export const scanCouponQR = async (qrToken, token, orderAmount = 0) => {
  return axios.post(
    `${API}/scan/`,
    {
      token: qrToken,
      order_amount: orderAmount,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};