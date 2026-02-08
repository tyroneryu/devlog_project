---
id: dev-18-database-sharding
title: Database Sharding Strategies: Horizontal Scaling
excerpt: When replication isn't enough. Deep dive into sharding keys, consistent hashing, and handling the 'hot partition' problem.
date: 2024-06-18
tags: [Database, Scaling, System Design, SQL]
category: Dev
---

# When `ORDER BY` Kills Your Server

Read Replicas solve read scaling. But what happens when your dataset is too large for a single disk, or your write volume exceeds a single primary's IOPS? You Shard.

## Horizontal vs Vertical Partitioning

*   **Vertical**: Moving columns to different tables (e.g., separating `blob_data` from `user_metadata`).
*   **Horizontal (Sharding)**: Splitting rows across multiple servers based on a **Shard Key**.

## Choosing a Shard Key

This is the most critical decision.
1.  **Range Based**: `UserIDs 1-1000` go to Server A.
    *   *Problem*: New users are always "hot". Server Z gets all the traffic; Server A is idle.
2.  **Hash Based**: `hash(UserID) % 4` determines the server.
    *   *Benefit*: Even distribution.
    *   *Problem*: Resharding. Changing from 4 to 5 servers requires moving almost all data.

## Consistent Hashing

Used by DynamoDB and Cassandra. Data is mapped to a "Ring". Adding a node only requires moving data from its immediate neighbor, not the whole cluster. This is essential for elastic scaling.
