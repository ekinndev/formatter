'use client';

import React, { forwardRef, useImperativeHandle, useRef, ChangeEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { IJSONInputProps, IJSONInputRef } from './types';
import { JSONInputErrorBoundary } from './error-boundary';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const JSONInput = forwardRef<IJSONInputRef, IJSONInputProps>(
  ({ value, onChange, isLoading, error, placeholder }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus();
      },
      clear: () => {
        onChange('');
      },
      paste: async () => {
        try {
          const text = await navigator.clipboard.readText();
          onChange(text);
        } catch (error) {
          console.error('Failed to read clipboard:', error);
        }
      },
    }));

    return (
      <JSONInputErrorBoundary>
        <div className='relative'>
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'min-h-[300px] font-mono resize-none transition-colors',
              'bg-muted/50 focus:bg-background',
              'scrollbar scrollbar-track-transparent scrollbar-thumb-accent scrollbar-thumb-rounded-lg',
              error && 'border-red-500 focus:border-red-500',
              isLoading && 'opacity-50'
            )}
            disabled={isLoading}
          />
          {error && <p className='mt-2 text-sm text-red-500 dark:text-red-400'>{error}</p>}
          {isLoading && (
            <div className='absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm'>
              <Loader2 className='h-6 w-6 animate-spin' />
            </div>
          )}
        </div>
      </JSONInputErrorBoundary>
    );
  }
);

JSONInput.displayName = 'JSONInput';
