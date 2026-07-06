import { create } from 'zustand';
import { Phase, Player, RoleConfig } from '../types';
import { assignRoles } from '../engine/assignment';

interface GameState {
  // Setup
  players: Player[];
  roleConfig: RoleConfig;
  
  // Game state
  phase: Phase;
  currentRevealIndex: number;

  // Actions
  addPlayer: (name: string, avatarSeed: string) => void;
  removePlayer: (id: string) => void;
  setRoleConfig: (config: RoleConfig) => void;
  startReveal: () => void;
  advanceReveal: () => void;
  resetGame: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useGameStore = create<GameState>((set, get) => ({
  players: [],
  roleConfig: {},
  phase: 'setup',
  currentRevealIndex: 0,

  addPlayer: (name, avatarSeed) => set((state) => ({
    players: [...state.players, { id: generateId(), name, avatarSeed, isAlive: true }]
  })),

  removePlayer: (id) => set((state) => ({
    players: state.players.filter(p => p.id !== id)
  })),

  setRoleConfig: (config) => set({ roleConfig: config }),

  startReveal: () => {
    const { players, roleConfig } = get();
    try {
      const assignedPlayers = assignRoles(players, roleConfig);
      set({ 
        players: assignedPlayers,
        phase: 'reveal',
        currentRevealIndex: 0
      });
    } catch (e) {
      console.error(e);
    }
  },

  advanceReveal: () => {
    const { currentRevealIndex, players } = get();
    if (currentRevealIndex < players.length - 1) {
      set({ currentRevealIndex: currentRevealIndex + 1 });
    } else {
      set({ phase: 'assigned' as Phase });
    }
  },

  resetGame: () => {
    set({
      phase: 'setup',
      players: [],
      roleConfig: {},
      currentRevealIndex: 0,
    });
  }
}));
