---
title: "15.1 Troubleshooting Pods & Applications"
cert: ["cka"]
roadmap: "15-troubleshooting-debug-pods-nodes-control-plane"
subtopic: "15.1 Troubleshooting Pods & Applications"
difficulty: "intermediate"
order: 1
tags: ["cka"]
---

# 15.1 Troubleshooting Pods & Applications

> Part of **15 🔍 Troubleshooting** | CKA Chapter 15

---

# Application Failure Flow

```mermaid
flowchart TD
    START(["App broken"])
    SVC{"kubectl get endpoints\nany pods?"}
    SVC_NO["❌ Zero endpoints\nlabel mismatch"]
    STATUS{"kubectl get pods"}
    PEND["Pending"] --> D1["kubectl describe pod\ncheck Events"]
    CRASH["CrashLoopBackOff"] --> D2["kubectl logs --previous"]
    IMG["ImagePullBackOff"] --> D3["check image name + pullSecret"]
    OOM["OOMKilled"] --> D4["increase memory limit"]
    RUN["Running but broken"] --> D5["kubectl logs -f\nkubectl exec -it -- sh"]
    START --> SVC
    SVC -->|no| SVC_NO
    SVC -->|yes| STATUS --> PEND & CRASH & IMG & OOM & RUN
```

```bash
# Full triage sequence
kubectl get all -n <ns>
kubectl get endpoints <svc>
kubectl describe pod <name>
kubectl logs <pod>
kubectl logs <pod> --previous
kubectl exec -it <pod> -- sh
kubectl exec -it <pod> -- env
kubectl exec -it <pod> -- curl localhost:8080/health
```

