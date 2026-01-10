---
id: dev-07-system-design
title: Caching Strategies: Redis vs CDN
excerpt: Understanding when to cache at the edge vs when to cache at the application layer.
date: 2024-02-10
tags: [System Design, DevOps, Performance]
category: Dev
---

# Layered Caching

Performance is critical for high-traffic event sites. We use a multi-layered caching strategy.

*   **Browser Cache**: Static assets (CSS, JS, Images). Low latency, zero server load.
*   **CDN (Cloudflare/AWS CloudFront)**: Caches HTML pages at the edge. Great for content that doesn't change often per user.
*   **Application Cache (Redis)**: Caches expensive database queries (e.g., "Get all speakers").

Knowing **what** to invalidate and **when** is the hardest part of computer science.