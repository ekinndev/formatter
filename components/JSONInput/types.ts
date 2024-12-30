export interface IJSONInputProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  error?: string;
  placeholder?: string;
}

export interface IJSONInputRef {
  focus: () => void;
  clear: () => void;
  paste: () => Promise<void>;
}
