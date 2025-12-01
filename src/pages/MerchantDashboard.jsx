import { useEffect, useState, useContext, useMemo } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import rekerPayLogo from "../assets/Reker-logo.png";

/* Lucide Icons */
import {
  Menu, User, Home, CreditCard, Ticket, BarChart2, LogOut,
  ChevronLeft, Settings, Bell, Search, TrendingUp, List
} from "lucide-react";

/* Imported Pages */
import POSPage from "./POSPage";
import Coupons from "./Coupons";

/* Imported Components (YOU created these new files) */
import DashboardView from "../components/DashboardView";
import TransactionsView from "../components/TransactionsView";
import SettlementsView from "../components/SettlementsView";
import AnalyticsView from "../components/AnalyticsView";
import SettingsView from "../components/SettingsView";


export default function MerchantDashboard() {
  const { token } = useContext(AuthContext);
  const [merchant, setMerchant] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [active, setActive] = useState("dashboard");

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("7d");

  /* ---------------- MOCK DATA ---------------- */
  const transactionsMock = useMemo(
    () => [
      { id: "T-1001", amount: 1499, status: "SUCCESS", method: "UPI", time: "2025-11-26 10:05" },
      { id: "T-1002", amount: 249, status: "FAILED", method: "CARD", time: "2025-11-26 09:54" },
      { id: "T-1003", amount: 499, status: "SUCCESS", method: "WALLET", time: "2025-11-25 18:22" },
      { id: "T-1004", amount: 1299, status: "SUCCESS", method: "UPI", time: "2025-11-25 13:11" },
      { id: "T-1005", amount: 79, status: "SUCCESS", method: "PAYLINK", time: "2025-11-24 20:02" },
    ],
    []
  );

  const revenueSeries = useMemo(
    () => [
      { day: "Nov 21", revenue: 4200, tx: 34 },
      { day: "Nov 22", revenue: 3600, tx: 28 },
      { day: "Nov 23", revenue: 5600, tx: 46 },
      { day: "Nov 24", revenue: 4800, tx: 38 },
      { day: "Nov 25", revenue: 6200, tx: 51 },
      { day: "Nov 26", revenue: 7100, tx: 59 },
      { day: "Nov 27", revenue: 5400, tx: 42 },
    ],
    []
  );

  /* ---------------- API CALL ---------------- */
  useEffect(() => {
    if (!token) return;
    API.get("/merchants/me/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setMerchant(res.data))
      .catch((err) => console.error("Failed to fetch merchant:", err));
  }, [token]);

  /* ---------------- FILTER TX ---------------- */
  const filteredTransactions = transactionsMock.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      String(t.amount).includes(q) ||
      t.status.toLowerCase().includes(q) ||
      t.method.toLowerCase().includes(q)
    );
  });

  /* ---------------- SIDEBAR NAV ITEMS ---------------- */
  const navItems = [
    { key: "dashboard", icon: <Home size={18} />, label: "Dashboard" },
    { key: "pos", icon: <CreditCard size={18} />, label: "Payment (POS)" },
    { key: "coupons", icon: <Ticket size={18} />, label: "Coupons" },
    { key: "transactions", icon: <List size={18} />, label: "Transactions" },
    { key: "settlements", icon: <BarChart2 size={18} />, label: "Settlements" },
    { key: "analytics", icon: <TrendingUp size={18} />, label: "Analytics" },
    { key: "settings", icon: <Settings size={18} />, label: "Settings" },
  ];

  const menuClass = (k) =>
    `flex items-center gap-3 cursor-pointer p-2 rounded-lg transition ${
      active === k
        ? "bg-green-50 border-l-4 border-green-600 text-green-700"
        : "text-gray-700 hover:bg-green-50"
    }`;

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg h-screen p-4 fixed left-0 top-0 border-r transition-all duration-300 z-40`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div>
              <img src={rekerPayLogo} className="h-12" alt="RekerPay" />
            </div>
            {sidebarOpen && (
              <h1 className="text-lg font-extrabold bg-gradient-to-r from-yellow-500 to-green-600 bg-clip-text text-transparent">
                RekerPay
              </h1>
            )}
          </div>

          <button
            className="p-1 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen((s) => !s)}
          >
            <ChevronLeft
              size={20}
              className={`${!sidebarOpen ? "rotate-180" : ""} transition-transform`}
            />
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((n) => (
            <div
              key={n.key}
              className={menuClass(n.key)}
              onClick={() => setActive(n.key)}
            >
              {n.icon}
              {sidebarOpen && <span className="font-medium">{n.label}</span>}
            </div>
          ))}

          {/* LOGOUT */}
          <div className="pt-6 border-t mt-4">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-700">
              <LogOut size={18} />
              {sidebarOpen && <span>Logout</span>}
            </div>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* TOPBAR */}
        <header className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setSidebarOpen((s) => !s)}>
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">
                {active.charAt(0).toUpperCase() + active.slice(1)}
              </h2>
              <div className="text-sm text-gray-500">• Quick overview</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <div className="relative hidden sm:block">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tx / id / amount"
                className="pl-9 pr-3 py-2 rounded-lg border w-72 text-sm"
              />
              <Search className="absolute left-2 top-2 text-gray-400" size={16} />
            </div>

            {/* PROFILE DROPDOWN */}
            <div className="flex items-center gap-3 relative">
              <Bell size={18} className="cursor-pointer" />

              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setProfileOpen((p) => !p)}
              >
                <User size={18} />
                <div className="hidden sm:block text-sm text-gray-700">You</div>
              </div>

              {profileOpen && (
                <div className="absolute right-0 mt-12 w-40 bg-white border rounded shadow p-2 text-sm">
                  <div className="py-1 px-2 hover:bg-gray-50 rounded cursor-pointer">Profile</div>
                  <div className="py-1 px-2 hover:bg-gray-50 rounded cursor-pointer">Settings</div>
                  <div className="py-1 px-2 hover:bg-gray-50 rounded cursor-pointer text-red-600">Logout</div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN PAGE CONTENT */}
        <main className="p-6">
          {active === "dashboard" && (
            <DashboardView
              merchant={merchant}
              revenueSeries={revenueSeries}
              transactions={filteredTransactions}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          )}

          {active === "pos" && <POSPage />}
          {active === "coupons" && <Coupons />}
          {active === "transactions" && (
            <TransactionsView transactions={filteredTransactions} />
          )}
          {active === "settlements" && <SettlementsView />}
          {active === "analytics" && <AnalyticsView data={revenueSeries} />}
          {active === "settings" && <SettingsView merchant={merchant} />}
        </main>
      </div>
    </div>
  );
}
