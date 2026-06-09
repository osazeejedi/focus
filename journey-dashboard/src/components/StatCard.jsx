import './StatCard.css';

export default function StatCard({ label, value, subtitle, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-label">{label}</div>
        {Icon && <Icon size={18} className="stat-icon" />}
      </div>
      <div className="stat-val">{value}</div>
      {subtitle && <div className="stat-sub">{subtitle}</div>}
    </div>
  );
}
