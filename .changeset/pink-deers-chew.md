---
"@digitalmedika/satusehat": patch
---

Handle malformed SATUSEHAT responses more safely in the shared transport layer.
When a response is labeled as JSON but contains plain text such as `Internal Server Error`,
the SDK now preserves the raw text in `SatuSehatApiError.response` instead of throwing a
JSON parse error. This makes downstream app errors clearer for resources such as
`QuestionnaireResponse`.
