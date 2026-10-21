# 🛡️ PROJECT SWARM-SEC

> **Full-Stack Agentic Security Remediation & Cisco Infrastructure Modernization Engine**  
> *Developed by Team INNOVATRIX*  
> *🏆 Top 25 Regional Finalist – IBM SkillsBuild Hackathon 2026 (North Region)*  
> *In Collaboration with IEEE Communications Society (ComSoc), Cisco Networking Academy (NetAcad) & MITS Cisco Networking Academy*

---

## 📌 Executive Summary

Modern software and network engineering teams lose thousands of hours manually triaging code vulnerabilities, refactoring legacy technical debt, and maintaining network device configurations. Feeding entire monolithic codebases or enterprise router configurations directly into Large Language Models (LLMs) burns through credit allocations while frequently producing unreliable or breaking patches.

**PROJECT SWARM-SEC** addresses this challenge by combining **zero-token local AST (Abstract Syntax Tree) pre-processing** with a **6-Agent IBM Bob & Cisco Infrastructure Swarm**. Instead of relying on blind AI code generation, SWARM-SEC follows a structured engineering workflow that:

- Extracts structural metadata locally at **0 token cost**
- Generates exploit-focused boundary tests
- Refactors legacy applications into modern async microservices
- Audits Cisco network configurations against CCNA-aligned security baselines
- Generates remediation scripts automatically
- Verifies functionality through automated testing

All while maintaining an optimized **~29–36 Bobcoin resource budget**.

---

## 🚀 Key Features

- ✅ Zero-token local AST analysis
- ✅ Multi-agent security auditing pipeline
- ✅ Automated exploit and test generation
- ✅ Legacy-to-FastAPI modernization
- ✅ Cisco IOS configuration auditing
- ✅ Automated network remediation recommendations
- ✅ Test parity and regression verification
- ✅ Developer-friendly documentation generation

---

## 🛠️ Complete Tech Stack

| Layer | Component / Tool | Primary Function |
|---------|------------------|------------------|
| Agent Reasoning | IBM Bob Platform / Custom Modes | Multi-agent orchestration, auditing, and remediation |
| Static Parsing | Python `ast` Module / Regex Parser | Zero-token AST extraction |
| Backend Framework | Python 3.12, FastAPI, AsyncIO | Modern microservice architecture |
| Database & ORM | SQLAlchemy 2.0, Pydantic v2 | Type-safe data access and validation |
| Infrastructure Auditing | Cisco IOS CLI, Flask REST API | Configuration analysis and remediation |
| Testing & QA | PyTest, PyTest-Asyncio | Exploit validation and parity testing |
| Documentation | Mermaid.js, Markdown, Postman | Visual workflow and API documentation |

---

## 💰 Bobcoin Resource Allocation Matrix

| Phase | Operational Mechanism | Bobcoin Spend | Strategy |
|---------|----------------------|---------------|----------|
| Agent 0: AST Parsing | Local Script (`ast_swarm.py`) | **0 BC** | Local execution with zero token cost |
| Workspace Configuration | System Rules (`AGENTS.md`) | **<1 BC** | Reduces unnecessary agent interactions |
| Agent 1: Security Audit | `@ast_schema.json` Analysis | **7–8 BC** | Identifies vulnerabilities without reading full source |
| Agent 2: Exploit Generator | PyTest Boundary Test Creation | **6–7 BC** | Builds exploit validation tests |
| Agent 3: Refactoring Engine | Focused Code Transformation | **10–12 BC** | Modernizes legacy architecture |
| Agent 4: QA & Documentation | Test Verification + Mermaid | **4–5 BC** | Ensures parity and generates architecture diagrams |
| Agent 5: Network Security Audit | `agent5_engine.py` / REST API | **2–4 BC** | Cisco IOS compliance assessment |
| Authentication Modules | DB Operations | **0 BC** | Local database processing |
| **TOTAL PIPELINE** | **Complete SecOps Transformation** | **~29–36 BC** | **Efficiently within operational budget** |

---

## 🔄 Code Transformation Showcase

### 1. Software Modernization (Agent 1 ➜ Agent 3)

#### Legacy Vulnerable Implementation

```python
def get_user_profile(user_id):
    import MySQLdb

    db = MySQLdb.connect(
        "localhost",
        "admin",
        "pass",
        "app_db"
    )

    cursor = db.cursor()

    # SQL Injection Vulnerability
    cursor.execute(
        "SELECT id, username, email FROM users WHERE id = '%s'" % user_id
    )

    return cursor.fetchone()
```

#### Modernized FastAPI Output

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, ConfigDict

class UserProfileResponse(BaseModel):
    id: int
    username: str
    email: str
    model_config = ConfigDict(from_attributes=True)

