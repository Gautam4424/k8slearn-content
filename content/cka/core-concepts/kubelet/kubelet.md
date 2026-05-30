# kubelet

## Role

The **kubelet is the primary node agent**. It runs on every worker node and is responsible for:

- Registering the node with the API server
- Receiving PodSpec from the API server
- Pulling container images and starting containers via the container runtime
- Monitoring pod/container health and reporting back to the API server

## Important Note

> ⚠️ **kubeadm does NOT deploy kubelet**. You must install kubelet manually on each worker node.

```bash
# Install on worker node
apt-get install -y kubelet

# Check status
systemctl status kubelet

# View running process and flags
ps aux | grep kubelet
```

## kubelet Registration Flow

```
kubelet starts
  → registers node with API server
  → API server marks node as Ready
  → kubelet starts polling for PodSpecs assigned to this node
  → starts containers via CRI
  → reports container status back to API server
```