---
title: "RBAC (Roles & Bindings)"
cert: cks
roadmap: cluster-hardening
subtopic: RBAC (Roles & Bindings)
difficulty: intermediate
order: 1
tags: [rbac, role, clusterrole, rolebinding, serviceaccount]
---

# RBAC (Roles & Bindings)

> **CKS Exam Domain:** Cluster Hardening

This topic covers **RBAC (Roles & Bindings)** — a key area of the Certified Kubernetes Security Specialist exam.

## Overview

Content coming soon. This placeholder ensures the topic appears in your study plan.

## Key Concepts

- Security implications and threat model for RBAC (Roles & Bindings)
- Configuration and hardening steps
- Verification commands and audit checks
- CKS exam scenario patterns

## Quick Reference

`ash
# Example security checks for rbac
kubectl get rbac -A
kubectl describe rbac <name> -n <ns>
`

## CKS Exam Tips

- RBAC (Roles & Bindings) is a high-frequency topic in CKS scenario tasks
- Always verify changes with kubectl auth can-i and audit logs
- Understand the principle of least privilege

> 📝 Full content will be added in the next content push.
