import { useState } from "react";
import api from "./api";

function App() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState("upi");
  const [vpa, setVpa] = useState("");
  const [card, setCard] = useState({
    number: "",
    expiry_month: "",
    expiry_year: "",
    cvv: "",
    holder_name: "",
  });
  const [status, setStatus] = useState("");

  const fetchOrder = async () => {
    const res = await api.get(`/orders/${orderId}/public`);
    setOrder(res.data);
  };

  const pay = async () => {
    setStatus("processing");

    const payload =
      method === "upi"
        ? { order_id: orderId, method, vpa }
        : { order_id: orderId, method, card };

    try {
      const res = await api.post("/payments/public", payload);
      setStatus(res.data.status);
    } catch {
      setStatus("failed");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Checkout</h1>

      {!order && (
        <>
          <input
            placeholder="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            data-test-id="order-id-input"
          />
          <button onClick={fetchOrder} data-test-id="fetch-order-btn">
            Fetch Order
          </button>
        </>
      )}

      {order && (
        <>
          <p data-test-id="order-amount">
            Amount: ₹{order.amount}
          </p>

          <select
            onChange={(e) => setMethod(e.target.value)}
            data-test-id="payment-method"
          >
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>

          {method === "upi" && (
            <input
              placeholder="VPA"
              value={vpa}
              onChange={(e) => setVpa(e.target.value)}
              data-test-id="upi-input"
            />
          )}

          {method === "card" && (
            <>
              <input placeholder="Card Number" onChange={(e) => setCard({ ...card, number: e.target.value })} />
              <input placeholder="MM" onChange={(e) => setCard({ ...card, expiry_month: e.target.value })} />
              <input placeholder="YYYY" onChange={(e) => setCard({ ...card, expiry_year: e.target.value })} />
              <input placeholder="CVV" onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
              <input placeholder="Name" onChange={(e) => setCard({ ...card, holder_name: e.target.value })} />
            </>
          )}

          <button onClick={pay} data-test-id="pay-btn">
            Pay
          </button>

          {status && (
            <p data-test-id="payment-status">
              Status: {status}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
