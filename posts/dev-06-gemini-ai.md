---
id: dev-06-gemini-ai
title: Integrating Multimodal AI with Gemini
excerpt: Building a 'Vision Terminal' that can analyze images and code snippets using the Google Gemini API. Function calling, JSON mode, and multimodal prompting.
date: 2024-06-20
tags: [AI, LLM, Gemini, API, Google Cloud]
category: Dev
---

# Beyond Text: The Power of Multimodal AI

Large Language Models (LLMs) have evolved. We are no longer limited to "Text In, Text Out." With models like **Google's Gemini**, we have entered the era of **Multimodal AI**, where the model can natively understand and reason across text, images, audio, and video.

In this portfolio, I integrated the Gemini API to create features like the "Retro Vision Terminal" and the "Synergy Engine." Here is what I learned about building practical applications with this technology.

## Multimodal Prompting

The ability to send an image alongside a text prompt changes everything. Instead of describing a UI bug to an AI ("There is a button that is misaligned..."), you can simply pass a screenshot.

### Implementation Example

To analyze an image using the `@google/genai` SDK:

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function analyzeImage(base64Image: string) {
  const model = 'gemini-3-flash-preview';
  
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: "image/png"
    }
  };

  const prompt = "Analyze this UI screenshot. Identify accessibility issues and suggest CSS fixes.";

  const result = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [imagePart, { text: prompt }]
    }
  });

  return result.text;
}
```

This single call replaces what used to require a complex pipeline of OCR (Optical Character Recognition) + Object Detection + NLP.

## Structured Output (JSON Mode)

One of the biggest challenges with LLMs is getting deterministic output. If you are building an app, you don't want a paragraph of text; you often want a JSON object to render a UI component.

Gemini supports **Response Schema** configuration. By defining the schema, you force the model to output valid JSON conforming to your types.

```typescript
config: {
  responseMimeType: "application/json",
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      bugSeverity: { type: Type.STRING, enum: ["Low", "High"] },
      suggestedFix: { type: Type.STRING }
    }
  }
}
```

This makes the AI output "code-ready" immediately, removing the need for fragile regex parsing on the client side.

## Function Calling for Real-Time Data

LLMs are frozen in time (their training data cut-off). To make them useful for current events—like checking if a venue is available *today*—we use **Function Calling (Tools)**.

We describe a function to the model (e.g., `checkVenueAvailability(date)`). If the user asks "Can I book the hall next Friday?", the model doesn't guess. It returns a structured request to call that function. The app executes the code, gets the real data from the database, and passes it back to the model to generate the final natural language answer.

## Conclusion

Integrating Gemini isn't just about adding a chatbot. It's about creating **intelligent interfaces**. Whether it's analyzing a user's uploaded photo for a profile, generating dynamic layout suggestions based on content, or automating data entry from scanned documents, multimodal AI is a new primitive in the software engineer's toolkit.