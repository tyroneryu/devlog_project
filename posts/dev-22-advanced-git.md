---
id: dev-22-advanced-git
title: Advanced Git: Rebase, Bisect, and Submodules
excerpt: Moving beyond commit and push. How to rewrite history cleanly, debug regressions with binary search, and manage dependencies.
date: 2024-05-28
tags: [Git, DevOps, Productivity]
category: Dev
---

# Git is a Time Machine

Most developers use 5% of Git's power. Here are the tools for the top 1%.

## 1. Interactive Rebase (`git rebase -i`)

Before merging a PR, clean up your mess.
*   **Squash**: Combine "Fix typo", "Fix typo again" into one "Update Documentation" commit.
*   **Reword**: Change commit messages to follow conventional commit standards.
*   **Drop**: Remove experimental commits that didn't work out.

## 2. Git Bisect

You found a bug. It wasn't there yesterday. There were 50 commits since then.
`git bisect` performs a binary search.
1.  `git bisect start`
2.  `git bisect bad` (Current)
3.  `git bisect good <commit-hash-from-yesterday>`
4.  Git checks out the middle commit. You test. Tell git `good` or `bad`.
5.  Repeat ~5 times to find the *exact* line of code that broke the build in seconds.

## 3. Rerere (Reuse Recorded Resolution)

If you rebase often, you hit the same merge conflicts. Enable `git config --global rerere.enabled true`. Git remembers how you resolved a conflict in `file.js` and applies it automatically next time.
