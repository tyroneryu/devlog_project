---
id: dev-23-ci-cd-pipelines
title: Optimizing GitHub Actions Pipelines
excerpt: Strategies to cut CI times by 50%. Matrix builds, caching node_modules, and using self-hosted runners for heavy workloads.
date: 2024-05-15
tags: [CI/CD, GitHub Actions, DevOps]
category: Dev
---

# Waiting for Builds is Expensive

Developer time is expensive. Waiting 20 minutes for a CI pipeline kills flow.

## 1. Dependency Caching

Downloading `node_modules` every time is slow.
```yaml
- uses: actions/setup-node@v3
  with:
    node-version: 18
    cache: 'npm'
```
This simple change uses the `package-lock.json` hash to restore modules from cache instantly.

## 2. Parallelism & Matrix Strategy

Don't run Unit Tests, Linting, and Build sequentially. Run them in parallel.
For E2E tests, use a Matrix to split the load.
```yaml
strategy:
  matrix:
    shard: [1/4, 2/4, 3/4, 4/4]
run: npx playwright test --shard=${{ matrix.shard }}
```
This cuts a 20-minute test suite down to 5 minutes (plus overhead).

## 3. Path Filtering

If you change a Markdown file in `docs/`, don't trigger the Backend Build.
```yaml
on:
  push:
    paths-ignore:
      - 'docs/**'
      - '**.md'
```
