---
id: dev-08-docker
title: Docker Multi-Stage Builds
excerpt: How to reduce your container image size from 1GB to 50MB for faster deployments.
date: 2024-03-01
tags: [Docker, DevOps, CI/CD]
category: Dev
---

# Slimming Down Containers

A common mistake is shipping the entire `node_modules` including devDependencies to production.

## Multi-Stage Build Pattern
1.  **Builder Stage**: Install all dependencies, build the TypeScript/React code.
2.  **Runner Stage**: Copy **only** the build output (`dist/`) and production dependencies to a lightweight Alpine Linux image.

This results in faster auto-scaling and lower storage costs.