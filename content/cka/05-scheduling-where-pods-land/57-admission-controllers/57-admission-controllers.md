---
title: "5.7 Admission Controllers"
cert: ["cka"]
roadmap: "05-scheduling-where-pods-land"
subtopic: "5.7 Admission Controllers"
difficulty: "intermediate"
order: 7
tags: ["cka"]
---

# 5.7 Admission Controllers

> Part of **05 📅 Scheduling** | CKA Chapter 5

Admission controllers intercept API requests **after auth/authz** and can mutate or reject them.

---

# Admission Controller Flow

```mermaid
flowchart TD
    REQ(["kubectl apply -f pod.yaml"])
    subgraph API["kube-apiserver"]
        A1["Authenticate"]
        A2["Authorize RBAC"]
        subgraph ADM["Admission"]
            M["Mutating Controllers\nRuns FIRST — can modify\nDefaultStorageClass · LimitRanger\nServiceAccount · MutatingWebhook"]
            S["Schema Validation"]
            V["Validating Controllers\nRuns AFTER — allow/deny only\nNamespaceLifecycle · ResourceQuota\nPodSecurity · ValidatingWebhook"]
        end
        E[("Persist to etcd")]
    end
    RESP(["Response"])
    REQ --> A1 --> A2 --> M --> S --> V --> E --> RESP
    style M fill:#fef3c7,stroke:#f59e0b
    style V fill:#fee2e2,stroke:#ef4444
```

---

# Common Built-in Controllers

[Table Not Rendered - Unsupported Block]

---

# Custom Admission Webhooks

```yaml
# MutatingWebhookConfiguration
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
metadata:
  name: my-mutating-webhook
webhooks:
- name: inject-sidecar.company.com
  clientConfig:
    service:
      name: webhook-svc
      namespace: webhook
      path: /mutate
    caBundle: <base64-ca>
  rules:
  - apiGroups: [""]
    apiVersions: ["v1"]
    operations: ["CREATE"]
    resources: ["pods"]
  admissionReviewVersions: ["v1"]
  sideEffects: None
```

```bash
# See which admission plugins are enabled
kubectl get pod kube-apiserver-controlplane -n kube-system -o yaml \
  | grep enable-admission

# Check admission webhooks
kubectl get mutatingwebhookconfigurations
kubectl get validatingwebhookconfigurations
```

