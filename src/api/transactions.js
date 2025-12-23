import API from "./axios";

export const createTransaction = async (paymentId) => {
  const res = await API.post(`/transactions/create/${paymentId}/`);
  return res.data;
};
