---
id: dev-24-observability
title: The Three Pillars of Observability: Logs, Metrics, Traces
excerpt: Why monitoring is different from observability. Implementing OpenTelemetry to visualize request flows across microservices.
date: 2024-05-02
tags: [Observability, Monitoring, OpenTelemetry, DevOps]
category: Dev
---

# "Why is the system slow?"

Monitoring tells you *that* the system is slow. Observability tells you *why*.

## 1. Metrics (Aggregatable)
"What is the average latency?" "What is the CPU usage?"
*   Tools: Prometheus, Grafana.
*   Use for: Alerts and high-level health trends.

## 2. Logs (Discrete Events)
"Database connection failed at 10:00:01."
*   Tools: ELK Stack (Elasticsearch, Logstash, Kibana), Loki.
*   Use for: Debugging specific errors.

## 3. Traces (Context)
"Request ID 123 hit the Load Balancer -> Auth Service (50ms) -> Database (2000ms)."
*   **OpenTelemetry**: The industry standard for distributed tracing. By passing a `Trace-ID` header between services, you can visualize the waterfall of a single user request across 50 microservices to find the bottleneck.
