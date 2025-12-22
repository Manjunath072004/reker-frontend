import { useEffect, useState, useContext, useMemo } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import rekerPayLogo from "../assets/Reker-logo.png";
import { useNavigate, Link } from "react-router-dom";
import { fetchUnreadCount } from "../api/notifications";

/* Lucide Icons */
import {
  Home, CreditCard, Ticket, BarChart2,
  ChevronLeft, Settings, Search, TrendingUp,
  List, LogOut, Bell
} from "lucide-react";

/* Pages & Components */
import POSPage from "./POSPage";
import Coupons from "./Coupons";
import DashboardView from "../components/DashboardView";
import TransactionsView from "../components/TransactionsView";
import SettlementsView from "../components/SettlementsView";
import AnalyticsView from "../components/AnalyticsView";
import SettingsView from "../components/SettingsView";

export default function MerchantDashboard() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [count, setCount] = useState(0);
  const [merchant, setMerchant] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [active, setActive] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("7d");
  const [transactions, setTransactions] = useState([]);

  const [kpis, setKpis] = useState({
    total_revenue: 0,
    paid_settlements: 0,
    pending_settlements: 0,
  });

  /* ---------------- NOTIFICATIONS ---------------- */
  useEffect(() => {
    fetchUnreadCount().then(res =>
      setCount(res.data.unread_count)
    );
  }, []);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    if (!window.confirm("Logout from RekerPay?")) return;
    logout();
    navigate("/login");
  };

  /* ---------------- KPIs ---------------- */
  useEffect(() => {
    if (!token) return;
    API.get("/analytics/kpis/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setKpis(res.data));
  }, [token]);

  /* ---------------- MERCHANT ---------------- */
  useEffect(() => {
    if (!token) return;
    API.get("/merchants/me/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setMerchant(res.data));
  }, [token]);

  /* ---------------- TRANSACTIONS ---------------- */
  const fetchTransactions = () => {
    if (!token) return;
    API.get("/payments/list/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setTransactions(
        res.data.sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        )
      );
    });
  };

  useEffect(() => {
    fetchTransactions();
    const i = setInterval(fetchTransactions, 5000);
    return () => clearInterval(i);
  }, [token]);

  /* ---------------- FILTER ---------------- */
  const filteredTransactions = useMemo(() => {
    if (!search) return transactions;
    const q = search.toLowerCase();
    return transactions.filter(t =>
      t.id.toLowerCase().includes(q) ||
      String(t.final_amount).includes(q) ||
      t.status.toLowerCase().includes(q)
    );
  }, [search, transactions]);

  /* ---------------- ANALYTICS ---------------- */
  const revenueSeries = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      if (t.status !== "SUCCESS") return;
      const day = new Date(t.created_at).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short",
      });
      if (!map[day]) map[day] = { day, revenue: 0, tx: 0 };
      map[day].revenue += Number(t.final_amount);
      map[day].tx += 1;
    });
    return Object.values(map).slice(-7);
  }, [transactions]);

  /* ---------------- NAV ---------------- */
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
    `flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
     ${active === k
        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-[1.03]"
        : "text-gray-600 hover:bg-green-50 hover:scale-[1.02]"
     }`;

  /* ---------------- UI ---------------- */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">

      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"}
        bg-white/80 backdrop-blur-xl shadow-xl fixed left-0 top-0 h-screen
        p-4 border-r border-white/40 transition-all z-40`}>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={rekerPayLogo} className="h-12" alt="RekerPay" />
            {sidebarOpen && (
              <h1 className="text-xl font-black tracking-wide bg-gradient-to-r from-green-600 to-lime-500 bg-clip-text text-transparent">
                RekerPay
              </h1>
            )}
          </div>
          <button onClick={() => setSidebarOpen(s => !s)}>
            <ChevronLeft className={`${!sidebarOpen && "rotate-180"} transition`} />
          </button>
        </div>

        <nav className="mt-10 space-y-2">
          {navItems.map(n => (
            <div key={n.key}
              className={menuClass(n.key)}
              onClick={() => setActive(n.key)}>
              {n.icon} {sidebarOpen && n.label}
            </div>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-4 right-4 flex items-center gap-3
          p-3 rounded-xl text-red-600 hover:bg-red-50 transition">
          <LogOut size={18} />
          {sidebarOpen && "Logout"}
        </button>
      </aside>

      {/* MAIN */}
      <div className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl
          border-b border-white/40 shadow-sm p-5 flex justify-between items-center">

          <h2 className="text-2xl font-bold capitalize text-gray-800">
            {active}
          </h2>

          <div className="flex items-center gap-6">
            <Link to="/notifications" className="relative">
              <Bell className="text-gray-700 hover:text-green-600 transition" />
              {count > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white
                text-xs px-2 rounded-full">
                  {count}
                </span>
              )}
            </Link>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions"
                className="pl-10 pr-4 py-2 rounded-xl w-72 text-sm
                border border-gray-200 bg-white/80 focus:ring-2
                focus:ring-green-500 outline-none"
              />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-8 space-y-8">
          {active === "dashboard" && (
            <DashboardView
              merchant={merchant}
              transactions={filteredTransactions}
              revenueSeries={revenueSeries}
              dateRange={dateRange}
              setDateRange={setDateRange}
              kpis={kpis}
            />
          )}
          {active === "pos" && <POSPage refreshTransactions={fetchTransactions} />}
          {active === "coupons" && <Coupons />}
          {active === "transactions" && <TransactionsView transactions={filteredTransactions} />}
          {active === "settlements" && <SettlementsView />}
          {active === "analytics" && <AnalyticsView data={revenueSeries} />}
          {active === "settings" && <SettingsView merchant={merchant} />}
        </main>
      </div>
    </div>
  );
}
