export type Team = 'town' | 'mafia';
export type Phase = 'setup' | 'reveal' | 'assigned';

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
