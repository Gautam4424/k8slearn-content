---
title: "Scheduling Process (2 Phases)"
cert: ["cka"]
roadmap: "core-concepts"
subtopic: "Scheduling Process (2 Phases)"
difficulty: "intermediate"
order: 25
tags: ["cka", "core-concepts"]
---

# Scheduling Process (2 Phases)
### Phase 1: Filter

Eliminate nodes that cannot run the pod:

- Insufficient CPU/memory
- Node doesn't match `nodeSelector` or taints/tolerations
- Node is NotReady
