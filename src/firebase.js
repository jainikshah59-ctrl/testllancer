// The audit says Firebase is loaded from gstatic, and I set it on the window object in index.html
export const db = window.__db;
export const auth = window.__auth;
export const fsOps = window.__fsOps;
export const authOps = window.__authOps;
