---
title: "Overview"
cert: ["cka"]
roadmap: "10-logging-monitoring"
subtopic: "Overview"
difficulty: "beginner"
order: 1
tags: ["cka"]
---

# Overview

---

# Flow: How Monitoring Works in Kubernetes

```mermaid
flowchart TD
    subgraph Nodes["Worker Nodes"]
        N1["Node 1 cAdvisor"]
        N2["Node 2 cAdvisor"]
        N3["Node 3 cAdvisor"]
    end
    MS["Metrics Server\nin-memory only"]
    API["kube-apiserver\n/apis/metrics.k8s.io/v1beta1"]
    TOP["kubectl top nodes/pods"]
    subgraph PROD["Production Stack"]
        PROM["Prometheus"] --> ALERT["AlertManager"] --> NOTIF(["PagerDuty/Slack"])
        PROM --> GRAFANA["Grafana"]
    end
    N1 & N2 & N3 -->|scrape| MS --> API --> TOP
    N1 & N2 & N3 -->|scrape| PROM
    style MS fill:#fef3c7,stroke:#f59e0b
    style PROM fill:#d1fae5,stroke:#10b981
```

---

# 1. Monitor Cluster Components

## What to Monitor

[Table Not Rendered - Unsupported Block]

## Metrics Server (Lightweight, In-Memory)

Metrics Server is the **official in-cluster monitoring solution** for Kubernetes. It scrapes resource usage from kubelets (via cAdvisor) and exposes it through the API server.

```mermaid
flowchart LR
    CA["cAdvisor\ninside kubelet"]
    MS["Metrics Server\naggregates all nodes"]
    API["kube-apiserver\n/apis/metrics.k8s.io/v1beta1"]
    TOP["kubectl top nodes/pods"]
    CA --> MS --> API --> TOP
    style MS fill:#fef3c7,stroke:#f59e0b
```

### Install Metrics Server

```bash
# Deploy metrics server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# For kubeadm/self-hosted: add --kubelet-insecure-tls flag
kubectl patch deployment metrics-server -n kube-system \
  --type='json' \
  -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'

# Verify it's running
kubectl get pods -n kube-system | grep metrics-server
kubectl top nodes   # wait ~60s for first data
```

### Using kubectl top

```bash
# Node resource usage
kubectl top nodes
# NAME       CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
# node01     350m         8%     1200Mi          60%
# node02     120m         3%     800Mi           40%

# Pod resource usage
kubectl top pods
kubectl top pods -n kube-system
kubectl top pods --sort-by=memory      # sort by memory
kubectl top pods --sort-by=cpu         # sort by CPU

# Specific pod
kubectl top pod nginx-pod

# With containers broken out
kubectl top pods --containers
# POD            NAME      CPU   MEMORY
# web-pod        nginx     10m   20Mi
# web-pod        logger    5m    10Mi
```

## Production Monitoring Stack

```mermaid
flowchart LR
    subgraph PROD["Production Monitoring"]
        PROM["Prometheus\nscrapes all metrics"]
        NE["Node Exporter\nDaemonSet"]
        KSM["kube-state-metrics"]
        ALERT["AlertManager"]
        GRAFANA["Grafana"]
        NOTIF(["PagerDuty / Slack"])
    end
    NE & KSM -->|scrape| PROM
    PROM --> ALERT --> NOTIF
    PROM --> GRAFANA
    style PROM fill:#d1fae5,stroke:#10b981
    style GRAFANA fill:#dbeafe,stroke:#3b82f6
```

```bash
# Install via kube-prometheus-stack Helm chart
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace

# Access Grafana
kubectl port-forward svc/monitoring-grafana 3000:80 -n monitoring
# default: admin / prom-operator
```

---

# 2. Managing Application Logs

## Log Flow in Kubernetes

```mermaid
flowchart TD
    APP["Application\nwrites to stdout/stderr"]
    RT["containerd\n/var/log/containers/pod.log"]
    KL["kubelet\nlog rotation"]
    CMD["kubectl logs pod-name"]
    APP -->|stdout/stderr| RT --> KL --> CMD
    style APP fill:#dbeafe,stroke:#3b82f6
```

> **Key Rule:** Always write logs to **stdout/stderr** — never to files inside the container. Kubernetes captures stdout/stderr automatically.

## Single Container Pod Logs

