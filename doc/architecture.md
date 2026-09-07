# 🤖 IBM Bob Agents – SWARM‑SEC

This project integrates IBM Bob multi‑agent system to automate security analysis, exploit generation, refactoring, and verification.  
Each agent has a specific role in the pipeline.

---

## 🧩 Agent 0 – Parser
- **Name:** `ast_swarm.py`
- **Role:** Converts vulnerable source code into an Abstract Syntax Tree (AST) schema (`ast_schema.json`).
- **Purpose:** Provides a structured map of the code for downstream agents.

---

## 🔍 Agent 1 – Auditor
- **Role:** Reads the AST schema and identifies vulnerabilities (e.g., SQL injection, unsafe queries).
- **Output:** Vulnerability report in notebook cell.
- **Bobcoin Cost:** ~7–8 BC

---

## 💣 Agent 2 – Exploit Simulator
- **Role:** Generates failing Proof‑of‑Concept tests to prove vulnerabilities are real.
- **Output:** Pytest files (e.g., `dev/tests/test_exploit_poc.py`).
- **Bobcoin Cost:** ~6–7 BC

---

## 🛠️ Agent 3 – Refactoring Architect
- **Role:** Refactors unsafe code into secure implementations using FastAPI + SQLAlchemy ORM.
- **Output:** Secure code file (e.g., `refactored_code/secure_example.py`).
- **Bobcoin Cost:** ~10–12 BC

---

## ✅ Agent 4 – QA Verifier
- **Role:** Runs regression tests to ensure refactored code is functionally equivalent to original.
- **Output:** Test results + Mermaid.js diagram (`docs/architecture.md`).
- **Bobcoin Cost:** ~4–5 BC

---

## 📊 Bobcoin Spend Summary
| Agent                | Coins |
|-----------------------|-------|
| Auditor              | 7–8   |
| Exploit Simulator    | 6–7   |
| Refactoring Architect| 10–12 |
| QA Verifier          | 4–5   |
| **Total**            | ~28–32|

---

## 🎯 Pipeline Flow
1. **Parse** → `ast_swarm.py` generates AST schema.  
2. **Audit** → Auditor detects vulnerabilities.  
3. **Exploit** → Exploit Simulator creates failing tests.  
4. **Refactor** → Refactoring Architect rewrites unsafe code.  
5. **Verify** → QA Verifier runs tests + generates diagram.

---

## 📝 Notes
- All agents are triggered via Jupyter Notebook (`hackathon_pipeline.ipynb`).  
- Integration is powered by `ibm-bob-sdk`.  
- Judges can reproduce the pipeline by running notebook cells sequentially.

