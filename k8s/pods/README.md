# Kubernetes Pods - Basic Container Deployment

## 🎯 What Are Pods?

Pods are the smallest deployable units in Kubernetes. Think of them as the "atoms" of the Kubernetes universe - they're the basic building blocks that contain one or more containers. In this tutorial, we'll start with simple pod definitions to understand the fundamentals before moving to more advanced concepts.

## 📁 Files in This Directory

- `lucky-number-app.yaml` - Backend API pod
- `lucky-web-app.yaml` - Frontend web app pod

## 🏗️ Pod Structure Explained

### Basic Pod Template
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-name
  labels:
    key: value
spec:
  containers:
    - name: container-name
      image: image:tag
      ports:
        - containerPort: 3000
```

### Key Components

1. **`apiVersion: v1`** - The Kubernetes API version for core resources
2. **`kind: Pod`** - Specifies this is a Pod resource
3. **`metadata`** - Information about the pod (name, labels, etc.)
4. **`spec`** - The actual specification of what the pod should contain

## 🔍 Individual Pod Analysis

### 1. Backend Pod (`lucky-number-app.yaml`)

```yaml
apiVersion: v1
kind: Pod
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
```

**What This Does:**
- Creates a single pod named `lucky-number-app`
- Labels it as a backend service for the lucky-number application
- Runs the backend container on port 3001
- Uses `imagePullPolicy: Never` for local development

**Key Learning Points:**
- **Labels**: Used for service discovery and grouping
- **Container Ports**: Exposes port 3001 for network communication
- **Image Policy**: `Never` means Kubernetes won't try to pull from a registry

### 2. Frontend Pod (`lucky-web-app.yaml`)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: lucky-web-app
  labels:
    app: lucky-web
    tier: frontend
spec:
  containers:
    - name: lucky-web-app
      image: kubernates-example/lucky-web-app:latest
      imagePullPolicy: Never
      ports:
        - containerPort: 4000
      env:
        - name: LUCKY_API_URL
          value: http://lucky-number-app-service:3001/lucky
```

**What This Does:**
- Creates a frontend pod named `lucky-web-app`
- Labels it as a frontend service
- Runs on port 4000
- Sets environment variable for backend communication

**Key Learning Points:**
- **Environment Variables**: How to configure applications
- **Service Communication**: Frontend knows how to reach backend
- **Port Configuration**: Different services use different ports

## 🚀 Deploying Pods

### Step 1: Build Docker Images
```bash
# Build backend image
cd apps/lucky-number-app
docker build -t kubernates-example/lucky-number-app:latest .

# Build frontend image
cd ../lucky-web-app
docker build -t kubernates-example/lucky-web-app:latest .
```

### Step 2: Apply Pod Manifests
```bash
# Deploy both pods
kubectl apply -f k8s/pods/

# Or deploy individually
kubectl apply -f k8s/pods/lucky-number-app.yaml
kubectl apply -f k8s/pods/lucky-web-app.yaml
```

### Step 3: Verify Deployment
```bash
# Check pod status
kubectl get pods

# Check pod details
kubectl describe pod lucky-number-app
kubectl describe pod lucky-web-app
```

## 🔍 Understanding Pod Lifecycle

### Pod States
1. **Pending**: Pod is being scheduled
2. **Running**: Pod is running successfully
3. **Succeeded**: Pod completed successfully (for jobs)
4. **Failed**: Pod failed to run
5. **Unknown**: Pod state is unknown

### Common Commands
```bash
# Get pod status
kubectl get pods

# Get detailed pod information
kubectl describe pod <pod-name>

# View pod logs
kubectl logs <pod-name>

# Execute commands in pod
kubectl exec -it <pod-name> -- /bin/sh

# Delete a pod
kubectl delete pod <pod-name>
```

## ⚠️ Important Limitations of Pods

### 1. **No Self-Healing**
- If a pod crashes, it won't restart automatically
- If a node fails, pods on that node are lost forever

### 2. **No Scaling**
- You can't easily scale the number of pods up or down
- Each pod must be managed individually

### 3. **No Rolling Updates**
- Updating an application requires manual pod replacement
- No built-in zero-downtime deployment

## 🧪 Testing Your Pods

### 1. Check Pod Status
```bash
kubectl get pods -o wide
```

### 2. Test Backend API
```bash
# Port forward to access the backend
kubectl port-forward lucky-number-app 3001:3001

# Test the API
curl http://localhost:3001/lucky
curl http://localhost:3001/ping
```

### 3. Test Frontend
```bash
# Port forward to access the frontend
kubectl port-forward lucky-web-app 4000:4000

# Test the web app
curl http://localhost:4000
```

### 4. Check Logs
```bash
# Backend logs
kubectl logs lucky-number-app

# Frontend logs
kubectl logs lucky-web-app
```

## 🚨 Troubleshooting Common Issues

### 1. **Pod Stuck in Pending**
```bash
# Check events
kubectl get events --sort-by='.lastTimestamp'

# Check node resources
kubectl describe node <node-name>
```

### 2. **Image Pull Errors**
```bash
# Verify image exists locally
docker images | grep kubernates-example

# Check image pull policy
kubectl describe pod <pod-name>
```

### 3. **Port Conflicts**
```bash
# Check if ports are in use
kubectl get endpoints

# Verify service configuration
kubectl get services
```

## 📚 Learning Objectives

After working with these pod manifests, you should understand:

1. **Pod Basics**: What pods are and how they work
2. **Container Configuration**: How to specify container images and ports
3. **Labels and Selectors**: How to organize and identify resources
4. **Environment Variables**: How to configure applications
5. **Pod Lifecycle**: How pods are created, run, and terminated

## 🔄 Next Steps

Pods are just the beginning! Next, you'll learn about:

1. **Services**: How to expose pods to the network
2. **ReplicaSets**: How to scale and manage multiple pod copies
3. **Deployments**: How to manage pod updates and rollbacks
4. **ConfigMaps and Secrets**: How to manage configuration

## 💡 Pro Tips

- **Always use labels**: They're essential for service discovery and management
- **Start simple**: Begin with basic pods before adding complexity
- **Use `kubectl describe`**: It provides detailed information about resources
- **Check logs frequently**: They're your best debugging tool
- **Test incrementally**: Deploy one pod at a time to isolate issues

---

**Ready to move beyond basic pods? Let's explore Services next! 🚀** 