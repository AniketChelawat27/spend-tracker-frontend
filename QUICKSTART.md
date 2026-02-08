# 🚀 QUICK START GUIDE

## One-Command Start (Easiest)

```bash
cd spend-tracker
./start.sh
```

This will automatically:
- Install all dependencies
- Start both backend and frontend servers
- Open the app in your browser

## Manual Start

### Step 1: Install Dependencies

```bash
# In root directory
cd spend-tracker
npm install

# In client directory
cd client
npm install
cd ..
```

### Step 2: Start the App

**Option A: Run both servers together (recommended)**
```bash
npm run dev
```

**Option B: Run servers separately**

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

## Accessing the App

Once started, open your browser and go to:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## What's Included

✅ Pre-loaded with 2 months of sample data
✅ Salaries for Me and Father
✅ Various expenses across categories
✅ Multiple investment types
✅ Other activities (income, gifts, loans)

## Features to Explore

1. **Dashboard**: View financial overview with charts
2. **Salary Section**: Add/manage monthly salaries
3. **Expenses**: Track spending by category
4. **Investments**: Monitor your investment portfolio
5. **Activities**: Log gifts, loans, and other income
6. **Dark Mode**: Toggle with moon/sun icon in header
7. **Month Navigation**: Switch between months in header

## Tips

- Use the month selector to navigate between different months
- All data is saved automatically in SQLite database
- Delete entries with the trash icon
- Charts update in real-time as you add data

## Troubleshooting

**Port already in use?**
- Kill processes on ports 3001 and 5173
- Or modify ports in:
  - Backend: `server/index.js` (PORT variable)
  - Frontend: `client/vite.config.ts` (server.port)

**Database issues?**
- Delete `finance.db` file and restart
- App will recreate with fresh sample data

---

**Enjoy tracking your finances! 💰📊**
