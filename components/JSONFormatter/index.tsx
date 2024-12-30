'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { IJSONFormatterProps } from './types';
import { formatJSON, downloadJSON } from './utils';
import { Loader2, Copy, Check, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createShareableURL } from '@/lib/utils/url';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useJsonWorker } from '@/hooks/useJsonWorker';

interface RowData {
  lines: string[];
  lineNumbers: boolean;
  fontSize: number;
  fontFamily: string;
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: RowData;
}

const Row = ({ index, style, data }: RowProps) => {
  const { lines, lineNumbers, fontSize, fontFamily } = data;
  return (
    <div style={style} className='flex'>
      {lineNumbers && (
        <span
          className='pl-2 sm:pl-4 pr-1 sm:pr-2 text-muted-foreground select-none border-r border-border bg-muted/50 min-w-[2.5rem] sm:min-w-[3.5rem]'
          style={{ fontSize }}
        >
          {index + 1}
        </span>
      )}
      <span className='px-2 sm:px-4' style={{ fontSize, fontFamily }}>
        {lines[index]}
      </span>
    </div>
  );
};

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
  const [formattedResult, setFormattedResult] = useState(() => formatJSON(value, indentSize));
  const previousValueRef = useRef(value);
  const previousIndentRef = useRef(indentSize);

  // Use web worker for large JSON files (> 100KB)
  const shouldUseWorker = value.length > 100000;
  const { formatJson } = useJsonWorker({
    onSuccess: (formatted: string) => {
      setFormattedResult(formatJSON(formatted, indentSize));
      setError(undefined);
    },
    onError: (errorMessage: string) => {
      setError(errorMessage);
      setFormattedResult({ formatted: value, error: errorMessage });
    },
  });

  useEffect(() => {
    // Only update if value or indentSize has changed
    if (previousValueRef.current !== value || previousIndentRef.current !== indentSize) {
      previousValueRef.current = value;
      previousIndentRef.current = indentSize;

      if (shouldUseWorker) {
        formatJson(value, indentSize);
      } else {
        const result = formatJSON(value, indentSize);
        setFormattedResult(result);
        setError(result.error);
      }
    }
  }, [value, indentSize, shouldUseWorker, formatJson]);

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
    } catch {
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
    } catch {
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
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to share: Invalid JSON',
        variant: 'destructive',
      });
    }
  };

  // Split formatted content into lines for virtualization
  const lines = useMemo(() => {
    if (!formattedResult.formatted) return [];
    return formattedResult.formatted
      .split('\n')
      .map(line => line.replace(/&nbsp;/g, ' ').replace(/<\/?[^>]+(>|$)/g, ''));
  }, [formattedResult.formatted]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[200px]'>
        <Loader2 className='h-6 w-6 animate-spin' />
      </div>
    );
  }

  return (
    <div className='relative group'>
      <div className='absolute right-2 top-2 flex gap-1 sm:gap-2 bg-background/80 backdrop-blur-sm rounded-md p-0.5 sm:p-1 z-50'>
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleShare}
                className='h-7 w-7 sm:h-8 sm:w-8 hover:bg-accent relative z-50'
                disabled={!value.trim() || !!error}
              >
                <Share2 className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom' className='z-[60] hidden sm:block'>
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
                className={cn('h-7 w-7 sm:h-8 sm:w-8 hover:bg-accent relative z-50', copied && 'text-green-500')}
                disabled={!value.trim() || !!error}
              >
                {copied ? (
                  <Check className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                ) : (
                  <Copy className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom' className='z-[60] hidden sm:block'>
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
                className='h-7 w-7 sm:h-8 sm:w-8 hover:bg-accent relative z-50'
                disabled={!value.trim() || !!error}
              >
                <Download className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom' className='z-[60] hidden sm:block'>
              <p>Download JSON</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div
        className={cn(
          'rounded-md border bg-muted/50 font-mono overflow-x-auto',
          !lineWrap && 'whitespace-pre',
          lineWrap && 'whitespace-pre-wrap'
        )}
        style={{ fontFamily }}
      >
        {error ? (
          <div className='p-4 text-destructive'>{error}</div>
        ) : !value.trim() ? (
          <div className='p-4 text-muted-foreground'>No JSON to display</div>
        ) : (
          <List
            height={Math.min(600, Math.max(200, lines.length * (fontSize + 8)))}
            itemCount={lines.length}
            itemSize={fontSize + 8}
            width='100%'
            itemData={{
              lines,
              lineNumbers: showLineNumbers,
              fontSize,
              fontFamily,
            }}
          >
            {Row}
          </List>
        )}
      </div>
    </div>
  );
};
