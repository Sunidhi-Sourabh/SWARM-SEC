# 🗺️ SWARM‑SEC Roadmap
> This document outlines the step‑by‑step roadmap for building and presenting the SWARM‑SEC project with IBM Bob integration at Smart India Hackathon 2026.

---

## 📌 Phase 1 – Repository Setup
- Create branches: `main`, `dev`, `docs`.
- Add base files: `ast_swarm.py`, `AGENTS.md`, `hackathon_pipeline.ipynb`, `README.md`.
- Prepare folder structure for vulnerable code, tests, notebooks, and documentation.

---

## 📌 Phase 2 – Bob Integration
- Install `ibm-bob-sdk`.
- Configure `bobconfig.json` with agent list and Bobcoin budget.
- Add notebook cells to trigger agents:
  - Parse → Audit → Exploit → Refactor → Verify.
- Validate Bob agent execution in VS Code.

---

## 📌 Phase 3 – Documentation
- **README.md** → Overview, Bob integration, usage steps, repo structure, Bobcoin spend table.
- **AGENTS.md** → Roles and responsibilities of each agent.
- **docs/architecture.md** → Mermaid diagram of pipeline flow.
- **docs/cost_model.md** → Bobcoin spend breakdown.
- **docs/roadmap.md** → Hackathon roadmap (this file).

---

## 📌 Phase 4 – Development & Testing
- Add vulnerable code samples in `dev/vulnerable_code/`.
- Generate exploit tests via Bob in `dev/tests/`.
- Refactor unsafe code into secure FastAPI + SQLAlchemy implementations.
- Run regression tests and verify correctness.

---

## 📌 Phase 5 – Final Submission
- Merge stable changes into `main` branch.
- Ensure `hackathon_pipeline.ipynb` runs end‑to‑end with Bob agents.
- Push final repo to GitHub.
- Submit GitHub repo link on Hackathon portal.

---

## 🎯 Milestones
- ✅ Repo skeleton created.  
- ✅ Branches (`main`, `dev`, `docs`) ready.  
- 🔄 Documentation files in progress.  
- 🔄 Bob integration tested in notebooks.  
- ⏳ Final merge + submission pending.

---

## 📝 Notes
- Judges will evaluate based on clarity, automation, and professional documentation.  
- All `.md` files ensure transparency and professional presentation.  
- Bob agents handle code automation; team focuses on structure + documentation.

