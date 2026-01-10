---
id: dev-09-microfrontends
title: Is Micro-Frontend Overkill?
excerpt: analyzing the pros and cons of splitting a frontend application into multiple independent deployments.
date: 2023-11-15
tags: [Architecture, Frontend, Webpack]
category: Dev
---

# To Federation or Not?

Module Federation allows different teams to deploy parts of a website independently (e.g., Header, Checkout, Catalog).

## Pros
*   Independent deployments.
*   Tech stack agnosticism (careful with this).

## Cons
*   Complexity in sharing state.
*   Performance overhead (loading multiple React instances if not shared properly).

For most projects, a **Monorepo** is a better starting point than Micro-frontends.