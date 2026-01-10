---
id: dev-05-threejs
title: Optimizing Three.js for the Web: 60 FPS or Bust
excerpt: Techniques to maintain high frame rates when rendering 3D scenes in the browser using React Three Fiber. Geometry instancing, texture compression, and draw call reduction.
date: 2024-05-12
tags: [WebGL, Three.js, Creative Coding, Performance]
category: Dev
---

# 3D on the Web: Performance First

Bringing 3D content to the web using **Three.js** (and its React wrapper, **React Three Fiber**) opens up incredible creative possibilities. However, unlike a dedicated game engine running on a console, the browser environment is constrained. You are sharing resources with the DOM, CSS layout engine, and JavaScript execution thread.

To ensure your portfolio or landing page runs at a smooth 60 FPS on both a high-end MacBook and a mid-range smartphone, optimization is not optional—it's foundational.

## 1. Geometry Instancing

The most common bottleneck in WebGL is the number of **Draw Calls**. Every time you tell the GPU to draw an object, there is CPU overhead. Drawing 1,000 separate cubes will choke the CPU, even if the GPU is bored.

**Instancing** solves this. It tells the GPU: "Here is one geometry (a cube) and one material. Draw it 1,000 times at these 1,000 different positions."

In React Three Fiber, use the `<instancedMesh>` component:

```jsx
<instancedMesh args={[geometry, material, 1000]}>
  {/* We update matrices directly rather than rendering 1000 <mesh> components */}
</instancedMesh>
```

## 2. Asset Compression (Draco & KTX2)

3D models (.gltf/.glb) can be huge. A standard model might be 20MB, which is unacceptable for the web.

*   **Draco Compression**: Compresses geometry data. It can reduce a 20MB file to 2MB. The client needs a small WASM decoder to read it, but the trade-off is worth it.
*   **Texture Compression (KTX2/Basis)**: Instead of shipping JPEGs or PNGs, which must be decoded into massive bitmaps in GPU memory, use KTX2. These textures stay compressed in GPU memory, significantly reducing VRAM usage.

## 3. Disposing of Resources

One of the most common causes of memory leaks in Single Page Applications (SPAs) with 3D elements is failure to dispose of assets.

When a React component unmounts, the JS object is garbage collected. However, the **WebGL context** (buffers, textures, shaders) lives separately. You must manually call `.dispose()` on geometries and materials, or use the `useGLTF` hook from `@react-three/drei` which handles caching and disposal intelligently.

## 4. Post-Processing: Less is More

Post-processing effects (Bloom, Depth of Field, Chromatic Aberration) make scenes look professional but are incredibly expensive. Each effect requires an additional render pass (drawing the whole scene again).

*   Limit the number of passes.
*   Lower the resolution of expensive passes (e.g., render Bloom at half resolution).
*   Disable effects dynamically on mobile devices using `window.devicePixelRatio` or user agent sniffing.

## 5. Pixel Ratio Limiting

Retina screens have a pixel ratio (DPR) of 2 or 3. Rendering a full-screen canvas at DPR 3 on a 4K monitor is effectively rendering 8K resolution. This will melt mobile GPUs.

Always cap the pixel ratio for performance:

```jsx
<Canvas dpr={[1, 2]}> 
  {/* Caps DPR at 2, even if the screen is 3 */}
</Canvas>
```

## Conclusion

Optimization in Three.js is a game of trade-offs between visual fidelity and performance. By understanding the rendering pipeline—minimizing draw calls, managing memory, and being smart about resolution—you can create immersive web experiences that feel native and responsive.