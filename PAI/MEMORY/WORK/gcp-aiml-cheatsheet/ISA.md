---
task: Cheat sheet of all AI/ML concepts on cloud.google.com/discover
slug: gcp-aiml-cheatsheet
effort: E2
phase: complete
progress: 18/18
mode: ALGORITHM
started: 2026-06-23
updated: 2026-06-23
---

## Problem

Nick wants a single-page reference covering every AI/ML concept that Google Cloud
explains on its `cloud.google.com/discover` hub. The concepts are scattered across
30+ separate explainer pages; there is no consolidated cheat sheet.

## Goal

Produce one well-organised, accurate cheat sheet (markdown) that defines every AI/ML
concept on the Google Cloud Discover hub — grouped by theme, each entry a tight
definition plus key sub-points, faithful to Google Cloud's framing, with source URLs.

## Criteria

- [ ] ISC-1: Complete topic enumeration sourced from the Discover hub (not invented)
- [ ] ISC-2: Foundations covered (AI, AI vs ML, ML, deep learning, neural networks, AI model)
- [ ] ISC-3: Learning paradigms covered (supervised, unsupervised, reinforcement, federated)
- [ ] ISC-4: Generative AI covered (gen AI, LLMs, foundation models, GPT, transformers)
- [ ] ISC-5: Multimodal/GANs/diffusion/embeddings covered
- [ ] ISC-6: Agents covered (AI agents, agentic AI)
- [ ] ISC-7: Techniques covered (prompt engineering, RAG, fine-tuning, generative UI)
- [ ] ISC-8: Applied AI covered (NLP, computer vision, speech recognition, recommendations)
- [ ] ISC-9: Ops covered (MLOps, AIOps)
- [ ] ISC-10: Infra covered (GPU/TPU for AI, vector database)
- [ ] ISC-11: AGI + responsible AI + benefits/use cases covered where present on hub
- [ ] ISC-12: Each entry has a 1-3 sentence plain-English definition
- [ ] ISC-13: Each entry has 2-4 key sub-points (types / how it works / uses)
- [ ] ISC-14: Concepts grouped by theme for scannability
- [ ] ISC-15: Source URL provided per concept or per cluster
- [ ] ISC-16: Australian English, no em dashes
- [ ] ISC-17: Anti: no hallucinated concepts not present on the Discover hub
- [ ] ISC-18: Delivered as a reusable file, not only inline

## Test Strategy

- isc | type | check | threshold | tool
- ISC-1 | coverage | topic count from agent enumeration | >=25 | agent reports
- ISC-2..11 | coverage | each cluster present in final doc | all | Grep
- ISC-12..13 | quality | spot-check entries have def + bullets | all sampled | Read
- ISC-17 | accuracy | each concept maps to a real discover URL | 100% | agent verification
- ISC-18 | artifact | file exists on disk | exists | Read
