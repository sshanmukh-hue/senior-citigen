# ElderSafe — Fall Detection & Emergency SOS App

A working prototype of the ElderSafe app (matches your CSP design mockup: Splash,
Login, Register, Home Dashboard, Fall Detected, SOS Alert, Location, Alert History,
Emergency Contact, and Settings screens).

This is built as a **web app** (HTML, CSS, JavaScript) rather than a native Android/iOS
app. That was a deliberate choice for a zero-knowledge starting point: it needs **no
installs, no SDKs, no build tools** — just a web browser — so you can get it running
today and demo it end-to-end for your evaluation.

---

## 1. What it does

- Register a new account → data is saved in the browser (`localStorage`), acting as
  a simple database.
- Log in / log out.
- Home dashboard: toggle Fall Detection on/off, see GPS/battery status, see your
  emergency contact, and a big SOS button.
- **Simulate Fall Detected**: shows the 30-second countdown screen from the mockup.
  If you don't tap "I'm OK" in time, it auto-sends an SOS.
- SOS alert screen: shows the contact notified, timestamp, and your live location
  on an embedded map (uses the browser's real GPS if you allow it, otherwise falls
  back to a demo location so it still works).
- Location screen: live map + coordinates.
- Alert History: every SOS/fall event you trigger is logged and listed here.
- Emergency Contact: add/edit your contact.
- Settings: change fall-detection toggle, countdown duration, notifications, log out.

There is **no real backend server** and **no real fall-sensor / SMS integration** —
everything is simulated in the browser. This is normal and expected for a first
prototype / CSP demo. Section 5 explains how you'd extend it to a real backend later.

---

## 2. Requirements

You only need:

- A computer with any modern web browser (Chrome, Edge, Firefox).
- (Optional, recommended) [VS Code](https://code.visualstudio.com/) with the
  **"Live Server"** extension — makes running it a one-click affair.
- No Node.js, no npm, no database install required to run the prototype.

---

## 3. Folder structure

```
ElderSafe-App/
│
├── index.html            → Screen 1: Splash screen
├── login.html             → Screen 2: Login
├── register.html          → Screen 3: Create Account
├── dashboard.html          → Screen 4: Home Dashboard
├── fall-detected.html      → Screen 5: Fall Detected (30s countdown)
├── sos-sent.html            → Screen 6: Emergency Alert Sent
├── location.html            → Screen 7: Current Location
├── history.html               → Screen 8: Alert History
├── contact.html                → Screen 9: Emergency Contact
├── settings.html                → Screen 10: Settings
│
├── css/
│   └── style.css          → All styling (shared across every screen)
│
├── js/
│   └── app.js             → All app logic: fake login/register database,
│                              contacts, settings, alert history, location helper
│
├── assets/                 → (empty — put any images/icons you want to add here)
│
└── README.md               → This file
```

Every `.html` file is one screen. They link to each other with normal `<a href="...">`
links and `window.location.href = "..."` in JavaScript, the same way pages navigate
in any website.

---

## 4. How to run it

### Easiest way — just open the file
1. Unzip the project folder.
2. Double-click `index.html`. It opens in your default browser.
3. Click through: Splash → Get Started → Register → fill the form → you're on the
   Home Dashboard.

That's it — no installation needed.

### Recommended way — Live Server (avoids browser file-permission quirks, e.g. for GPS)
1. Install [VS Code](https://code.visualstudio.com/).
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions panel.
3. Open the `ElderSafe-App` folder in VS Code (`File → Open Folder`).
4. Right-click `index.html` → **"Open with Live Server"**.
5. Your browser opens `http://127.0.0.1:5500/index.html` and the app runs there.

### Alternative — Python's built-in server (if you have Python installed)
```bash
cd ElderSafe-App
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

> **Note on Location/GPS:** browsers only allow real GPS access over `https://` or
> `localhost`/`127.0.0.1`. Opening the file directly (`file://...`) or running Live
> Server both work; if GPS permission is denied, the app automatically falls back to
> a demo coordinate (16.1234, 80.5678 — same as in your mockup) so nothing breaks.

---

## 5. How data is stored (and how to explain it in your viva/demo)

Everything is saved in the browser's `localStorage`, which is a simple built-in
key-value store every browser has. Look inside `js/app.js` to see:

- `es_users` — list of registered accounts
- `es_current_user` — who is currently logged in
- `es_contacts_<email>` — that user's emergency contact
- `es_settings_<email>` — that user's app settings
- `es_alerts_<email>` — that user's alert/SOS history

This means: **no server, no database installation, but the data does persist**
between visits on the same browser (until you clear browser data). This is exactly
how many "local-first" prototypes and MVPs are built before a real backend is added.

### If your project needs a *real* backend later
The natural next step (for a fuller CSP submission or final-year project) is to
replace the functions in `js/app.js` (`saveUser`, `findUser`, `addAlert`, etc.) with
real HTTP calls to a backend, for example:
- **Firebase** (Firestore + Firebase Auth) — easiest, no server code needed, free tier.
- **Node.js + Express + MongoDB** — classic full-stack setup.
- Real SMS/alert sending would need a service like Twilio.
- Real fall detection on a phone would need the device's accelerometer (via a native
  app in Android/Kotlin or Flutter) — a website in a browser cannot reliably access
  raw accelerometer data the way a phone sensor app can.

You can mention this "Phase 2" plan in your project report even if you only submit
the working prototype — it shows you understand the difference between a prototype
and a production system, which examiners like to see.

---

## 6. Quick customization tips

- Colors/theme: edit the `:root { ... }` variables at the top of `css/style.css`.
- App name/text: search and replace "ElderSafe" across the `.html` files.
- Countdown default: change `countdown: 30` in `js/app.js` (`getSettings` function).
- Demo fallback location: change the numbers in the `fallback` object inside
  `getLocation()` in `js/app.js`.
