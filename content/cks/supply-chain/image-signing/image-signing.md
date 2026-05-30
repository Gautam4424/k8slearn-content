---
title: "Image Signing & Admission Webhooks"
cert: cks
roadmap: supply-chain
subtopic: Image Signing & Admission Webhooks
difficulty: advanced
order: 1
tags: [cosign, admission, opa, gatekeeper, signing]
---

# Image Signing & Admission Webhooks

> **CKS Exam Domain:** Supply Chain

This topic covers **Image Signing & Admission Webhooks** — a key area of the Certified Kubernetes Security Specialist exam.

## Overview

Content coming soon. This placeholder ensures the topic appears in your study plan.

## Key Concepts

- Security implications and threat model for Image Signing & Admission Webhooks
- Configuration and hardening steps
- Verification commands and audit checks
- CKS exam scenario patterns

## Quick Reference

`ash
# Example security checks for image-signing
kubectl get image -A
kubectl describe image <name> -n <ns>
`

## CKS Exam Tips

- Image Signing & Admission Webhooks is a high-frequency topic in CKS scenario tasks
- Always verify changes with kubectl auth can-i and audit logs
- Understand the principle of least privilege

> 📝 Full content will be added in the next content push.
