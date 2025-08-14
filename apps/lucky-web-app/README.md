# Lucky Number Frontend Web App

## 🎯 What This Application Does

This is a React-based web application that serves as the frontend for our Lucky Number system. It demonstrates how to build containerized web applications that communicate with backend services in Kubernetes. The app fetches lucky numbers from the backend API and displays them in a user-friendly interface.

## 🏗️ Architecture

- **Framework**: React with Server-Side Rendering (SSR)
- **Port**: 4000 (configurable via PORT environment variable)
- **Purpose**: Display lucky numbers from the backend API
- **Features**: SSR, health checking, error handling, responsive design

## 🔧 Key Components

### 1. Server (`server.js`)
The main Express server that:
- Serves the React application
- Fetches data from the backend API
- Implements health checking
- Handles server-side rendering

### 2. React Component (`LuckyPage.jsx`)
A simple React component that displays the lucky number with styling.

## 📋 API Integration

### Backend Communication
The frontend communicates with the backend through:
- **Environment Variable**: `LUCKY_API_URL` (defaults to `http://lucky-number-app/lucky`)
- **Health Check**: Uses `/ping` endpoint to verify backend availability
- **Data Fetching**: Retrieves lucky numbers from `/lucky` endpoint

### Health Check Logic
```javascript
async function checkLuckyNumberApp() {
  try {
    const res = await fetch(PING_URL, { timeout: 2000 });
    if (!res.ok) throw new Error('Ping failed');
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('Ping returned unexpected status');
    return true;
  } catch (err) {
    console.error('Could not reach lucky-number-app /ping endpoint:', err.message);
    return false;
  }
}
```

**Why?** This demonstrates:
- **Service Discovery**: How frontend finds backend services
- **Health Checking**: Ensuring dependencies are available
- **Graceful Degradation**: Handling service unavailability

## 🚀 Running Locally

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager
- Backend service running (or mock the API)

### Installation
```bash
cd apps/lucky-web-app
npm install
```

### Development Mode
```bash
npm start
# or
node server.js
```

### Production Mode
```bash
NODE_ENV=production node server.js
```

## 🐳 Docker Build

### Build Image
```bash
docker build -t kubernates-example/lucky-web-app:latest .
```

### Run Container
```bash
docker run -p 4000:4000 kubernates-example/lucky-web-app:latest
```

### Test Locally
```bash
curl http://localhost:4000
# Should return HTML with a lucky number
```

## 🔍 Kubernetes Integration

### Environment Variables
- `PORT`: Server port (default: 4000)
- `LUCKY_API_URL`: Backend service URL (default: `http://lucky-number-app/lucky`)

### Service Discovery
The app uses Kubernetes service names for communication:
- **Internal Communication**: `http://lucky-number-app/lucky`
- **Service Mesh Ready**: Can easily integrate with Istio or Linkerd

### Health Checking
The startup health check ensures:
- Backend service is available before starting
- Graceful failure if dependencies are missing
- Proper error logging for debugging

## 🧪 Testing Scenarios

### 1. Basic Functionality
```bash
curl http://localhost:4000
# Should return HTML with a lucky number
```

### 2. Health Check
```bash
# The app won't start if backend is unavailable
# This demonstrates dependency management
```

### 3. Load Testing
```bash
# Test multiple concurrent requests
for i in {1..10}; do
  curl http://localhost:4000 &
done
wait
```

### 4. Backend Failure Simulation
```bash
# Stop the backend service and restart the frontend
# Should see startup failure with proper error logging
```

## 🎨 UI Features

### Responsive Design
- Centered layout with clean typography
- Large, readable lucky number display
- Professional color scheme (#2b7a78)

### Server-Side Rendering
- React components rendered on the server
- Fast initial page load
- SEO-friendly HTML output

## 🚨 Troubleshooting

### Common Issues

1. **Backend connection failed**
   ```bash
   # Check if backend service is running
   kubectl get pods -l app=lucky-number
   
   # Check service endpoints
   kubectl get endpoints lucky-number-app-service
   ```

2. **Port conflicts**
   ```bash
   # Check what's using port 4000
   lsof -i :4000
   ```

3. **Environment variable issues**
   ```bash
   # Verify LUCKY_API_URL is set correctly
   kubectl describe pod lucky-web-app
   ```

### Debug Commands
```bash
# Check container logs
docker logs <container_id>

# Exec into container
docker exec -it <container_id> /bin/sh

# Test backend connectivity from container
curl http://lucky-number-app:3001/ping
```

## 📚 Learning Objectives

After working with this application, you should understand:

1. **Frontend-Backend Communication**: How services communicate in Kubernetes
2. **Service Discovery**: Using Kubernetes service names for networking
3. **Health Checking**: Implementing dependency health checks
4. **Error Handling**: Graceful degradation when services are unavailable
5. **Containerized Web Apps**: Building and deploying React applications

## 🔄 Next Steps

1. **Add More UI Components**: Implement a dashboard or statistics
2. **Implement Caching**: Add Redis for performance optimization
3. **Add Authentication**: Implement user login/logout
4. **Real-time Updates**: Add WebSocket support for live updates
5. **Monitoring Integration**: Add Prometheus metrics and Grafana dashboards

## 🌐 Accessing the Application

### Local Development
- **Frontend**: http://localhost:4000
- **Backend**: http://localhost:3001

### Kubernetes Deployment
- **NodePort**: 30000 (configurable in service manifest)
- **Access URL**: http://localhost:30000

### Service URLs
- **Frontend Service**: `lucky-web-app-service:4000`
- **Backend Service**: `lucky-number-app-service:3001`

---

**Ready to see your lucky numbers? Deploy this to Kubernetes and access it through the NodePort service! 🎲** 