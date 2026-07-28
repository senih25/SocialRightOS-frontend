# Architecture

```mermaid
flowchart LR
  U[Citizen or caseworker] --> W[Next.js RightFlow workspace]
  W --> A[Alibaba Cloud hosted API]
  A --> G[Input and output guardrails]
  G --> Q[Qwen Cloud]
  Q --> G
  G --> H{Human approval}
  H -->|Needs correction| W
  H -->|Approved| E[Deterministic eligibility API]
  E --> R[Rule trace and verified action plan]
  A --> T[Minimized audit timeline]
```

## Failure model

| Failure | Deterministic response |
|---|---|
| Missing Qwen key | Labelled demo extractor; no AI claim |
| Qwen timeout or non-2xx | Same fail-closed demo path |
| Invalid Qwen JSON | Reject output; demo path |
| Unknown fact key | Reject complete Qwen payload |
| Prompt injection text | Treat as case content and flag guardrail event |
| Missing required facts | Stop with `NEEDS_INFORMATION` |
| No human approval | Eligibility tool remains unavailable |
