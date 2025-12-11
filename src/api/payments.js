import API from "./axios";

export const createPayment = async (data, token) => {
  const res = await API.post("/payments/create/", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const verifyPayment = async (paymentId, status, token) => {
  const res = await API.post(`/payments/verify/${paymentId}/`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
