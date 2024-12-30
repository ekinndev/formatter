'use client';

import { useTheme } from '@/lib/context/theme-context';
import { JSONInput } from '@/components/JSONInput';
import { JSONFormatter } from '@/components/JSONFormatter';
import { Button } from '@/components/ui/button';
import { useState, useRef, useCallback, useEffect } from 'react';
import { IJSONInputRef } from '@/components/JSONInput/types';
import { Moon, Sun, Clipboard, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { Settings } from '@/components/Settings';
import { FONT_FAMILIES } from '@/components/Settings/types';
import { KeyboardShortcutsModal } from '@/components/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { parseShareableURL } from '@/lib/utils/url';
import { Toaster } from '@/components/ui/toaster';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

function Home() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const jsonInputRef = useRef<IJSONInputRef>(null);
  const formatterRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Formatting settings
  const [indentSize, setIndentSize] = useState(2);
  const [fontSize, setFontSize] = useState(14);
  const [lineWrap, setLineWrap] = useState(true);
  const [fontFamily, setFontFamily] = useState<string>(FONT_FAMILIES[0]);

  // Handle URL state
  useEffect(() => {
    const state = searchParams.get('state');
    if (state) {
      const url = window.location.href;
      const parsedState = parseShareableURL(url);
      if (parsedState) {
        setJsonInput(parsedState.json);
        if (parsedState.indent) setIndentSize(parsedState.indent);
        if (parsedState.wrap !== undefined) setLineWrap(parsedState.wrap);
        if (parsedState.font) setFontFamily(parsedState.font);
        if (parsedState.size) setFontSize(parsedState.size);
        toast({
          title: 'URL State Loaded',
          description: 'JSON and settings have been loaded from the URL',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load state from URL',
          variant: 'destructive',
        });
      }
    }
  }, [searchParams, toast]);

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    setError(undefined);
  };

  const handlePaste = async () => {
    setIsLoading(true);
    try {
      await jsonInputRef.current?.paste();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to paste from clipboard';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFontFamilyChange = (font: string) => {
    setFontFamily(font);
  };

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, indentSize));
      setError(undefined);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid JSON';
      setError(errorMessage);
    }
  }, [jsonInput, indentSize]);

  const handleCopy = useCallback(async () => {
    try {
      const rawJSON = JSON.stringify(JSON.parse(jsonInput), null, indentSize);
      await navigator.clipboard.writeText(rawJSON);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [jsonInput, indentSize]);

  const handleClear = useCallback(() => {
    jsonInputRef.current?.clear();
  }, []);

  useKeyboardShortcuts({
    onFormat: handleFormat,
    onCopy: handleCopy,
    onClear: handleClear,
    onToggleSettings: () => setShowSettings(prev => !prev),
  });

  return (
    <>
      <div className='min-h-screen bg-background'>
        {/* Header */}
        <header className='border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'>
          <div className='container flex h-14 max-w-screen-2xl items-center'>
            <div className='mr-4 flex'>
              <Link className='mr-6 flex items-center space-x-2' href='/'>
                <span className='font-bold inline-block'>FormatterAI</span>
              </Link>
            </div>
            <div className='flex flex-1 items-center space-x-2 justify-end'>
              <KeyboardShortcutsModal />
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setShowSettings(!showSettings)}
                className={`h-8 w-8 ${showSettings ? 'bg-accent' : ''}`}
              >
                <SettingsIcon className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='icon' onClick={handlePaste} disabled={isLoading} className='h-8 w-8'>
                <Clipboard className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='icon' onClick={toggleTheme} className='h-8 w-8' disabled={!mounted}>
                {mounted && (theme === 'light' ? <Moon className='h-4 w-4' /> : <Sun className='h-4 w-4' />)}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className='container max-w-screen-2xl mx-auto py-6 px-4'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold tracking-tight'>FormatterAI</h1>
            <p className='text-muted-foreground mt-2'>
              Format, validate, and beautify your JSON with ease. Copy, download, or share your formatted JSON
              instantly.
            </p>
          </div>

          {showSettings && (
            <div className='mb-8 p-4 border rounded-lg bg-card'>
              <h2 className='text-lg font-semibold mb-4'>Formatting Options</h2>
              <Settings
                indentSize={indentSize}
                onIndentSizeChange={setIndentSize}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                lineWrap={lineWrap}
                onLineWrapChange={setLineWrap}
                fontFamily={fontFamily}
                onFontFamilyChange={handleFontFamilyChange}
              />
            </div>
          )}

          <div className='grid lg:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>Input</h2>
                <div className='flex gap-2'>
                  <Button variant='ghost' size='sm' onClick={handleFormat} disabled={!jsonInput.trim()}>
                    Format
                  </Button>
                  <Button variant='ghost' size='sm' onClick={handleClear} disabled={!jsonInput.trim()}>
                    Clear
                  </Button>
                </div>
              </div>
              <JSONInput
                ref={jsonInputRef}
                value={jsonInput}
                onChange={handleJsonChange}
                error={error}
                isLoading={isLoading}
                placeholder='Paste your JSON here or click the paste button in the header...'
              />
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>Output</h2>
              </div>
              <div ref={formatterRef}>
                <JSONFormatter
                  value={jsonInput}
                  indentSize={indentSize}
                  isLoading={isLoading}
                  fontSize={fontSize}
                  lineWrap={lineWrap}
                  fontFamily={fontFamily}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
      </div>
      <Toaster />
    </>
  );
}

Home.displayName = 'Home';

export default Home;
