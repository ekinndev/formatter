import { useEffect, useCallback } from 'react';

interface ShortcutHandlers {
  onFormat?: () => void;
  onCopy?: () => void;
  onClear?: () => void;
  onToggleSettings?: () => void;
}

export function useKeyboardShortcuts({ onFormat, onCopy, onClear, onToggleSettings }: ShortcutHandlers) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? event.metaKey : event.ctrlKey;

      if (modifier) {
        switch (event.key.toLowerCase()) {
          case 'f':
            event.preventDefault();
            onFormat?.();
            break;
          case 'c':
            // Only handle if no text is selected (let browser handle copy if text is selected)
            if (!window.getSelection()?.toString()) {
              event.preventDefault();
              onCopy?.();
            }
            break;
          case 'k':
            event.preventDefault();
            onClear?.();
            break;
          case ',':
            event.preventDefault();
            onToggleSettings?.();
            break;
        }
      }
    },
    [onFormat, onCopy, onClear, onToggleSettings]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
