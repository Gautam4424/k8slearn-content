---
title: "Example 3 — kubectl Label Filtering"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 3 — kubectl Label Filtering"
difficulty: "intermediate"
order: 8
tags: ["cka", "scheduling"]
---

# Example 3 — kubectl Label Filtering
```bash
# Show all labels
kubectl get pods --show-labels

# Equality filter
kubectl get pods -l env=production

# AND logic (both must match)
kubectl get pods -l env=production,tier=backend

# Set-based selectors
kubectl get pods -l 'env in (production, staging)'
kubectl get pods -l 'env notin (dev)'
kubectl get pods -l 'version'     # pods WITH the version label
kubectl get pods -l '!version'    # pods WITHOUT the version label

# Add / remove / overwrite
kubectl label pod payment-pod-1 canary=true
kubectl label pod payment-pod-1 canary-
kubectl label pod payment-pod-1 env=staging --overwrite
```
