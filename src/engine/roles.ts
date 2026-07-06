import { Role } from '../types';

export const ROLES: Record<string, Role> = {
  villager: {
    id: 'villager',
    name: 'Villager',
    team: 'town',
    description: 'A regular citizen of the town.',
    abilityDescription: 'You have no special abilities at night. Use the day to find the Mafia.',
    nightAction: false,
    icon: '🧑‍🌾',
    color: 'bg-accent-blue',
  },
  mafia: {
    id: 'mafia',
    name: 'Mafia',
    team: 'mafia',
    description: 'A member of the organized crime syndicate.',
    abilityDescription: 'Choose a player to eliminate during the night phase.',
    nightAction: true,
    priority: 1,
    icon: '🔪',
    color: 'bg-accent-red',
  },
  doctor: {
    id: 'doctor',
    name: 'Doctor',
    team: 'town',
    description: 'A medical professional who can save lives.',
    abilityDescription: 'Choose a player to protect from the Mafia each night.',
    nightAction: true,
    priority: 2,
    icon: '💉',
    color: 'bg-emerald-600',
  },
  detective: {
    id: 'detective',
    name: 'Detective',
    team: 'town',
    description: 'An investigator seeking the truth.',
    abilityDescription: 'Investigate one player per night to learn if they are Town or Mafia.',
    nightAction: true,
    priority: 3,
    icon: '🔍',
    color: 'bg-indigo-600',
  }
};
