# 🤖 IBM Bob & Cisco Agents – SWARM‑SEC

This document defines the roles, responsibilities, and outputs of each IBM Bob agent integrated into the SWARM‑SEC pipeline.  
The agents work sequentially to detect vulnerabilities, generate exploits, refactor unsafe code, extend authentication features, and verify fixes.

---

## 🧩 Agent 0 – Parser
- **File:** `ast_swarm.py`
- **Function:** Converts vulnerable source code into an Abstract Syntax Tree (AST) schema (`ast_schema.json`).
- **Purpose:** Provides a structured representation of the code for downstream agents.
- **Output:** `ast_schema.json`

---

## 🔍 Agent 1 – Auditor
- **Function:** Reads the AST schema and identifies vulnerabilities (e.g., SQL injection, unsafe queries).
- **Purpose:** Security audit of the codebase.
- **Output:** Vulnerability report (displayed in notebook cell).
- **Bobcoin Cost:** ~7–8 BC

---

## 💣 Agent 2 – Exploit Simulator
- **Function:** Generates failing Proof‑of‑Concept (PoC) tests to prove vulnerabilities are exploitable.
- **Purpose:** Demonstrates real impact of vulnerabilities.
- **Output:** Pytest file → `dev/tests/test_exploit_poc.py`
- **Bobcoin Cost:** ~6–7 BC

---

## 🛠️ Agent 3 – Refactoring Architect
- **Function:** Refactors unsafe code into secure implementations using FastAPI + SQLAlchemy ORM.
- **Purpose:** Eliminates vulnerabilities while preserving functionality.
- **Output:** Secure code → `refactored_code/secure_example.py`
- **Bobcoin Cost:** ~10–12 BC

---

## ✅ Agent 4 – QA Verifier
- **Function:** Runs regression tests to ensure refactored code is functionally equivalent to original.
- **Purpose:** Guarantees correctness and generates updated documentation.
- **Output:** 
  - Test results (all passing)  
  - Mermaid.js diagram → `docs/architecture.md`
- **Bobcoin Cost:** ~4–5 BC

---

## 🌐 Agent 5 – NetSec Cisco Infrastructure Auditor
- **Implementation Files:** `agent5_engine.py` / `app.py` (Flask REST API Gateway)
- **Function:** Ingests raw Cisco IOS running-configurations (`running-config`), evaluates parameters against CCNA hardening baselines (SSH v2, switchport sticky MAC port security, VLAN 99 management isolation, and perimeter NAT/PAT overload), and exposes a REST API for automated compliance checks.
- **Purpose:** Connects software security directly to physical/virtual network infrastructure compliance within the **SWARM-SEC** pipeline.
- **Output:** 
  - Structured Compliance JSON Payload (`/api/v1/audit/cisco`)
  - Automated Cisco IOS CLI Remediation Script Sequence
- **Bobcoin Cost:** **~2–4 BC** *(Hybrid Local Regex AST + Optional LLM Remediation Reasoning)*

---

## 🔐 Auth & DB Lifecycle Utility Modules
*(Local database CRUD operations for authentication system lifecycle management; 0 BC cost.)*

- **Register User (`INSERT`):** Adds new user accounts securely into the database.
- **Password Manager (`UPDATE`):** Updates existing user credentials with secure hashing algorithms.
- **Account Deleter (`DELETE`):** Purges user records to ensure full database lifecycle control.

---

## 📊 Bobcoin Spend Summary
| Agent                 | Coins |
|-----------------------|-------|
| Auditor               | 7–8   |
| Exploit Simulator     | 6–7   |
| Refactoring Architect| 10–12 |
| QA Verifier          | 4–5   |
| **Total (core)**      | ~28–32 |

*(Register, Change Password, Delete are local DB ops, no Bobcoin cost.)*

---

## 🎯 Pipeline Flow
1. **Parse** → `ast_swarm.py` generates AST schema.  
2. **Audit** → Auditor detects vulnerabilities.  
3. **Exploit** → Exploit Simulator creates failing tests.  
4. **Refactor** → Refactoring Architect rewrites unsafe code.  
5. **Verify** → QA Verifier runs tests + generates diagram.  
6. **Register** → Add new user.  
7. **Change Password** → Update credentials.  
8. **Delete User** → Remove account.

---

## 📝 Notes
- All agents are triggered via Jupyter Notebook (`hackathon_pipeline.ipynb`).  
- Integration is powered by `ibm-bob-sdk`.  
- Judges can reproduce the pipeline by running notebook cells sequentially.  
- Extra authentication agents (Register, Change, Delete) demonstrate secure DB lifecycle management.
