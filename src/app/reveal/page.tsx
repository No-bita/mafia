"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/game-store';
import { Button } from '@/components/ui/button';
import { ROLES } from '@/engine/roles';

export default function RevealPage() {
  const router = useRouter();
  const { players, currentRevealIndex, advanceReveal, phase } = useGameStore();
  const [isFlipped, setIsFlipped] = useState(false);
  
  useEffect(() => {
    // If we've advanced past reveal, go to the final assigned screen
    if (phase === 'assigned') {
      router.push('/assigned');
    }
  }, [phase, router]);

  if (!players || players.length === 0 || currentRevealIndex >= players.length) {
    return null;
  }

  const currentPlayer = players[currentRevealIndex];
  const role = currentPlayer.roleId ? ROLES[currentPlayer.roleId] : null;

  const handleReveal = () => setIsFlipped(true);
  const handleHideAndPass = () => {
    setIsFlipped(false);
    setTimeout(() => advanceReveal(), 300); // Wait for flip animation
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-[#0a0a0f] to-[#0a0a0f] opacity-50" />
      
      <div className="z-10 w-full max-w-sm flex flex-col items-center justify-center space-y-8">
        
        <div className="text-center space-y-2">
          <p className="text-neutral-400 text-sm tracking-widest uppercase">Pass the device to</p>
          <h2 className="text-4xl font-serif text-white font-bold">{currentPlayer.name}</h2>
        </div>

        {/* 3D Card Container */}
        <div className="w-full aspect-[2/3] perspective-1000">
          <motion.div
            className="w-full h-full relative preserve-3d cursor-pointer"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={!isFlipped ? handleReveal : undefined}
          >
            
            {/* Front of Card (Hidden State) */}
            <div className="absolute inset-0 backface-hidden rounded-2xl glass flex flex-col items-center justify-center border-2 border-neutral-700 bg-neutral-900/80">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-neutral-600 flex items-center justify-center opacity-50">
                <span className="text-3xl text-neutral-500">?</span>
              </div>
              <p className="mt-8 text-neutral-400 font-medium tracking-wide text-sm">TAP TO REVEAL</p>
            </div>

            {/* Back of Card (Revealed State) */}
            <div 
              className="absolute inset-0 backface-hidden rounded-2xl flex flex-col items-center justify-center p-6 text-center border-2 rotate-y-180"
              style={{ 
                background: `linear-gradient(to bottom right, var(--color-bg-primary), ${role?.color === 'bg-accent-red' ? 'rgba(220,38,38,0.2)' : 'rgba(59,130,246,0.2)'})`,
                borderColor: role?.color === 'bg-accent-red' ? 'rgba(220,38,38,0.5)' : 'rgba(59,130,246,0.5)'
              }}
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl ${role?.color}`}>
                {role?.icon}
              </div>
              
              <p className="text-sm tracking-widest uppercase text-neutral-400 mb-1">Your Role is</p>
              <h3 className="text-4xl font-serif font-bold text-white mb-6">
                {role?.name}
              </h3>
              
              <p className="text-neutral-300 text-sm leading-relaxed mb-2">
                {role?.description}
              </p>
              <p className="text-xs text-neutral-500 italic">
                {role?.abilityDescription}
              </p>
            </div>

          </motion.div>
        </div>

        <div className="h-16 w-full">
          <AnimatePresence>
            {isFlipped && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Button 
                  onClick={handleHideAndPass} 
                  className="w-full h-14 text-lg font-bold bg-white text-black"
                >
                  Hide & Pass Device
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
