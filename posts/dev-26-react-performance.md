---
id: dev-26-react-performance
title: Advanced React Performance Tuning
excerpt: Profiling renders, identifying unnecessary re-renders, virtualization for long lists, and using Web Workers for heavy calculation.
date: 2024-04-10
tags: [React, Performance, Optimization]
category: Dev
---

# Stop the Re-renders

React is fast, but bad code makes it slow.

## 1. The Profiler
Use the React DevTools Profiler. Look for "Commits" where the render time is yellow or red. Check "Why did this render?" usually it's `props changed`.

## 2. Memoization (`useMemo`, `useCallback`)
Don't wrap everything. Wrap objects/arrays passed as props to children wrapped in `React.memo`.
*   *Bad*: Passing a new inline function `() => handleClick()` every render breaks the child's memoization.

## 3. Virtualization
Rendering 10,000 rows in a DOM kills the browser.
Use `react-window` or `tanstack-virtual`. It only renders the 10 items visible in the viewport. As you scroll, it recycles the DOM nodes.

## 4. Interaction to Next Paint (INP)
Move heavy logic (filtering large arrays, crypto) off the main thread to a **Web Worker** using `Comlink` or raw `postMessage`. This keeps the UI responsive to clicks even during calculation.
