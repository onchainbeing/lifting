import { useState } from 'react';
import type { WorkoutEntry, ExerciseRecord, SetRecord } from '../types';
import { generateId, saveWorkout } from '../services/storage';
import { notifyWorkoutSaved } from '../services/notification';
import ExerciseSelector from './ExerciseSelector';
import SetForm from './SetForm';
import PhotoUploader from './PhotoUploader';
import './WorkoutForm.css';

interface Props {
  onSaved: () => void;
}

export default function WorkoutForm({ onSaved }: Props) {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [exercises, setExercises] = useState<ExerciseRecord[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  const handleAddExercise = (exerciseName: string) => {
    const newExercise: ExerciseRecord = {
      id: generateId(),
      exerciseName,
      sets: [createEmptySet()],
    };
    setExercises([...exercises, newExercise]);
    setShowExerciseSelector(false);
  };

  const createEmptySet = (): SetRecord => ({
    id: generateId(),
    weight: 0,
    reps: 0,
    rpe: 7,
  });

  const handleAddSet = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: [...ex.sets, createEmptySet()] }
          : ex
      )
    );
  };

  const handleCopyLastSet = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id !== exerciseId || ex.sets.length === 0) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const copiedSet: SetRecord = {
          id: generateId(),
          weight: lastSet.weight,
          reps: lastSet.reps,
          rpe: lastSet.rpe,
        };
        return { ...ex, sets: [...ex.sets, copiedSet] };
      })
    );
  };

  const handleUpdateSet = (exerciseId: string, setId: string, updated: SetRecord) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((s) => (s.id === setId ? updated : s)),
            }
          : ex
      )
    );
  };

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.filter((s) => s.id !== setId) }
          : ex
      )
    );
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  const handleSave = () => {
    if (exercises.length === 0) {
      alert('请至少添加一个训练动作');
      return;
    }

    const workout: WorkoutEntry = {
      id: generateId(),
      date,
      exercises,
      photos,
    };

    saveWorkout(workout);

    // 发送 Bark 推送通知（异步，不阻塞）
    notifyWorkoutSaved(workout);

    // 重置表单
    setExercises([]);
    setPhotos([]);
    setDate(new Date().toISOString().split('T')[0]);

    onSaved();
  };

  return (
    <div className="workout-form">
      <div className="form-header">
        <h2>记录训练</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-input"
        />
      </div>

      <div className="exercises-list">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="exercise-card">
            <div className="exercise-header">
              <h3>{exercise.exerciseName}</h3>
              <button
                className="btn-delete-exercise"
                onClick={() => handleDeleteExercise(exercise.id)}
                title="删除此动作"
              >
                删除
              </button>
            </div>

            <div className="sets-list">
              {exercise.sets.map((set, index) => (
                <SetForm
                  key={set.id}
                  setNumber={index + 1}
                  setRecord={set}
                  onChange={(updated) => handleUpdateSet(exercise.id, set.id, updated)}
                  onDelete={() => handleDeleteSet(exercise.id, set.id)}
                />
              ))}
            </div>

            <div className="set-actions">
              <button
                className="btn-add-set"
                onClick={() => handleAddSet(exercise.id)}
              >
                + 添加一组
              </button>
              <button
                className="btn-copy-set"
                onClick={() => handleCopyLastSet(exercise.id)}
                disabled={exercise.sets.length === 0}
              >
                复制上一组
              </button>
            </div>
          </div>
        ))}
      </div>

      {showExerciseSelector ? (
        <ExerciseSelector onSelect={handleAddExercise} />
      ) : (
        <button
          className="btn-add-exercise"
          onClick={() => setShowExerciseSelector(true)}
        >
          + 添加训练动作
        </button>
      )}

      <PhotoUploader photos={photos} onPhotosChange={setPhotos} />

      <button className="btn-save" onClick={handleSave}>
        保存训练记录
      </button>
    </div>
  );
}