router = APIRouter(
    prefix="/users",
    tags=["User Management"]
)

@router.get(
    "/{user_id}",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK
)
async def get_user_profile(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    user = await db.get(UserModel, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )

    return user
```

---

### 2. Cisco Infrastructure Auditing (Agent 5)

#### Input Configuration

```text
hostname Edge-Router-01
!
interface FastEthernet0/1
 switchport mode access
!
interface Vlan1
 ip address 192.168.1.1 255.255.255.0
!
line vty 0 4
 transport input telnet
!
```

#### Automated Audit Response

```json
{
  "device_id": "Edge-Router-01",
  "overall_status": "NON-COMPLIANT",
  "security_score": 50,
  "failed_policies": [
    "SSH_ENFORCEMENT",
    "PORT_SECURITY_STICKY_MAC",
    "VLAN_1_HARDENING"
  ],
  "remediation_script": [
    "ip domain-name netacad.pka",
    "crypto key generate rsa modulus 1024",
    "line vty 0 15",
    "transport input ssh",
    "login local",
    "interface FastEthernet0/1",
    "switchport port-security",
    "switchport port-security mac-address sticky",
    "interface Vlan1",
    "shutdown",
    "interface Vlan99",
    "ip address 192.168.1.2 255.255.255.0",
    "no shutdown"
  ]
}
```

---

## ⚙️ Project Workflow

```text
Local AST Parser
        │
        ▼
Schema Extraction
        │
        ▼
Agent 1 Security Audit
        │
        ▼
Agent 2 Exploit Generation
        │
        ▼
Agent 3 Code Refactoring
        │
        ▼
Agent 5 Cisco Security Audit
        │
        ▼
Agent 4 QA Verification
        │
        ▼
Documentation & Reports
```

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-username/PROJECT-SWARM-SEC.git

cd PROJECT-SWARM-SEC

python3 -m venv venv

source venv/bin/activate
# Windows:
# venv\Scripts\activate

pip install -r requirements.txt
```

### 2. Generate AST Schema

```bash
python ast_swarm.py
```

This creates `ast_schema.json` locally with **0 Bobcoin consumption**.

### 3. Launch Network Security API

```bash
python app.py
```

Server starts at:

```text
http://localhost:5000
```

### 4. Execute Multi-Agent Pipeline

```bash
jupyter notebook hackathon_pipeline.ipynb
```

Or run through IBM Bob:

```text
@ast_schema.json @vulnerable_monolith.py

Execute Swarm Security Orchestrator:

1. Run Security Auditor
2. Generate test_exploit_poc.py
3. Refactor into FastAPI architecture
4. Execute Cisco Network Security Audit
5. Verify test parity
6. Append architecture diagrams to README
```

---

## 📂 Project Structure

```text
PROJECT-SWARM-SEC/
│
├── ast_swarm.py
├── app.py
├── agent5_engine.py
├── hackathon_pipeline.ipynb
├── requirements.txt
├── README.md
│
├── schemas/
│   └── ast_schema.json
│
├── tests/
│   └── test_exploit_poc.py
│
├── api/
│   └── audit_endpoints.py
│
└── docs/
    └── architecture.md
```

---

## 🔮 Future Scope & Roadmap

### Phase 1: Hackathon MVP
- Multi-agent software security pipeline
- FastAPI transformation engine
- Cisco IOS security auditing

### Phase 2: Developer Experience
- VS Code Extension
- Real-time security feedback
- IBM API integration

### Phase 3: Enterprise Automation
- OpenShift deployment support
- Ansible playbook generation
- Automated CI/CD remediation
- End-to-end cloud infrastructure security

---

## 👥 Team INNOVATRIX & Affiliations

### Team Members
- **Sunidhi Sourabh**
- **Sanvi Jain**

### Achievement
🏆 **Top 25 Regional Finalist – IBM SkillsBuild Hackathon 2026 (North Region)**

### Track
- **AI for Impact**

### Problem Statement
- **Multi-Agent AI Systems**

### Affiliations
- **IEEE Communications Society (ComSoc), Hyderabad Section**
- **Cisco Networking Academy (NetAcad)**
- **MITS Cisco Networking Academy**

---

## 📜 License

© 2026 **Team INNOVATRIX**. All Rights Reserved.

PROJECT SWARM-SEC, including its source code, architecture, workflows, documentation, designs, proof-of-concepts, and associated materials, is the intellectual property of **Team INNOVATRIX**.

Unauthorized reproduction, redistribution, modification, commercial usage, or creation of derivative works is prohibited without prior written permission from the team.

This repository is shared for demonstration, learning, research visibility, and portfolio purposes only. Ownership and all associated rights remain exclusively reserved by **Team INNOVATRIX**.

---
