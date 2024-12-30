'use client';

import React from 'react';
import { FONT_FAMILIES, FONT_SIZES, INDENT_SIZES, ISettingsProps } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function Settings({
  indentSize,
  onIndentSizeChange,
  fontSize,
  onFontSizeChange,
  lineWrap,
  onLineWrapChange,
  fontFamily,
  onFontFamilyChange,
}: ISettingsProps) {
  return (
    <div className='flex flex-wrap gap-6'>
      <div className='space-y-2'>
        <Label htmlFor='indent-size'>Indent Size</Label>
        <Select value={indentSize.toString()} onValueChange={value => onIndentSizeChange(Number(value))}>
          <SelectTrigger id='indent-size' className='w-24'>
            <SelectValue placeholder='Select size' />
          </SelectTrigger>
          <SelectContent>
            {INDENT_SIZES.map(size => (
              <SelectItem key={size} value={size.toString()}>
                {size} spaces
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='font-size'>Font Size</Label>
        <Select value={fontSize.toString()} onValueChange={value => onFontSizeChange(Number(value))}>
          <SelectTrigger id='font-size' className='w-24'>
            <SelectValue placeholder='Select size' />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map(size => (
              <SelectItem key={size} value={size.toString()}>
                {size}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='font-family'>Font Family</Label>
        <Select value={fontFamily} onValueChange={onFontFamilyChange}>
          <SelectTrigger id='font-family' className='w-40'>
            <SelectValue placeholder='Select font' />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map(font => (
              <SelectItem key={font} value={font}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='line-wrap'>Line Wrap</Label>
        <div className='flex items-center space-x-2'>
          <Switch id='line-wrap' checked={lineWrap} onCheckedChange={onLineWrapChange} />
          <Label htmlFor='line-wrap' className='font-normal'>
            {lineWrap ? 'On' : 'Off'}
          </Label>
        </div>
      </div>
    </div>
  );
}
