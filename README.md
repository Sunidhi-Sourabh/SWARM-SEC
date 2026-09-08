# 🛡️ PROJECT SWARM-SEC

> **Agentic Multi-Agent Security Remediation & Code Modernization Engine**  

---

## 📌 Executive Summary

Modern software teams lose thousands of hours manually triaging security vulnerabilities, refactoring legacy technical debt, and maintaining unit tests. Feeding entire monolithic codebases directly into Large Language Models (LLMs) burns through credit allocations instantly while frequently yielding hallucinated or breaking code patches.

**PROJECT SWARM-SEC** solves this bottleneck by pairing **zero-token local AST (Abstract Syntax Tree) pre-processing** with a four-agent **IBM Bob Multi-Agent Swarm**. Instead of executing blind AI code generation, SWARM-SEC runs a closed-loop engineering workflow: it extracts structural metadata locally for 0 tokens, generates boundary unit tests to prove vulnerabilities exist, refactors legacy code into async type-safe microservices, and verifies 100% test parity—all within a strict **~28–32 Bobcoin budget**.

---

## 💡 Key Features & Differentiators

* ⚡ **Zero-Token Local AST Parser:** Extracts function signatures, dependencies, and raw SQL queries locally on host machines without consuming LLM credits.
* 🤖 **Collaborative 4-Agent Swarm:** Operates via specialized IBM Bob agents (Auditor, Exploit Simulator, Refactoring Architect, and QA Verifier).
* 🧪 **Test-Driven Vulnerability Verification:** Requires Agent 2 to write a failing `pytest` Proof-of-Concept (PoC) before Agent 3 generates refactored code.
* 🛡️ **SQL Injection Auto-Elimination:** Converts raw SQL string executions into parameterized, type-safe SQLAlchemy 2.0 / Pydantic v2 ORM schemas.
* 📊 **Self-Documenting Codebase:** Automatically renders interactive Mermaid.js architecture diagrams and updates project `README.md` files upon verification.
* 💰 **Bobcoin Optimized:** Full execution pipeline completes under **32 Bobcoins** (well within the 50 Bobcoin hackathon budget limit).

----
## 🔗 Bob Integration

This project uses IBM Bob multi-agent integration:
- Auditor Agent → detects vulnerabilities
- Exploit Simulator Agent → generates failing PoC tests
- Refactoring Architect Agent → rewrites unsafe code using FastAPI + SQLAlchemy
- QA Verifier Agent → runs regression tests and generates Mermaid diagrams

Run the pipeline via `hackathon_pipeline.ipynb`.  
Bob agents are triggered directly from notebook cells using `ibm-bob-sdk`.

---
## System Architecture
```
graph TD
    %% Base Input
    A[Unsecure / Legacy Repository<br/>vulnerable_monolith.py] --> B[STAGE 1: Local AST Parser<br/>ast_swarm.py]

    %% Stage 1
    subgraph Stage_1 [Stage 1: Zero-Token Local Pre-Processing]
        B -->|Parses Functions & Raw SQL| C[(ast_schema.json)]
        style B fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff
        style C fill:#111827,stroke:#10b981,stroke-width:2px,color:#fff
    end

    %% Stage 2 Swarm
    C -->|Passes JSON Metadata| D[STAGE 2: IBM Bob Multi-Agent Swarm]

    subgraph Stage_2 [Stage 2: IBM Bob Agentic Collaboration Loop ~21 Bobcoins]
        D --> E[Agent 1: Security Auditor]
        E -->|Identifies OWASP Flaws| F[Agent 2: Exploit Simulator]
        F -->|Generates Failing pytest PoC| G[Agent 3: Refactoring Architect]
        G -->|Outputs Async FastAPI + SQLAlchemy Code| H[Candidate Patch]
        
        style D fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#fff
        style E fill:#311b92,stroke:#818cf8,color:#fff
        style F fill:#311b92,stroke:#818cf8,color:#fff
        style G fill:#311b92,stroke:#818cf8,color:#fff
    end

    %% Stage 3 Verification
    H --> I[STAGE 3: Test Parity & Verification Suite]

    subgraph Stage_3 [Stage 3: QA Verification & Documentation ~9 Bobcoins]
        I --> J[Agent 4: QA & Regression Verifier]
        J -->|Runs PyTest Suite| K{Tests Pass?}
        K -->|No: Feedback Loop| G
        K -->|Yes| L[Generate Verified PR & Update README.md]
        
        style I fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#fff
        style J fill:#065f46,stroke:#34d399,color:#fff
        style K fill:#047857,stroke:#6ee7b7,color:#fff
        style L fill:#022c22,stroke:#10b981,stroke-width:2px,color:#fff
    end
```

---

