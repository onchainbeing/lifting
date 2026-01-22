import type { WorkoutEntry, SavedExercises } from '../types';

const WORKOUTS_KEY = 'lifting_workouts';
const EXERCISES_KEY = 'lifting_exercises';
const BARK_URL_KEY = 'lifting_bark_url';

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

// 导出训练记录为 JSON 字符串
export function exportWorkoutsAsJSON(): string {
  const workouts = getWorkouts();
  return JSON.stringify(workouts, null, 2);
}

// 导出训练记录为 CSV 字符串
export function exportWorkoutsAsCSV(): string {
  const workouts = getWorkouts();
  const rows: string[] = ['日期,动作,组数,重量(kg),次数,RPE'];

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      for (let i = 0; i < exercise.sets.length; i++) {
        const set = exercise.sets[i];
        rows.push(
          `${workout.date},${exercise.exerciseName},${i + 1},${set.weight},${set.reps},${set.rpe}`
        );
      }
    }
  }

  return rows.join('\n');
}

// 触发浏览器下载文件
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 导出并下载 JSON 文件
export function downloadWorkoutsAsJSON(): void {
  const content = exportWorkoutsAsJSON();
  const date = new Date().toISOString().split('T')[0];
  downloadFile(content, `lifting-backup-${date}.json`, 'application/json');
}

// 导出并下载 CSV 文件
export function downloadWorkoutsAsCSV(): void {
  const content = exportWorkoutsAsCSV();
  const date = new Date().toISOString().split('T')[0];
  downloadFile(content, `lifting-export-${date}.csv`, 'text/csv');
}

// 获取 Bark URL
export function getBarkUrl(): string {
  return localStorage.getItem(BARK_URL_KEY) || '';
}

// 设置 Bark URL
export function setBarkUrl(url: string): void {
  localStorage.setItem(BARK_URL_KEY, url);
}
