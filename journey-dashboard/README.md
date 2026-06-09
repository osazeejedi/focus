# Journey Dashboard 🎯

A comprehensive dashboard to track your daily regimen, build consistency, and monitor your personal growth journey.

![Journey Dashboard](https://img.shields.io/badge/React-18-blue) ![Supabase](https://img.shields.io/badge/Supabase-Enabled-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## Features ✨

### Core Functionality
- **Daily Time Blocks**: Organize your day into focused time blocks with customizable tasks
- **Task Tracking**: Check off tasks as you complete them throughout the day
- **Progress Monitoring**: Real-time progress bars and completion percentages
- **Streak Tracking**: Build and maintain your consistency streak
- **Week & Month Stats**: Comprehensive statistics on your performance

### Journal & Reflection
- **Alignment Journal**: Daily reflection prompts to keep you focused on your mission
  - What am I becoming?
  - What is my assignment today?
  - What weakness must I kill today?
  - Tangible output produced today

### Data & Customization
- **Editable Time Blocks**: Customize your schedule to fit your routine
- **Cloud Sync**: All data synced with Supabase in real-time
- **Dark/Light Theme**: Switch between themes with preference persistence
- **Data Export/Import**: Backup and restore your data (coming soon)

### User Experience
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Smooth Animations**: Polished UI with thoughtful transitions
- **Keyboard Shortcuts**: Power user features (coming soon)
- **PWA Support**: Install as a standalone app (coming soon)

## Tech Stack 🛠️

- **Frontend**: React 18 with Vite
- **Styling**: Custom CSS with CSS Variables for theming
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Routing**: React Router v6
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Charts**: Chart.js + react-chartjs-2 (for analytics)

## Getting Started 🚀

### Prerequisites
- Node.js 18+ installed
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd journey-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The database schema is automatically created via Supabase migrations. The following tables are created:
   - `profiles` - User profiles
   - `time_blocks` - Customizable time blocks
   - `block_tasks` - Tasks within each time block
   - `daily_entries` - Daily journal entries
   - `task_completions` - Task completion tracking

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Project Structure 📁

```
journey-dashboard/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Layout.jsx
│   │   ├── StatCard.jsx
│   │   ├── TimeBlockCard.jsx
│   │   ├── WeekView.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/         # React contexts
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/           # Custom React hooks
│   │   └── useDashboard.js
│   ├── lib/             # Utilities and libraries
│   │   └── supabase.js
│   ├── pages/           # Page components
│   │   ├── Auth.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Analytics.jsx
│   │   ├── History.jsx
│   │   └── Settings.jsx
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables (not committed)
├── .env.example         # Environment variables template
├── package.json
└── README.md
```

## Usage 📖

### First Time Setup

1. **Sign Up/Sign In**
   - Create an account or sign in with your credentials
   - Your profile will be automatically created

2. **Dashboard Initialization**
   - On first load, default time blocks will be created automatically
   - These can be customized later in Settings

3. **Daily Workflow**
   - Check off tasks as you complete them
   - Fill in your daily journal prompts
   - Track your progress throughout the day
   - Review your stats and streaks

### Customizing Your Schedule

(Feature coming soon in Settings page)
- Edit time block names and times
- Add/remove tasks from time blocks
- Reorder blocks to match your routine

### Data Management

- **Auto-save**: All changes are automatically saved to the cloud
- **Theme Persistence**: Your theme preference is saved to your profile
- **Export/Import**: Backup and restore functionality (coming soon)

## Database Schema 📊

### Tables

**profiles**
- User profile information
- Theme preferences

**time_blocks**
- User-specific time blocks
- Position, color, times

**block_tasks**
- Tasks within each time block
- Customizable per user

**daily_entries**
- One entry per day per user
- Journal responses
- Notes

**task_completions**
- Links tasks to daily entries
- Completion status and timestamps

### Row Level Security (RLS)

All tables have RLS policies to ensure:
- Users can only view their own data
- Users can only modify their own data
- Complete data isolation between users

## Roadmap 🗺️

### Phase 1 (Current)
- [x] Core dashboard functionality
- [x] Task tracking
- [x] Stats and streaks
- [x] Journal prompts
- [x] Authentication
- [x] Cloud sync
- [x] Theme toggle

### Phase 2 (Coming Soon)
- [ ] Analytics dashboard with charts
- [ ] History/calendar view
- [ ] Editable time blocks UI
- [ ] Data export/import
- [ ] Keyboard shortcuts
- [ ] Mobile app navigation
- [ ] PWA support

### Phase 3 (Future)
- [ ] Goal tracking
- [ ] Habit tracking
- [ ] Weekly/monthly reviews
- [ ] Custom metrics
- [ ] Integrations
- [ ] Collaboration features

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License.

## Acknowledgments 🙏

Built with inspiration from:
- Deep Work by Cal Newport
- Atomic Habits by James Clear
- The concept of "No Zero Days"

---

**"Attention so controlled, execution becomes inevitable."**
