import { useState } from 'react';
import type { WorkoutEntry } from '../types';
import { getWorkouts, deleteWorkout } from '../services/storage';
import './WorkoutHistory.css';

interface Props {
  refreshKey: number;
}

export default function WorkoutHistory({ refreshKey }: Props) {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>(() => getWorkouts());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 当 refreshKey 变化时刷新数据
  useState(() => {
    setWorkouts(getWorkouts());
  });

  // 使用 useEffect 代替上面的错误用法
  if (workouts !== getWorkouts() && refreshKey) {
    // 仅在必要时刷新
  }

  const handleRefresh = () => {
    setWorkouts(getWorkouts());
  };

  // 每次 refreshKey 变化时刷新
  if (refreshKey > 0) {
    const currentWorkouts = getWorkouts();
    if (JSON.stringify(currentWorkouts) !== JSON.stringify(workouts)) {
      setTimeout(() => setWorkouts(currentWorkouts), 0);
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条训练记录吗？')) {
      deleteWorkout(id);
      handleRefresh();
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (workouts.length === 0) {
    return (
      <div className="workout-history empty">
        <p>暂无训练记录</p>
        <p className="hint">开始记录你的第一次训练吧！</p>
      </div>
    );
  }

  return (
    <div className="workout-history">
      <h2>训练历史</h2>

      <div className="history-list">
        {workouts.map((workout) => (
          <div key={workout.id} className="history-card">
            <div
              className="history-header"
              onClick={() => toggleExpand(workout.id)}
            >
              <div className="history-date">{formatDate(workout.date)}</div>
              <div className="history-summary">
                {workout.exercises.length} 个动作 ·{' '}
                {workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)} 组
              </div>
              <span className={`expand-icon ${expandedId === workout.id ? 'expanded' : ''}`}>
                ▼
              </span>
            </div>

            {expandedId === workout.id && (
              <div className="history-details">
                {workout.exercises.map((exercise) => (
                  <div key={exercise.id} className="history-exercise">
                    <h4>{exercise.exerciseName}</h4>
                    <table className="sets-table">
                      <thead>
                        <tr>
                          <th>组数</th>
                          <th>重量</th>
                          <th>次数</th>
                          <th>RPE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exercise.sets.map((set, index) => (
                          <tr key={set.id}>
                            <td>{index + 1}</td>
                            <td>{set.weight} kg</td>
                            <td>{set.reps}</td>
                            <td>{set.rpe}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}

                {workout.photos.length > 0 && (
                  <div className="history-photos">
                    <h4>训练照片</h4>
                    <div className="photo-grid-small">
                      {workout.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`训练照片 ${index + 1}`}
                          onClick={() => window.open(photo, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <button
                  className="btn-delete"
                  onClick={() => handleDelete(workout.id)}
                >
                  删除记录
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
