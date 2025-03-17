type FuncType = (...args: any[]) => void;
export default function withLock<T extends FuncType>(fn: T) {
    let isRunning = false;
    return async (...args: Parameters<T>) => {
      if (isRunning) return; // 如果正在运行，直接返回
      isRunning = true;
      try {
        await fn(...args); // 执行异步任务
      } finally {
        isRunning = false; // 任务完成后解锁
      };
    };
};