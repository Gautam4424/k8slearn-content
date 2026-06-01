---
title: "4.3 Secrets"
cert: ["cka"]
roadmap: "04-application-lifecycle-management"
subtopic: "4.3 Secrets"
difficulty: "intermediate"
order: 3
tags: ["cka"]
---

# 4.3 Secrets

> Part of **04 ⚙️ Application Lifecycle Management** | CKA Chapter 4

Secrets store **sensitive data** (passwords, tokens, TLS certs) — base64 encoded by default, optionally encrypted at rest.

---

# Create a Secret

```bash
# From literals
kubectl create secret generic db-secret \
  --from-literal=DB_PASSWORD=mysecretpass \
  --from-literal=API_KEY=abc123xyz

# From file
kubectl create secret generic db-secret --from-file=secrets.properties

# TLS secret
kubectl create secret tls tls-secret \
  --cert=tls.crt \
  --key=tls.key

# Docker registry secret
kubectl create secret docker-registry regcred \
  --docker-server=registry.company.com \
  --docker-username=myuser \
  --docker-password=mypassword

# View (values are base64 encoded)
kubectl get secrets
kubectl describe secret db-secret       # values hidden
kubectl get secret db-secret -o yaml    # values shown (base64)

# Decode a value
echo 'bXlzZWNyZXRwYXNz' | base64 -d
```

```yaml
# Declarative Secret (values MUST be base64 encoded)
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  DB_PASSWORD: bXlzZWNyZXRwYXNz   # base64 of 'mysecretpass'
  API_KEY: YWJjMTIzeHl6           # base64 of 'abc123xyz'
```

---

# Use Secret in a Pod

```yaml
# envFrom — all keys as env vars
spec:
  containers:
  - name: app
    envFrom:
    - secretRef:
        name: db-secret
```

```yaml
# env — single key
spec:
  containers:
  - name: app
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: DB_PASSWORD
```

```yaml
# Volume — most secure (files with permissions)
spec:
  containers:
  - name: app
    volumeMounts:
    - name: secret-vol
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: secret-vol
    secret:
      secretName: db-secret
      defaultMode: 0400       # read-only by owner only
```

---

# Secret Types

[Table Not Rendered - Unsupported Block]

> ⚠️ Base64 is **encoding, not encryption**. Secrets are not secure by default — enable [etcd encryption at rest](../09-Security/9.8-etcd-Encryption-at-Rest) in production.

