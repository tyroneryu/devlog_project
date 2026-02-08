---
id: dev-27-ai-fine-tuning
title: Fine-Tuning LLMs: LoRA and PEFT
excerpt: How to customize Llama 3 or Mistral on consumer hardware. Parameter-Efficient Fine-Tuning explained.
date: 2024-04-01
tags: [AI, LLM, Python, Fine-tuning]
category: Dev
---

# Customizing the Brain

Training a model from scratch costs millions. Fine-tuning a pre-trained model teaches it your specific domain (e.g., Medical jargon or Legal contracts).

## The Challenge: VRAM
Full fine-tuning updates all 7 Billion parameters. This requires massive GPU memory (A100s).

## LoRA (Low-Rank Adaptation)
Instead of updating the whole weight matrix $W$, we inject two small matrices $A$ and $B$ such that $\Delta W = A \times B$.
*   We freeze the original model weights.
*   We only train $A$ and $B$.
*   **Result**: You can fine-tune a 7B model on a single 24GB consumer GPU (RTX 3090/4090) in a few hours.

## Quantization (QLoRA)
Compressing weights from 16-bit floats to 4-bit integers. This slashes memory usage by 4x with minimal accuracy loss, making local AI development accessible.
