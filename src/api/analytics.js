import API from "./axios";

export const fetchMerchantAnalytics = (range, token) => {
  return API.get(`/analytics/merchant/?range=${range}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
