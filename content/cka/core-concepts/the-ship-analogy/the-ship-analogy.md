---
title: "The Ship Analogy"
cert: ["cka"]
roadmap: "core-concepts"
subtopic: "The Ship Analogy"
difficulty: "intermediate"
order: 3
tags: ["cka", "core-concepts"]
---

# The Ship Analogy
Think of a Kubernetes cluster like a fleet of ships:

- **Cargo ships** = Worker nodes that carry containers (workloads)
- **Control ship** = Master node that manages and monitors the fleet
- **ETCD** = The ship's log — records everything loaded, where, and when
- **Schedulers** = Cranes that place containers onto ships based on capacity
- **Controllers** = Operations teams that manage different functions
- **kube-apiserver** = The captain — orchestrates all operations
