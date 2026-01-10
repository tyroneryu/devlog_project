---
id: dev-10-graphql
title: GraphQL vs REST for Mobile Apps
excerpt: Why GraphQL's ability to fetch exact data reduces bandwidth usage for conference apps.
date: 2023-12-05
tags: [GraphQL, API, Mobile]
category: Dev
---

# Over-fetching and Under-fetching

In a conference app, a "Session List" view might need:
*   Session Title
*   Speaker Name
*   Room Number

A REST API might return the *entire* Speaker object (bio, social links, photos), wasting bandwidth.

**GraphQL** solves this by letting the client ask for exactly what it needs:
```graphql
query {
  sessions {
    title
    room
    speaker {
      name
    }
  }
}
```
This is crucial for venue Wi-Fi, which is often congested.