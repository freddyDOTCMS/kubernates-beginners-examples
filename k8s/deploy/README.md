# Kubernetes Deployments - Production-Ready Application Management

## 🎯 What Are Deployments?

Deployments are the **production-ready** way to manage applications in Kubernetes. They're like "smart ReplicaSets" that add crucial features like rolling updates, rollbacks, and declarative updates. Think of Deployments as the "enterprise manager" that handles the complex task of updating your application while keeping it running smoothly.

## 📁 Files in This Directory

- `lucky-number-app-deploy.yaml` - Backend API Deployment

## 🏗️ Deployment vs ReplicaSet

### ReplicaSets (What We Learned Before)
- ✅ Scaling and pod management
- ❌ No update capabilities
- ❌ No rollback functionality
- ❌ Manual version management

### Deployments (What We're Learning Now)
- ✅ All ReplicaSet features
- ✅ Rolling updates with zero downtime
- ✅ Automatic rollbacks on failure
- ✅ Version history and management
- ✅ Declarative updates

## 🔍 Deployment Analysis

### Backend Deployment (`lucky-number-app-deploy.yaml`)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lucky-number-app-deploy
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
          image: kubernates-example/lucky-number-app:2-digets
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
- Creates a Deployment named `lucky-number-app-deploy`
- Manages 4 replicas of the backend application
- Uses image version `2-digets` (note the typo - this is intentional for learning!)
- Automatically handles updates, rollbacks, and scaling

**Key Learning Points:**
- **`kind: Deployment`**: This is the key difference from ReplicaSet
- **Image Versioning**: `2-digets` shows how to specify different versions
- **Rolling Updates**: Deployment will update pods gradually
- **Rollback Safety**: Can easily revert to previous versions

## 🔄 How Deployments Work

### 1. **Rolling Update Process**
```
Current State: 4 pods running v1
                    ↓
              Update Request: v2
                    ↓
              Action: Create 1 new v2 pod
                    ↓
              Action: Delete 1 old v1 pod
                    ↓
              Action: Repeat until all pods are v2
```

### 2. **Update Strategies**
- **RollingUpdate** (default): Gradual replacement
- **Recreate**: Stop all, then start new (downtime)

### 3. **Rollback Capability**
- Automatic rollback on failure
- Manual rollback to any previous version
- Version history tracking

## 🚀 Deploying with Deployments

### Step 1: Build Different Image Versions
```bash
cd apps/lucky-number-app

# Build version 1
docker build -t kubernates-example/lucky-number-app:v1 .

# Build version 2 (with typo for learning)
docker build -t kubernates-example/lucky-number-app:2-digets .

# Build latest
docker build -t kubernates-example/lucky-number-app:latest .
```

### Step 2: Apply Deployment Manifest
```bash
kubectl apply -f k8s/deploy/lucky-number-app-deploy.yaml
```

### Step 3: Verify Deployment
```bash
# Check Deployment status
kubectl get deployment

# Check pod status
kubectl get pods

# Check Deployment details
kubectl describe deployment lucky-number-app-deploy
```

## 🔍 Understanding Deployment Behavior

### 1. **Rolling Updates**
```bash
# Update to a new image version
kubectl set image deployment/lucky-number-app-deploy \
  lucky-number-app=kubernates-example/lucky-number-app:v3

# Watch the rolling update
kubectl rollout status deployment/lucky-number-app-deploy

# Check pod status during update
kubectl get pods -w
```

### 2. **Rollbacks**
```bash
# Check rollout history
kubectl rollout history deployment/lucky-number-app-deploy

# Rollback to previous version
kubectl rollout undo deployment/lucky-number-app-deploy

# Rollback to specific version
kubectl rollout undo deployment/lucky-number-app-deploy --to-revision=1
```

### 3. **Scaling**
```bash
# Scale up
kubectl scale deployment lucky-number-app-deploy --replicas=6

# Scale down
kubectl scale deployment lucky-number-app-deploy --replicas=2
```

## 🧪 Testing Deployment Features

### 1. **Rolling Update Test**
```bash
# Start with current deployment
kubectl get pods

# Update to new image
kubectl set image deployment/lucky-number-app-deploy \
  lucky-number-app=kubernates-example/lucky-number-app:v2

# Watch rolling update
kubectl rollout status deployment/lucky-number-app-deploy

# Verify all pods are updated
kubectl get pods
```

