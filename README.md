# 💰 Spend Tracker - Personal Finance Management

A beautiful, smart, production-ready spend tracker web app for personal finance management designed for two people (Me & Father).

## ✨ Features

### 🎯 Core Functionality
- **Month-wise Tracking**: Navigate through different months and years
- **Salary Management**: Track monthly salaries for both individuals
- **Expense Tracker**: Categorized expense tracking with detailed breakdowns
- **Investment Portfolio**: Monitor investments across multiple asset classes
- **Other Activities**: Track gifts, loans, transfers, and additional income

### 📊 Smart Analytics
- Real-time financial dashboards
- Income vs Spending visualization
- Category-wise expense breakdown
- Investment type distribution
- Contribution analysis (Me vs Father)
- Automatic savings calculation
- Smart insights and recommendations

### 🎨 Premium UI/UX
- Modern, minimal design inspired by Notion + Cred + Splitwise
- Smooth animations and transitions
- Dark mode support 🌙
- Fully responsive (mobile, tablet, desktop)
- Card-based layout with hover effects
- Beautiful gradient backgrounds
- Clean empty states with illustrations

### 📈 Visualizations
- Interactive charts using Recharts
- Pie charts for category/investment distribution
- Bar charts for contribution analysis
- Income vs Spending comparison

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons
- Axios for API calls
- Context API for state management

**Backend:**
- Node.js + Express
- SQLite for database
- CORS enabled
- RESTful API

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or extract the project

2. Install backend dependencies:
```bash
cd spend-tracker
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

### Running the Application

**Development Mode (recommended):**

From the root directory, run both servers:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:5173`

The app will automatically open in your browser at `http://localhost:5173`

**Or run them separately:**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

## 📱 Usage Guide

### Month Selection
Use the dropdown in the header to select the month and year you want to view/edit.

### Adding Data

1. **Salary**: Click "Add Salary" → Select person → Enter amount and date
2. **Expenses**: Click "Add Expense" → Fill in title, amount, category, payer, and date
3. **Investments**: Click "Add Investment" → Select type, enter amount, owner, and optional return %
4. **Activities**: Click "Add Activity" → Choose type (Income/Gift/Loan/Transfer)

### Dashboard Insights
The dashboard automatically calculates:
- Total income (salary + other income)
- Total expenses
- Total investments
- Net savings
- Contribution breakdown
- Smart insights based on your financial behavior

## 🎨 Key Features Explained

### Auto-Calculate Savings
```
Savings = (Total Salary + Other Income) - (Total Expenses + Total Investments + Loans)
```

### Smart Insights
- Warns if spending exceeds income
- Celebrates when investments > expenses
- Highlights high investment percentages
- Provides actionable recommendations

### Data Persistence
- All data is stored in SQLite database
- Data persists between sessions
- Month-to-month navigation without data loss

## 🔒 Data Security
- All data is stored locally in SQLite database
- No external API calls (except local server)
- Privacy-first design

## 📦 Sample Data
The app comes pre-loaded with 2 months of realistic sample data including:
- Salaries for Me and Father
- Various expenses across categories
- Multiple investment types
- Other activities (freelance income, gifts, loans)

## 🎯 Future Enhancements
- Export data to Excel/CSV
- Budget planning and alerts
- Recurring transactions
- Multi-currency support
- Bill reminders
- Financial goal tracking
- Year-over-year comparison

## 🤝 Contributing
Feel free to fork this project and customize it for your needs!

## 📄 License
MIT License - feel free to use this for personal or commercial projects.

## 👨‍💻 Built With Love
Created as a production-ready finance tracker that's beautiful, functional, and easy to use.

---

**Happy Tracking! 📊💰**
