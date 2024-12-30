'use client';

import { useEffect, useRef } from 'react';

interface UseJsonWorkerProps {
  onSuccess: (formatted: string) => void;
  onError: (error: string) => void;
}

export function useJsonWorker({ onSuccess, onError }: UseJsonWorkerProps) {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create worker
    workerRef.current = new Worker(new URL('../lib/workers/json.worker.ts', import.meta.url));

    // Set up message handler
    workerRef.current.onmessage = event => {
      const { type, payload } = event.data;
      if (type === 'success' && payload.formatted) {
        onSuccess(payload.formatted);
      } else if (type === 'error' && payload.error) {
        onError(payload.error);
      }
    };

    // Clean up
    return () => {
      workerRef.current?.terminate();
    };
  }, [onSuccess, onError]);

  const formatJson = (json: string, indentSize: number) => {
    if (!workerRef.current) return;

    workerRef.current.postMessage({
      type: 'format',
      payload: {
        json,
        indentSize,
      },
    });
  };

  return { formatJson };
}
