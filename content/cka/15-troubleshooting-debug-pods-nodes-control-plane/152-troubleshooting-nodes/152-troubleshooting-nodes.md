---
title: "15.2 Troubleshooting Nodes"
cert: ["cka"]
roadmap: "15-troubleshooting-debug-pods-nodes-control-plane"
subtopic: "15.2 Troubleshooting Nodes"
difficulty: "intermediate"
order: 2
tags: ["cka"]
---

# 15.2 Troubleshooting Nodes

> Part of **15 🔍 Troubleshooting** | CKA Chapter 15

---

# Worker Node Failure Flow

```mermaid
flowchart TD
    START(["Node NotReady"])
    DESC["kubectl describe node\ncheck Conditions"]
    MEM["MemoryPressure"] --> F1["reduce pod memory / add RAM"]
    DISK["DiskPressure"] --> F2["clean /var/lib/containerd / add disk"]
    PID["PIDPressure"] --> F3["kill runaway processes"]
    NOTREADY["Ready=False"] --> F4["SSH to node\nsystemctl status kubelet\njournalctl -u kubelet"]
    START --> DESC --> MEM & DISK & PID & NOTREADY
    style START fill:#fee2e2,stroke:#ef4444
```

```bash
kubectl get nodes
kubectl describe node node01     # check Conditions section

# SSH to node
ssh node01
systemctl status kubelet
journalctl -u kubelet --no-pager | tail -30
df -h                            # disk usage
free -h                          # memory
dmesg | grep -i oom              # OOM events

# Fix and restart
systemctl daemon-reload
systemctl restart kubelet
systemctl enable kubelet
```

