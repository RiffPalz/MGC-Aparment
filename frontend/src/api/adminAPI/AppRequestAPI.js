import api from "../config";

/** Fetch all application requests */
export const fetchApplicationRequests = async () => {
  const res = await api.get("/admin/applications");
  return res.data;
};

/** Fetch application statistics */
export const fetchApplicationStats = async () => {
  const res = await api.get("/admin/applications/stats");
  return res.data;
};

/** Delete an application request */
export const deleteApplicationRequest = async (id) => {
  const res = await api.delete(`/admin/applications/${id}`);
  return res.data;
};