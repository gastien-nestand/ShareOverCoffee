# Git Workflow - Feature Branch Strategy

## Overview
This document outlines the Git workflow for the ShareOverCoffee project to ensure a stable main branch and safe feature development.

## Branch Structure

### Main Branch
- **Purpose**: Production-ready code only
- **Protection**: Never commit directly to main
- **Deployment**: Automatically deploys to production (Vercel)

### Feature Branches
- **Naming**: `feature/descriptive-name`
- **Purpose**: Develop new features in isolation
- **Lifespan**: Delete after merging to main

### Bugfix Branches
- **Naming**: `bugfix/issue-description`
- **Purpose**: Fix bugs without affecting main
- **Lifespan**: Delete after merging to main

## Workflow Steps

### 1. Starting a New Feature

```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create and switch to a new feature branch
git checkout -b feature/your-feature-name
```

**Example:**
```bash
git checkout -b feature/collaborative-reading
```

### 2. Working on the Feature

```bash
# Make your changes
# ... edit files ...

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add annotation sidebar component"

# Push to remote (first time)
git push -u origin feature/your-feature-name

# Subsequent pushes
git push
```

### 3. Testing the Feature

Before merging, ensure:
- [ ] Code builds without errors (`npm run build`)
- [ ] All features work as expected
- [ ] No console errors in browser
- [ ] Database migrations run successfully
- [ ] Responsive design works on mobile

### 4. Merging to Main

```bash
# Switch to main
git checkout main

# Pull latest changes
git pull origin main

# Merge your feature branch
git merge feature/your-feature-name

# Push to main
git push origin main
```

### 5. Cleanup

```bash
# Delete local feature branch
git branch -d feature/your-feature-name

# Delete remote feature branch
git push origin --delete feature/your-feature-name
```

## Best Practices

### Commit Messages
Use clear, descriptive commit messages:
- ✅ `Add user authentication with Google OAuth`
- ✅ `Fix like button not updating count`
- ✅ `Update database schema for annotations`
- ❌ `fix bug`
- ❌ `updates`
- ❌ `wip`

### Commit Frequency
- Commit often with logical units of work
- Each commit should represent a complete, working change
- Don't commit broken code

### Before Merging
Always verify:
1. Run `npm run build` - ensure no build errors
2. Run `npm run dev` - test all features manually
3. Check database migrations work
4. Review all changed files

## Emergency Rollback

If something breaks in main:

```bash
# View commit history
git log --oneline

# Revert to a specific commit
git reset --hard <commit-hash>

# Force push (use with caution!)
git push -f origin main
```

**⚠️ Warning**: Only use force push in emergencies and when working solo.

## Stashing Changes

If you need to switch branches with uncommitted changes:

```bash
# Save current work
git stash

# Switch branches
git checkout main

# Return to feature branch
git checkout feature/your-feature-name

# Restore stashed work
git stash pop
```

## Common Scenarios

### Scenario 1: Abandoned Feature
```bash
# Delete local branch
git branch -D feature/abandoned-feature

# Delete remote branch
git push origin --delete feature/abandoned-feature
```

### Scenario 2: Multiple Features in Progress
```bash
# List all branches
git branch -a

# Switch between features
git checkout feature/feature-1
git checkout feature/feature-2
```

### Scenario 3: Hotfix on Production
```bash
# Create hotfix branch from main
git checkout main
git checkout -b bugfix/critical-issue

# Fix the issue
# ... make changes ...

# Commit and merge immediately
git add .
git commit -m "Fix critical authentication bug"
git checkout main
git merge bugfix/critical-issue
git push origin main

# Cleanup
git branch -d bugfix/critical-issue
```

## Visual Workflow

```
main ─────●─────●─────●─────●────── (production)
           \           /
            \         /
             ●───●───●  feature/new-feature
```

## Checklist Template

Before merging any feature:

- [ ] Code builds successfully
- [ ] All new features tested manually
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Database migrations tested
- [ ] Responsive on mobile/tablet/desktop
- [ ] Performance is acceptable
- [ ] No sensitive data in commits
- [ ] Environment variables documented

## Tools

### View Branch Graph
```bash
git log --graph --oneline --all
```

### See What Changed
```bash
git diff main feature/your-feature
```

### Check Current Branch
```bash
git branch
```

---

**Remember**: The main branch should always be deployable. When in doubt, use a feature branch!
