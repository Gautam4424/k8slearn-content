---
title: "Control Plane Failure"
cert: ["cka"]
roadmap: troubleshooting
subtopic: Control Plane Failure
difficulty: advanced
order: 2
tags: [troubleshooting, control-plane, kube-apiserver, kube-scheduler, kube-controller-manager, etcd, kubeadm]
---

# Control Plane Failure

When the control plane goes down, `kubectl` stops responding, and you may lose the ability to manage the cluster. Since the API server is unavailable, you must SSH directly into the control plane nodes to diagnose the issue.

---

## 🔄 Control Plane Failure Flow

```mermaid
flowchart TD
    START(["❌ kubectl not responding"])

    N1["kubectl get nodes\ncheck node status"]
    N2["kubectl get pods -n kube-system\ncheck control plane pods"]
    N3["ls /etc/kubernetes/manifests/\nall 4 YAML files present?"]
    N4["kubectl logs -n kube-system\nkube-apiserver-controlplane"]
    N5["SSH to node\ncrictl ps -a\ncrictl logs container-id"]
    N6["systemctl status kubelet\njournalctl -u kubelet -f"]
    N7["etcdctl endpoint health\n--cacert --cert --key"]

    START --> N1 --> N2 --> N3
    N3 --> N4
    N4 -->|api server down| N5
    N4 --> N6
    N3 --> N7

    style START fill:#450a0a,stroke:#ef4444,color:#fecaca
    style N7 fill:#451a03,stroke:#f59e0b,color:#fef3c7
    style N1 fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
    style N2 fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
    style N3 fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
    style N4 fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
    style N5 fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
    style N6 fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
```

---

## 🛑 Troubleshooting Steps

| Step | Check | Command |
| --- | --- | --- |
| 1️⃣ | **Node status** | `kubectl get nodes` |
| 2️⃣ | **Control plane pods** | `kubectl get pods -n kube-system` |
| 3️⃣ | **Static pod manifests** | `ls /etc/kubernetes/manifests/` — all 4 files present? |
| 4️⃣ | **API server logs** | `kubectl logs -n kube-system kube-apiserver-controlplane` |
| 5️⃣ | **API server down?** | SSH to node → `crictl ps -a` → `crictl logs <container-id>` |
| 6️⃣ | **kubelet** | `systemctl status kubelet`  • `journalctl -u kubelet -f` |
| 7️⃣ | **etcd health** | `etcdctl endpoint health --endpoints=... --cacert=... --cert=... --key=...` |

---

## 🛠️ CLI Quick Reference

```bash
# Control plane pod logs (if API server is up)
kubectl logs -n kube-system kube-apiserver-controlplane
kubectl logs -n kube-system kube-controller-manager-controlplane
kubectl logs -n kube-system kube-scheduler-controlplane
kubectl logs -n kube-system etcd-controlplane

# If API server is down, SSH to the master node and use crictl/journalctl
ssh controlplane
crictl ps -a | grep kube-apiserver   # check running containers
crictl logs <container-id>           # view container logs directly
journalctl -u kubelet -f             # check if kubelet is failing to start static pods

# Check static pod manifests for misconfigurations
cat /etc/kubernetes/manifests/kube-apiserver.yaml
cat /etc/kubernetes/manifests/etcd.yaml

# etcd health check
export ETCDCTL_API=3
etcdctl endpoint health \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key
```
