import { data } from "autoprefixer";
import API from "./axios";

export const signup = (data) => API.post("/auth/signup/", data);

export const verifyOtp = (data) => API.post("/auth/verify-otp/", data);

export const login = (data) => API.post("/auth/login/", data);
