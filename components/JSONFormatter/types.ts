export interface IJSONFormatterProps {
  value: string;
  indentSize?: number;
  isLoading?: boolean;
  showLineNumbers?: boolean;
  fontSize?: number;
  lineWrap?: boolean;
  fontFamily?: string;
}

export interface IFormattedJSON {
  formatted: string;
  lineNumbers?: string;
  error?: string;
  rawJSON?: string;
}
