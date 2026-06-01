---
title: "What etcd Stores"
cert: ["cka"]
roadmap: "core-concepts"
subtopic: "What etcd Stores"
difficulty: "intermediate"
order: 12
tags: ["cka", "core-concepts"]
---

# What etcd Stores
Every piece of cluster state lives in etcd:

- Nodes
- Pods
- ReplicaSets / Deployments
- ConfigMaps / Secrets
- Roles, RoleBindings
- Service Accounts
Only when data is written to etcd is a change considered **complete**.
