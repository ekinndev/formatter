export interface ISettingsProps {
  indentSize: number;
  onIndentSizeChange: (size: number) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  lineWrap: boolean;
  onLineWrapChange: (wrap: boolean) => void;
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
}

export const FONT_FAMILIES = ['Consolas', 'Monaco', 'Menlo', 'monospace', 'Courier New'] as const;

export const INDENT_SIZES = [2, 4, 8] as const;
export const FONT_SIZES = [12, 14, 16, 18] as const;
