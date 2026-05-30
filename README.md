# k8slearn-content

Content repository for [k8slearn](https://github.com/yourorg/k8slearn-app) —
an open-source, self-hosted Kubernetes certification learning platform.

## What is this repo?

This repo contains all learning material: markdown files and JSON metadata for
every topic across all supported certifications.

The app repo reads from this repo. You do not need to touch the app repo to
add or improve content.

## Supported certifications

- CKA — Certified Kubernetes Administrator
...
- CKAD — Certified Kubernetes Application Developer
- CKS — Certified Kubernetes Security Specialist
- KCNA — Kubernetes and Cloud Native Associate

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

Short version: add a `.md` file and a `.json` file to the right folder, open a PR.
CI will tell you if anything is wrong.

## Schema

The content schema is defined in [schema.json](./schema.json).
All JSON files are validated against it on every PR.
