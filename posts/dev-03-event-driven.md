---
id: dev-03-event-driven
title: Event-Driven Architecture: Decoupling Microservices
excerpt: How to build scalable, resilient systems by decoupling services using message queues like RabbitMQ or Kafka. A look at the Saga pattern and eventual consistency.
date: 2024-01-10
tags: [System Design, Architecture, Microservices, Kafka]
category: Dev
---

# Decoupling with Events: A Guide to EDA

In the early stages of a startup, a monolithic architecture is often the correct choice. It's simple to deploy, debug, and test. However, as applications scale—especially in complex domains like MICE (Meetings, Incentives, Conferences, Exhibitions)—tight coupling between modules can become a bottleneck.

If the "Email Service" is down, should the "Registration Service" fail to register a user? In a tightly coupled synchronous system, the answer is often yes. This is where **Event-Driven Architecture (EDA)** shines.

## The Core Concept

In EDA, services do not call each other directly (e.g., via HTTP REST). Instead, they communicate by emitting and listening for **events**.

*   **Command**: "Do this" (Expects a response, synchronous).
*   **Event**: "This happened" (Fire and forget, asynchronous).

### Scenario: Event Registration

**Synchronous (Bad for Scale):**
1.  User clicks "Register".
2.  Registration Service creates record in DB.
3.  Registration Service calls Email Service API. -> *What if this times out?*
4.  Registration Service calls Invoice Service API. -> *What if this throws 500?*
5.  Registration Service returns "Success" to user.

**Event-Driven (Resilient):**
1.  User clicks "Register".
2.  Registration Service creates record in DB.
3.  Registration Service publishes `USER_REGISTERED` event to a Message Queue (e.g., RabbitMQ, Kafka).
4.  Registration Service returns "Success" to user immediately.

**Independently:**
*   **Email Service** subscribes to `USER_REGISTERED`. It consumes the message and sends the email. If it fails, it retries later.
*   **Invoice Service** subscribes to `USER_REGISTERED`. It generates the PDF invoice.
*   **Analytics Service** subscribes to `USER_REGISTERED`. It updates the real-time dashboard.

## Handling Failure: Dead Letter Queues (DLQ)

What happens if the Email Service fails to process the message 5 times in a row? We don't want to lose that message, nor do we want to block the queue processing other users.

We move the failed message to a **Dead Letter Queue (DLQ)**. This is a special queue for "poison messages" that need manual inspection or a separate automated retry process with a longer backoff strategy.

## The Saga Pattern for Distributed Transactions

One downside of EDA is managing transactions across services. If the Invoice Service fails but the Registration Service succeeded, we have an inconsistent state. Since we can't use a database transaction across two different services, we use the **Saga Pattern**.

**Choreography-based Saga**:
Each service listens for events and decides what action to take.
1.  `RegistrationCreated` -> Invoice Service attempts to charge.
2.  `ChargeFailed` -> Invoice Service emits failure event.
3.  `ChargeFailed` -> Registration Service listens and **compensates** (cancels the registration).

## Conclusion

Event-Driven Architecture introduces complexity: you need to manage a message broker, handle idempotent consumers (processing the same message twice shouldn't break things), and reason about eventual consistency.

However, the benefits in **decoupling**, **scalability**, and **resilience** are immense. Services can scale independently, failures are isolated, and adding new features (like a new notification system) requires zero changes to the existing Registration Service—you just add a new consumer.