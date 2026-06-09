import { Calendar } from 'lucide-react';
import './History.css';

export default function History() {
  return (
    <div className="container history-page">
      <div className="page-header">
        <Calendar size={28} />
        <h1>History</h1>
      </div>

      <div className="coming-soon">
        <Calendar size={64} className="coming-soon-icon" />
        <h2>History View Coming Soon</h2>
        <p>
          Browse and review your past entries:
        </p>
        <ul className="feature-list">
          <li>Calendar view of all entries</li>
          <li>Search and filter past days</li>
          <li>Review journal entries</li>
          <li>Compare performance across weeks</li>
          <li>View archived time blocks</li>
        </ul>
      </div>
    </div>
  );
}
