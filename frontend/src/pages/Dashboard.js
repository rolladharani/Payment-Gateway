// // import { useEffect, useState } from "react";
// // import api from "../api/client";

// // export default function Dashboard() {
// //   const [merchant, setMerchant] = useState(null);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     api
// //       .get("/merchants/me")
// //       .then((res) => setMerchant(res.data))
// //       .catch(() => setError("Invalid API credentials"));
// //   }, []);

// //   if (error) {
// //     return <div>{error}</div>;
// //   }

// //   if (!merchant) {
// //     return <div>Loading...</div>;
// //   }

// //   return (
// //     <div data-test-id="dashboard-page">
// //       <h2>Dashboard</h2>

// //       <p data-test-id="merchant-id">
// //         <b>Merchant ID:</b> {merchant.id}
// //       </p>

// //       <p data-test-id="merchant-api-key">
// //         <b>API Key:</b> {merchant.api_key}
// //       </p>

// //       <p data-test-id="merchant-api-secret">
// //         <b>API Secret:</b> {merchant.api_secret}
// //       </p>
// //     </div>
// //   );
// // }
// import { useEffect, useState } from "react";
// import api from "../api/client";
// import Payments from "./Payments";

// export default function Dashboard() {
//   const [merchant, setMerchant] = useState(null);
//   const [stats, setStats] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     // Fetch merchant info
//     api
//       .get("/merchants/me")
//       .then((res) => setMerchant(res.data))
//       .catch(() => setError("Invalid API credentials"));

//     // Fetch dashboard stats
//     api
//       .get("/stats/dashboard")
//       .then((res) => setStats(res.data))
//       .catch(() => {});
//   }, []);

//   if (error) return <div>{error}</div>;
//   if (!merchant || !stats) return <div>Loading...</div>;

//   return (
//     <div data-test-id="dashboard">
//       <h1>Merchant Dashboard</h1>

//       {/* API Credentials */}
//       <div data-test-id="api-credentials">
//         <div>
//           <label>API Key</label>
//           <span data-test-id="api-key">{merchant.api_key}</span>
//         </div>

//         <div>
//           <label>API Secret</label>
//           <span data-test-id="api-secret">{merchant.api_secret}</span>
//         </div>
//       </div>

//       {/* Stats */}
//       <div data-test-id="stats-container" style={{ marginTop: 20 }}>
//         <div data-test-id="total-transactions">
//           Total Transactions: {stats.total_transactions}
//         </div>

//         <div data-test-id="total-amount">
//           ₹{stats.total_amount}
//         </div>

//         <div data-test-id="success-rate">
//           {stats.success_rate}%
//         </div>
//       </div>
//       <h2>Transactions</h2>
// <Payments />
//     </div>
//   );
// }
// import { useEffect, useState } from "react";
// import api from "../api/client";

// export default function Dashboard() {
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     api.get("/stats/dashboard").then((res) => setStats(res.data));
//   }, []);

//   if (!stats) return <div>Loading...</div>;

//   return (
//     <div data-test-id="dashboard">
//       <h2>Dashboard</h2>

//       <div data-test-id="api-credentials">
//         <div>
//           <label>API Key</label>
//           <span data-test-id="api-key">key_test_abc123</span>
//         </div>

//         <div>
//           <label>API Secret</label>
//           <span data-test-id="api-secret">secret_test_xyz789</span>
//         </div>
//       </div>

//       <div data-test-id="stats-container">
//         <div data-test-id="total-transactions">
//           {stats.total_transactions}
//         </div>

//         <div data-test-id="total-amount">
//           ₹{stats.total_amount}
//         </div>

//         <div data-test-id="success-rate">
//           {stats.success_rate}%
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import api from "../api/client";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/stats/dashboard")
      .then((res) => setStats(res.data))
      .catch(() => {
        alert("Unauthorized – please login again");
        window.location.href = "/login";
      });
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div data-test-id="dashboard">
      <h1>Merchant Dashboard</h1>

      <div data-test-id="stats-container">
        <div data-test-id="total-transactions">
          {stats.total_transactions}
        </div>

        <div data-test-id="total-amount">
          ₹{stats.total_amount}
        </div>

        <div data-test-id="success-rate">
          {stats.success_rate}%
        </div>
      </div>
    </div>
  );
}
