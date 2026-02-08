---
id: dev-21-system-design-interview
title: Cracking the System Design Interview: Designing Twitter
excerpt: A step-by-step framework for senior engineer interviews. Fan-out service, timeline generation, and hybrid approaches for celebrity users.
date: 2024-06-05
tags: [Career, System Design, Architecture, Interview]
category: Dev
---

# The Framework

1.  **Requirements**: Functional (Post tweet, view timeline) & Non-Functional (High availability, eventual consistency ok).
2.  **Back-of-Envelope Math**: 200M DAU, 500M tweets/day. Calculate storage (text vs media) and Bandwidth.

## The Core Problem: Timeline Delivery

**Pull Model (Fan-out on Load)**:
When User A requests their timeline, query the DB for all people they follow, sort by time, and merge.
*   *Pros*: Simple writes.
*   *Cons*: Slow reads for users following 5k people.

**Push Model (Fan-out on Write)**:
When User A tweets, push that tweet ID to the pre-computed timeline cache (Redis List) of all their followers.
*   *Pros*: Instant reads (O(1)).
*   *Cons*: The "Justin Bieber" problem. If a user has 100M followers, writing to 100M caches takes too long.

## The Hybrid Solution

*   **Normal Users**: Use Push model.
*   **Celebrities**: Use Pull model.
*   **Timeline Assembly**: Merge the pre-computed cache with a dynamic query for the celebrities the user follows.
