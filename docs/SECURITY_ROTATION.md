# Security: API Keys & Secrets Rotation

## ⚠️ INCIDENT: Committed Secrets in `master.env`

**Status**: CRITICAL  
**Date Found**: May 7, 2026  
**Action**: All secrets listed below must be rotated immediately.

### Leaked Credentials (from `master.env`)

The following secrets were committed to the repository and are now **COMPROMISED**:

- [ ] **Anthropic API Keys** (×2)
  - `ANTHROPIC_API_KEY`
  - `ANTHROPIC_API_KEY_2`
  - **Action**: Revoke in Anthropic console; generate new keys

- [ ] **OpenAI API Keys** (×2)
  - `OPENAI_API_KEY`
  - `OPENAI_API_KEY_ALT`
  - **Action**: Revoke at platform.openai.com; regenerate

- [ ] **Google API Keys** (×2)
  - `GOOGLE_API_KEY`
  - `GOOGLE_API_KEY_ALT`
  - **Action**: Disable in Google Cloud Console; create new keys

- [ ] **GLM API Key**
  - `GLM_API_KEY`
  - **Action**: Revoke & regenerate

- [ ] **Notion API Token**
  - `NOTION_API_TOKEN`
  - **Action**: Revoke in Notion workspace settings; issue new token

- [ ] **Supabase Access Token**
  - `SUPABASE_ACCESS_TOKEN`
  - **Action**: Revoke in Supabase dashboard; generate new token

- [ ] **Coolify Tokens** (×3 + SSH keys)
  - `COOLIFY_API_TOKEN`, `COOLIFY_API_TOKEN_ALT`, `COOLIFY_API_TOKEN_ALT2`
  - `COOLIFY_SSH_PUBLIC`, `COOLIFY_SSH_PRIVATE`
  - **Action**: Revoke all; regenerate SSH keypair; create new API tokens

- [ ] **Twilio Credentials**
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_SECRET` (Auth Token)
  - **Action**: Revoke auth token in Twilio console; regenerate

---

## Rotation Procedure

### Step 1: Stop All Services
```bash
docker-compose down
cd infra/tiledesk && docker-compose down && cd ../..
```

### Step 2: Rotate Each Secret
- Go to each service's dashboard (Anthropic, OpenAI, Google, etc.)
- Revoke the compromised key
- Generate a new key
- Update `.env` and deploy-specific `.env.production` files **ONLY** (never commit)

### Step 3: Update & Deploy
```bash
# Update .env.production with new keys
# DO NOT commit .env files
vi .env.production

# Restart services
docker-compose up -d
```

### Step 4: Verify
```bash
# Test each integration
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
```

### Step 5: Git Cleanup (Optional, Advanced)
If you need to remove the compromised commit from history:
```bash
# WARNING: This rewrites history. Coordinate with team.
git filter-branch --tree-filter 'rm -f master.env' HEAD
```

---

## Best Practices Going Forward

### ✅ DO:
- Use `.env.example` with **placeholder values only** (e.g., `APIKEY_HERE`, `YOUR_TOKEN_HERE`)
- Add `*.env*` patterns to `.gitignore` (already done)
- Use environment-specific `.env.production`, `.env.staging` (never commit)
- Rotate keys every 90 days (or immediately if compromised)
- Use separate keys per environment (dev, staging, prod)
- Store sensitive values in CI/CD secrets (GitHub Secrets, GitLab CI vars, etc.)

### ❌ DON'T:
- Commit `.env`, `master.env`, or any file with real secrets
- Hardcode API keys in source code
- Share credentials in Slack, email, or unencrypted channels
- Use the same key for multiple environments

### 🔐 Infrastructure Secrets (VPS Deployment)
For production VPS, use one of these approaches:
1. **Docker Secrets** (if using Docker Swarm)
   ```yaml
   secrets:
     db_password:
       external: true
   ```
2. **Environment File on Server** (locked down, not in git)
   ```bash
   scp .env.production user@server:/opt/app/.env.production
   chmod 600 /opt/app/.env.production
   ```
3. **HashiCorp Vault** or **AWS Secrets Manager** (enterprise)

---

## Verification Checklist

- [ ] All secrets listed above have been rotated
- [ ] New secrets are in `.env.production` (or equivalent deployment config)
- [ ] `.gitignore` includes `master.env`, `*.env*` patterns
- [ ] Git history has been cleaned (if desired)
- [ ] All services are running with new credentials
- [ ] Logs show successful authentication to external services
- [ ] Monitoring alerts are configured for auth failures

---

## References

- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub: Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Twelve-Factor App: Config](https://12factor.net/config)

