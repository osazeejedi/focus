import { format, startOfWeek, addDays, isSameDay, isAfter } from 'date-fns';
import { Check } from 'lucide-react';
import './WeekView.css';

export default function WeekView({ currentDate, weekData = {}, onDateClick }) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="week-view">
      <div className="week-days">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayData = weekData[dateKey] || {};
          const isToday = isSameDay(day, currentDate);
          const isFuture = isAfter(day, new Date());
          const isDone = dayData.completed >= 0.8; // 80% threshold
          
          return (
            <div 
              key={dateKey} 
              className="week-day"
              onClick={() => !isFuture && onDateClick && onDateClick(day)}
            >
              <div className="week-day-label">{format(day, 'EEE')}</div>
              <div 
                className={`week-dot ${isDone ? 'done' : ''} ${isToday ? 'today' : ''} ${isFuture ? 'future' : ''}`}
              >
                {isDone ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  format(day, 'd')
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
