---
id: dev-25-accessibility
title: Automating Accessibility (A11y) Testing
excerpt: Integrating Axe-core into your CI/CD pipeline to catch contrast errors and missing ARIA labels before deployment.
date: 2024-01-05
tags: [A11y, Testing, CI/CD]
category: Dev
---

# A11y is Quality Assurance

Accessibility isn't just a compliance checklist; it's about usability for everyone. However, manual testing is slow.

## Automated Audits

Tools like `jest-axe` or Cypress plugins allow you to assert accessibility standards during testing.

```javascript
it('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

This catches low-hanging fruit:
*   Low color contrast.
*   Missing `alt` text on images.
*   Improper heading hierarchy (`h1` -> `h3`).

While automation catches ~30% of issues, it enforces a baseline of quality that prevents regressions.
