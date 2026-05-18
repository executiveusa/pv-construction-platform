# Vercel Deployment Guide

## Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository connected to Vercel
- Environment variables configured in Vercel dashboard

## Deployment Steps

### 1. Connect Repository
1. Visit https://vercel.com/new
2. Import the GitHub repository: executiveusa/pv-construction-platform
3. Choose framework preset: Next.js
4. Configure build settings:
   - Build command: \
pm run build\
   - Output directory: \.next\
   - Install command: \
pm install\

### 2. Environment Variables
Set the following in Vercel dashboard (Settings > Environment Variables):

\\\
NEXT_PUBLIC_APP_URL=https://pv-construction-platform.vercel.app
DATABASE_URL=<your-postgres-url>
JWT_SECRET=<your-jwt-secret>
TWILIO_ACCOUNT_SID=<your-twilio-sid>
TWILIO_AUTH_TOKEN=<your-twilio-token>
TWILIO_PHONE_NUMBER=<your-twilio-number>
ELEVENLABS_API_KEY=<your-elevenlabs-key>
TILEDESK_PROJECT_ID=<your-tiledesk-id>
TILEDESK_API_KEY=<your-tiledesk-api-key>
\\\

### 3. Deploy
1. Vercel auto-deploys on push to main branch
2. Preview deployments available for pull requests
3. Production URL: https://pv-construction-platform.vercel.app

## Monitoring
- View logs: https://vercel.com/dashboard
- Monitor performance: Vercel Analytics
- CI/CD status: GitHub Actions integration

## Troubleshooting
- Build fails: Check Node version and dependencies
- Database connection: Verify DATABASE_URL is set
- Missing env vars: Check all vars are configured in Vercel dashboard

## Rollback
- Use Vercel dashboard to rollback to previous deployment
- Or push a new commit to main to trigger new deployment
