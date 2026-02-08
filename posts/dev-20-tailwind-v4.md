---
id: dev-20-tailwind-v4
title: Anticipating Tailwind CSS v4: The Rust Compiler
excerpt: How the new Oxidized engine will make Tailwind builds instant, removing the need for configuration files and content scanning.
date: 2024-06-15
tags: [CSS, Tailwind, Rust]
category: Dev
---

# Zero-Config CSS

Tailwind changed how we write CSS, but its JIT engine relies on scanning your files for class names. In very large projects, this can still introduce a slight delay.

Tailwind v4 (Oxidized) is rewriting the core engine in Rust.

## Key Changes
1.  **Unified Toolchain**: No more PostCSS plugin chain dependency.
2.  **CSS-First Configuration**: Configure your theme variables directly in CSS using standard `@theme` directives, rather than a `tailwind.config.js` file.
3.  **Speed**: Builds are effectively instant, enabling hot module replacement (HMR) for CSS that feels faster than the browser can repaint.

This evolution treats Tailwind less like a plugin and more like a native CSS extension language.
