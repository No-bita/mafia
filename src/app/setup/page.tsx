"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldAlert, ChevronRight, ChevronLeft } from 'lucide-react';
import { useGameStore } from '@/store/game-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROLES } from '@/engine/roles';
import { balanceRoles } from '@/engine/balancer';

export default function SetupPage() {
  const router = useRouter();
  const { players, addPlayer, removePlayer, roleConfig, setRoleConfig, startReveal, resetGame } = useGameStore();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [targetCount, setTargetCount] = useState<number>(5);
  const [tempNames, setTempNames] = useState<string[]>(Array(5).fill(''));

  // Step 1: Handle player count change
  const handleCountChange = (delta: number) => {
    const newCount = Math.max(2, targetCount + delta); // Min 2 players
    setTargetCount(newCount);
    
    // Adjust temp names array
    if (newCount > tempNames.length) {
      setTempNames([...tempNames, ...Array(newCount - tempNames.length).fill('')]);
    } else if (newCount < tempNames.length) {
      setTempNames(tempNames.slice(0, newCount));
    }
  };

  // Step 2: Handle name input
  const handleNameChange = (index: number, value: string) => {
    const newNames = [...tempNames];
    newNames[index] = value;
    setTempNames(newNames);
  };

  const areNamesValid = tempNames.every(name => name.trim().length > 0) && new Set(tempNames.map(n => n.trim())).size === tempNames.length;

  const proceedToRoles = () => {
    // 1. Reset current players in store
    resetGame();
    
    // 2. Add players from temp names
    tempNames.forEach(name => {
      const seed = Math.random().toString(36).substring(7);
      addPlayer(name.trim(), seed);
    });

    // 3. Set default system recommendation
    setRoleConfig(balanceRoles(targetCount));
    
    setStep(3);
  };

  // Step 3: Handle role counts
  const handleRoleCountChange = (roleId: string, delta: number) => {
    const current = roleConfig[roleId] || 0;
    const next = Math.max(0, current + delta);
    setRoleConfig({ ...roleConfig, [roleId]: next });
  };

  const handleStartGame = () => {
    startReveal();
    router.push('/reveal');
  };

  const totalRoles = Object.values(roleConfig).reduce((sum, count) => sum + count, 0);
  const isRoleConfigValid = totalRoles === targetCount && (roleConfig['mafia'] || 0) > 0;

  return (
    <div className="flex flex-col min-h-screen p-6 pb-24 space-y-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-[#0a0a0f] to-[#0a0a0f] -z-10" />

      {/* Progress Header */}
      <div className="flex items-center justify-between text-sm font-medium text-neutral-500 mb-4">
        <span className={step === 1 ? 'text-white' : ''}>1. Count</span>
        <span className="text-neutral-700">→</span>
        <span className={step === 2 ? 'text-white' : ''}>2. Names</span>
        <span className="text-neutral-700">→</span>
        <span className={step === 3 ? 'text-white' : ''}>3. Roles</span>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: PLAYER COUNT */}
        {step === 1 && (
          <motion.section
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center justify-center flex-1 space-y-12"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif text-white">How many players?</h2>
              {targetCount < 5 ? (
                <p className="text-accent-gold">5+ players recommended for best experience.</p>
              ) : (
                <p className="text-neutral-400">Perfect size for a great game.</p>
              )}
            </div>

            <div className="flex items-center gap-6">
              <Button 
                onClick={() => handleCountChange(-1)}
                disabled={targetCount <= 2}
                className="w-16 h-16 rounded-full text-3xl bg-neutral-800 text-white hover:bg-neutral-700 disabled:opacity-30"
              >
                -
              </Button>
              
              <span className="text-6xl font-bold w-24 text-center">{targetCount}</span>
              
              <Button 
                onClick={() => handleCountChange(1)}
                className="w-16 h-16 rounded-full text-3xl bg-neutral-800 text-white hover:bg-neutral-700"
              >
                +
              </Button>
            </div>
          </motion.section>
        )}

        {/* STEP 2: PLAYER NAMES */}
        {step === 2 && (
          <motion.section
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-serif text-white">Who is playing?</h2>
              <p className="text-neutral-400">Enter a unique name for each player.</p>
            </div>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
              {tempNames.map((name, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 text-center text-neutral-500 font-medium">{i + 1}</div>
                  <Input 
                    value={name}
                    onChange={(e) => handleNameChange(i, e.target.value)}
                    placeholder={`Player ${i + 1}`}
                    maxLength={15}
                    className="flex-1 bg-neutral-900 border-neutral-700"
                  />
                </div>
              ))}
            </div>
            
            {!areNamesValid && (
              <p className="text-xs text-accent-red text-center">
                All players must have a unique, non-empty name.
              </p>
            )}
          </motion.section>
        )}

        {/* STEP 3: ROLE CONFIGURATION */}
        {step === 3 && (
          <motion.section
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-serif text-white">Role Distribution</h2>
              <p className="text-neutral-400 text-sm">
                We've applied the recommended balance for {targetCount} players. Feel free to adjust.
              </p>
            </div>

            <div className="flex items-center justify-between text-sm mb-2 px-1">
              <span className="text-neutral-400">Total Roles:</span>
              <span className={`font-bold ${totalRoles !== targetCount ? 'text-accent-red' : 'text-emerald-500'}`}>
                {totalRoles} / {targetCount}
              </span>
            </div>

            <div className="grid gap-3">
              {Object.values(ROLES).map(role => {
                const count = roleConfig[role.id] || 0;
                return (
                  <div key={role.id} className="flex items-center justify-between p-3 rounded-lg glass">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${role.color}`}>
                        {role.icon}
                      </div>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-2">
                          {role.name}
                          {role.team === 'mafia' && <ShieldAlert size={14} className="text-accent-red" />}
                          {role.team === 'town' && <Users size={14} className="text-accent-blue" />}
                        </div>
                        <p className="text-xs text-neutral-400 line-clamp-1">{role.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-neutral-900 rounded-lg p-1 border border-neutral-800 shrink-0">
                      <button 
                        onClick={() => handleRoleCountChange(role.id, -1)}
                        disabled={count === 0}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-800 disabled:opacity-30 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-sm font-bold">{count}</span>
                      <button 
                        onClick={() => handleRoleCountChange(role.id, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-800 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {!isRoleConfigValid && (
              <p className="text-xs text-accent-red text-center">
                Total roles must match player count ({targetCount}), with at least 1 Mafia.
              </p>
            )}
          </motion.section>
        )}

      </AnimatePresence>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent max-w-md mx-auto flex gap-3">
        {step > 1 && (
          <Button 
            variant="outline"
            onClick={() => setStep(step - 1 as 1 | 2)}
            className="h-14 w-14 shrink-0 bg-neutral-900"
          >
            <ChevronLeft />
          </Button>
        )}
        
        {step === 1 && (
          <Button 
            onClick={() => setStep(2)}
            className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-neutral-200"
          >
            Next <ChevronRight className="ml-2" />
          </Button>
        )}

        {step === 2 && (
          <Button 
            onClick={proceedToRoles}
            disabled={!areNamesValid}
            className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-neutral-200"
          >
            Next <ChevronRight className="ml-2" />
          </Button>
        )}

        {step === 3 && (
          <Button 
            onClick={handleStartGame} 
            disabled={!isRoleConfigValid}
            className="w-full h-14 text-lg font-bold bg-accent-red hover:bg-red-700 text-white"
          >
            Assign Roles
          </Button>
        )}
      </div>
    </div>
  );
}
