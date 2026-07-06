import { create } from 'zustand';
import { GameEvent, NightActions, NightResult, Phase, Player, RoleConfig, Team } from '../types';
import { assignRoles } from '../engine/assignment';
import { resolveNight } from '../engine/resolver';
import { checkWinCondition } from '../engine/win-condition';

interface GameState {
  // Setup
  players: Player[];
  roleConfig: RoleConfig;
  
  // Game state
  phase: Phase;
  round: number;
  currentRevealIndex: number;
  nightActions: NightActions;
  events: GameEvent[];
  winner: Team | null;
  dayResultText: string | null;

  // Actions
  addPlayer: (name: string, avatarSeed: string) => void;
  removePlayer: (id: string) => void;
  setRoleConfig: (config: RoleConfig) => void;
  startReveal: () => void;
  advanceReveal: () => void;
  
  // Gameplay actions
  submitNightAction: (role: 'mafia' | 'doctor' | 'detective', targetId: string) => void;
  resolveNightPhase: () => void;
  eliminatePlayer: (id: string) => void;
  skipElimination: () => void;
  startNight: () => void;
  resetGame: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useGameStore = create<GameState>((set, get) => ({
  players: [],
  roleConfig: {},
  phase: 'setup',
  round: 1,
  currentRevealIndex: 0,
  nightActions: {
    mafiaKillTargetId: null,
    doctorSaveTargetId: null,
    detectiveInvestigateTargetId: null,
  },
  events: [],
  winner: null,
  dayResultText: null,

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
      // Handle error gracefully in UI
    }
  },

  advanceReveal: () => {
    const { currentRevealIndex, players } = get();
    if (currentRevealIndex < players.length - 1) {
      set({ currentRevealIndex: currentRevealIndex + 1 });
    } else {
      set({ phase: 'night', round: 1 });
    }
  },

  submitNightAction: (role, targetId) => {
    set((state) => {
      const newActions = { ...state.nightActions };
      if (role === 'mafia') newActions.mafiaKillTargetId = targetId;
      if (role === 'doctor') newActions.doctorSaveTargetId = targetId;
      if (role === 'detective') newActions.detectiveInvestigateTargetId = targetId;
      return { nightActions: newActions };
    });
  },

  resolveNightPhase: () => {
    const { nightActions, players, round } = get();
    const result = resolveNight(nightActions, players);
    
    let text = "Nobody died tonight.";
    
    set((state) => {
      const updatedPlayers = [...state.players];
      const newEvents = [...state.events];

      if (result.killedPlayerId) {
        const index = updatedPlayers.findIndex(p => p.id === result.killedPlayerId);
        if (index !== -1) {
          updatedPlayers[index] = { ...updatedPlayers[index], isAlive: false };
          text = `${updatedPlayers[index].name} was killed by the Mafia!`;
          newEvents.push({
            id: generateId(),
            type: 'eliminated',
            text,
            timestamp: Date.now()
          });
        }
      }

      if (result.investigatedPlayer) {
        newEvents.push({
          id: generateId(),
          type: 'investigated',
          text: `Detective found out that a player is on the ${result.investigatedPlayer.team} team.`,
          timestamp: Date.now()
        });
      }

      const winner = checkWinCondition(updatedPlayers);
      
      return {
        players: updatedPlayers,
        events: newEvents,
        phase: winner ? 'game-over' : 'day-result',
        winner,
        dayResultText: text,
        nightActions: {
          mafiaKillTargetId: null,
          doctorSaveTargetId: null,
          detectiveInvestigateTargetId: null,
        }
      };
    });
  },

  eliminatePlayer: (id) => {
    set((state) => {
      const updatedPlayers = state.players.map(p => 
        p.id === id ? { ...p, isAlive: false } : p
      );
      
      const target = updatedPlayers.find(p => p.id === id);
      const text = `${target?.name} was voted out by the town.`;

      const newEvents = [...state.events, {
        id: generateId(),
        type: 'eliminated',
        text,
        timestamp: Date.now()
      }];

      const winner = checkWinCondition(updatedPlayers);

      return {
        players: updatedPlayers,
        events: newEvents,
        phase: winner ? 'game-over' : 'night',
        winner,
        round: state.round + 1,
      };
    });
  },

  skipElimination: () => {
    set((state) => ({
      phase: 'night',
      round: state.round + 1,
      events: [...state.events, {
        id: generateId(),
        type: 'saved',
        text: 'The town decided not to vote anyone out.',
        timestamp: Date.now()
      }]
    }));
  },

  startNight: () => {
    set({ phase: 'night' });
  },

  resetGame: () => {
    set({
      phase: 'setup',
      round: 1,
      currentRevealIndex: 0,
      nightActions: {
        mafiaKillTargetId: null,
        doctorSaveTargetId: null,
        detectiveInvestigateTargetId: null,
      },
      events: [],
      winner: null,
      dayResultText: null,
    });
  }
}));
