import { IFormattedJSON } from './types';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';

export const formatJSON = (json: string, indentSize: number = 2): IFormattedJSON => {
  try {
    // Parse and re-stringify to validate and format
    const parsed = JSON.parse(json);
    const rawJSON = JSON.stringify(parsed, null, indentSize);

    // Generate line numbers
    const lines = rawJSON.split('\n');
    const lineNumbers = lines.map((_, i) => `<span>${i + 1}</span>`).join('\n');

    // Highlight the JSON
    const highlighted = Prism.highlight(rawJSON, Prism.languages.json, 'json');

    return {
      formatted: highlighted,
      lineNumbers,
      rawJSON,
    };
  } catch (err) {
    return {
      formatted: json,
      error: err instanceof Error ? err.message : 'Invalid JSON',
    };
  }
};

export const isValidJSON = (json: string): boolean => {
  if (!json.trim()) return true;
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
};

export const downloadJSON = (json: string) => {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'formatted.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
