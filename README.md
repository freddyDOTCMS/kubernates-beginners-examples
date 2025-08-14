# Kubernetes Beginners Tutorial: Lucky Number Application

Welcome to this hands-on Kubernetes tutorial! In this project, you'll learn Kubernetes fundamentals by deploying a simple "Lucky Number" application. This tutorial covers everything from basic Pods to advanced concepts like Deployments, Services, and ReplicaSets.

## 🎯 What You'll Learn

- **Kubernetes Basics**: Pods, Services, Deployments, and ReplicaSets
- **Container Orchestration**: How to manage multiple application instances
- **Service Discovery**: How applications communicate in Kubernetes
- **Scaling**: How to scale your applications up and down
- **Load Balancing**: How Kubernetes distributes traffic across pods

## 🏗️ Architecture Overview

Our application consists of two main components:

1. **Backend Service** (`lucky-number-app`): A Node.js API that generates random lucky numbers
2. **Frontend Service** (`lucky-web-app`): A React web application that displays the lucky numbers

```
┌─────────────────┐    ┌──────────────────┐
│   Web Browser  │────│  lucky-web-app  │
│   (Port 30000) │    │   (Port 4000)   │
└─────────────────┘    └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ lucky-number-app │
                       │   (Port 3001)   │
                       └──────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Docker installed and running
- Kubernetes cluster (Minikube, Docker Desktop, or cloud provider)
- `kubectl` command-line tool

### Quick Start

1. **Build the Docker images:**
   ```bash
   # Build backend image
   cd apps/lucky-number-app
   docker build -t kubernates-example/lucky-number-app:latest .
   
   # Build frontend image
   cd ../lucky-web-app
   docker build -t kubernates-example/lucky-web-app:latest .
   ```

2. **Deploy to Kubernetes:**
   ```bash
   # Start with basic pods
   kubectl apply -f k8s/pods/
   
   # Or jump straight to the full deployment
   kubectl apply -f k8s/deploy/
   kubectl apply -f k8s/services/
   ```

3. **Access the application:**
   ```bash
   # Get the NodePort for the web app
   kubectl get svc lucky-web-app-service
   
   # Access via: http://localhost:30000
   ```

## 📁 Project Structure

```
kubernates-beginners-examples/
├── apps/                          # Application source code
│   ├── lucky-number-app/         # Backend API service
│   └── lucky-web-app/            # Frontend web service
├── k8s/                          # Kubernetes manifests
│   ├── pods/                     # Basic pod definitions
│   ├── services/                 # Service definitions
│   ├── replicaset/               # ReplicaSet for scaling
│   └── deploy/                   # Deployment manifests
└── README.md                     # This file
```

## 🎓 Learning Path

### Step 1: Understanding Pods
Start with the basic pod definitions in `k8s/pods/` to understand how containers run in Kubernetes.

### Step 2: Adding Services
Learn about service discovery with the manifests in `k8s/services/`.

### Step 3: Scaling with ReplicaSets
Understand horizontal scaling using the ReplicaSet in `k8s/replicaset/`.

### Step 4: Production Deployments
Master deployment strategies with the manifests in `k8s/deploy/`.

## 🔧 Key Concepts Explained

### Pods
Pods are the smallest deployable units in Kubernetes. Each pod can contain one or more containers.

### Services
Services provide stable network endpoints for pods, enabling communication between different parts of your application.

### ReplicaSets
ReplicaSets ensure a specified number of pod replicas are running at any given time.

### Deployments
Deployments provide declarative updates for Pods and ReplicaSets, with features like rolling updates and rollbacks.

## 🧪 Testing Your Setup

1. **Check pod status:**
   ```bash
   kubectl get pods
   ```

2. **View service endpoints:**
   ```bash
   kubectl get endpoints
   ```

3. **Test the API directly:**
   ```bash
   kubectl port-forward lucky-number-app 3001:3001
   curl http://localhost:3001/lucky
   ```

4. **Check logs:**
   ```bash
   kubectl logs lucky-number-app
   ```

## 🚨 Troubleshooting

### Common Issues

- **Image pull errors**: Make sure you've built the Docker images locally
- **Port conflicts**: Check if ports 3001, 4000, or 30000 are already in use
- **Service connection issues**: Verify that service selectors match pod labels

### Debug Commands

```bash
# Describe resources for detailed information
kubectl describe pod lucky-number-app
kubectl describe service lucky-number-app-service

# Check events
kubectl get events --sort-by='.lastTimestamp'

# Exec into a pod for debugging
kubectl exec -it lucky-number-app -- /bin/sh
```

## 📚 Next Steps

After mastering this tutorial, explore:

- **ConfigMaps and Secrets**: For configuration management
- **Persistent Volumes**: For data storage
- **Ingress Controllers**: For external traffic management
- **Helm Charts**: For package management
- **Monitoring and Logging**: Prometheus, Grafana, ELK stack

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve this tutorial!

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Kubernetes Learning! 🚀** 