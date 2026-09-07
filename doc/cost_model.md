# 💰 SWARM‑SEC Cost Model

This document outlines the Bobcoin spend for each agent in the SWARM‑SEC pipeline.  
The model ensures efficiency, transparency, and budget‑friendly execution.

---

## 📊 Bobcoin Allocation Table

| Stage       | Agent                | Function                                | Coins (Approx.) |
|-------------|----------------------|-----------------------------------------|-----------------|
| Parse       | Parser (Agent 0)     | Generate AST schema                     | 0               |
| Audit       | Auditor (Agent 1)    | Detect vulnerabilities                  | 7–8             |
| Exploit     | Exploit Simulator (Agent 2) | Create failing PoC tests          | 6–7             |
| Refactor    | Refactoring Architect (Agent 3) | Rewrite unsafe code securely | 10–12           |
| Verify      | QA Verifier (Agent 4)| Regression tests + Mermaid diagram       | 4–5             |
| **Total**   |                      |                                         | ~28–32          |

---

## 🧠 Cost Efficiency Strategy
- **Minimal Overhead:** Parser runs at zero cost.  
- **Balanced Spend:** Majority of coins allocated to Refactoring (critical step).  
- **Proof‑Driven:** Exploit Simulator ensures vulnerabilities are real before spending on fixes.  
- **Verification:** QA Verifier uses minimal coins to guarantee correctness and documentation.

---

## 🎯 Key Notes
- Total spend remains under **32 Bobcoins**, making the pipeline cost‑effective.  
- Each agent’s spend is predictable and repeatable across runs.  
- Judges can reproduce the cost breakdown by running `hackathon_pipeline.ipynb`.  
- Documentation ensures transparency for hackathon evaluation.

