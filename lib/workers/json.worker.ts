type WorkerMessage = {
  type: 'format';
  payload: {
    json: string;
    indentSize: number;
  };
};

type WorkerResponse = {
  type: 'success' | 'error';
  payload: {
    formatted?: string;
    error?: string;
  };
};

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;

  if (type === 'format') {
    try {
      // Parse and format JSON
      const parsed = JSON.parse(payload.json);
      const formatted = JSON.stringify(parsed, null, payload.indentSize);

      // Send back the formatted JSON
      self.postMessage({
        type: 'success',
        payload: {
          formatted,
        },
      } as WorkerResponse);
    } catch (error) {
      // Send back the error
      self.postMessage({
        type: 'error',
        payload: {
          error: error instanceof Error ? error.message : 'Failed to format JSON',
        },
      } as WorkerResponse);
    }
  }
};

// Required for TypeScript to recognize this as a module
export {};