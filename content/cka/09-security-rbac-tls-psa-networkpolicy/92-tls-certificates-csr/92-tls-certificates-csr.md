---
title: "9.2 TLS Certificates & CSR"
---
# 9.2 TLS Certificates & CSR

> Part of **09 🔒 Security** | CKA Chapter 9

---

# TLS Certificate Map

```mermaid
flowchart TD
    CA["🔑 Root CA\n/etc/kubernetes/pki/ca.crt\nSigns ALL cluster certs"]
    CA --> API_C["kube-apiserver.crt\nserver TLS"]
    CA --> ETCD_C["etcd/server.crt"]
    CA --> KL_C["apiserver-kubelet-client.crt\nAPI → kubelet"]
    CA --> ADMIN_C["admin.crt\nkubectl auth"]
    CA --> CTRL_C["controller-manager.crt"]
    CA --> SCHED_C["scheduler.crt"]
    style CA fill:#fef3c7,stroke:#f59e0b
```

```bash
# Check certificate expiry
kubeadm certs check-expiration

# Renew all certificates
kubeadm certs renew all

# Inspect a certificate
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -text -noout \
  | grep -E 'Subject|Issuer|Not After'

# View cert from kubeconfig (base64 encoded)
kubectl config view --raw | grep certificate-authority-data
```

---

# Certificate Signing Requests (CSR)

Create a new user cert using the Kubernetes CA:

```bash
# Generate private key
openssl genrsa -out jane.key 2048

# Generate CSR
openssl req -new -key jane.key \
  -subj "/CN=jane/O=developers" \
  -out jane.csr

# Create K8s CSR object
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: jane
spec:
  request: $(cat jane.csr | base64 | tr -d "\n")
  signerName: kubernetes.io/kube-apiserver-client
  usages:
  - client auth
EOF

# Approve
kubectl certificate approve jane

# Get signed cert
kubectl get csr jane -o jsonpath='{.status.certificate}' | base64 -d > jane.crt
```

