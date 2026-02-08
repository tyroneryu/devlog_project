---
id: dev-12-rust-frontend
title: Rust in the Frontend: Yew, Leptos, and the Death of VDOM
excerpt: Can we build web apps without JavaScript? Exploring Rust-based frontend frameworks that compile to WASM and offer superior performance by ditching the Virtual DOM.
date: 2024-06-01
tags: [Rust, Frontend, Leptos, Yew, WASM]
category: Dev
---

# Beyond the Virtual DOM

React popularized the Virtual DOM (VDOM), a lightweight copy of the UI kept in memory. When state changes, React diffs the VDOM with the real DOM and patches the differences. While revolutionary, this process is pure overhead.

Newer frameworks in the JavaScript world (SolidJS, Svelte) have moved toward "Fine-Grained Reactivity." Now, Rust frameworks like **Leptos** and **Dioxus** are bringing this paradigm to WebAssembly.

## Leptos: Reactivity at the Speed of Rust

Leptos behaves similarly to SolidJS. Components run once (setup phase), and only the specific DOM nodes bound to a signal are updated.

```rust
use leptos::*;

#[component]
pub fn Counter(cx: Scope) -> impl IntoView {
    // Create a signal (reactive state)
    let (count, set_count) = create_signal(cx, 0);

    // This closure is compiled to a direct DOM update instruction
    let click_handler = move |_| set_count.update(|n| *n += 1);

    view! { cx,
        <div class="counter-wrapper">
            <button on:click=click_handler>
                "Click me: " 
                // Only this text node updates; the button logic never re-runs
                {move || count.get()} 
            </button>
            <ProgressBar progress=count />
        </div>
    }
}
```

## Why Choose Rust for Frontend?

1.  **Type Safety**: TypeScript is great, but its type system is unsound (any, type assertions). Rust provides a guarantee: if it compiles, it likely handles all edge cases.
2.  **Performance**: In benchmarks (JS Framework Benchmark), Leptos consistently outperforms React and Vue, rivaling vanilla JS.
3.  **Shared Logic**: You can share `struct` definitions, validation logic, and domain models directly between your Rust backend (Axum/Actix) and your frontend.

## The Trade-offs

*   **Binary Size**: A "Hello World" WASM bundle is larger (~200KB compressed) than a tiny JS script due to the standard library overhead. However, this cost is amortized as the app grows.
*   **Ecosystem**: You can't just `npm install` a date picker. You often have to wrap JS libraries with `wasm-bindgen` or build components from scratch.

## Conclusion

For simple CRUD apps, the overhead of Rust might not be worth it. But for complex, long-lived, business-critical dashboards or tools where correctness and performance are paramount, the Rust frontend ecosystem is becoming a serious contender.
