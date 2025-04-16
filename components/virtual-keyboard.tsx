'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  usedLetters: {
    [key: string]: 'correct' | 'present' | 'absent' | undefined;
  };
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export function VirtualKeyboard({ onKeyPress, usedLetters }: VirtualKeyboardProps) {
  const getKeyColor = (key: string) => {
    const status = usedLetters[key];
    switch (status) {
      case 'correct':
        return 'bg-green-500 hover:bg-green-600';
      case 'present':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'absent':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-2">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 mb-1">
          {rowIndex === 2 && (
            <Button
              variant="secondary"
              className="w-12 h-12 p-0"
              onClick={() => onKeyPress('Backspace')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {row.map((key) => (
            <Button
              key={key}
              variant="secondary"
              className={`w-8 h-12 sm:w-12 p-0 font-semibold ${getKeyColor(key)}`}
              onClick={() => onKeyPress(key)}
            >
              {key}
            </Button>
          ))}
          {rowIndex === 2 && (
            <Button
              variant="secondary"
              className="w-16 h-12 p-0 text-sm"
              onClick={() => onKeyPress('Enter')}
            >
              Enter
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}