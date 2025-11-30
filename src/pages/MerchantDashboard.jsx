import { useEffect, useState, useContext, useMemo } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import rekerPayLogo from "../assets/Reker-logo.png";
import Coupons from "./Coupons"
import POSPage from "../pages/POSPage"

import {
  Menu, User, Home, CreditCard, Ticket, BarChart2, LogOut,
  ChevronLeft, Settings, Bell, QrCode, Search, CheckCircle,
  Receipt, TrendingUp, List
} from "lucide-react";

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from "recharts";

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
    `flex items-center gap-3 cursor-pointer p-2 rounded-lg transition ${active === k
      ? "bg-green-50 border-l-4 border-green-600 text-green-700"
      : "text-gray-700 hover:bg-green-50"
    }`;

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"
          } bg-white shadow-lg h-screen p-4 fixed left-0 top-0 border-r transition-all duration-300 z-40`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div>
              <img src={rekerPayLogo} className="h-12" alt="RekerPay" />
            </div>
            {sidebarOpen && <h1 className="text-lg font-extrabold bg-gradient-to-r from-yellow-500 to-green-600 bg-clip-text text-transparent tracking-wide">RekerPay</h1>}
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
            <div key={n.key} className={menuClass(n.key)} onClick={() => setActive(n.key)}>
              {n.icon}
              {sidebarOpen && <span className="font-medium">{n.label}</span>}
            </div>
          ))}

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
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"
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
                {active === "dashboard"
                  ? "Merchant Dashboard"
                  : active.charAt(0).toUpperCase() + active.slice(1)}
              </h2>
              <div className="text-sm text-gray-500">• Quick overview</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tx / id / amount"
                className="pl-9 pr-3 py-2 rounded-lg border w-72 text-sm"
              />
              <Search className="absolute left-2 top-2 text-gray-400" size={16} />
            </div>

            <div className="flex items-center gap-3 relative">
              <div className="relative cursor-pointer">
                <Bell size={18} />
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
                  3
                </span>
              </div>

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
                  <div className="py-1 px-2 hover:bg-gray-50 rounded cursor-pointer text-red-600">
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN PAGE AREA */}
        {/* <main className="p-6">
          {active === "dashboard" && (
            <DashboardView
              merchant={merchant}
              revenueSeries={revenueSeries}
              transactions={filteredTransactions}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          )}

          {active === "pos" && <PosView />}
          {active === "coupons" && <CouponsView />}
          {active === "transactions" && (
            <TransactionsView transactions={filteredTransactions} />
          )}
          {active === "settlements" && <SettlementsView />}
          {active === "analytics" && <AnalyticsView data={revenueSeries} />}
          {active === "settings" && <SettingsView merchant={merchant} />}
        </main> */}
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

          {active === "coupons" && <Coupons />} {/* <- Add this line */}

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

/* ---------------------------------------------------------
   DASHBOARD VIEW
--------------------------------------------------------- */

function DashboardView({ merchant, revenueSeries, transactions, dateRange, setDateRange }) {
  return (
    <>
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold">
            {merchant ? merchant.business_name : "Merchant Name"}
          </h3>
          <p className="text-sm text-gray-500">
            {merchant ? `Phone: ${merchant.phone}` : "Phone: —"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Export CSV
          </button>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <KpiCard title="Today's Earnings" value={"₹" + (Math.floor(Math.random() * 8000) + 200)} />
        <KpiCard title="Transactions" value={Math.floor(Math.random() * 120)} />
        <KpiCard title="Success Rate" value={Math.floor(80 + Math.random() * 18) + "%"} />
        <KpiCard title="Pending Settlements" value={"₹" + (Math.floor(Math.random() * 20000))} />
      </section>

      {/* CHARTS + FEED */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART */}
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Revenue (last 7 days)</h4>
            <div className="text-sm text-gray-500">Amounts in ₹</div>
          </div>

          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot />
                <Line type="monotone" dataKey="tx" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ACTIVITY FEED */}
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-3">Live Activity</h4>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <CheckCircle size={16} className="text-green-600" />
              <div>
                <div className="font-medium">Payment of ₹1,499 received</div>
                <div className="text-xs text-gray-500">15 minutes ago</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Receipt size={16} className="text-red-500" />
              <div>
                <div className="font-medium">Failed payment T-1002</div>
                <div className="text-xs text-gray-500">40 minutes ago</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Ticket size={16} className="text-blue-500" />
              <div>
                <div className="font-medium">Coupon ABC redeemed</div>
                <div className="text-xs text-gray-500">2 hours ago</div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* TRANSACTIONS */}
      <section className="mt-6 bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Recent Transactions</h4>
          <div className="text-sm text-gray-500">Showing latest 5</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="py-2">Txn ID</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No transactions
                  </td>
                </tr>
              )}

              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="py-3 font-medium">{t.id}</td>
                  <td>₹{t.amount}</td>
                  <td>{t.method}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${t.status === "SUCCESS"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                        }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="text-gray-500">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

/* KPICARD */
function KpiCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      <div className="text-xs text-gray-400 mt-2">Compared to last period</div>
    </div>
  );
}

/* POS VIEW */
function PosView() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Point of Sale (POS)</h3>
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-600">Generate QR or collect payment link quickly.</p>
        <div className="mt-4 flex gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <QrCode /> Generate QR
          </button>
          <button className="bg-gray-100 px-4 py-2 rounded">Create Paylink</button>
        </div>
      </div>
    </div>
  );
}

/* COUPONS VIEW */
function CouponsView() {
  return (
    <div>
      <h3 className="text-xl font-semibold">Coupons</h3>
      <div className="bg-white p-4 rounded shadow mt-4">
        <p className="text-sm text-gray-600">Create and manage coupons.</p>
      </div>
    </div>
  );
}

/* TX VIEW */
function TransactionsView({ transactions }) {
  return (
    <div>
      <h3 className="text-xl font-semibold">Transactions</h3>
      <div className="bg-white p-4 rounded shadow mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-500">
            <tr>
              <th className="py-2">Txn ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {transactions.map((t) => (
              <tr key={t.id}>
                <td className="py-3 font-medium">{t.id}</td>
                <td>₹{t.amount}</td>
                <td>{t.method}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${t.status === "SUCCESS"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                      }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="text-gray-500">{t.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* SETTLEMENTS */
function SettlementsView() {
  const items = [
    { id: "S-001", amount: 15000, date: "2025-11-25", status: "Pending" },
    { id: "S-002", amount: 5400, date: "2025-11-24", status: "Paid" },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold">Settlements</h3>

      <div className="bg-white p-4 rounded shadow mt-4">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-500">
            <tr>
              <th>Settle ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {items.map((i) => (
              <tr key={i.id}>
                <td className="py-3">{i.id}</td>
                <td>₹{i.amount}</td>
                <td>{i.date}</td>
                <td
                  className={`text-sm ${i.status === "Paid" ? "text-green-600" : "text-yellow-600"
                    }`}
                >
                  {i.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ANALYTICS */
function AnalyticsView({ data }) {
  return (
    <div>
      <h3 className="text-xl font-semibold">Analytics</h3>

      <div className="bg-white p-4 rounded shadow mt-4">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* SETTINGS */
function SettingsView({ merchant }) {
  return (
    <div>
      <h3 className="text-xl font-semibold">Settings</h3>

      <div className="bg-white p-4 rounded shadow mt-4 space-y-3">
        <p className="text-sm">Business Name: {merchant?.business_name}</p>
        <p className="text-sm">Phone: {merchant?.phone}</p>
        <p className="text-sm text-gray-500">More settings coming soon…</p>
      </div>
    </div>
  );
}
