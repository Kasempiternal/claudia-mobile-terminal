# GitHub Setup Instructions

Since the GitHub CLI is not available, please follow these steps to create the repository and push the code:

## 1. Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `claudia-mobile-terminal`
3. Description: "Mobile web interface for terminal access via VSCode - Built with React, TypeScript, and xterm.js"
4. Set to **Public**
5. Do NOT initialize with README, .gitignore, or license
6. Click "Create repository"

## 2. Push Code to GitHub

After creating the repository, run these commands in the terminal:

```bash
cd /mnt/c/Users/izotz/Desktop/CClaudia/claudia-mobile-terminal
git remote add origin https://github.com/Kasempiternal/claudia-mobile-terminal.git
git branch -M main
git push -u origin main
```

## 3. Vercel Deployment

After pushing to GitHub:

1. Go to https://vercel.com
2. Click "New Project"
3. Import the `claudia-mobile-terminal` repository
4. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `bun run build` (or `npm run build`)
   - Output Directory: `dist`
   - Install Command: `bun install` (or `npm install`)
5. Click "Deploy"

## Repository URL

Once created, your repository will be available at:
https://github.com/Kasempiternal/claudia-mobile-terminal