# Devpost copy

## Project name

RightFlow Autopilot

## Elevator pitch

An explainable Qwen-powered caseworker that turns ambiguous life stories into verified social-rights assessments and human-approved action plans.

## Track

Autopilot Agent

## Inspiration

People rarely describe their needs in policy language. They tell incomplete, ambiguous life stories, while digital public-service forms expect structured facts and knowledge of the correct program. That mismatch creates abandoned or incorrect applications and increases caseworker workload.

## What it does

RightFlow turns a natural-language case narrative into a structured, reviewable social-rights case. Qwen extracts only explicit facts and orchestrates bounded tools. After human verification, a deterministic screening tool identifies relevant 65+, home-care, and GSS review pathways, including missing information and safe next steps. The result is an explainable action plan with a visible audit timeline—not an opaque AI verdict.

## How we built it

The user experience is built with Next.js, React, and TypeScript. The backend route calls Qwen Cloud through Alibaba Cloud's OpenAI-compatible DashScope endpoint. All Qwen output passes through a strict fact allowlist. Input normalization, prompt-injection detection, a 12-second timeout, and a fail-closed demo mode keep the workflow testable and safe. The application is packaged as a container and includes an Alibaba Cloud ECS deployment manifest.

## Challenges

The central challenge was maintaining a hard boundary between language understanding and a high-impact eligibility decision. We designed the agent so model output can never become an official conclusion: unknown fields are rejected, missing facts pause the workflow, and consequential tool execution requires explicit human approval.

## Accomplishments

- Qwen-powered structured intake with a strict schema
- Human-in-the-loop approval gate
- Deterministic screening across three social-rights pathways
- Explainable execution timeline
- Prompt-injection boundary
- Deterministic, testable fallback
- Containerized Alibaba Cloud deployment path
- No raw narrative persistence

## What we learned

Production agents are strongest when autonomy is bounded by explicit capabilities. In a high-impact domain, the innovative part is not asking an LLM to decide more; it is giving the model enough agency to reduce friction while preserving deterministic decisions, human control, and traceability.

## What's next

We will add signed policy bundles, multilingual voice intake, consent-based case memory, caseworker queues, and evaluation benchmarks comparing completion time and error rate against conventional form workflows.
