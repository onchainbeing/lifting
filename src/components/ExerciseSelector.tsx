import { useState } from 'react';
import { getSavedExercises, addExercise } from '../services/storage';
import './ExerciseSelector.css';

interface Props {
  onSelect: (exerciseName: string) => void;
}

export default function ExerciseSelector({ onSelect }: Props) {
  const [savedExercises, setSavedExercises] = useState<string[]>(getSavedExercises());
  const [newExercise, setNewExercise] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAddExercise = () => {
    const trimmed = newExercise.trim();
    if (trimmed) {
      addExercise(trimmed);
      setSavedExercises(getSavedExercises());
      onSelect(trimmed);
      setNewExercise('');
      setShowInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddExercise();
    }
  };

  return (
    <div className="exercise-selector">
      <h3>选择训练动作</h3>

      {savedExercises.length > 0 && (
        <div className="exercise-list">
          {savedExercises.map((exercise) => (
            <button
              key={exercise}
              className="exercise-btn"
              onClick={() => onSelect(exercise)}
            >
              {exercise}
            </button>
          ))}
        </div>
      )}

      {showInput ? (
        <div className="new-exercise-input">
          <input
            type="text"
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入新动作名称"
            autoFocus
          />
          <button className="btn-primary" onClick={handleAddExercise}>
            添加
          </button>
          <button className="btn-secondary" onClick={() => setShowInput(false)}>
            取消
          </button>
        </div>
      ) : (
        <button className="btn-add-new" onClick={() => setShowInput(true)}>
          + 添加新动作
        </button>
      )}
    </div>
  );
}
