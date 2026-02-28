import client from "./client";

export const fetchDashboardStats = async () => {
  const res = await client.get("/stats/dashboard");
  return res.data;
};

export const fetchPayments = async () => {
  const res = await client.get("/payments");
  return res.data;
};
