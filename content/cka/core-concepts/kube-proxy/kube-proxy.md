# kube-proxy

## Role

`kube-proxy` runs on **every node** and maintains **network rules** that allow pods to communicate with each other and with Services.

## How Services Work (Background)

- A Kubernetes **Service** is not a real process — it's a virtual IP
- When a Service is created, kube-proxy creates **iptables rules** (or IPVS rules) on every node to forward traffic to the correct backend pod(s)

## Modes

| Mode | Description |
| --- | --- |
| `iptables` | Default; uses kernel iptables rules |
| `ipvs` | More scalable; uses Linux IPVS for load balancing |
| `userspace` | Legacy, not used |

```bash
# kubeadm deploys kube-proxy as a DaemonSet
kubectl get daemonset -n kube-system kube-proxy

# View logs
kubectl logs -n kube-system -l k8s-app=kube-proxy
```