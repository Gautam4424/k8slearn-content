---
title: "Overview"
cert: ["cka"]
roadmap: "helm"
subtopic: "Overview"
difficulty: "intermediate"
order: 1
tags: ["cka", "helm"]
---

# Overview
> **Source:** KodeKloud CKA Course — Helm Section (2025 Updates) | 📅 June 2026

Helm is the **package manager for Kubernetes** — it bundles related Kubernetes manifests into reusable, versioned packages called **charts**. Added to the CKA exam in 2025.

---

# Flow: How Helm Works

```mermaid
flowchart TD
    DEV["Developer"]
    REPO["Chart Repository\nArtifactHub / Bitnami"]
    CHART["Helm Chart\ntemplates + values + metadata"]
    HELM["helm CLI"]
    RENDER["Rendered Manifests\nYAML with values substituted"]
    API["kube-apiserver"]
    REL["Release\nnamed instance in cluster"]

    DEV --> HELM
    HELM -->|helm pull| REPO --> CHART
    HELM -->|helm install| RENDER --> API --> REL

    style CHART fill:#dbeafe,stroke:#3b82f6
    style REL fill:#d1fae5,stroke:#10b981
```

---

# 1. Core Concepts

[Table Placeholder]
