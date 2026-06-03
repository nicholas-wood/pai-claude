---
task: Create IaC and CI/CD for AccessBuddy
slug: 20260329-120000_accessbuddy-iac-cicd-infrastructure
effort: advanced
phase: verify
progress: 30/30
mode: interactive
started: 2026-03-29T12:00:00+11:00
updated: 2026-03-29T12:00:30+11:00
---

## Context

User requested production-quality Terraform for GCP and GitHub Actions CI/CD for the AccessBuddy project. AccessBuddy is a monorepo (Turborepo + Bun) with a Next.js app targeting Cloud Run, PostgreSQL 16 via Cloud SQL, Redis via Memorystore, and Docker images via Artifact Registry. All infrastructure must use Australian region (australia-southeast1) by default, google provider ~> 5.0, and zero hardcoded secrets.

### Risks
- Terraform resource names/APIs may have changed in provider 5.x — use current documented resource types
- VPC connector configuration must match Cloud Run requirements for private SQL/Redis access
- Workload Identity Federation setup in deploy workflow must match GCP's current OIDC configuration
- Cloud SQL private IP requires servicenetworking API and VPC peering

## Criteria

- [ ] ISC-1: infra/terraform/main.tf file exists in accessbuddy project
- [ ] ISC-2: Terraform backend configured for GCS bucket with configurable name
- [ ] ISC-3: Google provider block specifies version ~> 5.0
- [ ] ISC-4: Cloud Run service resource defined with Docker image variable
- [ ] ISC-5: Cloud Run min instances 0 and max instances 10
- [ ] ISC-6: Cloud Run memory 512Mi and CPU 1
- [ ] ISC-7: Cloud Run uses service account reference
- [ ] ISC-8: Cloud Run has VPC connector for private networking
- [ ] ISC-9: Cloud Run environment variables from variables not hardcoded
- [ ] ISC-10: Cloud SQL PostgreSQL 16 instance with db-f1-micro tier
- [ ] ISC-11: Cloud SQL private IP via VPC peering
- [ ] ISC-12: Cloud SQL automated backups enabled
- [ ] ISC-13: Cloud SQL deletion protection enabled
- [ ] ISC-14: Cloud SQL database named "accessbuddy"
- [ ] ISC-15: Cloud SQL user "accessbuddy" with random password
- [ ] ISC-16: Memorystore Redis 1GB basic tier with private IP
- [ ] ISC-17: Artifact Registry Docker repository resource defined
- [ ] ISC-18: VPC and subnet for private networking defined
- [ ] ISC-19: Serverless VPC connector resource defined
- [ ] ISC-20: Cloud Run IAM member allows unauthenticated public access
- [ ] ISC-21: infra/terraform/variables.tf with project_id, region, environment, app_image
- [ ] ISC-22: Region defaults to australia-southeast1
- [ ] ISC-23: infra/terraform/outputs.tf with cloud_run_url, database_connection_string (sensitive), redis_host, artifact_registry_url
- [ ] ISC-24: infra/terraform/terraform.tfvars.example with example values and comments
- [ ] ISC-25: infra/terraform/.gitignore for state files and .tfvars
- [ ] ISC-26: .github/workflows/ci.yml triggers on push to main and pull_request
- [ ] ISC-27: CI lint-and-type-check job uses bun with lint and typecheck
- [ ] ISC-28: CI test job has Postgres 16 and Redis 7 service containers
- [ ] ISC-29: CI build job depends on lint-and-type-check and test jobs
- [ ] ISC-30: .github/workflows/deploy.yml uses Workload Identity Federation with GCP secrets

## Decisions

## Verification
