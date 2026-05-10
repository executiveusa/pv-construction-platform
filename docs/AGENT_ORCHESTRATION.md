# Agent Orchestration Architecture (Phase 2)

## Overview
Multi-agent AI system using **Beads** (git-backed task tracker) and **Agent Mail MCP** (inter-agent messaging) for autonomous lead processing, contractor matching, and follow-up.

## Agents

### 1. Lead Intake Agent
- **Trigger**: New lead from website form or Tiledesk chatbot
- **Actions**:
  - Validate and enrich lead data
  - Score lead quality (budget, timeline, project type)
  - Route high-value leads for immediate human review
  - Assign to Matcher Agent for contractor pairing

### 2. Contractor Matcher Agent
- **Trigger**: Message from Lead Intake Agent
- **Actions**:
  - Query contractor database by specialties + service zones
  - Score match quality (availability, past reviews, zone proximity)
  - Send top 3 matches to Review Agent for validation
  - Create assignment in database

### 3. Follow-up Agent
- **Trigger**: Scheduled (daily check for stale leads)
- **Actions**:
  - Check leads with status "new" older than 24h → send follow-up SMS
  - Check leads with status "contacted" older than 72h → escalate
  - Check leads with status "assigned" older than 7d → check contractor status

### 4. Review Agent
- **Trigger**: Project marked "completed"
- **Actions**:
  - Send review request SMS to lead's phone
  - Generate verification code
  - Monitor for SMS reply
  - Publish verified review

### 5. Social Impact Agent
- **Trigger**: Monthly schedule + project completions
- **Actions**:
  - Calculate carbon offsets from construction projects
  - Track tree planting commitments
  - Update social_impact table
  - Generate monthly impact report

## Communication Flow

```
Lead Form → Lead Intake Agent → Contractor Matcher Agent → Assignment
                                        ↓
                               Follow-up Agent (scheduled)
                                        ↓
                               Review Agent (on completion)
                                        ↓
                               Social Impact Agent (monthly)
```

## Beads Integration
- Each agent's tasks tracked in Beads (SQLite in git repo)
- Task states: todo → in-progress → done
- Agents can query each other's task status
- Full audit trail via git commits

## Agent Mail MCP Integration
- Agents communicate via email-like messages
- Message format: structured JSON with type, payload, sender, recipient
- Async processing — agents poll their mailbox
- Dead letter queue for failed deliveries

## Implementation Plan
1. Set up Beads in repo root (`/beads/`)
2. Create agent definitions in `packages/agents/`
3. Implement Lead Intake Agent first (simplest flow)
4. Add Contractor Matcher once test data exists
5. Follow-up Agent requires cron/scheduler (node-cron or system cron)
6. Review + Social Impact agents after MVP launch
