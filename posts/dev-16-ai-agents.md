---
id: dev-16-ai-agents
title: Building Autonomous AI Agents with LangChain
excerpt: Creating loops of thought where LLMs can use tools, browse the web, and execute code to solve complex multi-step problems.
date: 2024-05-05
tags: [AI, LangChain, Python]
category: Dev
---

# From Chatbots to Agents

A chatbot answers a question. An **Agent** pursues a goal.

Using frameworks like LangChain or AutoGen, we can give an LLM a toolkit (Calculator, Google Search, Python REPL) and a loop:

1.  **Think**: What do I need to do to answer the user request?
2.  **Act**: Use a tool (e.g., Search "Weather in Seoul").
3.  **Observe**: Read the tool output.
4.  **Repeat**: If the goal isn't met, think again based on new data.

## Challenges: Loops and hallucinations

Agents are prone to getting stuck in infinite loops or hallucinating tool outputs. Implementing "Guardrails"—checks that verify the agent's output before execution—is crucial for production systems. For example, before an agent executes a SQL query, a validator should check that it is essentially a read-only operation and doesn't drop tables.
