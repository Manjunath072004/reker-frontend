# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.






# ⚛️ Reker Frontend (React + Vite + Tailwind)

This is the frontend for the **Reker Merchant Dashboard & POS System**, built using **React**, **Vite**, and **TailwindCSS**.  
It connects to the Django backend and provides:

- Merchant Login
- Signup + OTP Verification
- Merchant Dashboard
- Coupons (verify, apply, list)
- Merchant registration
- POS payment module
- Protected routes with JWT
- Fully modular UI pages

---

# 🚀 Tech Stack

| Feature | Technology |
|--------|------------|
| UI Framework | React (Vite) |
| Styling | TailwindCSS |
| Routing | React Router v6 |
| State Management | React Context API |
| Auth | JWT + Local Storage |
| API Calls | Axios |
| Build Tool | Vite |

---

# 📂 Folder Structure

```
reker-frontend/
│
├── src/
│   ├── api/                # Axios API wrappers
│   │   ├── auth.js
│   │   ├── merchants.js
│   │   └── coupons.js
│   │
│   ├── pages/              # UI Pages
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── OtpVerify.jsx
│   │   ├── MerchantDashboard.jsx
│   │   ├── CreateMerchant.jsx
│   │   ├── MerchantList.jsx
│   │   ├── MerchantProfile.jsx
│   │   ├── VerifyCoupon.jsx
│   │   ├── ApplyCoupon.jsx
│   │   ├── CouponList.jsx
│   │   └── PosPage.jsx
│   │
│   ├── context/            # Auth Context (JWT handler)
│   │   └── AuthContext.jsx
│   │
│   ├── components/         # Reusable UI components (optional)
│   │
│   ├── App.jsx             # Routes + Providers
│   └── main.jsx
│
├── public/
├── index.html
├── package.json
└── README.md
```

---

# 🛠️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/<your-username>/reker-frontend.git
cd reker-frontend
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Setup Environment Variables

Create a file:

```
.env
```

Add:

```
VITE_API_URL=http://localhost:8000/api
```

All API files use:

```js
const API = import.meta.env.VITE_API_URL;
```

---

# ▶️ Run Frontend

```bash
npm run dev
```

Frontend will start at:

```
http://localhost:5173
```

---

# 🔐 Authentication Flow

### 1. Signup
`/signup`

User enters:
- Full Name  
- Phone  
- Email  
- Password  

API:  
`POST /api/auth/signup/`  
Returns: *OTP Sent*

---

### 2. OTP Verification
`/otp-verify`

API:  
`POST /api/auth/verify-otp/`

If successful → redirect to `/login`.

---

### 3. Login
`/login`

API:  
`POST /api/auth/login/`

Returns:
- `access_token`
- `refresh_token`
- `user`

The access token is stored in:

```
localStorage.token
```

---

### 4. Auth Context

`AuthContext.jsx` handles:

- Saving JWT token
- Auto-attaching token to requests
- Logout cleaning tokens

---

# 📌 Protected Routes

Pages like Dashboard, Merchants, Coupons, POS are protected.

Example:

```jsx
<Route
  path="/merchant-dashboard"
  element={ user ? <MerchantDashboard /> : <Navigate to="/login" /> }
/>
```

---

# 📦 API Integration

All API calls are in `/src/api/`.

### Example: Auth API

```js
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const signup = (data) => axios.post(`${API}/auth/signup/`, data);
export const login = (data) => axios.post(`${API}/auth/login/`, data);
export const verifyOtp = (data) => axios.post(`${API}/auth/verify-otp/`, data);
```

---

# 🟦 Merchant Module (Frontend)

### Included Pages
- `CreateMerchant.jsx`
- `MerchantList.jsx`
- `MerchantProfile.jsx`
- `MerchantDashboard.jsx`

### Main Endpoints
- `POST /api/merchants/create/`
- `GET /api/merchants/profile/`
- `GET /api/merchants/list/`

---

# 🟩 Coupon Module (Frontend)

### Included Pages
- `VerifyCoupon.jsx`
- `ApplyCoupon.jsx`
- `CouponList.jsx`

### API Endpoints
- `POST /api/coupons/verify/`
- `POST /api/coupons/apply/`
- `GET /api/coupons/list/`

Uses safe `Decimal` calculations from backend.

---

# 🟧 POS / Payments Module (Frontend)

### Included Page
- `PosPage.jsx`

Flow:
1. Enter amount  
2. (Optional) Apply coupon  
3. Final amount calculated  
4. Generate Payment QR (coming soon)

---

# 📌 Routing Setup

Your `App.jsx` includes:

```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/otp-verify" element={<OtpVerify />} />

  <Route path="/merchant-dashboard" element={<MerchantDashboard />} />

  <Route path="/merchant/create" element={<CreateMerchant />} />
  <Route path="/merchant/list" element={<MerchantList />} />
  <Route path="/merchant/profile" element={<MerchantProfile />} />

  <Route path="/coupons/verify" element={<VerifyCoupon />} />
  <Route path="/coupons/apply" element={<ApplyCoupon />} />
  <Route path="/coupons/list" element={<CouponList />} />

  <Route path="/pos" element={<PosPage />} />
</Routes>
```

---

# 🎨 UI Styling

You can enable TailwindCSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Add to `tailwind.config.js`:

```js
content: ["./index.html", "./src/**/*.{js,jsx}"],
```

---

# 🗂️ .gitignore

```
node_modules/
dist/
.env
.vscode/
```

---

# 📈 Future Enhancements

- Dashboard charts
- Real-time transactions (WebSockets)
- Notifications module
- Merchant settlement screens
- Global UI components (sidebar, navbar)
- Role-based access control
