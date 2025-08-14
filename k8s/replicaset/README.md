# Kubernetes ReplicaSets - Application Scaling

## 🎯 What Are ReplicaSets?

ReplicaSets are Kubernetes resources that ensure a specified number of pod replicas are running at any given time. Think of them as "pod managers" that automatically create, delete, and maintain the exact number of pods you want running. They're the foundation for horizontal scaling and high availability in Kubernetes.

## 📁 Files in This Directory

- `lucky-number-app-rs.yaml` - Backend API ReplicaSet

## 🏗️ ReplicaSet vs Pods

### Pods (What We Learned Before)
- Single pod instances
- No automatic recovery if they crash
- No scaling capabilities
- Manual management required

### ReplicaSets (What We're Learning Now)
- Multiple pod replicas
- Automatic pod recovery
- Horizontal scaling
- Declarative management

## 🔍 ReplicaSet Analysis

### Backend ReplicaSet (`lucky-number-app-rs.yaml`)

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: lucky-number-app-rs
spec:
  replicas: 4
  selector:
    matchLabels:
      app: lucky-number
      tier: backend
  template:
    metadata:
      name: lucky-number-app
      labels:
        app: lucky-number
        tier: backend
    spec:
      containers:
        - name: lucky-number-app
          image: kubernates-example/lucky-number-app:latest
          imagePullPolicy: Never
          ports:
            - containerPort: 3001
          env:
            - name: POD_NAME
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
```

**What This Does:**
- Creates a ReplicaSet named `lucky-number-app-rs`
- Ensures **4 replicas** of the backend pod are always running
- Automatically manages pod lifecycle (create, delete, restart)
- Each pod gets a unique name and POD_NAME environment variable

**Key Learning Points:**
- **`replicas: 4`**: Desired number of pod copies
- **`selector`**: How ReplicaSet finds pods to manage
- **`template`**: The pod template to use for creating replicas
- **Automatic Management**: Kubernetes handles pod creation/deletion

## 🔄 How ReplicaSets Work

### 1. **Desired State Management**
```
ReplicaSet Spec: replicas: 4
                    ↓
              Current State: 2 pods running
                    ↓
              Action: Create 2 more pods
```

### 2. **Pod Lifecycle Management**
- **Pod Creation**: When there are fewer pods than desired
- **Pod Deletion**: When there are more pods than desired
- **Pod Recovery**: When pods crash or are deleted manually

### 3. **Label-Based Selection**
```yaml
selector:
  matchLabels:
    app: lucky-number
    tier: backend
```
This means: "Manage any pod with these exact labels"

## 🚀 Deploying ReplicaSets

### Step 1: Build Docker Image
```bash
cd apps/lucky-number-app
docker build -t kubernates-example/lucky-number-app:latest .
```

### Step 2: Apply ReplicaSet Manifest
```bash
kubectl apply -f k8s/replicaset/lucky-number-app-rs.yaml
```

### Step 3: Verify Deployment
```bash
# Check ReplicaSet status
kubectl get replicaset

# Check pod status (should see 4 pods)
kubectl get pods

# Check ReplicaSet details
kubectl describe replicaset lucky-number-app-rs
```

## 🔍 Understanding ReplicaSet Behavior

### 1. **Scaling Up**
```bash
# Scale to 6 replicas
kubectl scale replicaset lucky-number-app-rs --replicas=6

# Verify scaling
kubectl get pods
```

### 2. **Scaling Down**
```bash
# Scale to 2 replicas
kubectl scale replicaset lucky-number-app-rs --replicas=2

# Verify scaling
kubectl get pods
```

### 3. **Pod Recovery**
```bash
# Delete a pod manually
kubectl delete pod <pod-name>

# Watch ReplicaSet recreate it
kubectl get pods -w
```

## 🧪 Testing ReplicaSet Features

### 1. **Load Balancing Test**
```bash
# Make multiple requests to see load balancing
for i in {1..20}; do
  kubectl exec -it lucky-web-app -- curl http://lucky-number-app-service:3001/lucky
done

# Check which pods handled requests
kubectl logs lucky-number-app-<pod-id>
```

### 2. **Scaling Test**
```bash
# Scale up
kubectl scale replicaset lucky-number-app-rs --replicas=6

# Watch pods being created
kubectl get pods -w

# Scale down
kubectl scale replicaset lucky-number-app-rs --replicas=2

# Watch pods being terminated
kubectl get pods -w
```

### 3. **Failure Recovery Test**
```bash
# Delete a pod
kubectl delete pod <pod-name>

# Watch ReplicaSet recreate it
kubectl get pods -w

# Verify the new pod is working
kubectl logs <new-pod-name>
```

## 🔍 ReplicaSet vs Service Interaction

### How They Work Together
```
Service (lucky-number-app-service)
    ↓
ReplicaSet (lucky-number-app-rs)
    ↓
Pods (4 replicas)
```

### Load Balancing
- Service automatically distributes traffic across all 4 pods
- If one pod is busy, traffic goes to others
- No manual configuration needed

## 🚨 Troubleshooting Common Issues

### 1. **ReplicaSet Not Creating Pods**
```bash
# Check ReplicaSet status
kubectl describe replicaset lucky-number-app-rs

# Check events
kubectl get events --sort-by='.lastTimestamp'

# Verify image exists
docker images | grep kubernates-example
```

### 2. **Pods Stuck in Pending**
```bash
# Check pod status
kubectl get pods

# Check pod details
kubectl describe pod <pod-name>

# Check node resources
kubectl describe node <node-name>
```

### 3. **Wrong Number of Pods**
```bash
# Check ReplicaSet spec
kubectl get replicaset lucky-number-app-rs -o yaml

# Verify selector matches pod labels
kubectl get pods --show-labels
```

## 📚 Learning Objectives

After working with this ReplicaSet, you should understand:

1. **Scaling Basics**: How to scale applications horizontally
2. **High Availability**: How multiple replicas improve reliability
3. **Load Balancing**: How services distribute traffic across replicas
4. **Automatic Recovery**: How ReplicaSets maintain desired state
5. **Label Management**: How selectors control which pods are managed

## 🔄 Next Steps

ReplicaSets solve scaling, but there's more to learn:

1. **Deployments**: How to manage updates and rollbacks
2. **Horizontal Pod Autoscaler (HPA)**: Automatic scaling based on metrics
3. **StatefulSets**: How to manage stateful applications
4. **DaemonSets**: How to run pods on every node

## 💡 Pro Tips

- **Start with ReplicaSets**: They're simpler than Deployments for learning
- **Use consistent labels**: Make sure ReplicaSet selector matches pod labels
- **Monitor scaling**: Watch how pods are created and deleted
- **Test failure scenarios**: Delete pods to see automatic recovery
- **Understand the relationship**: ReplicaSets manage pods, Services route traffic

## 🔧 Advanced ReplicaSet Features

### Pod Disruption Budget
```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: lucky-number-app-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: lucky-number
      tier: backend
```

### Anti-Affinity Rules
```yaml
spec:
  template:
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - lucky-number
              topologyKey: kubernetes.io/hostname
```

## 🎯 Real-World Scenarios

### 1. **High Traffic Periods**
- Scale up before expected load
- Monitor performance metrics
- Scale down during quiet periods

### 2. **Rolling Updates**
- Deploy new versions gradually
- Maintain service availability
- Rollback if issues arise

### 3. **Disaster Recovery**
- Multiple replicas across nodes
- Automatic pod replacement
- Service continuity during failures

---

**ReplicaSets are the foundation of scalable applications! Ready to learn about Deployments for advanced update management? 🚀** 