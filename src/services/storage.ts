import type { WorkoutEntry, SavedExercises } from '../types';

const WORKOUTS_KEY = 'lifting_workouts';
const EXERCISES_KEY = 'lifting_exercises';

// 获取所有训练记录
export function getWorkouts(): WorkoutEntry[] {
  const data = localStorage.getItem(WORKOUTS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 保存训练记录
export function saveWorkout(workout: WorkoutEntry): void {
  const workouts = getWorkouts();
  const existingIndex = workouts.findIndex((w) => w.id === workout.id);
  if (existingIndex >= 0) {
    workouts[existingIndex] = workout;
  } else {
    workouts.unshift(workout); // 新记录放在最前面
  }
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
}

// 删除训练记录
export function deleteWorkout(id: string): void {
  const workouts = getWorkouts().filter((w) => w.id !== id);
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
}

// 获取保存的动作列表
export function getSavedExercises(): string[] {
  const data = localStorage.getItem(EXERCISES_KEY);
  if (!data) return [];
  try {
    const saved: SavedExercises = JSON.parse(data);
    return saved.exercises;
  } catch {
    return [];
  }
}

// 添加新动作到列表
export function addExercise(exerciseName: string): void {
  const exercises = getSavedExercises();
  if (!exercises.includes(exerciseName)) {
    exercises.push(exerciseName);
    exercises.sort((a, b) => a.localeCompare(b, 'zh-CN'));
    localStorage.setItem(EXERCISES_KEY, JSON.stringify({ exercises }));
  }
}

// 删除动作
export function removeExercise(exerciseName: string): void {
  const exercises = getSavedExercises().filter((e) => e !== exerciseName);
  localStorage.setItem(EXERCISES_KEY, JSON.stringify({ exercises }));
}

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
