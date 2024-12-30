'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { IJSONFormatterProps } from './types';
import { formatJSON, downloadJSON } from './utils';
import { Loader2, Copy, Check, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createShareableURL } from '@/lib/utils/url';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useJsonWorker } from '@/hooks/useJsonWorker';

export const JSONFormatter: React.FC<IJSONFormatterProps> = ({
  value,
  indentSize = 2,
  isLoading = false,
  showLineNumbers = true,
  fontSize = 14,
  lineWrap = true,
  fontFamily = 'Consolas',
}) => {
  const [error, setError] = useState<string>();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Use web worker for large JSON files (> 100KB)
  const shouldUseWorker = value.length > 100000;
  const { formatJson } = useJsonWorker({
    onSuccess: formatted => {
      const result = formatJSON(formatted, indentSize);
      setFormattedResult(result);
      setError(undefined);
    },
    onError: errorMessage => {
      setError(errorMessage);
      setFormattedResult({ formatted: value, error: errorMessage });
    },
  });

  const [formattedResult, setFormattedResult] = useState(() => formatJSON(value, indentSize));

  useEffect(() => {
    if (shouldUseWorker) {
      formatJson(value, indentSize);
    } else {
      setFormattedResult(formatJSON(value, indentSize));
    }
  }, [value, indentSize, shouldUseWorker, formatJson]);

  useEffect(() => {
    setError(formattedResult.error);
  }, [formattedResult.error]);

  const handleCopy = async () => {
    if (!value.trim()) {
      toast({
        title: 'Error',
        description: 'No JSON to copy',
        variant: 'destructive',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(formattedResult.rawJSON || value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Success',
        description: 'JSON copied to clipboard',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy: Invalid JSON',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    if (!value.trim()) {
      toast({
        title: 'Error',
        description: 'No JSON to download',
        variant: 'destructive',
      });
      return;
    }

    try {
      downloadJSON(formattedResult.rawJSON || value);
      toast({
        title: 'Success',
        description: 'JSON file downloaded successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to download: Invalid JSON',
        variant: 'destructive',
      });
    }
  };

  const handleShare = () => {
    if (!value.trim()) {
      toast({
        title: 'Error',
        description: 'No JSON to share',
        variant: 'destructive',
      });
      return;
    }

    try {
      const state = {
        json: formattedResult.rawJSON || value,
        indent: indentSize,
        wrap: lineWrap,
        font: fontFamily,
        size: fontSize,
      };

      const url = createShareableURL(state);

      if (!url) {
        toast({
          title: 'Error',
          description: 'JSON is too large to share via URL',
          variant: 'destructive',
        });
        return;
      }

      navigator.clipboard.writeText(url);
      toast({
        title: 'Success',
        description: 'Shareable link copied to clipboard',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to share: Invalid JSON',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[200px]'>
        <Loader2 className='h-6 w-6 animate-spin' />
      </div>
    );
  }

  return (
    <div className='relative group'>
      <div className='absolute right-2 top-2 flex gap-2 bg-background/80 backdrop-blur-sm rounded-md p-1 z-50'>
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleShare}
                className='h-8 w-8 hover:bg-accent relative z-50'
                disabled={!value.trim() || !!error}
              >
                <Share2 className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom' className='z-[60]'>
              <p>Share JSON</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleCopy}
                className={cn('h-8 w-8 hover:bg-accent relative z-50', copied && 'text-green-500')}
                disabled={!value.trim() || !!error}
              >
                {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom' className='z-[60]'>
              <p>Copy JSON</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleDownload}
                className='h-8 w-8 hover:bg-accent relative z-50'
                disabled={!value.trim() || !!error}
              >
                <Download className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom' className='z-[60]'>
              <p>Download JSON</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div
        className={cn(
          'rounded-lg bg-muted font-mono text-sm overflow-x-auto relative',
          error && 'border-red-500 border'
        )}
      >
        <div className='relative'>
          {showLineNumbers && formattedResult.lineNumbers && (
            <pre
              className='absolute left-0 top-0 pl-4 pr-2 py-4 text-muted-foreground select-none border-r border-border bg-muted/50'
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: formattedResult.lineNumbers }}
            />
          )}
          <pre
            className={cn('p-4', showLineNumbers && 'pl-[3.5rem]', !lineWrap && 'whitespace-pre')}
            style={{
              fontSize: `${fontSize}px`,
              fontFamily,
            }}
          >
            <code className='language-json block' dangerouslySetInnerHTML={{ __html: formattedResult.formatted }} />
          </pre>
        </div>
      </div>
      {error && <p className='mt-2 text-sm text-red-500 dark:text-red-400'>{error}</p>}
    </div>
  );
};
