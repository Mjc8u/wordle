import { WordleGame } from '@/components/wordle-game';

async function getWordleWord() {
  const response = await fetch('https://api.frontendexpert.io/api/fe/wordle-words');
  const words = await response.json();
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex].toUpperCase();
}

export default async function Home() {
  const word = await getWordleWord();
  
  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-8 text-primary">Wordle</h1>
      <WordleGame solution={word} />
    </main>
  );
}