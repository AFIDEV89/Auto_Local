# 🛡️ AUTOFORM INFRASTRUCTURE MASTER REFERENCE
**VERSION:** 2.1 (FINAL) | **DATE:** APRIL 8, 2026

---

## 🏗️ SYSTEM FLOW (THE "ONE-WAY" GATE)

To ensure total safety, the system is designed as a one-way flow. You work in the **Green Zone**, and changes move to the **Red Zone** only through a secure tunnel.

### **[1] 🟢 THE SAFE ZONE (Your Local Machine)**
*   **Action:** Add products, edit prices, test colors.
*   **Safety:** Your local computer is "locked" to the Staging DB. It cannot touch the live site.
*   **Verification:** View your changes at `localhost:5086` or `localhost:4000`.

### **[2] 🚧 THE GATEKEEPER (The Sync Tunnel)**
*   **Action:** `node src/scripts/syncProducts.cjs`
*   **Function:** Specifically picks "New Products" from the Safe Zone and pushes them to the Live Site.
*   **Safety Check:** Built-in "Dry Run" mode and manual "Are you sure?" confirmation.

### **[3] 🔴 THE LIVE ZONE (Live Website)**
*   **Action:** Serves customers at `autoformindia.com`.
*   **Safety:** This zone is untouchable during development. It only updates when the Sync Gate is opened.

---

## 📋 ENDPOINT & VARIABLE REGISTRY

| CATEGORY | VARIABLE NAME | CURRENT SECURE ENDPOINT |
| :--- | :--- | :--- |
| **LIVE HOST** | `PROD_DATABASE_HOST` | `autoformdb-rollback.cpqpdscnexwq.ap-south-1.rds.amazonaws.com` |
| **LIVE NAME** | `PROD_DATABASE_NAME` | `dev-autoform` |
| **STAGING HOST** | `STAGING_HOST` | `staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com` |
| **STAGING NAME** | `STAGING_NAME` | `dev-autoform` |
| **CREDENTIALS** | `USER / PASS` | `admin` / `Autoform123` |

---

## ⌨️ MASTER CLI CHEATSHEET

> [!TIP]
> **DAILY WORKFLOW:** Start by mirroring Staging to ensure you have the latest prices before adding new ones.

| TASK | FOLDER | COMMAND |
| :--- | :--- | :--- |
| **1. MIRROR LIVE DATA** | Server Root | `node src/scripts/refreshStaging.cjs` |
| **2. CHECK LOGS** | Server Root | `pm2 logs autoformbackend` |
| **3. DRY-RUN SYNC** | Server Root | `node src/scripts/syncProducts.cjs --dry-run` |
| **4. LIVE SYNC** | Server Root | `node src/scripts/syncProducts.cjs` |
| **5. RESTART APP** | Server Root | `pm2 restart autoformbackend --update-env` |

---

## 🚨 THE 3 GOLDEN RULES
1.  **NEVER** change `PROD_` values on your local machine.
2.  **ALWAYS** run a `--dry-run` before a live sync.
3.  **WEEKLY** run the mirror script to keep Staging up to date.
