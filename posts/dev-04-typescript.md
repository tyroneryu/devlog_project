---
id: dev-04-typescript
title: Advanced TypeScript Generics: Beyond the Basics
excerpt: Moving beyond basic types to create flexible, reusable components and utility functions. Exploring constraints, conditional types, and the 'infer' keyword.
date: 2024-04-05
tags: [TypeScript, Frontend, Best Practices]
category: Dev
---

# The Power of Generics in TypeScript

TypeScript is often praised for its ability to catch errors at compile time, but its true power lies in **Generics**. Generics allow you to write code that is flexible and reusable while retaining full type safety. If you find yourself writing function overloads or using `any` because "I don't know what type this will be yet," you probably need a Generic.

## The "Hello World" of Generics

At its simplest, a generic acts like a variable for types.

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const num = identity(42); // Type is number
const str = identity("hello"); // Type is string
```

TypeScript infers `T` based on the argument passed.

## Generic Constraints

Sometimes, you want to allow a generic type, but only if it meets certain criteria. We use the `extends` keyword to enforce constraints.

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length); // We know .length exists!
  return arg;
}

logLength("hello"); // OK (string has length)
logLength([1, 2, 3]); // OK (array has length)
logLength(10); // Error: number does not have .length
```

## Real-World Example: Type-Safe API Wrapper

In frontend development, handling API responses is a common use case.

```typescript
interface ApiResponse<Data = any, Error = string> {
  status: 'success' | 'error';
  data?: Data;
  error?: Error;
  timestamp: number;
}

// Usage
interface User {
  id: number;
  name: string;
}

async function fetchUser(): Promise<ApiResponse<User>> {
  const res = await fetch('/api/user');
  return res.json();
}

const response = await fetchUser();

if (response.status === 'success' && response.data) {
  // TypeScript knows response.data is of type User
  console.log(response.data.name); 
}
```

## Utility Types and `keyof`

Generics shine when combined with operators like `keyof`. Let's create a function that extracts a property from an object safely.

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const event = {
  id: 1,
  title: "Tech Summit",
  attendees: 5000
};

const title = getProperty(event, "title"); // Type is string
const count = getProperty(event, "attendees"); // Type is number
// const fail = getProperty(event, "location"); // Error: "location" is not a key of event
```

## Conditional Types and `infer`

For advanced users, the `infer` keyword allows you to extract types from within other types. A common built-in example is `ReturnType<T>`.

```typescript
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function createEvent() {
  return { id: 1, name: "Concert" };
}

type EventObject = MyReturnType<typeof createEvent>; 
// EventObject is { id: number, name: string }
```

## Conclusion

Generics move your TypeScript skills from "Annotating variables" to "Metaprogramming". They allow library authors and senior engineers to build robust tools that guide other developers toward correct usage, providing autocomplete and error checking for code patterns that haven't even been written yet.