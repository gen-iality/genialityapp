import { useState } from 'react';
import { useBingo } from '@/components/games/bingo/hooks/useBingo';
export function useApperanceFormItems() {
  const formItems = [
    {
      label: 'Imagen del Banner',
      name: 'banner',

      width: '728',
      height: '90',
    },
    {
      label: 'Imagen de Fondo',
      name: 'background_image',

      width: '728',
      height: '728',
    },
    {
      label: 'Imagen de marcación (PNG)',
      name: 'dial_image',
      width: '100',
      height: '100',
    },
    {
      label: 'Imagen del Footer',
      name: 'footer',
      width: '728',
      height: '80',
    },
  ];
  return formItems;
}
