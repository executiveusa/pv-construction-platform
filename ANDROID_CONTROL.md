# Android Build Control for PV Construction Platform

## 📱 Termux Integration

### Installation Instructions

1. **Install Termux from F-Droid** (not Google Play)
2. **Install required packages:**
   ```bash
   pkg update
   pkg install nodejs git python3
   ```

3. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/pv-construction-platform.git
   cd pv-construction-platform
   ```

4. **Install dependencies:**
   ```bash
   npm install
   cd ralphy && npm install
   cd ../jcodemunch-mcp && npm install
   ```

### Usage Commands

#### Build All Phases
```bash
chmod +x termux-build.sh
./termux-build.sh
```

#### Build Specific Phase
```bash
./termux-build.sh 1    # Phase 1: TypeScript fixes
./termux-build.sh 2    # Phase 2: Backend OS
./termux-build.sh 3    # Phase 3: Hermes integration
./termux-build.sh 4    # Phase 4: UI redesign
./termux-build.sh 5    # Phase 5: Automation
./termux-build.sh 6    # Phase 6: CI/CD
./termux-build.sh 7    # Phase 7: Documentation
```

#### Monitor Progress
```bash
tail -f build.log
```

#### Check Build Status
```bash
echo "Build status: $?"
cat build.log | tail -10
```

### Ralphy Commands (Direct Access)

#### Execute Complete Build Plan
```bash
cd ralphy
./ralphy "Execute complete build plan: Phase 1-7 with jcodemunch optimization and Paul Superpowers integration"
```

#### Monitor Progress
```bash
./ralphy "Report build status and any blockers"
```

#### Individual Phase Commands
```bash
# Phase 1: TypeScript fixes
./ralphy "Fix TypeScript errors in API routes - replace result[0] with result.rows[0]"

# Phase 2: Backend OS
./ralphy "Create orchestrator.ts with job queue, worker spawning, and status tracking"

# Phase 3: Hermes integration
./ralphy "Deploy Paperclip backend as microservice"

# Phase 4: UI redesign
./ralphy "Apply emerald design tokens to tailwind.config.js"

# Phase 5: Automation
./ralphy "Create marketing generator Ralphy task"

# Phase 6: CI/CD
./ralphy "Create GitHub Actions workflow with lint, test, build, deploy"

# Phase 7: Documentation
./ralphy "Generate ONBOARDING.md from codebase"
```

### jcodemunch-MCP Integration

#### Compress Prompts
```bash
cd jcodemunch-mcp
./jcodemunch --input "large prompt text" --output "compressed_prompt.txt"
```

#### Optimize API Calls
```bash
# Use in Ralphy tasks automatically
./ralphy "Task description --jcodemunch"
```

### Paul Superpowers Integration

#### VS Code Setup (via Termux-x11)
```bash
pkg install termux-x11
termux-x11 &
code .
```

#### Use VS Code Extensions
- Auto-complete for TypeScript
- Snippets for React components
- Docker integration
- Git integration

### Monitoring & Debugging

#### Real-time Logs
```bash
# Follow build log
tail -f build.log

# Check Ralphy output
cd ralphy && tail -n 50 output.log

# Check jcodemunch output
cd jcodemunch-mcp && tail -n 50 compression.log
```

#### Error Recovery
```bash
# Reset build
git reset --hard HEAD
rm -rf node_modules package-lock.json
npm install

# Restart specific phase
./termux-build.sh 3
```

### Performance Tips

1. **Use Wi-Fi** for faster npm installs
2. **Clear cache periodically:**
   ```bash
   npm cache clean --force
   ```
3. **Monitor memory usage:**
   ```bash
   top
   ```
4. **Kill hanging processes:**
   ```bash
   pkill -f ralphy
   pkill -f node
   ```

### Security Notes

- Keep environment variables secure
- Use SSH keys for GitHub access
- Regularly update packages:
  ```bash
  pkg upgrade
  npm update -g
  ```

### Troubleshooting

#### Common Issues
1. **Node.js version:** Use `node-lts` for stability
2. **Permission errors:** `chmod +x` on scripts
3. **Network issues:** Use `pkg update && pkg upgrade`
4. **Out of memory:** Close other apps, use swap file

#### Emergency Commands
```bash
# Force kill all processes
pkill -9 -f node
pkill -9 -f ralphy

# Clean rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Advanced Usage

#### Scheduled Builds
```bash
# Install cron
pkg install cron

# Add to crontab
echo "0 2 * * * /data/data/com.termux/files/home/pv-construction-platform/termux-build.sh" | crontab -
```

#### Remote Control
```bash
# SSH into device
ssh user@termux-device-ip

# Run build remotely
./termux-build.sh
```

### Output Examples

#### Successful Build
```
🚀 Starting Android-controlled build - Phase: all
📝 Phase 1: Fixing TypeScript errors...
✅ Phase 1 completed
🔧 Phase 2: Backend OS implementation...
✅ Phase 2 completed
🤖 Phase 3: Hermes & Paperclip integration...
✅ Phase 3 completed
🎨 Phase 4: UI/UX redesign...
✅ Phase 4 completed
💰 Phase 5: Automation & revenue engine...
✅ Phase 5 completed
🚀 Phase 6: CI/CD & deployment...
✅ Phase 6 completed
📚 Phase 7: Documentation & handoff...
✅ Phase 7 completed
🔍 Running final build verification...
✅ BUILD SUCCESSFUL!
📊 Build log saved to: /data/data/com.termux/files/home/pv-construction-platform/build.log
🎯 Android control script completed!
```

#### Error Output
```
❌ BUILD FAILED. Check /data/data/com.termux/files/home/pv-construction-platform/build.log for details.
```

### Next Steps

1. Install Termux on your Android device
2. Follow the setup instructions
3. Run `./termux-build.sh` to start the build
4. Monitor progress with `tail -f build.log`
5. Access the built app at `http://localhost:3000`

---

**Note:** This integration allows you to control the entire build process from your Android device using Termux, with full access to Ralphy, jcodemunch-MCP, and Paul Superpowers capabilities.