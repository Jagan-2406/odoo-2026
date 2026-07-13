# 🌍 EcoSphere — Next-Generation ESG Management Platform

Welcome to **EcoSphere**, an end-to-end Environmental, Social, and Governance (ESG) Management & Compliance platform. EcoSphere enables modern enterprises to persistently log carbon transactions, engage employees through gamified sustainability challenges, enforce corporate policies, and generate comprehensive compliance reports.

---

## 🎯 Our Motto
> **"Pioneering Corporate Transparency & Environmental Action through Event-Driven ESG Ledgers."**

---

## 📈 The Landscape: Existing vs. Proposed Solution

### ❌ The Existing Solution (The Problem)
Traditional corporate ESG tracking is fundamentally broken:
* **Manual Data Silos**: ESG logs are kept in scattered, error-prone 
spreadsheets across human resources, facilities, and fleet management teams.
* **No Persistence or Triggers**: Carbon emission calculations rely on manual conversions with old emission factors, leading to data drift.
* **Lack of Engagement**: Employees have no direct visibility into sustainability goals, making green initiatives feel top-down and unmotivating.
* **Weak Compliance Auditing**: Governance checklists and compliance logs lack cryptographic traceability and strict access permissions.

###  The EcoSphere Solution (Our Proposed Approach)
EcoSphere replaces scattered spreadsheets with a unified, real-time event-driven ledger:
* **Relational ESG Schema**: Persists 22 tables mapping departments, carbon transactions, emission factors, CSR campaigns, policies, and employee stats.
* **Database-Driven Automation**: Utilizes Postgres database triggers (`trg_calc_co2`) to automatically compute Scope 1, 2, and 3 CO2 emissions on row insertion.
* **Gamified CSR & Employee Actions**: Connects employee activities directly to an XP and Badge store. Redemptions check point balances using database-enforced triggers.
* **Bulletproof Security**: Configures Row-Level Security (RLS) policies allowing secure, granular access controls.

---

## 🚀 Key Features

### 1. 🍃 Real-time Carbon Ledger
* **Categorized Emission Scopes**: Presets for Fleet (Scope 1), Facilities/Grid (Scope 2), Business Expense/Travel (Scope 3), and Manufacturing.
* **Auto-conversion Engines**: Select an emission factor, input quantity, and watch the database compute the exact `kg CO2e` instantly.
* **Environmental Goals Tracker**: Visual charts comparing actual vs. target emission limits.

### 2. 🏆 Gamification Store & Achievements
* **Leaderboards**: Real-time ranking of department scores and employee contributions (featuring Komal, darun, Moopi, Jagan, and Nova).
* **Sustainability Challenges**: Accept challenges, track completion rates, and claim rewards.
* **Rewards Catalog**: Spend earned points on eco-friendly merchandise, backed by database triggers that prevent over-redemption or out-of-stock purchases.

### 3. 👥 Social Responsibility (CSR)
* **Volunteering Campaigns**: Public catalogs for reforestation, cleaning, or community drives.
* **Signups Queue**: Interactive volunteer register with pending admin approvals queues.

### 4. ⚖️ Governance & Compliance
* **Policy Sign-offs**: Cryptographically log employee policy acknowledgements (such as Anti-Corruption and Zero-Waste protocols).
* **Audits Tracker**: Displays audit status tags (completed, planned, in-progress).
* **Compliance Ticketing**: Log ticket issues, assign severity parameters (low, medium, high, critical), assign owners, and track due dates.

### 📊 5. Custom Exporters API
* Exporters that call a local Python microservice to package ledger summaries into beautifully styled **PDF reports** and **Excel spreadsheets**.

---

## 🛠️ Method & Technology Stack

* **Frontend**: Vite + React + TypeScript + React Query (TanStack) + TailwindCSS + Lucide Icons.
* **Database (Supabase)**: PostgreSQL, Custom Views (e.g. `v_company_esg_score`), Triggers, and RLS Policies.
* **Backend Exporters**: Python (HTTP server, ReportLab PDF styling, Openpyxl formatting).

---

## 📂 Project Structure

```bash
├── api/                   # Python serverless report generator
├── backend/               # Supabase database schemas & triggers
│   └── database/
│       ├── 01_schema.sql  # Table schema structures
│       ├── 02_triggers.sql# Database views & calculation triggers
│       ├── 03_seed.sql    # Base seed data
│       └── 04_rls_policies.sql # Permissions & storage buckets
├── frontend/              # Vite React TypeScript client application
└── run-local.bat          # Windows batch file local starter
```

---

## ⚡ Quick Start Instructions

To run the application locally, follow these commands in order:

### 1️⃣ Start the Frontend Dev Server
Open a terminal and run the local launcher batch script:
```powershell
c:\Studies\Odooo\run-local.bat
```
*This resolves dependencies and launches Vite on `http://localhost:5173/`.*

### 2️⃣ Start the Python Reports API Server
Open a second terminal window and run:
```powershell
python c:\Studies\Odooo\api\report.py
```
*This launches the PDF and Excel generator on port 3000.*

---

## 🔑 Judge Login / Test Credentials

To test the application locally or in production, you can use the following pre-configured test credentials in the login page (which bypasses the email OTP verification check):

| To inspect this role... | Use this Email | Use this OTP Code |
| :--- | :--- | :--- |
| 🛡️ **Admin (Overall Control)** | `admin@ecosphere.com` | `123456` |
| 👤 **Employee (Emissions & Rewards)** | `employee@ecosphere.com` | `123456` |
| 🔍 **Auditor (Reports & Logs)** | `auditor@ecosphere.com` | `123456` |

*Alternatively, you can sign up with your own active email address to receive a real 6-digit verification code in your inbox.*
