import { BarChart3 } from 'lucide-react';
import './Analytics.css';

export default function Analytics() {
  return (
    <div className="container analytics-page">
      <div className="page-header">
        <BarChart3 size={28} />
        <h1>Analytics</h1>
      </div>

      <div className="coming-soon">
        <BarChart3 size={64} className="coming-soon-icon" />
        <h2>Analytics Dashboard Coming Soon</h2>
        <p>
          Visualize your progress with charts and insights:
        </p>
        <ul className="feature-list">
          <li>Weekly and monthly completion trends</li>
          <li>Task completion heatmaps</li>
          <li>Streak visualization</li>
          <li>Time block performance analysis</li>
          <li>Goal tracking and milestones</li>
        </ul>
      </div>
    </div>
  );
}
