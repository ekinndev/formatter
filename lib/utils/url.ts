import LZString from 'lz-string';

const MAX_URL_LENGTH = 2000; // Safe URL length for most browsers

interface URLState {
  json: string;
  indent?: number;
  wrap?: boolean;
  font?: string;
  size?: number;
}

export function compressState(state: URLState): string {
  const stateString = JSON.stringify(state);
  return LZString.compressToEncodedURIComponent(stateString);
}

export function decompressState(compressed: string): URLState | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
    if (!decompressed) return null;
    return JSON.parse(decompressed);
  } catch {
    return null;
  }
}

export function createShareableURL(state: URLState): string | null {
  const compressed = compressState(state);
  const url = `${window.location.origin}?state=${compressed}`;

  // Check if URL is too long
  if (url.length > MAX_URL_LENGTH) {
    return null;
  }

  return url;
}

export function parseShareableURL(url: string): URLState | null {
  try {
    const urlObj = new URL(url);
    const state = urlObj.searchParams.get('state');
    if (!state) return null;
    return decompressState(state);
  } catch {
    return null;
  }
}

export function validateJSON(json: string): boolean {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}
