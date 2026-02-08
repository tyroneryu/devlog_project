---
id: dev-13-edge-computing
title: Edge Computing: Architecture Patterns for Low Latency
excerpt: Moving compute closer to the user. Solving the 'Database Latency' problem in Edge environments using Cloudflare Workers and global read replicas.
date: 2024-04-15
tags: [Edge, Cloudflare, Serverless, System Design]
category: Dev
---

# The Physics of Latency

The speed of light is finite. A request from Seoul to a server in Virginia (US-East) takes roughly 200ms round-trip. For a dynamic application requiring multiple round trips, this latency becomes perceptible and painful.

**Edge Computing** solves this by running your code in hundreds of data centers simultaneously. When a user in Tokyo requests your site, the code executes in the Tokyo node. When a user in London requests it, it runs in London.

## The Challenge: State is Heavy

Compute is easy to move. State (Databases) is hard. If your code runs in Tokyo but your SQL database is in Virginia, you still incur the latency penalty during the query.

### Pattern 1: Global Read Replicas with Local Writes

For read-heavy applications (blogs, e-commerce product pages), use read replicas.
*   **Primary DB**: US-East (Virginia).
*   **Read Replicas**: Tokyo, Frankfurt, Sydney, Sao Paulo.
*   **Routing**: The Edge function detects the region and connects to the nearest replica for `SELECT` queries. `INSERT/UPDATE` queries are routed to the Primary.

### Pattern 2: HTTP-based Database Drivers

Traditional DB drivers (Postgres/MySQL) use TCP sockets, which are often incompatible or inefficient in Edge environments (like Cloudflare Workers which run on V8 Isolates, not Node.js containers).

Solutions like **Neon (Serverless Postgres)** or **PlanetScale** allow connection via HTTP or WebSockets, managing connection pooling on their side.

```typescript
// Cloudflare Worker Example with Neon
import { Client } from '@neondatabase/serverless';

export default {
  async fetch(request, env) {
    const client = new Client(env.DATABASE_URL);
    await client.connect();
    const { rows } = await client.query('SELECT * FROM users LIMIT 10');
    // The connection overhead is minimal due to HTTP/2 multiplexing
    return new Response(JSON.stringify(rows));
  }
};
```

## Durable Objects & Consistency

What if you need strong consistency, like a real-time chat or a collaborative document?
Cloudflare's **Durable Objects** provide a unique solution: creating a single instance of a class that lives in a specific region. All requests for "Chat Room A" are routed to that specific instance, guaranteeing that memory is shared and consistent.

## Conclusion

Edge computing is shifting us from "Monoliths" to "Distributed Systems by Default." It requires rethinking how we handle database connections, caching, and consistency, but the reward is an application that feels instant for every user on the planet.
