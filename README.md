# DOB Analyser

## 📌 Project Overview
DOB Analyser is a full-stack application designed to analyze and process Date of Birth (DOB) facts.  
The project uses a **React frontend**, a **Python backend**, and is deployed with **Docker** and **Kubernetes**.  

Additionally, the backend integrates **Temporal server workflows** to ensure high availability and reliability for distributed workflow execution.

---

## 🛠 Tech Stack
- **Frontend**: React  
- **Backend**: Python  
- **DevOps**:  
  - Docker  
  - Kubernetes (Deployments, Services, ConfigMaps)  
- **Workflow Engine**: Temporal Server  

---

## 🚀 Features
- React-based user interface for DOB input and results display.  
- Python backend API for processing and workflow orchestration.  
- Temporal workflows integrated into backend for high availability.  
- Dockerized setup for easy containerization.  
- Kubernetes deployments for scalable and fault-tolerant infrastructure.  

---

## ⚙️ Setup Instructions

### 1️⃣ Build Docker Images
Navigate to project root and build images for frontend & backend:
# Build frontend image
docker build -t project-frontend:latest ./frontend

# Build backend image
docker build -t backend:v1 ./backend


2️⃣ Deploy to Kubernetes
kubectl apply -f k8s/

3️⃣ Verify Deployments
kubectl get pods -n dob-facts-app
kubectl get svc -n dob-facts-app

4️⃣ Access Application
kubectl port-forward -n dob-facts-app service/dob-facts-frontend-service 3000:80
Open In browser
http://localhost:3000


![Uploading image.png…]()

  