## 🛠️ Complete Tech Stack

| Layer | Component / Tool | Primary Function |
| :--- | :--- | :--- |
| **Agent Reasoning** | IBM Bob Platform / Custom Modes | Multi-agent orchestration, audit, and refactoring |
| **Static Parsing** | Python `ast` module / Tree-sitter | Zero-token local AST schema extraction |
| **Target Framework** | Python 3.11+, FastAPI, AsyncIO | Target architecture for modernized microservices |
| **Database & ORM** | SQLAlchemy 2.0, Pydantic v2 | Type-safe query models replacing raw SQL |
| **Testing & QA** | PyTest, PyTest-Asyncio | Boundary exploit verification & functional parity tests |
| **Visualization** | Mermaid.js, Markdown | Automated visual architecture diagrams |

---

## 💰 Bobcoin Resource Allocation Matrix

| Phase | Operational Mechanism | Bobcoin Spend | Strategy |
| :--- | :--- | :--- | :--- |
| **AST Code Parsing** | Local Script (`ast_swarm.py`) | **0 BC** | Operates on host OS; 0 tokens consumed. |
| **Workspace Config** | System Rules (`AGENTS.md`) | **<1 BC** | Eliminates conversational fluff responses. |
| **Agent 1: Audit** | `@ast_schema.json` Inspection | **7–8 BC** | Isolates vulnerabilities without reading raw files. |
| **Agent 2: Exploit Gen** | PyTest Boundary Generation | **6–7 BC** | Creates targeted failing tests to prove vulnerability. |
| **Agent 3: Refactor** | Focused Code Generation | **10–12 BC** | Converts monolith into Async FastAPI. |
| **Agent 4: QA & Docs** | Test Parity + Mermaid Render | **4–5 BC** | Verifies zero regression & writes visual maps. |
| **TOTAL PIPELINE** | **Verified Security Modernization** | **~28–32 BC** | **Under 50 Bobcoin Limit** |

---

## 🔄 Code Transformation Showcase

### Legacy Unsafe Input (`vulnerable_monolith.py`)
```python
def get_user_profile(user_id):
    import MySQLdb
    db = MySQLdb.connect("localhost", "admin", "pass", "app_db")
    cursor = db.cursor()
    # Vulnerability: Unsanitized SQL Injection vector
    cursor.execute("SELECT id, username, email FROM users WHERE id = '%s'" % user_id)
    return cursor.fetchone()
```
### Modernized Output Generated via IBM Bob Swarm
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, ConfigDict

class UserProfileResponse(BaseModel):
    id: int
    username: str
    email: str
    model_config = ConfigDict(from_attributes=True)

router = APIRouter(prefix="/users", tags=["User Management"])

@router.get("/{user_id}", response_model=UserProfileResponse, status_code=status.HTTP_200_OK)
async def get_user_profile(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await db.get(UserModel, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User profile not found"
        )
    return user
```

---

## Quickstart & Local Execution Guide
1. Clone & Set Up Workspace
```
   git clone [https://github.com/your-username/PROJECT-SWARM-SEC.git](https://github.com/your-username/PROJECT-SWARM-SEC.git)
cd PROJECT-SWARM-SEC
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. Run Zero-Token Local AST Parser
```
   python ast_swarm.py
```
This generates ast_schema.json locally for 0 Bobcoins.

3. Trigger IBM Bob Swarm Execution
Load the workspace in IBM Bob (or your IBM SkillsBuild environment). The workspace automatically reads AGENTS.md. In the prompt interface, execute:
@ast_schema.json @vulnerable_monolith.py Execute Swarm Security Orchestrator:
1. Run Security Auditor & Exploit Simulator to write test_exploit.py
2. Run Refactoring Architect to output modern FastAPI module
3. Run QA Verifier to assert test parity and append Mermaid.js diagram to README.md

🔮 Future Scope & Roadmap

Phase 1 (Hackathon MVP): CLI Tool & IBM Bob multi-agent pipeline modernizing monolithic Python code into FastAPI microservices.

Phase 2 (IDE Plugin Release): Packaging SWARM-SEC into a native VS Code Extension powered by IBM Bob APIs for real-time developer feedback.

Phase 3 (Enterprise CI/CD Pipelines): Integration into Red Hat OpenShift & IBM Cloud DevOps pipelines to automatically audit, patch, and document enterprise applications prior to production deployment.

👥 Team INNOVATRIX :
Sunidhi Sourabh | Sanvi Jain | Nikita | Yaashi | Neha


Track: AI for Impact |
Problem Statement: Multi-Agent AI Systems |
Event: SkillUp Hackathon (IBM SkillsBuild 2026) - North Region


---

## 🏗️ System Architecture & Workflow
