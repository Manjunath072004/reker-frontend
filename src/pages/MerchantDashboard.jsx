import { useEffect, useState, useContext, useMemo } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import rekerPayLogo from "../assets/Reker-logo.png";
import { useNavigate } from "react-router-dom";

/* Lucide Icons */
import {
  Menu, Home, CreditCard, Ticket, BarChart2,
  ChevronLeft, Settings, Search, TrendingUp, List, LogOut
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


  const [merchant, setMerchant] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [active, setActive] = useState("dashboard");

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("7d");
  const [transactions, setTransactions] = useState([]);

  const handleLogout = () => {
    const ok = window.confirm("Are you sure you want to logout?");
    if (!ok) return;

    logout();               // clears token/context
    navigate("/login");     // redirect to login
  };


  const [kpis, setKpis] = useState({
    total_revenue: 0,
    paid_settlements: 0,
    pending_settlements: 0,
  });


  const fetchKpis = () => {
    if (!token) return;

    API.get("/analytics/kpis/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setKpis(res.data))
      .catch((err) => console.error("KPI fetch failed:", err));
  };

  useEffect(() => {
    fetchKpis();
  }, [token]);


  /* ---------------- FETCH MERCHANT ---------------- */
  useEffect(() => {
    if (!token) return;

    API.get("/merchants/me/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setMerchant(res.data))
      .catch(err => console.error(err));
  }, [token]);

  /* ---------------- FETCH TRANSACTIONS ---------------- */
  const fetchTransactions = () => {
    if (!token) return;

    API.get("/payments/list/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setTransactions(sorted);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchTransactions();
    const i = setInterval(fetchTransactions, 5000);
    return () => clearInterval(i);
  }, [token]);

  /* ---------------- FILTER TRANSACTIONS ---------------- */
  const filteredTransactions = useMemo(() => {
    if (!search) return transactions;
    const q = search.toLowerCase();
    return transactions.filter(t =>
      t.id.toLowerCase().includes(q) ||
      String(t.final_amount).includes(q) ||
      t.status.toLowerCase().includes(q)
    );
  }, [search, transactions]);

  /* ---------------- ANALYTICS DATA (IMPORTANT FIX) ---------------- */
  const revenueSeries = useMemo(() => {
    const map = {};

    transactions.forEach(t => {
      if (t.status !== "SUCCESS") return;

      const day = new Date(t.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

      if (!map[day]) {
        map[day] = { day, revenue: 0, tx: 0 };
      }

      map[day].revenue += Number(t.final_amount);
      map[day].tx += 1;
    });

    return Object.values(map).slice(-7);
  }, [transactions]);

  /* ---------------- SIDEBAR NAV ---------------- */
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
    `flex items-center gap-3 cursor-pointer p-2 rounded-lg transition ${active === k
      ? "bg-green-50 border-l-4 border-green-600 text-green-700"
      : "text-gray-700 hover:bg-green-50"
    }`;

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg h-screen p-4 fixed left-0 top-0 border-r transition-all duration-300 z-40`}>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <img src={rekerPayLogo} className="h-12" alt="RekerPay" />
            {sidebarOpen && (
              <h1 className="text-lg font-extrabold bg-gradient-to-r from-yellow-500 to-green-600 bg-clip-text text-transparent">
                RekerPay
              </h1>
            )}
          </div>
          <button onClick={() => setSidebarOpen(s => !s)}>
            <ChevronLeft size={20} className={`${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map(n => (
            <div key={n.key} className={menuClass(n.key)} onClick={() => setActive(n.key)}>
              {n.icon} {sidebarOpen && <span>{n.label}</span>}
            </div>
          ))}
        </nav>
        <div className="absolute bottom-6 left-0 w-full px-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <div className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* TOPBAR */}
        <header className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-30">
          <h2 className="text-xl font-semibold capitalize">{active}</h2>

          <div className="relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tx / id / amount"
              className="pl-9 pr-3 py-2 rounded-lg border w-72 text-sm"
            />
            <Search className="absolute left-2 top-2 text-gray-400" size={16} />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-6">
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

          {active === "pos" && <POSPage refreshTransactions={() => {
            fetchTransactions();
            fetchKpis();
          }} />
          }
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
