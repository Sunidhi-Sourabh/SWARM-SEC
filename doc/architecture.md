# 🏗️ SWARM‑SEC Architecture

This document explains the overall architecture and workflow of the SWARM‑SEC project powered by IBM Bob multi‑agent integration.

---

## 📂 Repository Structure

SWARM-SEC/
│
├── main/                     # Stable hackathon-ready branch
│   ├── ast_swarm.py           # Parser script
│   ├── AGENTS.md              # Agent definitions
│   ├── hackathon_pipeline.ipynb  # Main demo notebook
│   ├── README.md              # Project overview
│   └── requirements.txt       # Dependencies
│
├── dev/                       # Development branch
│   ├── vulnerable_code/       # Sample unsafe code
│   ├── tests/                 # Exploit + regression tests
│   └── notebooks/             # Experiment notebooks
│
├── docs/                      # Documentation branch
│   ├── architecture.md        # Architecture diagrams + explanation
│   ├── cost_model.md          # Bobcoin spend breakdown
│   └── roadmap.md             # Hackathon roadmap
└── .gitignore

---

## 🔗 Pipeline Flow

```mermaid
flowchart TD
    A[Source Code] --> B[Agent 0: Parser]
    B --> C[Agent 1: Auditor]
    C --> D[Agent 2: Exploit Simulator]
    D --> E[Agent 3: Refactoring Architect]
    E --> F[Agent 4: QA Verifier]
    F --> G[Verified Secure Code + Docs]
