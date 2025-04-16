'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { VirtualKeyboard } from './virtual-keyboard';

interface Props {
  solution: string;
}

interface GameStats {
  wins: number;
  losses: number;
}

export function WordleGame({ solution }: Props) {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [stats, setStats] = useState<GameStats>({ wins: 0, losses: 0 });
  const { getItem, setItem } = useLocalStorage('wordleStats');

  const isGameOver = gameWon || guesses.length === 6;

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = getItem();
    if (savedStats) {
      setStats(savedStats);
    }
  }, []);

  // Focus the window on mount to capture keyboard input
  useEffect(() => {
    window.focus();
  }, []);

  const handleKeyPress = (key: string) => {
    if (isGameOver) return;
    
    if (key === 'Enter' && currentGuess.length === 5) {
      handleSubmitGuess();
    } else if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5 && key.match(/^[A-Z]$/)) {
      setCurrentGuess(prev => prev + key);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isGameOver) return;
    
    if (e.key === 'Enter' && currentGuess.length === 5) {
      handleSubmitGuess();
    } else if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5 && e.key.match(/^[a-zA-Z]$/)) {
      setCurrentGuess(prev => (prev + e.key).toUpperCase());
    }
  };

  const updateStats = (won: boolean) => {
    const newStats = {
      wins: stats.wins + (won ? 1 : 0),
      losses: stats.losses + (won ? 0 : 1),
    };
    setStats(newStats);
    setItem(newStats);
  };

  const handleSubmitGuess = () => {
    if (currentGuess.length !== 5) {
      toast.error('Word must be 5 letters long', {
        duration: 2000,
        position: 'top-center',
      });
      return;
    }

    const newGuess = currentGuess.toUpperCase();
    setGuesses(prev => [...prev, newGuess]);
    setCurrentGuess('');

    if (newGuess === solution) {
      setGameWon(true);
      updateStats(true);
      toast.success('Congratulations! You won! 🎉', {
        duration: 3000,
        position: 'top-center',
      });
    } else if (guesses.length === 5) {
      updateStats(false);
      toast.error(`Game Over! The word was ${solution}`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const getLetterColor = (letter: string, index: number, guess: string) => {
    if (letter === solution[index]) {
      return 'bg-green-500';
    }
    if (solution.includes(letter)) {
      return 'bg-yellow-500';
    }
    return 'bg-gray-500';
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, guesses, isGameOver]);

  const handleReset = () => {
    window.location.reload();
  };

  const getUsedLetters = () => {
    const used: { [key: string]: 'correct' | 'present' | 'absent' | undefined } = {};
    
    guesses.forEach(guess => {
      guess.split('').forEach((letter, index) => {
        if (letter === solution[index]) {
          used[letter] = 'correct';
        } else if (solution.includes(letter) && used[letter] !== 'correct') {
          used[letter] = 'present';
        } else if (!solution.includes(letter)) {
          used[letter] = 'absent';
        }
      });
    });

    return used;
  };

  const renderCell = (rowIndex: number, colIndex: number) => {
    const isCurrentRow = rowIndex === guesses.length;
    const guess = guesses[rowIndex];
    const letter = guess ? guess[colIndex] : (isCurrentRow ? currentGuess[colIndex] : '');
    const hasLetter = Boolean(letter);
    
    const cellClass = hasLetter
      ? `${guess ? getLetterColor(letter, colIndex, guess) : 'bg-gray-200 dark:bg-gray-700'} 
         text-white font-bold`
      : 'border-2 border-gray-300 dark:border-gray-600';

    return (
      <div
        key={colIndex}
        className={`w-14 h-14 flex items-center justify-center text-2xl rounded
          ${cellClass} transition-colors duration-300`}
      >
        {letter}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md px-4">
      <div className="flex justify-between mb-4">
        <div className="text-sm">
          <span className="font-bold">Wins:</span> {stats.wins}
        </div>
        <div className="text-sm">
          <span className="font-bold">Losses:</span> {stats.losses}
        </div>
      </div>

      <div className="grid gap-1 mb-4 justify-center">
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-2 justify-center">
            {Array.from({ length: 5 }).map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </div>
        ))}
      </div>
      
      <div className="text-center space-y-2 mb-4">
        <p className="text-muted-foreground">
          {isGameOver 
            ? `Game Over! The word was ${solution}`
            : `Guess ${guesses.length + 1} of 6`}
        </p>
        {isGameOver && (
          <Button
            onClick={handleReset}
            variant="outline"
          >
            Play Again
          </Button>
        )}
      </div>

      <VirtualKeyboard 
        onKeyPress={handleKeyPress}
        usedLetters={getUsedLetters()}
      />
    </div>
  );
}