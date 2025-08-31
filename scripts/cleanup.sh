#!/bin/bash

# Cleanup Kubernetes resources

echo "Cleaning up DOB Facts application from Kubernetes..."

# Delete all resources in the namespace
kubectl delete namespace dob-facts-app

echo "Cleanup complete!"