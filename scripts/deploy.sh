#!/bin/bash

# Deploy to Kubernetes

echo "Deploying DOB Facts application to Kubernetes..."

# Apply namespace
kubectl apply -f k8s/namespace.yaml

# Apply ConfigMap
kubectl apply -f k8s/configmap.yaml

# Deploy backend
kubectl apply -f k8s/backend-deployment.yaml

# Deploy frontend
kubectl apply -f k8s/frontend-deployment.yaml

# Apply ingress
kubectl apply -f k8s/ingress.yaml

echo "Deployment complete!"
echo ""
echo "Check deployment status:"
echo "kubectl get pods -n dob-facts-app"
echo ""
echo "Access the application:"
echo "kubectl port-forward -n dob-facts-app service/dob-facts-frontend-service 3000:80"
echo "Then visit: http://localhost:3000"