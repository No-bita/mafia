"use client";

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/game-store';
import { Button } from '@/components/ui/button';
import { ROLES } from '@/engine/roles';
import { ShieldAlert, Users, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResultsPage() {
  const router = useRouter();
  const { winner, players, round, resetGame } = useGameStore();

  if (!winner) {
    return null;
  }

  const isMafiaWin = winner === 'mafia';
  const winningTeam = isMafiaWin ? 'Mafia' : 'Town';
  
  const handlePlayAgain = () => {
    resetGame();
    router.push('/setup');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${
        isMafiaWin 
          ? 'from-red-900/30 via-[#0a0a0f] to-[#0a0a0f]' 
          : 'from-blue-900/30 via-[#0a0a0f] to-[#0a0a0f]'
      } opacity-80`} />
      
      <div className="z-10 w-full max-w-sm flex flex-col items-center space-y-8">
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-center space-y-4"
        >
          <Trophy size={64} className={`mx-auto ${isMafiaWin ? 'text-accent-red' : 'text-accent-blue'}`} />
          <h1 className="text-5xl font-serif text-white font-bold uppercase tracking-widest">
            {winningTeam} Wins!
          </h1>
          <p className="text-neutral-400">Game ended on Round {round}</p>
        </motion.div>

        <div className="w-full space-y-4">
          <h3 className="text-sm tracking-widest uppercase text-neutral-500 text-center">Final Roles</h3>
          <div className="glass rounded-xl p-2 divide-y divide-neutral-800">
            {players.map(p => {
              const role = p.roleId ? ROLES[p.roleId] : null;
              return (
                <div key={p.id} className={`flex items-center justify-between p-3 ${!p.isAlive ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{role?.icon}</span>
                    <span className={`font-medium ${!p.isAlive ? 'line-through text-neutral-400' : ''}`}>
                      {p.name}
                    </span>
                  </div>
                  <div className={`text-sm font-medium ${role?.team === 'mafia' ? 'text-accent-red' : 'text-accent-blue'}`}>
                    {role?.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Button 
          onClick={handlePlayAgain}
          className="w-full h-14 text-lg font-bold"
        >
          Play Again with Same Players
        </Button>
      </div>
    </div>
  );
}
