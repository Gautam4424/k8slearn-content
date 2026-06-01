---
title: "Application Failure Troubleshooting"
cert: ["cka", "ckad"]
roadmap: troubleshooting
subtopic: Application Failure Troubleshooting
difficulty: intermediate
order: 1
tags: [troubleshooting, application, pod, service, crashloopbackoff, pending]
---

# Application Failure Troubleshooting

When a user reports that an application is broken, a systematic approach is essential. Start from the Service and work your way down to the individual Pods.

---

## 🔄 Troubleshooting Flow

```mermaid
flowchart TD
    START(["🚨 User reports app broken"])

    SVC{"kubectl get endpoints\nany pods listed?"}
    SVC_NO["❌ Zero endpoints\nService selector ≠ pod labels"]
    SVC_YES["✅ Endpoints exist"]

    STATUS{"kubectl get pods\nWhat status?"}

    PEND["Pending"]
    CRASH["CrashLoopBackOff"]
    IMG["ImagePullBackOff"]
    OOM["OOMKilled"]
    RUN["Running but broken"]

    F1["kubectl describe pod\nEvents → FailedScheduling"]
    F2["kubectl logs --previous\ncheck crash output"]
    F3["kubectl describe pod\ncheck image name / pullSecret"]
    F4["Increase resources.limits.memory"]
    F5["kubectl logs -f\nkubectl exec -it -- sh"]

    START --> SVC
    SVC -->|no| SVC_NO
    SVC -->|yes| SVC_YES --> STATUS
    STATUS --> PEND --> F1
    STATUS --> CRASH --> F2
    STATUS --> IMG --> F3
    STATUS --> OOM --> F4
    STATUS --> RUN --> F5

    style START fill:#450a0a,stroke:#ef4444,color:#fecaca
    style CRASH fill:#450a0a,stroke:#ef4444,color:#fecaca
    style OOM fill:#450a0a,stroke:#ef4444,color:#fecaca
    style PEND fill:#451a03,stroke:#f59e0b,color:#fef3c7
    style SVC_NO fill:#450a0a,stroke:#ef4444,color:#fecaca
    style SVC_YES fill:#064e3b,stroke:#10b981,color:#d1fae5
    style STATUS fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
    style SVC fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
```

---

## 🛑 Common Issues & Fixes

| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| Pod `Pending` | No node can schedule | Check resources, taints, nodeSelector |
| Pod `CrashLoopBackOff` | App crashes on start | `kubectl logs --previous` |
| Pod `ImagePullBackOff` | Wrong image or registry creds | Check image name, imagePullSecret |
| Pod `OOMKilled` | Exceeds memory limit | Increase memory limit |
| `0/N endpoints` on service | Label mismatch | Check service selector vs pod labels |
| `ERR_CONNECTION_REFUSED` | App not listening on correct port | Check containerPort vs service port |

---

## 🔄 Common Pod Status Quick Reference

| Status | Meaning | First Check |
| --- | --- | --- |
| `Pending` | Not scheduled yet | `kubectl describe pod` → Events: FailedScheduling |
| `Init:N/M` | Init container N of M still running | `kubectl logs <pod> -c <init-container-name>` |
| `PodInitializing` | All init containers done, main starting | Normal — wait |
| `Running` | All containers running | Check logs if app behaves wrong |
| `CrashLoopBackOff` | Container keeps crashing | `kubectl logs --previous` |
| `OOMKilled` | Exceeded memory limit | Increase `resources.limits.memory` |
| `ImagePullBackOff` | Cannot pull image | Check image name, tag, imagePullSecret |
| `Terminating` | Pod being deleted | Check for finalizers blocking deletion |
| `Evicted` | Node pressure evicted the pod | Check node disk/memory pressure |

---

## 🛠️ CLI Quick Reference

```bash
# Full app troubleshooting sequence
kubectl get all -n <namespace>               # overview
kubectl get endpoints <svc-name>             # any pods behind service?
kubectl describe pod <pod-name>              # events, state
kubectl logs <pod-name>                      # app logs
kubectl logs <pod-name> --previous           # crash logs
kubectl exec -it <pod-name> -- /bin/sh       # shell in
kubectl exec -it <pod-name> -- env           # check env vars
kubectl exec -it <pod-name> -- curl localhost:8080/health  # test internally
```
