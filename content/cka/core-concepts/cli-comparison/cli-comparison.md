---
title: "CLI Comparison"
cert: ["cka"]
roadmap: "core-concepts"
subtopic: "CLI Comparison"
difficulty: "intermediate"
order: 8
tags: ["cka", "core-concepts"]
---

# CLI Comparison
[Table Placeholder]

```bash
# Pull and run with ctr
ctr images pull docker.io/library/nginx:latest
ctr run docker.io/library/nginx:latest nginx

# crictl — works like docker but talks to CRI
crictl pull nginx
crictl ps
crictl logs <container-id>
crictl pods
```

> ⚠️ `crictl` is for **debugging only** — do not use it to create pods in production. Kubelet may delete unknown containers.

---

# 3. ETCD for Beginners
