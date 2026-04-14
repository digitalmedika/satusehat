---
"@digitalmedika/satusehat": patch
---

Support SATUSEHAT radiology accession identifiers on `ServiceRequest` by allowing
`identifier.system` values under `http://sys-ids.kemkes.go.id/acsn/{organization-ihs-number}`
in addition to the existing `servicerequest` identifier. This patch also preserves
`Identifier.type` in the shared schema so accession identifiers such as `ACSN` can
be validated and forwarded correctly, and updates the ServiceRequest docs/tests to
cover the radiology use case.
