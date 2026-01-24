import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function ScanCoupon() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const applyCoupon = async () => {
      const token = params.get("token");
      if (!token) return;

      const res = await API.post("/coupons/scan/", {
        token,
        order_amount: 0, // POS will calculate
      });

      navigate("/pos", {
        state: { coupon: res.data.coupon },
      });
    };

    applyCoupon();
  }, []);

  return <p className="text-center mt-20">Applying coupon…</p>;
}
