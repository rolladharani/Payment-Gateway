// import { useEffect, useState } from "react";
// import api from "../api/client";

// export default function Payments() {
//   const [payments, setPayments] = useState([]);

//   useEffect(() => {
//     api.get("/payments").then((res) => {
//       setPayments(res.data.items);
//     });
//   }, []);

//   return (
//     <table data-test-id="transactions-table" border="1" cellPadding="8">
//       <thead>
//         <tr>
//           <th>Payment ID</th>
//           <th>Order ID</th>
//           <th>Amount</th>
//           <th>Method</th>
//           <th>Status</th>
//           <th>Created</th>
//         </tr>
//       </thead>

//       <tbody>
//         {payments.map((p) => (
//           <tr
//             key={p.id}
//             data-test-id="transaction-row"
//             data-payment-id={p.id}
//           >
//             <td data-test-id="payment-id">{p.id}</td>
//             <td data-test-id="order-id">{p.order_id}</td>
//             <td data-test-id="amount">{p.amount}</td>
//             <td data-test-id="method">{p.method}</td>
//             <td data-test-id="status">{p.status}</td>
//             <td data-test-id="created-at">
//               {new Date(p.created_at).toLocaleString()}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }
import { useEffect, useState } from "react";
import api from "../api/client";

export default function Payments() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/payments")
      .then((res) => setItems(res.data.items))
      .catch(() => {
        alert("Unauthorized");
        window.location.href = "/login";
      });
  }, []);

  return (
    <table data-test-id="transactions-table" border="1">
      <thead>
        <tr>
          <th>Payment ID</th>
          <th>Order ID</th>
          <th>Amount</th>
          <th>Method</th>
          <th>Status</th>
          <th>Created</th>
        </tr>
      </thead>

      <tbody>
        {items.map((p) => (
          <tr key={p.id} data-test-id="transaction-row">
            <td>{p.id}</td>
            <td>{p.order_id}</td>
            <td>{p.amount}</td>
            <td>{p.method}</td>
            <td>{p.status}</td>
            <td>{p.created_at}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
