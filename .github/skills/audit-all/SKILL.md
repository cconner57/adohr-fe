---
name: audit-all
description: Master auditor that runs the platform health check across system design, UX, frontend, QA, and documentation.
---

You are the lead architect and master auditor for ADOHR-FE. Your task is to run a comprehensive audit of every aspect of the frontend platform — system design, UX, frontend code, test coverage, and documentation — in sequence, accumulate all findings into a single report file, and then implement approved changes in parallel waves.

This command is designed to be run approximately once a month as a full platform health check.

---

## Step 1 — Create the report file

Determine today's date. Create the file `audit-reports/audit-YYYY-MM-DD.md` (create the `audit-reports/` directory if it doesn't exist). Write this header:

```markdown
# ADOHR-FE Monthly Audit — YYYY-MM-DD

Five audit domains were run in sequence. Each section below contains that domain's full findings,
scorecard, and top priorities. The Master Priority List at the end consolidates all findings
across domains ranked by severity.

---
```

---

## Step 2 — Run each audit in sequence

Run the following 5 audits in order. For each one:

1. Read the corresponding skill file from `.github/skills/` to load that auditor's full persona, evaluation framework, and project conventions
2. Adopt that persona completely and run the full audit — use the exploration phase defined in that skill file (read the actual codebase files; do not skip the exploration)
3. Append the full findings to the report file under its section header
4. Print a progress line: `✓ [Domain] audit complete — N findings — starting [Next Domain] audit...`
5. Move to the next audit

### Audit 1 of 5: System Design
- Skill file: `.github/skills/audit-system-design/SKILL.md`
- Report section header: `## System Design Audit`
- Focus: Frontend architecture, state management strategy, API integration, routing design, resilience

### Audit 2 of 5: UX
- Skill file: `.github/skills/audit-ux/SKILL.md`
- Report section header: `## UX Audit`
- Focus: Usability, information hierarchy, interaction feedback, accessibility experience, visual consistency

### Audit 3 of 5: Frontend Code
- Skill file: `.github/skills/audit-frontend/SKILL.md`
- Report section header: `## Frontend Code Audit`
- Focus: Vue/TypeScript code quality, reactivity bugs, Pinia patterns, security, conventions

### Audit 4 of 5: QA & Testing
- Skill file: `.github/skills/audit-qa/SKILL.md`
- Report section header: `## QA & Testing Audit`
- Focus: Test coverage gaps, test quality, missing test infrastructure — informed by issues found in audits 2 and 3

### Audit 5 of 5: Documentation
- Skill file: `.github/skills/audit-docs/SKILL.md`
- Report section header: `## Documentation Audit`
- Focus: CLAUDE.md accuracy, code comments, TSDoc coverage, memory file freshness

---

## Step 3 — Write the Master Priority List

After all 5 audits are complete, append this section to the report:

```markdown
---

## Master Priority List

All findings across all domains, ranked by severity then user/system impact.

### Critical
[List all Critical findings from all 5 audits with domain tag, e.g. [Frontend], [UX]]

### High
[List all High findings]

### Medium
[List all Medium findings]

### Low
[List all Low findings]

---

## Implementation Waves

When approved, changes will be implemented in two parallel waves:

### Wave 1 — Run in parallel
- **Frontend track**: All frontend code fixes from the Frontend Code audit
- **Docs track**: All documentation updates from the Documentation audit
- **UX track**: Any UX fixes that are component/style changes
- **System design track**: Architecture fixes that are clearly scoped

### Wave 2 — Run after Wave 1 completes
- **QA track**: All new tests from the QA audit (written against the corrected Wave 1 code)
- **Cross-cutting fixes**: Issues requiring coordinated changes across multiple domains

---
```

---

## Step 4 — Pause for review

Print this message and stop:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Audit complete. Report saved to:
   audit-reports/audit-YYYY-MM-DD.md

Review the report and reply:
  • "implement" — to proceed with all changes
  • "implement critical only" — to implement only Critical severity items
  • "implement [section]" — e.g. "implement frontend" to implement one domain
  • Skip specific items by naming them before saying implement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Do NOT implement anything until the user replies.

---

## Step 5 — Implement approved changes

When the user approves, implement in two waves.

### Wave 1: Launch all tracks in parallel

In a single response, launch one Agent subagent per track. Provide each agent with:
- Its specific list of approved changes to implement (from the report)
- The relevant skill file context for its domain
- Instruction to follow all project conventions from that skill file

Tracks to launch simultaneously (all in one message, multiple Agent tool calls):
- **Frontend agent**: Implements all approved frontend code fixes
- **Docs agent**: Implements all approved documentation changes
- Additional agents as needed for UX fixes or system design fixes

Wait for all Wave 1 agents to complete before proceeding.

### Wave 2: QA and cross-cutting changes

After Wave 1 is confirmed complete:
- Launch a **QA agent** to write all new tests from the audit (the agent should be aware of what was changed in Wave 1)
- Implement any cross-cutting fixes that require coordinated changes

### After implementation

Print a summary:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Implementation complete.

Wave 1: [N] changes across frontend, docs, UX
Wave 2: [N] tests added, [N] cross-cutting fixes

Run `npm run check` to verify.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
