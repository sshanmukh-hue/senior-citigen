/* ===========================================================
   ElderSafe - app.js
   All data is stored in the browser's localStorage.
   This is a FRONTEND-ONLY prototype: no real backend/server.
   That keeps it simple to run for a college project, while
   still demonstrating the full user flow.
   =========================================================== */

const DB_KEYS = {
  USERS: "es_users",
  CURRENT_USER: "es_current_user",
  CONTACTS: "es_contacts_", // + email
  ALERTS: "es_alerts_",     // + email
  SETTINGS: "es_settings_"  // + email
};

/* ---------- generic storage helpers ---------- */
function getJSON(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}
function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- users / auth ---------- */
function getUsers() {
  return getJSON(DB_KEYS.USERS, []);
}
function saveUser(user) {
  const users = getUsers();
  users.push(user);
  setJSON(DB_KEYS.USERS, users);
}
function findUser(email) {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}
function setCurrentUser(email) {
  localStorage.setItem(DB_KEYS.CURRENT_USER, email);
}
function getCurrentUserEmail() {
  return localStorage.getItem(DB_KEYS.CURRENT_USER);
}
function getCurrentUser() {
  const email = getCurrentUserEmail();
  if (!email) return null;
  return findUser(email);
}
function logout() {
  localStorage.removeItem(DB_KEYS.CURRENT_USER);
  window.location.href = "login.html";
}
/* Redirect to login if nobody is signed in. Call at top of protected pages. */
function requireAuth() {
  if (!getCurrentUserEmail()) {
    window.location.href = "login.html";
  }
}

/* ---------- per-user contacts ---------- */
function getContact() {
  const email = getCurrentUserEmail();
  return getJSON(DB_KEYS.CONTACTS + email, null);
}
function saveContact(contact) {
  const email = getCurrentUserEmail();
  setJSON(DB_KEYS.CONTACTS + email, contact);
}

/* ---------- per-user settings ---------- */
function getSettings() {
  const email = getCurrentUserEmail();
  return getJSON(DB_KEYS.SETTINGS + email, {
    fallDetection: true,
    countdown: 30,
    notifications: true
  });
}
function saveSettings(settings) {
  const email = getCurrentUserEmail();
  setJSON(DB_KEYS.SETTINGS + email, settings);
}

/* ---------- per-user alerts / history ---------- */
function getAlerts() {
  const email = getCurrentUserEmail();
  return getJSON(DB_KEYS.ALERTS + email, []);
}
function addAlert(alert) {
  const email = getCurrentUserEmail();
  const alerts = getAlerts();
  alerts.unshift(alert); // newest first
  setJSON(DB_KEYS.ALERTS + email, alerts);
}

/* ---------- location helper ---------- */
/* Uses the browser Geolocation API. Falls back to a demo location
   (used in the mockup: 16.1234, 80.5678) if permission is denied
   or the device/browser has no GPS, so the demo still works. */
function getLocation(callback) {
  const fallback = { lat: 16.1234, lng: 80.5678, demo: true };
  if (!navigator.geolocation) {
    callback(fallback);
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => callback({ lat: pos.coords.latitude, lng: pos.coords.longitude, demo: false }),
    () => callback(fallback),
    { timeout: 5000 }
  );
}

/* ---------- small formatting helper ---------- */
function formatNow() {
  const d = new Date();
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}
