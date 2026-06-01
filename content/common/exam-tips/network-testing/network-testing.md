---
title: "Testing Network Policies"
cert: ["cka"]
roadmap: exam-tips
subtopic: Testing Network Policies
difficulty: advanced
order: 2
tags: [network-policy, netshoot, curl, nslookup, debug-pod, testing]
---

# Testing Network Policies

When configuring NetworkPolicies in the CKA exam, it's very easy to make a small syntax mistake that locks out all traffic. You must verify your policies by deploying a temporary client pod and testing connectivity.

---

## 🛠️ Step 1: Deploy a Server to Test Against

If the question doesn't already have a target pod, deploy a quick NGINX pod and expose it as a Service.

```yaml
# Deploy a simple HTTP server to test connectivity
apiVersion: v1
kind: Pod
metadata:
  name: netpol-server
  labels:
    app: netpol-server
spec:
  containers:
  - name: server
    image: nginx:1.25
    ports:
    - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: netpol-server-svc
spec:
  selector:
    app: netpol-server
  ports:
  - port: 80
    targetPort: 80
```

---

## 🛠️ Step 2: Run a Debug Client Pod

The `nicolaka/netshoot` image is the gold standard for Kubernetes network troubleshooting. It comes pre-installed with `curl`, `nslookup`, `ping`, `tcpdump`, `netstat`, etc. 

Alternatively, if you don't have internet access to pull `netshoot`, you can use the standard `busybox` image or `nginx` (which has `curl`).

```bash
# Temporary debug pod with full networking tools
kubectl run debug \
  --image=nicolaka/netshoot \
  --rm -it \
  --restart=Never \
  -- bash
```

To test isolation within a specific namespace, launch the debug pod directly in that namespace:

```bash
# Test specific namespace isolation
kubectl run debug -n production \
  --image=nicolaka/netshoot \
  --rm -it \
  --restart=Never \
  -- bash
```

---

## 🛠️ Step 3: Test Connectivity

From inside your debug pod's shell, run these commands to verify if your NetworkPolicy is allowing or dropping traffic as expected:

```bash
# 1. Test standard HTTP connectivity
curl http://netpol-server-svc

# 2. Test cross-namespace connectivity (requires FQDN)
curl http://netpol-server-svc.default.svc.cluster.local

# 3. Test DNS resolution (to ensure your policy isn't blocking UDP port 53 to CoreDNS!)
nslookup netpol-server-svc

# 4. Test with timeout (for a quick pass/fail if traffic is dropped)
curl --max-time 3 http://netpol-server-svc
```

---

## 🔍 Verifying the Policy Object

```bash
# List all policies
kubectl get networkpolicies -A

# Check the details (inspects PodSelector, Ingress, and Egress rules)
kubectl describe networkpolicy <name>
```
