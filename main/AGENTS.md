# 🤖 IBM Bob Agents – SWARM‑SEC

This document defines the roles, responsibilities, and outputs of each IBM Bob agent integrated into the SWARM‑SEC pipeline.  
The agents work sequentially to detect vulnerabilities, generate exploits, refactor unsafe code, and verify fixes.

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

