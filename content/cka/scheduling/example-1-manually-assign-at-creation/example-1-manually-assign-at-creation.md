---
title: "Example 1 — Manually Assign at Creation"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 1 — Manually Assign at Creation"
difficulty: "intermediate"
order: 3
tags: ["cka", "scheduling"]
---

# Example 1 — Manually Assign at Creation
```yaml
# manual-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-manual
spec:
  nodeName: node01        # scheduler bypassed entirely
  containers:
  - name: nginx
    image: nginx:1.25
    ports:
    - containerPort: 80
```

```bash
kubectl apply -f manual-pod.yaml
kubectl get pods -o wide
# NAME           READY   STATUS    NODE
# nginx-manual   1/1     Running   node01
```

> ⚠️ `nodeName` can only be set **at pod creation time**. To move an existing pod use `kubectl replace --force -f pod.yaml`.
