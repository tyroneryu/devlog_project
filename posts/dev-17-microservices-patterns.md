---
id: dev-16-microservices-patterns
title: Microservices Patterns: Strangler Fig, Saga, and Sidecar
excerpt: A comprehensive guide to decomposing monoliths. Implementing distributed transactions with Sagas and offloading infrastructure concerns with Sidecars.
date: 2024-06-25
tags: [Architecture, Microservices, System Design]
category: Dev
---

# The Monolith Decomposition Guide

Breaking apart a legacy monolith is one of the hardest tasks in software engineering. Doing it wrong results in a "Distributed Monolith"—a system with all the complexity of microservices and none of the benefits.

## 1. The Strangler Fig Pattern

Named after the fig tree that grows around a host tree and eventually replaces it.
*   **Strategy**: Instead of rewriting the whole app, place a proxy (API Gateway) in front of the legacy system.
*   **Implementation**: Route specific URLs (`/api/v2/orders`) to a new microservice while keeping the rest pointing to the legacy app. Over time, migrate more routes until the legacy app can be decommissioned.

## 2. The Saga Pattern (Distributed Transactions)

In a monolith, you have ACID transactions. In microservices, you have eventual consistency.
*   **Choreography**: Services listen to events (`OrderCreated`) and act independently. Simple but hard to track.
*   **Orchestration**: A central "Conductor" service tells others what to do (`Command: DeductInventory` -> `Command: ChargeCard`). Better for complex flows.

## 3. The Sidecar Pattern

Offload infrastructure concerns (Logging, SSL, Monitoring) to a separate container running alongside your application container.
*   **Example**: Envoy Proxy or Istio. The app talks to `localhost`, and the Sidecar handles the mTLS encryption and service discovery transparently.
