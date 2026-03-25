import api from "../config";

export const fetchApplicationRequests = () => api.get("/admin/applications").then(r => r.data);
export const fetchApplicationStats    = () => api.get("/admin/applications/stats").then(r => r.data);
export const deleteApplicationRequest = (id) => api.delete(`/admin/applications/${id}`).then(r => r.data);
