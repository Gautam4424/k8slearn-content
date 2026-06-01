---
title: "Overview"
cert: ["cka"]
roadmap: "01-start-here-cka-learning-roadmap"
subtopic: "Overview"
difficulty: "beginner"
order: 1
tags: ["cka"]
---

# Overview

This guide is structured for **complete beginners** — follow the chapters in order. Each chapter builds on the previous one. Don't skip ahead!

---

## How Long Will This Take?

[Table Not Rendered - Unsupported Block]

---

## The Learning Path

```mermaid
flowchart TD
    A["01 ⭐ Start Here\nThis roadmap"] --> B["02 ☸️ Architecture\nUnderstand the system"]
    B --> C["03 🧡 Core Concepts\nPods, Services, Deployments"]
    C --> D["04 ⚙️ App Lifecycle\nRun and manage apps"]
    D --> E["05 📅 Scheduling\nWhere pods land"]
    E --> F["06 📈 Autoscaling\nScale automatically"]
    F --> G["07 💾 Storage\nPersist data"]
    G --> H["08 🌐 Networking\nConnect everything"]
    H --> I["09 🔒 Security\nProtect the cluster"]
    I --> J["10 📊 Monitoring\nObserve the cluster"]
    J --> K["11 🔧 Maintenance\nOperate and upgrade"]
    K --> L["12 🏗️ Install\nBuild clusters"]
    L --> M["13 📦 Helm\nPackage management"]
    M --> N["14 🔧 Kustomize\nConfig management"]
    N --> O["15 🔍 Troubleshooting\nFix broken things"]
    O --> P["16 📐 Advanced kubectl\nExam speed"]
    P --> Q["17 💡 Exam Cheatsheet\nFinal prep"]

    style A fill:#dbeafe,stroke:#3b82f6
    style Q fill:#d1fae5,stroke:#10b981
```

---

## Chapter Map

[Table Not Rendered - Unsupported Block]

---

## CKA Exam Domain Weights (2025/2026)

```mermaid
pie title CKA Exam Weightage
    "Troubleshooting" : 30
    "Cluster Architecture & Installation" : 25
    "Services & Networking" : 20
    "Workloads & Scheduling" : 15
    "Storage" : 10
```

> 💡 **Troubleshooting is worth 30% of the exam** — don’t neglect Chapter 15!

---

## Beginner Tips Before You Start

1. **Read every chapter top to bottom** — don’t jump around
1. **Type every command yourself** — muscle memory matters for the exam
1. **Use **[**killer.sh**](http://killer.sh/) — comes free with your CKA registration (2 attempts)
1. **Practice **`**--dry-run=client -o yaml**` on every resource until it’s automatic
1. **Bookmark **[**kubernetes.io/docs**](http://kubernetes.io/docs) — you can use it during the exam
1. **Set your aliases on exam day** immediately:
```bash
alias k=kubectl
export do='--dry-run=client -o yaml'
export now='--force --grace-period=0'
source <(kubectl completion bash)
complete -F __start_kubectl k
```

---

> 📚 **Exam Registration:** [training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka](http://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka)

> 

> 🧠 **Official Docs:** [kubernetes.io/docs](http://kubernetes.io/docs) — allowed during exam

> 

> 🧪 **Practice Platform:** [killer.sh](http://killer.sh/) — 2 free sessions with exam registration

