"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { useGameStore } from '@/store/game-store';
import { Button } from '@/components/ui/button';

export default function AssignedPage() {
  const router = useRouter();
  const { resetGame } = useGameStore();

  const handlePlayAgain = () => {
    resetGame();
    router.push('/setup');
  };

  const handleHome = () => {
    resetGame();
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-[#0a0a0f] to-[#0a0a0f] opacity-80" />
      
      <div className="z-10 text-center space-y-12 w-full max-w-sm">
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="space-y-6 flex flex-col items-center"
        >
          <CheckCircle2 size={80} className="text-emerald-500" />
          
          <div className="space-y-2">
            <h1 className="text-4xl font-serif text-white font-bold">
              Roles Assigned!
            </h1>
            <p className="text-neutral-400">
              The game is ready to begin. The host can now narrate the game.
            </p>
          </div>
        </motion.div>

        <div className="space-y-4 pt-8">
          <Button 
            onClick={handlePlayAgain}
            className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-neutral-200"
          >
            <RotateCcw className="mr-2" /> Start New Game
          </Button>

          <Button 
            onClick={handleHome}
            variant="ghost"
            className="w-full h-12 text-neutral-400"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
