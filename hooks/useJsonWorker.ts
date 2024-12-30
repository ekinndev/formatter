import { useCallback } from 'react';

interface UseJsonWorkerProps {
  onSuccess: (formatted: string) => void;
  onError: (error: string) => void;
}

export const useJsonWorker = ({ onSuccess, onError }: UseJsonWorkerProps) => {
  const formatJson = useCallback(
    (json: string, indentSize: number) => {
      try {
        // Create a blob containing the worker code
        const workerCode = `
          self.onmessage = function(e) {
            try {
              const { json, indentSize } = e.data;
              const parsed = JSON.parse(json);
              const formatted = JSON.stringify(parsed, null, indentSize);
              self.postMessage({ success: true, data: formatted });
            } catch (error) {
              self.postMessage({ success: false, error: error.message });
            }
          };
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        const worker = new Worker(workerUrl);

        worker.onmessage = function (e) {
          if (e.data.success) {
            onSuccess(e.data.data);
          } else {
            onError(e.data.error);
          }
          worker.terminate();
          URL.revokeObjectURL(workerUrl);
        };

        worker.onerror = function (error) {
          onError(error.message);
          worker.terminate();
          URL.revokeObjectURL(workerUrl);
        };

        worker.postMessage({ json, indentSize });
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Unknown error occurred');
      }
    },
    [onSuccess, onError]
  );

  return { formatJson };
};
