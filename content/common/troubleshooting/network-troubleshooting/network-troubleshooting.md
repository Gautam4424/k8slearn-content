---
title: "Network Troubleshooting"
cert: ["cka"]
roadmap: troubleshooting
subtopic: Network Troubleshooting
difficulty: advanced
order: 4
tags: [troubleshooting, network, cni, dns, kube-proxy, iptables, netshoot]
---

# Network Troubleshooting & Cheat Sheet

Network issues in Kubernetes typically involve problems with the **CNI plugin**, **kube-proxy** (Service routing), or **CoreDNS** (name resolution). 

---

## 🌐 Network Troubleshooting Commands

```bash
# 1. Check CNI plugin is running (must be Running on all nodes)
kubectl get pods -n kube-system | grep -E 'calico|flannel|weave|cilium'

# 2. Check kube-proxy is working (must be Running on all nodes)
kubectl get pods -n kube-system | grep kube-proxy
kubectl logs -n kube-system kube-proxy-xxxxx

# 3. Check CoreDNS working
kubectl get pods -n kube-system -l k8s-app=kube-dns
kubectl logs -n kube-system -l k8s-app=kube-dns

# 4. Test DNS from a debug pod
kubectl run dns-debug --image=busybox:1.28 --rm -it -- nslookup kubernetes

# 5. Use netshoot for advanced network debugging (ping, curl, dig, tcpdump)
kubectl run net-debug --image=nicolaka/netshoot --rm -it -- bash

# 6. Test service connectivity from inside the cluster
kubectl exec -it mypod -- curl http://my-service.default.svc.cluster.local
kubectl exec -it mypod -- curl http://10.96.50.100  # by ClusterIP

# 7. Check iptables rules for a service on a node (SSH to node first)
iptables -t nat -L KUBE-SERVICES -n | grep <service-cluster-ip>
```

---

## 🚀 Master Troubleshooting Cheat Sheet

Keep these commands handy for exams and on-call situations.

```bash
# ═══════════════════════════════
# NODE STATUS
# ═══════════════════════════════
kubectl get nodes
kubectl describe node <node>

# ═══════════════════════════════
# POD STATUS
# ═══════════════════════════════
kubectl get pods -A
kubectl describe pod <pod> -n <ns>
kubectl logs <pod> -n <ns>
kubectl logs <pod> -n <ns> --previous
kubectl exec -it <pod> -n <ns> -- /bin/sh

# ═══════════════════════════════
# SERVICE & ENDPOINTS
# ═══════════════════════════════
kubectl get svc -A
kubectl get endpoints <svc>
kubectl describe svc <svc>

# ═══════════════════════════════
# CONTROL PLANE
# ═══════════════════════════════
kubectl get pods -n kube-system
kubectl logs -n kube-system kube-apiserver-controlplane
journalctl -u kubelet -f                    # on node via SSH
crictl ps -a                                # on node via SSH
crictl logs <container-id>                  # on node via SSH

# ═══════════════════════════════
# EVENTS
# ═══════════════════════════════
kubectl get events -A --sort-by='.lastTimestamp'
kubectl get events -n <ns>
```
