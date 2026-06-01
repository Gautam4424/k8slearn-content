---
title: "Worker Node Failure"
cert: ["cka"]
roadmap: troubleshooting
subtopic: Worker Node Failure
difficulty: advanced
order: 3
tags: [troubleshooting, worker-node, kubelet, notready, memorypressure, diskpressure]
---

# Worker Node Failure

When a worker node fails, it typically shows up as `NotReady` in the cluster, or its pods start getting evicted. The issue usually lies with resource exhaustion (Memory/Disk/PID) or a crashed `kubelet`.

---

## 🔄 Worker Node Failure Flow

```mermaid
flowchart TD
    START(["❌ Node shows NotReady"])
    DESC["kubectl describe node node01\ncheck Conditions section"]

    MEM["MemoryPressure: True\nNode running out of RAM"]
    DISK["DiskPressure: True\nDisk full"]
    PID["PIDPressure: True\nToo many processes"]
    NOTREADY["Ready: False\nkubelet problem"]

    F1["Reduce pod memory\nor add RAM"]
    F2["Clean /var/lib/containerd/\nor add disk"]
    F3["Kill runaway processes"]
    F4["SSH to node\nsystemctl status kubelet\njournalctl -u kubelet\nsystemctl restart kubelet"]

    START --> DESC
    DESC --> MEM --> F1
    DESC --> DISK --> F2
    DESC --> PID --> F3
    DESC --> NOTREADY --> F4

    style START fill:#450a0a,stroke:#ef4444,color:#fecaca
    style MEM fill:#451a03,stroke:#f59e0b,color:#fef3c7
    style DISK fill:#451a03,stroke:#f59e0b,color:#fef3c7
    style PID fill:#451a03,stroke:#f59e0b,color:#fef3c7
    style NOTREADY fill:#450a0a,stroke:#ef4444,color:#fecaca
    style DESC fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
```

---

## 🛑 Troubleshooting Steps

| Condition | Likely Cause | Fix |
| --- | --- | --- |
| `MemoryPressure: True` | Node running out of RAM | Reduce pod memory usage or add memory |
| `DiskPressure: True` | Disk full | Clean up `/var/lib/containerd/` or add disk |
| `PIDPressure: True` | Too many processes | Check for runaway processes |
| `Ready: False` | `kubelet` problem | SSH → `systemctl status kubelet` → `journalctl -u kubelet` |
| Node stuck after fix | `kubelet` not restarted | `systemctl daemon-reload && systemctl restart kubelet` |

---

## 🛠️ CLI Quick Reference

```bash
# From control plane
kubectl get nodes
kubectl describe node node01   # look at Conditions + Events

# SSH to the worker node
ssh node01

# Check kubelet status and logs
systemctl status kubelet
journalctl -u kubelet --no-pager | tail -50

# ═══════════════════════════════
# Common kubelet issues
# ═══════════════════════════════

# 1. Wrong API server address in kubelet config
cat /etc/kubernetes/kubelet.conf | grep server

# 2. Expired certificates
openssl x509 -in /var/lib/kubelet/pki/kubelet-client-current.pem \
  -text -noout | grep 'Not After'

# 3. Disk full
df -h
du -sh /var/lib/docker/   # if using docker
du -sh /var/lib/containerd/

# 4. OOM
free -h
dmesg | grep -i oom

# Restart kubelet after fix
systemctl daemon-reload
systemctl restart kubelet
systemctl enable kubelet

# Verify from control plane
kubectl get nodes   # should show Ready
```
