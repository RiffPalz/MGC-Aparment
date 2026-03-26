import api from "../config";

/** Fetch payment dashboard data */
export const fetchPaymentDashboard = async () => {
  const res = await api.get("/admin/payments/dashboard");
  return res.data;
};

/** Fetch all payments */
export const fetchAllPayments = async () => {
  const res = await api.get("/admin/payments");
  return res.data;
};

/** Create a new payment */
export const createPayment = async (payload) => {
  const res = await api.post("/admin/payments", payload);
  return res.data;
};

/** Update payment details */
export const updatePayment = async (id, payload) => {
  const res = await api.patch(`/admin/payments/${id}`, payload);
  return res.data;
};

/** Delete a payment */
export const deletePayment = async (id) => {
  const res = await api.delete(`/admin/payments/${id}`);
  return res.data;
};

/** Verify a payment */
export const verifyPayment = async (id) => {
  const res = await api.patch(`/admin/payments/${id}/verify`);
  return res.data;
};

/** Fetch active contracts (for payments) */
export const fetchContractsActive = async () => {
  const res = await api.get("/admin/contracts/dashboard");
  return res.data;
};