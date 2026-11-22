---
name: gotcha-check-registry-delegation-before-dns-changes
description: "Before deleting a DNS zone or telling Nick where to add records, read the delegation at the TLD servers, not a cached resolver answer"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 89fdcb2e-263c-4f0c-920b-b364a63ce275
  modified: 2026-11-21T23:55:11.675Z
---

Before deleting a DNS zone, or telling Nick which DNS host to add a record at, query the registry's own servers for the delegation: `dig +norec NS <domain> @$(dig +short NS com.au | head -1)`. A plain `dig NS` can show stale cached nameservers for an hour or more.

**Why:** On 22 Nov 2026 I took nicholaswood.com.au offline for public lookups. Nick had switched the registry nameservers to Google (`ns-cloud-d1..d4`) on my earlier instruction; my resolver still showed GoDaddy's, so I told him DNS was staying at GoDaddy, had him add a CNAME there, and deleted the Cloud DNS zone. Every public resolver then returned SERVFAIL (EDE 22, no reachable authority). Recreating the zone did not fix it, because Cloud DNS assigned a different nameserver shard (`b`, not `d`).

**How to apply:** Check delegation at the TLD first. Treat a Cloud DNS zone that a registry delegates to as undeletable (`prevent_destroy`); a recreated zone gets a new shard and needs a registrar change. Related: [[project-lsv-service-summary]].
