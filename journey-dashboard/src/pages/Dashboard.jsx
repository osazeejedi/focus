import { useState } from 'react';
import { format } from 'date-fns';
import { useDashboard } from '../hooks/useDashboard';
import StatCard from '../components/StatCard';
import TimeBlockCard from '../components/TimeBlockCard';
import WeekView from '../components/WeekView';
import { 
  Flame, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Target,
  Save,
  BookOpen,
  Loader
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const [currentDate] = useState(new Date());
  const {
    loading,
    timeBlocks,
    blockTasks,
    dailyEntry,
    completions,
    stats,
    toggleTask,
    updateJournal
  } = useDashboard(currentDate);

  const allTasks = Object.values(blockTasks).flat();
  const completedCount = allTasks.filter(task => completions[task.id]).length;

  if (loading) {
    return (
      <div className="container">
        <div className="loading-screen">
          <Loader className="loading-spinner" size={48} />
          <p>Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container dashboard">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">
            {format(currentDate, 'EEEE')}
          </h1>
          <p className="dash-date">{format(currentDate, 'MMMM d, yyyy')}</p>
        </div>
        <button className="btn btn-primary">
          <Save size={16} />
          Saved
        </button>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <StatCard
          label="Streak"
          value={stats.streak}
          subtitle="consecutive days"
          icon={Flame}
        />
        <StatCard
          label="Week score"
          value={`${stats.weekScore}%`}
          subtitle="tasks completed"
          icon={TrendingUp}
        />
        <StatCard
          label="Month total"
          value={stats.monthTotal}
          subtitle="full days done"
          icon={CalendarIcon}
        />
        <StatCard
          label="Today"
          value={`${stats.todayProgress}%`}
          subtitle="of tasks done"
          icon={Target}
        />
      </div>

      {/* Week View */}
      <div className="section-spacer">
        <div className="section-header">
          <CalendarIcon size={18} />
          <h2>This Week</h2>
        </div>
        <WeekView currentDate={currentDate} weekData={{}} />
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-label">
          <span>Today's progress</span>
          <span>{completedCount} / {allTasks.length} tasks</span>
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${stats.todayProgress}%` }}
          />
        </div>
      </div>

      {/* No Zero Days Banner */}
      {completedCount === 0 && (
        <div className="no-zero-banner">
          <Flame size={18} />
          <span>No zero days. Even on a hard day — walk, read, write something small.</span>
        </div>
      )}

      {/* Time Blocks Grid */}
      <div className="blocks-grid">
        {timeBlocks.map(block => (
          <TimeBlockCard
            key={block.id}
            block={block}
            tasks={blockTasks[block.id] || []}
            completions={completions}
            onToggleTask={toggleTask}
            onEditBlock={() => {}}
            onDeleteBlock={() => {}}
            isEditable={false}
          />
        ))}
      </div>

      {/* Journal Section */}
      <div className="journal-section">
        <div className="section-header">
          <BookOpen size={18} />
          <h2>Alignment Journal</h2>
        </div>
        
        <div className="journal-questions">
          <div className="journal-q">
            <label className="journal-label">What am I becoming?</label>
            <textarea
              className="textarea"
              rows={2}
              placeholder="Write freely..."
              value={dailyEntry?.journal_q1 || ''}
              onChange={(e) => updateJournal('journal_q1', e.target.value)}
            />
          </div>

          <div className="journal-q">
            <label className="journal-label">What is my assignment today?</label>
            <textarea
              className="textarea"
              rows={2}
              placeholder="Write freely..."
              value={dailyEntry?.journal_q2 || ''}
              onChange={(e) => updateJournal('journal_q2', e.target.value)}
            />
          </div>

          <div className="journal-q">
            <label className="journal-label">What weakness must I kill today?</label>
            <textarea
              className="textarea"
              rows={2}
              placeholder="Write freely..."
              value={dailyEntry?.journal_q3 || ''}
              onChange={(e) => updateJournal('journal_q3', e.target.value)}
            />
          </div>

          <div className="journal-q">
            <label className="journal-label">Tangible output produced today</label>
            <textarea
              className="textarea"
              rows={2}
              placeholder="e.g. 200 lines of code, 1 page of writing..."
              value={dailyEntry?.journal_q4 || ''}
              onChange={(e) => updateJournal('journal_q4', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="mission-bar">
        <Target size={18} className="mission-icon" />
        <p>Attention so controlled, execution becomes inevitable.</p>
      </div>
    </div>
  );
}
