'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Keyboard } from 'lucide-react';

interface ShortcutItem {
  action: string;
  shortcut: string;
  description: string;
}

const shortcuts: ShortcutItem[] = [
  {
    action: 'Format',
    shortcut: '⌘/Ctrl + F',
    description: 'Format the JSON input',
  },
  {
    action: 'Copy',
    shortcut: '⌘/Ctrl + C',
    description: 'Copy formatted JSON to clipboard',
  },
  {
    action: 'Clear',
    shortcut: '⌘/Ctrl + K',
    description: 'Clear the input',
  },
  {
    action: 'Settings',
    shortcut: '⌘/Ctrl + ,',
    description: 'Toggle settings panel',
  },
];

export function KeyboardShortcutsModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' className='h-8 w-8'>
          <Keyboard className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {shortcuts.map(shortcut => (
            <div key={shortcut.action} className='grid grid-cols-[1fr,auto] items-center gap-4'>
              <div>
                <h4 className='font-medium leading-none mb-1'>{shortcut.action}</h4>
                <p className='text-sm text-muted-foreground'>{shortcut.description}</p>
              </div>
              <code className='rounded bg-muted px-2 py-1'>{shortcut.shortcut}</code>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
