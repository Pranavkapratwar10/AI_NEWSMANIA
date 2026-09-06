# 🔧 Complete Git Commands Guide

## 📍 Your Project Location
```
D:\pranav__all_projects\AI_NEWSMANIA
```

## 🔗 Your GitHub Repository
```
https://github.com/mayurhiware79/NEWSMANIA-V4.git
```

---

## 🚀 STEP-BY-STEP: Push Your Code to GitHub

### STEP 1: Open PowerShell in Your Project Folder

**Method 1 - Using File Explorer:**
1. Open File Explorer
2. Navigate to: `D:\pranav__all_projects\AI_NEWSMANIA`
3. Click on the address bar
4. Type: `powershell`
5. Press Enter

**Method 2 - Using PowerShell:**
```powershell
cd D:\pranav__all_projects\AI_NEWSMANIA
```

---

### STEP 2: Check Git Status (See What Changed)

```powershell
git status
```

**What you'll see:**
- Modified files (M) - Files you changed
- Untracked files (??) - New files not yet tracked by Git

---

### STEP 3: Add All Files to Git Staging

```powershell
git add .
```

**What this does:**
- `.` means "add everything"
- Stages all changes for commit
- Ready to be saved

**Alternative (Add specific files):**
```powershell
# Add only specific file
git add DOCUMENTATION.md

# Add multiple specific files
git add DOCUMENTATION.md DEPLOYMENT_GUIDE.md
```

---

### STEP 4: Commit Your Changes

```powershell
git commit -m "Add deployment guides and new features"
```

**What this does:**
- Saves your changes with a message
- `-m` means "message"
- Message should describe what you changed

**Better commit messages examples:**
```powershell
git commit -m "Add deployment configuration for Render"
git commit -m "Update API keys and contact information"
git commit -m "Add complete project documentation"
git commit -m "Prepare project for production deployment"
```

---

### STEP 5: Push to GitHub

```powershell
git push origin main
```

**What this does:**
- `origin` = Your GitHub repository
- `main` = Your main branch
- Uploads all commits to GitHub

**You'll see output like:**
```
Enumerating objects: 45, done.
Counting objects: 100% (45/45), done.
Delta compression using up to 8 threads
Compressing objects: 100% (32/32), done.
Writing objects: 100% (35/35), 8.54 KiB | 2.13 MiB/s, done.
Total 35 (delta 18), reused 0 (delta 0), pack-reused 0
To https://github.com/mayurhiware79/NEWSMANIA-V4.git
   abc1234..def5678  main -> main
```

---

## ✅ ALL COMMANDS IN ONE GO (Copy-Paste)

**Open PowerShell and run these commands one by one:**

```powershell
# Navigate to project folder
cd D:\pranav__all_projects\AI_NEWSMANIA

# Check what changed
git status

# Add all changes
git add .

# Check what's staged (optional)
git status

# Commit with message
git commit -m "Add deployment guides, documentation, and production configuration"

# Push to GitHub
git push origin main
```

---

## 🔐 If Git Asks for Login

**Windows Credential Manager:**
Git will open a login window:
1. Enter your GitHub username
2. **Don't use password!** Use Personal Access Token
3. If you don't have token, create one below

**Create GitHub Personal Access Token:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "NewsMania Deployment"
4. Select scopes: ✅ repo (all)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this as password when Git asks

**Or Use GitHub CLI (Easier):**
```powershell
# Install GitHub CLI (if not installed)
winget install GitHub.cli

# Login
gh auth login

# Follow the prompts - choose HTTPS and browser login
```

---

## 📊 Useful Git Commands

### Check Status
```powershell
# See what's changed
git status

# Short version
git status -s
```

### See Changes
```powershell
# See what you modified (before adding)
git diff

# See what's staged (after git add)
git diff --staged
```

### View Commit History
```powershell
# See all commits
git log

# See last 5 commits
git log -5

# See one-line summary
git log --oneline
```

### Undo Changes
```powershell
# Discard changes to a file (CAREFUL!)
git checkout -- filename.js

# Unstage a file (undo git add)
git reset HEAD filename.js

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) - CAREFUL!
git reset --hard HEAD~1
```

### Branch Management
```powershell
# See all branches
git branch

# Create new branch
git branch feature-name

# Switch to branch
git checkout feature-name

# Create and switch in one command
git checkout -b feature-name

# Delete branch
git branch -d feature-name
```

### Remote Repository
```powershell
# See remote repository
git remote -v

# Add remote (if needed)
git remote add origin https://github.com/username/repo.git

# Change remote URL
git remote set-url origin https://github.com/username/new-repo.git
```

### Pull Latest Changes
```powershell
# Get latest from GitHub
git pull origin main
```

---

## 🔄 Common Workflows