### 2. **Rollback Test**
```bash
# Check current version
kubectl get deployment lucky-number-app-deploy -o yaml | grep image

# Rollback to previous version
kubectl rollout undo deployment/lucky-number-app-deploy

# Watch rollback
kubectl rollout status deployment/lucky-number-app-deploy

# Verify rollback
kubectl get pods
```

### 3. **Failure Recovery Test**
```bash
# Deploy a broken image
kubectl set image deployment/lucky-number-app-deploy \
  lucky-number-app=kubernates-example/lucky-number-app:broken

# Watch for failure
kubectl get pods

# Check if automatic rollback occurs
kubectl rollout status deployment/lucky-number-app-deploy
```

## 🔍 Deployment vs Service Interaction

### How They Work Together
```
Service (lucky-number-app-service)
    ↓
Deployment (lucky-number-app-deploy)
    ↓
ReplicaSet (automatically managed)
    ↓
Pods (current version)
```

### Load Balancing During Updates
- Service continues routing traffic to healthy pods
- Old and new pods can coexist during updates
- Zero downtime deployments

## 🚨 Troubleshooting Common Issues

### 1. **Rollout Stuck**
```bash
# Check rollout status
kubectl rollout status deployment/lucky-number-app-deploy

# Check events
kubectl get events --sort-by='.lastTimestamp'

# Check pod status
kubectl get pods
```

### 2. **Update Failed**
```bash
# Check rollout history
kubectl rollout history deployment/lucky-number-app-deploy

# Check specific revision
kubectl rollout history deployment/lucky-number-app-deploy --revision=2

# Rollback immediately
kubectl rollout undo deployment/lucky-number-app-deploy
```

### 3. **Pods Not Updating**
```bash
# Check deployment spec
kubectl get deployment lucky-number-app-deploy -o yaml

# Verify image exists
docker images | grep kubernates-example

# Force restart
kubectl rollout restart deployment/lucky-number-app-deploy
```

## 📚 Learning Objectives

After working with this Deployment, you should understand:

1. **Rolling Updates**: How to update applications without downtime
2. **Rollbacks**: How to revert to previous versions safely
3. **Update Strategies**: Different ways to handle application updates
4. **Deployment Management**: How to manage the complete application lifecycle
5. **Production Readiness**: Why Deployments are preferred over ReplicaSets

## 🔄 Next Steps

Deployments are powerful, but there's more to learn:

1. **ConfigMaps and Secrets**: How to manage configuration
2. **Horizontal Pod Autoscaler (HPA)**: Automatic scaling based on metrics
3. **Ingress Controllers**: How to route external traffic
4. **Monitoring and Logging**: How to observe your applications

## 💡 Pro Tips

- **Use Deployments in Production**: They're the standard for production workloads
- **Test Rollbacks**: Always verify you can rollback before deploying
- **Monitor Rollouts**: Watch the status during updates
- **Use Semantic Versioning**: Tag your images consistently
- **Plan Rollout Strategy**: Consider your update approach carefully

## 🔧 Advanced Deployment Features

### Update Strategy Configuration
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Maximum pods above desired count
      maxUnavailable: 1  # Maximum pods below desired count
```

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

### Resource Limits
```yaml
spec:
  template:
    spec:
      containers:
      - name: lucky-number-app
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

## 🎯 Real-World Scenarios

### 1. **Blue-Green Deployment**
- Deploy new version alongside old
- Switch traffic when ready
- Instant rollback capability

### 2. **Canary Deployment**
- Deploy to small subset first
- Monitor performance metrics
- Gradually increase rollout

### 3. **Production Updates**
- Schedule updates during low-traffic periods
- Monitor application health
- Have rollback plan ready

## 🔍 Deployment Commands Cheat Sheet

```bash
# Basic operations
kubectl get deployment
kubectl describe deployment <name>
kubectl apply -f <file>

# Rolling updates
kubectl set image deployment/<name> <container>=<image>
kubectl rollout status deployment/<name>
kubectl rollout pause deployment/<name>
kubectl rollout resume deployment/<name>

# Rollbacks
kubectl rollout history deployment/<name>
kubectl rollout undo deployment/<name>
kubectl rollout undo deployment/<name> --to-revision=<number>

# Scaling
kubectl scale deployment/<name> --replicas=<number>
kubectl autoscale deployment/<name> --min=<min> --max=<max> --cpu-percent=<cpu>
```

---

**Deployments are the production standard for Kubernetes applications! You're now ready to manage real-world workloads! 🚀** 