#!/bin/bash
# Android Control Script for PV Construction Platform
# Usage: termux-build.sh [phase]

PHASE=${1:-"all"}
REPO_DIR="/data/data/com.termux/files/home/pv-construction-platform"
LOG_FILE="$REPO_DIR/build.log"

echo "🚀 Starting Android-controlled build - Phase: $PHASE"
echo "Timestamp: $(date)" > $LOG_FILE

# Navigate to repo
cd $REPO_DIR

# Phase 1: Fix TypeScript errors
if [[ "$PHASE" == "all" || "$PHASE" == "1" ]]; then
    echo "📝 Phase 1: Fixing TypeScript errors..."
    ralphy "Fix TypeScript errors in API routes - replace result[0] with result.rows[0] in contractors/route.ts, reviews/route.ts, leads/[id]/route.ts, leads/[id]/assign/route.ts" >> $LOG_FILE 2>&1
    echo "✅ Phase 1 completed" | tee -a $LOG_FILE
fi

# Phase 2: Backend OS Implementation
if [[ "$PHASE" == "all" || "$PHASE" == "2" ]]; then
    echo "🔧 Phase 2: Backend OS implementation..."
    ralphy "Create orchestrator.ts with job queue, worker spawning, and status tracking" >> $LOG_FILE 2>&1
    ralphy "Add workerRunner.ts with Ralphy + jcodemunch + Uncodixfy integration" >> $LOG_FILE 2>&1
    ralphy "Create /api/orchestrate route with JWT auth" >> $LOG_FILE 2>&1
    echo "✅ Phase 2 completed" | tee -a $LOG_FILE
fi

# Phase 3: Hermes & Paperclip Integration
if [[ "$PHASE" == "all" || "$PHASE" == "3" ]]; then
    echo "🤖 Phase 3: Hermes & Paperclip integration..."
    ralphy "Deploy Paperclip backend as microservice" >> $LOG_FILE 2>&1
    ralphy "Configure Hermes agent with goals.json and heart/soul prompts" >> $LOG_FILE 2>&1
    ralphy "Create orchestratorTool.ts for Hermes ↔ API communication" >> $LOG_FILE 2>&1
    echo "✅ Phase 3 completed" | tee -a $LOG_FILE
fi

# Phase 4: UI/UX Emerald Tablet Redesign
if [[ "$PHASE" == "all" || "$PHASE" == "4" ]]; then
    echo "🎨 Phase 4: UI/UX redesign..."
    ralphy "Apply emerald design tokens to tailwind.config.js" >> $LOG_FILE 2>&1
    ralphy "Redesign all pages with three-column layout and luxury typography" >> $LOG_FILE 2>&1
    ralphy "Create admin dashboard with emerald theme" >> $LOG_FILE 2>&1
    echo "✅ Phase 4 completed" | tee -a $LOG_FILE
fi

# Phase 5: Automation & Revenue Engine
if [[ "$PHASE" == "all" || "$PHASE" == "5" ]]; then
    echo "💰 Phase 5: Automation & revenue engine..."
    ralphy "Create marketing generator Ralphy task" >> $LOG_FILE 2>&1
    ralphy "Build ad-spend scheduler with mock API" >> $LOG_FILE 2>&1
    ralphy "Implement revenue tracker with PostgreSQL aggregation" >> $LOG_FILE 2>&1
    echo "✅ Phase 5 completed" | tee -a $LOG_FILE
fi

# Phase 6: CI/CD & Deployment
if [[ "$PHASE" == "all" || "$PHASE" == "6" ]]; then
    echo "🚀 Phase 6: CI/CD & deployment..."
    ralphy "Create GitHub Actions workflow with lint, test, build, deploy" >> $LOG_FILE 2>&1
    ralphy "Set up Vercel deployment with environment variables" >> $LOG_FILE 2>&1
    ralphy "Add monitoring and health checks" >> $LOG_FILE 2>&1
    echo "✅ Phase 6 completed" | tee -a $LOG_FILE
fi

# Phase 7: Documentation & Handoff
if [[ "$PHASE" == "all" || "$PHASE" == "7" ]]; then
    echo "📚 Phase 7: Documentation & handoff..."
    ralphy "Generate ONBOARDING.md from codebase" >> $LOG_FILE 2>&1
    ralphy "Create USE_CASES.md for Hermes commands" >> $LOG_FILE 2>&1
    ralphy "Build DEVELOPER.md with architecture diagrams" >> $LOG_FILE 2>&1
    echo "✅ Phase 7 completed" | tee -a $LOG_FILE
fi

# Final build verification
echo "🔍 Running final build verification..."
npm run build >> $LOG_FILE 2>&1
if [ $? -eq 0 ]; then
    echo "✅ BUILD SUCCESSFUL!" | tee -a $LOG_FILE
else
    echo "❌ BUILD FAILED. Check $LOG_FILE for details." | tee -a $LOG_FILE
fi

echo "📊 Build log saved to: $LOG_FILE"
echo "🎯 Android control script completed!"