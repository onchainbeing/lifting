// 单组训练记录
export interface SetRecord {
  id: string;
  weight: number; // 重量（kg）
  reps: number; // 次数
  rpe: number; // RPE 1-10
}

// 单个动作的训练记录
export interface ExerciseRecord {
  id: string;
  exerciseName: string; // 训练动作名称
  sets: SetRecord[]; // 各组详情
}

// 一次训练日记
export interface WorkoutEntry {
  id: string;
  date: string; // ISO 日期字符串
  exercises: ExerciseRecord[];
  photos: string[]; // Base64 编码的图片
  notes?: string; // 可选备注
}

// 保存的动作列表
export interface SavedExercises {
  exercises: string[];
}
