# 💰 Personal Finance Visualizer

A modern, responsive web application for personal finance management with beautiful visualizations and intuitive budgeting tools.

![Finance Visualizer](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb)

## 🖇️ Live link - https://personal-finance-visualizer-two-navy.vercel.app/

## ✨ Features

### 📊 **Dashboard Overview**
- Real-time financial summary with total expenses and income
- Dynamic budget status cards with color-coded indicators
- Monthly expense trends with interactive charts
- Responsive design that adapts to all screen sizes

### 💳 **Transaction Management**
- Add, edit, and delete transactions with ease
- Categorize transactions (Food, Travel, Shopping, etc.)
- Advanced filtering by category, date range, and search terms
- Bulk transaction operations

### 📈 **Budget Tracking**
- Set monthly budgets for different categories
- Visual budget vs. spent comparisons
- Interactive double-bar charts and pie charts
- Real-time budget status monitoring

### 🎨 **Beautiful Visualizations**
- Monthly expense breakdown charts
- Category-wise spending distribution
- Budget performance analytics
- Responsive charts that work on all devices

### 🔧 **Technical Features**
- Modern Next.js 15 with App Router
- TypeScript for type safety
- MongoDB integration with Mongoose
- Responsive design with Tailwind CSS
- Dark mode support
- Real-time data updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/finance-visualizer.git
   cd finance-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
finance-visualizer/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── transaction/   # Transaction CRUD operations
│   │   │   ├── budget/        # Budget management
│   │   │   └── insights/      # Analytics and insights
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main page
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── dashboard.tsx     # Dashboard component
│   │   ├── transactions.tsx  # Transactions page
│   │   ├── budgets.tsx       # Budgets page
│   │   └── sheets/           # Modal sheets
│   ├── contexts/             # React contexts
│   ├── lib/                  # Utility functions
│   └── models/               # Database models
├── public/                   # Static assets
├── seed.ts                   # Database seeding
└── package.json
```

## 📱 Usage

### Dashboard
- View your financial overview at a glance
- Monitor budget status with color-coded indicators
- Analyze monthly spending trends
- Quick access to add new transactions

### Transactions
- Manage all your financial transactions
- Filter and search through transaction history
- Edit or delete existing transactions
- Categorize transactions for better organization

### Budgets
- Set monthly budgets for different categories
- Visualize budget vs. actual spending
- Track budget performance over time
- Get insights into spending patterns

## 🛠️ API Endpoints

### Transactions
- `GET /api/transaction` - Get all transactions
- `POST /api/transaction` - Create new transaction
- `PATCH /api/transaction/[id]` - Update transaction
- `DELETE /api/transaction/[id]` - Delete transaction

### Budgets
- `GET /api/budget` - Get all budgets
- `POST /api/budget` - Create new budget
- `PATCH /api/budget/[id]` - Update budget
- `DELETE /api/budget/[id]` - Delete budget

### Insights
- `GET /api/insights/budget-status` - Budget performance
- `GET /api/insights/monthly-summary` - Monthly overview
- `GET /api/insights/yearly-breakdown` - Yearly spending data
- `GET /api/insights/spending-trend` - Spending trends
- `GET /api/insights/category-breakdown` - Category analysis

## 🎨 Customization

### Styling
The app uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Component styles in individual component files
- Global styles in `src/app/globals.css`

### Data Models
Database models are defined in `src/models/`:
- `transaction.ts` - Transaction schema
- `budget.ts` - Budget schema

### Components
All components are modular and reusable:
- UI components in `src/components/ui/`
- Page components in `src/components/`
- Context providers in `src/contexts/`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Database Seeding
```bash
npm run seed         # Seed database with sample data
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Recharts](https://recharts.org/) - Chart library
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

**Made with ❤️ for better financial management**
