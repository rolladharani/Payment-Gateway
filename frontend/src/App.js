// // import { useState } from "react";
// // import { setAuthHeaders } from "./api/client";
// // import { fetchDashboardStats, fetchPayments } from "./api/dashboard";

// // function App() {
// //   const [apiKey, setApiKey] = useState("");
// //   const [apiSecret, setApiSecret] = useState("");
// //   const [loggedIn, setLoggedIn] = useState(false);

// //   const [stats, setStats] = useState(null);
// //   const [payments, setPayments] = useState([]);

// //   const login = async () => {
// //     if (!apiKey || !apiSecret) {
// //       alert("Please enter API Key and Secret");
// //       return;
// //     }

// //     setAuthHeaders(apiKey, apiSecret);

// //     try {
// //       const statsRes = await fetchDashboardStats();
// //       const paymentsRes = await fetchPayments();

// //       setStats(statsRes);
// //       setPayments(paymentsRes.items);
// //       setLoggedIn(true);
// //     } catch (err) {
// //       alert("Invalid API credentials");
// //     }
// //   };

// //   // 🔐 LOGIN SCREEN
// //   if (!loggedIn) {
// //     return (
// //       <div style={{ padding: 40 }}>
// //         <h1>Merchant Login</h1>

// //         <div style={{ marginBottom: 10 }}>
// //           <input
// //             placeholder="API Key"
// //             value={apiKey}
// //             onChange={(e) => setApiKey(e.target.value)}
// //             data-test-id="login-api-key"
// //           />
// //         </div>

// //         <div style={{ marginBottom: 10 }}>
// //           <input
// //             placeholder="API Secret"
// //             value={apiSecret}
// //             onChange={(e) => setApiSecret(e.target.value)}
// //             data-test-id="login-api-secret"
// //           />
// //         </div>

// //         <button onClick={login} data-test-id="login-button">
// //           Login
// //         </button>
// //       </div>
// //     );
// //   }

// //   // 📊 DASHBOARD
// //   return (
// //     <div style={{ padding: 20 }}>
// //       <h1>Merchant Dashboard</h1>

// //       {stats && (
// //         <div style={{ marginBottom: 30 }}>
// //           <p data-test-id="total-transactions">
// //             Total Transactions: {stats.total_transactions}
// //           </p>
// //           <p data-test-id="total-amount">
// //             Total Amount: ₹{stats.total_amount}
// //           </p>
// //           <p data-test-id="success-rate">
// //             Success Rate: {stats.success_rate}%
// //           </p>
// //         </div>
// //       )}

// //       <h2>Payments</h2>

// //       <table border="1" cellPadding="8">
// //         <thead>
// //           <tr>
// //             <th>Payment ID</th>
// //             <th>Order ID</th>
// //             <th>Amount</th>
// //             <th>Method</th>
// //             <th>Status</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {payments.map((p) => (
// //             <tr key={p.id} data-test-id="payment-row">
// //               <td>{p.id}</td>
// //               <td>{p.order_id}</td>
// //               <td>₹{p.amount}</td>
// //               <td>{p.method}</td>
// //               <td>{p.status}</td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // }

// // export default App;
// // import { useState } from "react";
// // import Login from "./pages/Login";
// // import Dashboard from "./pages/Dashboard";

// // function App() {
// //   const [loggedIn, setLoggedIn] = useState(false);

// //   return loggedIn ? (
// //     <Dashboard />
// //   ) : (
// //     <Login onLogin={() => setLoggedIn(true)} />
// //   );
// // }

// // export default App;
// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Transactions from "./pages/Payments";

// function App() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//       <Route path="/dashboard/transactions" element={<Transactions />} />

//       {/* default */}
//       <Route path="*" element={<Navigate to="/login" />} />
//     </Routes>
//   );
// }

// export default App;
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";

const isLoggedIn = () =>
  localStorage.getItem("apiKey") &&
  localStorage.getItem("apiSecret");

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />}
      />

      <Route
        path="/dashboard/transactions"
        element={isLoggedIn() ? <Payments /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;