### Daily Development Workflow
```powershell
# 1. Start work - get latest
git pull origin main

# 2. Make changes to your files

# 3. Check what changed
git status

# 4. Add changes
git add .

# 5. Commit
git commit -m "Description of changes"

# 6. Push to GitHub
git push origin main
```

### Working with Branches
```powershell
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push feature branch
git push origin feature/new-feature

# Switch back to main
git checkout main

# Merge feature into main
git merge feature/new-feature

# Push updated main
git push origin main

# Delete feature branch
git branch -d feature/new-feature
```

---

## 🐛 Troubleshooting

### Problem 1: "fatal: not a git repository"

**Solution:**
```powershell
# Initialize git
git init

# Add remote
git remote add origin https://github.com/mayurhiware79/NEWSMANIA-V4.git

# Pull existing code
git pull origin main --allow-unrelated-histories
```

### Problem 2: "fatal: refusing to merge unrelated histories"

**Solution:**
```powershell
git pull origin main --allow-unrelated-histories
```

### Problem 3: Merge Conflicts

**When you see:**
```
CONFLICT (content): Merge conflict in file.js
```

**Solution:**
1. Open the conflicting file
2. Look for conflict markers:
```javascript
<<<<<<< HEAD
Your changes
=======
Changes from GitHub
>>>>>>> branch-name
```
3. Choose which code to keep
4. Remove conflict markers
5. Save file
6. Add and commit:
```powershell
git add .
git commit -m "Resolve merge conflict"
git push origin main
```

### Problem 4: "Updates were rejected"

**Solution:**
```powershell
# Pull first, then push
git pull origin main
git push origin main
```

### Problem 5: Wrong Commit Message

**Solution:**
```powershell
# Change last commit message
git commit --amend -m "New correct message"

# If already pushed (CAREFUL!)
git push origin main --force
```

### Problem 6: Forgot to Add Files

**Solution:**
```powershell
# Add forgotten files
git add forgotten-file.js

# Add to last commit
git commit --amend --no-edit

# Push
git push origin main --force
```

---

## 🔒 .gitignore File

**Important files to NEVER push to GitHub:**

Your `.gitignore` should contain:
```
# Environment variables (CRITICAL!)
.env
.env.local
.env.production
.env.development

# Dependencies
node_modules/
package-lock.json (sometimes)

# Build output
dist/
build/
.next/
out/

# Logs
*.log
logs/

# OS files
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/
*.swp

# Testing
coverage/
.nyc_output/
```

**Check if .env is ignored:**
```powershell
git status --ignored
```

**If .env shows up (BAD!):**
```powershell
# Remove from Git (keep file locally)
git rm --cached .env

# Add to .gitignore
echo .env >> .gitignore

# Commit
git add .gitignore
git commit -m "Remove .env from tracking"
git push origin main
```

---

## 📝 Git Best Practices

### Commit Messages
✅ **Good:**
```
Add user authentication feature
Fix bug in news API fetching
Update Firebase configuration
Improve mobile responsiveness
```

❌ **Bad:**
```
update
fix
changes
asdf
```

### Commit Frequency
- Commit often (after each logical change)
- Don't commit huge changes all at once
- Each commit should have one purpose

### Before Pushing
```powershell
# Always check before pushing
git status
git log --oneline -5
git diff origin/main
```

---

## 🎯 Quick Reference Card

```powershell
# Essential Commands
git status              # What changed?
git add .              # Stage everything
git add file.js        # Stage specific file
git commit -m "msg"    # Save changes
git push origin main   # Upload to GitHub
git pull origin main   # Download from GitHub

# Information
git log                # See history
git diff               # See changes
git branch             # See branches
git remote -v          # See remote URL

# Undo
git reset HEAD file    # Unstage file
git checkout -- file   # Discard changes
git reset --soft HEAD~1 # Undo last commit
```

---

## 🔗 Helpful Resources

**Git Documentation:**
- Official: https://git-scm.com/doc
- GitHub Guide: https://guides.github.com/

**Interactive Learning:**
- Learn Git: https://learngitbranching.js.org/
- Git Tutorial: https://www.atlassian.com/git/tutorials

**Cheat Sheets:**
- GitHub: https://education.github.com/git-cheat-sheet-education.pdf
- GitLab: https://about.gitlab.com/images/press/git-cheat-sheet.pdf

---

## ✅ Final Checklist Before Pushing

- [ ] All changes committed
- [ ] .env file NOT in git (check .gitignore)
- [ ] Code tested locally (npm run dev works)
- [ ] Build works (npm run build succeeds)
- [ ] Commit message is descriptive
- [ ] Ready to push to GitHub

---

## 🎉 You're Ready!

Now run the commands and push your code to GitHub!

**Need help?** Email: pranavkapratwar106@gmail.com

---

*Last Updated: December 2024*  
*For: NewsMania Project*
