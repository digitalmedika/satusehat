---
"@digitalmedika/satusehat": patch
---

fix: replace bun build with esbuild to resolve empty dist/index.js bundle — all internal modules were incorrectly marked as external, causing ReferenceError at runtime
