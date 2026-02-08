---
id: dev-28-blockchain-development
title: Solidity Gas Optimization Patterns
excerpt: Writing smart contracts that don't bankrupt your users. Storage packing, calldata vs memory, and unchecked arithmetic.
date: 2024-03-22
tags: [Blockchain, Solidity, Web3, Ethereum]
category: Dev
---

# Every Byte Costs Money

In Cloud computing, inefficiency costs you (the dev). In Blockchain, inefficiency costs the user.

## 1. Storage Packing
Ethereum storage slots are 32 bytes.
```solidity
// Bad (Uses 2 slots)
uint128 a;
uint256 b;
uint128 c;

// Good (Uses 2 slots - packs a and c together)
uint128 a;
uint128 c;
uint256 b;
```
Ordering variables matters.

## 2. Calldata vs Memory
For read-only function arguments (external functions), use `calldata` instead of `memory`. It avoids copying the data to a memory buffer, saving significant gas.

## 3. Unchecked Math
Solidity 0.8+ checks for overflow/underflow by default (which costs gas). If you are 100% sure a loop variable `i++` won't overflow (it won't reach 2^256), wrap it in `unchecked { i++; }` to skip the safety check instructions.
