import { useEffect, useState } from "react";
import { getMerchantProfile } from "../api/merchants";

export default function MerchantProfile() {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchProfile() {
      const res = await getMerchantProfile(token);
      setProfile(res.data);
    }
    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Merchant Profile</h2>

      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Business Type:</strong> {profile.business_type}</p>
      <p><strong>Address:</strong> {profile.address}</p>
      <p><strong>GST Number:</strong> {profile.gst_number}</p>
    </div>
  );
}
