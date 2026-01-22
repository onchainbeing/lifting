import type { WorkoutEntry } from '../types';
import { getBarkUrl } from './storage';

// 发送 Bark 通知
export async function sendBarkNotification(title: string, body: string): Promise<boolean> {
  const barkUrl = getBarkUrl();
  if (!barkUrl) {
    return false;
  }

  try {
    // 确保 URL 以 / 结尾
    const baseUrl = barkUrl.endsWith('/') ? barkUrl : barkUrl + '/';
    const url = `${baseUrl}${encodeURIComponent(title)}/${encodeURIComponent(body)}`;

    // 使用 no-cors 模式绕过 CORS 限制
    // 注意：无法获取响应状态，但请求会发出
    await fetch(url, { mode: 'no-cors' });

    // 由于 no-cors 无法判断是否成功，假定请求已发出
    return true;
  } catch (error) {
    console.error('Bark notification failed:', error);
    return false;
  }
}

// 格式化训练记录并推送通知
export async function notifyWorkoutSaved(workout: WorkoutEntry): Promise<boolean> {
  if (workout.exercises.length === 0) {
    return false;
  }

  const title = '训练完成！';
  const body = workout.exercises
    .map((ex) => `${ex.exerciseName} ${ex.sets.length}组`)
    .join(' | ');

  return sendBarkNotification(title, body);
}
