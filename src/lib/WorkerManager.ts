import { WorkerMessage, WorkerMessageType } from "../types/worker";

type PendingRequest = {
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  timeout: ReturnType<typeof setTimeout>;
  cancelled: boolean;
  type: WorkerMessageType;
};

export class WorkerManager {
  private worker: Worker | null;
  private pending: Map<string, PendingRequest>;
  private messageCounter: number;

  constructor(workerPath: string) {
    this.worker = new Worker(workerPath);
    this.pending = new Map();
    this.messageCounter = 0;

    this.worker.onmessage = this.handleMessage.bind(this);
    this.worker.onerror = this.handleError.bind(this);
  }

  sendMessage<T>(type: WorkerMessageType, payload?: any): Promise<T> {
    if (!this.worker) {
      return Promise.reject(new Error("Worker not initialized"));
    }

    const id = `worker-${Date.now()}-${++this.messageCounter}`;
    const message: WorkerMessage = {
      id,
      type,
      payload,
    };

    console.log("Sending Message to worker", message.type, message.id);

    return new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Worker timeout after 30s for message ${type}`));
      }, 30000);

      this.pending.set(id, {
        resolve,
        reject,
        timeout,
        cancelled: false,
        type,
      });

      this.worker!.postMessage(message);
    });
  }

  cancelRequest(id: string) {
    const pending = this.pending.get(id);

    if (pending) {
      console.log("Cancelling Request:", id);
      pending.cancelled = true;
      clearTimeout(pending.timeout);
      this.pending.delete(id);
      pending.reject(new Error("Request Cancelled"));
    }
  }

  cancelRequestsByType(type: WorkerMessageType) {
    console.log("Cancelling all request of type:", type);

    const ids = Array.from(this.pending.entries())
      .filter(([key, val]) => val.type === type)
      .map(([key, val]) => key);
    ids.forEach((id) => {
      const pending = this.pending.get(id);
      if (pending) {
        pending.cancelled = true;
        clearTimeout(pending.timeout);
        this.pending.delete(id);
        pending.reject(new Error("Request Cancelled"));
      }
    });
  }

  private handleMessage(event: MessageEvent<WorkerMessage>) {
    const { id, type, result } = event.data;

    console.log("Received from Worker", type, id);

    const pending = this.pending.get(id);

    if (!pending) {
      console.warn("Received message for unknown request", id);
      return;
    }

    clearTimeout(pending.timeout);

    this.pending.delete(id);

    if (type === "ERROR") {
      pending.reject(new Error(result.message));
    } else {
      pending.resolve(result);
    }
  }

  private handleError(error: ErrorEvent) {
    console.error("Worker Error:", error);

    this.pending.forEach(({ reject, timeout }) => {
      clearTimeout(timeout);
      reject(new Error("Worker Crashed"));
    });

    this.pending.clear();
  }

  terminate() {
    if (this.worker) {
      console.log("Terminating Worker");

      this.pending.forEach(({ reject, timeout }) => {
        clearTimeout(timeout);
        reject(new Error("Worker Terminated"));
      });

      this.pending.clear();
      this.worker.terminate();
      this.worker = null;
    }
  }

  getPendingCount() {
    return this.pending.size;
  }
}
