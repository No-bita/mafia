"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, UserMinus, ShieldAlert, Users, Wand2 } from 'lucide-react';
import { useGameStore } from '@/store/game-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROLES } from '@/engine/roles';
import { balanceRoles } from '@/engine/balancer';

export default function SetupPage() {
  const router = useRouter();
  const { players, addPlayer, removePlayer, roleConfig, setRoleConfig, startReveal } = useGameStore();
  const [newPlayerName, setNewPlayerName] = useState('');
  
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim().length > 0) {
      // Use random seed for avatar (placeholder)
      const seed = Math.random().toString(36).substring(7);
      addPlayer(newPlayerName.trim(), seed);
      setNewPlayerName('');
    }
  };

  const handleRoleCountChange = (roleId: string, delta: number) => {
    const current = roleConfig[roleId] || 0;
    const next = Math.max(0, current + delta);
    setRoleConfig({ ...roleConfig, [roleId]: next });
  };

  const handleAutoBalance = () => {
    if (players.length >= 5) {
      setRoleConfig(balanceRoles(players.length));
    }
  };

  const handleStartGame = () => {
    startReveal();
    router.push('/reveal');
  };

  const totalRoles = Object.values(roleConfig).reduce((sum, count) => sum + count, 0);
  const isValid = players.length >= 5 && totalRoles === players.length && (roleConfig['mafia'] || 0) > 0;

  return (
    <div className="flex flex-col min-h-screen p-6 pb-24 space-y-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-[#0a0a0f] to-[#0a0a0f] -z-10" />

      {/* Players Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-serif">Players ({players.length})</h2>
          {players.length < 5 && (
            <span className="text-xs text-accent-red">Requires {5 - players.length} more</span>
          )}
        </div>

        <form onSubmit={handleAddPlayer} className="flex gap-2">
          <Input 
            value={newPlayerName} 
            onChange={e => setNewPlayerName(e.target.value)} 
            placeholder="Enter player name..." 
            maxLength={15}
          />
          <Button type="submit" size="icon" disabled={!newPlayerName.trim()} className="shrink-0 bg-neutral-800 text-white">
            <UserPlus size={18} />
          </Button>
        </form>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          <AnimatePresence>
            {players.map(player => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 rounded-lg glass"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs border border-neutral-700">
                    {player.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-medium text-sm">{player.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removePlayer(player.id)} className="h-8 w-8 text-neutral-400 hover:text-accent-red">
                  <UserMinus size={16} />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Roles Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-serif">Roles ({totalRoles}/{players.length})</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAutoBalance} 
            disabled={players.length < 5}
            className="text-xs h-8"
          >
            <Wand2 size={14} className="mr-2" /> Auto-Balance
          </Button>
        </div>

        <div className="grid gap-3">
          {Object.values(ROLES).map(role => {
            const count = roleConfig[role.id] || 0;
            return (
              <div key={role.id} className="flex items-center justify-between p-3 rounded-lg glass">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${role.color}`}>
                    {role.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm flex items-center gap-2">
                      {role.name}
                      {role.team === 'mafia' && <ShieldAlert size={12} className="text-accent-red" />}
                      {role.team === 'town' && <Users size={12} className="text-accent-blue" />}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-neutral-900 rounded-lg p-1 border border-neutral-800">
                  <button 
                    onClick={() => handleRoleCountChange(role.id, -1)}
                    disabled={count === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-800 disabled:opacity-30 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-4 text-center text-sm font-medium">{count}</span>
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
      </section>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent max-w-md mx-auto">
        <Button 
          onClick={handleStartGame} 
          disabled={!isValid}
          className="w-full h-14 text-lg font-bold bg-accent-red hover:bg-red-700 text-white"
        >
          {isValid ? 'Assign Roles & Start' : 'Check Requirements'}
        </Button>
        
        {!isValid && players.length >= 5 && (
           <p className="text-xs text-center text-accent-red mt-2">
             Total roles ({totalRoles}) must match players ({players.length}). Min 1 Mafia.
           </p>
        )}
      </div>
    </div>
  );
}
