---
title: "AppArmor & Seccomp"
cert: cks
roadmap: system-hardening
subtopic: AppArmor & Seccomp
difficulty: advanced
order: 1
tags: [apparmor, seccomp, profiles, syscalls]
---

# AppArmor & Seccomp

> **CKS Exam Domain:** System Hardening

This topic covers **AppArmor & Seccomp** — a key area of the Certified Kubernetes Security Specialist exam.

## Overview

Content coming soon. This placeholder ensures the topic appears in your study plan.

## Key Concepts

- Security implications and threat model for AppArmor & Seccomp
- Configuration and hardening steps
- Verification commands and audit checks
- CKS exam scenario patterns

## Quick Reference

`ash
# Example security checks for apparmor
kubectl get apparmor -A
kubectl describe apparmor <name> -n <ns>
`

## CKS Exam Tips

- AppArmor & Seccomp is a high-frequency topic in CKS scenario tasks
- Always verify changes with kubectl auth can-i and audit logs
- Understand the principle of least privilege

> 📝 Full content will be added in the next content push.
