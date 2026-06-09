import { useState } from 'react';
import { Check, Edit2, Trash2, Plus, GripVertical } from 'lucide-react';
import './TimeBlockCard.css';

export default function TimeBlockCard({ 
  block, 
  tasks = [], 
  completions = {}, 
  onToggleTask, 
  onEditBlock,
  onDeleteBlock,
  isEditable = true 
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="block-card">
      <div className="block-head">
        <div className="block-dot" style={{ background: block.color }}></div>
        <span className="block-name">{block.name}</span>
        <span className="block-time">{block.start_time} – {block.end_time}</span>
        {isEditable && (
          <div className="block-actions">
            <button 
              className="icon-btn" 
              onClick={() => onEditBlock(block)}
              title="Edit block"
            >
              <Edit2 size={14} />
            </button>
            <button 
              className="icon-btn" 
              onClick={() => onDeleteBlock(block.id)}
              title="Delete block"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
      
      <ul className="checklist">
        {tasks.map((task) => {
          const isCompleted = completions[task.id] || false;
          return (
            <li 
              key={task.id} 
              className={`check-item ${isCompleted ? 'done' : ''}`}
              onClick={() => onToggleTask(task.id, !isCompleted)}
            >
              <div className="checkbox">
                {isCompleted && <Check size={12} strokeWidth={3} />}
              </div>
              <label>{task.task_text}</label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
