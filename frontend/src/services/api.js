import axios from 'axios';

const API_BASE = '/api';

export const getSystemStatus = async () => {
  const res = await axios.get(`${API_BASE}/status`);
  return res.data;
};

export const getActivityLogs = async (limit = 50) => {
  const res = await axios.get(`${API_BASE}/logs?limit=${limit}`);
  return res.data;
};

export const clearActivityLogs = async () => {
  const res = await axios.delete(`${API_BASE}/logs`);
  return res.data;
};

export const getAnalyticsData = async () => {
  const res = await axios.get(`${API_BASE}/analytics`);
  return res.data;
};

export const getSystemSettings = async () => {
  const res = await axios.get(`${API_BASE}/settings`);
  return res.data;
};

export const updateSystemSettings = async (settings) => {
  const res = await axios.post(`${API_BASE}/settings`, settings);
  return res.data;
};

export const controlCamera = async (action) => {
  const res = await axios.post(`${API_BASE}/control/camera`, { action });
  return res.data;
};

export const launchApp = async (appName) => {
  const res = await axios.post(`${API_BASE}/control/app`, { app_name: appName });
  return res.data;
};

export const controlIoTDevice = async (device, action) => {
  const res = await axios.post(`${API_BASE}/control/iot`, { device, action });
  return res.data;
};

export const controlPresentation = async (action) => {
  const res = await axios.post(`${API_BASE}/control/presentation`, { action });
  return res.data;
};

export const toggleFeature = async (feature, enabled) => {
  const res = await axios.post(`${API_BASE}/control/toggles`, { feature, enabled });
  return res.data;
};
