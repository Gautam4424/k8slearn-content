# Commands & Arguments

Kubernetes lets you override the Docker `ENTRYPOINT` and `CMD` in the pod spec using `command` and `args`.

## Docker → Kubernetes Mapping

| Docker | Kubernetes pod spec |
|---|---|
| `ENTRYPOINT` | `command` |
| `CMD` | `args` |

## Example

```dockerfile
# Dockerfile
FROM ubuntu
ENTRYPOINT ["sleep"]
CMD ["5"]          # default arg
# docker run ubuntu-sleeper        → sleep 5
# docker run ubuntu-sleeper 10     → sleep 10
```

```yaml
# Override in Kubernetes pod spec
apiVersion: v1
kind: Pod
metadata:
  name: ubuntu-sleeper
spec:
  containers:
  - name: ubuntu
    image: ubuntu-sleeper
    command: ["sleep2.0"]   # overrides ENTRYPOINT
    args: ["10"]            # overrides CMD
```

## Key Rules

- If only `args` is set → `ENTRYPOINT` from image is used, `CMD` is replaced
- If only `command` is set → both `ENTRYPOINT` and `CMD` from image are ignored
- If both are set → both are overridden completely
- Values are always strings: use `"10"` not `10`
