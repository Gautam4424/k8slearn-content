---
title: "Service Accounts & Secrets"
cert: cks
roadmap: cluster-hardening
subtopic: Service Accounts & Secrets
difficulty: intermediate
order: 2
tags: [serviceaccount, secret, token, projection]
---

# Service Accounts & Secrets

> **CKS Exam Domain:** Cluster Hardening

This topic covers **Service Accounts & Secrets** — a key area of the Certified Kubernetes Security Specialist exam.

## Overview

Content coming soon. This placeholder ensures the topic appears in your study plan.

## Key Concepts

- Security implications and threat model for Service Accounts & Secrets
- Configuration and hardening steps
- Verification commands and audit checks
- CKS exam scenario patterns

## Quick Reference

`ash
# Example security checks for service-accounts
kubectl get service -A
kubectl describe service <name> -n <ns>
`

## CKS Exam Tips

- Service Accounts & Secrets is a high-frequency topic in CKS scenario tasks
- Always verify changes with kubectl auth can-i and audit logs
- Understand the principle of least privilege

> 📝 Full content will be added in the next content push.
