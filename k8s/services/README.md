# Kubernetes Services - Network Communication

## 🎯 What Are Services?

Services in Kubernetes are like "virtual load balancers" that provide stable network endpoints for your pods. Think of them as the "phone book" that other applications use to find and communicate with your pods. Without services, pods would be isolated islands with no way to talk to each other or the outside world.

## 📁 Files in This Directory

- `lucky-number-app-service.yaml` - Backend API service
- `lucky-web-app-service.yaml` - Frontend web app service

## 🏗️ Service Types Explained

### 1. **ClusterIP** (Default)
- Internal cluster access only
- Pods can communicate with each other
- Not accessible from outside the cluster

### 2. **NodePort**
- Exposes service on each node's IP at a static port
- Accessible from outside the cluster
- Port range: 30000-32767

### 3. **LoadBalancer**
- Exposes service externally using cloud provider's load balancer
- Most cloud-native approach
- Automatically assigns external IP

## 🔍 Individual Service Analysis

### 1. Backend Service (`lucky-number-app-service.yaml`)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: lucky-number-app-service
spec:
  selector:
    app: lucky-number
    tier: backend
  ports:
    - protocol: TCP
      port: 3001
      targetPort: 3001
```

**What This Does:**
- Creates a service named `lucky-number-app-service`
- Uses **ClusterIP** type (default) - internal access only
- Selects pods with labels `app: lucky-number` and `tier: backend`
- Exposes port 3001 for TCP communication

**Key Learning Points:**
- **Selector**: Matches pod labels to determine which pods to route traffic to
- **Port Mapping**: `port` (service port) → `targetPort` (container port)
- **Internal Only**: Other pods in the cluster can reach this service

### 2. Frontend Service (`lucky-web-app-service.yaml`)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: lucky-web-app-service
spec:
  type: NodePort
  selector:
    app: lucky-web
    tier: frontend
  ports:
    - protocol: TCP
      port: 4000
      targetPort: 4000
      nodePort: 30000
```

**What This Does:**
- Creates a service named `lucky-web-app-service`
- Uses **NodePort** type - accessible from outside the cluster
- Selects pods with labels `app: lucky-web` and `tier: frontend`
- Exposes port 4000 internally and port 30000 externally

**Key Learning Points:**
- **NodePort Type**: Makes service accessible from outside the cluster
- **External Access**: Port 30000 on any node IP
- **Port Configuration**: `nodePort` (external) → `port` (internal) → `targetPort` (container)

## 🔄 How Services Work

### 1. **Service Discovery**
```
Frontend Pod → lucky-web-app-service:4000
                    ↓
              lucky-number-app-service:3001
                    ↓
              Backend Pod
```

### 2. **Load Balancing**
- Services automatically distribute traffic across multiple pods
- If you have 4 backend pods, traffic is balanced among them
- Kubernetes handles the load balancing logic

### 3. **Label Selectors**
```yaml
selector:
  app: lucky-number
  tier: backend
```
This means: "Route traffic to any pod with these exact labels"

## 🚀 Deploying Services

### Step 1: Ensure Pods Are Running
```bash
# Check pod status
kubectl get pods

# Verify labels match service selectors
kubectl get pods --show-labels
```

### Step 2: Apply Service Manifests
```bash
# Deploy both services
kubectl apply -f k8s/services/

# Or deploy individually
kubectl apply -f k8s/services/lucky-number-app-service.yaml
kubectl apply -f k8s/services/lucky-web-app-service.yaml
```

### Step 3: Verify Services
```bash
# Check service status
kubectl get services

# Check service endpoints (which pods are selected)
kubectl get endpoints

# Get detailed service information
kubectl describe service lucky-number-app-service
```

## 🌐 Accessing Your Services

### 1. **Internal Access** (Backend Service)
```bash
# From within the cluster (e.g., from frontend pod)
curl http://lucky-number-app-service:3001/lucky

# Port forward for external testing
kubectl port-forward service/lucky-number-app-service 3001:3001
curl http://localhost:3001/lucky
```

### 2. **External Access** (Frontend Service)
```bash
# Access via NodePort (port 30000)
# Replace <node-ip> with your actual node IP
curl http://<node-ip>:30000

# Get node IP
kubectl get nodes -o wide

# Or use localhost if running locally
curl http://localhost:30000
```

## 🔍 Understanding Service Endpoints

### What Are Endpoints?
Endpoints are the actual IP addresses and ports of pods that match a service's selector.

```bash
# View endpoints
kubectl get endpoints

# Example output:
# NAME                      ENDPOINTS
# lucky-number-app-service  10.244.0.5:3001,10.244.0.6:3001
# lucky-web-app-service     10.244.0.7:4000
```

### Endpoint Lifecycle
1. **Service Created**: No endpoints initially
2. **Pods Created**: Endpoints automatically added
3. **Pods Deleted**: Endpoints automatically removed
4. **Labels Changed**: Endpoints updated based on new selector matches

## 🧪 Testing Service Communication

### 1. **Test Backend Service**
```bash
# Check if service exists
kubectl get service lucky-number-app-service

# Test internal communication
kubectl exec -it lucky-web-app -- curl http://lucky-number-app-service:3001/ping
```

### 2. **Test Frontend Service**
```bash
# Check NodePort service
kubectl get service lucky-web-app-service

# Test external access
curl http://localhost:30000
```

### 3. **Verify Load Balancing**
```bash
# If you have multiple backend pods, test multiple requests
for i in {1..10}; do
  kubectl exec -it lucky-web-app -- curl http://lucky-number-app-service:3001/lucky
done
```

## 🚨 Troubleshooting Common Issues

### 1. **Service Has No Endpoints**
```bash
# Check if pods are running
kubectl get pods

# Verify labels match selector
kubectl get pods --show-labels

# Check service selector
kubectl describe service <service-name>
```

### 2. **Can't Connect to Service**
```bash
# Check service endpoints
kubectl get endpoints <service-name>

# Verify pods are healthy
kubectl get pods -l app=<app-label>

# Check pod logs
kubectl logs <pod-name>
```

### 3. **NodePort Not Accessible**
```bash
# Verify NodePort service type
kubectl get service <service-name>

# Check if port is in use
netstat -tlnp | grep 30000

# Verify firewall rules
```

## 📚 Learning Objectives

After working with these service manifests, you should understand:

1. **Service Basics**: What services are and why they're needed
2. **Service Types**: ClusterIP vs NodePort vs LoadBalancer
3. **Label Selectors**: How services find and route to pods
4. **Port Mapping**: How external ports map to internal ports
5. **Service Discovery**: How pods communicate with each other

## 🔄 Next Steps

Services solve the networking problem, but there's more to learn:

1. **ReplicaSets**: How to scale your applications
2. **Deployments**: How to manage updates and rollbacks
3. **Ingress**: How to route external traffic to multiple services
4. **Network Policies**: How to control network access between pods

## 💡 Pro Tips

- **Always use services**: Never connect pods directly by IP
- **Label consistently**: Use the same label scheme across related resources
- **Test endpoints**: Verify that services are selecting the right pods
- **Use descriptive names**: Service names should clearly indicate their purpose
- **Monitor endpoints**: Services without endpoints won't route traffic

## 🔧 Advanced Service Features

### Session Affinity
```yaml
spec:
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800
```

### Multiple Ports
```yaml
spec:
  ports:
    - name: http
      port: 80
      targetPort: 8080
    - name: https
      port: 443
      targetPort: 8443
```

---

**Services are the networking backbone of Kubernetes! Ready to learn about scaling with ReplicaSets? 🚀** 