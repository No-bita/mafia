"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, ShieldAlert, Vote, Skull } from 'lucide-react';
import { useGameStore } from '@/store/game-store';
import { Button } from '@/components/ui/button';
import { ROLES } from '@/engine/roles';
import { Player, Role } from '@/types';

export default function GamePage() {
  const router = useRouter();
  const { 
    players, phase, round, nightActions, events, dayResultText, winner,
    submitNightAction, resolveNightPhase, eliminatePlayer, skipElimination, startNight, resetGame 
  } = useGameStore();

  const [selectedRole, setSelectedRole] = useState<'mafia' | 'doctor' | 'detective' | null>(null);

  // If game is over, go to results
  useEffect(() => {
    if (phase === 'game-over') {
      router.push('/results');
    }
  }, [phase, router]);

  if (!players || players.length === 0) return null;

  const alivePlayers = players.filter(p => p.isAlive);
  const deadPlayers = players.filter(p => !p.isAlive);

  // --- Night Phase UI ---
  const renderNightPhase = () => {
    // Only show active roles that are in the game
    const activeRoles = players.filter(p => p.isAlive).map(p => p.roleId);
    const hasMafia = activeRoles.includes('mafia');
    const hasDoctor = activeRoles.includes('doctor');
    const hasDetective = activeRoles.includes('detective');

    const canResolve = (!hasMafia || nightActions.mafiaKillTargetId) &&
                       (!hasDoctor || nightActions.doctorSaveTargetId) &&
                       (!hasDetective || nightActions.detectiveInvestigateTargetId);

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <Moon size={40} className="mx-auto text-blue-400 mb-4" />
          <h2 className="text-3xl font-serif">Night {round}</h2>
          <p className="text-neutral-400">The town is asleep.</p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2 justify-center">
            {hasMafia && (
              <Button 
                variant={selectedRole === 'mafia' ? 'default' : 'outline'}
                onClick={() => setSelectedRole('mafia')}
                className="flex-1"
              >
                Mafia Action {nightActions.mafiaKillTargetId && '✓'}
              </Button>
            )}
            {hasDoctor && (
              <Button 
                variant={selectedRole === 'doctor' ? 'default' : 'outline'}
                onClick={() => setSelectedRole('doctor')}
                className="flex-1"
              >
                Doctor Action {nightActions.doctorSaveTargetId && '✓'}
              </Button>
            )}
            {hasDetective && (
              <Button 
                variant={selectedRole === 'detective' ? 'default' : 'outline'}
                onClick={() => setSelectedRole('detective')}
                className="flex-1"
              >
                Detective Action {nightActions.detectiveInvestigateTargetId && '✓'}
              </Button>
            )}
          </div>

          <div className="glass p-4 rounded-xl min-h-60">
            {selectedRole ? (
              <div className="space-y-4">
                <p className="text-center font-medium">
                  Who does the {selectedRole} target?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {alivePlayers.map(p => {
                    const isSelected = 
                      (selectedRole === 'mafia' && nightActions.mafiaKillTargetId === p.id) ||
                      (selectedRole === 'doctor' && nightActions.doctorSaveTargetId === p.id) ||
                      (selectedRole === 'detective' && nightActions.detectiveInvestigateTargetId === p.id);

                    return (
                      <Button
                        key={p.id}
                        variant={isSelected ? 'default' : 'secondary'}
                        onClick={() => submitNightAction(selectedRole, p.id)}
                        className={isSelected ? (selectedRole === 'mafia' ? 'bg-accent-red text-white' : 'bg-accent-blue text-white') : ''}
                      >
                        {p.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-500">
                Select a role above to record their action.
              </div>
            )}
          </div>
        </div>

        <Button 
          onClick={() => {
            setSelectedRole(null);
            resolveNightPhase();
          }}
          disabled={!canResolve}
          className="w-full h-14 bg-accent-gold text-black hover:bg-yellow-600 font-bold text-lg"
        >
          Wake Up Town
        </Button>
      </div>
    );
  };

  // --- Day Phase UI ---
  const renderDayResult = () => (
    <div className="space-y-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Sun size={60} className="text-yellow-400" />
      <h2 className="text-3xl font-serif">Morning {round}</h2>
      
      <div className="glass p-6 rounded-2xl w-full">
        <p className="text-xl leading-relaxed">{dayResultText}</p>
      </div>

      <Button 
        onClick={() => useGameStore.setState({ phase: 'day-discussion' })}
        className="w-full h-14"
      >
        Begin Discussion
      </Button>
    </div>
  );

  const renderDayDiscussion = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif">Day {round} Discussion</h2>
        <p className="text-neutral-400">Discuss and find the Mafia.</p>
      </div>

      <div className="glass p-4 rounded-xl space-y-4">
        <h3 className="font-medium text-sm text-neutral-400 uppercase tracking-wider">Alive Players ({alivePlayers.length})</h3>
        <div className="grid grid-cols-2 gap-2">
          {alivePlayers.map(p => (
            <div key={p.id} className="bg-neutral-800 p-3 rounded-lg text-center font-medium">
              {p.name}
            </div>
          ))}
        </div>
      </div>

      <Button 
        onClick={() => useGameStore.setState({ phase: 'voting' })}
        className="w-full h-14 bg-accent-red hover:bg-red-700 text-white"
      >
        <Vote className="mr-2" /> Begin Voting
      </Button>
    </div>
  );

  const renderVoting = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif text-accent-red">Voting</h2>
        <p className="text-neutral-400">Who is the town eliminating?</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {alivePlayers.map(p => (
          <Button
            key={p.id}
            variant="secondary"
            className="h-16 text-lg"
            onClick={() => eliminatePlayer(p.id)}
          >
            {p.name}
          </Button>
        ))}
      </div>

      <Button 
        variant="outline"
        onClick={() => skipElimination()}
        className="w-full h-14 mt-4"
      >
        Skip Elimination
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen p-6 relative">
      <div className={`absolute inset-0 -z-10 transition-colors duration-1000 ${
        phase === 'night' ? 'bg-[#050510]' : 
        phase === 'voting' ? 'bg-[#1a0505]' : 
        'bg-[#101005]'
      }`} />
      
      <div className="flex-1 w-full max-w-sm mx-auto pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {phase === 'night' && renderNightPhase()}
            {phase === 'day-result' && renderDayResult()}
            {phase === 'day-discussion' && renderDayDiscussion()}
            {phase === 'voting' && renderVoting()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mini Graveyard at bottom */}
      {deadPlayers.length > 0 && phase !== 'day-result' && (
        <div className="mt-8 border-t border-neutral-800 pt-4">
          <h4 className="text-xs text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-1">
            <Skull size={12} /> Graveyard
          </h4>
          <div className="flex flex-wrap gap-2">
            {deadPlayers.map(p => {
              const role = p.roleId ? ROLES[p.roleId] : null;
              return (
                <div key={p.id} className="text-xs bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-neutral-400 flex items-center gap-1">
                  <span className="line-through">{p.name}</span>
                  <span className={role?.team === 'mafia' ? 'text-accent-red' : 'text-accent-blue'}>({role?.name})</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}
