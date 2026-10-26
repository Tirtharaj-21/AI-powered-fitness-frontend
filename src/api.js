import axios from "axios";
import { store } from "./store/store";

const api = axios.create({ baseURL: "http://localhost:8085/api" });

api.interceptors.request.use((config) => {
  const { token, userId } = store.getState().auth;
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  if (userId) config.headers["X-User-ID"] = userId;
  return config;
});

export const addActivity = (activity) => api.post("/activities", activity);
export const getActivities = () => api.get("/activities");
export const getActivityDetail = (id) =>
  api.get(`/recommendations/activity/${id}`);

export default api;
