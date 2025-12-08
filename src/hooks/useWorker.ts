import React, { useCallback, useEffect, useRef } from "react";
import { WorkerManager } from "../lib/WorkerManager";
import { WorkerMessageType } from "../types/worker";

const useWorker = (workerPath: string) => {
  const managerRef = useRef<WorkerManager | null>(null);

  useEffect(() => {
    managerRef.current = new WorkerManager(workerPath);

    return () => {
      if (managerRef.current) {
        managerRef.current.terminate();
        managerRef.current = null;
      }
    };
  }, [workerPath]);

  const sendMessage = useCallback(
    <T>(type: WorkerMessageType, payload?: any): Promise<T> => {
      if (!managerRef.current) {
        return Promise.reject(new Error("Worker not initialized"));
      }

      return managerRef.current.sendMessage<T>(type, payload);
    },
    []
  );

  const cancelPending = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.cancelRequestsByType("PARSE_MARKDOWN");
    }
  }, []);

  const getPendingCount = useCallback(() => {
    return managerRef.current?.getPendingCount() || 0;
  }, []);

  return { sendMessage, cancelPending, getPendingCount };
};

export default useWorker;
