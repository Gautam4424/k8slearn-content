---
title: "Example 2 — Binding API for an Already-Pending Pod"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 2 — Binding API for an Already-Pending Pod"
difficulty: "intermediate"
order: 4
tags: ["cka", "scheduling"]
---

# Example 2 — Binding API for an Already-Pending Pod
```bash
# POST a Binding object to force-assign a pending pod
curl -X POST \
  http://$SERVER/api/v1/namespaces/default/pods/$PODNAME/binding \
  -H "Content-Type: application/json" \
  -d '{"apiVersion":"v1","kind":"Binding","metadata":{"name":"nginx"},"target":{"apiVersion":"v1","kind":"Node","name":"node02"}}'
```
