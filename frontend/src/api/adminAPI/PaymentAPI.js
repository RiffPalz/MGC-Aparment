import api from "../config";

export const fetchPaymentDashboard = () => api.get("/admin/payments/dashboard").then(r => r.data);
export const fetchAllPayments = () => api.get("/admin/payments").then(r => r.data);
export const createPayment = (payload) => api.post("/admin/payments", payload).then(r => r.data);
export const updatePayment = (id, payload) => api.patch(`/admin/payments/${id}`, payload).then(r => r.data);
export const deletePayment = (id) => api.delete(`/admin/payments/${id}`).then(r => r.data);
export const verifyPayment = (id) => api.patch(`/admin/payments/${id}/verify`).then(r => r.data);
export const fetchContractsActive = () => api.get("/admin/contracts/dashboard").then(r => r.data);
