# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个力量训练日记应用（Lifting），使用 React 19 + TypeScript + Vite 构建。用户可以记录训练动作、组数、重量、次数、RPE，以及上传训练照片。数据存储在浏览器的 localStorage 中。

## 常用命令

```bash
npm run dev      # 启动开发服务器 (Vite HMR)
npm run build    # TypeScript 编译 + Vite 生产构建
npm run lint     # ESLint 检查
npm run preview  # 预览生产构建
```

## 架构

### 数据流
- **存储层**: `src/services/storage.ts` - 封装 localStorage 操作，管理训练记录和动作列表
- **类型定义**: `src/types/index.ts` - 定义 `WorkoutEntry`、`ExerciseRecord`、`SetRecord` 等核心类型

### 组件结构
- `App.tsx` - 主应用，包含两个 Tab：记录训练 / 训练历史
- `WorkoutForm` - 训练记录表单，管理动作和组数的添加
- `WorkoutHistory` - 历史记录列表，支持查看和删除
- `ExerciseSelector` - 动作选择器，支持自定义添加新动作
- `SetForm` - 单组数据表单（重量/次数/RPE）
- `PhotoUploader` - 照片上传，转换为 Base64 存储

### localStorage 键
- `lifting_workouts` - 训练记录数组
- `lifting_exercises` - 用户自定义的动作列表