```bash
# Basic log retrieval
kubectl logs nginx-pod

# Follow/stream logs in real-time
kubectl logs -f nginx-pod

# Last N lines
kubectl logs --tail=100 nginx-pod

# Logs since a time duration
kubectl logs --since=1h nginx-pod
kubectl logs --since=30m nginx-pod

# Timestamps on every line
kubectl logs --timestamps nginx-pod

# Previous container instance (after crash/restart)
kubectl logs nginx-pod --previous
kubectl logs nginx-pod -p
```

## Multi-Container Pod Logs

```yaml
# multi-container-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: web-with-sidecar
spec:
  containers:
  - name: web            # main container
    image: nginx:1.25
  - name: log-agent      # sidecar container
    image: busybox
    command: ['sh', '-c', 'while true; do echo "[LOG] $(date)"; sleep 5; done']
```

```bash
# MUST specify -c <container> for multi-container pods
kubectl logs web-with-sidecar -c web
kubectl logs web-with-sidecar -c log-agent

# Stream a specific container
kubectl logs -f web-with-sidecar -c web

# Get logs from ALL containers in a pod
kubectl logs web-with-sidecar --all-containers=true

# If you forget -c on a multi-container pod:
# Error: a container name must be specified for pod web-with-sidecar,
# choose one of: [web log-agent]
```

## Logs from Deployments and Labels

```bash
# Logs from any pod matching a label
kubectl logs -l app=nginx
kubectl logs -l app=nginx --all-containers=true

# Logs from all pods in a deployment
kubectl logs deployment/my-deployment
kubectl logs deployment/my-deployment -c nginx

# Logs from a crashed pod (very useful for debugging)
kubectl logs nginx-pod --previous
```

## Centralized Log Aggregation

```mermaid
flowchart LR
    L["/var/log/containers/\non each node"]
    F["Fluentd/Filebeat\nDaemonSet"]
    ES["Elasticsearch / Loki"]
    KIB["Kibana / Grafana"]
    L --> F --> ES --> KIB
    style F fill:#fef3c7,stroke:#f59e0b
    style ES fill:#d1fae5,stroke:#10b981
```

```yaml
# Fluentd DaemonSet snippet — collects logs from all nodes
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: kube-system
spec:
  selector:
    matchLabels:
      name: fluentd
  template:
    metadata:
      labels:
        name: fluentd
    spec:
      tolerations:
      - key: node-role.kubernetes.io/control-plane
        operator: Exists
        effect: NoSchedule
      containers:
      - name: fluentd
        image: fluent/fluentd-kubernetes-daemonset:v1-debian-elasticsearch
        env:
        - name: FLUENT_ELASTICSEARCH_HOST
          value: "elasticsearch.logging"
        - name: FLUENT_ELASTICSEARCH_PORT
          value: "9200"
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
```

## Debugging Workflow

```mermaid
flowchart TD
    START(["Pod not working?"])
    G{"kubectl get pods"}
    P["Pending"] --> D1["kubectl describe pod\nEvents: FailedScheduling"]
    C["CrashLoopBackOff"] --> D2["kubectl logs --previous"]
    R["Running but broken"] --> D3["kubectl logs -f\nkubectl exec -it -- sh"]
    START --> G --> P & C & R
    style P fill:#fef3c7,stroke:#f59e0b
    style C fill:#fee2e2,stroke:#ef4444
```

```bash
# Full debugging sequence
kubectl get pods -o wide                    # overview
kubectl describe pod failing-pod           # events + state
kubectl logs failing-pod --previous        # last crash logs
kubectl logs failing-pod -f                # live stream
kubectl exec -it failing-pod -- /bin/sh    # shell inside
```

---

# Quick Reference

```bash
# Monitoring
kubectl top nodes
kubectl top pods
kubectl top pods --sort-by=cpu
kubectl top pods --sort-by=memory
kubectl top pods --containers

# Logging
kubectl logs <pod>
kubectl logs <pod> -c <container>
kubectl logs <pod> -f
kubectl logs <pod> --tail=50
kubectl logs <pod> --since=1h
kubectl logs <pod> --previous
kubectl logs <pod> --timestamps
kubectl logs deployment/<name>
kubectl logs -l app=<label>
```

> 📚 **Ref:** [Kubernetes Monitoring Docs](https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)



