---
id: dev-19-trpc
title: End-to-End Type Safety with tRPC
excerpt: Why you might not need a REST API or GraphQL. Sharing TypeScript types directly between client and server for instant autocomplete.
date: 2024-01-20
tags: [TypeScript, tRPC, API]
category: Dev
---

# The API Layer Disappears

If your backend and frontend are both TypeScript and live in the same monorepo, why serialize types to JSON/Swagger/GraphQL schema just to regenerate them on the other side?

**tRPC** exploits TypeScript inference to create a contract-less API.

```typescript
// Backend
export const appRouter = router({
  getUser: publicProcedure.input(z.string()).query(({ input }) => {
    return { id: input, name: 'Alice' };
  }),
});

export type AppRouter = typeof appRouter;
```

```typescript
// Frontend
const user = trpc.getUser.useQuery('123');
// user.data.name is typed as string automatically!
```

If you change the backend return type, the frontend build fails immediately. This tight feedback loop dramatically speeds up feature development.
