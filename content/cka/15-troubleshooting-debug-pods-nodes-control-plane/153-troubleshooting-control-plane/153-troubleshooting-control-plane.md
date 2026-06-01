---
title: "15.3 Troubleshooting Control Plane"
cert: ["cka"]
roadmap: "15-troubleshooting-debug-pods-nodes-control-plane"
subtopic: "15.3 Troubleshooting Control Plane"
difficulty: "intermediate"
order: 3
tags: ["cka"]
---

# 15.3 Troubleshooting Control Plane

> Part of **15 🔍 Troubleshooting** | CKA Chapter 15

---

# Control Plane Failure Flow

```mermaid
flowchart TD
    START(["kubectl not responding"])
    N1["curl -k https://localhost:6443/healthz"]
    N2["systemctl status kubelet\njournalctl -u kubelet"]
    N3["ls /etc/kubernetes/manifests/\ncrictl ps -a"]
    N4["crictl logs container-id"]
    N5["kubeadm certs check-expiration"]
    N6["etcdctl endpoint health"]
    START --> N1 --> N2 --> N3 --> N4
    N3 --> N5
    N3 --> N6
```

```bash
# Is API server reachable?
curl -k https://localhost:6443/healthz

# kubelet running?
systemctl status kubelet
journalctl -u kubelet -f

# Static pods running?
crictl ps -a | grep -E "kube-apiserver|etcd|kube-scheduler|kube-controller"
crictl logs $(crictl ps -a | grep kube-apiserver | awk '{print $1}')

# Certs expired?
kubeadm certs check-expiration
kubeadm certs renew all

# etcd health
export ETCDCTL_API=3
etcdctl endpoint health \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key
```

