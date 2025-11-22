import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function MerchantDashboard() {
  const [merchant, setMerchant] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    API.get("/merchants/me/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setMerchant(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Merchant Dashboard</h1>

      {merchant ? (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-lg font-semibold">{merchant.business_name}</h2>
          <p>Phone: {merchant.phone}</p>
          <p>Email: {merchant.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
