---
id: dev-14-kubernetes-operators
title: Extending Kubernetes: Writing Custom Operators in Go
excerpt: Automating complex application logic with the Operator pattern. How to write a custom controller that manages stateful sets, backups, and failovers.
date: 2024-03-10
tags: [Kubernetes, Go, DevOps, Automation]
category: Dev
---

# Beyond Helm Charts

Kubernetes is great at managing stateless containers. You tell it "Run 3 replicas of Nginx," and it ensures 3 are running. But what if you need to run a distributed database like PostgreSQL or a game server cluster?

These are **Stateful Applications**. They have lifecycle requirements:
*   "Don't upgrade the primary node until the replica is synced."
*   "Take a backup before changing configuration."
*   "If the master dies, promote the slave."

Helm charts can't handle this logic. **Operators** can. An Operator is essentially a software robot that encodes human operational knowledge into code.

## The Anatomy of an Operator

An Operator consists of two parts:
1.  **Custom Resource Definition (CRD)**: Extends the Kubernetes API with a new type.
2.  **Controller**: A Go binary running in the cluster that watches for changes to your CRD.

### Defining the CRD

Let's imagine a `MinecraftServer` resource.

```yaml
apiVersion: gaming.example.com/v1
kind: MinecraftServer
metadata:
  name: survival-world
spec:
  version: "1.20.4"
  memory: "4Gi"
  difficulty: "hard"
  whitelist: ["player1", "player2"]
```

### The Reconciliation Loop

The Controller runs a continuous loop (Reconcile function) that ensures the **Actual State** matches the **Desired State**.

```go
// Reconcile is part of the main kubernetes controller loop
func (r *MinecraftServerReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    // 1. Fetch the MinecraftServer instance
    var server gamingv1.MinecraftServer
    if err := r.Get(ctx, req.NamespacedName, &server); err != nil {
        return ctrl.Result{}, client.IgnoreNotFound(err)
    }

    // 2. Define the desired Deployment
    deployment := r.desiredDeployment(&server)

    // 3. Check if Deployment exists
    var found appsv1.Deployment
    err := r.Get(ctx, types.NamespacedName{Name: server.Name, Namespace: server.Namespace}, &found)
    
    if err != nil && errors.IsNotFound(err) {
        // Deployment doesn't exist? Create it.
        err = r.Create(ctx, deployment)
        return ctrl.Result{}, err
    }

    // 4. Check if updates are needed (e.g. Memory changed?)
    if found.Spec.Template.Spec.Containers[0].Resources.Requests.Memory() != server.Spec.Memory {
        found.Spec.Template.Spec.Containers[0].Resources = ...
        r.Update(ctx, &found)
    }

    return ctrl.Result{}, nil
}
```

## Level 2: Day-2 Operations

The real magic happens when you add logic for "Day-2 Operations" (backups, scaling, healing).
*   **Auto-Backup**: The operator can watch a cron schedule and trigger a `VolumeSnapshot` automatically.
*   **Failover**: It can detect if the pod is stuck in `CrashLoopBackOff`, analyze the logs, and attempt a repair action (like clearing a corrupted temp file) before restarting.

## Conclusion

Writing Operators (usually with the **Operator SDK** or **Kubebuilder**) elevates you from a "User of Kubernetes" to a "Platform Engineer." It allows you to offer "Database-as-a-Service" or "Game-Server-as-a-Service" internally to your team, hiding the immense complexity of stateful management behind a simple YAML interface.
