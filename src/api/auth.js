import { data } from "autoprefixer";
import API from "./axios";

export const signup = (data) => API.post("/auth/signup/", data);

export const verifyOtp = (data) => API.post("/auth/verify-otp/", data);

export const login = (data) => API.post("/auth/login/", data);

export const checkPhoneRegistered = (data) => API.post("/auth/check-phone/", data);

export const checkEmailRegistered = (data) => API.post("/auth/check-email/", data);

export const resendOtp = (data) => API.post("/auth/resend-otp/", data);

export const resetPassword = (data) => API.post("/auth/reset-password/", data);
