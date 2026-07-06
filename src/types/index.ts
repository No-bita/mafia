export type Team = 'town' | 'mafia';
export type Phase = 'setup' | 'reveal' | 'night' | 'day-result' | 'day-discussion' | 'voting' | 'game-over';

export interface Role {
  id: string;
  name: string;
  team: Team;
  description: string;
  abilityDescription: string;
  nightAction: boolean;
  priority?: number;
  icon: string;
  color: string;
}

export interface Player {
  id: string;
  name: string;
  avatarSeed: string;
  roleId?: string;
  isAlive: boolean;
}

export interface RoleConfig {
  [roleId: string]: number;
}

export interface NightActions {
  mafiaKillTargetId: string | null;
  doctorSaveTargetId: string | null;
  detectiveInvestigateTargetId: string | null;
}

export interface NightResult {
  killedPlayerId: string | null;
  investigatedPlayer: { id: string; team: Team } | null;
}

export interface GameEvent {
  id: string;
  type: 'eliminated' | 'saved' | 'investigated' | 'game-over';
  text: string;
  timestamp: number;
}
