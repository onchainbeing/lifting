import type { SetRecord } from '../types';
import './SetForm.css';

interface Props {
  setNumber: number;
  setRecord: SetRecord;
  onChange: (updated: SetRecord) => void;
  onDelete: () => void;
}

const RPE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function SetForm({ setNumber, setRecord, onChange, onDelete }: Props) {
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onChange({ ...setRecord, weight: value });
  };

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onChange({ ...setRecord, reps: value });
  };

  const handleRpeChange = (rpe: number) => {
    onChange({ ...setRecord, rpe });
  };

  return (
    <div className="set-form">
      <div className="set-header">
        <span className="set-number">第 {setNumber} 组</span>
        <button className="btn-delete-set" onClick={onDelete} title="删除此组">
          ×
        </button>
      </div>

      <div className="set-fields">
        <div className="field">
          <label>重量 (kg)</label>
          <input
            type="number"
            value={setRecord.weight || ''}
            onChange={handleWeightChange}
            min="0"
            step="0.5"
            placeholder="0"
          />
        </div>

        <div className="field">
          <label>次数</label>
          <input
            type="number"
            value={setRecord.reps || ''}
            onChange={handleRepsChange}
            min="0"
            step="1"
            placeholder="0"
          />
        </div>

        <div className="field rpe-field">
          <label>RPE</label>
          <div className="rpe-selector">
            {RPE_OPTIONS.map((rpe) => (
              <button
                key={rpe}
                className={`rpe-btn ${setRecord.rpe === rpe ? 'active' : ''}`}
                onClick={() => handleRpeChange(rpe)}
              >
                {rpe}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
