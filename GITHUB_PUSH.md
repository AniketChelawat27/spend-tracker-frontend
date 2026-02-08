# Push this repo to GitHub

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Name it e.g. `spend-tracker-frontend`
   - Do **not** add a README, .gitignore, or license (this repo already has them)
   - Create the repository

2. **Add remote and push**
   ```bash
   cd /Users/apple/Desktop/Aniket/spend-tracker-frontend
   git remote add origin https://github.com/YOUR_USERNAME/spend-tracker-frontend.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username (or use the repo URL GitHub shows after creating it).

If you use SSH:
   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/spend-tracker-frontend.git
   git push -u origin main
   ```
