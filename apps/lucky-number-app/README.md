# Lucky Number Backend API

## 🎯 What This Application Does

This is a simple Node.js Express API that generates random lucky numbers. It's designed to teach Kubernetes concepts by providing a basic backend service that can be scaled, load balanced, and managed in a cluster.

## 🏗️ Architecture

- **Framework**: Express.js
- **Port**: 3001 (configurable via PORT environment variable)
- **Purpose**: Generate random 4-digit lucky numbers
- **Features**: Startup delay simulation, request processing simulation, crash endpoint for testing

## 📋 API Endpoints

### 1. `GET /lucky`
Generates and returns a random 4-digit lucky number.

**Response:**
```json
{
  "luckyNumber": 8473
}
```

**Features:**
- Simulates 5-second processing time (busy wait)
- Logs pod name for Kubernetes debugging
- Returns random number between 1000-9999

### 2. `GET /ping`
Health check endpoint for Kubernetes liveness/readiness probes.

**Response:**
```json
{
  "status": "ok"
}
```

### 3. `GET /crash`
Intentionally crashes the server for testing Kubernetes restart behavior.

**Response:**
```json
{
  "message": "Server will crash now!"
}
```

## 🔧 Key Features Explained

### Startup Delay Simulation
```javascript
const startupDelay = async () => {
  console.log('App is starting... please wait');
  await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds delay
  console.log('App2 is ready!');
};
```

**Why?** This simulates real-world applications that take time to initialize (database connections, cache warming, etc.). In Kubernetes, this helps demonstrate:
- Pod startup behavior
- Liveness probe timing
- Service readiness

### Busy Wait Processing
```javascript
function busyWait(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Do nothing — just keep checking time
  }
}
```

**Why?** This simulates CPU-intensive work and helps demonstrate:
- Resource utilization
- Request queuing
- Load balancing effectiveness

### Pod Name Environment Variable
```javascript
const podName = process.env.POD_NAME;
console.log("Running on pod:", podName);
```

**Why?** In Kubernetes, this shows:
- Which pod is handling each request
- Load balancing distribution
- Pod lifecycle management

## 🚀 Running Locally

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager

### Installation
```bash
cd apps/lucky-number-app
npm install
```

### Development Mode
```bash
npm start
# or
node app.js
```

### Production Mode
```bash
NODE_ENV=production node app.js
```

## 🐳 Docker Build

### Build Image
```bash
docker build -t kubernates-example/lucky-number-app:latest .
```

### Run Container
```bash
docker run -p 3001:3001 kubernates-example/lucky-number-app:latest
```

### Test Locally
```bash
curl http://localhost:3001/lucky
curl http://localhost:3001/ping
```

## 🔍 Kubernetes Integration

### Environment Variables
- `PORT`: Server port (default: 3001)
- `POD_NAME`: Automatically set by Kubernetes from pod metadata

### Health Checks
The `/ping` endpoint is perfect for:
- **Liveness Probes**: Check if the container is running
- **Readiness Probes**: Check if the container is ready to receive traffic

### Resource Management
The busy wait function helps demonstrate:
- CPU resource limits
- Horizontal Pod Autoscaling (HPA)
- Resource monitoring

## 🧪 Testing Scenarios

### 1. Basic Functionality
```bash
curl http://localhost:3001/lucky
# Should return a random 4-digit number
```

### 2. Health Check
```bash
curl http://localhost:3001/ping
# Should return {"status": "ok"}
```

### 3. Crash Testing
```bash
curl http://localhost:3001/crash
# Should crash the server (useful for testing Kubernetes restart policies)
```

### 4. Load Testing
```bash
# Test multiple concurrent requests
for i in {1..10}; do
  curl http://localhost:3001/lucky &
done
wait
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using port 3001
   lsof -i :3001
   # Kill the process or change PORT environment variable
   ```

2. **Slow startup**
   - The 5-second startup delay is intentional
   - Check logs: `docker logs <container_id>`

3. **High CPU usage**
   - The busy wait function intentionally uses CPU
   - This is normal behavior for demonstration purposes

### Debug Commands
```bash
# Check container logs
docker logs <container_id>

# Exec into container
docker exec -it <container_id> /bin/sh

# Check resource usage
docker stats <container_id>
```

## 📚 Learning Objectives

After working with this application, you should understand:

1. **Container Lifecycle**: How containers start, run, and restart
2. **Resource Management**: CPU usage patterns and monitoring
3. **Health Checks**: Why and how to implement them
4. **Environment Variables**: How to pass configuration to containers
5. **Logging**: Best practices for containerized applications

## 🔄 Next Steps

1. **Deploy to Kubernetes**: Use the manifests in `k8s/` directory
2. **Add Monitoring**: Integrate with Prometheus/Grafana
3. **Implement Caching**: Add Redis for performance
4. **Add Authentication**: Implement JWT or OAuth
5. **Database Integration**: Connect to PostgreSQL or MongoDB

---

**Ready to deploy this to Kubernetes? Check out the manifests in the `k8s/` directory! 🚀** 