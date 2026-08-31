/**
 * Software Engineering Process Knowledge Base
 * Organizational Process Assets (OPAs), Templates, Guidelines, and Checklists Data Store
 */

const SE_PROCESS_DATA = {
  phases: [
    {
      id: "requirements",
      name: "Requirements & Product",
      icon: "📋",
      color: "#3b82f6",
      description: "Defining problem statements, user stories, acceptance criteria, and technical feasibility.",
      raci: {
        responsible: "Product Owner / Business Analyst",
        accountable: "Engineering Lead / Architect",
        consulted: "UX Designers, QA Lead, Security Champion",
        informed: "Development Team, Stakeholders"
      },
      qualityGate: "Definition of Ready (DoR) satisfied, Acceptance Criteria signed off, Initial Threat Assessment complete."
    },
    {
      id: "architecture",
      name: "Architecture & Design",
      icon: "🏛️",
      color: "#8b5cf6",
      description: "System design, Architecture Decision Records (ADRs), API contract definitions, and data modeling.",
      raci: {
        responsible: "Lead Architect / Senior Engineers",
        accountable: "Principal Architect / VP of Engineering",
        consulted: "Security Team, Infrastructure/DevOps, Database Admins",
        informed: "Cross-Functional Feature Teams"
      },
      qualityGate: "ADR approved by Architecture Review Board (ARB), Data Protection & Security review complete."
    },
    {
      id: "development",
      name: "Development & Code Review",
      icon: "💻",
      color: "#10b981",
      description: "Clean code authoring, trunk-based branching, peer code review, unit testing, and static analysis.",
      raci: {
        responsible: "Software Engineers / Developers",
        accountable: "Tech Lead / Module Owner",
        consulted: "Peer Reviewers, Domain Specialists",
        informed: "QA Engineers, Release Manager"
      },
      qualityGate: "Pull Request approved by 2 peers, CI lint/build green, Unit test coverage ≥ 85%, no high/critical vulnerabilities."
    },
    {
      id: "qa",
      name: "Quality Assurance & Testing",
      icon: "🧪",
      color: "#f59e0b",
      description: "Automated regression, integration testing, end-to-end user flows, performance, and defect triage.",
      raci: {
        responsible: "QA Automation Engineers / SDETs",
        accountable: "QA Lead / QA Director",
        consulted: "Developers, Product Managers",
        informed: "Release Management, Support"
      },
      qualityGate: "Zero P0/P1 defects, Automated regression suite 100% pass, Performance benchmark within SLA threshold."
    },
    {
      id: "release",
      name: "Release & Deployment",
      icon: "🚀",
      color: "#ec4899",
      description: "Automated CI/CD pipelines, canary/blue-green rollouts, database migrations, and release runbooks.",
      raci: {
        responsible: "DevOps / Release Engineers / On-call Dev",
        accountable: "Release Manager / Head of DevOps",
        consulted: "Security Team, Site Reliability Engineers (SRE)",
        informed: "Customer Success, Support, All Engineering"
      },
      qualityGate: "Change Advisory Board (CAB) approval, Automated smoke tests passed in staging, Rollback runbook verified."
    },
    {
      id: "operations",
      name: "Operations & Incident Response",
      icon: "🛡️",
      color: "#ef4444",
      description: "Observability, SLO/SLA monitoring, incident triaging, on-call rotations, and blameless post-mortems.",
      raci: {
        responsible: "Incident Commander / Primary On-call SRE",
        accountable: "Engineering Director / VP SRE",
        consulted: "Subject Matter Experts, Core Engineers",
        informed: "Incident Stakeholders, Executive Team"
      },
      qualityGate: "MTTR within SLA, Blameless Post-Mortem published within 48h, corrective action items tracked in JIRA."
    }
  ],

  categories: [
    { id: "all", name: "All Assets", icon: "📚" },
    { id: "guideline", name: "Guidelines & SOPs", icon: "📖" },
    { id: "template", name: "Document Templates", icon: "📝" },
    { id: "checklist", name: "Quality Checklists", icon: "✅" },
    { id: "policy", name: "Engineering Policies", icon: "⚖️" }
  ],

  assets: [
    {
      id: "adr-template",
      title: "Architecture Decision Record (ADR) Template",
      type: "template",
      phase: "architecture",
      version: "v2.3",
      lastUpdated: "2026-02-10",
      owner: "Architecture Review Board",
      status: "Active",
      summary: "Standard document to capture significant architectural choices, context, evaluated alternatives, and trade-offs.",
      tags: ["Architecture", "Design", "RFC", "Governance"],
      fields: [
        { key: "TITLE", label: "Decision Title", placeholder: "Use PostgreSQL for Core Ledger Database" },
        { key: "AUTHOR", label: "Author(s)", placeholder: "Jane Doe (Lead Architect)" },
        { key: "STATUS", label: "Status (Proposed/Accepted/Deprecated)", placeholder: "Accepted" },
        { key: "DATE", label: "Date", placeholder: "2026-08-19" },
        { key: "CONTEXT", label: "Context & Problem Statement", placeholder: "Current MySQL cluster faces scaling bottlenecks during peak transaction bursts..." }
      ],
      content: `# Architecture Decision Record (ADR): {TITLE}

**Status:** {STATUS}  
**Date:** {DATE}  
**Author(s):** {AUTHOR}  
**Deciders:** Architecture Review Board (ARB), Tech Leads  
**Target Systems:** Microservices Fleet, Data Persistence Layer

---

## 1. Context and Problem Statement
{CONTEXT}

Describe the context and background. What business need or technical challenge drives this architectural decision? 
Include links to relevant Jira epics or product requirements documents.

## 2. Decision Drivers
* **Scalability:** Must support 10,000 requests/sec with p99 latency < 50ms.
* **Consistency & Reliability:** Strong ACID compliance for financial transaction integrity.
* **Maintainability & Developer Velocity:** Well-supported ORM ecosystem and mature migration tooling.
* **Operational Overhead:** Managed cloud service availability (RDS/Aurora) to minimize DBA overhead.

## 3. Considered Options
* **Option 1 (Selected):** {TITLE}
* **Option 2:** Alternative Approach A (e.g., NoSQL Document Store / MongoDB)
* **Option 3:** Alternative Approach B (e.g., Distributed SQL / CockroachDB)

## 4. Pros and Cons of the Options

### Option 1: {TITLE} (Selected)
* **Good, because:** Native relational integrity, JSONB support for flexible metadata, extensive ecosystem tooling.
* **Good, because:** Proven high availability with multi-AZ failover and automated read replicas.
* **Bad, because:** Requires deliberate horizontal partitioning strategy as data grows past 10TB.

### Option 2: Alternative Approach A
* **Good, because:** Schema-free agility and easy horizontal sharding.
* **Bad, because:** Lacks multi-entity transactional guarantees needed for financial audit logs.

### Option 3: Alternative Approach B
* **Good, because:** True geo-distributed multi-region active-active replication.
* **Bad, because:** Higher licensing and operational complexity; team lacks prior production expertise.

## 5. Decision Outcome
**Chosen option:** Option 1 ({TITLE})

### Positive Consequences
* High confidence in financial data integrity through strict ACID compliance.
* Fast onboarding for engineering teams familiar with SQL standards.
* Reduced infrastructure operational overhead using managed cloud instances.

### Negative Consequences / Mitigations
* Complex horizontal partitioning required in future phases. **Mitigation:** Implement tenant-based logical partitioning from Sprint 1.

## 6. Implementation & Validation Plan
1. [ ] Create infrastructure blueprint in Terraform (\`infra/rds-postgres\`).
2. [ ] Define database migration framework using Flyway/Liquibase.
3. [ ] Perform benchmark load testing simulating 1.5x expected peak load.
4. [ ] Conduct operational readiness review with SRE team.`
    },

    {
      id: "git-branching-guideline",
      title: "Trunk-Based Development & Git Branching SOP",
      type: "guideline",
      phase: "development",
      version: "v3.1",
      lastUpdated: "2026-01-15",
      owner: "DevOps & Core Platform Team",
      status: "Active",
      summary: "Standard operating procedure for Git workflows, branch naming conventions, atomic commits, and merge strategies.",
      tags: ["Git", "Workflow", "Branching", "CI/CD", "Best Practices"],
      content: `# Trunk-Based Development & Git Workflow SOP

## Purpose
This document establishes the official engineering standard for version control workflows across all repositories. We follow **Trunk-Based Development** to minimize merge debt, accelerate continuous integration, and maintain high deployment velocity.

---

## 1. Core Principles
1. **Short-Lived Branches:** Feature branches must live for no longer than **24-48 hours**. Large features must be broken down or concealed behind **Feature Flags**.
2. **Main is Always Deployable:** The \`main\` branch must always be in a green, release-ready state.
3. **No Direct Commits to Main:** All changes enter \`main\` strictly via peer-reviewed and CI-verified Pull Requests.
4. **Squash and Merge:** Pull requests are squashed upon merging to maintain a clean, linear, and bisectable Git history.

---

## 2. Branch Naming Conventions
Branches must follow the pattern: \`<type>/<ticket-id>-<short-description>\`

| Prefix | Usage | Example |
| :--- | :--- | :--- |
| \`feat/\` | New user-facing or technical features | \`feat/PROJ-102-oauth2-login\` |
| \`fix/\` | Bug fixes for existing functionality | \`fix/PROJ-405-null-pointer-cart\` |
| \`refactor/\` | Code restructuring with no behavior change | \`refactor/PROJ-88-cleanup-auth-middleware\` |
| \`perf/\` | Performance improvements | \`perf/PROJ-210-redis-cache-layer\` |
| \`test/\` | Adding or updating automated tests | \`test/PROJ-312-e2e-checkout-tests\` |
| \`chore/\` | Tooling, dependency bumps, build scripts | \`chore/deps-update-spring-boot\` |
| \`hotfix/\` | Emergency production fixes | \`hotfix/SEV1-session-token-leak\` |

---

## 3. Commit Message Guidelines (Conventional Commits)
We enforce the Conventional Commits specification:

\`\`\`
<type>(<scope>): <short imperative summary>

[optional body explaining motivation and technical trade-offs]

[optional footer(s) referencing Jira issues or breaking changes]
\`\`\`

### Good Commit Example:
\`\`\`
feat(auth): integrate multi-factor authentication via TOTP

- Implemented RFC 6238 compliant TOTP generator and validator
- Added QR code provisioning endpoint for authenticator apps
- Updated rate-limiter to allow max 5 failed attempts per 15 min

Closes: PROJ-102
\`\`\`

---

## 4. Merge Requirements
Before merging into \`main\`, every PR must satisfy:
* At least **2 approvals** from repository code owners.
* All automated CI pipeline checks green (Linter, Unit Tests, Static Code Analysis).
* Zero unresolved review comments.
* Branch rebased onto the latest \`main\` without merge conflicts.`
    },

    {
      id: "pr-template",
      title: "Standard Pull Request (PR) Template",
      type: "template",
      phase: "development",
      version: "v2.0",
      lastUpdated: "2026-03-01",
      owner: "Engineering Quality Guild",
      status: "Active",
      summary: "Standard GitHub/GitLab Pull Request template ensuring clear context, testing proof, and security awareness.",
      tags: ["Code Review", "Pull Request", "Template", "Quality"],
      fields: [
        { key: "TICKET_ID", label: "Ticket / Issue ID", placeholder: "PROJ-1234" },
        { key: "PR_SUMMARY", label: "Change Summary", placeholder: "Add Redis caching for product catalog endpoints to reduce database query load" },
        { key: "TYPE_OF_CHANGE", label: "Change Type", placeholder: "Feature / Bugfix / Refactor" }
      ],
      content: `## 📌 Summary of Changes
**Ticket / Issue:** [{TICKET_ID}](https://jira.internal.net/browse/{TICKET_ID})  
**Change Type:** {TYPE_OF_CHANGE}

### Description
{PR_SUMMARY}

---

## 🔍 Motivation & Context
- Why is this change required? What problem does it solve?
- If it fixes an open issue, please link it above.

---

## 🧪 Verification & Testing Performed
- [ ] **Unit Tests:** Added/updated unit tests; all passing locally and in CI.
- [ ] **Integration Tests:** Verified interaction between services/APIs.
- [ ] **Manual Testing:** Tested locally on staging environment.
  - *Test Scenario 1:* Verified cache hit returns 200 OK with sub-5ms response time.
  - *Test Scenario 2:* Verified cache invalidation upon product catalog update.

### Evidence (Screenshots / Logs / Metrics)
\`\`\`
[Attach terminal output, curl test logs, or UI screenshots here]
\`\`\`

---

## 🛡️ Security & Performance Checklist
- [ ] No secrets, credentials, or API keys committed.
- [ ] Input validation applied to all user-facing endpoints.
- [ ] Database queries are indexed; no N+1 query patterns introduced.
- [ ] Logging does not leak PII (Personally Identifiable Information).

---

## 📦 Deployment & Rollback Notes
- **Database Migrations:** None / Required (Migration script: \`V12__add_index.sql\`)
- **Environment Variables:** \`REDIS_CACHE_TTL_SECONDS\` (default: 3600)
- **Rollback Strategy:** Revert PR and redeploy previous container tag.`
    },

    {
      id: "code-review-guideline",
      title: "Code Review Standards & SLA Guidelines",
      type: "guideline",
      phase: "development",
      version: "v2.4",
      lastUpdated: "2026-01-20",
      owner: "Engineering Quality Guild",
      status: "Active",
      summary: "Best practices, constructive feedback rubric, review turnaround SLAs, and anti-patterns for effective peer reviews.",
      tags: ["Code Review", "Quality", "Guidelines", "SLA", "Culture"],
      content: `# Engineering Code Review Standards & Guidelines

## 1. Objectives of Code Review
Code review is our primary mechanism for:
1. **Ensuring Correctness & Quality:** Catching edge cases, race conditions, security flaws, and performance regressions.
2. **Knowledge Sharing:** Fostering shared system ownership and preventing siloed domain expertise.
3. **Consistency:** Maintaining clean code conventions and architectural cohesion.

---

## 2. Review Turnaround SLAs
To prevent developer blockage and sustain momentum:
* **Small PRs (< 200 lines):** First review within **4 business hours**.
* **Medium PRs (200 - 500 lines):** First review within **1 business day (8 hours)**.
* **Large PRs (> 500 lines):** Discouraged! Must be broken down into stacked PRs or reviewed in paired sessions.
* **Hotfixes:** Immediate turnaround (< 30 minutes).

---

## 3. The Constructive Feedback Rubric
Feedback should be objective, respectful, and actionable. Categorize comments using standard prefixes:

| Prefix | Meaning | Action Required |
| :--- | :--- | :--- |
| **\`[Blocking]\`** | Critical bug, security flaw, or architectural violation. | Must be fixed prior to merge. |
| **\`[Suggestion]\`** | Alternative implementation or cleaner style. | Author may consider or discuss. |
| **\`[Question]\`** | Clarification needed to understand intent. | Author responds with explanation. |
| **\`[Nitpick]\`** | Minor styling preference or typo. | Non-blocking; author's discretion. |
| **\`[Kudos]\`** | Praising clean code, clever solution, or good tests. | Encouragement / appreciation. |

### Example Comments:
* \`[Blocking]: This query lacks an index on 'tenant_id', which will cause a table scan on the 5M+ row orders table in production.\`
* \`[Suggestion]: We could use Optional.ofNullable() here to avoid nested null checks.\`
* \`[Kudos]: Great job on adding comprehensive edge-case tests for the leap-year billing cycle!\`

---

## 4. Reviewer Checklist
When reviewing code, ask yourself:
* **Functionality:** Does the code satisfy the ticket requirements?
* **Edge Cases:** How does it behave on empty inputs, nulls, timeouts, or network errors?
* **Security:** Are inputs sanitized? Are access control checks in place?
* **Readability:** Are variable/function names self-descriptive?
* **Testing:** Are tests testing behavior rather than implementation details?`
    },

    {
      id: "qa-test-strategy-template",
      title: "Software Test Strategy & QA Plan Template",
      type: "template",
      phase: "qa",
      version: "v2.1",
      lastUpdated: "2026-02-18",
      owner: "QA & SDET Chapter",
      status: "Active",
      summary: "Comprehensive test plan template covering unit, integration, system, performance, and security testing scopes.",
      tags: ["QA", "Testing", "Test Plan", "Automation", "Strategy"],
      fields: [
        { key: "PROJECT_NAME", label: "Project / Initiative", placeholder: "NextGen Payments Gateway" },
        { key: "QA_LEAD", label: "QA Lead / SDET", placeholder: "Alex Rivera" },
        { key: "RELEASE_TARGET", label: "Release Target", placeholder: "Sprint 42 / Release v2.5.0" }
      ],
      content: `# Software Test Strategy & Plan: {PROJECT_NAME}

**Target Release:** {RELEASE_TARGET}  
**QA Lead:** {QA_LEAD}  
**Document Status:** Approved  
**Last Revised:** 2026-08-19  

---

## 1. Scope and Objectives
Define the functional and non-functional boundaries for the {PROJECT_NAME} release.

### In Scope
* New Payment Method Integrations (Apple Pay, Google Pay, SEPA Direct Debit).
* High-volume checkout idempotency testing.
* Automated regression suite on Chrome, Safari, Firefox, and Edge.
* Load testing up to 5,000 transactions per minute.

### Out of Scope
* Legacy V1 payment gateway backwards compatibility (deprecated in Q2).
* Hardware terminal point-of-sale integrations.

---

## 2. Test Automation Pyramid
We mandate following the testing pyramid distribution:

\`\`\`
       /\\
      /E2E\\      (10% - Playwright / Cypress Critical User Journeys)
     /------\\
    /  API   \\   (30% - Integration & Contract Tests via Postman/RestAssured)
   /----------\\
  /    UNIT    \\ (60% - Unit Tests via Jest/JUnit with ≥ 85% Code Coverage)
 /--------------\\
\`\`\`

---

## 3. Test Environments & Data Management
| Environment | Purpose | Refresh Cadence | Data Masking |
| :--- | :--- | :--- | :--- |
| **Dev / Local** | Unit & Component Testing | Continuous | Synthetic Mock Data |
| **Staging (QA)** | Integration & Automation Runs | Daily automated seed | Sanitized PII Data |
| **Pre-Prod** | Performance & UAT Sign-off | Weekly mirror | Production Anonymized |

---

## 4. Defect Severity & Response Matrix
| Severity | Definition | Resolution SLA |
| :--- | :--- | :--- |
| **P0 - Blocker** | System down, payment failure, data corruption. | < 2 Hours |
| **P1 - Critical** | Core user flow blocked; no reasonable workaround. | < 8 Hours |
| **P2 - Major** | Major feature impaired; workaround available. | < 3 Business Days |
| **P3 - Minor** | UI glitch, cosmetic issue, minor typo. | Next regular sprint |

---

## 5. Exit Criteria & Quality Gates for Release
1. [ ] 100% of P0 and P1 test cases executed with 100% pass rate.
2. [ ] Zero open P0 or P1 defects in backlog.
3. [ ] Code coverage threshold of ≥ 85% verified by SonarQube.
4. [ ] Performance p95 response time < 200ms under full load.
5. [ ] Security static analysis (SAST) & dependency scanning (SCA) report zero high vulnerabilities.`
    },

    {
      id: "post-mortem-template",
      title: "Blameless Incident Post-Mortem Template",
      type: "template",
      phase: "operations",
      version: "v3.0",
      lastUpdated: "2026-02-25",
      owner: "Site Reliability Engineering (SRE)",
      status: "Active",
      summary: "Standard framework for investigating production outages, establishing root cause via 5-Whys, and scheduling prevention actions.",
      tags: ["Incident", "Post-Mortem", "SRE", "Root Cause", "Operations"],
      fields: [
        { key: "INCIDENT_ID", label: "Incident ID", placeholder: "INC-8942" },
        { key: "INCIDENT_TITLE", label: "Incident Title", placeholder: "Authentication Service Outage during Peak Login Window" },
        { key: "SEVERITY", label: "Severity (SEV1/SEV2/SEV3)", placeholder: "SEV1" },
        { key: "INCIDENT_DATE", label: "Incident Date", placeholder: "2026-08-15" },
        { key: "COMMANDER", label: "Incident Commander", placeholder: "Marcus Chen (Staff SRE)" }
      ],
      content: `# Blameless Post-Mortem: {INCIDENT_TITLE} ({INCIDENT_ID})

**Date of Incident:** {INCIDENT_DATE}  
**Severity Level:** {SEVERITY}  
**Incident Commander:** {COMMANDER}  
**Authors:** SRE Team, Core Auth Team  
**Status:** Completed & Reviewed  

---

## 1. Executive Summary
On {INCIDENT_DATE}, the authentication microservice experienced elevated error rates and cascading latency timeouts, impacting login and token renewal for approximately **45,000 active users** over a span of **38 minutes**. Total downtime was mitigated by rolling back deployment tag \`v2.14.1\` and scaling the Redis connection pool.

---

## 2. Impact Metrics
* **Total Downtime (TTR):** 38 minutes
* **Users Impacted:** ~45,000 (18% of active sessions)
* **Failed Requests:** 124,500 (HTTP 504 Gateway Timeout)
* **Revenue Impact (Estimated):** ~$14,200 in delayed checkouts
* **SLA Breach:** Yes (Monthly Auth Availability dropped to 99.82%)

---

## 3. Incident Timeline (UTC)
* **14:02** - Automated release pipeline deployed auth service build \`v2.14.1\`.
* **14:06** - Datadog synthetic monitor triggered high latency alert (p99 > 3000ms).
* **14:10** - PagerDuty paged Primary On-call SRE; {COMMANDER} assumed Incident Commander role.
* **14:15** - Incident Bridge established on Slack channel \`#incident-inc-8942\`.
* **14:22** - Triage identified database connection starvation caused by missing Redis connection pooling timeout.
* **14:28** - Decision made to execute automated rollback to previous stable version \`v2.14.0\`.
* **14:35** - Rollback completed; error rates returned to baseline < 0.01%.
* **14:40** - Incident declared Resolved. Monitoring watch continued for 1 hour.

---

## 4. Root Cause Analysis (The 5 Whys)
1. **Why did users experience 504 Gateway Timeouts?**
   Because the auth service worker threads were exhausted waiting for Redis connections.
2. **Why were Redis connections exhausted?**
   Because a new session validation query in \`v2.14.1\` acquired connections without setting a socket timeout.
3. **Why was no socket timeout configured?**
   The new Redis client initialization code omitted the connection pool timeout config.
4. **Why was this omission not caught during testing?**
   Unit tests used an in-memory mock client that does not simulate socket latency or pool exhaustion.
5. **Why was performance load testing skipped?**
   The change was classified as a "minor refactor" and bypassed pre-prod load test gates.

---

## 5. Corrective & Preventative Action Items (CAPA)
| Action Item | Owner | Target Date | Jira Ticket |
| :--- | :--- | :--- | :--- |
| Enforce global default socket timeout in Redis SDK wrapper | Core Platform | 2026-08-25 | [PROJ-8950] |
| Add automated connection pool saturation tests to CI pipeline | QA / SDET | 2026-08-30 | [PROJ-8951] |
| Update deployment canary gatekeeper to check p99 latency before 100% rollout | DevOps | 2026-09-05 | [PROJ-8952] |
| Update architectural guidelines on connection pool resource hygiene | Arch Board | 2026-09-10 | [PROJ-8953] |`
    },

    {
      id: "definition-of-done-policy",
      title: "Organizational Definition of Done (DoD) Policy",
      type: "policy",
      phase: "requirements",
      version: "v4.0",
      lastUpdated: "2026-01-10",
      owner: "VP of Engineering & Quality Board",
      status: "Active",
      summary: "Mandatory organizational criteria required before any user story, bugfix, or feature is marked 'Done' in JIRA.",
      tags: ["Agile", "Scrum", "DoD", "Policy", "Standards"],
      content: `# Organizational Definition of Done (DoD)

## Policy Statement
To guarantee predictable delivery, prevent technical debt accumulation, and ensure software safety, **no engineering task or user story may be marked as "Done" or released to customers** unless every requirement in this Definition of Done has been verified.

---

## 1. Code & Architecture Standards
* [ ] Code adheres to clean coding guidelines, language style guides, and design patterns.
* [ ] No new compiler warnings, lint errors, or deprecated library calls.
* [ ] Code has been peer-reviewed and approved by at least **2 qualified engineers**.
* [ ] Any new architectural changes or persistent data changes have an approved **Architecture Decision Record (ADR)**.

---

## 2. Automated Testing & Verification
* [ ] Unit test suite includes positive, negative, and edge-case scenarios.
* [ ] Code coverage for newly introduced code is **≥ 85%**.
* [ ] Automated integration tests verify downstream API contracts.
* [ ] Critical UI workflows covered with automated end-to-end regression tests.
* [ ] All tests pass reliably in the CI environment (zero flaky tests allowed).

---

## 3. Security, Privacy & Compliance
* [ ] Static Application Security Testing (SAST) and Dependency Scanning show **zero High or Critical vulnerabilities**.
* [ ] No plaintext secrets, tokens, or credentials checked into version control.
* [ ] User data access complies with GDPR / CCPA data privacy policies (PII properly masked/encrypted).
* [ ] Role-based access control (RBAC) enforced on all new endpoints.

---

## 4. Documentation & Operational Readiness
* [ ] API endpoints documented using OpenAPI / Swagger 3.0 specification.
* [ ] Public documentation, user guides, or internal release notes updated.
* [ ] Structured logging, Prometheus metrics, and distributed tracing spans integrated.
* [ ] Alerting rules and dashboards configured in Datadog/Grafana.
* [ ] Rollback strategy and deployment runbook verified on staging.`
    },

    {
      id: "release-runbook-template",
      title: "Production Deployment Runbook & Verification SOP",
      type: "template",
      phase: "release",
      version: "v2.2",
      lastUpdated: "2026-02-14",
      owner: "Release Management & DevOps",
      status: "Active",
      summary: "Step-by-step production rollout plan with pre-flight checks, canary stages, smoke tests, and rollback triggers.",
      tags: ["Deployment", "Release", "Runbook", "DevOps", "CI/CD"],
      fields: [
        { key: "SERVICE_NAME", label: "Service / Application", placeholder: "Order Processing Engine" },
        { key: "RELEASE_TAG", label: "Release Version Tag", placeholder: "v3.8.0-rc.2" },
        { key: "DEPLOY_LEAD", label: "Deployment Lead", placeholder: "Samantha Ray" },
        { key: "SCHEDULED_TIME", label: "Scheduled Window", placeholder: "2026-08-20 03:00 - 04:00 UTC" }
      ],
      content: `# Production Deployment Runbook: {SERVICE_NAME}

**Target Version:** {RELEASE_TAG}  
**Deployment Lead:** {DEPLOY_LEAD}  
**Execution Window:** {SCHEDULED_TIME}  
**Rollback Window Cutoff:** 30 Minutes post-deployment  

---

## 1. Pre-Flight Verification (T-60 Minutes)
- [ ] Verify staging environment tests are 100% green on tag \`{RELEASE_TAG}\`.
- [ ] Confirm no active P0/P1 incidents are ongoing in the platform.
- [ ] Notify customer support and stakeholders in \`#eng-deployments\`.
- [ ] Take pre-deployment database backup and snapshot.
- [ ] Verify monitoring dashboards (error rates, CPU, latency) are active.

---

## 2. Deployment Execution Steps
\`\`\`bash
# 1. Execute database schema migrations (non-blocking backward compatible)
kubectl exec -it deploy/{SERVICE_NAME}-migration -- npm run db:migrate:status
kubectl exec -it deploy/{SERVICE_NAME}-migration -- npm run db:migrate:up

# 2. Deploy Canary Tier (10% Traffic Routing)
kubectl set image deployment/{SERVICE_NAME}-canary {SERVICE_NAME}={RELEASE_TAG}
kubectl rollout status deployment/{SERVICE_NAME}-canary --timeout=300s

# 3. Monitor Canary health for 10 minutes (Error rate < 0.05%, p99 latency < 150ms)

# 4. Promote to 100% Production Fleet
kubectl set image deployment/{SERVICE_NAME}-prod {SERVICE_NAME}={RELEASE_TAG}
kubectl rollout status deployment/{SERVICE_NAME}-prod --timeout=600s
\`\`\`

---

## 3. Post-Deployment Smoke Verification
- [ ] Execute automated synthetic smoke test suite (\`npm run test:smoke:prod\`).
- [ ] Verify healthcheck endpoint: \`curl -f https://api.internal.net/{SERVICE_NAME}/health\`.
- [ ] Validate Datadog APM tracing for 5xx anomalies.
- [ ] Verify background message queue consumption and worker lag is normal.

---

## 4. Rollback Plan & Trigger Criteria
### Trigger Conditions:
1. Error rate spikes above **0.5%** for > 2 consecutive minutes.
2. Core payment or authentication path fails during smoke tests.
3. p99 latency degrades by more than **50%** over baseline.

### Rollback Command:
\`\`\`bash
kubectl rollout undo deployment/{SERVICE_NAME}-prod
kubectl rollout status deployment/{SERVICE_NAME}-prod
# If database rollback is needed:
kubectl exec -it deploy/{SERVICE_NAME}-migration -- npm run db:migrate:rollback
\`\`\``
    },

    {
      id: "threat-modeling-guideline",
      title: "Secure SDLC & Threat Modeling Guideline",
      type: "guideline",
      phase: "architecture",
      version: "v1.8",
      lastUpdated: "2026-01-28",
      owner: "Application Security Guild",
      status: "Active",
      summary: "STRIDE-based threat modeling methodology, security design reviews, and OWASP Top 10 mitigation strategies.",
      tags: ["Security", "STRIDE", "AppSec", "Threat Modeling", "Compliance"],
      content: `# Secure SDLC & Threat Modeling Guideline

## 1. Introduction
Security is not an afterthought; it is built into every phase of the Software Development Life Cycle (Secure-by-Design). This guideline defines how engineering teams conduct Threat Modeling during the architecture and design phase.

---

## 2. The STRIDE Threat Framework
All new services or major feature designs must evaluate threats against the STRIDE model:

| Threat | Security Property Violated | Example Attack | Standard Mitigation |
| :--- | :--- | :--- | :--- |
| **S**poofing | Authenticity | Impersonating another user session | Mutual TLS, OAuth 2.0 with PKCE, JWT validation |
| **T**ampering | Integrity | Modifying request parameters or DB payload | HMAC signatures, input sanitization, immutable audit logs |
| **R**epudiation | Non-repudiability | Denying performing a financial transaction | Cryptographically signed transaction logs, centralized audit trails |
| **I**nformation Disclosure | Confidentiality | Leaking user PII in API responses or logs | Field-level encryption, TLS 1.3, strict log redaction |
| **D**enial of Service | Availability | Flooding API endpoint with expensive queries | Rate limiting, token bucket algorithms, query pagination |
| **E**levation of Privilege | Authorization | Regular user executing admin endpoint | Role-Based Access Control (RBAC), Policy enforcement (OPA) |

---

## 3. Mandatory Security Verification Gates
1. **Static Code Analysis (SAST):** Scans on every PR with zero allowed Critical/High CVEs.
2. **Software Composition Analysis (SCA):** Automated Dependabot / Snyk scanning for third-party dependencies.
3. **Dynamic Testing (DAST):** Automated vulnerability scanning against staging environments.
4. **Secret Scanning:** Pre-commit hooks and GitHub secret scanning to prevent API key commits.

---

## 4. Security Incident Escalation
If a critical vulnerability is detected in production, immediately page the Security Incident Response Team via Slack \`#sec-ops\` or PagerDuty escalation policy **Sec-Sev1**.`
    },

    {
      id: "rfc-tech-spec-template",
      title: "Technical RFC (Request for Comments) / Design Spec Template",
      type: "template",
      phase: "architecture",
      version: "v2.0",
      lastUpdated: "2026-02-05",
      owner: "Engineering Leadership",
      status: "Active",
      summary: "Structured proposal template for major engineering initiatives, cross-team features, and platform upgrades.",
      tags: ["RFC", "Architecture", "System Design", "Proposal", "Tech Spec"],
      fields: [
        { key: "RFC_NUMBER", label: "RFC Number", placeholder: "RFC-042" },
        { key: "RFC_TITLE", label: "RFC Title", placeholder: "Distributed Event Streaming with Apache Kafka" },
        { key: "LEAD_AUTHOR", label: "Lead Author", placeholder: "David Kim (Principal Engineer)" },
        { key: "TARGET_QUARTER", label: "Target Quarter", placeholder: "Q3 2026" }
      ],
      content: `# {RFC_NUMBER}: {RFC_TITLE}

**Author:** {LEAD_AUTHOR}  
**Status:** In Review (Target: {TARGET_QUARTER})  
**Reviewers:** Core Infrastructure Team, Architecture Review Board  
**Target Delivery:** Q3-Q4 2026  

---

## 1. Problem Statement & Motivation
Describe the business problem, operational pain points, and why the current system architecture is insufficient.

---

## 2. Proposed Architecture & System Design
### High-Level Architecture Diagram
\`\`\`
[Clients] --> [API Gateway] --> [Event Producer Service]
                                       |
                                       v
                                [Kafka Cluster]
                                 /     |     \\
                                v      v      v
                           [Svc A]  [Svc B]  [Data Lake]
\`\`\`

### Data Models & API Contracts
Detail payload schemas, message formats (Protobuf/Avro/JSON), and REST/gRPC interfaces.

---

## 3. Non-Functional Requirements (NFRs)
* **Throughput:** Capable of processing 50,000 events/second.
* **Latency:** End-to-end event propagation p99 < 100ms.
* **Data Retention:** 7 days of compaction retention in Kafka topic tier.
* **Resilience:** Multi-AZ broker replication factor of 3 with min.insync.replicas=2.

---

## 4. Migration & Rollout Strategy
1. **Phase 1 (Shadow Mode):** Dual-write to existing message queue and Kafka topic to validate throughput.
2. **Phase 2 (Canary Consumer):** Migrate read consumers for non-critical analytics pipelines.
3. **Phase 3 (Full Cutover):** Switch core transaction processors to Kafka consumer groups.

---

## 5. Risks, Open Questions & Trade-offs
* *Risk 1:* Operational learning curve for managing Kafka partitions. **Mitigation:** Use AWS MSK managed cluster.
* *Open Question:* Should schema registry be shared across all microservices or isolated per domain?`
    },

    {
      id: "sprint-retro-template",
      title: "Sprint Retrospective Framework & Action Item Template",
      type: "template",
      phase: "requirements",
      version: "v1.5",
      lastUpdated: "2026-01-30",
      owner: "Agile Coaching Guild",
      status: "Active",
      summary: "Continuous improvement retrospective framework based on Start-Stop-Continue and Mad-Sad-Glad models.",
      tags: ["Agile", "Scrum", "Retrospective", "Continuous Improvement"],
      fields: [
        { key: "TEAM_NAME", label: "Team Name", placeholder: "Platform Core Team" },
        { key: "SPRINT_NUM", label: "Sprint Number", placeholder: "Sprint 48" },
        { key: "FACILITATOR", label: "Facilitator", placeholder: "Sarah Jenkins (Scrum Master)" }
      ],
      content: `# Sprint Retrospective: {TEAM_NAME} ({SPRINT_NUM})

**Facilitator:** {FACILITATOR}  
**Date:** 2026-08-19  
**Sprint Goal:** Deliver OAuth2 User Onboarding & Staging Performance Benchmark  
**Goal Outcome:** Completed (92% Velocity Delivery)  

---

## 1. Retrospective Board Insights

### 🟢 What Went Well (Keep Doing)
* Smooth deployment of OAuth2 microservice with zero downtime.
* Pairing on complex database migration reduced PR turnaround time from 2 days to 3 hours.
* Daily standup remained concise and strictly timeboxed to 12 minutes.

### 🟡 What Could Be Improved (Pains & Friction)
* Staging environment was down for 4 hours on Wednesday due to unannounced cluster maintenance.
* User story acceptance criteria for edge cases were ambiguous during mid-sprint refinement.
* Too many ad-hoc Slack interruptions derailed deep focus blocks.

### 🚀 What We Should Start Doing
* Implement an automated notification channel for staging cluster maintenance windows.
* Establish "No Meeting Focus Afternoons" on Tuesdays and Thursdays.

### ⛔ What We Should Stop Doing
* Merging PRs with temporary \`// TODO\` comments lacking an associated Jira ticket link.

---

## 2. SMART Action Items
| Action Item | Assignee | Due Date | Status |
| :--- | :--- | :--- | :--- |
| Set up Slack bot alert for staging deployment schedules | DevOps Lead | Next Sprint | 📝 Open |
| Add "Definition of Ready" checklist to Jira issue template | Scrum Master | 2026-08-25 | 📝 Open |
| Block calendar focus blocks on Tue/Thu 13:00-17:00 | All Team | Immediate | ✅ Done |`
    }
  ],

  checklists: [
    {
      id: "pre-merge-checklist",
      title: "Pull Request & Pre-Merge Readiness Gate",
      phase: "development",
      description: "Interactive verification checklist required by software engineers before requesting peer review or merging into trunk.",
      items: [
        { id: "pm-1", text: "Code follows repository style guides and passes local linter (`npm run lint` or `mvn checkstyle`)", category: "Quality" },
        { id: "pm-2", text: "New unit tests added with branch coverage ≥ 85% on modified code", category: "Testing" },
        { id: "pm-3", text: "All automated CI pipeline checks are green (Build, Unit Tests, Static Analysis)", category: "CI/CD" },
        { id: "pm-4", text: "No secrets, API tokens, passwords, or personal credentials committed", category: "Security" },
        { id: "pm-5", text: "Database migrations are backward-compatible and tested against seeded data", category: "Database" },
        { id: "pm-6", text: "PR description clearly references Jira issue ID and includes verification evidence", category: "Documentation" },
        { id: "pm-7", text: "At least two peer code review approvals received with zero blocking comments", category: "Review" },
        { id: "pm-8", text: "Branch rebased on latest `main` with no merge conflicts", category: "Git" }
      ]
    },
    {
      id: "release-signoff-checklist",
      title: "Production Release Gatekeeper Checklist",
      phase: "release",
      description: "Formal sign-off checklist executed by the Release Lead and On-call Engineer prior to initiating production deployment.",
      items: [
        { id: "rel-1", text: "Change Advisory Board (CAB) / Release sign-off received from Product and QA Leads", category: "Governance" },
        { id: "rel-2", text: "All target release tickets in Jira are marked in 'Ready for Release' state with zero open P0/P1 bugs", category: "QA" },
        { id: "rel-3", text: "End-to-End automated regression test suite executed in Staging with 100% pass rate", category: "Testing" },
        { id: "rel-4", text: "Production database backup and snapshot verified within last 60 minutes", category: "Database" },
        { id: "rel-5", text: "Release Runbook and Rollback commands validated and assigned to designated engineer", category: "Runbook" },
        { id: "rel-6", text: "Telemetry dashboards, error tracking (Sentry/Datadog), and alerts verified online", category: "Observability" },
        { id: "rel-7", text: "Internal stakeholder notification sent to #eng-deployments channel with maintenance window details", category: "Communication" },
        { id: "rel-8", text: "Canary routing configured to 10% traffic for initial 10-minute soak period", category: "Deployment" }
      ]
    },
    {
      id: "security-gatekeeper-checklist",
      title: "Application Security & Compliance Gatekeeper",
      phase: "architecture",
      description: "Security assessment checklist required before launching new public APIs, handling PII, or executing architecture overhauls.",
      items: [
        { id: "sec-1", text: "STRIDE threat model documented and reviewed with the Application Security Guild", category: "Threat Modeling" },
        { id: "sec-2", text: "OWASP Top 10 mitigations verified (SQL injection, XSS, SSRF, Broken Auth)", category: "Vulnerabilities" },
        { id: "sec-3", text: "Static Analysis (SAST) and Software Composition Analysis (SCA) report zero High/Critical vulnerabilities", category: "Automated Scans" },
        { id: "sec-4", text: "Authentication tokens (JWT/OAuth) enforce cryptographic signing, expiry, and revocation checks", category: "Auth" },
        { id: "sec-5", text: "Role-Based Access Control (RBAC) authorization checks enforced on every endpoint", category: "Auth" },
        { id: "sec-6", text: "All data in transit enforced via TLS 1.3; sensitive data at rest encrypted using AES-256", category: "Encryption" },
        { id: "sec-7", text: "Audit logging implemented for all administrative actions and sensitive state mutations", category: "Audit" },
        { id: "sec-8", text: "Data retention and GDPR/CCPA user data deletion workflows verified", category: "Privacy" }
      ]
    },
    {
      id: "incident-response-checklist",
      title: "Live Incident Response & Outage Triage Checklist",
      phase: "operations",
      description: "Emergency operational triage steps to be executed immediately when a P0/P1 production incident is triggered.",
      items: [
        { id: "inc-1", text: "Acknowledge PagerDuty alert and assume Incident Commander (IC) role within 5 minutes", category: "Triage" },
        { id: "inc-2", text: "Establish dedicated incident Slack war-room channel (#incident-YYYYMMDD-id) and Zoom bridge", category: "Communication" },
        { id: "inc-3", text: "Update public/internal status page (status.company.com) with 'Investigating Service Disruption'", category: "Status Page" },
        { id: "inc-4", text: "Inspect APM latency metrics, error graphs, and recent deployment logs to isolate blast radius", category: "Investigation" },
        { id: "inc-5", text: "If recent deployment detected within 30 min, immediately initiate automated container rollback", category: "Mitigation" },
        { id: "inc-6", text: "Verify service health recovery and traffic stabilization post-mitigation", category: "Verification" },
        { id: "inc-7", text: "Broadcast incident resolution update to stakeholders and customer support", category: "Communication" },
        { id: "inc-8", text: "Schedule blameless post-mortem meeting within 48 hours and assign CAPA action items", category: "Post-Incident" }
      ]
    }
  ],

  glossary: [
    { term: "ADR", full: "Architecture Decision Record", def: "A short text document capturing a significant architectural decision along with its context, considered options, and consequences." },
    { term: "OPA", full: "Organizational Process Assets", def: "Plans, processes, policies, procedures, and knowledge bases specific to and used by the performing organization." },
    { term: "DoD", full: "Definition of Done", def: "A formalized checklist of technical, functional, and quality requirements that a product backlog item must fulfill before being deemed complete." },
    { term: "DoR", full: "Definition of Ready", def: "Criteria that a user story or requirement must meet before the development team accepts it into an active sprint." },
    { term: "RACI", full: "Responsible, Accountable, Consulted, Informed", def: "A responsibility assignment matrix that specifies roles across project activities." },
    { term: "DORA Metrics", full: "DevOps Research and Assessment Metrics", def: "Four key metrics for software delivery performance: Deployment Frequency, Lead Time for Changes, Change Failure Rate, and Time to Restore Service (MTTR)." },
    { term: "MTTR", full: "Mean Time to Restore", def: "The average time required to recover from a product or system failure in production." },
    { term: "SLA / SLO / SLI", full: "Service Level Agreement / Objective / Indicator", def: "Framework for defining reliability commitments: SLA (contractual commitment), SLO (internal target), SLI (actual measured metric)." },
    { term: "STRIDE", full: "Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege", def: "A threat modeling methodology developed by Microsoft for identifying software vulnerabilities." },
    { term: "SemVer", full: "Semantic Versioning (MAJOR.MINOR.PATCH)", def: "A standard versioning format where MAJOR is breaking, MINOR is backward-compatible features, and PATCH is bug fixes." }
  ]
};

// Export for browser global context
window.SE_PROCESS_DATA = SE_PROCESS_DATA;
