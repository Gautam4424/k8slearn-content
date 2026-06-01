---
title: "2.5 Full Pod Lifecycle — Request Flow"
cert: ["cka"]
roadmap: "02-kubernetes-architecture-complete-reference"
subtopic: "2.5 Full Pod Lifecycle — Request Flow"
difficulty: "intermediate"
order: 5
tags: ["cka"]
---

# 2.5 Full Pod Lifecycle — Request Flow

> Part of **02 ☸️ Kubernetes Architecture** | CKA Chapter 2

Trace exactly what happens, step by step, from `kubectl apply` to a running pod serving traffic.

---

# Full Flow: kubectl apply → Running Pod → Serving Traffic

```mermaid
sequenceDiagram
    participant Dev as 👨‍💻 Developer
    participant API as kube-apiserver
    participant ETCD as etcd
    participant DC as Deployment Controller
    participant RS as ReplicaSet Controller
    participant SCHED as kube-scheduler
    participant KL as kubelet
    participant CRI as containerd
    participant EP as Endpoint Controller
    participant KP as kube-proxy

    Dev->>API: kubectl apply -f deployment.yaml
    API->>ETCD: validate + persist Deployment
    API-->>Dev: 200 OK

    API-->>DC: watch: Deployment created
    DC->>API: create ReplicaSet
    API->>ETCD: persist ReplicaSet

    API-->>RS: watch: ReplicaSet created
    RS->>API: create 3 Pods (Pending, nodeName=empty)
    API->>ETCD: persist Pods

    API-->>SCHED: watch: unscheduled pods
    SCHED->>SCHED: Filter nodes → Score nodes
    SCHED->>API: write nodeName=node01 to Pod spec
    API->>ETCD: persist Pod with nodeName

    API-->>KL: watch: Pod assigned to node01
    KL->>CRI: pull image nginx:1.25
    CRI-->>KL: image ready
    KL->>KL: setup CNI networking (pod IP assigned)
    KL->>CRI: create + start container
    KL->>API: update Pod status = Running
    API->>ETCD: persist Pod status

    API-->>EP: watch: Pod Running
    EP->>API: add Pod IP to EndpointSlice
    API-->>KP: watch: EndpointSlice changed
    KP->>KP: update iptables/IPVS rules on all nodes
    Note over KP: Traffic to Service ClusterIP now routes to new Pod
```

---

# External Traffic Flow

```mermaid
flowchart TD
    USER(["🌐 User browser\nhttps://myapp.com"])
    DNS["DNS\nmyapp.com → LB IP"]
    LB["☁️ Cloud Load Balancer"]
    ING["⚙️ Ingress Controller\nnginx / traefik\nTLS termination + routing"]
    SVC["Service ClusterIP\n10.96.1.50:80"]
    KP["kube-proxy iptables\nDNAT to pod IP"]
    POD["🟢 Pod 10.244.2.7:8080"]
    USER --> DNS --> LB --> ING --> SVC --> KP --> POD
```

---

# Key Concepts Summary


| Concept | What it means |
| --- | --- |
| Desired State | What you declare in YAML — stored in etcd |
| Actual State | What's actually running on nodes |
| Reconciliation | Controllers continuously drive actual → desired |
| Watch API | Components get push notifications, no polling |
| Declarative | You say WHAT you want, K8s figures out HOW |
| Label Selectors | How Services/Deployments find their Pods |
| OwnerReferences | When a Deployment is deleted, its ReplicaSets and Pods are too |

```bash
# Watch a deployment rollout step by step
kubectl get pods -w

# Trace events for a pod
kubectl describe pod <name> | grep -A20 Events

# See full pod spec as API server sees it
kubectl get pod <name> -o yaml
```

